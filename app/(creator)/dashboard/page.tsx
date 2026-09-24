"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ChevronRight,
  Gamepad2,
  FolderDown,
  TrendingUp,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";
import { formatXP, formatCurrency } from "@/lib/utils";

export default function CreatorDashboardPage() {
  const {
    currentUser,
    campaigns,
    creatorCampaigns,
    submissions,
    levels,
    badges,
    userBadges,
    totalAffiliateBalance,
    affiliateStats,
  } = useKrsStore();
  const creator = (currentUser as CreatorProfile) || {
    name: "Creator",
    username: "creator",
    current_level: 1,
    current_xp: 0,
    streak_weeks: 0,
    completed_campaigns_count: 0,
  };

  // Level progress
  const currentLevelInfo = levels.find((l) => l.level === (creator.current_level || 1)) || levels[0];
  const nextLevelInfo = levels.find((l) => l.level === (creator.current_level || 1) + 1);
  const xpNeeded = nextLevelInfo ? Math.max(0, nextLevelInfo.min_xp - (creator.current_xp || 0)) : 0;
  const progressPercent = nextLevelInfo
    ? Math.min(100, Math.round(((creator.current_xp || 0) / nextLevelInfo.min_xp) * 100))
    : 100;

  // Active campaign in progress
  const activeCampaignId = Object.keys(creatorCampaigns)[0] || campaigns[0]?.id;
  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];
  const activeCampaignProgress = creatorCampaigns[activeCampaignId] || { currentStep: 1, completedMissions: [] };
  
  const totalMissions = activeCampaign?.missions?.length || 4;
  const completedCount = activeCampaignProgress.completedMissions?.length || 0;
  const campaignPercent = Math.min(100, Math.round((completedCount / totalMissions) * 100));

  // Current mission next action
  const currentMission = activeCampaign?.missions?.find((m) => m.step_order === activeCampaignProgress.currentStep) || activeCampaign?.missions?.[0];

  // Submissions stats
  const pendingSubmissions = submissions.filter((s) => s.status === "in_review").length;
  const approvedSubmissions = submissions.filter((s) => s.status === "approved").length;
  const changesNeeded = submissions.filter((s) => s.status === "changes_requested");

  // Greeting time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-8">
      {/* Alert for change requested if any */}
      {changesNeeded.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">
                Dá uma olhada aqui: Ajuste pedido na missão &quot;{changesNeeded[0].mission_title}&quot;
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Recado da equipe: &quot;{changesNeeded[0].feedback}&quot;
              </div>
            </div>
          </div>
          <Link
            href={`/campanhas/${activeCampaign?.slug || ""}`}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs hover:bg-amber-400 transition shrink-0"
          >
            Ajustar & Reenviar
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: GREETING & GAMIFICATION STATUS                            */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl border border-white/10 bg-dark-900/80 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-dark-850 border-2 border-brand-primary/40 shadow-xl shadow-brand-primary/20 shrink-0">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={creator.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-xl text-white">
                  {creator.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                <span>{greeting}, @{creator.username || "creator"}! Bora pro play?</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {creator.streak_weeks || 0} semanas streak
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {creator.name}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary text-xs font-extrabold uppercase tracking-wide border border-brand-primary/30">
                  Nível {creator.current_level || 1} • {currentLevelInfo.name}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {formatXP(creator.current_xp || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Card */}
          <div className="w-full lg:w-80 rounded-2xl bg-dark-850 border border-white/5 p-4 space-y-2 shadow-inner">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">Rumo ao Nível {(creator.current_level || 1) + 1}</span>
              <span className="text-brand-primary font-bold">{progressPercent}%</span>
            </div>
            
            <div className="h-2.5 w-full bg-dark-900 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-neon transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-[11px] text-zinc-400 text-right">
              Faltam só <strong className="text-white">{formatXP(xpNeeded)}</strong> pra subir de nível!
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1.5. PAINEL DE AFILIADO UNIFICADO: MULTI-JOGOS PIX                      */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0a140f] via-[#09100c] to-[#040805] border-2 border-emerald-500/40 p-5 sm:p-6 shadow-xl shadow-emerald-500/10 arcade-box overflow-hidden">
        <div className="arcade-scanlines pointer-events-none opacity-30" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-pixel text-emerald-400 uppercase tracking-wider">
                PAINEL UNIFICADO DE AFILIADO
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                4 JOGOS ATIVOS
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-xs text-zinc-400 font-medium">Saldo Total a Sacar:</span>
              <span className="font-pixel text-2xl sm:text-3xl text-emerald-400 font-black drop-shadow-[0_0_10px_rgba(0,245,155,0.5)]">
                {formatCurrency(totalAffiliateBalance)}
              </span>
            </div>

            {/* 4 Mini Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {affiliateStats.map((game) => (
                <div
                  key={game.game_id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/5 text-[11px]"
                >
                  <span className="text-zinc-400">{game.game_name.split(" ")[0]}:</span>
                  <span className="font-bold text-white">{formatCurrency(game.available_balance)}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/afiliados"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 fill-dark-950" />
            <span>ACESSAR PAINEL & SACAR PIX</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NEXT ACTION: CAMPANHA ATUAL EM ANDAMENTO                               */}
      {/* ========================================================================= */}
      {activeCampaign && (
        <div className="rounded-3xl border border-brand-primary/30 bg-gradient-to-r from-dark-900 via-dark-900 to-dark-850 p-6 sm:p-8 shadow-xl shadow-brand-primary/5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Seu Próximo Desafio 🔥
              </div>
              <h2 className="text-2xl font-black text-white">
                {activeCampaign.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Jogo: <span className="text-white font-semibold">{activeCampaign.game_name}</span> • Recompensa: <span className="text-brand-primary font-bold">+{activeCampaign.xp_total} XP</span>
              </p>
            </div>

            <Link
              href={`/campanhas/${activeCampaign.slug}`}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-primary text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20 hover:scale-[1.02] shrink-0"
            >
              <span>Bora pro Desafio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Campaign Journey Progress */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Progresso da Trilha</span>
                <span className="text-brand-primary font-bold">{completedCount} de {totalMissions} zeradas ({campaignPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${campaignPercent}%` }}
                />
              </div>
            </div>

            {/* Current Mission Highlight */}
            <div className="lg:col-span-8 rounded-2xl bg-dark-850/80 border border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-brand-primary">
                  Missão da Vez ({activeCampaignProgress.currentStep} de {totalMissions}):
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {currentMission?.title || "Gravar Gameplay"}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                  {currentMission?.description || "Solta o play e manda o comprovante pra gente validar!"}
                </div>
              </div>

              <Link
                href={`/campanhas/${activeCampaign.slug}`}
                className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-bold text-zinc-200 hover:text-white border border-white/5 transition shrink-0 text-center"
              >
                Mandar Conteúdo
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. METRICS OVERVIEW & QUICK SHORTCUTS                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Prints em Análise</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{pendingSubmissions}</div>
          <div className="text-[10px] text-zinc-400">Time avaliando rapidinho ⚡</div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Conteúdos Aprovados</span>
            <CheckCircle2 className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-2xl font-black text-brand-primary">{approvedSubmissions}</div>
          <div className="text-[10px] text-zinc-400">Envios validados pelo admin 🎉</div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Campanhas Zeradas</span>
            <Layers className="w-4 h-4 text-brand-neon" />
          </div>
          <div className="text-2xl font-black text-white">{creator.completed_campaigns_count || 0}</div>
          <div className="text-[10px] text-zinc-400">Campanhas finalizadas 🏆</div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Troféus & Badges</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{userBadges.length} / {badges.length}</div>
          <div className="text-[10px] text-zinc-400">Conquistas desbloqueadas 🔥</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DISCOVER MORE: OUTRAS CAMPANHAS & MATERIAIS                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Available Campaigns list */}
        <div className="lg:col-span-7 rounded-3xl border border-white/5 bg-dark-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white">Mais Campanhas pra Produzir</h3>
              <p className="text-xs text-zinc-400">Escolha novos games pra gravar e faturar mais XP</p>
            </div>
            <Link href="/campanhas" className="text-xs font-semibold text-brand-primary hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {campaigns.slice(0, 3).map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-2xl bg-dark-850 border border-white/5 hover:border-white/10 transition flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-dark-800 shrink-0">
                    <img src={camp.game_thumbnail} alt={camp.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{camp.title}</div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{camp.game_name}</span>
                      <span>•</span>
                      <span className="text-brand-primary font-semibold">+{camp.xp_total} XP</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/campanhas/${camp.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-brand-primary hover:text-dark-950 text-xs font-bold text-white border border-white/5 transition shrink-0"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Fast shortcuts card */}
        <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-dark-900 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
              <FolderDown className="w-4 h-4" />
              Kit Rápido pro Creator
            </div>
            <h3 className="text-lg font-bold text-white">Roteiros & Banners Prontinhos</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Sem bloqueio criativo! Pega nossos roteiros mastigados de Reels e Stories, adapta pro seu jeito e solta o play.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <Link
              href="/materiais"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/5 text-xs font-semibold text-white transition"
            >
              <span>Copiar Roteiro de Stories (Bubbles Cash)</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </Link>

            <Link
              href="/creator-pass"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/5 text-xs font-semibold text-white transition"
            >
              <span>Ver Prêmios do Creator Pass</span>
              <Trophy className="w-4 h-4 text-brand-neon" />
            </Link>

            <Link
              href="/mockup-tool"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/5 text-xs font-semibold text-white transition"
            >
              <span>Prévia no Celular (DEMO)</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
