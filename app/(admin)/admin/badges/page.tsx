"use client";

import React, { useState } from "react";
import {
  Award,
  Plus,
  Trophy,
  Shield,
  Sparkles,
  Flame,
  Check,
  X,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { Badge, BadgeRarity } from "@/types";

export default function AdminBadgesPage() {
  const { badges, addBadge } = useKrsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rarity, setRarity] = useState<BadgeRarity>("rare");
  const [xpValue, setXpValue] = useState(200);
  const [criteria, setCriteria] = useState("");
  const [targetRole, setTargetRole] = useState<"ALL" | "INFLUENCER" | "CAPTADOR">("ALL");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addBadge({
      id: `badge-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      icon_name: "Trophy",
      rarity,
      xp_value: xpValue,
      target_role: targetRole,
      criteria_description: criteria,
    });
    setIsModalOpen(false);
    setName("");
    setDescription("");
    setCriteria("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            Gamificação & Conquistas
          </div>
          <h1 className="text-3xl font-black text-white">Criador de Badges</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cadastre novas insígnias de conquista, defina critérios de desbloqueio e valor de prestígio.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Badge</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl border border-white/5 bg-dark-900 p-6 flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-dark-850 text-[10px] font-bold text-amber-400 uppercase">
                  {b.rarity}
                </span>
                <span className="text-[10px] text-zinc-500">{b.target_role}</span>
              </div>

              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h3 className="text-sm font-bold text-white mb-1">{b.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{b.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-center text-xs">
              <div className="text-[10px] text-zinc-400">Critério: {b.criteria_description}</div>
              <div className="text-brand-primary font-bold mt-1">+{b.xp_value} XP</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-dark-900 p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Criar Nova Badge</h3>

            <form onSubmit={handleSave} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Badge</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mestre dos Stories"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição da conquista..."
                  className="w-full p-3 rounded-xl bg-dark-850 border border-white/10 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Raridade</label>
                  <select
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  >
                    <option value="common">Comum</option>
                    <option value="rare">Rara</option>
                    <option value="epic">Épica</option>
                    <option value="legendary">Lendária</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">XP Concedido</label>
                  <input
                    type="number"
                    value={xpValue}
                    onChange={(e) => setXpValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Critério de Liberação</label>
                <input
                  type="text"
                  required
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="Ex: Entregar 10 campanhas aprovadas"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-xs text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase"
                >
                  Salvar Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
