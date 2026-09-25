import { NextRequest, NextResponse } from "next/server";
import { checkTagAuthorization } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = (searchParams.get("tag") || "").toLowerCase().trim();
  const creatorId = searchParams.get("creator_id") || undefined;
  const creatorEmail = searchParams.get("creator_email") || undefined;

  const result = checkTagAuthorization({
    tag,
    creator_id: creatorId,
    creator_email: creatorEmail,
  });

  return NextResponse.json(
    {
      success: true,
      tag,
      is_authorized: result.is_authorized,
      status: result.status,
      request: result.request || null,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    }
  );
}
