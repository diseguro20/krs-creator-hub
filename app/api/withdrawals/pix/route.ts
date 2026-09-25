import { NextRequest, NextResponse } from "next/server";
import { sendVizzionPixCashout } from "@/lib/payments/vizzionpay";
import { sendOmegaPixCashout } from "@/lib/payments/omegapay";
import {
  determineAffiliatePayoutGateway,
  deductServerAffiliateBalance,
  checkTagAuthorization,
} from "@/lib/server-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      pix_key,
      pix_key_type = "cpf", // 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
      affiliate_code = "afiliado",
      game_id = "all", // 'all' for consolidated balance or specific game
      recent_leads = [],
      creator_id,
      creator_email,
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_AMOUNT",
          message: "O valor de saque solicitado deve ser maior que zero.",
        },
        { status: 400 }
      );
    }

    if (!pix_key || String(pix_key).trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_PIX_KEY",
          message: "A chave PIX do beneficiário é obrigatória para a transferência.",
        },
        { status: 400 }
      );
    }

    // Trava de segurança financeira: somente tags aprovadas pelo Admin podem realizar saques
    const authCheck = checkTagAuthorization({
      tag: affiliate_code,
      creator_id,
      creator_email,
    });

    if (!authCheck.is_authorized) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED_TAG",
          message:
            "Saque bloqueado por segurança: esta tag de afiliado precisa ser autorizada pelo administrador antes de realizar saques. Solicite a aprovação de titularidade no painel.",
        },
        { status: 403 }
      );
    }

    // Regra estrita de roteamento solicitada pelo usuário:
    // "só pode sacar no omega pay quem for afiliado vinculado por aquele meio de pagamento ali, se não somente saque na vizzion pay"
    // No Bubble Cash: apenas o jogador 9392 recebe na Vizzion; se o afiliado for lead dele -> Vizzion Pay; senão Omega Pay.
    // Fruit Cash & KRS 777: 100% Vizzion Pay.
    // Padrão geral de segurança: Vizzion Pay.
    const resolvedGateway = determineAffiliatePayoutGateway({
      affiliate_code,
      game_id,
      amount: numAmount,
      client_leads: recent_leads,
    });

    console.log(
      `[SAQUE PIX] Afiliado: ${affiliate_code} | Valor: R$ ${numAmount.toFixed(2)} | Origem: ${game_id} | Gateway Roteado: ${resolvedGateway.toUpperCase()}`
    );

    let result;

    if (resolvedGateway === "omegapay") {
      result = await sendOmegaPixCashout({
        amount: numAmount,
        pixKey: pix_key,
        pixKeyType: pix_key_type,
        affiliateCode: affiliate_code,
      });
    } else {
      // 100% Vizzion Pay
      result = await sendVizzionPixCashout({
        amount: numAmount,
        pixKey: pix_key,
        pixKeyType: pix_key_type,
        affiliateCode: affiliate_code,
      });
    }

    if (!result.success) {
      console.error(
        `[SAQUE PIX RECUSADO] Gateway ${resolvedGateway}:`,
        (result as any).error || "Falha na liquidação bancária"
      );

      // Nunca revelar o gateway ao cliente na mensagem de erro
      return NextResponse.json(
        {
          success: false,
          error: "PIX_GATEWAY_ERROR",
          message:
            "Não foi possível processar a transferência bancária PIX no momento. Verifique a chave informada ou contate o suporte.",
        },
        { status: 422 }
      );
    }

    // Atualiza e deduz o saldo no servidor
    deductServerAffiliateBalance(affiliate_code, numAmount, resolvedGateway);

    // Resposta 100% sigilosa para o cliente (sem qualquer menção a nomes de gateways)
    return NextResponse.json({
      success: true,
      message: `Saque de R$ ${numAmount.toFixed(2)} transferido com sucesso via PIX!`,
      data: {
        txId: result.txId,
        endToEndId: result.endToEndId,
        amount: numAmount,
        pix_key,
        pix_key_type,
        game_origin: game_id === "all" ? "Saldo Consolidado (Todos os 4 Jogos)" : game_id,
        affiliate_code,
        status: result.status,
        method: "Transferência Instantânea PIX",
        paid_at: result.paidAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: error?.message || "Erro interno ao processar transferência PIX.",
      },
      { status: 500 }
    );
  }
}
