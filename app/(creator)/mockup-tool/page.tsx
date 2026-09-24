"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Upload,
  Sparkles,
  ShieldAlert,
  Download,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";

export default function MockupToolPage() {
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  );
  const [selectedGame, setSelectedGame] = useState("Bubbles Cash");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWallpaperUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <Smartphone className="w-4 h-4" />
          Gerador de Demonstração
        </div>
        <h1 className="text-3xl font-black text-white">Mockup de Smartphone</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Faça o upload do fundo da tela do celular para pré-visualizar layouts com jogos por habilidade da KRS.
        </p>
      </div>

      {/* Mandatory Regulatory Warning */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-amber-400 font-bold">AVISO DE TRANSPARÊNCIA: </strong>
          Todas as peças geradas por esta ferramenta possuem identificação visual explícita de{" "}
          <strong className="text-white">&quot;SIMULAÇÃO / DEMONSTRAÇÃO&quot;</strong>. É estritamente proibido utilizar mockups para falsificar notificações bancárias, ganhos garantidos ou saldos irreais.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls & Upload */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-white">Configurar Cenário</h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Envie o fundo do seu celular (Wallpaper)
              </label>
              <div className="relative border-2 border-dashed border-white/10 hover:border-brand-primary/40 rounded-2xl p-6 text-center transition bg-dark-850 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <ImageIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">Clique para selecionar imagem</div>
                <div className="text-[10px] text-zinc-400 mt-1">PNG ou JPG (Proporção 9:16 recomendada)</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Jogo em Demonstração
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="Bubbles Cash">Bubbles Cash (Torneio de Habilidade)</option>
                <option value="Blockerino">Blockerino (Grid Spatial Puzzle)</option>
                <option value="Helix Jump">Helix Jump (Arcade Reflex)</option>
                <option value="Flappy Cash">Flappy Cash (Timing Challenge)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert("Mockup renderizado e pronto para uso demonstrativo!")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-primary text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Mockup Demonstrativo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Phone Frame Simulation with prominent Watermark */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-72 sm:w-80 h-[580px] rounded-[42px] border-[10px] border-zinc-800 bg-black shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            {/* Wallpaper background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${wallpaperUrl})` }}
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* MANDATORY WATERMARK */}
            <div className="absolute top-12 left-0 right-0 z-20 flex justify-center pointer-events-none">
              <div className="px-3 py-1 rounded-full bg-amber-500/90 text-dark-950 text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                ⚠️ SIMULAÇÃO / DEMO
              </div>
            </div>

            {/* Top Phone Notch */}
            <div className="relative z-10 mx-auto w-32 h-5 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>

            {/* In-Game Overlay Demonstration Card */}
            <div className="relative z-10 rounded-2xl bg-dark-900/90 border border-white/10 p-4 backdrop-blur-xl shadow-2xl space-y-2 text-center">
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">
                TORNEIO DE HABILIDADE
              </span>
              <h4 className="text-base font-black text-white">{selectedGame}</h4>
              <p className="text-[10px] text-zinc-400">
                Mecânica com mesmo tabuleiro para todos os competidores.
              </p>
              <div className="pt-2">
                <div className="py-2 px-3 rounded-xl bg-brand-primary text-dark-950 text-xs font-bold shadow-md">
                  Jogar Partida de Treino
                </div>
              </div>
            </div>

            {/* Bottom Phone Bar */}
            <div className="relative z-10 mx-auto w-28 h-1 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
