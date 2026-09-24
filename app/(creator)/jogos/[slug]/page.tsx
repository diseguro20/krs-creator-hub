"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Gamepad2,
  Play,
  Layers,
  Sparkles,
  CheckCircle2,
  FolderDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { games, campaigns, creativeAssets, scripts, openGamePlayer } = useKrsStore();

  const game = games.find((g) => g.slug === resolvedParams.slug);

  if (!game) {
    return notFound();
  }

  const gameCampaigns = campaigns.filter((c) => c.game_id === game.id);
  const gameAssets = creativeAssets.filter((a) => a.game_id === game.id);
  const gameScripts = scripts.filter((s) => s.game_id === game.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <Link
        href="/jogos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar pros Jogos</span>
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-dark-900 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={game.banner_url}
            alt={game.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
        </div>

        {/* Floating details */}
        <div className="p-6 sm:p-8 -mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-dark-850 border-2 border-white/10 shadow-2xl shrink-0">
              <img src={game.logo_url} alt={game.name} className="h-full w-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                  {game.category}
                </span>
                <span className="text-xs text-zinc-400">100% Oficial</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {game.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <a
                  href={game.play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-mono"
                >
                  <span>{game.play_url}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openGamePlayer(game)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-dark-950 text-dark-950" />
              <span>Jogar Agora</span>
            </button>

            {gameCampaigns.length > 0 && (
              <Link
                href={`/campanhas/${gameCampaigns[0].slug}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-dark-850 border border-white/10 hover:border-white/20 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shrink-0"
              >
                <span>Bora pra Campanha</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overview & How it works */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* Description Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-brand-primary" />
              Sobre o Jogo
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {game.description}
            </p>

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Como Funciona a Mecânica Competitiva
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {game.how_it_works}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {game.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-dark-850 text-xs font-medium text-zinc-300 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Active Campaigns for this game */}
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-neon" />
                Campanhas no Ar ({gameCampaigns.length})
              </h3>
            </div>

            {gameCampaigns.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                Nenhuma campanha aberta no momento para este jogo.
              </div>
            ) : (
              <div className="space-y-3">
                {gameCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-2xl bg-dark-850 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{camp.title}</div>
                      <div className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
                        <span>{camp.missions.length} Missões</span>
                        <span>•</span>
                        <span className="text-brand-primary font-bold">+{camp.xp_total} XP</span>
                      </div>
                    </div>

                    <Link
                      href={`/campanhas/${camp.slug}`}
                      className="px-4 py-2 rounded-xl bg-brand-primary text-dark-950 text-xs font-bold hover:bg-brand-primaryHover transition text-center shrink-0"
                    >
                      Entrar na Campanha
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Materials & Roteiros available */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-dark-900 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-brand-primary" />
                Criativos & Roteiros
              </h3>
              <Link href="/materiais" className="text-xs text-brand-primary hover:underline">
                Ver todos
              </Link>
            </div>

            {gameScripts.length > 0 && (
              <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
                <div className="text-[10px] uppercase font-bold text-amber-400">Roteiro Recomendado</div>
                <div className="text-xs font-bold text-white">{gameScripts[0].title}</div>
                <p className="text-[11px] text-zinc-400 line-clamp-3">
                  {gameScripts[0].content}
                </p>
                <Link
                  href="/materiais"
                  className="inline-block pt-1 text-xs font-bold text-brand-primary hover:underline"
                >
                  Copiar Roteiro 📋
                </Link>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Pacote de Assets & Logos</div>
                <div className="text-[10px] text-zinc-400">PNGs transparentes e templates 9:16</div>
              </div>
              <Link
                href="/materiais"
                className="px-3 py-1.5 rounded-xl bg-dark-800 text-xs font-bold text-white hover:bg-dark-700 transition"
              >
                Baixar Asset ⚡
              </Link>
            </div>
          </div>

          {/* Fair Play Notice */}
          <div className="p-6 rounded-3xl bg-dark-900/60 border border-white/5 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              <span>Diretrizes de Divulgação</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Ao criar conteúdo para este jogo, enfatize a habilidade motora e rapidez de raciocínio. Nunca prometa ganhos garantidos aos jogadores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
