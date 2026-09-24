"use client";

import React, { useState } from "react";
import {
  FolderDown,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  FileText,
  FileImage,
  FileVideo,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function MaterialsCenterPage() {
  const { creativeAssets, scripts, games } = useKrsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<"scripts" | "assets">("scripts");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredScripts = scripts.filter((s) => {
    const matchesGame = selectedGame === "all" || s.game_id === selectedGame;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGame && matchesSearch;
  });

  const filteredAssets = creativeAssets.filter((a) => {
    const matchesGame = selectedGame === "all" || a.game_id === selectedGame;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGame && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <FolderDown className="w-4 h-4" />
            Kit de Criação
          </div>
          <h1 className="text-3xl font-black text-white">Roteiros & Banners Prontinhos</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Roteiros mastigados pra gravar no seu estilo, logos sem fundo e capas prontas pra bombar seus stories e vídeos.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar roteiro, sticker, banner..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
          />
        </div>
      </div>

      {/* Tabs & Game Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        {/* Switch tab */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTab("scripts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedTab === "scripts"
                ? "bg-brand-primary text-dark-950 shadow-md shadow-brand-primary/20"
                : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            Roteiros Prontos ({filteredScripts.length})
          </button>
          <button
            onClick={() => setSelectedTab("assets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedTab === "assets"
                ? "bg-brand-primary text-dark-950 shadow-md shadow-brand-primary/20"
                : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            Stickers & Banners ({filteredAssets.length})
          </button>
        </div>

        {/* Filter by Game */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Filtrar por jogo:</span>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
          >
            <option value="all">Todos os Jogos</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SCRIPTS & COPIES TAB                                                   */}
      {/* ========================================================================= */}
      {selectedTab === "scripts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScripts.map((script) => {
            const isCopied = copiedId === script.id;

            return (
              <div
                key={script.id}
                className="rounded-3xl border border-white/5 bg-dark-900 p-6 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-dark-850 text-[10px] font-bold uppercase tracking-wider text-brand-primary border border-white/5">
                      {script.category.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {script.game_name || "Geral"} • {script.duration_estimate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{script.title}</h3>

                  <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                    {script.content}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-dark-950 border border-brand-primary/20 text-xs text-zinc-300">
                    <strong className="text-brand-primary font-semibold">Frase Final (CTA): </strong>
                    {script.call_to_action}
                  </div>
                </div>

                {/* Tips & Copy CTA */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400">
                    {script.tips.length} dicas pra gravar
                  </div>

                  <button
                    onClick={() => handleCopy(script.id, `${script.content}\n\nCTA: ${script.call_to_action}`)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      isCopied
                        ? "bg-emerald-500 text-dark-950"
                        : "bg-brand-primary text-dark-950 hover:bg-brand-primaryHover shadow-md shadow-brand-primary/10"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Roteiro 📋</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATIVE MEDIA ASSETS TAB                                              */}
      {/* ========================================================================= */}
      {selectedTab === "assets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={asset.preview_url}
                  alt={asset.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                  {asset.type.replace("_", " ")}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{asset.title}</h4>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    {asset.game_name || "Geral"} • {asset.file_size}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-dark-850 text-[10px] text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={asset.file_url}
                  download
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-850 hover:bg-brand-primary hover:text-dark-950 text-xs font-bold text-white transition border border-white/5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Asset ⚡</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
