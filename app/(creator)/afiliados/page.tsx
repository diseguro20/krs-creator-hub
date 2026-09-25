"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowUpRight,
  Copy,
  Check,
  Gamepad2,
  TrendingUp,
  Users,
  MousePointerClick,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  Filter,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Award,
  Crown
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency } from "@/lib/utils";
import { GameAffiliateStats, AffiliateConversionRecord, Game } from "@/types";
import { SIMULATED_AFFILIATE_INFLUENCERS } from "@/lib/affiliate-leaderboard-data";

export default function AffiliateHubPage() {
  const {
    affiliateStats,
    affiliateConversions,
    totalAffiliateBalance,
    withdrawAffiliate,
    updateAffiliateCode,
    currentUser,
    openGamePlayer,
    games,
  } = useKrsStore();

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>("all");
  const [customTag, setCustomTag] = useState<string>(
    (currentUser as any)?.affiliate_code || currentUser?.username || "afiliado"
  );
  const [tagSuccess, setTagSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCustomTag((currentUser as any)?.affiliate_code || currentUser.username || "afiliado");
    }
  }, [currentUser]);

  // Real-time server sync for webhooks and clicks from the 4 games
  const [liveServerConversions, setLiveServerConversions] = useState<any[]>([]);
  const [liveServerBalance, setLiveServerBalance] = useState<number | null>(null);
  const [liveServerBreakdown, setLiveServerBreakdown] = useState<Record<string, any>>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // Tag authorization & ownership approval states
  const [tagAuthStatus, setTagAuthStatus] = useState<"approved" | "pending" | "rejected" | "unrequested">("approved");
  const [tagAuthMessage, setTagAuthMessage] = useState<string>("");
  const [tagAuthRequest, setTagAuthRequest] = useState<any | null>(null);

  // Modal para solicitar aprovação de titularidade da tag
  const [requestTagModalOpen, setRequestTagModalOpen] = useState(false);
  const [requestTagPlatform, setRequestTagPlatform] = useState("Fruit Cash");
  const [requestTagProofUrl, setRequestTagProofUrl] = useState("");
  const [requestTagNotes, setRequestTagNotes] = useState("");
  const [isSubmittingTagReq, setIsSubmittingTagReq] = useState(false);
  const [tagReqFeedback, setTagReqFeedback] = useState<string | null>(null);

  const fetchSync = async () => {
    try {
      setIsSyncing(true);
      const tag = customTag || (currentUser as any)?.affiliate_code || currentUser?.username || "afiliado";
      const creatorId = currentUser?.id || "";
      const creatorEmail = currentUser?.email || "";
      const res = await fetch(
        `/api/affiliates/sync?code=${encodeURIComponent(tag)}&creator_id=${encodeURIComponent(creatorId)}&creator_email=${encodeURIComponent(creatorEmail)}&_t=${Date.now()}`
      );
      const data = await res.json();
      if (data.success) {
        const isAuth = data.authorized === true || data.auth_status === "approved";
        setTagAuthStatus(isAuth ? "approved" : (data.auth_status || "unrequested"));
        setTagAuthMessage(data.message || "");
        setTagAuthRequest(data.request || null);

        if (isAuth) {
          if (data.conversions && Array.isArray(data.conversions)) {
            setLiveServerConversions(data.conversions);
          }
          if (data.server_balance) {
            if (typeof data.server_balance.available_balance === "number") {
              setLiveServerBalance(data.server_balance.available_balance);
            }
            if (data.server_balance.games_breakdown) {
              setLiveServerBreakdown(data.server_balance.games_breakdown);
            }
          }
        } else {
          // If not authorized, keep private platform data masked
          setLiveServerConversions([]);
          setLiveServerBalance(0);
          setLiveServerBreakdown({});
        }
        setLastSyncTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch (e) {
      // Non-blocking fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSync();
    const timer = setInterval(fetchSync, 3000); // 3 seconds fast real-time poll
    return () => clearInterval(timer);
  }, [customTag, currentUser]);

  // Merge local affiliate stats with live server breakdown
  const displayAffiliateStats = affiliateStats.map((item) => {
    const serverGame =
      liveServerBreakdown[item.game_slug] ||
      liveServerBreakdown[item.game_id] ||
      (item.game_slug === "bubbles-cash" ? liveServerBreakdown["bubble-cash"] : null) ||
      (item.game_slug === "bubble-cash" ? liveServerBreakdown["bubbles-cash"] : null) ||
      null;

    const clicks = serverGame && typeof serverGame.clicks === "number" ? serverGame.clicks : (item.clicks || 0);
    const signups = serverGame && typeof serverGame.signups === "number" ? serverGame.signups : (item.signups || 0);
    const deposits_count = serverGame && typeof serverGame.deposits_count === "number" ? serverGame.deposits_count : (item.deposits_count || 0);
    const total_deposited = serverGame && typeof serverGame.total_deposited === "number" ? serverGame.total_deposited : (item.total_deposited || 0);
    const commission_earned = serverGame && typeof serverGame.commission_earned === "number" ? serverGame.commission_earned : (item.commission_earned || 0);
    const available_balance = serverGame && typeof serverGame.available_balance === "number" ? serverGame.available_balance : (item.available_balance || 0);

    const origin = typeof window !== "undefined" ? window.location.origin : "https://krs-creator-hub.vercel.app";
    const trackedUrl = `${origin}/r/${item.game_slug}?ref=${encodeURIComponent(customTag || "afiliado")}`;

    return {
      ...item,
      clicks,
      signups,
      deposits_count,
      total_deposited,
      commission_earned,
      available_balance,
      referral_url: trackedUrl,
    };
  });

  // Total consolidated stats across all 4 games
  const totalClicks = displayAffiliateStats.reduce((acc, g) => acc + g.clicks, 0);
  const totalSignups = displayAffiliateStats.reduce((acc, g) => acc + g.signups, 0);
  const totalDeposited = displayAffiliateStats.reduce((acc, g) => acc + g.total_deposited, 0);
  const totalCommissionsEarned = displayAffiliateStats.reduce((acc, g) => acc + g.commission_earned, 0);

  // Combined conversions (local + live server webhooks)
  const allConversions: AffiliateConversionRecord[] = [
    ...liveServerConversions.map((sc) => ({
      id: sc.id,
      game_id: sc.game_slug,
      game_name: sc.game_name,
      game_slug: sc.game_slug,
      lead_name: sc.player_name,
      lead_username: sc.player_id,
      type: sc.event_type as any,
      amount_deposited: sc.amount_deposited,
      commission_amount: sc.commission_amount,
      status: "available" as const,
      created_at: sc.received_at,
    })),
    ...affiliateConversions,
  ];

  const currentAvailableBalance =
    liveServerBalance !== null
      ? liveServerBalance
      : totalAffiliateBalance;

  // Filter conversions with support for slug and ID prefixes
  const matchesGame = (filter: string, convGameId?: string, convGameSlug?: string) => {
    if (filter === "all") return true;
    const f = filter.replace(/^game-/, "").toLowerCase();
    const id = (convGameId || "").replace(/^game-/, "").toLowerCase();
    const slug = (convGameSlug || "").replace(/^game-/, "").toLowerCase();
    return f === id || f === slug || (f.includes("bubble") && (slug.includes("bubble") || id.includes("bubble")));
  };

  const filteredConversions = allConversions.filter((c) =>
    matchesGame(selectedGameFilter, c.game_id, c.game_slug)
  );

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawGameId, setWithdrawGameId] = useState<string>("all");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [pixKeyType, setPixKeyType] = useState<string>("cpf");
  const [pixKey, setPixKey] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    txId: string;
    amount: number;
    pixKey: string;
    gameName: string;
    method?: string;
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy referral link handler
  const handleCopyLink = (url: string, gameId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(gameId);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  // Open withdrawal for a specific game or total
  const handleOpenWithdraw = (gameId: string = "all") => {
    setWithdrawGameId(gameId);
    setErrorMessage(null);
    setReceipt(null);

    if (gameId === "all") {
      setWithdrawAmount(currentAvailableBalance.toFixed(2));
    } else {
      const g = displayAffiliateStats.find((s) => s.game_id === gameId);
      setWithdrawAmount(g ? g.available_balance.toFixed(2) : "0.00");
    }

    setWithdrawModalOpen(true);
  };

  // Execute withdrawal
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const amountNum = parseFloat(withdrawAmount.replace(",", "."));
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage("Por favor, digite um valor válido maior que zero.");
      return;
    }

    if (!pixKey.trim()) {
      setErrorMessage("Informe sua chave PIX para receber a transferência.");
      return;
    }

    // Limit check
    const maxAvailable =
      withdrawGameId === "all"
        ? currentAvailableBalance
        : displayAffiliateStats.find((g) => g.game_id === withdrawGameId || g.game_slug === withdrawGameId)?.available_balance || 0;

    if (amountNum > maxAvailable) {
      setErrorMessage(
        `Saldo insuficiente. Seu limite disponível para saque é de ${formatCurrency(maxAvailable)}.`
      );
      return;
    }

    if (tagAuthStatus !== "approved") {
      setErrorMessage(
        "Saque bloqueado por segurança: Esta tag ainda não foi aprovada pelo administrador. Solicite a aprovação de titularidade antes de realizar saques."
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Disparo para a API de saque PIX (roteamento estrito e sigiloso no backend)
      const apiRes = await fetch("/api/withdrawals/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          pix_key: pixKey,
          pix_key_type: pixKeyType,
          affiliate_code: customTag || "afiliado",
          game_id: withdrawGameId,
          creator_id: currentUser?.id || "",
          creator_email: currentUser?.email || "",
          recent_leads: (affiliateConversions || []).map((c) => ({
            game_slug: c.game_slug,
            game_id: c.game_id,
            player_id: c.lead_username,
            player_name: c.lead_name,
            lead_username: c.lead_username,
            lead_name: c.lead_name,
          })),
        }),
      });

      const apiData = await apiRes.json();

      if (!apiRes.ok || !apiData.success) {
        setErrorMessage(apiData.message || "Não foi possível concluir o saque PIX. Verifique sua chave.");
        setIsProcessing(false);
        return;
      }

      // Atualiza saldo na store local
      const res = await withdrawAffiliate(amountNum, pixKey, pixKeyType, withdrawGameId);

      const gameObj = displayAffiliateStats.find((g) => g.game_id === withdrawGameId);
      setReceipt({
        txId: apiData.data?.txId || res.txId,
        amount: amountNum,
        pixKey,
        gameName: gameObj ? gameObj.game_name : "Saldo Consolidado (Todos os Jogos)",
        method: "Transferência Bancária PIX",
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro ao processar o saque PIX. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. RETRO ARCADE TOP BANNER & HUD                                         */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c1611] via-[#09120c] to-[#040805] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 overflow-hidden arcade-box">
        {/* Scanline CRT overlay */}
        <div className="arcade-scanlines pointer-events-none opacity-40" />

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] sm:text-xs font-pixel text-emerald-400">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-400 animate-spin" : "bg-emerald-400 animate-pulse"}`} />
              <span>CONTAGEM EM TEMPO REAL ATIVA • 4 JOGOS</span>
              {lastSyncTime && (
                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">({lastSyncTime})</span>
              )}
              <button
                onClick={fetchSync}
                className="ml-1 text-emerald-300 hover:text-white transition active:scale-90 cursor-pointer p-0.5"
                title="Sincronizar agora"
              >
                <RotateCcw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            </div>

            <h1 className="font-pixel text-2xl sm:text-4xl text-white tracking-wide uppercase drop-shadow-[0_0_15px_rgba(0,245,155,0.4)]">
              TODOS OS SEUS GANHOS <br className="hidden sm:inline" />
              <span className="text-[#00F59B]">EM UM SÓ LUGAR</span>
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Divulgue os 4 jogos oficiais da KRS, acompanhe cliques e cadastros em tempo real, e
              receba as comissões consolidadas na sua conta via <strong className="text-emerald-400">PIX Instantâneo</strong>.
            </p>
          </div>

          {/* Master Balance Action Box (Arcade Card Style) */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-black/60 border-2 border-emerald-400/60 p-5 sm:p-6 backdrop-blur-xl shadow-xl min-w-[280px]">
            <div className="text-[10px] uppercase font-pixel text-zinc-400 tracking-wider">
              SALDO TOTAL DISPONÍVEL
            </div>

            <div className="text-3xl sm:text-4xl font-pixel text-emerald-400 font-black my-2 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
              {formatCurrency(currentAvailableBalance)}
            </div>

            <div className="text-[11px] text-zinc-400 mb-3 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saques liberados 24/7 sem taxa</span>
            </div>

            <button
              onClick={() => handleOpenWithdraw("all")}
              disabled={currentAvailableBalance <= 0}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 fill-dark-950" />
              <span>SACAR TUDO VIA PIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. AGGREGATED KPI TILES                                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Clicks */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Cliques Agregados</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalClicks.toLocaleString("pt-BR")}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Em todos os 4 links
            </div>
          </div>
        </div>

        {/* Signups */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Cadastros Ativos</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalSignups.toLocaleString("pt-BR")}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Jogadores registrados
            </div>
          </div>
        </div>

        {/* Total Deposited */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Volume Depositado</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(totalDeposited)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium mt-1">
              Gera comissão contínua
            </div>
          </div>
        </div>

        {/* Total Commissions Earned */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Comissões Acumuladas</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatCurrency(totalCommissionsEarned)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium mt-1">
              Histórico geral de ganhos
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OS 4 JOGOS: MULTI-LINK & METRICS GRID                                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕹️</span>
              <h2 className="font-pixel text-lg sm:text-xl text-white uppercase tracking-wider">
                SEUS LINKS E SALDOS POR JOGO
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Links oficiais dos 4 jogos com seu código rastreado para contagem automática de comissão.
            </p>
          </div>

          {/* Interactive Tag Customizer & Ownership Verification */}
          <div className="flex items-center gap-2 bg-[#08100c] border border-emerald-500/30 rounded-2xl p-1.5 sm:px-3 flex-wrap">
            <span className="text-[11px] text-zinc-400 font-bold whitespace-nowrap">Sua Tag:</span>
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const clean = customTag.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
                  if (!clean) return;
                  updateAffiliateCode(clean);
                  setTagSuccess(true);
                  await fetchSync();
                  setTimeout(() => setTagSuccess(false), 2000);
                }
              }}
              placeholder="sua_tag"
              className="bg-black/60 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-mono font-bold w-24 sm:w-28 focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={async () => {
                const clean = customTag.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
                if (!clean) return;
                updateAffiliateCode(clean);
                setTagSuccess(true);
                await fetchSync();
                setTimeout(() => setTagSuccess(false), 2000);
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-dark-950 text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {tagSuccess ? "Puxado! ✓" : "Atualizar"}
            </button>

            {/* Authorization Status Badge */}
            {tagAuthStatus === "approved" && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Tag Aprovada</span>
                <span className="sm:hidden">✓</span>
              </span>
            )}

            {tagAuthStatus === "pending" && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" />
                <span>Em Análise</span>
              </span>
            )}

            {tagAuthStatus === "rejected" && (
              <button
                onClick={() => setRequestTagModalOpen(true)}
                className="px-2 py-0.5 rounded-md bg-red-500/15 hover:bg-red-500/25 text-red-400 text-[10px] font-bold border border-red-500/30 flex items-center gap-1 transition cursor-pointer"
              >
                <XCircle className="w-3 h-3" />
                <span>Recusada (Reenviar)</span>
              </button>
            )}

            {tagAuthStatus === "unrequested" && (
              <button
                onClick={() => setRequestTagModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[10px] font-black uppercase border border-amber-500/40 flex items-center gap-1 transition cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Pedir Aprovação</span>
              </button>
            )}
          </div>
        </div>

        {/* Security / Verification Banners */}
        {tagAuthStatus === "pending" && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3 animate-in fade-in duration-200">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-amber-400 font-bold text-sm">Titularidade da Tag em Análise pelo Administrador</strong>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  {customTag}
                </span>
              </div>
              <p className="text-zinc-300 mt-1 leading-relaxed">
                Você solicitou a vinculação desta tag. Para proteção financeira da comunidade de criadores, o administrador precisa validar a posse da conta na plataforma antes de liberar o saldo e saques.
              </p>
            </div>
          </div>
        )}

        {tagAuthStatus === "unrequested" && (
          <div className="rounded-2xl bg-[#0e1610] border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-white font-bold text-sm">Tag Requer Aprovação de Titularidade</strong>
                  <span className="px-2 py-0.5 rounded-full bg-black border border-white/10 text-amber-400 font-mono text-[10px] font-bold">
                    {customTag}
                  </span>
                </div>
                <p className="text-zinc-400 mt-1">
                  Não é possível acessar dados ou saldo de uma tag externa sem comprovação de que você é o titular da conta.
                </p>
              </div>
            </div>
            <button
              onClick={() => setRequestTagModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Pedir Aprovação desta Tag</span>
            </button>
          </div>
        )}

        {tagAuthStatus === "rejected" && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-red-400 font-bold text-sm">Solicitação de Tag Recusada pelo Administrador</strong>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono text-[10px] font-bold">
                    {customTag}
                  </span>
                </div>
                <p className="text-zinc-300 mt-1">
                  {tagAuthMessage || "A titularidade desta conta não pôde ser confirmada pelo administrador."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setRequestTagModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-lg shadow-red-500/20"
            >
              Reenviar Comprovação
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {displayAffiliateStats.map((item) => {
            const correspondingGame = games.find((g) => g.id === item.game_id);

            return (
              <div
                key={item.game_id}
                className="group relative rounded-3xl bg-[#0c140f] border-2 border-emerald-500/25 hover:border-emerald-400 p-5 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Game Header: Logo/Banner + Name + Category */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-emerald-500/30 shadow-md">
                      <img
                        src={item.thumbnail_url}
                        alt={item.game_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {item.commission_rate}
                        </span>
                      </div>

                      <h3 className="font-pixel text-sm sm:text-base text-white mt-1.5 truncate">
                        {item.game_name}
                      </h3>

                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Cliques</span>
                          <span className="font-bold text-white">{item.clicks}</span>
                        </div>
                        <div className="w-[1px] h-5 bg-white/10" />
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Cadastros</span>
                          <span className="font-bold text-white">{item.signups}</span>
                        </div>
                        <div className="w-[1px] h-5 bg-white/10" />
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Depósitos</span>
                          <span className="font-bold text-emerald-400">{item.deposits_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Game Balance Box */}
                  <div className="rounded-2xl bg-black/40 border border-emerald-500/20 p-3.5 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-zinc-400">
                        Saldo a Sacar deste Jogo
                      </div>
                      <div className="text-xl font-pixel text-emerald-400 font-black mt-0.5">
                        {formatCurrency(item.available_balance)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenWithdraw(item.game_id)}
                      disabled={item.available_balance <= 0}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-dark-950 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Sacar Jogo</span>
                    </button>
                  </div>

                  {/* Unique Tracking Link with Copy & Test Buttons */}
                  <div className="space-y-1.5 mb-4">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Seu Link de Divulgação Oficial (Rastreamento em Tempo Real):
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono truncate select-all">
                        {item.referral_url}
                      </div>

                      <button
                        onClick={() => handleCopyLink(item.referral_url, item.game_id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                          copiedLink === item.game_id
                            ? "bg-emerald-500 text-dark-950 font-black"
                            : "bg-dark-850 hover:bg-dark-800 text-white border border-white/10"
                        }`}
                      >
                        {copiedLink === item.game_id ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <a
                        href={item.referral_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap"
                        title="Abrir em nova aba para testar contagem de cliques em tempo real"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Testar</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons: Test Game in Arcade Player + Open External */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  {correspondingGame && (
                    <button
                      onClick={() => openGamePlayer(correspondingGame)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      <span>Testar no Player</span>
                    </button>
                  )}

                  <a
                    href={item.referral_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
                    title="Abrir jogo em nova aba"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3.5 TOP AFILIADOS DA PLATAFORMA (PROVA SOCIAL)                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="font-pixel text-base sm:text-lg text-white uppercase tracking-wider">
                TOP AFILIADOS DA PLATAFORMA
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-pixel border border-emerald-500/30">
                TEMPORADA 2026
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Criadores e streamers que mais estão faturando comissões automáticas via PIX promovendo nossos 4 jogos.
            </p>
          </div>

          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Ver Ranking Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SIMULATED_AFFILIATE_INFLUENCERS.slice(0, 4).map((inf) => (
            <div
              key={inf.id}
              className="relative rounded-3xl bg-[#0c140f] border border-white/10 hover:border-emerald-500/50 p-4 transition-all duration-200 shadow-lg flex flex-col justify-between group"
            >
              {/* Badge Rank */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 font-pixel text-xs font-bold text-white flex items-center gap-1">
                  {inf.rank === 1 && "🥇 TOP 1"}
                  {inf.rank === 2 && "🥈 TOP 2"}
                  {inf.rank === 3 && "🥉 TOP 3"}
                  {inf.rank > 3 && `#${inf.rank}`}
                </span>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                  style={{
                    borderColor: `${inf.topGameColor}33`,
                    backgroundColor: `${inf.topGameColor}15`,
                    color: inf.topGameColor,
                  }}
                >
                  {inf.topGameEmoji} {inf.topGameName}
                </span>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                  <img src={inf.avatar} alt={inf.stageName} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-white truncate">{inf.stageName}</span>
                    {inf.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">@{inf.username}</div>
                  <div className="text-[10px] text-zinc-500">{inf.audience}</div>
                </div>
              </div>

              {/* Stats Box */}
              <div className="pt-3 border-t border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Total Sacado PIX:</span>
                  <span className="font-pixel text-sm text-emerald-400 font-black">
                    {formatCurrency(inf.totalWithdrawnPix)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Leads convertidos:</span>
                  <span className="font-bold text-white">{inf.totalLeads}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>Último saque:</span>
                  <span className="text-zinc-400">{inf.recentPixWithdrawal.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LIVE CONVERSION FEED (HISTÓRICO EM TEMPO REAL)                         */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0a100c] border border-emerald-500/20 p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
                FEED DE CONVERSÕES AO VIVO
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Comissões que pingaram dos jogadores indicados através dos seus 4 links de afiliado.
            </p>
          </div>

          {/* Filter by Game */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedGameFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedGameFilter === "all"
                  ? "bg-emerald-500 text-dark-950 font-black"
                  : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              Todos ({allConversions.length})
            </button>
            {displayAffiliateStats.map((g) => (
              <button
                key={g.game_id}
                onClick={() => setSelectedGameFilter(g.game_id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === g.game_id
                    ? "bg-emerald-500 text-dark-950 font-black"
                    : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {g.game_name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Conversions List */}
        <div className="divide-y divide-white/5">
          {filteredConversions.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6 fill-emerald-400/20" />
              </div>
              <div className="text-sm font-bold text-white">Nenhuma comissão registrada ainda</div>
              <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                Copie seus links de divulgação dos 4 jogos acima, divulgue nos seus Stories, Reels ou bio e acompanhe cada clique e depósito caindo aqui em tempo real.
              </p>
            </div>
          ) : (
            filteredConversions.map((conv) => (
              <div
                key={conv.id}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-pixel text-xs">
                    💰
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {conv.lead_name}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        @{conv.lead_username}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span className="text-emerald-400 font-medium">{conv.game_name}</span>
                      <span>•</span>
                      <span className="capitalize">{conv.type}</span>
                      {conv.amount_deposited && (
                        <>
                          <span>•</span>
                          <span>Depositou {formatCurrency(conv.amount_deposited)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-pixel text-emerald-400 font-black">
                    +{formatCurrency(conv.commission_amount)}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {new Date(conv.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL DE SAQUE INSTANTÂNEO VIA PIX                                     */}
      {/* ========================================================================= */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 md:backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0a110c] border-2 border-emerald-500/40 p-4 sm:p-6 shadow-2xl shadow-emerald-500/20 arcade-box max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                if (!isProcessing) {
                  setWithdrawModalOpen(false);
                  setReceipt(null);
                }
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
            >
              ✕
            </button>

            {receipt ? (
              /* Receipt View */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <div className="text-xs font-pixel text-emerald-400 uppercase">
                    SAQUE PIX CONFIRMADO!
                  </div>
                  <div className="text-3xl font-pixel text-white font-black mt-2">
                    {formatCurrency(receipt.amount)}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Transferência bancária instantânea liquidada com sucesso no BACEN.
                  </p>
                </div>

                {/* Digital Receipt Card */}
                <div className="rounded-2xl bg-black/60 border border-emerald-500/30 p-4 text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">ID da Transação:</span>
                    <span className="text-emerald-400 font-bold">{receipt.txId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Origem do Saldo:</span>
                    <span className="text-white">{receipt.gameName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Método de Transferência:</span>
                    <span className="text-emerald-400 font-bold">PIX Banco Central (SPI)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Chave PIX ({pixKeyType.toUpperCase()}):</span>
                    <span className="text-white">{receipt.pixKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Horário da Transferência:</span>
                    <span className="text-white">{receipt.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWithdrawModalOpen(false);
                    setReceipt(null);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition cursor-pointer"
                >
                  CONCLUÍDO
                </button>
              </div>
            ) : (
              /* Withdrawal Form */
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Zap className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-sm sm:text-base text-white">
                      SOLICITAR SAQUE PIX
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Transferência automática para a sua conta bancária
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Game Origin Selector */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Origem dos Fundos
                  </label>
                  <select
                    value={withdrawGameId}
                    onChange={(e) => {
                      const gid = e.target.value;
                      setWithdrawGameId(gid);
                      if (gid === "all") {
                        setWithdrawAmount(currentAvailableBalance.toFixed(2));
                      } else {
                        const target = displayAffiliateStats.find((s) => s.game_id === gid);
                        setWithdrawAmount(target ? target.available_balance.toFixed(2) : "0.00");
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="all">
                      Saldo Consolidado (Todos os 4 Jogos) - Disponível: {formatCurrency(currentAvailableBalance)}
                    </option>
                    {displayAffiliateStats.map((g) => (
                      <option key={g.game_id} value={g.game_id}>
                        {g.game_name} - Disponível: {formatCurrency(g.available_balance)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount input */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Valor do Saque (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-zinc-400 font-bold text-sm">
                      R$
                    </span>
                    <input
                      type="text"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-base font-black text-emerald-400 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  {/* Quick Chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[50, 100, 500, 1000].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setWithdrawAmount(val.toFixed(2))}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-zinc-300 transition cursor-pointer"
                      >
                        +R$ {val}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const maxVal =
                          withdrawGameId === "all"
                            ? currentAvailableBalance
                            : displayAffiliateStats.find((s) => s.game_id === withdrawGameId)?.available_balance || 0;
                        setWithdrawAmount(maxVal.toFixed(2));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold transition ml-auto cursor-pointer"
                    >
                      TUDO
                    </button>
                  </div>
                </div>

                {/* PIX Key Type */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Tipo de Chave PIX
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "cpf", label: "CPF/CNPJ" },
                      { id: "email", label: "E-mail" },
                      { id: "phone", label: "Telefone" },
                      { id: "random", label: "Aleatória" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setPixKeyType(item.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          pixKeyType === item.id
                            ? "bg-emerald-500 text-dark-950 font-black"
                            : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PIX Key Input */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Sua Chave PIX
                  </label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder={
                      pixKeyType === "cpf"
                        ? "000.000.000-00"
                        : pixKeyType === "email"
                        ? "seuemail@exemplo.com"
                        : pixKeyType === "phone"
                        ? "(11) 98765-4321"
                        : "Chave aleatória EVP"
                    }
                    className="w-full p-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                      <span>AUTENTICANDO COM O BANCO CENTRAL...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-dark-950" />
                      <span>CONFIRMAR E TRANSFERIR VIA PIX</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Solicitar Vinculação e Comprovação de Tag */}
      {requestTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmittingTagReq(true);
              setTagReqFeedback(null);
              try {
                const res = await fetch("/api/affiliates/tag-authorizations/request", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    tag: customTag,
                    platform: requestTagPlatform,
                    proof_url: requestTagProofUrl,
                    notes: requestTagNotes,
                    creator_id: currentUser?.id || "unregistered_creator",
                    creator_name: currentUser?.name || currentUser?.username || "Criador",
                    creator_email: currentUser?.email || "",
                  }),
                });
                const data = await res.json();
                if (data.success) {
                  setTagReqFeedback("Solicitação enviada com sucesso! O administrador já pode aprovar no painel.");
                  await fetchSync();
                  setTimeout(() => {
                    setRequestTagModalOpen(false);
                    setTagReqFeedback(null);
                  }, 1800);
                } else {
                  alert(data.message || "Erro ao enviar solicitação.");
                }
              } catch (err: any) {
                alert("Falha na conexão ao enviar pedido.");
              } finally {
                setIsSubmittingTagReq(false);
              }
            }}
            className="w-full max-w-lg rounded-3xl bg-dark-950 border border-amber-500/40 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Solicitar Aprovação de Titularidade</h3>
                <p className="text-xs text-zinc-400">Comprovação necessária para puxar saldos e habilitar saques</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Para proteger as comissões e evitar que outras pessoas usem sua conta, informe os detalhes abaixo para que o administrador aprove seu vínculo.
            </p>

            {tagReqFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{tagReqFeedback}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Tag Solicitada</label>
                <input
                  type="text"
                  readOnly
                  value={customTag}
                  className="w-full rounded-xl bg-black/60 border border-white/10 p-2.5 text-amber-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Plataforma do Jogo *</label>
                <select
                  value={requestTagPlatform}
                  onChange={(e) => setRequestTagPlatform(e.target.value)}
                  className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="Fruit Cash">Fruit Cash</option>
                  <option value="KRS 777 (Casino Online)">KRS 777 (Casino Online)</option>
                  <option value="Blockerino">Blockerino</option>
                  <option value="Bubble Cash">Bubble Cash</option>
                  <option value="Todas as Plataformas">Todas as Plataformas</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Link do seu perfil / print de comprovação (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/print-do-meu-perfil.png"
                  value={requestTagProofUrl}
                  onChange={(e) => setRequestTagProofUrl(e.target.value)}
                  className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Mensagem / Justificativa de Titularidade *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Esta tag pivetti.jr pertence à minha conta cadastrada no Fruit Cash com o email pivetti.jr@icloud.com..."
                  value={requestTagNotes}
                  onChange={(e) => setRequestTagNotes(e.target.value)}
                  className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setRequestTagModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmittingTagReq}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isSubmittingTagReq ? "Enviando..." : "Enviar Pedido ao Admin"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
