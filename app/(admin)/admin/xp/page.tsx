"use client";

import React, { useState } from "react";
import { Zap, Save, Check, RotateCcw } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function AdminXpRulesPage() {
  const { xpEvents, updateXPEvent } = useKrsStore();
  const [saveToast, setSaveToast] = useState(false);

  const handleUpdate = (id: string, xp: number, active: boolean) => {
    updateXPEvent(id, xp, active);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Zap className="w-4 h-4" />
            Mecanismo de Pontuação
          </div>
          <h1 className="text-3xl font-black text-white">Regras de Atribuição de XP</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Defina a quantidade de pontos concedida aos criadores por cada ação profissional. Valores 100% dinâmicos.
          </p>
        </div>

        {saveToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-brand-primary/15 border border-brand-primary/30 text-xs font-bold text-brand-primary flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Regras salvas e ativas!</span>
          </div>
        )}
      </div>

      {/* Rules Table */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-6">Identificador do Evento</th>
                <th className="py-3 px-6">Descrição da Ação</th>
                <th className="py-3 px-6">XP Atribuído</th>
                <th className="py-3 px-6">Status da Regra</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {xpEvents.map((event) => (
                <tr key={event.id} className="hover:bg-dark-850/50 transition">
                  <td className="py-4 px-6 font-mono text-zinc-300 font-bold">
                    {event.event_key}
                  </td>
                  <td className="py-4 px-6 text-white font-medium">
                    {event.description}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        step={5}
                        defaultValue={event.xp_amount}
                        id={`xp-input-${event.id}`}
                        className="w-24 px-3 py-1.5 rounded-lg bg-dark-850 border border-white/10 text-xs font-bold text-brand-primary focus:outline-none focus:border-amber-500 text-center"
                      />
                      <span className="text-[11px] text-zinc-400 font-semibold">XP</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={event.is_active}
                        id={`active-input-${event.id}`}
                        className="rounded bg-dark-800 border-white/10 text-brand-primary"
                      />
                      <span className="text-xs text-zinc-300 font-medium">
                        Ativo
                      </span>
                    </label>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const xpEl = document.getElementById(`xp-input-${event.id}`) as HTMLInputElement;
                        const activeEl = document.getElementById(`active-input-${event.id}`) as HTMLInputElement;
                        handleUpdate(event.id, Number(xpEl.value), activeEl.checked);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-amber-500 hover:text-dark-950 text-xs font-bold text-white transition border border-white/5"
                    >
                      Salvar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
