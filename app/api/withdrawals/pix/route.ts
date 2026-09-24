import { NextRequest, NextResponse } from "next/server";
import { sendVizzionPixCashout } from "@/lib/payments/vizzionpay";
import { sendOmegaPixCashout } from "@/lib/payments/omegapay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      pix_key,
      pix_key_type = "cpf", // 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
      affiliate_code = "afiliado",
      game_id = "all", // 'all' for consolidated balance or specific game
      provider, // 'vizzionpay' | 'omegapay' | 'auto'
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

    // Provedor selecionado ou configurado
    const configuredProvider = provider || process.env.PIX_GATEWAY_PROVIDER || "auto";

    let result;

    if (configuredProvider === "omegapay") {
      result = await sendOmegaPixCashout({
        amount: numAmount,
        pixKey: pix_key,
        pixKeyType: pix_key_type,
        affiliateCode: affiliate_code,
      });
    } else if (configuredProvider === "vizzionpay") {
      result = await sendVizzionPixCashout({
        amount: numAmount,
        pixKey: pix_key,
        pixKeyType: pix_key_type,
        affiliateCode: affiliate_code,
      });
    } else {
      // Modo "auto": se o saque tiver origem prioritária de blockerino/bubblecash,
      // tenta Omega Pay primeiro; senão Vizzion Pay com failover automático.
      const isOmegaGame = game_id === "blockerino" || game_id === "bubblecash" || game_id === "bubbles-cash";

      if (isOmegaGame) {
        result = await sendOmegaPixCashout({
          amount: numAmount,
          pixKey: pix_key,
          pixKeyType: pix_key_type,
          affiliateCode: affiliate_code,
        });

        // Failover para Vizzion se Omega falhar
        if (!result.success) {
          result = await sendVizzionPixCashout({
            amount: numAmount,
            pixKey: pix_key,
            pixKeyType: pix_key_type,
            affiliateCode: affiliate_code,
          });
        }
      } else {
        result = await sendVizzionPixCashout({
          amount: numAmount,
          pixKey: pix_key,
          pixKeyType: pix_key_type,
          affiliateCode: affiliate_code,
        });

        // Failover para Omega se Vizzion falhar
        if (!result.success) {
          result = await sendOmegaPixCashout({
            amount: numAmount,
            pixKey: pix_key,
            pixKeyType: pix_key_type,
            affiliateCode: affiliate_code,
          });
        }
      }
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "PIX_GATEWAY_ERROR",
          message: (result as any).error || "Os gateways PIX (Vizzion Pay / Omega Pay) recusaram a transação. Verifique sua chave PIX.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Saque unificado de R$ ${numAmount.toFixed(2)} processado com sucesso via PIX (${result.provider})!`,
      data: {
        txId: result.txId,
        endToEndId: result.endToEndId,
        amount: numAmount,
        pix_key,
        pix_key_type,
        game_origin: game_id === "all" ? "Saldo Consolidado (Todos os 4 Jogos)" : game_id,
        affiliate_code,
        status: result.status,
        provider: result.provider,
        mode: result.mode,
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
