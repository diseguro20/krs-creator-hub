import { NextRequest, NextResponse } from "next/server";
import { requestTagAuthorization, checkTagAuthorization } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tag,
      platform = "Fruit Cash",
      proof_url = "",
      notes = "",
      creator_id = "user-creator-1",
      creator_name = "Criador KRS",
      creator_email = "creator@krscreatorhub.com",
    } = body;

    const cleanTag = String(tag || "").toLowerCase().trim().replace(/[^a-z0-9_.-]/g, "");

    if (!cleanTag) {
      return NextResponse.json(
        { success: false, message: "Informe a tag que deseja vincular." },
        { status: 400 }
      );
    }

    // Check if already approved
    const current = checkTagAuthorization({ tag: cleanTag, creator_id, creator_email });
    if (current.is_authorized) {
      return NextResponse.json({
        success: true,
        already_approved: true,
        message: "Esta tag já está autorizada para uso!",
        request: current.request,
      });
    }

    const created = requestTagAuthorization({
      creator_id,
      creator_name,
      creator_email,
      tag: cleanTag,
      platform,
      proof_url,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Solicitação de vinculação enviada ao administrador com sucesso!",
      request: created,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Erro ao processar solicitação de tag." },
      { status: 500 }
    );
  }
}
