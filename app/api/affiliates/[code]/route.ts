import { NextRequest, NextResponse } from "next/server";
import { SIMULATED_AFFILIATE_INFLUENCERS } from "@/lib/affiliate-leaderboard-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cleanCode = (code || "").toLowerCase().trim();

  // Search in influencers or generic creator profile
  const foundInfluencer = SIMULATED_AFFILIATE_INFLUENCERS.find(
    (inf) =>
      inf.username.toLowerCase() === cleanCode ||
      inf.stageName.toLowerCase().replace(/\s+/g, "") === cleanCode
  );

  if (foundInfluencer) {
    return NextResponse.json({
      valid: true,
      affiliate_code: cleanCode,
      affiliate_name: foundInfluencer.stageName,
      username: foundInfluencer.username,
      verified: foundInfluencer.verified,
      custom_commission_rate: foundInfluencer.conversionRate,
      status: "active",
    });
  }

  // Any custom code is accepted and attributed dynamically
  return NextResponse.json({
    valid: true,
    affiliate_code: cleanCode,
    affiliate_name: `Afiliado ${cleanCode}`,
    username: cleanCode,
    verified: false,
    status: "active",
  });
}
