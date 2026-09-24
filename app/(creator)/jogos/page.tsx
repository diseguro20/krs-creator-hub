"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Search,
  Filter,
  ArrowRight,
  Heart,
  Sparkles,
  Play,
  Layers,
  Zap,
  Flame,
  ArrowDownLeft,
  ChevronDown
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { GameCategory } from "@/types";
import { ArcadeGameCard } from "@/components/gaming/ArcadeGameCard";

const CATEGORIES: ("Todos" | GameCategory)[] = [
  "Todos",
  "Habilidade",
  "Cassino",
  "Puzzle",
  "Arcade",
  "Reflexo",
  "Casual",
];

export default function GamesCatalogPage() {
  const { games, campaigns, walletBalance, setWalletModalOpen } = useKrsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === "Todos" || game.category === selectedCategory;
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Header: Balance & Fast Deposit (as seen in screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#0a120c] border border-emerald-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-dark-900 border border-emerald-400/40 flex items-center justify-center font-pixel text-xs text-dark-950 font-black">
            🎮
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Central de Jogos & Torneios
            </h1>
            <p className="text-xs text-zinc-400">
              Jogue, teste a mecânica e impulsione suas campanhas de divulgação com links oficiais.
            </p>
          </div>
        </div>

        {/* Right side: Meu saldo & DEPOSITAR */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div
            onClick={() => setWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-dark-900 border border-white/5 cursor-pointer hover:border-emerald-500/30 transition text-xs font-bold"
          >
            <span className="text-zinc-400">Meu saldo 💰:</span>
            <span className="text-white font-black text-sm">
              R$ {walletBalance.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <button
            onClick={() => setWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-dark-950" />
            <span>DEPOSITAR</span>
          </button>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. ARCADE CATEGORY TITLE & SEARCH: "🎮 JOGOS"                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Pixel Art Section Title: "🎮 JOGOS" */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <h2 className="font-pixel text-lg sm:text-2xl text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            JOGOS
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
            {filteredGames.length} títulos
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-emerald-500/20 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-[#00F59B] to-emerald-400 text-dark-950 font-black shadow-md shadow-emerald-500/30"
                : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5 hover:border-emerald-500/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. 2-COLUMN MOBILE / 3-4 DESKTOP GAME GRID                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {filteredGames.map((game) => (
          <ArcadeGameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Quick Creator Helper Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-dark-900 to-dark-950 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-black text-white">Quer divulgar algum desses jogos?</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Acesse a aba de Campanhas, aceite as missões e receba seus caches com saque via PIX instantâneo.
            </p>
          </div>
        </div>

        <Link
          href="/campanhas"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span>Explorar Campanhas</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
