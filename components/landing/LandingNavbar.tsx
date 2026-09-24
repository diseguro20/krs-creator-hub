"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gamepad2, Sparkles, ArrowRight, Menu, X, ShieldCheck, Zap } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, walletBalance, setWalletModalOpen, isAffiliateUser } = useKrsStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-dark-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-emerald-600 text-dark-950 font-black shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition">
            <Gamepad2 className="w-5 h-5 text-dark-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
              KRS <span className="text-brand-primary">CREATOR</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
              HUB
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="#jogos" className="hover:text-emerald-400 transition">
            Jogos
          </Link>
          <Link href="/afiliados" className="hover:text-emerald-400 text-emerald-400 flex items-center gap-1.5 transition font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Painel do Afiliado</span>
          </Link>
          <Link href="#como-funciona" className="hover:text-emerald-400 transition">
            Como Funciona
          </Link>
          <Link href="#gamificacao" className="hover:text-emerald-400 transition">
            Creator Pass & XP
          </Link>
          <Link href="/ajuda" className="hover:text-emerald-400 transition">
            Ajuda & FAQ
          </Link>
        </nav>

        {/* Wallet & Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Balance only displayed for authenticated affiliate leads/creators */}
          {isAffiliateUser ? (
            <Link
              href="/afiliados"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold cursor-pointer transition select-none group"
              title="Acessar Painel Unificado de Afiliado e Saques"
            >
              <span className="text-zinc-400 group-hover:text-zinc-200">Meu saldo 💰:</span>
              <span className="text-emerald-400 font-black">
                R$ {walletBalance.toFixed(2).replace(".", ",")}
              </span>
            </Link>
          ) : (
            <Link
              href="/afiliados"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold text-emerald-400 hover:text-white transition"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Área do Afiliado</span>
            </Link>
          )}

          {/* DEPOSITAR button */}
          <button
            onClick={() => setWalletModalOpen(true)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-dark-950" />
            <span>DEPOSITAR</span>
          </button>

          <Link
            href="/login"
            className="px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00F59B] text-dark-950 text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
          >
            <span>Bora Pro Play</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-dark-900/95 backdrop-blur-xl px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-zinc-300">
            <Link
              href="#jogos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 transition py-1"
            >
              Jogos em Destaque
            </Link>
            <Link
              href="/afiliados"
              onClick={() => setMobileMenuOpen(false)}
              className="text-emerald-400 font-bold hover:text-emerald-300 transition py-1 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Painel de Afiliado (Multi-Jogos PIX)</span>
            </Link>
            <Link
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 transition py-1"
            >
              Como Funciona a Jornada
            </Link>
            <Link
              href="#gamificacao"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-primary transition py-1"
            >
              Creator Pass & Níveis
            </Link>
            <Link
              href="#captadores"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-primary transition py-1"
            >
              Programa de Captadores
            </Link>
            <Link
              href="/ajuda"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand-primary transition py-1"
            >
              Central de Ajuda
            </Link>
          </nav>
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white hover:bg-dark-800 transition"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="w-full text-center py-2.5 rounded-xl bg-brand-primary text-dark-950 text-sm font-bold hover:bg-brand-primaryHover transition"
            >
              Criar Meu Perfil
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
