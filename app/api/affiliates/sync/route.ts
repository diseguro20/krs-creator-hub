import { NextRequest, NextResponse } from "next/server";
import { getServerAffiliateBalance, getServerConversions } from "@/lib/server-store";
import { fetchCreatorFromFirebase } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "afiliado").toLowerCase().trim();

  // 1. Get from server in-memory store
  const serverBalance = getServerAffiliateBalance(code);
  const serverConversions = getServerConversions(code);

  // 2. Try fetching cloud Firebase if available
  let firebaseData = null;
  try {
    firebaseData = await fetchCreatorFromFirebase(code);
  } catch (e) {
    // Non-blocking fallback
  }

  return NextResponse.json(
    {
      success: true,
      affiliate_code: code,
      server_balance: serverBalance,
      conversions: serverConversions,
      cloud_synced: !!firebaseData,
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
