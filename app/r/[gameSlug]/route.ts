import { NextRequest, NextResponse } from "next/server";
import { recordServerClick } from "@/lib/server-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface GameConfig {
  baseUrl: string;
  param: string;
  defaultSlug: string;
  title: string;
  description: string;
  ogImage: string;
}

const GAME_DESTINATIONS: Record<string, GameConfig> = {
  "salto-cash": {
    baseUrl: "https://saltocash-platform.vercel.app/",
    param: "ref",
    defaultSlug: "salto-cash",
    title: "Salto Cash - Gire e Ganhe no PIX | Helix Jump Oficial",
    description: "Jogue o autêntico Helix Jump valendo dinheiro real! Gire a torre, desvie dos obstáculos e multiplique sua aposta com saques imediatos via PIX.",
    ogImage: "https://saltocash-platform.vercel.app/og-image.jpg",
  },
  "saltocash": {
    baseUrl: "https://saltocash-platform.vercel.app/",
    param: "ref",
    defaultSlug: "salto-cash",
    title: "Salto Cash - Gire e Ganhe no PIX | Helix Jump Oficial",
    description: "Jogue o autêntico Helix Jump valendo dinheiro real! Gire a torre, desvie dos obstáculos e multiplique sua aposta com saques imediatos via PIX.",
    ogImage: "https://saltocash-platform.vercel.app/og-image.jpg",
  },
  "fruit-cash": {
    baseUrl: "https://fruitcash-fun.vercel.app/",
    param: "ref",
    defaultSlug: "fruit-cash",
    title: "Fruit Cash - Corte e Ganhe no PIX | Jogo Oficial",
    description: "Corte as frutas e multiplique seu saldo com saques rápidos via PIX no Fruit Cash Oficial!",
    ogImage: "https://krs-creator-hub.vercel.app/og-image.jpg",
  },
  "krs-777": {
    baseUrl: "https://krs777.online/",
    param: "r",
    defaultSlug: "krs-777",
    title: "KRS 777 - A Melhor Plataforma de Slots e Cassino",
    description: "Jogue slots exclusivos, aproveite bônus diários e saque seus lucros via PIX!",
    ogImage: "https://krs-creator-hub.vercel.app/og-image.jpg",
  },
  "blockerino": {
    baseUrl: "https://blockerino-play.vercel.app/",
    param: "r",
    defaultSlug: "blockerino",
    title: "Blockerino - Encaixe e Ganhe no PIX | Jogo dos Blocos",
    description: "Encaixe os blocos, quebre recordes e ganhe dinheiro de verdade com saque instantâneo via PIX!",
    ogImage: "https://krs-creator-hub.vercel.app/og-image.jpg",
  },
  "bubbles-cash": {
    baseUrl: "https://bubblecash-platform.vercel.app/",
    param: "ref",
    defaultSlug: "bubbles-cash",
    title: "Bubbles Cash - Estoure as Bolhas e Ganhe no PIX",
    description: "Estoure bolhas da mesma cor, acumule pontuação e faça saques via PIX em segundos!",
    ogImage: "https://krs-creator-hub.vercel.app/og-image.jpg",
  },
  "bubble-cash": {
    baseUrl: "https://bubblecash-platform.vercel.app/",
    param: "ref",
    defaultSlug: "bubbles-cash",
    title: "Bubbles Cash - Estoure as Bolhas e Ganhe no PIX",
    description: "Estoure bolhas da mesma cor, acumule pontuação e faça saques via PIX em segundos!",
    ogImage: "https://krs-creator-hub.vercel.app/og-image.jpg",
  },
};

const CRAWLER_USER_AGENTS = [
  /whatsapp/i,
  /facebookexternalhit/i,
  /facebot/i,
  /twitterbot/i,
  /telegrambot/i,
  /slackbot/i,
  /linkedinbot/i,
  /discordbot/i,
  /pinterest/i,
  /googlebot/i,
  /bingbot/i,
  /applebot/i,
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return CRAWLER_USER_AGENTS.some((regex) => regex.test(userAgent));
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCrawlerPreview(
  title: string,
  description: string,
  imageUrl: string,
  destination: string,
  canonicalUrl: string
): string {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImg = escapeHtml(imageUrl);
  const safeDest = escapeHtml(destination);
  const safeCanonical = escapeHtml(canonicalUrl);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta name="title" content="${safeTitle}">
  <meta name="description" content="${safeDesc}">
  <link rel="canonical" href="${safeCanonical}">

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${safeCanonical}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImg}">
  <meta property="og:image:secure_url" content="${safeImg}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="KRS Creator Hub">
  <meta property="og:locale" content="pt_BR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${safeCanonical}">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImg}">

  <!-- Automatic crawler / browser fallback redirect -->
  <meta http-equiv="refresh" content="0;url=${safeDest}">
  <script>
    window.location.replace("${safeDest}");
  </script>
  <style>
    body {
      margin: 0; padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #06090e; color: #fff;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; text-align: center;
    }
    .box {
      max-width: 480px; padding: 32px 24px;
      background: rgba(255,255,255,0.05); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
    }
    a { color: #f43f5e; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="box">
    <h2>${safeTitle}</h2>
    <p>${safeDesc}</p>
    <p>Redirecionando para a plataforma... <a href="${safeDest}">Clique aqui</a> se não for redirecionado.</p>
  </div>
</body>
</html>`;
}

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
      if (rawGameSlug.includes("salto")) configKey = "salto-cash";
      else if (rawGameSlug.includes("fruit")) configKey = "fruit-cash";
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

    // Build Destination URL
    const targetUrl = new URL(config.baseUrl);
    targetUrl.searchParams.set(config.param, affiliateCode);

    // Forward any other tracking parameters (e.g. utm_source, src, subid)
    url.searchParams.forEach((val, key) => {
      if (!["ref", "r", "code", "afiliado"].includes(key.toLowerCase())) {
        targetUrl.searchParams.set(key, val);
      }
    });

    const destination = targetUrl.toString();
    const userAgent = req.headers.get("user-agent") || "";

    // 1. Social Crawler Interception (WhatsApp, Telegram, Facebook, Twitter, etc.)
    // Crawlers need HTTP 200 with complete OpenGraph HTML metadata to render thumbnail preview cards.
    if (isCrawler(userAgent)) {
      console.log(`[CRAWLER DETECTADO] UA: '${userAgent}' | Jogo: '${config.defaultSlug}' | Retornando preview com OG tags`);
      const previewHtml = renderCrawlerPreview(
        config.title,
        config.description,
        config.ogImage,
        destination,
        req.url
      );

      return new NextResponse(previewHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Vary": "User-Agent",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    // 2. Real Human Visitor: Record Click in Real-Time Server Store
    const updatedBalance = recordServerClick(affiliateCode, config.defaultSlug);

    console.log(
      `[TRACKER CLIQUE EM TEMPO REAL] Afiliado: '${affiliateCode}' | Jogo: '${config.defaultSlug}' | Total Cliques: ${updatedBalance.total_clicks} | Cliques no Jogo: ${updatedBalance.games_breakdown[config.defaultSlug]?.clicks}`
    );

    // 3. Issue Immediate HTTP 307 Temporary Redirect (no cache)
    const response = NextResponse.redirect(destination, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Vary": "User-Agent",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response;
  } catch (err: any) {
    console.error("[TRACKER CLIQUE] Erro no redirecionamento:", err);
    return NextResponse.redirect("https://fruitcash-fun.vercel.app/", { status: 307 });
  }
}
