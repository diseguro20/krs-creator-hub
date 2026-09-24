"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Crown,
  Zap,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { ArcadeHeaderBar } from "@/components/gaming/ArcadeHeaderBar";
import { PromotionalCarousel } from "@/components/gaming/PromotionalCarousel";
import { ArcadeGameCard } from "@/components/gaming/ArcadeGameCard";
import { CreatorMobileNav } from "@/components/navigation/CreatorMobileNav";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency } from "@/lib/utils";
import { SIMULATED_AFFILIATE_INFLUENCERS } from "@/lib/affiliate-leaderboard-data";

// Simulated live verified PIX payouts ticker
const LIVE_PIX_PAYOUTS = [
  { name: "Camila Santos", amount: "R$ 2.200,00", time: "há 3 min", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "DJ Alok", amount: "R$ 4.500,00", time: "há 7 min", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Gabriel Ramos", amount: "R$ 1.890,00", time: "há 12 min", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { name: "Lucas Silva", amount: "R$ 950,00", time: "há 18 min", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
  { name: "Amanda Castro", amount: "R$ 1.340,00", time: "há 24 min", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
  { name: "Felipe Neto", amount: "R$ 5.800,00", time: "há 31 min", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop" },
];

export default function LandingPage() {
  const { games, totalAffiliateBalance, affiliateStats, isAffiliateUser } = useKrsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const top1 = SIMULATED_AFFILIATE_INFLUENCERS[0];
  const top2 = SIMULATED_AFFILIATE_INFLUENCERS[1];
  const top3 = SIMULATED_AFFILIATE_INFLUENCERS[2];
  const otherTopCreators = SIMULATED_AFFILIATE_INFLUENCERS.slice(3, 5);

  const filteredGames = useMemo(() => {
    if (selectedCategory === "Todos") return games;
    return games.filter((g) => g.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [games, selectedCategory]);

  const CATEGORY_CHIPS = [
    { id: "Todos", label: "🎮 Todos os Jogos", count: games.length },
    { id: "Habilidade", label: "🍓 Habilidade (Frutinha)", count: 2 },
    { id: "Cassino", label: "🎰 Cassino & Slots", count: 1 },
    { id: "Puzzle", label: "🧩 Puzzle 10x10", count: 1 },
  ];

  return (
    <div className="relative min-h-screen bg-[#050906] text-white selection:bg-[#00F59B] selection:text-dark-950 font-sans pb-32 sm:pb-36 lg:pb-12 overflow-x-hidden">
      {/* Ambient background light orbs */}
      <div className="fixed top-12 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* 1. TOP ARCADE APP BAR */}
      <ArcadeHeaderBar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-10">
        {/* ========================================================================= */}
        {/* 1. CARROSSEL DE DESTAQUES (ASPECT-RATIO HORIZONTAL RÍGIDO - NUNCA CORTA)   */}
        {/* ========================================================================= */}
        <section className="relative">
          <PromotionalCarousel />
        </section>

        {/* ========================================================================= */}
        {/* 2. TICKER DE SAQUES PIX AO VIVO (ALTA CONVERSÃO & ANIMAÇÃO CONTÍNUA)      */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-2xl bg-black/60 border border-emerald-500/25 p-1 backdrop-blur-md shadow-lg shadow-black/80">
          <div className="flex items-center">
            {/* Tag indicador ao vivo */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/25 to-emerald-500/10 border border-emerald-500/35 text-[9px] sm:text-[10px] font-pixel text-[#00F59B] shrink-0 z-10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PIX AO VIVO</span>
            </div>

            {/* Marquee contínua de saques */}
            <div className="relative overflow-hidden flex-1 select-none">
              <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-1 pl-4 text-xs font-medium">
                {[...LIVE_PIX_PAYOUTS, ...LIVE_PIX_PAYOUTS].map((item, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2 shrink-0">
                    <img src={item.avatar} alt={item.name} className="w-5 h-5 rounded-full object-cover border border-emerald-400/40" />
                    <span className="text-zinc-200 text-xs font-semibold">{item.name}</span>
                    <span className="text-zinc-500 text-[10px]">sacou</span>
                    <span className="text-[#00F59B] font-mono tabular-nums font-bold text-xs">{item.amount}</span>
                    <span className="text-zinc-500 text-[10px]">{item.time}</span>
                    <span className="text-zinc-700 mx-1">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CHIPS DE FILTRO MOBILE (SMART SELECTION PATTERN - REVOLUT / SPOTIFY)    */}
        {/* ========================================================================= */}
        <section className="relative -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
            {CATEGORY_CHIPS.map((chip) => {
              const active = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer shadow-sm ${
                    active
                      ? "bg-gradient-to-r from-[#00F59B] to-emerald-400 text-dark-950 font-black shadow-[0_0_16px_rgba(0,245,155,0.4)] ring-1 ring-[#00F59B] scale-[1.02]"
                      : "bg-[#0b160f] text-zinc-300 hover:text-white border border-white/5 hover:border-emerald-500/30"
                  }`}
                >
                  <span>{chip.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      active ? "bg-black/25 text-dark-950 font-black" : "bg-white/10 text-zinc-400"
                    }`}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. JOGOS OFICIAIS (GRID RESPONSIVA 2 COLUNAS MOBILE / 4 DESKTOP)          */}
        {/* ========================================================================= */}
        <section id="jogos" className="space-y-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2.5 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">🎮</span>
                <h1 className="font-pixel text-lg sm:text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-[0_0_12px_rgba(0,245,155,0.3)]">
                  JOGOS OFICIAIS
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00F59B] text-xs font-mono font-bold border border-emerald-500/30">
                  {filteredGames.length} ativos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Jogue agora no player arcade, copie seu link e fature com saques imediatos via PIX.
              </p>
            </div>

            <Link
              href="/afiliados"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00F59B] hover:text-emerald-300 transition"
            >
              <span>Painel de Afiliado & Saque PIX</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2-Column Mobile / 4-Column Desktop Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredGames.map((game) => (
              <ArcadeGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. RANKING DOS CREATORS (LEADERBOARD PODIUM - ESTILO DUOLINGO / REVOLUT)  */}
        {/* ========================================================================= */}
        <section id="ranking" className="space-y-4 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2.5 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">🏆</span>
                <h2 className="font-pixel text-lg sm:text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]">
                  RANKING DOS CREATORS
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 uppercase">
                  Top Afiliados PIX
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Criadores e afiliados com maiores volumes de saques confirmados via PIX em tempo real.
              </p>
            </div>

            <Link
              href="/ranking"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Ver Tabela Completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top 3 Visual Podium (Mobile App Hierarchy - 100% Contido e sem vazamento) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 pt-1">
            {/* 2º LUGAR (SILVER MEDALIST) */}
            {top2 && (
              <div className="order-2 md:order-1 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0e1711] via-[#09120c] to-[#050a07] border border-zinc-600/40 hover:border-zinc-400/70 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-black/80 transition-all duration-300 hover:-translate-y-1">
                {/* Header row with medal badge & status */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-500/50 text-[10px] font-pixel text-zinc-200 font-bold shadow-sm">
                    <span>🥈 2º LUGAR</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Avatar & Info Row (Guaranteed No Overflow) */}
                <div className="flex items-center gap-3.5 mb-3.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={top2.avatar}
                      alt={top2.stageName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-zinc-400/70 shadow-lg shadow-black/60"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 text-dark-950 font-black text-[11px] flex items-center justify-center shadow-md">
                      2
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug flex items-center gap-1.5 truncate">
                      <span className="truncate">{top2.stageName}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">@{top2.username}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
                      <span>👥</span>
                      <span className="truncate">{top2.audience}</span>
                    </span>
                  </div>
                </div>

                {/* Financial Footer */}
                <div className="pt-3 border-t border-white/10 space-y-2 mt-auto">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Total Sacado (PIX):</span>
                    <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                      {formatCurrency(top2.totalWithdrawnPix)}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-300 flex items-center gap-1.5 bg-black/50 border border-white/5 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="truncate">Último saque: R$ {top2.recentPixWithdrawal.amount.toFixed(2).replace(".", ",")} {top2.recentPixWithdrawal.timeAgo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 1º LUGAR (CHAMPION - GOLD TROPHY & ANIMATED SHIMMER/GLOW) */}
            {top1 && (
              <div className="order-1 md:order-2 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#182a1b] via-[#0f1d13] to-[#070e09] border-2 border-amber-400/80 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-amber-500/15 md:-translate-y-2.5 transition-all duration-300 hover:shadow-amber-500/25 animate-champion-glow">
                {/* Radiant Gold Glow Background */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none animate-shimmer-sweep" />

                {/* Header row with Champion badge & Crown */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/80 text-[10px] font-pixel text-amber-300 font-black shadow-md shadow-amber-500/20">
                    <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-float-gentle" />
                    <span>👑 TOP 1 GERAL</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300/90 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Líder Absoluto
                  </span>
                </div>

                {/* Avatar & Info Row (Guaranteed No Overflow) */}
                <div className="relative z-10 flex items-center gap-3.5 mb-4 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={top1.avatar}
                      alt={top1.stageName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-400/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-dark-950 font-black text-xs flex items-center justify-center shadow-lg border border-black/40">
                      1
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-white text-base sm:text-lg leading-snug flex items-center gap-1.5 truncate">
                      <span className="truncate">{top1.stageName}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                    </h3>
                    <p className="text-xs text-amber-200/90 font-mono truncate">@{top1.username}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span className="truncate">{top1.audience}</span>
                    </span>
                  </div>
                </div>

                {/* Financial Footer with High Contrast Peak Accent */}
                <div className="relative z-10 pt-3 border-t border-amber-400/25 space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-100/80 font-medium">Total Sacado (PIX):</span>
                    <span className="font-mono tabular-nums text-lg sm:text-2xl font-black text-[#00F59B] drop-shadow-[0_0_14px_rgba(0,245,155,0.7)]">
                      {formatCurrency(top1.totalWithdrawnPix)}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 bg-black/60 border border-emerald-500/30 p-2.5 rounded-xl shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="truncate font-medium">Último saque: R$ {top1.recentPixWithdrawal.amount.toFixed(2).replace(".", ",")} {top1.recentPixWithdrawal.timeAgo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3º LUGAR (BRONZE MEDALIST) */}
            {top3 && (
              <div className="order-3 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#141009] via-[#0d0b07] to-[#070503] border border-amber-700/50 hover:border-amber-600/70 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-black/80 transition-all duration-300 hover:-translate-y-1">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-700/50 text-[10px] font-pixel text-amber-400 font-bold shadow-sm">
                    <span>🥉 3º LUGAR</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Avatar & Info Row (Guaranteed No Overflow) */}
                <div className="flex items-center gap-3.5 mb-3.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={top3.avatar}
                      alt={top3.stageName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-700/70 shadow-lg shadow-black/60"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 font-black text-[11px] flex items-center justify-center shadow-md">
                      3
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug flex items-center gap-1.5 truncate">
                      <span className="truncate">{top3.stageName}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">@{top3.username}</p>
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
                      <span>👥</span>
                      <span className="truncate">{top3.audience}</span>
                    </span>
                  </div>
                </div>

                {/* Financial Footer */}
                <div className="pt-3 border-t border-white/10 space-y-2 mt-auto">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Total Sacado (PIX):</span>
                    <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-amber-200">
                      {formatCurrency(top3.totalWithdrawnPix)}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-300 flex items-center gap-1.5 bg-black/50 border border-white/5 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="truncate">Último saque: R$ {top3.recentPixWithdrawal.amount.toFixed(2).replace(".", ",")} {top3.recentPixWithdrawal.timeAgo}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick List for 4º and 5º and View All Button */}
          <div className="rounded-2xl bg-[#08120c] border border-white/5 p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-300">
              {otherTopCreators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-2 bg-black/40 sm:bg-transparent p-2 sm:p-0 rounded-xl border border-white/5 sm:border-0 min-w-0">
                  <span className="font-pixel text-[11px] text-zinc-500 flex-shrink-0">{creator.rank}º</span>
                  <img src={creator.avatar} alt={creator.stageName} className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                  <span className="font-bold text-white text-xs truncate">{creator.stageName}</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-bold ml-auto sm:ml-0 flex-shrink-0">{formatCurrency(creator.totalWithdrawnPix)}</span>
                </div>
              ))}
            </div>

            <Link
              href="/ranking"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-dark-950 text-white font-bold text-xs uppercase tracking-wider transition shrink-0 active:scale-95 group"
            >
              <span>Ver Tabela Completa</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:text-dark-950 transition-colors" />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. PAINEL DE AFILIADO & SAQUE PIX (CASH APP / REVOLUT BALANCE CARD)       */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1a12] via-[#08130d] to-[#040805] border-2 border-emerald-500/35 p-5 sm:p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden">
          {/* Shimmer light sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none animate-shimmer-sweep" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-pixel text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PAINEL UNIFICADO DE AFILIADOS</span>
              </div>

              <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wide leading-tight">
                TODOS OS SEUS GANHOS <br />
                <span className="text-[#00F59B]">EM UM SÓ LUGAR</span>
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Divulgue o <strong>Fruit Cash</strong>, <strong>KRS 777</strong>, <strong>Blockerino</strong> e <strong>Bubble Cash</strong> em um único painel e solicite saques consolidados instantâneos via PIX na sua conta.
              </p>

              {/* 4 Games Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {affiliateStats.map((item) => (
                  <div key={item.game_id} className="p-2 sm:p-2.5 rounded-xl bg-black/60 border border-emerald-500/20 text-center hover:border-emerald-500/40 transition">
                    <div className="text-[10px] text-zinc-400 font-bold truncate">{item.game_name.split(" ")[0]}</div>
                    <div className="font-mono tabular-nums text-xs text-[#00F59B] font-bold mt-0.5">
                      {formatCurrency(item.available_balance)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Balance & Action Card (Meets 44pt Touch Targets) */}
            <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-black/70 border border-emerald-400/50 p-5 backdrop-blur-xl min-w-[280px] shadow-xl">
              <div className="text-[10px] uppercase font-pixel text-zinc-400">
                {isAffiliateUser ? "SEU SALDO DISPONÍVEL" : "SALDO AFILIADO"}
              </div>
              <div className="text-2xl sm:text-3xl font-mono tabular-nums text-[#00F59B] font-black my-1.5 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
                {formatCurrency(totalAffiliateBalance)}
              </div>
              <div className="text-[11px] text-zinc-400 mb-3.5 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Liberação imediata no PIX</span>
              </div>

              <Link
                href="/afiliados"
                className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 px-6 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] active:scale-[0.96]"
              >
                <Zap className="w-4 h-4 fill-dark-950" />
                <span>ABRIR PAINEL & SACAR PIX</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 7. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/5 bg-[#040805] py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-dark-950 font-pixel flex items-center justify-center text-xs font-black">
              K
            </div>
            <div>
              <div className="font-bold text-white text-sm">KRS CREATOR HUB</div>
              <div className="text-[11px]">© 2026 KRS Gaming. Todos os direitos reservados.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-zinc-400">
            <Link href="/jogos" className="hover:text-emerald-400 transition font-bold">Jogos</Link>
            <Link href="/ranking" className="hover:text-emerald-400 transition font-bold">Ranking</Link>
            <Link href="/afiliados" className="hover:text-emerald-400 transition font-bold text-emerald-400">
              Painel do Afiliado
            </Link>
            <Link href="/perfil" className="hover:text-white transition">Minha Conta</Link>
            <Link href="/termos" className="hover:text-white transition">Termos</Link>
            <Link href="/ajuda" className="hover:text-white transition">Ajuda</Link>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 8. NAVEGAÇÃO MOBILE INFERIOR (THUMB ZONE - 48PX TOUCH TARGETS)            */}
      {/* ========================================================================= */}
      <CreatorMobileNav />
    </div>
  );
}
