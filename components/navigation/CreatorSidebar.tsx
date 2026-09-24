"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  LayoutDashboard,
  Layers,
  Sparkles,
  Trophy,
  Award,
  FolderDown,
  HelpCircle,
  Smartphone,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Zap,
  Wallet,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Painel de Afiliado", href: "/afiliados", icon: Zap, badge: "PIX" },
  { label: "Nossos Jogos", href: "/jogos", icon: Gamepad2 },
  { label: "Ranking dos Creators", href: "/ranking", icon: TrendingUp },
  { label: "Meu Perfil", href: "/perfil", icon: User },
];

export function CreatorSidebar() {
  const pathname = usePathname();
  const { currentUser, levels, logout } = useKrsStore();
  const creator = (currentUser as CreatorProfile) || {
    name: "Criador",
    current_level: 1,
    current_xp: 0,
  };

  const currentLevelInfo = levels.find((l) => l.level === (creator.current_level || 1)) || levels[0];
  const nextLevelInfo = levels.find((l) => l.level === (creator.current_level || 1) + 1);

  const xpProgress = nextLevelInfo
    ? Math.min(100, Math.round(((creator.current_xp || 0) / nextLevelInfo.min_xp) * 100))
    : 100;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/5 bg-dark-950 p-4 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1.5 mb-6 group select-none">
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md" />
            <img
              src="/krs-logo.png"
              alt="KRS Criadores"
              className="relative z-10 h-11 w-11 object-contain animate-sophisticated-float group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white flex items-center gap-1 leading-tight">
              KRS <span className="text-brand-primary">CRIADORES</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
              CREATOR HUB VIP
            </span>
          </div>
        </Link>

        {/* Level XP Widget in Sidebar */}
        <div className="mx-1 mb-6 rounded-2xl border border-white/5 bg-dark-900/90 p-3.5 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-brand-primary" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                NÍVEL {creator.current_level || 1}
              </span>
            </div>
            <span className="text-[10px] font-bold text-brand-primary">
              {currentLevelInfo.name}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>{formatXP(creator.current_xp || 0)}</span>
              <span>{nextLevelInfo ? formatXP(nextLevelInfo.min_xp) : "Nível Máx"}</span>
            </div>
            <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-neon transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/25 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-dark-900 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}

              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer support */}
      <div className="pt-4 border-t border-white/5 space-y-1">
        <Link
          href="/ajuda"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-dark-900 transition"
        >
          <HelpCircle className="w-4 h-4 text-zinc-400" />
          <span>Central de Ajuda & FAQ</span>
        </Link>
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-dark-900 transition text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-zinc-500" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
}
