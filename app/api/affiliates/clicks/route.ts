import { NextRequest, NextResponse } from "next/server";
import { recordServerClick, getServerAffiliateBalance } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const affiliateCode = (body.affiliate_code || body.code || body.ref || "afiliado").trim();
    const gameSlug = (body.game_slug || body.slug || "fruit-cash").trim();

    const balance = recordServerClick(affiliateCode, gameSlug);

    return NextResponse.json({
      success: true,
      message: `Clique registrado em tempo real para o afiliado '${affiliateCode}' no jogo '${gameSlug}'`,
      server_balance: balance,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Erro ao registrar clique." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const affiliateCode = (searchParams.get("code") || searchParams.get("ref") || "afiliado").trim();
  const gameSlug = (searchParams.get("game") || searchParams.get("slug") || "fruit-cash").trim();

  const balance = recordServerClick(affiliateCode, gameSlug);

  return NextResponse.json({
    success: true,
    message: `Clique registrado via GET para '${affiliateCode}'`,
    server_balance: balance,
    timestamp: new Date().toISOString(),
  });
}
