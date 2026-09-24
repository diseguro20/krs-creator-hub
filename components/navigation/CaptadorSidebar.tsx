"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  Users,
  TrendingUp,
  Award,
  HelpCircle,
  LogOut,
  QrCode,
  Share2,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CaptadorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

export function CaptadorSidebar() {
  const pathname = usePathname();
  const { currentUser } = useKrsStore();
  const captador = currentUser as CaptadorProfile;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/5 bg-dark-950 p-4 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <Link href="/captador" className="flex items-center gap-2.5 px-3 py-2 mb-6 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-neon text-dark-950 font-black shadow-lg shadow-brand-neon/20 group-hover:scale-105 transition">
            <Users className="w-5 h-5 text-dark-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
              KRS <span className="text-brand-neon">CAPTADOR</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">
              HUB
            </span>
          </div>
        </Link>

        {/* Captador Profile Card */}
        <div className="mx-1 mb-6 rounded-2xl border border-brand-neon/20 bg-dark-900/90 p-3.5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-brand-neon uppercase tracking-wider">
              NÍVEL {captador.current_level || 4} • CAPTADOR
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {formatXP(captador.current_xp || 1850)}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Código: <strong className="text-white font-mono">{captador.referral_code || "MARCOS10"}</strong>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <Link
            href="/captador"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              pathname === "/captador"
                ? "bg-brand-neon/15 text-brand-neon border border-brand-neon/30"
                : "text-zinc-400 hover:text-white hover:bg-dark-900 border border-transparent"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Painel & Minha Tropa</span>
          </Link>

          <Link
            href="/conquistas"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-dark-900 border border-transparent transition"
          >
            <Award className="w-4 h-4" />
            <span>Troféus & Badges</span>
          </Link>
        </nav>
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-white/5 space-y-1">
        <Link
          href="/ajuda"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-dark-900 transition"
        >
          <HelpCircle className="w-4 h-4 text-zinc-400" />
          <span>Dicas de Captação</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-dark-900 transition"
        >
          <LogOut className="w-4 h-4 text-zinc-500" />
          <span>Sair da Conta</span>
        </Link>
      </div>
    </aside>
  );
}
