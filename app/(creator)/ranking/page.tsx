"use client";

import React from "react";
import {
  Trophy,
  Crown,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatXP } from "@/lib/utils";

const DEMO_LEADERBOARD = [
  {
    rank: 2,
    name: "Beatriz Lima",
    username: "biagames",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    level: 4,
    levelName: "Creator Pro",
    xp: 1920,
    streak: 4,
    campaigns: 5,
    approvalRate: "96%",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Gabriel Santos",
    username: "gabriel_play",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    level: 4,
    levelName: "Creator Pro",
    xp: 1680,
    streak: 3,
    campaigns: 4,
    approvalRate: "95%",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Larissa Mendes",
    username: "larissakrs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    level: 3,
    levelName: "Creator Plus",
    xp: 1240,
    streak: 3,
    campaigns: 3,
    approvalRate: "100%",
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: "Matheus Rocha",
    username: "rocha_games",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    level: 3,
    levelName: "Creator Plus",
    xp: 980,
    streak: 2,
    campaigns: 3,
    approvalRate: "92%",
    isCurrentUser: false,
  },
];

export default function RankingPage() {
  const { currentUser } = useKrsStore();
  const creatorUser = currentUser as any;

  const LEADERBOARD_USERS = [
    {
      rank: 1,
      name: creatorUser.name || "Seu Perfil (Creator)",
      username: creatorUser.username || "creator",
      avatar: creatorUser.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      level: creatorUser.current_level || 1,
      levelName: "Starter",
      xp: creatorUser.current_xp || 0,
      streak: creatorUser.streak_weeks || 0,
      campaigns: creatorUser.completed_campaigns_count || 0,
      approvalRate: "100%",
      isCurrentUser: true,
    },
    ...DEMO_LEADERBOARD,
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-pixel text-emerald-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LEADERBOARD • SEASON 1</span>
          </div>
          <h1 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wider drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]">
            RANKING DOS CREATORS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Métricas baseadas em qualidade de entrega, pontualidade, consistência e XP profissional de todos os jogos da KRS.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-900 border border-emerald-500/30 text-xs text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Critérios Éticos & Transparentes</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 flex flex-col items-center text-center justify-between order-2 md:order-1">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2">
              #2 LUGAR
            </div>
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-dark-850 border-2 border-zinc-400 mb-3 mx-auto">
              <img src={LEADERBOARD_USERS[1].avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <h3 className="text-sm font-bold text-white">{LEADERBOARD_USERS[1].name}</h3>
            <div className="text-[11px] text-zinc-400">@{LEADERBOARD_USERS[1].username}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 w-full flex justify-between text-xs">
            <span className="text-zinc-400">Pontuação:</span>
            <span className="font-bold text-brand-primary">{formatXP(LEADERBOARD_USERS[1].xp)}</span>
          </div>
        </div>

        {/* Rank 1 - Champion */}
        <div className="relative rounded-3xl border-2 border-emerald-400 bg-gradient-to-b from-[#0f1d14] to-[#07100b] p-6 sm:p-8 flex flex-col items-center text-center justify-between shadow-2xl shadow-emerald-500/20 arcade-box order-1 md:order-2 md:-translate-y-2">
          <div className="arcade-scanlines pointer-events-none opacity-20" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-dark-950 font-black text-[9px] font-pixel flex items-center gap-1 shadow-lg">
            <Crown className="w-3.5 h-3.5 fill-dark-950" />
            TOP 1
          </div>

          <div className="mt-2">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-dark-850 border-2 border-emerald-400 mb-3 mx-auto shadow-xl shadow-emerald-500/30">
              <img src={LEADERBOARD_USERS[0].avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
              <span>{LEADERBOARD_USERS[0].name}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-pixel">VOCÊ</span>
            </h3>
            <div className="text-xs text-emerald-400 font-semibold font-mono">@{LEADERBOARD_USERS[0].username}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 w-full flex justify-between text-xs">
            <span className="text-zinc-400">Pontuação:</span>
            <span className="font-pixel text-emerald-400 font-black text-sm">{formatXP(LEADERBOARD_USERS[0].xp)}</span>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 flex flex-col items-center text-center justify-between order-3">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2">
              #3 LUGAR
            </div>
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-dark-850 border-2 border-amber-700/60 mb-3 mx-auto">
              <img src={LEADERBOARD_USERS[2].avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <h3 className="text-sm font-bold text-white">{LEADERBOARD_USERS[2].name}</h3>
            <div className="text-[11px] text-zinc-400">@{LEADERBOARD_USERS[2].username}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 w-full flex justify-between text-xs">
            <span className="text-zinc-400">Pontuação:</span>
            <span className="font-bold text-brand-primary">{formatXP(LEADERBOARD_USERS[2].xp)}</span>
          </div>
        </div>
      </div>

      {/* Complete Table */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-base font-bold text-white">Tabela de Classificação Geral</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-6">Posição</th>
                <th className="py-3 px-6">Creator</th>
                <th className="py-3 px-6">Nível</th>
                <th className="py-3 px-6">Streak</th>
                <th className="py-3 px-6">Campanhas</th>
                <th className="py-3 px-6">Aprovação</th>
                <th className="py-3 px-6 text-right">XP Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LEADERBOARD_USERS.map((user) => (
                <tr
                  key={user.rank}
                  className={`hover:bg-dark-850/50 transition ${
                    user.isCurrentUser ? "bg-brand-primary/5 font-semibold" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-white">
                    {user.rank === 1 && "🥇 1"}
                    {user.rank === 2 && "🥈 2"}
                    {user.rank === 3 && "🥉 3"}
                    {user.rank > 3 && `#${user.rank}`}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <div className="text-white font-bold">{user.name}</div>
                        <div className="text-[10px] text-zinc-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-dark-800 text-[10px] text-brand-primary font-bold">
                      Nível {user.level}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-amber-400 font-bold">
                    🔥 {user.streak} sem
                  </td>
                  <td className="py-4 px-6 text-zinc-300">{user.campaigns}</td>
                  <td className="py-4 px-6 text-brand-primary">{user.approvalRate}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-white">
                    {formatXP(user.xp)}
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
