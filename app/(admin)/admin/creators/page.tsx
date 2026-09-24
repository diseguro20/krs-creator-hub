"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Flame,
  Award,
  ExternalLink,
  X,
  Trophy,
  CheckCircle2,
  Clock,
  Instagram,
  Share2,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

const DEMO_CREATORS_LIST: CreatorProfile[] = [
  {
    id: "user-creator-1",
    email: "lucas.creator@krscreatorhub.com",
    name: "Lucas Alencar",
    username: "lucas_gaming",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    phone: "+55 (11) 98765-4321",
    city: "São Paulo",
    state: "SP",
    role: "INFLUENCER",
    onboarding_completed: true,
    niches: ["Gaming", "Humor", "Entretenimento"],
    social_accounts: [
      {
        platform: "instagram",
        username: "lucas_gaming",
        url: "https://instagram.com/lucas_gaming",
        followers: 128500,
        avg_views: 45000,
        engagement_rate: 6.8,
      },
    ],
    campaign_preferences: ["Jogos de Habilidade", "Puzzle"],
    current_xp: 2430,
    current_level: 5,
    streak_weeks: 5,
    completed_campaigns_count: 7,
    approved_submissions_count: 24,
    referred_by_code: "MARCOS10",
    created_at: "2026-08-01T10:00:00Z",
    updated_at: "2026-09-15T18:30:00Z",
  },
  {
    id: "user-creator-2",
    email: "beatriz.lima@example.com",
    name: "Beatriz Lima",
    username: "biagames",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    phone: "+55 (21) 97766-5544",
    city: "Rio de Janeiro",
    state: "RJ",
    role: "INFLUENCER",
    onboarding_completed: true,
    niches: ["Gaming", "Trap & Funk"],
    social_accounts: [
      {
        platform: "tiktok",
        username: "biagames",
        url: "https://tiktok.com/@biagames",
        followers: 310000,
        avg_views: 92000,
        engagement_rate: 7.9,
      },
    ],
    campaign_preferences: ["Desafios Rápidos"],
    current_xp: 1920,
    current_level: 4,
    streak_weeks: 4,
    completed_campaigns_count: 5,
    approved_submissions_count: 18,
    referred_by_code: "MARCOS10",
    created_at: "2026-08-10T11:00:00Z",
    updated_at: "2026-09-14T12:00:00Z",
  },
  {
    id: "user-creator-3",
    email: "gabriel.play@example.com",
    name: "Gabriel Santos",
    username: "gabriel_play",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    phone: "+55 (31) 98877-6655",
    city: "Belo Horizonte",
    state: "MG",
    role: "INFLUENCER",
    onboarding_completed: true,
    niches: ["Gaming", "E-sports"],
    social_accounts: [
      {
        platform: "youtube",
        username: "GabrielPlayOficial",
        url: "https://youtube.com",
        followers: 85000,
        avg_views: 32000,
        engagement_rate: 5.4,
      },
    ],
    campaign_preferences: ["Jogos de Reflexo"],
    current_xp: 1680,
    current_level: 4,
    streak_weeks: 3,
    completed_campaigns_count: 4,
    approved_submissions_count: 14,
    referred_by_code: "MARCOS10",
    created_at: "2026-08-15T09:00:00Z",
    updated_at: "2026-09-15T10:00:00Z",
  },
];

export default function AdminCreatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  const filteredCreators = DEMO_CREATORS_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Users className="w-4 h-4" />
            Comunidade de Talentos
          </div>
          <h1 className="text-3xl font-black text-white">Creators & Influencers</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gerencie criadores cadastrados, histórico de entregas, métricas de redes sociais e nível de reputação.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, @, cidade..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Creators Table */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-6">Creator</th>
                <th className="py-3 px-6">Nível & XP</th>
                <th className="py-3 px-6">Localização</th>
                <th className="py-3 px-6">Streak</th>
                <th className="py-3 px-6">Entregas</th>
                <th className="py-3 px-6">Captador</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCreators.map((c) => (
                <tr key={c.id} className="hover:bg-dark-850/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar_url} alt="" className="h-9 w-9 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-[10px] text-zinc-400">@{c.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-dark-800 text-[10px] font-bold text-brand-primary">
                      Nível {c.current_level}
                    </span>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{formatXP(c.current_xp)}</div>
                  </td>
                  <td className="py-4 px-6 text-zinc-300">
                    {c.city}, {c.state}
                  </td>
                  <td className="py-4 px-6 text-amber-400 font-bold">
                    🔥 {c.streak_weeks} sem
                  </td>
                  <td className="py-4 px-6 text-zinc-200 font-semibold">
                    {c.completed_campaigns_count} campanhas
                  </td>
                  <td className="py-4 px-6 font-mono text-brand-neon">
                    {c.referred_by_code || "Direto"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedCreator(c)}
                      className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs font-semibold text-white transition border border-white/5"
                    >
                      Inspecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Profile Inspection Drawer */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-dark-900 border-l border-white/10 p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Ficha do Criador
              </span>
              <button
                onClick={() => setSelectedCreator(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex items-center gap-4">
              <img src={selectedCreator.avatar_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCreator.name}</h3>
                <div className="text-xs text-zinc-400">@{selectedCreator.username}</div>
                <div className="text-xs text-zinc-400">{selectedCreator.email}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-dark-850">
                <div className="text-zinc-500 text-[10px]">Pontuação</div>
                <div className="font-bold text-brand-primary">{formatXP(selectedCreator.current_xp)}</div>
              </div>
              <div className="p-3 rounded-xl bg-dark-850">
                <div className="text-zinc-500 text-[10px]">Campanhas Concluídas</div>
                <div className="font-bold text-white">{selectedCreator.completed_campaigns_count}</div>
              </div>
            </div>

            {/* Social Networks info */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Redes Conectadas</h4>
              {selectedCreator.social_accounts.map((soc, i) => (
                <div key={i} className="p-3 rounded-xl bg-dark-850 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">@{soc.username}</div>
                    <div className="text-[10px] text-zinc-400 capitalize">{soc.platform} • {soc.followers.toLocaleString("pt-BR")} seguidores</div>
                  </div>
                  <a href={soc.url} target="_blank" rel="noreferrer" className="text-brand-primary hover:underline">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            {/* Niches */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nichos de Conteúdo</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCreator.niches.map((niche, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-dark-850 text-xs text-zinc-300">
                    {niche}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <button
                type="button"
                onClick={() => alert(`Mensagem direta enviada para o WhatsApp de ${selectedCreator.name}`)}
                className="w-full py-2.5 rounded-xl bg-brand-primary text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition"
              >
                Contatar via WhatsApp Oficial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
