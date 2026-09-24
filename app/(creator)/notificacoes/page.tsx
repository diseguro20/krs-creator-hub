"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Zap,
  Check,
  Filter,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatRelativeTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useKrsStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <Bell className="w-4 h-4" />
            Central de Atualizações
          </div>
          <h1 className="text-3xl font-black text-white">Notificações</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Acompanhe o andamento de aprovações, solicitações de alteração e novidades de campanhas.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-900 border border-white/10 hover:border-brand-primary/40 text-xs font-semibold text-zinc-200 transition"
          >
            <Check className="w-4 h-4 text-brand-primary" />
            <span>Marcar todas como lidas</span>
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === "all"
              ? "bg-brand-primary text-dark-950 shadow-md"
              : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === "unread"
              ? "bg-brand-primary text-dark-950 shadow-md"
              : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
          }`}
        >
          Não Lidas ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 divide-y divide-white/5 overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            Nenhuma notificação encontrada no momento.
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-5 flex items-start gap-4 transition cursor-pointer ${
                notif.read ? "bg-dark-900 opacity-60 hover:opacity-100" : "bg-dark-850/50 hover:bg-dark-850"
              }`}
            >
              <div className="mt-1 p-2 rounded-xl bg-dark-800 shrink-0">
                {notif.type === "mission_approved" && (
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                )}
                {notif.type === "changes_requested" && (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                {notif.type === "level_up" && (
                  <Trophy className="w-5 h-5 text-brand-neon" />
                )}
                {notif.type === "new_campaign" && (
                  <Zap className="w-5 h-5 text-purple-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white truncate">{notif.title}</h4>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                    {formatRelativeTime(notif.created_at)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{notif.message}</p>

                {notif.action_url && (
                  <div className="mt-3">
                    <Link
                      href={notif.action_url}
                      className="inline-block text-xs font-bold text-brand-primary hover:underline"
                    >
                      Acessar Campanha &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
