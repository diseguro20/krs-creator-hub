import { NextRequest, NextResponse } from "next/server";
import { recordServerConversion, resolveLeadGateway } from "@/lib/server-store";
import { saveCreatorToFirebase } from "@/lib/firebase";

// Standard secret key (can also be loaded from process.env.KRS_WEBHOOK_SECRET)
const KRS_MASTER_SECRET = process.env.KRS_WEBHOOK_SECRET || "krs_sec_live_99f821a084c7e481b3";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-krs-secret") || req.headers.get("authorization");
    
    // Validate secret token if provided
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "").trim();
      if (token !== KRS_MASTER_SECRET) {
        return NextResponse.json(
          {
            success: false,
            error: "UNAUTHORIZED",
            message: "Chave secreta de autenticação inválida (x-krs-secret).",
          },
          { status: 401 }
        );
      }
    }

    const body = await req.json();
    const {
      game_slug,
      game_name,
      affiliate_code,
      event_type = "deposit", // 'signup' | 'deposit' | 'tournament' | 'slot_revenue'
      amount_deposited = 0,
      commission_amount,
      player_name = "Jogador Anônimo",
      player_id,
      player_email,
      transaction_id,
      gateway,
      payment_gateway,
    } = body;

    if (!affiliate_code) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_AFFILIATE_CODE",
          message: "O campo 'affiliate_code' é obrigatório para registrar a comissão.",
        },
        { status: 400 }
      );
    }

    // Identifica com rigor o gateway do lead (Vizzion Pay vs Omega Pay)
    const assignedGateway = resolveLeadGateway({
      game_slug,
      player_id,
      player_email: player_email || body.email,
      player_name,
      explicit_gateway: gateway || payment_gateway,
    });

    // Calculate default commission if not explicitly sent
    let finalCommission = commission_amount;
    if (typeof finalCommission !== "number" || isNaN(finalCommission)) {
      if (event_type === "deposit") {
        // Default rule: 20% revshare or R$ 10 CPA
        finalCommission = Math.max(10, Number(amount_deposited) * 0.2);
      } else if (event_type === "signup") {
        finalCommission = 2.0; // R$ 2 por cadastro qualificado
      } else {
        finalCommission = 5.0;
      }
    }

    const conversionRecord: any = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      game_slug: game_slug || "game-krs",
      game_name: game_name || "Jogo Oficial KRS",
      affiliate_code: String(affiliate_code).toLowerCase().trim(),
      event_type,
      player_name,
      player_id: player_id || `usr_${Date.now().toString().slice(-5)}`,
      player_email: player_email || body.email,
      amount_deposited: Number(amount_deposited),
      commission_amount: Number(finalCommission.toFixed(2)),
      transaction_id: transaction_id || `tx_${Math.random().toString(36).substring(2, 9)}`,
      payment_gateway: assignedGateway,
      status: "available_for_pix_withdrawal",
      received_at: new Date().toISOString(),
    };

    // Save to persistent server store
    const updatedBalance = recordServerConversion(conversionRecord);

    console.log(
      `[AUDITORIA CONVERSÃO] Afiliado: ${conversionRecord.affiliate_code} | Jogo: ${conversionRecord.game_slug} | Lead: ${conversionRecord.player_id} | Gateway Vinculado: ${assignedGateway}`
    );

    // Sync to cloud Firebase if configured
    try {
      await saveCreatorToFirebase(conversionRecord.affiliate_code, {
        latest_conversion: conversionRecord,
        available_balance: updatedBalance.available_balance,
        total_leads: updatedBalance.total_leads,
      });
    } catch (e) {
      // Non-blocking fallback
    }

    return NextResponse.json(
      {
        success: true,
        message: `Comissão de R$ ${finalCommission.toFixed(2)} creditada com sucesso para o afiliado '${affiliate_code}'!`,
        data: conversionRecord,
        updated_balance: updatedBalance,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: err.message || "Erro interno ao processar webhook.",
      },
      { status: 500 }
    );
  }
}
