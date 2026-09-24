/**
 * Server-Side Persistent Store for Conversions and Balances
 * Centraliza os dados recebidos via webhook dos 4 jogos (Fruit Cash, KRS 777, Blockerino, Bubble Cash)
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

export interface StoredAffiliateBalance {
  affiliate_code: string;
  total_withdrawn_pix: number;
  available_balance: number;
  omega_balance: number;
  vizzion_balance: number;
  total_leads: number;
  games_breakdown: Record<
    string,
    {
      deposits_count: number;
      total_deposited: number;
      commission_earned: number;
      available_balance: number;
      gateway: "vizzionpay" | "omegapay";
    }
  >;
  updated_at: string;
}

// Global server memory cache (persists across API invocations in the Node process)
declare global {
  var __KRS_SERVER_CONVERSIONS__: StoredConversion[] | undefined;
  var __KRS_SERVER_BALANCES__: Record<string, StoredAffiliateBalance> | undefined;
}

if (!global.__KRS_SERVER_CONVERSIONS__) {
  global.__KRS_SERVER_CONVERSIONS__ = [];
}

if (!global.__KRS_SERVER_BALANCES__) {
  global.__KRS_SERVER_BALANCES__ = {};
}

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
      // Único jogador do Bubble Cash que recebe na Vizzion Pay!
      return "vizzionpay";
    }
    // Demais jogadores do Bubble Cash entram na Omega Pay
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

  // Regra de segurança: Se não for explicitamente do ecossistema Omega, somente Vizzion Pay
  return "vizzionpay";
}

export function recordServerConversion(conversion: StoredConversion) {
  const code = conversion.affiliate_code.toLowerCase().trim();

  // 1. Add to conversion list (most recent first)
  global.__KRS_SERVER_CONVERSIONS__ = [conversion, ...(global.__KRS_SERVER_CONVERSIONS__ || [])].slice(0, 100);

  // 2. Update balance for this affiliate
  if (!global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__ = {};
  }

  const current = global.__KRS_SERVER_BALANCES__[code] || {
    affiliate_code: code,
    total_withdrawn_pix: 0,
    available_balance: 0,
    omega_balance: 0,
    vizzion_balance: 0,
    total_leads: 0,
    games_breakdown: {
      "fruit-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "vizzionpay" },
      "krs-777": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "vizzionpay" },
      "blockerino": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "omegapay" },
      "bubbles-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "omegapay" },
    },
    updated_at: new Date().toISOString(),
  };

  current.available_balance += conversion.commission_amount;
  current.total_leads += 1;
  current.updated_at = new Date().toISOString();

  if (conversion.payment_gateway === "omegapay") {
    current.omega_balance = (current.omega_balance || 0) + conversion.commission_amount;
  } else {
    current.vizzion_balance = (current.vizzion_balance || 0) + conversion.commission_amount;
  }

  const gameKey = conversion.game_slug.toLowerCase();
  if (current.games_breakdown[gameKey]) {
    current.games_breakdown[gameKey].deposits_count += 1;
    current.games_breakdown[gameKey].total_deposited += conversion.amount_deposited;
    current.games_breakdown[gameKey].commission_earned += conversion.commission_amount;
    current.games_breakdown[gameKey].available_balance += conversion.commission_amount;
    current.games_breakdown[gameKey].gateway = conversion.payment_gateway;
  }

  global.__KRS_SERVER_BALANCES__[code] = current;
  return current;
}

export function getServerConversions(affiliateCode?: string) {
  const list = global.__KRS_SERVER_CONVERSIONS__ || [];
  if (!affiliateCode) return list;
  const code = affiliateCode.toLowerCase().trim();
  return list.filter((c) => c.affiliate_code === code);
}

export function getServerAffiliateBalance(affiliateCode: string) {
  const code = affiliateCode.toLowerCase().trim();
  return (
    global.__KRS_SERVER_BALANCES__?.[code] || {
      affiliate_code: code,
      total_withdrawn_pix: 0,
      available_balance: 0,
      omega_balance: 0,
      vizzion_balance: 0,
      total_leads: 0,
      games_breakdown: {
        "fruit-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "vizzionpay" },
        "krs-777": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "vizzionpay" },
        "blockerino": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "omegapay" },
        "bubbles-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0, gateway: "omegapay" },
      },
      updated_at: new Date().toISOString(),
    }
  );
}

export function deductServerAffiliateBalance(affiliateCode: string, amount: number, gatewayUsed: "omegapay" | "vizzionpay") {
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
  return balance;
}

/**
 * Regra ESTRITA do Negócio:
 * "só pode sacar no omega pay quem for afiliado vinculado por aquele meio de pagamento ali, se não somente saque na vizzion pay"
 * No Bubble Cash: apenas o jogador 0ffdbf943073f6a183734d476c5ccbaa1b350307 (Jogador •9392) tem depósitos na Vizzion Pay.
 * Se o afiliado for lead dele -> saca 100% na Vizzion Pay.
 * Demais jogadores do Bubble Cash e Blockerino caem na Omega Pay -> afiliados deles sacam na Omega Pay.
 * Fruit Cash & KRS 777 caem na Vizzion Pay -> afiliados sacam na Vizzion Pay.
 * Se não for comprovadamente vinculado à Omega Pay -> SEMPRE Vizzion Pay ("se não somente saque na vizzion pay").
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

  // Helper para identificar o Jogador •9392 (Vizzion no Bubble Cash)
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

  // Merge conversões gravadas no servidor com os leads fornecidos pelo cliente
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

    // Se o lead for o Jogador •9392 -> OBRIGATÓRIO Vizzion Pay!
    const hasSpecialVizzionLead = bubbleLeads.some(isSpecialVizzionLead);
    if (hasSpecialVizzionLead) {
      return "vizzionpay";
    }

    // Se tiver leads comprovados que NÃO são o 9392 (portanto Omega Pay)
    if (bubbleLeads.length > 0) {
      return "omegapay";
    }

    // Se não há histórico de leads comprovados: regra padrão Vizzion Pay
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
  // "só pode sacar no omega pay quem for afiliado vinculado por aquele meio de pagamento ali, se não somente saque na vizzion pay"
  const balance = getServerAffiliateBalance(code);

  const hasAnyVizzionLead = allConvs.some((c: any) => {
    const g = String(c.game_slug || c.game_id || "").toLowerCase();
    return g.includes("fruit") || g.includes("777") || isSpecialVizzionLead(c);
  });

  const hasAnyVizzionBalance = (balance.vizzion_balance || 0) > 0;

  if (hasAnyVizzionLead || hasAnyVizzionBalance) {
    return "vizzionpay";
  }

  // Apenas se tiver leads estritamente Omega Pay sem nenhum vínculo Vizzion:
  const hasOmegaLeads = allConvs.length > 0 && allConvs.every((c: any) => {
    const gw = String(c.payment_gateway || "").toLowerCase();
    return gw === "omegapay" || (!gw && !isSpecialVizzionLead(c));
  });

  if (hasOmegaLeads || (balance.omega_balance && balance.omega_balance >= params.amount)) {
    return "omegapay";
  }

  // REGRA DE OURO PADRÃO: "se não somente saque na vizzion pay"
  return "vizzionpay";
}
