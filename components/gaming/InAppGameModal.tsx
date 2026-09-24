"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  Share2,
  Check,
  Gamepad2,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export function InAppGameModal() {
  const { playingGame, closeGamePlayer, campaigns } = useKrsStore();
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!playingGame) return null;

  const gameCampaigns = campaigns.filter((c) => c.game_id === playingGame.id);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(playingGame.play_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 bg-black/85 md:backdrop-blur-xl animate-in fade-in duration-150">
      {/* Modal Container */}
      <div
        className={`relative w-full rounded-2xl sm:rounded-3xl bg-[#0a0f0c] border border-emerald-500/30 sm:border-2 sm:border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          fullscreen
            ? "fixed inset-0 rounded-none border-0 h-screen max-w-none"
            : "max-w-4xl max-h-[96vh] sm:max-h-[92vh] h-[92vh] sm:h-[850px]"
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-emerald-500/20 bg-dark-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-emerald-400/30 bg-dark-900 shrink-0">
              <img
                src={playingGame.logo_url || playingGame.thumbnail_url}
                alt={playingGame.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {playingGame.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  {playingGame.category}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono truncate max-w-xs sm:max-w-md">
                {playingGame.play_url}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Copy referral link */}
            <button
              onClick={handleCopyLink}
              title="Copiar link oficial"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-white/10 hover:border-emerald-500/30 text-xs font-bold text-zinc-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 hidden sm:inline">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar Link</span>
                </>
              )}
            </button>

            {/* Open official production page in new tab */}
            <a
              href={playingGame.play_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir em nova aba"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 text-xs font-black uppercase tracking-wider transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abrir Jogo</span>
            </a>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
              className="p-2 rounded-xl bg-dark-900 hover:bg-dark-850 border border-white/10 text-zinc-300 hover:text-white transition"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={closeGamePlayer}
              title="Fechar jogador"
              className="p-2 rounded-xl bg-dark-900 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-zinc-300 hover:text-red-400 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Arena Frame */}
        <div className="flex-1 w-full relative bg-[#040805] flex items-center justify-center overflow-hidden">
          {/* Responsive smartphone / game simulator frame */}
          <div className="w-full h-full max-w-full flex items-center justify-center p-1 sm:p-2">
            <iframe
              src={playingGame.play_url}
              title={playingGame.name}
              className="w-full h-full rounded-2xl border border-white/10 shadow-inner bg-black"
              allow="autoplay; fullscreen; clipboard-write; encrypted-media"
            />
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-dark-950/90 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>
              Você está testando o jogo oficial <strong className="text-white">{playingGame.name}</strong> em modo de alta performance.
            </span>
          </div>

          {gameCampaigns.length > 0 && (
            <Link
              href={`/campanhas/${gameCampaigns[0].slug}`}
              onClick={closeGamePlayer}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold transition shrink-0"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ver Campanha (+{gameCampaigns[0].xp_total} XP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
