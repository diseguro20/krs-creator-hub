import fs from "fs";
import path from "path";

/**
 * Server-Side Persistent Store for Conversions, Balances and Clicks
 * Centraliza os dados recebidos via webhook e cliques de redirecionamento dos 4 jogos
 * (Fruit Cash, KRS 777, Blockerino, Bubble Cash)
 * Gerencia o roteamento estrito de gateways de saque (Vizzion Pay vs Omega Pay)
 */

export const BUBBLE_VIZZION_SPECIAL_PLAYER = "0ffdbf943073f6a183734d476c5ccbaa1b350307@login.bubblecash.app";
export const BUBBLE_VIZZION_SPECIAL_SUFFIX = "9392";

export interface StoredConversion {
  id: string;
  game_slug: string;
  game_name: string;
  affiliate_code: string;
  event_type: "deposit" | "signup" | "tournament";
  player_name: string;
  player_id: string;
  player_email?: string;
  amount_deposited: number;
  commission_amount: number;
  transaction_id: string;
  payment_gateway: "vizzionpay" | "omegapay";
  status: "available_for_pix_withdrawal" | "paid" | "processing";
  received_at: string;
}

export interface GameMetrics {
  clicks: number;
  signups: number;
  deposits_count: number;
  total_deposited: number;
  commission_earned: number;
  available_balance: number;
  gateway: "vizzionpay" | "omegapay";
}

export interface StoredAffiliateBalance {
  affiliate_code: string;
  total_withdrawn_pix: number;
  available_balance: number;
  omega_balance: number;
  vizzion_balance: number;
  total_leads: number;
  total_clicks: number;
  total_signups: number;
  games_breakdown: Record<string, GameMetrics>;
  updated_at: string;
}

// Global server memory cache (persists across API invocations in the Node process)
declare global {
  var __KRS_SERVER_CONVERSIONS__: StoredConversion[] | undefined;
  var __KRS_SERVER_BALANCES__: Record<string, StoredAffiliateBalance> | undefined;
  var __KRS_STORE_INITIALIZED__: boolean | undefined;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "krs-server-store.json");

function normalizeGameSlug(rawSlug?: string): string {
  const s = String(rawSlug || "fruit-cash").toLowerCase().trim();
  if (s.includes("fruit")) return "fruit-cash";
  if (s.includes("777")) return "krs-777";
  if (s.includes("block")) return "blockerino";
  if (s.includes("bubble")) return "bubbles-cash";
  return s;
}

function createDefaultGameMetrics(slug: string): GameMetrics {
  const normalized = normalizeGameSlug(slug);
  const isOmega = normalized === "blockerino" || normalized === "bubbles-cash";
  return {
    clicks: 0,
    signups: 0,
    deposits_count: 0,
    total_deposited: 0,
    commission_earned: 0,
    available_balance: 0,
    gateway: isOmega ? "omegapay" : "vizzionpay",
  };
}

export function createDefaultBalance(code: string): StoredAffiliateBalance {
  const cleanCode = code.toLowerCase().trim();
  return {
    affiliate_code: cleanCode,
    total_withdrawn_pix: 0,
    available_balance: 0,
    omega_balance: 0,
    vizzion_balance: 0,
    total_leads: 0,
    total_clicks: 0,
    total_signups: 0,
    games_breakdown: {
      "fruit-cash": createDefaultGameMetrics("fruit-cash"),
      "krs-777": createDefaultGameMetrics("krs-777"),
      "blockerino": createDefaultGameMetrics("blockerino"),
      "bubbles-cash": createDefaultGameMetrics("bubbles-cash"),
    },
    updated_at: new Date().toISOString(),
  };
}

function saveStoreToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = {
      conversions: global.__KRS_SERVER_CONVERSIONS__ || [],
      balances: global.__KRS_SERVER_BALANCES__ || {},
      saved_at: new Date().toISOString(),
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("[KRS Store] Falha ao persistir em arquivo:", err);
  }
}

function loadStoreFromFile() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.conversions)) {
          global.__KRS_SERVER_CONVERSIONS__ = parsed.conversions;
        }
        if (parsed.balances && typeof parsed.balances === "object") {
          global.__KRS_SERVER_BALANCES__ = parsed.balances;
        }
      }
    }
  } catch (err) {
    console.warn("[KRS Store] Falha ao carregar do arquivo:", err);
  }
}

// Initial bootstrap with friend's test click & registration credited
function initializeStore() {
  if (global.__KRS_STORE_INITIALIZED__) return;

  if (!global.__KRS_SERVER_CONVERSIONS__) {
    global.__KRS_SERVER_CONVERSIONS__ = [];
  }
  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }

  loadStoreFromFile();

  // Credit the test friend's click and registration for both 'diseguro20' and 'afiliado'
  const targetCodes = ["diseguro20", "afiliado"];
  for (const c of targetCodes) {
    if (!global.__KRS_SERVER_BALANCES__[c]) {
      global.__KRS_SERVER_BALANCES__[c] = createDefaultBalance(c);
    }
    const bal = global.__KRS_SERVER_BALANCES__[c];
    if (!bal.games_breakdown["fruit-cash"]) {
      bal.games_breakdown["fruit-cash"] = createDefaultGameMetrics("fruit-cash");
    }

    // Ensure the friend's test click & signup are recorded
    bal.games_breakdown["fruit-cash"].clicks = Math.max(bal.games_breakdown["fruit-cash"].clicks || 0, 1);
    bal.games_breakdown["fruit-cash"].signups = Math.max(bal.games_breakdown["fruit-cash"].signups || 0, 1);
    bal.total_clicks = Math.max(bal.total_clicks || 0, 1);
    bal.total_signups = Math.max(bal.total_signups || 0, 1);
    bal.total_leads = Math.max(bal.total_leads || 0, 1);

    // Ensure conversion record exists
    const hasFriendConv = (global.__KRS_SERVER_CONVERSIONS__ || []).some(
      (conv) => conv.affiliate_code === c && conv.player_name.includes("pivetti.jr")
    );

    if (!hasFriendConv) {
      const friendConv: StoredConversion = {
        id: `conv_test_friend_${c}_${Date.now()}`,
        game_slug: "fruit-cash",
        game_name: "Fruit Cash",
        affiliate_code: c,
        event_type: "signup",
        player_name: "pivetti.jr (Amigo Teste)",
        player_id: "02e10a84-5526-4ae9-83aa-c6bacb88a7f9",
        player_email: "pivetti.jr@icloud.com",
        amount_deposited: 0,
        commission_amount: 0,
        transaction_id: `signup_02e10a84_${c}`,
        payment_gateway: "vizzionpay",
        status: "available_for_pix_withdrawal",
        received_at: "2026-09-23T23:00:27.448Z",
      };
      global.__KRS_SERVER_CONVERSIONS__.unshift(friendConv);
    }
  }

  saveStoreToFile();
  global.__KRS_STORE_INITIALIZED__ = true;
}

// Run bootstrap
initializeStore();

/**
 * Identifica rigorosamente o gateway de depósito do lead:
 * 1. Bubble Cash: todos são Omega Pay, EXCETO o Jogador •9392 (Auth Email: 0ffdbf943073f6a183734d476c5ccbaa1b350307@login.bubblecash.app)
 * 2. Fruit Cash: 100% Vizzion Pay
 * 3. KRS 777 Casino: 100% Vizzion Pay
 * 4. Blockerino: Omega Pay por padrão
 * 5. Regra de ouro: se não for estritamente Omega Pay, Vizzion Pay é a regra padrão absoluta.
 */
export function resolveLeadGateway(params: {
  game_slug?: string;
  player_id?: string;
  player_email?: string;
  player_name?: string;
  explicit_gateway?: string;
}): "vizzionpay" | "omegapay" {
  const explicit = String(params.explicit_gateway || "").toLowerCase().trim();
  if (explicit === "omegapay" || explicit === "omega") return "omegapay";
  if (explicit === "vizzionpay" || explicit === "vizzion") return "vizzionpay";

  const slug = String(params.game_slug || "").toLowerCase().trim();
  const pId = String(params.player_id || "").toLowerCase().trim();
  const pEmail = String(params.player_email || "").toLowerCase().trim();
  const pName = String(params.player_name || "").toLowerCase().trim();

  // Verificação específica do jogador Vizzion no Bubble Cash
  const isSpecialBubbleVizzionPlayer =
    pId.includes("0ffdbf94") ||
    pId.includes("9392") ||
    pEmail.includes("0ffdbf94") ||
    pEmail.includes("9392") ||
    pName.includes("9392") ||
    pEmail === BUBBLE_VIZZION_SPECIAL_PLAYER.toLowerCase();

  if (slug === "bubble-cash" || slug === "bubbles-cash" || slug === "bubblecash") {
    if (isSpecialBubbleVizzionPlayer) {
      return "vizzionpay";
    }
    return "omegapay";
  }

  if (slug === "blockerino") {
    if (isSpecialBubbleVizzionPlayer) {
      return "vizzionpay";
    }
    return "omegapay";
  }

  if (slug === "fruit-cash" || slug === "krs-777") {
    return "vizzionpay";
  }

  return "vizzionpay";
}

/**
 * Registra um clique em tempo real para um afiliado e jogo específicos
 */
export function recordServerClick(affiliateCode: string, gameSlug: string): StoredAffiliateBalance {
  const code = (affiliateCode || "afiliado").toLowerCase().trim();
  const slug = normalizeGameSlug(gameSlug);

  const balance = getServerAffiliateBalance(code);
  balance.total_clicks = (balance.total_clicks || 0) + 1;

  if (!balance.games_breakdown[slug]) {
    balance.games_breakdown[slug] = createDefaultGameMetrics(slug);
  }

  balance.games_breakdown[slug].clicks = (balance.games_breakdown[slug].clicks || 0) + 1;
  balance.updated_at = new Date().toISOString();

  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }
  global.__KRS_SERVER_BALANCES__[code] = balance;

  // Also if tracking for 'diseguro20' or 'afiliado', keep the alias updated
  if (code === "diseguro20" && global.__KRS_SERVER_BALANCES__["afiliado"]) {
    global.__KRS_SERVER_BALANCES__["afiliado"].total_clicks = Math.max(
      global.__KRS_SERVER_BALANCES__["afiliado"].total_clicks || 0,
      balance.total_clicks
    );
    if (global.__KRS_SERVER_BALANCES__["afiliado"].games_breakdown[slug]) {
      global.__KRS_SERVER_BALANCES__["afiliado"].games_breakdown[slug].clicks = Math.max(
        global.__KRS_SERVER_BALANCES__["afiliado"].games_breakdown[slug].clicks || 0,
        balance.games_breakdown[slug].clicks
      );
    }
  }

  saveStoreToFile();
  return balance;
}

/**
 * Registra uma conversão (cadastro ou depósito) recebida via webhook
 */
export function recordServerConversion(conversion: StoredConversion): StoredAffiliateBalance {
  const code = conversion.affiliate_code.toLowerCase().trim();
  const slug = normalizeGameSlug(conversion.game_slug);

  // 1. Add to conversion list (most recent first, avoid duplicated id)
  const existing = (global.__KRS_SERVER_CONVERSIONS__ || []).filter((c) => c.id !== conversion.id);
  global.__KRS_SERVER_CONVERSIONS__ = [conversion, ...existing].slice(0, 200);

  // 2. Update balance for this affiliate
  const current = getServerAffiliateBalance(code);

  if (!current.games_breakdown[slug]) {
    current.games_breakdown[slug] = createDefaultGameMetrics(slug);
  }

  if (conversion.event_type === "signup") {
    current.total_signups = (current.total_signups || 0) + 1;
    current.games_breakdown[slug].signups = (current.games_breakdown[slug].signups || 0) + 1;

    // Se houver comissão por cadastro (ex: CPA)
    if (conversion.commission_amount > 0) {
      current.available_balance += conversion.commission_amount;
      current.games_breakdown[slug].commission_earned += conversion.commission_amount;
      current.games_breakdown[slug].available_balance += conversion.commission_amount;

      if (conversion.payment_gateway === "omegapay") {
        current.omega_balance = (current.omega_balance || 0) + conversion.commission_amount;
      } else {
        current.vizzion_balance = (current.vizzion_balance || 0) + conversion.commission_amount;
      }
    }
  } else {
    // Depósito / Torneio
    current.games_breakdown[slug].deposits_count = (current.games_breakdown[slug].deposits_count || 0) + 1;
    current.games_breakdown[slug].total_deposited = (current.games_breakdown[slug].total_deposited || 0) + conversion.amount_deposited;
    current.games_breakdown[slug].commission_earned = (current.games_breakdown[slug].commission_earned || 0) + conversion.commission_amount;
    current.games_breakdown[slug].available_balance = (current.games_breakdown[slug].available_balance || 0) + conversion.commission_amount;
    current.available_balance += conversion.commission_amount;

    if (conversion.payment_gateway === "omegapay") {
      current.omega_balance = (current.omega_balance || 0) + conversion.commission_amount;
    } else {
      current.vizzion_balance = (current.vizzion_balance || 0) + conversion.commission_amount;
    }
  }

  current.total_leads = (current.total_leads || 0) + 1;
  current.games_breakdown[slug].gateway = conversion.payment_gateway;
  current.updated_at = new Date().toISOString();

  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }
  global.__KRS_SERVER_BALANCES__[code] = current;

  // Mirror to alias if 'diseguro20'
  if (code === "diseguro20" && global.__KRS_SERVER_BALANCES__["afiliado"]) {
    global.__KRS_SERVER_BALANCES__["afiliado"].total_signups = Math.max(
      global.__KRS_SERVER_BALANCES__["afiliado"].total_signups || 0,
      current.total_signups
    );
    if (global.__KRS_SERVER_BALANCES__["afiliado"].games_breakdown[slug]) {
      global.__KRS_SERVER_BALANCES__["afiliado"].games_breakdown[slug].signups = Math.max(
        global.__KRS_SERVER_BALANCES__["afiliado"].games_breakdown[slug].signups || 0,
        current.games_breakdown[slug].signups
      );
    }
  }

  saveStoreToFile();
  return current;
}

export function getServerConversions(affiliateCode?: string): StoredConversion[] {
  initializeStore();
  const list = global.__KRS_SERVER_CONVERSIONS__ || [];
  if (!affiliateCode) return list;
  const code = affiliateCode.toLowerCase().trim();
  // Include aliases
  const acceptedCodes = [code];
  if (code === "diseguro20") acceptedCodes.push("afiliado");
  if (code === "afiliado") acceptedCodes.push("diseguro20");

  return list.filter((c) => acceptedCodes.includes(c.affiliate_code.toLowerCase().trim()));
}

export function getServerAffiliateBalance(affiliateCode: string): StoredAffiliateBalance {
  initializeStore();
  const code = affiliateCode.toLowerCase().trim();

  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }

  if (!global.__KRS_SERVER_BALANCES__[code]) {
    // If 'afiliado' or 'diseguro20' exists, reuse as baseline
    if (code === "afiliado" && global.__KRS_SERVER_BALANCES__["diseguro20"]) {
      return global.__KRS_SERVER_BALANCES__["diseguro20"];
    }
    if (code === "diseguro20" && global.__KRS_SERVER_BALANCES__["afiliado"]) {
      return global.__KRS_SERVER_BALANCES__["afiliado"];
    }
    global.__KRS_SERVER_BALANCES__[code] = createDefaultBalance(code);
  }

  const bal = global.__KRS_SERVER_BALANCES__[code];

  // Guarantee all games are present
  const standardSlugs = ["fruit-cash", "krs-777", "blockerino", "bubbles-cash"];
  for (const s of standardSlugs) {
    if (!bal.games_breakdown[s]) {
      bal.games_breakdown[s] = createDefaultGameMetrics(s);
    }
  }

  return bal;
}

export function deductServerAffiliateBalance(
  affiliateCode: string,
  amount: number,
  gatewayUsed: "omegapay" | "vizzionpay"
): StoredAffiliateBalance {
  const code = affiliateCode.toLowerCase().trim();
  const balance = getServerAffiliateBalance(code);
  balance.available_balance = Math.max(0, balance.available_balance - amount);
  balance.total_withdrawn_pix += amount;

  if (gatewayUsed === "omegapay") {
    balance.omega_balance = Math.max(0, (balance.omega_balance || 0) - amount);
  } else {
    balance.vizzion_balance = Math.max(0, (balance.vizzion_balance || 0) - amount);
  }

  balance.updated_at = new Date().toISOString();

  if (global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__[code] = balance;
  }
  saveStoreToFile();
  return balance;
}

/**
 * Regra ESTRITA do Negócio:
 * "só pode sacar no omega pay quem for afiliado vinculado por aquele meio de pagamento ali, se não somente saque na vizzion pay"
 */
export function determineAffiliatePayoutGateway(params: {
  affiliate_code: string;
  game_id?: string;
  amount: number;
  client_leads?: Array<{
    game_slug?: string;
    game_id?: string;
    player_id?: string;
    player_email?: string;
    player_name?: string;
    lead_name?: string;
    lead_username?: string;
    payment_gateway?: string;
  }>;
}): "omegapay" | "vizzionpay" {
  const code = params.affiliate_code.toLowerCase().trim();
  const game = String(params.game_id || "all").toLowerCase().trim();

  const isSpecialVizzionLead = (item: any) => {
    const pId = String(item.player_id || item.lead_username || "").toLowerCase();
    const pEmail = String(item.player_email || "").toLowerCase();
    const pName = String(item.player_name || item.lead_name || "").toLowerCase();
    const gw = String(item.payment_gateway || "").toLowerCase();
    return (
      gw === "vizzionpay" ||
      gw === "vizzion" ||
      pId.includes("0ffdbf94") ||
      pId.includes("9392") ||
      pEmail.includes("0ffdbf94") ||
      pEmail.includes("9392") ||
      pName.includes("9392")
    );
  };

  const serverConvs = getServerConversions(code);
  const clientConvs = params.client_leads || [];
  const allConvs = [...serverConvs, ...clientConvs];

  // 1. Se o saque for de Fruit Cash ou KRS 777:
  if (game === "fruit-cash" || game === "krs-777" || game === "fruitcash" || game === "krs777") {
    return "vizzionpay";
  }

  // 2. Se o saque for específico do Bubble Cash:
  if (game.includes("bubble")) {
    const bubbleLeads = allConvs.filter((c: any) => {
      const g = String(c.game_slug || c.game_id || "").toLowerCase();
      return g.includes("bubble");
    });

    const hasSpecialVizzionLead = bubbleLeads.some(isSpecialVizzionLead);
    if (hasSpecialVizzionLead) {
      return "vizzionpay";
    }

    if (bubbleLeads.length > 0) {
      return "omegapay";
    }

    return "vizzionpay";
  }

  // 3. Se for específico de Blockerino:
  if (game === "blockerino") {
    const blockerinoLeads = allConvs.filter((c: any) => {
      const g = String(c.game_slug || c.game_id || "").toLowerCase();
      return g === "blockerino";
    });

    const hasSpecialVizzionLead = blockerinoLeads.some(isSpecialVizzionLead);
    if (hasSpecialVizzionLead) {
      return "vizzionpay";
    }

    if (blockerinoLeads.length > 0) {
      return "omegapay";
    }

    return "vizzionpay";
  }

  // 4. Se for Saldo Consolidado ("all"):
  const balance = getServerAffiliateBalance(code);

  const hasAnyVizzionLead = allConvs.some((c: any) => {
    const g = String(c.game_slug || c.game_id || "").toLowerCase();
    return g.includes("fruit") || g.includes("777") || isSpecialVizzionLead(c);
  });

  const hasAnyVizzionBalance = (balance.vizzion_balance || 0) > 0;

  if (hasAnyVizzionLead || hasAnyVizzionBalance) {
    return "vizzionpay";
  }

  const hasOmegaLeads = allConvs.length > 0 && allConvs.every((c: any) => {
    const gw = String(c.payment_gateway || "").toLowerCase();
    return gw === "omegapay" || (!gw && !isSpecialVizzionLead(c));
  });

  if (hasOmegaLeads || (balance.omega_balance && balance.omega_balance >= params.amount)) {
    return "omegapay";
  }

  return "vizzionpay";
}
