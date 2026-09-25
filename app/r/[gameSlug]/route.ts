import { NextRequest, NextResponse } from "next/server";
import { recordServerClick } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GAME_DESTINATIONS: Record<
  string,
  { baseUrl: string; param: string; defaultSlug: string }
> = {
  "fruit-cash": {
    baseUrl: "https://fruitcash-fun.vercel.app/",
    param: "ref",
    defaultSlug: "fruit-cash",
  },
  "krs-777": {
    baseUrl: "https://krs777.online/",
    param: "r",
    defaultSlug: "krs-777",
  },
  "blockerino": {
    baseUrl: "https://blockerino-play.vercel.app/",
    param: "r",
    defaultSlug: "blockerino",
  },
  "bubbles-cash": {
    baseUrl: "https://bubblecash-platform.vercel.app/",
    param: "ref",
    defaultSlug: "bubbles-cash",
  },
  "bubble-cash": {
    baseUrl: "https://bubblecash-platform.vercel.app/",
    param: "ref",
    defaultSlug: "bubbles-cash",
  },
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ gameSlug: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const rawGameSlug = (resolvedParams?.gameSlug || "fruit-cash").toLowerCase().trim();

    // Find destination config
    let configKey = Object.keys(GAME_DESTINATIONS).find(
      (k) => k === rawGameSlug || rawGameSlug.includes(k) || k.includes(rawGameSlug)
    );

    if (!configKey) {
      if (rawGameSlug.includes("fruit")) configKey = "fruit-cash";
      else if (rawGameSlug.includes("777")) configKey = "krs-777";
      else if (rawGameSlug.includes("block")) configKey = "blockerino";
      else if (rawGameSlug.includes("bubble")) configKey = "bubbles-cash";
      else configKey = "fruit-cash";
    }

    const config = GAME_DESTINATIONS[configKey] || GAME_DESTINATIONS["fruit-cash"];

    // Extract query parameters
    const url = new URL(req.url);
    const affiliateCode = (
      url.searchParams.get("ref") ||
      url.searchParams.get("r") ||
      url.searchParams.get("code") ||
      url.searchParams.get("afiliado") ||
      "afiliado"
    ).trim();

    // 1. Instant Real-Time Click Recording in Server Store
    const updatedBalance = recordServerClick(affiliateCode, config.defaultSlug);

    console.log(
      `[TRACKER CLIQUE EM TEMPO REAL] Afiliado: '${affiliateCode}' | Jogo: '${config.defaultSlug}' | Total Cliques Afiliado: ${updatedBalance.total_clicks} | Cliques no Jogo: ${updatedBalance.games_breakdown[config.defaultSlug]?.clicks}`
    );

    // 2. Build Destination URL
    const targetUrl = new URL(config.baseUrl);
    targetUrl.searchParams.set(config.param, affiliateCode);

    // Forward any other tracking parameters (e.g. utm_source, src, subid)
    url.searchParams.forEach((val, key) => {
      if (!["ref", "r", "code", "afiliado"].includes(key.toLowerCase())) {
        targetUrl.searchParams.set(key, val);
      }
    });

    const destination = targetUrl.toString();

    // 3. Issue Immediate HTTP 307 Temporary Redirect (no cache)
    const response = NextResponse.redirect(destination, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response;
  } catch (err: any) {
    console.error("[TRACKER CLIQUE] Erro no redirecionamento:", err);
    // Fallback direct to fruitcash
    return NextResponse.redirect("https://fruitcash-fun.vercel.app/", { status: 307 });
  }
}
