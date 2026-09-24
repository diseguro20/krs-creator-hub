"use client";

import React, { useState } from "react";
import {
  Gamepad2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { Game, GameCategory, GameStatus } from "@/types";

export default function AdminGamesPage() {
  const { games, addGame, updateGame, deleteGame } = useKrsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<GameCategory>("Habilidade");
  const [primaryColor, setPrimaryColor] = useState("#00F59B");
  const [description, setDescription] = useState("");
  const [howItWorks, setHowItWorks] = useState("");
  const [tags, setTags] = useState("Habilidade, Torneio, Mobile");
  const [logoUrl, setLogoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [playUrl, setPlayUrl] = useState("");
  const [status, setStatus] = useState<GameStatus>("active");

  const openCreateModal = () => {
    setEditingGame(null);
    setName("");
    setSlug("");
    setCategory("Habilidade");
    setPrimaryColor("#00F59B");
    setDescription("");
    setHowItWorks("");
    setTags("Habilidade, Competitivo");
    setLogoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80");
    setThumbnailUrl("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80");
    setBannerUrl("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80");
    setPlayUrl("https://game.example.com");
    setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setName(game.name);
    setSlug(game.slug);
    setCategory(game.category);
    setPrimaryColor(game.primary_color);
    setDescription(game.description);
    setHowItWorks(game.how_it_works);
    setTags(game.tags.join(", "));
    setLogoUrl(game.logo_url);
    setThumbnailUrl(game.thumbnail_url);
    setBannerUrl(game.banner_url);
    setPlayUrl(game.play_url);
    setStatus(game.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingGame) {
      updateGame(editingGame.id, {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        category,
        primary_color: primaryColor,
        description,
        how_it_works: howItWorks,
        tags: tagArray,
        logo_url: logoUrl,
        thumbnail_url: thumbnailUrl,
        banner_url: bannerUrl,
        play_url: playUrl,
        status,
      });
    } else {
      addGame({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        category,
        primary_color: primaryColor,
        description,
        how_it_works: howItWorks,
        tags: tagArray,
        logo_url: logoUrl,
        thumbnail_url: thumbnailUrl,
        banner_url: bannerUrl,
        play_url: playUrl,
        status,
        campaigns_count: 0,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Gamepad2 className="w-4 h-4" />
            Catálogo de Títulos
          </div>
          <h1 className="text-3xl font-black text-white">Gerenciamento de Jogos</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cadastre novos jogos por habilidade. Ao salvar, os títulos aparecem imediatamente no catálogo de creators.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Jogo</span>
        </button>
      </div>

      {/* Games Table */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-6">Jogo</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Cor da Marca</th>
                <th className="py-3 px-6">Tags</th>
                <th className="py-3 px-6">Campanhas</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {games.map((g) => (
                <tr key={g.id} className="hover:bg-dark-850/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={g.thumbnail_url} alt="" className="h-10 w-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white text-sm">{g.name}</div>
                        <div className="text-[10px] text-zinc-400">/{g.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-md bg-dark-800 text-zinc-200 font-semibold text-[11px]">
                      {g.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: g.primary_color }} />
                      <span className="font-mono text-[11px] text-zinc-300">{g.primary_color}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {g.tags.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-dark-850 text-[10px] text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-white">
                    {g.campaigns_count || 1}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold">
                      Ativo
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(g)}
                      className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-zinc-300 hover:text-white transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover o jogo "${g.name}"?`)) deleteGame(g.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Game Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-dark-900 p-6 sm:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingGame ? "Editar Jogo" : "Cadastrar Novo Jogo"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Jogo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Bubbles Cash"
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Slug (URL amigável)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Ex: bubbles-cash"
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Habilidade">Habilidade</option>
                    <option value="Reflexo">Reflexo</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Arcade">Arcade</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor Principal (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-8 w-10 rounded bg-dark-850 border border-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição Comercial</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Como Funciona (Mecânica Competitiva)</label>
                  <textarea
                    rows={2}
                    required
                    value={howItWorks}
                    onChange={(e) => setHowItWorks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Banner URL</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Tags (Separadas por vírgula)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition"
                >
                  Salvar Jogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
