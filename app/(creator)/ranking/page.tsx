"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  DollarSign,
  Filter,
  Search,
  Users,
  ExternalLink,
  Gamepad2,
  ArrowUpRight,
  Medal,
  Award,
  Clock,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency, formatXP } from "@/lib/utils";
import {
  SIMULATED_AFFILIATE_INFLUENCERS,
  SIMULATED_AFFILIATE_ACTIVITIES,
  AffiliateLeaderboardInfluencer,
} from "@/lib/affiliate-leaderboard-data";

export default function RankingPage() {
  const { currentUser, totalAffiliateBalance, games, openGamePlayer } = useKrsStore();
  const creatorUser = currentUser as any;

  // Active Tab: 'afiliados' (default) | 'xp'
  const [activeTab, setActiveTab] = useState<"afiliados" | "xp">("afiliados");

  // Filters for Affiliate Ranking
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Process and filter the affiliate leaderboard
  const filteredAffiliates = useMemo(() => {
    let list = [...SIMULATED_AFFILIATE_INFLUENCERS];

    // Filter by game
    if (selectedGameFilter !== "all") {
      list = list.filter((inf) => inf.topGameId === selectedGameFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (inf) =>
          inf.name.toLowerCase().includes(q) ||
          inf.stageName.toLowerCase().includes(q) ||
          inf.username.toLowerCase().includes(q) ||
          inf.topGameName.toLowerCase().includes(q)
      );
    }

    // Sort by selected timeframe earnings
    list.sort((a, b) => {
      const aVal =
        timeframe === "weekly"
          ? a.weeklyWithdrawnPix
          : timeframe === "monthly"
          ? a.monthlyWithdrawnPix
          : a.totalWithdrawnPix;
      const bVal =
        timeframe === "weekly"
          ? b.weeklyWithdrawnPix
          : timeframe === "monthly"
          ? b.monthlyWithdrawnPix
          : b.totalWithdrawnPix;
      return bVal - aVal;
    });

    // Reassign temporary rank based on current sorted list
    return list.map((inf, idx) => ({
      ...inf,
      computedRank: idx + 1,
    }));
  }, [selectedGameFilter, searchQuery, timeframe]);

  // Current User's dynamic positioning
  const userEarnings = totalAffiliateBalance || 0;
  const userRank = useMemo(() => {
    const higherEarners = filteredAffiliates.filter((inf) => {
      const val =
        timeframe === "weekly"
          ? inf.weeklyWithdrawnPix
          : timeframe === "monthly"
          ? inf.monthlyWithdrawnPix
          : inf.totalWithdrawnPix;
      return val > userEarnings;
    });
    return higherEarners.length + 1;
  }, [filteredAffiliates, userEarnings, timeframe]);

  // Top 3 for the Podium
  const top1 = filteredAffiliates[0];
  const top2 = filteredAffiliates[1];
  const top3 = filteredAffiliates[2];

  // XP Demo Leaderboard
  const DEMO_XP_LEADERBOARD = [
    {
      rank: 2,
      name: "Beatriz Lima",
      username: "biagames",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      level: 4,
      levelName: "Creator Pro",
      xp: 1920,
      streak: 4,
      campaigns: 5,
      approvalRate: "96%",
      isCurrentUser: false,
    },
    {
      rank: 3,
      name: "Gabriel Santos",
      username: "gabriel_play",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      level: 4,
      levelName: "Creator Pro",
      xp: 1680,
      streak: 3,
      campaigns: 4,
      approvalRate: "95%",
      isCurrentUser: false,
    },
    {
      rank: 4,
      name: "Larissa Mendes",
      username: "larissakrs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      level: 3,
      levelName: "Creator Plus",
      xp: 1240,
      streak: 3,
      campaigns: 3,
      approvalRate: "100%",
      isCurrentUser: false,
    },
    {
      rank: 5,
      name: "Matheus Rocha",
      username: "rocha_games",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      level: 3,
      levelName: "Creator Plus",
      xp: 980,
      streak: 2,
      campaigns: 3,
      approvalRate: "92%",
      isCurrentUser: false,
    },
  ];

  const XP_LEADERBOARD_USERS = [
    {
      rank: 1,
      name: creatorUser.name || "Seu Perfil (Creator)",
      username: creatorUser.username || "creator",
      avatar: creatorUser.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      level: creatorUser.current_level || 1,
      levelName: "Starter",
      xp: creatorUser.current_xp || 0,
      streak: creatorUser.streak_weeks || 0,
      campaigns: creatorUser.completed_campaigns_count || 0,
      approvalRate: "100%",
      isCurrentUser: true,
    },
    ...DEMO_XP_LEADERBOARD,
  ];

  // Helper to format values by timeframe
  const getInfluencerEarnings = (inf: AffiliateLeaderboardInfluencer) => {
    if (timeframe === "weekly") return inf.weeklyWithdrawnPix;
    if (timeframe === "monthly") return inf.monthlyWithdrawnPix;
    return inf.totalWithdrawnPix;
  };

  const getInfluencerLeads = (inf: AffiliateLeaderboardInfluencer) => {
    if (timeframe === "weekly") return inf.weeklyLeads;
    return inf.totalLeads;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & NAVIGATION TABS                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-pixel text-emerald-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LEADERBOARD OFICIAL • TEMPORADA 2026</span>
          </div>
          <h1 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wider drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]">
            RANKING DOS CREATORS
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Acompanhe o desempenho dos maiores influenciadores da KRS nos 4 jogos oficiais. Comissões pagas via PIX em tempo real e progressão de carreira.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-dark-900 border border-emerald-500/30 text-xs text-zinc-300 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-medium">Saques Auditados & Transparentes</span>
        </div>
      </div>

      {/* Main Switcher Tabs: Afiliados (PIX) vs XP (Missões) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 max-w-md">
        <button
          onClick={() => setActiveTab("afiliados")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "afiliados"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-dark-950 shadow-lg shadow-emerald-500/30 font-black"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Ranking de Afiliados (PIX)</span>
          <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[9px] text-emerald-300 font-pixel">
            TOP
          </span>
        </button>

        <button
          onClick={() => setActiveTab("xp")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "xp"
              ? "bg-gradient-to-r from-brand-primary to-emerald-500 text-dark-950 shadow-lg shadow-brand-primary/30 font-black"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Ranking de XP & Nível</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RANKING DE AFILIADOS (GANHOS PIX & LEADS)                          */}
      {/* ========================================================================= */}
      {activeTab === "afiliados" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Real-time Activity Ticker */}
          <div className="relative overflow-hidden rounded-2xl bg-[#09120c] border border-emerald-500/30 p-3 sm:px-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-shrink-0 text-emerald-400 font-pixel text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AO VIVO:</span>
            </div>

            <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap text-xs text-zinc-300 flex items-center gap-6">
              {SIMULATED_AFFILIATE_ACTIVITIES.map((act) => (
                <div key={act.id} className="inline-flex items-center gap-2 text-xs">
                  <img
                    src={act.avatar}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400/40"
                  />
                  <span className="font-bold text-white">{act.influencerName}</span>
                  <span className="text-zinc-400">{act.action}</span>
                  {act.amount && (
                    <span className="font-pixel text-emerald-400 font-bold">{act.amount}</span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                    {act.game}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">({act.time})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-dark-900/80 border border-emerald-500/20 p-4">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Total Pago via PIX</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-pixel text-lg sm:text-2xl text-emerald-400 font-black">
                R$ 121.970,00
              </div>
              <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">+28%</span> vs mês passado
              </div>
            </div>

            <div className="rounded-2xl bg-dark-900/80 border border-white/5 p-4">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Leads Cadastrados</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="font-pixel text-lg sm:text-2xl text-white font-black">
                7.142 leads
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Nos 4 jogos oficiais da KRS</div>
            </div>

            <div className="rounded-2xl bg-dark-900/80 border border-white/5 p-4">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Conversão Média</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-pixel text-lg sm:text-2xl text-amber-400 font-black">
                14.2%
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Cliques que viram depósitos</div>
            </div>

            <div className="rounded-2xl bg-dark-900/80 border border-white/5 p-4">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Tempo Médio PIX</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="font-pixel text-lg sm:text-2xl text-purple-400 font-black">
                &lt; 45 seg
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Transferência 100% automatizada</div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900/90 border border-white/5 p-4 rounded-3xl">
            {/* Game Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setSelectedGameFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === "all"
                    ? "bg-emerald-500 text-dark-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-black/50 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                🕹️ Todos os Jogos
              </button>

              <button
                onClick={() => setSelectedGameFilter("game-fruit-cash")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === "game-fruit-cash"
                    ? "bg-emerald-500 text-dark-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-black/50 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                🍓 Fruit Cash
              </button>

              <button
                onClick={() => setSelectedGameFilter("game-krs-777")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === "game-krs-777"
                    ? "bg-amber-400 text-dark-950 font-black shadow-md shadow-amber-500/20"
                    : "bg-black/50 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                🎰 KRS 777 Casino
              </button>

              <button
                onClick={() => setSelectedGameFilter("game-blockerino")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === "game-blockerino"
                    ? "bg-cyan-400 text-dark-950 font-black shadow-md shadow-cyan-500/20"
                    : "bg-black/50 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                🧩 Blockerino
              </button>

              <button
                onClick={() => setSelectedGameFilter("game-bubbles-cash")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === "game-bubbles-cash"
                    ? "bg-purple-400 text-dark-950 font-black shadow-md shadow-purple-500/20"
                    : "bg-black/50 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                🎯 Bubble Cash
              </button>
            </div>

            {/* Timeframe & Search */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setTimeframe("weekly")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    timeframe === "weekly"
                      ? "bg-white/20 text-white font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setTimeframe("monthly")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    timeframe === "monthly"
                      ? "bg-white/20 text-white font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setTimeframe("all")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    timeframe === "all"
                      ? "bg-emerald-500 text-dark-950 font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Geral
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar influencer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 w-36 sm:w-44"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TOP 3 PODIUM - ARCADE NEO-BRUTALIST                                       */}
          {/* ========================================================================= */}
          {top1 && top2 && top3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
              {/* RANK 2 - SILVER */}
              <div className="relative rounded-3xl border-2 border-zinc-400/40 bg-gradient-to-b from-[#11161d] to-[#0a0d11] p-6 flex flex-col items-center text-center justify-between shadow-xl order-2 md:order-1 transition-transform hover:-translate-y-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-zinc-300 to-zinc-400 text-dark-950 font-black text-[9px] font-pixel flex items-center gap-1 shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                  TOP 2 AFILIADO
                </div>

                <div className="w-full mt-3">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-dark-850 border-2 border-zinc-300 mb-3 mx-auto shadow-lg">
                    <img src={top2.avatar} alt={top2.stageName} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[10px]">
                      {top2.topGameEmoji}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center justify-center gap-1">
                    <span>{top2.stageName}</span>
                    {top2.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 inline" />}
                  </h3>
                  <div className="text-xs text-zinc-400">@{top2.username} • {top2.audience}</div>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                    <span>{top2.topGameName}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 w-full space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Leads Convertidos:</span>
                    <span className="font-bold text-white">{getInfluencerLeads(top2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Taxa de Conversão:</span>
                    <span className="font-bold text-cyan-400">{top2.conversionRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <span className="text-zinc-400 font-semibold">Total PIX:</span>
                    <span className="font-pixel text-base text-zinc-200 font-black">
                      {formatCurrency(getInfluencerEarnings(top2))}
                    </span>
                  </div>
                </div>
              </div>

              {/* RANK 1 - CHAMPION GOLD */}
              <div className="relative rounded-3xl border-2 border-emerald-400 bg-gradient-to-b from-[#102418] via-[#09150e] to-[#050b07] p-6 sm:p-8 flex flex-col items-center text-center justify-between shadow-2xl shadow-emerald-500/25 arcade-box order-1 md:order-2 md:-translate-y-3 transition-transform hover:-translate-y-4">
                <div className="arcade-scanlines pointer-events-none opacity-20" />
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-dark-950 font-black text-[10px] font-pixel flex items-center gap-1.5 shadow-xl shadow-amber-500/30">
                  <Crown className="w-4 h-4 fill-dark-950" />
                  TOP 1 AFILIADO OFICIAL
                </div>

                <div className="w-full mt-2">
                  <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-dark-850 border-3 border-emerald-400 mb-3 mx-auto shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-500/20">
                    <img src={top1.avatar} alt={top1.stageName} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/85 text-xs shadow">
                      {top1.topGameEmoji}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                    <span>{top1.stageName}</span>
                    {top1.verified && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                  </h3>
                  <div className="text-xs text-emerald-400/90 font-medium">@{top1.username} • {top1.audience}</div>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-bold">
                    <span>{top1.topGameName}</span>
                    <span>•</span>
                    <span className="text-[10px] uppercase font-pixel">{top1.topGameCategory}</span>
                  </div>
                </div>

                <div className="mt-6 pt-3.5 border-t border-emerald-500/30 w-full space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Leads Convertidos:</span>
                    <span className="font-bold text-white">{getInfluencerLeads(top1)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Taxa de Conversão:</span>
                    <span className="font-bold text-emerald-400">{top1.conversionRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-emerald-500/20">
                    <span className="text-zinc-300 font-bold">Total PIX Sacado:</span>
                    <span className="font-pixel text-xl text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(0,245,155,0.5)]">
                      {formatCurrency(getInfluencerEarnings(top1))}
                    </span>
                  </div>
                </div>
              </div>

              {/* RANK 3 - BRONZE */}
              <div className="relative rounded-3xl border-2 border-amber-700/50 bg-gradient-to-b from-[#19130d] to-[#0c0906] p-6 flex flex-col items-center text-center justify-between shadow-xl order-3 transition-transform hover:-translate-y-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-[9px] font-pixel flex items-center gap-1 shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                  TOP 3 AFILIADO
                </div>

                <div className="w-full mt-3">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-dark-850 border-2 border-amber-600/70 mb-3 mx-auto shadow-lg">
                    <img src={top3.avatar} alt={top3.stageName} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[10px]">
                      {top3.topGameEmoji}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center justify-center gap-1">
                    <span>{top3.stageName}</span>
                    {top3.verified && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 inline" />}
                  </h3>
                  <div className="text-xs text-zinc-400">@{top3.username} • {top3.audience}</div>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                    <span>{top3.topGameName}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 w-full space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Leads Convertidos:</span>
                    <span className="font-bold text-white">{getInfluencerLeads(top3)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Taxa de Conversão:</span>
                    <span className="font-bold text-amber-400">{top3.conversionRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <span className="text-zinc-400 font-semibold">Total PIX:</span>
                    <span className="font-pixel text-base text-amber-400 font-black">
                      {formatCurrency(getInfluencerEarnings(top3))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CURRENT USER POSITION IN LEADERBOARD (DYNAMIC CARD)                       */}
          {/* ========================================================================= */}
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-[#0d1f15] via-[#09150e] to-dark-900 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-pixel text-emerald-400 text-lg font-black flex-shrink-0">
                #{userRank}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm sm:text-base">
                    {creatorUser.name || "Seu Perfil"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-dark-950 font-pixel text-[9px] font-black uppercase">
                    VOCÊ
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  @{creatorUser.username || "creator"} • Total acumulado em comissões:{" "}
                  <strong className="text-emerald-400">{formatCurrency(userEarnings)}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase">Seu Saldo Disponível</div>
                <div className="text-base sm:text-lg font-pixel text-emerald-400 font-black">
                  {formatCurrency(userEarnings)}
                </div>
              </div>

              <Link
                href="/afiliados"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-500/20"
              >
                <span>Pegar Links & Subir</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPLETE TABLE OF AFFILIATE INFLUENCERS                                    */}
          {/* ========================================================================= */}
          <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
            <div className="p-5 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Classificação Completa dos Influenciadores</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-normal">
                    {filteredAffiliates.length} criadores ativos
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Atualizado em tempo real de acordo com as validações de depósitos dos jogos.
                </p>
              </div>

              <div className="text-[11px] text-zinc-400 font-medium">
                Ordenado por: <span className="text-emerald-400 font-bold uppercase">{timeframe === "all" ? "Geral (Total)" : timeframe === "weekly" ? "Esta Semana" : "Este Mês"}</span>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-950/90 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-6">Posição</th>
                    <th className="py-3.5 px-6">Influenciador / Canal</th>
                    <th className="py-3.5 px-6">Jogo Principal</th>
                    <th className="py-3.5 px-6 text-center">Leads Qualificados</th>
                    <th className="py-3.5 px-6 text-center">Conversão</th>
                    <th className="py-3.5 px-6 text-center">Último Saque</th>
                    <th className="py-3.5 px-6 text-right">Comissões PIX</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAffiliates.map((inf) => {
                    const isPodium = inf.computedRank <= 3;

                    return (
                      <tr
                        key={inf.id}
                        className="hover:bg-dark-850/60 transition group"
                      >
                        <td className="py-4 px-6 font-bold text-white">
                          <div className="flex items-center gap-2">
                            {inf.computedRank === 1 && <span className="text-base">🥇</span>}
                            {inf.computedRank === 2 && <span className="text-base">🥈</span>}
                            {inf.computedRank === 3 && <span className="text-base">🥉</span>}
                            <span
                              className={`font-pixel ${
                                isPodium ? "text-white font-black" : "text-zinc-400"
                              }`}
                            >
                              #{inf.computedRank}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={inf.avatar}
                                alt={inf.stageName}
                                className="h-10 w-10 rounded-xl object-cover border border-white/10"
                              />
                              <span className="absolute -bottom-1 -right-1 text-[10px]">
                                {inf.topGameEmoji}
                              </span>
                            </div>

                            <div>
                              <div className="text-white font-bold flex items-center gap-1.5">
                                <span>{inf.stageName}</span>
                                {inf.verified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                <span>@{inf.username}</span>
                                <span>•</span>
                                <span className="text-zinc-500">{inf.audience}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border"
                            style={{
                              borderColor: `${inf.topGameColor}33`,
                              backgroundColor: `${inf.topGameColor}15`,
                              color: inf.topGameColor,
                            }}
                          >
                            <span>{inf.topGameEmoji}</span>
                            <span>{inf.topGameName}</span>
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center font-bold text-white">
                          {getInfluencerLeads(inf).toLocaleString("pt-BR")}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[11px]">
                            {inf.conversionRate}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center text-zinc-400 text-[11px]">
                          <span className="text-white font-semibold">
                            {formatCurrency(inf.recentPixWithdrawal.amount)}
                          </span>{" "}
                          <span className="text-zinc-500 font-mono text-[10px]">
                            ({inf.recentPixWithdrawal.timeAgo})
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="font-pixel font-black text-emerald-400 text-sm">
                            {formatCurrency(getInfluencerEarnings(inf))}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">via PIX direto</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Proof Footer Notice */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                As métricas acima são calculadas com base nas transações processadas pelos gateways oficiais dos 4 jogos da KRS.
              </span>
            </div>

            <Link
              href="/afiliados"
              className="text-emerald-400 hover:text-emerald-300 font-bold whitespace-nowrap flex items-center gap-1"
            >
              <span>Acessar Painel de Afiliado</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RANKING DE XP & NÍVEL (MISSÕES & CAMPANHAS)                         */}
      {/* ========================================================================= */}
      {activeTab === "xp" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top 3 Podium for XP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Rank 2 */}
            <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 flex flex-col items-center text-center justify-between order-2 md:order-1">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  #2 LUGAR
                </div>
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-dark-850 border-2 border-zinc-400 mb-3 mx-auto">
                  <img src={XP_LEADERBOARD_USERS[1].avatar} alt="" className="h-full w-full object-cover" />
                </div>
                <h3 className="text-sm font-bold text-white">{XP_LEADERBOARD_USERS[1].name}</h3>
                <div className="text-[11px] text-zinc-400">@{XP_LEADERBOARD_USERS[1].username}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 w-full flex justify-between text-xs">
                <span className="text-zinc-400">Pontuação:</span>
                <span className="font-bold text-brand-primary">{formatXP(XP_LEADERBOARD_USERS[1].xp)}</span>
              </div>
            </div>

            {/* Rank 1 - Champion */}
            <div className="relative rounded-3xl border-2 border-emerald-400 bg-gradient-to-b from-[#0f1d14] to-[#07100b] p-6 sm:p-8 flex flex-col items-center text-center justify-between shadow-2xl shadow-emerald-500/20 arcade-box order-1 md:order-2 md:-translate-y-2">
              <div className="arcade-scanlines pointer-events-none opacity-20" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-dark-950 font-black text-[9px] font-pixel flex items-center gap-1 shadow-lg">
                <Crown className="w-3.5 h-3.5 fill-dark-950" />
                TOP 1
              </div>

              <div className="mt-2">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-dark-850 border-2 border-emerald-400 mb-3 mx-auto shadow-xl shadow-emerald-500/30">
                  <img src={XP_LEADERBOARD_USERS[0].avatar} alt="" className="h-full w-full object-cover" />
                </div>
                <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                  <span>{XP_LEADERBOARD_USERS[0].name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-pixel">VOCÊ</span>
                </h3>
                <div className="text-xs text-emerald-400 font-semibold font-mono">@{XP_LEADERBOARD_USERS[0].username}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 w-full flex justify-between text-xs">
                <span className="text-zinc-400">Pontuação:</span>
                <span className="font-pixel text-emerald-400 font-black text-sm">{formatXP(XP_LEADERBOARD_USERS[0].xp)}</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 flex flex-col items-center text-center justify-between order-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  #3 LUGAR
                </div>
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-dark-850 border-2 border-amber-700/60 mb-3 mx-auto">
                  <img src={XP_LEADERBOARD_USERS[2].avatar} alt="" className="h-full w-full object-cover" />
                </div>
                <h3 className="text-sm font-bold text-white">{XP_LEADERBOARD_USERS[2].name}</h3>
                <div className="text-[11px] text-zinc-400">@{XP_LEADERBOARD_USERS[2].username}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 w-full flex justify-between text-xs">
                <span className="text-zinc-400">Pontuação:</span>
                <span className="font-bold text-brand-primary">{formatXP(XP_LEADERBOARD_USERS[2].xp)}</span>
              </div>
            </div>
          </div>

          {/* Complete Table for XP */}
          <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Tabela de Classificação por Nível & XP</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3 px-6">Posição</th>
                    <th className="py-3 px-6">Creator</th>
                    <th className="py-3 px-6">Nível</th>
                    <th className="py-3 px-6">Streak</th>
                    <th className="py-3 px-6">Campanhas</th>
                    <th className="py-3 px-6">Aprovação</th>
                    <th className="py-3 px-6 text-right">XP Acumulado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {XP_LEADERBOARD_USERS.map((user) => (
                    <tr
                      key={user.rank}
                      className={`hover:bg-dark-850/50 transition ${
                        user.isCurrentUser ? "bg-brand-primary/5 font-semibold" : ""
                      }`}
                    >
                      <td className="py-4 px-6 font-bold text-white">
                        {user.rank === 1 && "🥇 1"}
                        {user.rank === 2 && "🥈 2"}
                        {user.rank === 3 && "🥉 3"}
                        {user.rank > 3 && `#${user.rank}`}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                          <div>
                            <div className="text-white font-bold">{user.name}</div>
                            <div className="text-[10px] text-zinc-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded bg-dark-800 text-[10px] text-brand-primary font-bold">
                          Nível {user.level}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-amber-400 font-bold">
                        🔥 {user.streak} sem
                      </td>
                      <td className="py-4 px-6 text-zinc-300">{user.campaigns}</td>
                      <td className="py-4 px-6 text-brand-primary">{user.approvalRate}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-white">
                        {formatXP(user.xp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
