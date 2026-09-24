"use client";

import React, { useState } from "react";
import {
  Award,
  Trophy,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Shield,
  Layers,
  Crown,
  Users,
  Calendar,
  Zap,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { BadgeRarity } from "@/types";

const RARITY_COLORS: Record<BadgeRarity, { text: string; bg: string; border: string }> = {
  common: { text: "text-zinc-400", bg: "bg-zinc-800", border: "border-zinc-700" },
  rare: { text: "text-brand-neon", bg: "bg-cyan-950/40", border: "border-cyan-700/40" },
  epic: { text: "text-purple-400", bg: "bg-purple-950/40", border: "border-purple-700/40" },
  legendary: { text: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-700/40" },
};

export default function AchievementsPage() {
  const { badges, userBadges } = useKrsStore();
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const unlockedCount = userBadges.length;
  const totalBadges = badges.length;

  const filteredBadges = badges.filter((b) => {
    const isUnlocked = userBadges.includes(b.id);
    if (filter === "unlocked") return isUnlocked;
    if (filter === "locked") return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <Award className="w-4 h-4" />
            Mural de Troféus
          </div>
          <h1 className="text-3xl font-black text-white">Conquistas & Badges</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sua vitrine de respeito! Cada marco conquistado vira medalha no seu perfil e turbina seu status na comunidade.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-dark-900 border border-white/5">
          <div className="px-3 py-1.5 rounded-xl bg-brand-primary/10 text-brand-primary text-xs font-bold">
            {unlockedCount} de {totalBadges} Conquistadas
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === "all"
              ? "bg-brand-primary text-dark-950 shadow-md"
              : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          Todas as Conquistas
        </button>
        <button
          onClick={() => setFilter("unlocked")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === "unlocked"
              ? "bg-brand-primary text-dark-950 shadow-md"
              : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          Conquistadas ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter("locked")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === "locked"
              ? "bg-brand-primary text-dark-950 shadow-md"
              : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          Bloqueadas ({totalBadges - unlockedCount})
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => {
          const isUnlocked = userBadges.includes(badge.id);
          const rarity = RARITY_COLORS[badge.rarity];

          return (
            <div
              key={badge.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                isUnlocked
                  ? "bg-dark-900 border-white/15 hover:border-brand-primary/40 shadow-xl"
                  : "bg-dark-950/60 border-white/5 opacity-55 hover:opacity-80"
              }`}
            >
              <div>
                {/* Rarity & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${rarity.bg} ${rarity.text} ${rarity.border}`}
                  >
                    {badge.rarity}
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conquistado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      Bloqueado
                    </span>
                  )}
                </div>

                {/* Badge Icon */}
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                    isUnlocked
                      ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-lg shadow-brand-primary/10"
                      : "bg-dark-850 border-white/5 text-zinc-600 grayscale"
                  }`}
                >
                  <Trophy className="w-8 h-8" />
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-bold text-white mb-1">{badge.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 text-center">
                <div className="text-[10px] text-zinc-500 font-medium">
                  Como destravar: {badge.criteria_description}
                </div>
                <div className="mt-1 text-[11px] font-bold text-brand-primary">
                  +{badge.xp_value} XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
