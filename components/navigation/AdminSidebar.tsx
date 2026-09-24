"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Gamepad2,
  Layers,
  Inbox,
  Award,
  Zap,
  Sliders,
  FolderDown,
  Trophy,
  History,
  Settings,
  ArrowLeft,
  Webhook,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

const ADMIN_LINKS = [
  { label: "Visão Geral", href: "/admin", icon: LayoutDashboard },
  { label: "Fila de Submissions", href: "/admin/submissions", icon: Inbox, badgeKey: "pendingSubs" },
  { label: "Creators & Influencers", href: "/admin/creators", icon: Users },
  { label: "Gestão de Jogos", href: "/admin/games", icon: Gamepad2 },
  { label: "APIs & Webhooks dos Jogos", href: "/admin/integracoes", icon: Webhook },
  { label: "Campaign Builder", href: "/admin/campaigns", icon: Layers },
  { label: "Central de Materiais", href: "/admin/materials", icon: FolderDown },
  { label: "Creator Pass Seasons", href: "/admin/creator-pass", icon: Trophy },
  { label: "Regras de XP", href: "/admin/xp", icon: Zap },
  { label: "Editor de Níveis", href: "/admin/levels", icon: Sliders },
  { label: "Criador de Badges", href: "/admin/badges", icon: Award },
  { label: "Logs de Auditoria", href: "/admin/logs", icon: History },
  { label: "Configurações Globais", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { submissions } = useKrsStore();

  const pendingCount = submissions.filter((s) => s.status === "in_review").length;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/5 bg-dark-950 p-4 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-dark-950 font-black shadow-lg shadow-amber-500/20">
            <ShieldAlert className="w-5 h-5 text-dark-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
              KRS <span className="text-amber-400">ADMIN</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">
              OPERATIONS
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {ADMIN_LINKS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-dark-900 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badgeKey === "pendingSubs" && pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-dark-950 text-[10px] font-black">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Creator View */}
      <div className="pt-4 border-t border-white/5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-dark-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Hub do Creator</span>
        </Link>
      </div>
    </aside>
  );
}
