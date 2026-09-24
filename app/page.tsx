"use client";

import React from "react";
import Link from "next/link";
import {
  Crown,
  Zap,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { ArcadeHeaderBar } from "@/components/gaming/ArcadeHeaderBar";
import { ArcadeGameCard } from "@/components/gaming/ArcadeGameCard";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency } from "@/lib/utils";
import { SIMULATED_AFFILIATE_INFLUENCERS } from "@/lib/affiliate-leaderboard-data";

export default function LandingPage() {
  const { games, totalAffiliateBalance, affiliateStats, isAffiliateUser } = useKrsStore();

  const top1 = SIMULATED_AFFILIATE_INFLUENCERS[0];
  const top2 = SIMULATED_AFFILIATE_INFLUENCERS[1];
  const top3 = SIMULATED_AFFILIATE_INFLUENCERS[2];
  const otherTopCreators = SIMULATED_AFFILIATE_INFLUENCERS.slice(3, 5);

  return (
    <div className="relative min-h-screen bg-[#070c09] text-white selection:bg-[#00F59B] selection:text-dark-950 font-sans pb-16 lg:pb-0">
      {/* 1. TOP ARCADE HEADER BAR */}
      <ArcadeHeaderBar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-10 sm:space-y-14">
        {/* ========================================================================= */}
        {/* 1. JOGOS OFICIAIS (DIRETO NO TOPO - SEM FIRULA)                           */}
        {/* ========================================================================= */}
        <section id="jogos" className="space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🎮</span>
                <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,245,155,0.4)]">
                  JOGOS
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  {games.length} títulos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
                Jogue agora no player integrado, copie seu link de afiliado oficial e receba comissões instantâneas via PIX.
              </p>
            </div>

            <Link
              href="/afiliados"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Painel de Comissões & Saque PIX</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2 Colunas Mobile / 4 Colunas Desktop Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {games.map((game) => (
              <ArcadeGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. RANKING DOS CREATORS (LEADERBOARD OFICIAL)                             */}
        {/* ========================================================================= */}
        <section id="ranking" className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🏆</span>
                <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  RANKING DOS CREATORS
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 uppercase">
                  Top Afiliados PIX
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
                Criadores e afiliados com maiores volumes de saques confirmados via PIX em tempo real na plataforma.
              </p>
            </div>

            <Link
              href="/ranking"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Ver Ranking Completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Podium Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 2º LUGAR */}
            {top2 && (
              <div className="order-2 md:order-1 rounded-2xl bg-[#09120c] border border-zinc-700/40 p-5 flex flex-col justify-between relative overflow-hidden shadow-xl">
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-600/40 text-[10px] font-pixel text-zinc-300">
                  <span>🥈 2º LUGAR</span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={top2.avatar}
                    alt={top2.stageName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-zinc-400/50 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                      {top2.stageName}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">@{top2.username}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                      {top2.audience}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Total Sacado (PIX):</span>
                    <span className="font-pixel text-base font-bold text-zinc-200">
                      {formatCurrency(top2.totalWithdrawnPix)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Principal jogo:</span>
                    <span className="text-emerald-400 font-medium">{top2.topGameName}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1 bg-white/5 p-1.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Último saque: R$ {top2.recentPixWithdrawal.amount.toFixed(2).replace(".", ",")} {top2.recentPixWithdrawal.timeAgo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 1º LUGAR (CHAMPION) */}
            {top1 && (
              <div className="order-1 md:order-2 rounded-2xl bg-gradient-to-b from-[#132314] via-[#0b170e] to-[#070d08] border-2 border-amber-400/60 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-amber-500/10 md:-translate-y-2">
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-[10px] font-pixel text-amber-300 font-black">
                  <Crown className="w-3.5 h-3.5 fill-amber-300" />
                  <span>👑 TOP 1 GERAL</span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={top1.avatar}
                      alt={top1.stageName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shadow-amber-400/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-dark-950 flex items-center justify-center font-black text-xs">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight flex items-center gap-1.5">
                      {top1.stageName}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    </h3>
                    <p className="text-xs text-amber-200/80 font-mono">@{top1.username}</p>
                    <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                      {top1.audience}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-400/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Total Sacado (PIX):</span>
                    <span className="font-pixel text-xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
                      {formatCurrency(top1.totalWithdrawnPix)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Principal jogo:</span>
                    <span className="text-emerald-300 font-semibold">{top1.topGameName}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300/90 flex items-center gap-1.5 bg-black/40 border border-emerald-500/20 p-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Último saque: R$ {top1.recentPixWithdrawal.amount.toFixed(2).replace(".", ",")} {top1.recentPixWithdrawal.timeAgo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3º LUGAR */}
            {top3 && (
              <div className="order-3 rounded-2xl bg-[#09120c] border border-amber-700/40 p-5 flex flex-col justify-between relative overflow-hidden shadow-xl">
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/30 border border-amber-700/40 text-[10px] font-pixel text-amber-400">
                  <span>🥉 3º LUGAR</span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={top3.avatar}
                    alt={top3.stageName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-700/50 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                      {top3.stageName}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">@{top3.username}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                      {top3.audience}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Total Sacado (PIX):</span>
                    <span className="font-pixel text-base font-bold text-amber-200">
                      {formatCurrency(top3.totalWithdrawnPix)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Principal jogo:</span>
                    <span className="text-emerald-400 font-medium">{top3.topGameName}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1 bg-white/5 p-1.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Último saque: R$ {top3.recentPixWithdrawal.amount.toFixed(2).replace(".", ",")} {top3.recentPixWithdrawal.timeAgo}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick List for 4º and 5º and View All Button */}
          <div className="rounded-2xl bg-[#09120c] border border-white/5 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
              {otherTopCreators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-2.5">
                  <span className="font-pixel text-xs text-zinc-500">{creator.rank}º</span>
                  <img src={creator.avatar} alt={creator.stageName} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="font-bold text-white">{creator.stageName}</span>
                  <span className="text-emerald-400 font-pixel text-[11px]">{formatCurrency(creator.totalWithdrawnPix)}</span>
                </div>
              ))}
            </div>

            <Link
              href="/ranking"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition shrink-0"
            >
              <span>Ver Tabela Completa</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PAINEL DE AFILIADO & SAQUE PIX (CONSOLIDAÇÃO MULTI-JOGOS)              */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1912] via-[#09120d] to-[#040805] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 arcade-box overflow-hidden">
          <div className="arcade-scanlines pointer-events-none opacity-30" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-pixel text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PAINEL UNIFICADO DE AFILIADOS</span>
              </div>

              <h2 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wide leading-tight">
                TODOS OS SEUS GANHOS <br />
                <span className="text-[#00F59B]">EM UM SÓ LUGAR</span>
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Divulgue o <strong>Fruit Cash</strong>, <strong>KRS 777 Casino</strong>, <strong>Blockerino</strong> e <strong>Bubble Cash</strong> em um único painel e solicite saques consolidados instantâneos via PIX na sua conta.
              </p>

              {/* 4 Games Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {affiliateStats.map((item) => (
                  <div key={item.game_id} className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/20 text-center">
                    <div className="text-[10px] text-zinc-400 font-bold truncate">{item.game_name.split(" ")[0]}</div>
                    <div className="font-pixel text-xs text-emerald-400 font-black mt-1">
                      {formatCurrency(item.available_balance)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-black/70 border-2 border-emerald-400/50 p-6 backdrop-blur-xl min-w-[280px]">
              <div className="text-[10px] uppercase font-pixel text-zinc-400">
                {isAffiliateUser ? "SEU SALDO DISPONÍVEL" : "SALDO AFILIADO"}
              </div>
              <div className="text-3xl font-pixel text-emerald-400 font-black my-2 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
                {formatCurrency(totalAffiliateBalance)}
              </div>
              <div className="text-[11px] text-zinc-400 mb-4 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Liberação imediata no PIX</span>
              </div>

              <Link
                href="/afiliados"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition active:scale-95"
              >
                <Zap className="w-4 h-4 fill-dark-950" />
                <span>ABRIR PAINEL & SACAR PIX</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/5 bg-[#050806] py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-dark-950 font-pixel flex items-center justify-center text-xs font-black">
              K
            </div>
            <div>
              <div className="font-bold text-white text-sm">KRS CREATOR HUB</div>
              <div className="text-[11px]">© 2026 KRS Gaming. Todos os direitos reservados.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
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
    </div>
  );
}
