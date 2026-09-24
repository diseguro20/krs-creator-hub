"use client";

import React, { useState } from "react";
import {
  Trophy,
  Save,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatXP } from "@/lib/utils";

export default function AdminCreatorPassEditorPage() {
  const { creatorPass, updateCreatorPassDuration } = useKrsStore();

  const [days, setDays] = useState(creatorPass.days_left || 30);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveDuration = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorPassDuration(days);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Trophy className="w-4 h-4" />
            Season Pass Manager
          </div>
          <h1 className="text-3xl font-black text-white">Editor do Creator Pass</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure a duração da temporada corrente e monitore os 10 marcos de recompensa.
          </p>
        </div>

        {saveToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-brand-primary/15 border border-brand-primary/30 text-xs font-bold text-brand-primary flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Temporada atualizada com sucesso!</span>
          </div>
        )}
      </div>

      {/* Season Settings Card */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Temporada Ativa</h3>

        <form onSubmit={handleSaveDuration} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Temporada</label>
            <input
              type="text"
              readOnly
              value={creatorPass.name}
              className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Dias Restantes da Temporada</label>
            <input
              type="number"
              min={1}
              max={120}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition"
            >
              Salvar Duração
            </button>
          </div>
        </form>
      </div>

      {/* Milestones List */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white">Marcos e Recompensas da Trilha</h3>

        <div className="space-y-3">
          {creatorPass.rewards.map((r) => (
            <div
              key={r.level}
              className="p-4 rounded-2xl bg-dark-850 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-dark-800 font-mono font-bold text-amber-400">
                  NÍVEL {r.level}
                </span>
                <div>
                  <div className="font-bold text-white">{r.title}</div>
                  <div className="text-[11px] text-zinc-400">{r.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-brand-primary">
                  {formatXP(r.xp_required)}
                </span>
                {r.is_elite_tier && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    ELITE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
