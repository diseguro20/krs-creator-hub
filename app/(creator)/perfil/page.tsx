"use client";

import React, { useState } from "react";
import {
  User,
  Instagram,
  Youtube,
  Share2,
  Trophy,
  Flame,
  Zap,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

export default function CreatorProfilePage() {
  const { currentUser, updateCurrentUser, userBadges, badges } = useKrsStore();
  const creator = (currentUser as CreatorProfile) || {
    name: "Creator",
    username: "creator",
    phone: "",
    city: "São Paulo",
    state: "SP",
    current_level: 1,
    current_xp: 0,
    streak_weeks: 1,
    completed_campaigns_count: 0,
  };

  const [name, setName] = useState(creator.name);
  const [phone, setPhone] = useState(creator.phone || "+55 (11) 98765-4321");
  const [city, setCity] = useState(creator.city || "São Paulo");
  const [state, setState] = useState(creator.state || "SP");
  const [isPublic, setIsPublic] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      phone,
      city,
      state,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(creator, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `krs_creator_data_${creator.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <User className="w-4 h-4" />
          Gerenciamento de Conta
        </div>
        <h1 className="text-3xl font-black text-white">Meu Perfil de Parceiro</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Atualize seus dados cadastrais, redes sociais conectadas e preferências de privacidade LGPD.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-xs text-brand-primary flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Informações do perfil atualizadas com sucesso!</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 text-center space-y-4">
            <div className="relative h-24 w-24 rounded-3xl overflow-hidden bg-dark-850 border-2 border-brand-primary/40 mx-auto shadow-xl">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-2xl text-white">
                  {creator.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{creator.name}</h2>
              <div className="text-xs text-zinc-400">@{creator.username}</div>
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-bold text-brand-primary">
                Nível {creator.current_level || 1} • {formatXP(creator.current_xp || 0)}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 text-xs">
              <div className="p-2.5 rounded-xl bg-dark-850 text-center">
                <div className="text-zinc-400 text-[10px]">Sequência</div>
                <div className="font-bold text-amber-400 mt-0.5">🔥 {creator.streak_weeks || 1} Semanas</div>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-850 text-center">
                <div className="text-zinc-400 text-[10px]">Campanhas</div>
                <div className="font-bold text-white mt-0.5">{creator.completed_campaigns_count || 7} Concluídas</div>
              </div>
            </div>

            {/* Public profile toggle */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Perfil Público:</span>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                  isPublic ? "bg-brand-primary text-dark-950" : "bg-dark-800 text-zinc-500"
                }`}
              >
                {isPublic ? "Ativado" : "Privado"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form & LGPD Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-4">Dados Cadastrais</h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    WhatsApp para Contato Oficial
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary uppercase"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-primary text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition shadow-md shadow-brand-primary/15"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* LGPD & Privacy Rights */}
          <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              Direitos de Privacidade & LGPD
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode a qualquer momento exportar seus dados ou solicitar encerramento.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 text-xs font-semibold text-zinc-200 transition"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Meus Dados (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Sua solicitação de exclusão de conta foi registrada.")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Solicitar Exclusão da Conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
