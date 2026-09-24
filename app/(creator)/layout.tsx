"use client";

import React from "react";
import { CreatorSidebar } from "@/components/navigation/CreatorSidebar";
import { CreatorHeader } from "@/components/navigation/CreatorHeader";
import { CreatorMobileNav } from "@/components/navigation/CreatorMobileNav";
import { useKrsStore } from "@/lib/store/useKrsStore";
import Link from "next/link";
import { Lock, ArrowRight, UserPlus, Gamepad2 } from "lucide-react";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthLoaded } = useKrsStore();

  // Se a verificação de sessão terminou e não há usuário autenticado:
  if (isAuthLoaded && !currentUser) {
    return (
      <div className="min-h-screen bg-[#070c09] text-white flex flex-col items-center justify-center p-4 selection:bg-[#00F59B] selection:text-dark-950">
        <div className="max-w-md w-full bg-[#0d1611] border border-emerald-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl shadow-emerald-500/10 arcade-box">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-pixel text-lg sm:text-xl text-white uppercase tracking-wider">
              ACESSO RESTRITO
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Para acessar o Painel de Afiliados, gerenciar suas campanhas, links de divulgação e solicitar saques PIX, você precisa criar sua conta ou entrar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/cadastro"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider hover:from-emerald-400 hover:to-green-300 transition text-center shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar Conta</span>
            </Link>

            <Link
              href="/login"
              className="flex-1 py-3 px-4 rounded-xl bg-dark-900 border border-white/10 hover:border-white/20 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Entrar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-2 border-t border-white/5">
            <Link href="/" className="text-[11px] text-zinc-500 hover:text-emerald-400 transition">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex text-zinc-100 selection:bg-brand-primary selection:text-dark-950">
      {/* Desktop Left Sidebar */}
      <CreatorSidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        <CreatorHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <CreatorMobileNav />
    </div>
  );
}
