"use client";

import React from "react";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { ShieldAlert, Bell, Search, Sparkles } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { submissions } = useKrsStore();
  const pendingCount = submissions.filter((s) => s.status === "in_review").length;

  return (
    <div className="min-h-screen bg-dark-950 flex text-zinc-100 selection:bg-amber-400 selection:text-dark-950">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-10">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/5 bg-dark-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider text-amber-400">
              MODO ADMINISTRATIVO
            </span>
            <span className="text-xs text-zinc-400 hidden sm:inline">
              Acesso irrestrito a campanhas, regras de XP e aprovações
            </span>
          </div>

          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <a
                href="/admin/submissions"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>{pendingCount} Entregas Pendentes</span>
              </a>
            )}

            <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/40">
              ADM
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>
    </div>
  );
}
