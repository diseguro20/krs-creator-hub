import fs from "fs";
import path from "path";
import { fetchCreatorFromFirebase } from "@/lib/firebase";

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

export interface TagAuthorizationRequest {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  tag: string;
  platform: string;
  status: "pending" | "approved" | "rejected";
  proof_url?: string;
  notes?: string;
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  detected_balance?: number;
  detected_deposits_count?: number;
}

// Global server memory cache (persists across API invocations in the Node process)
declare global {
  var __KRS_SERVER_CONVERSIONS__: StoredConversion[] | undefined;
  var __KRS_SERVER_BALANCES__: Record<string, StoredAffiliateBalance> | undefined;
  var __KRS_CODE_ALIASES__: Record<string, string[]> | undefined;
  var __KRS_TAG_AUTHORIZATIONS__: TagAuthorizationRequest[] | undefined;
  var __KRS_STORE_INITIALIZED__: boolean | undefined;
}

export function registerAliases(codes: string[]) {
  if (!global.__KRS_CODE_ALIASES__) {
    global.__KRS_CODE_ALIASES__ = {};
  }
  const cleanCodes = codes.map((c) => (c || "").toLowerCase().trim()).filter(Boolean);
  for (const c of cleanCodes) {
    const existing = global.__KRS_CODE_ALIASES__[c] || [];
    const merged = Array.from(new Set([...existing, ...cleanCodes]));
    global.__KRS_CODE_ALIASES__[c] = merged;
  }
}

export function getCodeAliases(code: string): string[] {
  const clean = (code || "").toLowerCase().trim();
  const set = new Set<string>([clean]);
  if (clean === "diseguro20") set.add("afiliado");
  if (clean === "afiliado") set.add("diseguro20");
  if (global.__KRS_CODE_ALIASES__ && global.__KRS_CODE_ALIASES__[clean]) {
    for (const a of global.__KRS_CODE_ALIASES__[clean]) {
      set.add(a);
    }
  }
  return Array.from(set);
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
      tag_authorizations: global.__KRS_TAG_AUTHORIZATIONS__ || [],
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
        if (Array.isArray(parsed.tag_authorizations)) {
          global.__KRS_TAG_AUTHORIZATIONS__ = parsed.tag_authorizations;
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
  if (!global.__KRS_TAG_AUTHORIZATIONS__) {
    global.__KRS_TAG_AUTHORIZATIONS__ = [];
  }

  loadStoreFromFile();

  // Pre-seed default approved tags for master creator and sample demo pending request
  const defaultAuthorizations: TagAuthorizationRequest[] = [
    {
      id: "tag_auth_master_diseguro20",
      creator_id: "user-creator-master",
      creator_name: "KRS Master / Di Seguro",
      creator_email: "diseguro20@gmail.com",
      tag: "diseguro20",
      platform: "Todas as Plataformas (Fruit Cash, KRS 777, Blockerino, Bubble Cash)",
      status: "approved",
      notes: "Conta Master Oficial KRS",
      requested_at: "2026-09-01T00:00:00Z",
      reviewed_at: "2026-09-01T00:00:00Z",
      reviewed_by: "Sistema Master KRS",
    },
    {
      id: "tag_auth_master_afiliado",
      creator_id: "user-creator-master",
      creator_name: "KRS Master",
      creator_email: "diseguro20@gmail.com",
      tag: "afiliado",
      platform: "Todas as Plataformas",
      status: "approved",
      notes: "Tag padrão do sistema",
      requested_at: "2026-09-01T00:00:00Z",
      reviewed_at: "2026-09-01T00:00:00Z",
      reviewed_by: "Sistema Master KRS",
    },
    {
      id: "tag_auth_demo_pivetti",
      creator_id: "user-creator-1",
      creator_name: "Lucas Alencar (lucas_gaming)",
      creator_email: "lucas.creator@krscreatorhub.com",
      tag: "pivettij177",
      platform: "Fruit Cash",
      status: "pending",
      notes: "Solicito vincular minha tag pivettij177 do Fruit Cash. Segue meu comprovante de conta.",
      proof_url: "https://fruitcash.fun/u/pivetti.jr",
      detected_balance: 60.00,
      detected_deposits_count: 5,
      requested_at: "2026-09-24T22:30:00Z",
    },
  ];

  for (const seed of defaultAuthorizations) {
    const exists = (global.__KRS_TAG_AUTHORIZATIONS__ || []).some(
      (t) => t.id === seed.id || (t.tag.toLowerCase() === seed.tag.toLowerCase() && t.creator_id === seed.creator_id)
    );
    if (!exists) {
      global.__KRS_TAG_AUTHORIZATIONS__.push(seed);
    }
  }

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
  const acceptedCodes = getCodeAliases(affiliateCode);

  return list.filter((c) => acceptedCodes.includes(c.affiliate_code.toLowerCase().trim()));
}

export function getServerAffiliateBalance(affiliateCode: string): StoredAffiliateBalance {
  initializeStore();
  const code = affiliateCode.toLowerCase().trim();
  const aliases = getCodeAliases(code);

  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }

  // Check if any alias already has a balance
  for (const a of aliases) {
    if (global.__KRS_SERVER_BALANCES__[a] && a !== code) {
      const aliasBal = global.__KRS_SERVER_BALANCES__[a];
      global.__KRS_SERVER_BALANCES__[code] = {
        ...aliasBal,
        affiliate_code: code,
      };
      return global.__KRS_SERVER_BALANCES__[code];
    }
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

/**
 * Reconciliação Automática Multi-Plataforma:
 * Puxa os dados reais de comissão, depósitos e cadastros diretamente das plataformas oficiais
 * (Fruit Cash, Bubble Cash, etc.) para a tag fornecida pelo usuário em tempo real.
 */
export async function reconcileExternalGameStats(affiliateCode: string): Promise<StoredAffiliateBalance> {
  const code = (affiliateCode || "afiliado").toLowerCase().trim();
  const balance = getServerAffiliateBalance(code);

  let updated = false;

  // 1. RECONCILIAÇÃO DO FRUIT CASH
  try {
    let fruitCashData: any = null;

    // A) Verifica base de dados local do Fruit Cash
    const possiblePaths = [
      "c:\\Users\\diseg\\Downloads\\CLONE_fruitcash_fun_1790135933827\\.data\\fruitcash-db.json",
      path.join(process.cwd(), "..", "CLONE_fruitcash_fun_1790135933827", ".data", "fruitcash-db.json"),
      path.join(process.cwd(), ".data", "fruitcash-db.json"),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        try {
          const raw = fs.readFileSync(p, "utf8");
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.users)) {
            const u = parsed.users.find((user: any) =>
              (user.ref_code && user.ref_code.toLowerCase() === code) ||
              (user.username && user.username.toLowerCase() === code) ||
              (user.id && user.id.toLowerCase() === code)
            );

            if (u) {
              const uId = u.id;
              const uRef = (u.ref_code || u.username || "").toLowerCase();
              const uUser = (u.username || "").toLowerCase();
              registerAliases([code, uId, uRef, uUser]);

              const directUsers = parsed.users.filter((item: any) =>
                item.referred_by === uId ||
                (item.referred_by && item.referred_by.toLowerCase() === uRef) ||
                (item.referred_by && item.referred_by.toLowerCase() === uUser) ||
                (item.origin?.affiliate && (
                  item.origin.affiliate.id === uId ||
                  (item.origin.affiliate.code && item.origin.affiliate.code.toLowerCase() === uRef) ||
                  (item.origin.affiliate.username && item.origin.affiliate.username.toLowerCase() === uUser)
                ))
              );

              const directUserIds = new Set(directUsers.map((item: any) => item.id));

              const deps = (parsed.deposits || []).filter((d: any) =>
                d && d.status === "approved" && (
                  directUserIds.has(d.uid) ||
                  (d.ref && (d.ref === uId || d.ref.toLowerCase() === uRef || d.ref.toLowerCase() === uUser)) ||
                  (d.affiliate_code && (d.affiliate_code === uId || d.affiliate_code.toLowerCase() === uRef || d.affiliate_code.toLowerCase() === uUser))
                )
              );

              const totalDepCents = deps.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
              const totalDepReais = Number((totalDepCents / 100).toFixed(2));
              const affBalReais = u.affiliate_balance
                ? Number((u.affiliate_balance / 100).toFixed(2))
                : Number((totalDepReais * 0.2).toFixed(2));

              fruitCashData = {
                found: true,
                signups: directUsers.length,
                deposits_count: deps.length,
                total_deposited: totalDepReais,
                available_balance: affBalReais,
                leads: directUsers.map((item: any) => ({
                  player_id: item.id,
                  player_name: item.username || item.name || "Jogador",
                  player_email: item.email || "",
                  created_at: item.created_at || new Date().toISOString(),
                  event_type: "signup",
                })),
                deposits: deps.map((d: any) => {
                  const depAmt = Number(((d.amount || 0) / 100).toFixed(2));
                  const commAmt = Math.max(8, Number((depAmt * 0.2).toFixed(2)));
                  return {
                    id: `conv_${d.id}`,
                    game_slug: "fruit-cash",
                    game_name: "Fruit Cash",
                    affiliate_code: code,
                    event_type: "deposit",
                    player_name: d.username || "Jogador",
                    player_id: d.uid || `usr_${d.id}`,
                    amount_deposited: depAmt,
                    commission_amount: commAmt,
                    transaction_id: d.transactionId || d.id,
                    payment_gateway: "vizzionpay",
                    status: "available_for_pix_withdrawal",
                    received_at: d.approved_at || d.created_at || new Date().toISOString(),
                  };
                }),
              };
              break;
            }
          }
        } catch (_) {}
      }
    }

    // B) Consulta remota via API do Fruit Cash
    if (!fruitCashData) {
      const endpoints = [
        "http://localhost:3000/api/affiliate/query?code=" + encodeURIComponent(code),
        "https://fruitcash-fun.vercel.app/api/affiliate/query?code=" + encodeURIComponent(code),
      ];
      for (const ep of endpoints) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          const res = await fetch(ep, { signal: controller.signal });
          clearTimeout(timeout);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.found) {
              fruitCashData = data;
              if (data.affiliate) {
                registerAliases([code, data.affiliate.id, data.affiliate.ref_code, data.affiliate.username]);
              }
              break;
            }
          }
        } catch (_) {}
      }
    }

    // C) Aplica dados do Fruit Cash
    if (fruitCashData && fruitCashData.found) {
      updated = true;
      const fc = balance.games_breakdown["fruit-cash"] || createDefaultGameMetrics("fruit-cash");
      fc.signups = Math.max(fc.signups || 0, fruitCashData.signups || 0);
      fc.deposits_count = Math.max(fc.deposits_count || 0, fruitCashData.deposits_count || 0);
      fc.total_deposited = Math.max(fc.total_deposited || 0, fruitCashData.total_deposited || 0);
      fc.commission_earned = Math.max(fc.commission_earned || 0, fruitCashData.available_balance || 0);
      fc.available_balance = Math.max(fc.available_balance || 0, fruitCashData.available_balance || 0);

      balance.games_breakdown["fruit-cash"] = fc;
      balance.available_balance = Math.max(balance.available_balance || 0, fc.available_balance);
      balance.vizzion_balance = Math.max(balance.vizzion_balance || 0, fc.available_balance);
      balance.total_signups = Math.max(balance.total_signups || 0, fc.signups);
      balance.total_leads = Math.max(balance.total_leads || 0, fc.signups + fc.deposits_count);

      // Injeta conversões de depósito
      if (Array.isArray(fruitCashData.deposits)) {
        for (const dep of fruitCashData.deposits) {
          const existing = (global.__KRS_SERVER_CONVERSIONS__ || []).find((c) => c.transaction_id === dep.transaction_id || c.id === dep.id);
          if (!existing) {
            global.__KRS_SERVER_CONVERSIONS__ = [dep, ...(global.__KRS_SERVER_CONVERSIONS__ || [])].slice(0, 200);
          } else {
            existing.affiliate_code = code;
          }
        }
      }

      // Injeta cadastros
      if (Array.isArray(fruitCashData.leads)) {
        for (const lead of fruitCashData.leads) {
          const exists = (global.__KRS_SERVER_CONVERSIONS__ || []).some(
            (c) => c.player_id === lead.player_id && c.event_type === "signup" && c.affiliate_code === code
          );
          if (!exists) {
            const signupConv: StoredConversion = {
              id: `conv_signup_${lead.player_id}_${code}`,
              game_slug: "fruit-cash",
              game_name: "Fruit Cash",
              affiliate_code: code,
              event_type: "signup",
              player_name: lead.player_name,
              player_id: lead.player_id,
              player_email: lead.player_email,
              amount_deposited: 0,
              commission_amount: 0,
              transaction_id: `signup_${lead.player_id}`,
              payment_gateway: "vizzionpay",
              status: "available_for_pix_withdrawal",
              received_at: lead.created_at,
            };
            global.__KRS_SERVER_CONVERSIONS__ = [signupConv, ...(global.__KRS_SERVER_CONVERSIONS__ || [])].slice(0, 200);
          }
        }
      }
    }
  } catch (err) {
    console.warn("[RECONCILIAÇÃO FRUIT CASH] Falha não-bloqueante:", err);
  }

  // 2. RECONCILIAÇÃO DO BUBBLE CASH / BLOCKERINO (via Firebase)
  try {
    const cloudData = await fetchCreatorFromFirebase(code);
    if (cloudData) {
      updated = true;
      if (typeof cloudData.available_balance === "number") {
        balance.available_balance = Math.max(balance.available_balance, cloudData.available_balance);
      }
      if (typeof cloudData.total_leads === "number") {
        balance.total_leads = Math.max(balance.total_leads, cloudData.total_leads);
      }
    }
  } catch (_) {}

  balance.updated_at = new Date().toISOString();

  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }
  global.__KRS_SERVER_BALANCES__[code] = balance;

  if (updated) {
    saveStoreToFile();
  }

  return balance;
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

/**
 * =========================================================================
 * SISTEMA DE AUTORIZAÇÃO E APROVAÇÃO DE TAGS (ADMIN REVIEW)
 * Garante que somente os criadores comprovadamente titulares de uma tag
 * possam puxar os dados, comissões e realizar saques daquela conta.
 * =========================================================================
 */

export function getTagAuthorizations(filter?: {
  status?: "pending" | "approved" | "rejected";
  creator_id?: string;
  tag?: string;
}): TagAuthorizationRequest[] {
  initializeStore();
  let list = global.__KRS_TAG_AUTHORIZATIONS__ || [];
  if (filter?.status) {
    list = list.filter((item) => item.status === filter.status);
  }
  if (filter?.creator_id) {
    list = list.filter((item) => item.creator_id === filter.creator_id);
  }
  if (filter?.tag) {
    const cleanTag = filter.tag.toLowerCase().trim();
    list = list.filter((item) => item.tag.toLowerCase().trim() === cleanTag);
  }
  return list;
}

export function requestTagAuthorization(params: {
  creator_id: string;
  creator_name: string;
  creator_email: string;
  tag: string;
  platform?: string;
  proof_url?: string;
  notes?: string;
}): TagAuthorizationRequest {
  initializeStore();
  const cleanTag = params.tag.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, "");

  // Tenta detectar saldo prévio na plataforma para auxiliar a decisão do admin
  let detectedBalance = 0;
  let detectedDepositsCount = 0;
  try {
    const possiblePaths = [
      "c:\\Users\\diseg\\Downloads\\CLONE_fruitcash_fun_1790135933827\\.data\\fruitcash-db.json",
      path.join(process.cwd(), "..", "CLONE_fruitcash_fun_1790135933827", ".data", "fruitcash-db.json"),
      path.join(process.cwd(), ".data", "fruitcash-db.json"),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          const u = parsed.users.find(
            (usr: any) =>
              (usr.ref_code && usr.ref_code.toLowerCase() === cleanTag) ||
              (usr.username && usr.username.toLowerCase() === cleanTag)
          );
          if (u) {
            detectedBalance = u.affiliate_balance ? Number((u.affiliate_balance / 100).toFixed(2)) : 0;
            const deps = (parsed.deposits || []).filter(
              (d: any) => d && d.status === "approved" && (d.ref === u.id || d.ref === u.ref_code || d.uid === u.id)
            );
            detectedDepositsCount = deps.length;
            break;
          }
        }
      }
    }
  } catch (_) {}

  // Se já existir solicitação para esse criador e essa tag
  const existing = (global.__KRS_TAG_AUTHORIZATIONS__ || []).find(
    (item) => item.tag.toLowerCase() === cleanTag && item.creator_id === params.creator_id
  );

  if (existing) {
    if (existing.status === "rejected" || existing.status === "pending") {
      existing.status = "pending";
      existing.notes = params.notes || existing.notes;
      existing.proof_url = params.proof_url || existing.proof_url;
      existing.platform = params.platform || existing.platform;
      existing.requested_at = new Date().toISOString();
      existing.rejection_reason = undefined;
      if (detectedBalance > 0) existing.detected_balance = detectedBalance;
      if (detectedDepositsCount > 0) existing.detected_deposits_count = detectedDepositsCount;
      saveStoreToFile();
      return existing;
    }
    return existing;
  }

  const newReq: TagAuthorizationRequest = {
    id: `tag_req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    creator_id: params.creator_id || "creator_anonymous",
    creator_name: params.creator_name || "Criador",
    creator_email: params.creator_email || "",
    tag: cleanTag,
    platform: params.platform || "Fruit Cash",
    status: "pending",
    proof_url: params.proof_url || "",
    notes: params.notes || "",
    detected_balance: detectedBalance,
    detected_deposits_count: detectedDepositsCount,
    requested_at: new Date().toISOString(),
  };

  global.__KRS_TAG_AUTHORIZATIONS__ = [newReq, ...(global.__KRS_TAG_AUTHORIZATIONS__ || [])];
  saveStoreToFile();
  return newReq;
}

export function reviewTagAuthorization(params: {
  id: string;
  status: "approved" | "rejected";
  reviewed_by?: string;
  rejection_reason?: string;
}): TagAuthorizationRequest | null {
  initializeStore();
  const req = (global.__KRS_TAG_AUTHORIZATIONS__ || []).find((item) => item.id === params.id);
  if (!req) return null;

  req.status = params.status;
  req.reviewed_at = new Date().toISOString();
  req.reviewed_by = params.reviewed_by || "Administrador KRS";
  if (params.rejection_reason) {
    req.rejection_reason = params.rejection_reason;
  } else {
    req.rejection_reason = undefined;
  }

  saveStoreToFile();
  return req;
}

export function checkTagAuthorization(params: {
  tag: string;
  creator_id?: string;
  creator_email?: string;
}): {
  is_authorized: boolean;
  status: "approved" | "pending" | "rejected" | "unrequested";
  request?: TagAuthorizationRequest;
} {
  initializeStore();
  const cleanTag = (params.tag || "").toLowerCase().trim();
  const cEmail = (params.creator_email || "").toLowerCase().trim();
  const cId = (params.creator_id || "").toLowerCase().trim();

  if (!cleanTag) {
    return { is_authorized: false, status: "unrequested" };
  }

  // 1. SEGURANÇA E TITULARIDADE EXCLUSIVA DA TAG MESTRE 'diseguro20':
  // A tag 'diseguro20' pertence UNICAMENTE a Di Seguro (diseguro20@gmail.com / user-admin-1 / user-creator-master).
  // NINGUÉM MAIS tem permissão de ver o saldo, ver os amigos ou sacar usando a tag 'diseguro20'.
  const isDiSeguroMaster =
    cEmail === "diseguro20@gmail.com" ||
    cEmail.startsWith("diseguro") ||
    cId === "user-admin-1" ||
    cId === "user-creator-master" ||
    cId.startsWith("diseguro");

  if (cleanTag === "diseguro20") {
    if (isDiSeguroMaster) {
      return { is_authorized: true, status: "approved" };
    }
    // Qualquer outra pessoa que tentar acessar ou digitar 'diseguro20' é BLOQUEADA!
    const list = global.__KRS_TAG_AUTHORIZATIONS__ || [];
    const userReq = list.find(
      (item) =>
        item.tag.toLowerCase() === "diseguro20" &&
        ((cId && item.creator_id.toLowerCase() === cId) ||
          (cEmail && item.creator_email.toLowerCase() === cEmail))
    );
    return {
      is_authorized: false,
      status: userReq ? userReq.status : "unrequested",
      request: userReq,
    };
  }

  // 2. Tag padrão genérica 'afiliado':
  if (cleanTag === "afiliado") {
    const isAfiliadoUser =
      cEmail === "afiliado@krscreatorhub.com" || cId === "user-creator-1" || isDiSeguroMaster;
    if (isAfiliadoUser) {
      return { is_authorized: true, status: "approved" };
    }
  }

  // 3. REGRA GERAL DE SEGURANÇA E ISOLAMENTO PESSOAL:
  // Cada tag aprovada pertence RIGOROSAMENTE ao criador que a solicitou e foi aprovado pelo Admin.
  // Uma aprovação para o "Criador A" JAMAIS dá acesso ao "Criador B"!
  // Se nenhum criador estiver autenticado, o acesso a dados privados é totalmente bloqueado.
  if (!cId && !cEmail) {
    return { is_authorized: false, status: "unrequested" };
  }

  const list = global.__KRS_TAG_AUTHORIZATIONS__ || [];
  const matching = list.find((item) => {
    const matchTag = item.tag.toLowerCase() === cleanTag;
    if (!matchTag) return false;

    // A autorização DEVE pertencer a este criador específico (por ID ou email)
    const matchCreator =
      (cId && item.creator_id.toLowerCase() === cId) ||
      (cEmail && item.creator_email.toLowerCase() === cEmail);

    return matchCreator;
  });

  if (!matching) {
    return { is_authorized: false, status: "unrequested" };
  }

  return {
    is_authorized: matching.status === "approved",
    status: matching.status,
    request: matching,
  };
}
