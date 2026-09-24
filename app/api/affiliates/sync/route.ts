import { NextRequest, NextResponse } from "next/server";
import { getServerAffiliateBalance, getServerConversions } from "@/lib/server-store";
import { fetchCreatorFromFirebase } from "@/lib/firebase";

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

  return NextResponse.json({
    success: true,
    affiliate_code: code,
    server_balance: serverBalance,
    conversions: serverConversions,
    cloud_synced: !!firebaseData,
    timestamp: new Date().toISOString(),
  });
}
