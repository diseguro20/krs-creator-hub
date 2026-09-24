"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
  Calendar,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";

export default function CampaignsListPage() {
  const { campaigns, creatorCampaigns, currentUser } = useKrsStore();
  const creator = currentUser as CreatorProfile;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCampaigns = campaigns.filter((camp) => {
    return (
      camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.game_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <Layers className="w-4 h-4" />
            Central de Campanhas
          </div>
          <h1 className="text-3xl font-black text-white">Campanhas & Desafios</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Escolha os games que combinam com seu canal, cumpra as missões no seu ritmo e acumule XP pra subir no ranking!
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar campanha ou game..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => {
          const userProgress = creatorCampaigns[camp.id];
          const isJoined = !!userProgress;
          const isLocked = camp.min_level > (creator.current_level || 1);
          const completedCount = userProgress?.completedMissions?.length || 0;
          const totalMissions = camp.missions.length;
          const percent = Math.min(100, Math.round((completedCount / totalMissions) * 100));

          return (
            <div
              key={camp.id}
              className={`rounded-3xl border overflow-hidden transition-all flex flex-col justify-between shadow-xl ${
                isJoined
                  ? "border-brand-primary/40 bg-dark-900/90 shadow-brand-primary/5"
                  : isLocked
                  ? "border-white/5 bg-dark-900/50 opacity-75"
                  : "border-white/5 bg-dark-900 hover:border-white/15"
              }`}
            >
              {/* Banner Header */}
              <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                <img
                  src={camp.banner_url}
                  alt={camp.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

                {/* Status chip */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {isJoined ? (
                    <span className="px-3 py-1 rounded-full bg-brand-primary text-dark-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Na Pista ({percent}%)
                    </span>
                  ) : isLocked ? (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-red-500/30">
                      <Lock className="w-3 h-3" />
                      Bloqueado • Requer Nível {camp.min_level}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                      Bora Participar
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
                    {camp.game_name}
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-brand-primary/20 backdrop-blur-md text-xs font-bold text-brand-primary border border-brand-primary/40">
                    +{camp.xp_total} XP
                  </div>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{camp.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    O que você ganha:
                  </div>
                  <ul className="space-y-1">
                    {camp.benefits.slice(0, 2).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress bar if in progress */}
                {isJoined && (
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Progresso: {completedCount} de {totalMissions} zeradas</span>
                      <span className="text-brand-primary font-bold">{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )}

                {/* Footer CTA */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{camp.missions.length} Etapas</span>
                  </div>

                  <Link
                    href={`/campanhas/${camp.slug}`}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                      isJoined
                        ? "bg-brand-primary text-dark-950 hover:bg-brand-primaryHover shadow-md shadow-brand-primary/10"
                        : isLocked
                        ? "bg-dark-800 text-zinc-400 hover:text-white"
                        : "bg-white text-dark-950 hover:bg-zinc-200"
                    }`}
                  >
                    <span>{isJoined ? "Bora Continuar" : isLocked ? "Ver Requisitos" : "Bora Começar"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
