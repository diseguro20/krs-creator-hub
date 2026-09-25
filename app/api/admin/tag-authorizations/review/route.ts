import { NextRequest, NextResponse } from "next/server";
import { reviewTagAuthorization, reconcileExternalGameStats } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, rejection_reason, reviewed_by = "Administrador KRS" } = body;

    if (!id || !status || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json(
        { success: false, message: "Parâmetros inválidos. É necessário id e status ('approved' ou 'rejected')." },
        { status: 400 }
      );
    }

    const reviewed = reviewTagAuthorization({
      id,
      status,
      reviewed_by,
      rejection_reason,
    });

    if (!reviewed) {
      return NextResponse.json(
        { success: false, message: "Solicitação não encontrada." },
        { status: 404 }
      );
    }

    // Se aprovado, dispara reconciliação automática imediata para que a tag já esteja populada!
    if (status === "approved") {
      try {
        await reconcileExternalGameStats(reviewed.tag);
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message:
        status === "approved"
          ? `Tag "${reviewed.tag}" autorizada com sucesso para ${reviewed.creator_name}!`
          : `Tag "${reviewed.tag}" rejeitada.`,
      request: reviewed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Erro ao processar revisão de tag." },
      { status: 500 }
    );
  }
}
