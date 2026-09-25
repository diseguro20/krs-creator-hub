import { NextRequest, NextResponse } from "next/server";
import { getTagAuthorizations } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;
    const creatorId = searchParams.get("creator_id") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const list = getTagAuthorizations({
      status: status || undefined,
      creator_id: creatorId,
      tag,
    });

    const pendingCount = getTagAuthorizations({ status: "pending" }).length;
    const approvedCount = getTagAuthorizations({ status: "approved" }).length;
    const rejectedCount = getTagAuthorizations({ status: "rejected" }).length;

    return NextResponse.json(
      {
        success: true,
        total: list.length,
        pending_count: pendingCount,
        approved_count: approvedCount,
        rejected_count: rejectedCount,
        requests: list,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Erro ao consultar autorizações." },
      { status: 500 }
    );
  }
}
