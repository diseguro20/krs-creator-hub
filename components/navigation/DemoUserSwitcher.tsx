"use client";

import React, { useState } from "react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import {
  ShieldAlert,
  UserCheck,
  Zap,
  Users,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DemoUserSwitcher() {
  const { currentUser, switchUserRole, awardXP, resetAllData } = useKrsStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // If on landing, show minimal switcher
  const isLanding = pathname === "/";

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-40">
      {isOpen ? (
        <div className="w-80 rounded-2xl border border-white/10 bg-dark-900/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Painel de Demonstração
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-dark-800 transition"
              title="Fechar seletor"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3">
            <p className="text-[11px] text-zinc-400 mb-2">
              Perfil Ativo no Momento:
            </p>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-850 border border-white/5">
              <div className="h-8 w-8 rounded-lg overflow-hidden bg-zinc-800 border border-white/10 shrink-0">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-xs text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-brand-primary font-medium">{currentUser.role}</div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-medium text-zinc-400 mb-1">
              Alternar Modo de Visão:
            </p>
            
            <button
              onClick={() => {
                switchUserRole("INFLUENCER");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentUser.role === "INFLUENCER"
                  ? "bg-brand-primary/15 border border-brand-primary/40 text-brand-primary"
                  : "bg-dark-850 hover:bg-dark-800 text-zinc-300 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Influencer / Creator</span>
              </div>
              <span className="text-[10px] opacity-75">Lucas (Nível 5)</span>
            </button>

            <button
              onClick={() => {
                switchUserRole("CAPTADOR");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentUser.role === "CAPTADOR"
                  ? "bg-brand-neon/15 border border-brand-neon/40 text-brand-neon"
                  : "bg-dark-850 hover:bg-dark-800 text-zinc-300 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-brand-neon" />
                <span>Captador de Talentos</span>
              </div>
              <span className="text-[10px] opacity-75">Marcos (Ref MARCOS10)</span>
            </button>

            <button
              onClick={() => {
                switchUserRole("ADMIN");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                currentUser.role === "ADMIN"
                  ? "bg-amber-500/15 border border-amber-500/40 text-amber-400"
                  : "bg-dark-850 hover:bg-dark-800 text-zinc-300 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Administrador Geral</span>
              </div>
              <span className="text-[10px] opacity-75">KRS Ops</span>
            </button>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
            <Link
              href="/dashboard"
              className="text-center py-1.5 px-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-zinc-300 text-[11px] font-medium transition"
            >
              Dashboard Creator
            </Link>
            <Link
              href="/admin"
              className="text-center py-1.5 px-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-zinc-300 text-[11px] font-medium transition"
            >
              Painel Admin
            </Link>
          </div>

          {/* Testing tools */}
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <button
              onClick={() => awardXP(150, "Bônus de teste no Demo Switcher")}
              className="flex items-center gap-1 text-brand-primary hover:underline"
            >
              <Zap className="w-3 h-3" />
              +150 XP de Teste
            </button>
            <button
              onClick={resetAllData}
              className="flex items-center gap-1 text-zinc-400 hover:text-red-400 transition"
              title="Restaurar dados de fábrica"
            >
              <RotateCcw className="w-3 h-3" />
              Resetar Dados
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-dark-900/90 hover:bg-dark-850 border border-white/10 shadow-xl shadow-black/60 text-xs font-semibold text-white backdrop-blur-lg hover:border-brand-primary/40 transition group"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-brand-primary group-hover:scale-110 transition" />
          <span>Demo: {currentUser.role}</span>
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition" />
        </button>
      )}
    </div>
  );
}
