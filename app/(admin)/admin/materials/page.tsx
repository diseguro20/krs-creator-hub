"use client";

import React, { useState } from "react";
import {
  FolderDown,
  Plus,
  Trash2,
  FileText,
  FileImage,
  Check,
  X,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function AdminMaterialsPage() {
  const { scripts, creativeAssets, addScript, addCreativeAsset, games } = useKrsStore();

  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // Script Form State
  const [scriptTitle, setScriptTitle] = useState("");
  const [scriptCategory, setScriptCategory] = useState<any>("story");
  const [scriptContent, setScriptContent] = useState("");
  const [scriptCta, setScriptCta] = useState("");
  const [scriptGameId, setScriptGameId] = useState(games[0]?.id || "");

  // Asset Form State
  const [assetTitle, setAssetTitle] = useState("");
  const [assetType, setAssetType] = useState<any>("banner");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetGameId, setAssetGameId] = useState(games[0]?.id || "");

  const handleSaveScript = (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find((g) => g.id === scriptGameId);
    addScript({
      title: scriptTitle,
      game_id: scriptGameId,
      game_name: game?.name || "Geral",
      category: scriptCategory,
      content: scriptContent,
      call_to_action: scriptCta,
      tips: ["Gravar em local silencioso", "Focar nos primeiros 3 segundos"],
      duration_estimate: "30 segundos",
    });
    setIsScriptModalOpen(false);
    setScriptTitle("");
    setScriptContent("");
    setScriptCta("");
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find((g) => g.id === assetGameId);
    addCreativeAsset({
      title: assetTitle,
      game_id: assetGameId,
      game_name: game?.name || "Geral",
      type: assetType,
      file_url: assetUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&auto=format&fit=crop&q=80",
      preview_url: assetUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80",
      file_size: "3.5 MB",
      tags: ["Oficial", "KRS", "HD"],
    });
    setIsAssetModalOpen(false);
    setAssetTitle("");
    setAssetUrl("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <FolderDown className="w-4 h-4" />
            Biblioteca de Conteúdo
          </div>
          <h1 className="text-3xl font-black text-white">Central de Materiais & Roteiros</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cadastre roteiros com copies validadas e faça upload de artes e logos disponíveis para os criadores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase hover:bg-amber-400 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Roteiro</span>
          </button>
          <button
            onClick={() => setIsAssetModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-white font-bold text-xs uppercase border border-white/10 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Asset</span>
          </button>
        </div>
      </div>

      {/* Roteiros Table */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-base font-bold text-white">Roteiros Cadastrados ({scripts.length})</h3>
        </div>

        <div className="divide-y divide-white/5">
          {scripts.map((s) => (
            <div key={s.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-dark-850 text-[10px] font-bold text-amber-400 uppercase">
                    {s.category}
                  </span>
                  <span className="font-bold text-white text-sm">{s.title}</span>
                  <span className="text-zinc-400">• {s.game_name}</span>
                </div>
                <p className="text-zinc-400 line-clamp-2 italic">&quot;{s.content}&quot;</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-zinc-500">{s.duration_estimate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Assets Grid */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white">Banners e Mídia ({creativeAssets.length})</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {creativeAssets.map((asset) => (
            <div key={asset.id} className="rounded-2xl bg-dark-850 border border-white/5 overflow-hidden p-3 space-y-2">
              <div className="h-28 w-full rounded-xl overflow-hidden bg-dark-900">
                <img src={asset.preview_url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="text-xs font-bold text-white truncate">{asset.title}</div>
              <div className="text-[10px] text-zinc-400">{asset.type} • {asset.file_size}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Script Modal */}
      {isScriptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-dark-900 p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setIsScriptModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Novo Roteiro para Creators</h3>

            <form onSubmit={handleSaveScript} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Roteiro</label>
                <input
                  type="text"
                  required
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                  placeholder="Ex: Story Dinâmico 30s"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Jogo</label>
                  <select
                    value={scriptGameId}
                    onChange={(e) => setScriptGameId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Formato</label>
                  <select
                    value={scriptCategory}
                    onChange={(e) => setScriptCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                  >
                    <option value="story">Story</option>
                    <option value="reel_tiktok">Reel / TikTok</option>
                    <option value="short_hook">Hook Rápido</option>
                    <option value="caption_legend">Legenda Pronta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Texto da Copy</label>
                <textarea
                  rows={4}
                  required
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="Fala galera! Hoje trouxe um desafio insano..."
                  className="w-full p-3 rounded-xl bg-dark-850 border border-white/10 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">CTA (Call To Action)</label>
                <input
                  type="text"
                  required
                  value={scriptCta}
                  onChange={(e) => setScriptCta(e.target.value)}
                  placeholder="Ex: Clica no link da bio e me desafia!"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScriptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-xs text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase"
                >
                  Salvar Roteiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-dark-900 p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setIsAssetModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Cadastrar Mídia Oficial</h3>

            <form onSubmit={handleSaveAsset} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Asset</label>
                <input
                  type="text"
                  required
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  placeholder="Ex: Logo Oficial PNG HD"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">URL da Imagem / Arquivo</label>
                <input
                  type="url"
                  required
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-xs text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase"
                >
                  Salvar Mídia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
