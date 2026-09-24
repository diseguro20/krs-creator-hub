"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

export function CreatorHeader() {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead, walletBalance, setWalletModalOpen } = useKrsStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const creator = (currentUser as CreatorProfile) || {
    name: "Criador",
    current_level: 1,
    streak_weeks: 1,
    current_xp: 0,
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/5 bg-dark-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="relative w-48 sm:w-64 md:w-72">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar campanhas, jogos..."
          className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-dark-900 border border-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
        />
      </div>

      {/* Right widgets */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Meu Saldo 💰 Button */}
        <div
          onClick={() => setWalletModalOpen(true)}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-dark-900 border border-white/5 hover:border-emerald-500/30 text-xs font-bold cursor-pointer transition select-none"
          title="Clique para ver extrato ou sacar"
        >
          <span className="text-zinc-400 hidden sm:inline">Meu saldo 💰:</span>
          <span className="text-emerald-400 font-black">
            R$ {walletBalance.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* DEPOSITAR button */}
        <button
          onClick={() => setWalletModalOpen(true)}
          className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-dark-950" />
          <span className="hidden sm:inline">DEPOSITAR</span>
          <ChevronDown className="w-3 h-3 text-dark-950 hidden sm:inline" />
        </button>

        {/* Streak indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 border border-white/5 text-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="font-bold text-white">{creator.streak_weeks || 1} sem</span>
        </div>

        {/* XP Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-xs font-bold text-brand-primary">
          <Zap className="w-3.5 h-3.5" />
          <span>{formatXP(creator.current_xp || 0)}</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl bg-dark-900 border border-white/5 text-zinc-300 hover:text-white hover:bg-dark-850 transition"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[9px] font-black text-dark-950 shadow-md shadow-brand-primary/50">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-dark-900/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/15 text-[10px] font-bold text-brand-primary">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-zinc-400 hover:text-brand-primary transition"
                  >
                    Marcar todas
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5 py-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">
                    Nenhuma notificação por enquanto.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl transition cursor-pointer flex gap-3 ${
                        notif.read ? "opacity-60 hover:opacity-90" : "bg-dark-850/60 hover:bg-dark-850"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === "mission_approved" && (
                          <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                        )}
                        {notif.type === "changes_requested" && (
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                        )}
                        {notif.type === "level_up" && (
                          <Trophy className="w-4 h-4 text-brand-neon" />
                        )}
                        {notif.type === "new_campaign" && (
                          <Zap className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {notif.title}
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-white/5 text-center">
                <Link
                  href="/notificacoes"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-brand-primary hover:underline"
                >
                  Ver Central de Notificações
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Chip */}
        <Link
          href="/perfil"
          className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-dark-900 border border-white/5 hover:border-white/20 transition"
        >
          <div className="h-7 w-7 rounded-full overflow-hidden bg-dark-800 border border-white/10 shrink-0">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-bold text-xs text-white">
                {creator.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white truncate max-w-[100px]">
              {creator.name.split(" ")[0]}
            </div>
            <div className="text-[9px] font-semibold text-brand-primary">
              NÍVEL {creator.current_level || 1}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
