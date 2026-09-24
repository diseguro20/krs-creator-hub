"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ExternalLink, Check, Share2, Layers } from "lucide-react";
import { Game } from "@/types";
import { useKrsStore } from "@/lib/store/useKrsStore";

interface ArcadeGameCardProps {
  game: Game;
  onPlayClick?: (game: Game) => void;
}

export function ArcadeGameCard({ game, onPlayClick }: ArcadeGameCardProps) {
  const { openGamePlayer, campaigns } = useKrsStore();
  const [copied, setCopied] = useState(false);

  const isComingSoon = game.status === "coming_soon";
  const gameCampaigns = campaigns.filter((c) => c.game_id === game.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComingSoon) return;
    if (onPlayClick) {
      onPlayClick(game);
    } else {
      openGamePlayer(game);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(game.play_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (isComingSoon) {
    return (
      <div className="group relative rounded-2xl sm:rounded-3xl bg-[#0a120c] border border-emerald-500/20 hover:border-emerald-500/40 p-2 sm:p-3 overflow-hidden transition-all duration-300 shadow-lg shadow-black/60 flex flex-col justify-between aspect-[4/5] sm:aspect-square">
        {/* Retro scanline & arcade grid backdrop */}
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#08130c] to-[#040805] flex flex-col items-center justify-center p-3 text-center border border-white/5">
          {/* Subtle category tag */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-pixel text-zinc-400">
            {game.category}
          </div>

          <div className="text-zinc-500 font-pixel text-[10px] sm:text-xs mb-2 uppercase tracking-wider">
            {game.name}
          </div>

          {/* Big Retro Pixel text: "EM BREVE" */}
          <div className="font-pixel text-base sm:text-xl md:text-2xl text-white tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse my-2">
            EM BREVE
          </div>

          <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase mt-2">
            TOUCH SCREEN TO START
          </div>

          <div className="absolute bottom-2.5 text-[9px] text-zinc-500 font-medium">
            Em preparação
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl bg-[#09120c] border border-emerald-500/25 hover:border-emerald-400/70 p-2 sm:p-3 overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-black/80 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {/* Visual Cover Container (Strict Aspect Ratio matching mobile-app-ui-design) */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black">
        <img
          src={game.thumbnail_url}
          alt={game.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {/* Status Badge: AO VIVO */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[9px] sm:text-[10px] font-black text-emerald-400 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AO VIVO
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold text-zinc-300">
            {game.category}
          </span>
        </div>

        {/* 44pt Touch Target Share / Copy Link Button (Thumb Zone Friendly) */}
        <button
          onClick={handleCopyLink}
          aria-label={`Copiar link de afiliado do jogo ${game.name}`}
          className={`absolute top-2 right-2 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-xl flex items-center justify-center transition backdrop-blur-md active:scale-95 cursor-pointer shadow-md ${
            copied
              ? "bg-emerald-500 text-dark-950 font-bold border border-emerald-300 shadow-emerald-500/50"
              : "bg-black/70 hover:bg-emerald-500/30 border border-white/15 text-zinc-200 hover:text-white"
          }`}
          title="Copiar link de afiliado"
        >
          {copied ? (
            <Check className="w-4 h-4 text-dark-950 stroke-[3]" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>

        {/* Floating Copied Toast Pill */}
        {copied && (
          <div className="absolute top-12 right-2 z-30 px-2 py-1 rounded-lg bg-emerald-500 text-dark-950 text-[10px] font-black uppercase tracking-wider shadow-xl animate-in fade-in zoom-in-95 duration-150">
            Link Copiado! ⚡
          </div>
        )}

        {/* Campaign Indicator if active */}
        {gameCampaigns.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] sm:text-[10px] font-bold text-emerald-300 backdrop-blur-md pointer-events-none">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>{gameCampaigns.length} {gameCampaigns.length === 1 ? "Campanha" : "Campanhas"}</span>
          </div>
        )}
      </div>

      {/* Card Info & Actions - 8-Point Grid Spacing */}
      <div className="pt-2 sm:pt-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <h3 className="text-xs sm:text-base font-black text-white group-hover:text-emerald-400 transition truncate">
              {game.name}
            </h3>
            {game.primary_color && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: game.primary_color }}
              />
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
            {game.description}
          </p>
        </div>

        {/* Action Buttons Row (Meets 44pt Tap Target Standard) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
          {/* Main JOGAR Button with Tactile Press State */}
          <button
            onClick={handlePlay}
            className="flex-1 h-9 sm:h-10 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/30 transition hover:scale-[1.02] active:scale-[0.96] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-dark-950 text-dark-950" />
            <span>JOGAR</span>
          </button>

          {/* View Details / Campanha link */}
          <Link
            href={`/jogos/${game.slug}`}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-black/60 hover:bg-dark-800 border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white flex items-center justify-center transition active:scale-[0.96]"
            title="Ver detalhes e campanhas"
            aria-label={`Ver detalhes do jogo ${game.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
