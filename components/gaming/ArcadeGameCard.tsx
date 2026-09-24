"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ExternalLink, Sparkles, Check, Share2, Flame, Layers } from "lucide-react";
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isComingSoon) {
    return (
      <div className="group relative rounded-2xl sm:rounded-3xl bg-[#0e1210] border-2 border-emerald-500/20 hover:border-emerald-400/50 p-1 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between aspect-[4/5] sm:aspect-square">
        {/* Retro scanline & arcade grid backdrop */}
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b140f] to-[#040906] flex flex-col items-center justify-center p-4 text-center border border-white/5">
          {/* Subtle logo or ghost icon */}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-pixel text-zinc-400">
            {game.category}
          </div>

          <div className="text-zinc-600 font-pixel text-[10px] sm:text-xs mb-3 uppercase tracking-wider">
            {game.name}
          </div>

          {/* Big Retro Pixel text: "EM BREVE" (exact match from reference screenshot!) */}
          <div className="font-pixel text-base sm:text-xl md:text-2xl text-white tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] animate-pulse my-2">
            EM BREVE
          </div>

          <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase mt-3">
            TOUCH SCREEN TO START
          </div>

          <div className="absolute bottom-3 text-[9px] text-zinc-500 font-medium">
            Preparando torneios de habilidade
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl bg-[#0c120e] border-2 border-emerald-500/30 hover:border-emerald-400 p-1 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {/* Visual Cover Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950">
        <img
          src={game.thumbnail_url}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

        {/* Status Badge: AO VIVO / 100% HABILIDADE */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[9px] sm:text-[10px] font-black text-emerald-400 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AO VIVO
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold text-zinc-300">
            {game.category}
          </span>
        </div>

        {/* Share / Copy link button */}
        <button
          onClick={handleCopyLink}
          title="Copiar link do jogo"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-emerald-500/30 border border-white/10 hover:border-emerald-400/50 text-zinc-300 hover:text-white transition backdrop-blur-md"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>

        {/* Campaign Indicator if active */}
        {gameCampaigns.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] sm:text-[10px] font-bold text-emerald-300 backdrop-blur-md">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>{gameCampaigns.length} {gameCampaigns.length === 1 ? "Campanha" : "Campanhas"}</span>
          </div>
        )}
      </div>

      {/* Card Info & Actions */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
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
          <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-2 mt-0.5 sm:mt-1 leading-snug">
            {game.description}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
          {/* Main JOGAR Button */}
          <button
            onClick={handlePlay}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md shadow-emerald-500/30 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-dark-950 text-dark-950" />
            <span>JOGAR</span>
          </button>

          {/* View Details / Campanha link */}
          <Link
            href={`/jogos/${game.slug}`}
            className="p-1.5 sm:p-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white text-xs transition"
            title="Ver detalhes e campanhas"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
