"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
  CheckCircle2,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { Campaign, Mission, UploadType } from "@/types";

export default function AdminCampaignsPage() {
  const { campaigns, games, addCampaign, updateCampaign, deleteCampaign } = useKrsStore();

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Campaign | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [gameId, setGameId] = useState(games[0]?.id || "");
  const [description, setDescription] = useState("");
  const [minLevel, setMinLevel] = useState(1);
  const [sequential, setSequential] = useState(true);
  const [xpTotal, setXpTotal] = useState(500);
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80");
  
  // Mission Steps Builder
  const [missions, setMissions] = useState<Omit<Mission, "id" | "campaign_id">[]>([
    {
      step_order: 1,
      title: "Instalar & Testar Jogo",
      description: "Baixe o aplicativo e familiarize-se com os controles.",
      requirements: ["Confirmar dispositivo"],
      xp_reward: 50,
      upload_type: "document",
      deadline_days: 2,
    },
    {
      step_order: 2,
      title: "Print do Jogo ou Story Publicado",
      description: "Envie print comprovando o story ou partida jogada (vídeo não obrigatório).",
      requirements: ["Print da publicação ou tela do jogo"],
      xp_reward: 150,
      upload_type: "image",
      deadline_days: 3,
    },
    {
      step_order: 3,
      title: "Publicar Story com Link Oficial",
      description: "Poste nos Stories utilizando o sticker com link.",
      requirements: ["Inserir figurinha de link"],
      xp_reward: 100,
      upload_type: "link",
      deadline_days: 2,
    },
  ]);

  const addMissionStep = () => {
    setMissions((prev) => [
      ...prev,
      {
        step_order: prev.length + 1,
        title: `Nova Etapa ${prev.length + 1}`,
        description: "Descreva a ação requerida do creator nesta etapa.",
        requirements: ["Requisito da missão"],
        xp_reward: 100,
        upload_type: "image",
        deadline_days: 3,
      },
    ]);
  };

  const removeMissionStep = (index: number) => {
    setMissions((prev) => prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, step_order: i + 1 })));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === missions.length - 1)) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...missions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMissions(updated.map((m, i) => ({ ...m, step_order: i + 1 })));
  };

  const openNewBuilder = () => {
    setEditingCamp(null);
    setTitle("");
    setSlug("");
    setGameId(games[0]?.id || "");
    setDescription("");
    setMinLevel(1);
    setSequential(true);
    setXpTotal(500);
    setIsBuilderOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find((g) => g.id === gameId) || games[0];

    const campaignMissions: Mission[] = missions.map((m, idx) => ({
      ...m,
      id: `m-${Date.now()}-${idx}`,
      campaign_id: editingCamp?.id || `camp-${Date.now()}`,
    }));

    if (editingCamp) {
      updateCampaign(editingCamp.id, {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        game_id: game.id,
        game_name: game.name,
        game_slug: game.slug,
        game_color: game.primary_color,
        description,
        min_level: minLevel,
        sequential_progression: sequential,
        xp_total: xpTotal,
        missions: campaignMissions,
      });
    } else {
      addCampaign({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        game_id: game.id,
        game_name: game.name,
        game_slug: game.slug,
        game_color: game.primary_color,
        game_thumbnail: game.thumbnail_url,
        banner_url: bannerUrl,
        description,
        benefits: ["Cache prioritário", `+${xpTotal} XP no Hub`, "Destaque nos rankings"],
        instructions: "Siga o passo a passo com rigor e dedicação.",
        status: "active",
        min_level: minLevel,
        max_creators: 100,
        active_creators_count: 0,
        sequential_progression: sequential,
        xp_total: xpTotal,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 86400000).toISOString(),
        missions: campaignMissions,
      });
    }

    setIsBuilderOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Layers className="w-4 h-4" />
            Campaign Engine
          </div>
          <h1 className="text-3xl font-black text-white">Campaign Builder</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Crie campanhas dinâmicas com esteiras sequenciais de missões. A interface do creator adapta a jornada automaticamente.
          </p>
        </div>

        <button
          onClick={openNewBuilder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Campanha</span>
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-dark-850 border border-white/10 shrink-0">
                <img src={camp.game_thumbnail} alt="" className="h-full w-full object-cover" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-dark-800 text-[10px] font-bold text-brand-primary uppercase">
                    {camp.game_name}
                  </span>
                  <span className="text-xs text-zinc-400">Nível Mínimo {camp.min_level}</span>
                  {camp.sequential_progression && (
                    <span className="text-[10px] text-amber-400 font-semibold">• Sequencial</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{camp.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1">{camp.description}</p>
                <div className="text-[11px] text-brand-primary font-bold mt-1">
                  {camp.missions.length} Etapas Cadastradas • +{camp.xp_total} XP Total
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (confirm(`Deseja remover a campanha "${camp.title}"?`)) deleteCampaign(camp.id);
                }}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Builder Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-dark-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setIsBuilderOpen(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Construtor Visual de Campanha
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {editingCamp ? "Editar Campanha" : "Nova Campanha & Missões"}
              </h2>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-6">
              {/* Campaign Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Título da Campanha</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Bubbles Cash: Desafio de Lançamento"
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Jogo Vinculado</label>
                  <select
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição & Briefing</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explique o objetivo da campanha para o criador..."
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nível Mínimo Requerido</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={minLevel}
                    onChange={(e) => setMinLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Recompensa Total em XP</label>
                  <input
                    type="number"
                    value={xpTotal}
                    onChange={(e) => setXpTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              {/* Mission Step Sequencer */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Etapas da Jornada ({missions.length})</h3>
                    <p className="text-[11px] text-zinc-400">Reordene ou adicione missões sequenciais</p>
                  </div>
                  <button
                    type="button"
                    onClick={addMissionStep}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Etapa</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {missions.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-dark-800 text-[10px] font-black text-amber-400">
                            ETAPA {m.step_order}
                          </span>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMissions((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, title: val } : item))
                              );
                            }}
                            className="bg-transparent font-bold text-xs text-white border-b border-transparent hover:border-white/20 focus:border-amber-500 px-1 py-0.5 focus:outline-none"
                          />
                        </div>

                        {/* Reorder & Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveStep(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded bg-dark-800 text-zinc-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(idx, "down")}
                            disabled={idx === missions.length - 1}
                            className="p-1 rounded bg-dark-800 text-zinc-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMissionStep(idx)}
                            className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={m.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMissions((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, description: val } : item))
                            );
                          }}
                          placeholder="Descrição da etapa"
                          className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-dark-900 border border-white/5 text-xs text-zinc-300"
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={m.xp_reward}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setMissions((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, xp_reward: val } : item))
                              );
                            }}
                            className="w-20 px-2 py-1.5 rounded-lg bg-dark-900 border border-white/5 text-xs text-brand-primary font-bold text-center"
                          />
                          <span className="text-[10px] text-zinc-500">XP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Controls */}
              <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
