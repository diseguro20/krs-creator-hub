"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Gamepad2,
  Layers,
  Inbox,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatNumber, formatXP } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { games, campaigns, submissions, referrals, activityLogs } = useKrsStore();

  const pendingSubs = submissions.filter((s) => s.status === "in_review").length;
  const approvedSubs = submissions.filter((s) => s.status === "approved").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Painel Geral de Operações
          </div>
          <h1 className="text-3xl font-black text-white">Métricas & Analytics</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visão consolidada da operação de criadores, campanhas ativas e esteira de moderação.
          </p>
        </div>

        <Link
          href="/admin/submissions"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Inbox className="w-4 h-4" />
          <span>Fila de Submissions ({pendingSubs})</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Creators Ativos</span>
            <Users className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-3xl font-black text-white">524</div>
          <div className="text-[10px] text-brand-primary font-semibold">+18% este mês</div>
        </div>

        <div className="p-5 rounded-3xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Submissions Pendentes</span>
            <Inbox className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{pendingSubs}</div>
          <div className="text-[10px] text-zinc-400">Aguardando moderação</div>
        </div>

        <div className="p-5 rounded-3xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Campanhas no Ar</span>
            <Layers className="w-4 h-4 text-brand-neon" />
          </div>
          <div className="text-3xl font-black text-white">{campaigns.length}</div>
          <div className="text-[10px] text-zinc-400">{games.length} jogos cadastrados</div>
        </div>

        <div className="p-5 rounded-3xl bg-dark-900 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Entregas Aprovadas</span>
            <CheckCircle2 className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-3xl font-black text-white">{approvedSubs + 48}</div>
          <div className="text-[10px] text-zinc-400">Taxa de aprovação: 94%</div>
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top Performing Games & Campaigns */}
        <div className="lg:col-span-7 rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Jogos & Campanhas Mais Escolhidos</h3>
              <p className="text-xs text-zinc-400">Volume de criadores participando ativamente</p>
            </div>
            <Link href="/admin/games" className="text-xs font-semibold text-amber-400 hover:underline">
              Gerenciar jogos
            </Link>
          </div>

          <div className="space-y-4">
            {games.map((game, idx) => {
              const count = idx === 0 ? 34 : idx === 1 ? 18 : idx === 2 ? 12 : 8;
              const barWidth = `${(count / 40) * 100}%`;

              return (
                <div key={game.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: game.primary_color }} />
                      {game.name}
                    </span>
                    <span className="text-zinc-400 font-medium">{count} creators inscritos</span>
                  </div>
                  <div className="h-2 rounded-full bg-dark-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: barWidth, backgroundColor: game.primary_color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Operational Efficiency KPI */}
        <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              SLA de Moderação
            </div>
            <h3 className="text-lg font-bold text-white">Eficiência Operacional</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Métricas de tempo de resposta da equipe de análise de conteúdo.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Tempo Médio de Moderação:</span>
              <span className="text-xs font-bold text-brand-primary">4.2 Horas</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Taxa de Alterações Solicitadas:</span>
              <span className="text-xs font-bold text-amber-400">6.5%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Retenção de Criadores (Mês 1):</span>
              <span className="text-xs font-bold text-brand-neon">88.4%</span>
            </div>
          </div>

          <Link
            href="/admin/submissions"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-bold text-white border border-white/10 transition"
          >
            <span>Ir para Fila de Análise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Log Snapshot */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Últimas Ações do Sistema (Audit Log)</h3>
          <Link href="/admin/logs" className="text-xs font-semibold text-amber-400 hover:underline">
            Ver log completo
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {activityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-dark-850 text-[10px] font-bold text-zinc-400 uppercase">
                  {log.user_role}
                </span>
                <span className="text-white font-medium">{log.user_name}</span>
                <span className="text-zinc-400">• {log.details}</span>
              </div>
              <span className="text-[11px] text-zinc-500 shrink-0">
                {new Date(log.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
