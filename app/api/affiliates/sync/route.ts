import { NextRequest, NextResponse } from "next/server";
import { getServerAffiliateBalance, getServerConversions, reconcileExternalGameStats } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "afiliado").toLowerCase().trim();

  // 1. Reconciliação automática em tempo real com as plataformas (Fruit Cash, etc.)
  const serverBalance = await reconcileExternalGameStats(code);
  const serverConversions = getServerConversions(code);

  return NextResponse.json(
    {
      success: true,
      affiliate_code: code,
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
