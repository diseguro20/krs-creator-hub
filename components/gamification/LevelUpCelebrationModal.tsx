"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { Award, CheckCircle2, Sparkles, X } from "lucide-react";

export function LevelUpCelebrationModal() {
  const { levelUpNotification, dismissLevelUp } = useKrsStore();

  useEffect(() => {
    if (levelUpNotification?.show) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00F59B", "#00F0FF", "#F59E0B", "#FFFFFF"],
        });
      } catch (e) {
        console.log("Confetti trigger:", e);
      }
    }
  }, [levelUpNotification?.show]);

  if (!levelUpNotification?.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-brand-primary/40 bg-dark-900 p-6 shadow-2xl shadow-brand-primary/20 text-center">
        {/* Close Button */}
        <button
          onClick={dismissLevelUp}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-dark-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glow icon */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary shadow-lg shadow-brand-primary/25 animate-bounce">
          <Award className="w-10 h-10 text-brand-primary" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Subiu de Nível!
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">
          NÍVEL {levelUpNotification.level}
        </h3>
        <p className="text-lg font-medium text-brand-primary mb-4">
          {levelUpNotification.levelName}
        </p>

        <p className="text-sm text-zinc-400 mb-6">
          Sua consistência e dedicação como parceiro foram reconhecidas. Novos benefícios e vantagens foram liberados na sua conta!
        </p>

        {levelUpNotification.perks && levelUpNotification.perks.length > 0 && (
          <div className="mb-6 rounded-xl bg-dark-850 border border-white/5 p-4 text-left">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2">
              Benefícios Desbloqueados:
            </h4>
            <ul className="space-y-1.5">
              {levelUpNotification.perks.map((perk, index) => (
                <li key={index} className="flex items-center gap-2 text-xs text-zinc-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={dismissLevelUp}
          className="w-full py-3 px-4 rounded-xl bg-brand-primary text-dark-950 font-bold hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20"
        >
          Continuar Jornada
        </button>
      </div>
    </div>
  );
}
