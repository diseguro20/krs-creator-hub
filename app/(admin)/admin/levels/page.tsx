"use client";

import React, { useState } from "react";
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  X,
  Award,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { LevelConfig } from "@/types";
import { formatXP } from "@/lib/utils";

export default function AdminLevelsPage() {
  const { levels, addLevel, updateLevel, deleteLevel } = useKrsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelNum, setLevelNum] = useState(levels.length + 1);
  const [name, setName] = useState("");
  const [minXp, setMinXp] = useState(3000);
  const [color, setColor] = useState("#00F59B");
  const [badgeTitle, setBadgeTitle] = useState("");
  const [perksText, setPerksText] = useState("");

  const openCreateModal = () => {
    setLevelNum(levels.length + 1);
    setName(`Nível ${levels.length + 1}`);
    setMinXp(levels[levels.length - 1]?.min_xp + 1000 || 5000);
    setColor("#00F59B");
    setBadgeTitle("Mestre de Campanhas");
    setPerksText("Multiplicador de XP 1.3x\nAtendimento via WhatsApp VIP");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const perks = perksText.split("\n").map((p) => p.trim()).filter(Boolean);

    addLevel({
      level: levelNum,
      name,
      min_xp: minXp,
      color,
      icon_name: "Trophy",
      badge_title: badgeTitle,
      unlocked_perks: perks,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Sliders className="w-4 h-4" />
            Estrutura de Níveis
          </div>
          <h1 className="text-3xl font-black text-white">Editor de Níveis & Patentes</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure faixas de XP, títulos de prestígio e benefícios desbloqueados para os parceiros.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Nível</span>
        </button>
      </div>

      {/* Levels Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((lvl) => (
          <div
            key={lvl.level}
            className="rounded-3xl border border-white/5 bg-dark-900 p-6 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-md"
                style={{ backgroundColor: `${lvl.color}20`, color: lvl.color, borderColor: `${lvl.color}40` }}
              >
                NÍVEL {lvl.level}
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {formatXP(lvl.min_xp)}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{lvl.name}</h3>
              <div className="text-xs text-zinc-400 mt-0.5">{lvl.badge_title}</div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-zinc-400">Benefícios Desbloqueados:</div>
                <ul className="space-y-1">
                  {lvl.unlocked_perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span className="truncate">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">Cor: {lvl.color}</span>
              {lvl.level > 2 && (
                <button
                  type="button"
                  onClick={() => deleteLevel(lvl.level)}
                  className="text-red-400 hover:text-red-300 p-1"
                  title="Excluir nível"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
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

            <h3 className="text-xl font-bold text-white">Criar Novo Nível</h3>

            <form onSubmit={handleSave} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Número do Nível</label>
                  <input
                    type="number"
                    required
                    value={levelNum}
                    onChange={(e) => setLevelNum(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">XP Mínimo</label>
                  <input
                    type="number"
                    required
                    value={minXp}
                    onChange={(e) => setMinXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Patente</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Creator Master"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título de Distintivo</label>
                <input
                  type="text"
                  value={badgeTitle}
                  onChange={(e) => setBadgeTitle(e.target.value)}
                  placeholder="Ex: Lendário dos Torneios"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Benefícios (Um por linha)
                </label>
                <textarea
                  rows={3}
                  value={perksText}
                  onChange={(e) => setPerksText(e.target.value)}
                  placeholder="Ex: Multiplicador 1.3x&#10;Acesso antecipado aos jogos"
                  className="w-full p-3 rounded-xl bg-dark-850 border border-white/10 text-xs text-white resize-none"
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
                  Salvar Nível
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
