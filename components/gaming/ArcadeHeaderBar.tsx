"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Flame,
  Zap,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Gamepad2
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency } from "@/lib/utils";

interface ArcadeHeaderBarProps {
  showRoleBadge?: boolean;
}

export function ArcadeHeaderBar({ showRoleBadge = true }: ArcadeHeaderBarProps) {
  const { currentUser, walletBalance, setWalletModalOpen } = useKrsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0f0c]/90 backdrop-blur-xl border-b border-emerald-500/20 px-3 sm:px-6 py-2.5 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo styled with gaming badge aesthetic */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-dark-900 border border-emerald-400/50 shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <span className="font-pixel text-xs sm:text-sm text-dark-950 font-black">K</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-400 transition">
                KRS CREATOR HUB
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-pixel text-emerald-400">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium hidden sm:block">
              A Plataforma Oficial de Jogos & Criadores
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links on desktop */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            href="/jogos"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jogos</span>
          </Link>
          <Link
            href="/afiliados"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Painel Afiliado</span>
          </Link>
          <Link
            href="/campanhas"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition"
          >
            Campanhas
          </Link>
          <Link
            href="/creator-pass"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition"
          >
            Creator Pass
          </Link>
          <Link
            href="/ranking"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition"
          >
            Ranking
          </Link>
        </nav>

        {/* Right: DEPOSITAR button + Meu Saldo 💰 (Exact layout from user screenshot!) */}
        <div className="flex items-center gap-3">
          {/* Balance Display: "Meu saldo 💰: R$ 380,00" */}
          <div
            onClick={() => setWalletModalOpen(true)}
            className="hidden sm:flex items-center gap-1 text-xs font-bold cursor-pointer hover:opacity-80 transition select-none"
            title="Clique para ver extrato ou sacar"
          >
            <span className="text-zinc-300">Meu saldo 💰:</span>
            <span className="text-white font-extrabold text-sm ml-0.5">
              R$ {walletBalance.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {/* DEPOSITAR button with Chevron Dropdown (exact match of reference design) */}
          <div className="relative flex items-center">
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-l-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-dark-950" />
              <span>DEPOSITAR</span>
            </button>

            {/* Chevron toggle button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Opções de carteira"
              className="px-2 py-2 rounded-r-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 border-l border-emerald-600 transition cursor-pointer"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0d1611] border border-emerald-500/30 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-white/5">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Saldo Disponível</div>
                  <div className="text-base font-black text-emerald-400">
                    R$ {walletBalance.toFixed(2).replace(".", ",")}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setWalletModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-left text-zinc-200 hover:text-white transition"
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    <span>Depositar via PIX</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setWalletModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-left text-zinc-200 hover:text-white transition"
                  >
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                    <span>Sacar via PIX Instantâneo</span>
                  </button>

                  <Link
                    href="/afiliados"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-500/10 text-xs text-left text-emerald-400 hover:text-emerald-300 transition font-bold"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Painel de Afiliado (4 Jogos)</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-left text-zinc-200 hover:text-white transition"
                  >
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span>Painel do Criador</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Balance sub-row (when on very narrow mobile screens) */}
      <div className="sm:hidden flex items-center justify-between pt-1.5 mt-1 border-t border-white/5 text-[11px] font-bold">
        <div
          onClick={() => setWalletModalOpen(true)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="text-zinc-400">Meu saldo 💰:</span>
          <span className="text-emerald-400 font-black">
            R$ {walletBalance.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <Link href="/dashboard" className="text-zinc-400 hover:text-white text-[10px]">
          Ver Painel →
        </Link>
      </div>
    </header>
  );
}
