"use client";

import React from "react";
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  Gift,
  Shield,
  Zap,
  Award,
  Crown,
  Download,
  Flame,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

export default function CreatorPassPage() {
  const { creatorPass, currentUser } = useKrsStore();
  const creator = currentUser as CreatorProfile;

  const userXP = creator.current_xp || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-dark-900 shadow-2xl p-6 sm:p-10">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-bold text-brand-primary mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>TEMPORADA {creatorPass.number} • PASSE DA COMUNIDADE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{creatorPass.name}</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
              {creatorPass.theme}. Joga junto com a gente! Cada vídeo aprovado rende XP pra destravar drops exclusivos, selos raros e vantagens na plataforma.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-850 border border-white/10 text-center sm:text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Tempo Restante</div>
            <div className="text-2xl font-black text-white">{creatorPass.days_left} Dias</div>
            <div className="text-[11px] text-brand-primary font-semibold mt-0.5">
              Seu XP Atual: {formatXP(userXP)}
            </div>
          </div>
        </div>
      </div>

      {/* Season Pass Milestones Horizontal Scroll Track */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Trilha de Recompensas & Drops</h3>
            <p className="text-xs text-zinc-400">Suba de nível e colete recompensas automaticamente no seu ritmo</p>
          </div>
          <span className="text-xs font-bold text-brand-primary">10 Níveis Totais</span>
        </div>

        {/* Horizontal Track Container */}
        <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin">
          <div className="flex items-stretch gap-4 min-w-max">
            {creatorPass.rewards.map((reward) => {
              const isUnlocked = userXP >= reward.xp_required;

              return (
                <div
                  key={reward.level}
                  className={`w-60 rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isUnlocked
                      ? "bg-dark-850 border-brand-primary/40 shadow-lg shadow-brand-primary/5"
                      : "bg-dark-900/60 border-white/5 opacity-70"
                  }`}
                >
                  <div>
                    {/* Header level & status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        isUnlocked ? "bg-brand-primary text-dark-950" : "bg-dark-800 text-zinc-400"
                      }`}>
                        NÍVEL {reward.level}
                      </span>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Liberado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                          <Lock className="w-3.5 h-3.5" />
                          Bloqueado
                        </span>
                      )}
                    </div>

                    {/* Reward Icon */}
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${
                      isUnlocked ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30" : "bg-dark-800 text-zinc-500"
                    }`}>
                      {reward.type === "badge" && <Award className="w-6 h-6" />}
                      {reward.type === "exclusive_material" && <Download className="w-6 h-6" />}
                      {reward.type === "priority_review" && <Zap className="w-6 h-6" />}
                      {reward.type === "multiplier" && <Flame className="w-6 h-6" />}
                      {reward.type === "special_campaign" && <Crown className="w-6 h-6" />}
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1">{reward.title}</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{reward.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 font-mono">{formatXP(reward.xp_required)}</span>
                    {reward.is_elite_tier && (
                      <span className="text-[9px] font-extrabold uppercase text-amber-400">
                        ELITE TIER
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
