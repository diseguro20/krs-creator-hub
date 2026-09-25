import { NextRequest, NextResponse } from "next/server";
import {
  getServerAffiliateBalance,
  getServerConversions,
  reconcileExternalGameStats,
  checkTagAuthorization,
  createDefaultBalance,
} from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "afiliado").toLowerCase().trim();
  const creatorId = searchParams.get("creator_id") || undefined;
  const creatorEmail = searchParams.get("creator_email") || undefined;

  // Verificação rigorosa de autorização de titularidade da tag
  const auth = checkTagAuthorization({
    tag: code,
    creator_id: creatorId,
    creator_email: creatorEmail,
  });

  if (!auth.is_authorized) {
    return NextResponse.json(
      {
        success: true,
        affiliate_code: code,
        authorized: false,
        auth_status: auth.status,
        message:
          auth.status === "pending"
            ? "Solicitação de vinculação em análise pelo administrador. Aguarde a aprovação para liberar os dados e saques desta tag."
            : auth.status === "rejected"
            ? `Solicitação rejeitada pelo administrador. Motivo: ${auth.request?.rejection_reason || "Titularidade não comprovada."}`
            : "Esta tag precisa ser autorizada pelo administrador para liberar o acesso aos dados e comissões da plataforma.",
        request: auth.request || null,
        server_balance: createDefaultBalance(code),
        conversions: [],
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  }

  // 1. Reconciliação automática em tempo real com as plataformas (Fruit Cash, etc.) para tags autorizadas
  const serverBalance = await reconcileExternalGameStats(code);
  const serverConversions = getServerConversions(code);

  return NextResponse.json(
    {
      success: true,
      affiliate_code: code,
      authorized: true,
      auth_status: "approved",
      server_balance: serverBalance,
      conversions: serverConversions,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    }
  );
}
