/**
 * Server-Side Persistent Store for Conversions and Balances
 * Centraliza os dados recebidos via webhook dos 4 jogos (Fruit Cash, KRS 777, Blockerino, Bubble Cash)
 */

export interface StoredConversion {
  id: string;
  game_slug: string;
  game_name: string;
  affiliate_code: string;
  event_type: "deposit" | "signup" | "tournament";
  player_name: string;
  player_id: string;
  amount_deposited: number;
  commission_amount: number;
  transaction_id: string;
  status: "available_for_pix_withdrawal" | "paid" | "processing";
  received_at: string;
}

export interface StoredAffiliateBalance {
  affiliate_code: string;
  total_withdrawn_pix: number;
  available_balance: number;
  total_leads: number;
  games_breakdown: Record<
    string,
    {
      deposits_count: number;
      total_deposited: number;
      commission_earned: number;
      available_balance: number;
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
    total_leads: 0,
    games_breakdown: {
      "fruit-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
      "krs-777": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
      "blockerino": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
      "bubbles-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
    },
    updated_at: new Date().toISOString(),
  };

  current.available_balance += conversion.commission_amount;
  current.total_leads += 1;
  current.updated_at = new Date().toISOString();

  const gameKey = conversion.game_slug.toLowerCase();
  if (current.games_breakdown[gameKey]) {
    current.games_breakdown[gameKey].deposits_count += 1;
    current.games_breakdown[gameKey].total_deposited += conversion.amount_deposited;
    current.games_breakdown[gameKey].commission_earned += conversion.commission_amount;
    current.games_breakdown[gameKey].available_balance += conversion.commission_amount;
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
      total_leads: 0,
      games_breakdown: {
        "fruit-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
        "krs-777": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
        "blockerino": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
        "bubbles-cash": { deposits_count: 0, total_deposited: 0, commission_earned: 0, available_balance: 0 },
      },
      updated_at: new Date().toISOString(),
    }
  );
}

export function deductServerAffiliateBalance(affiliateCode: string, amount: number) {
  const code = affiliateCode.toLowerCase().trim();
  const balance = getServerAffiliateBalance(code);
  balance.available_balance = Math.max(0, balance.available_balance - amount);
  balance.total_withdrawn_pix += amount;
  balance.updated_at = new Date().toISOString();

  if (global.__KRS_SERVER_BALANCES__) {
    global.__KRS_SERVER_BALANCES__[code] = balance;
  }
  return balance;
}
