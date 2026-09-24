"use client";

import React, { useState } from "react";
import { History, Search, ShieldCheck, User } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function AdminLogsPage() {
  const { activityLogs } = useKrsStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = activityLogs.filter(
    (l) =>
      l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <History className="w-4 h-4" />
            Trilha de Auditoria
          </div>
          <h1 className="text-3xl font-black text-white">Audit & Activity Logs</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Registro cronológico imutável de todas as ações de aprovação, submissões, cadastros e alterações no hub.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar nos logs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-white/5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-6">Data / Hora</th>
                <th className="py-3 px-6">Autor da Ação</th>
                <th className="py-3 px-6">Papel</th>
                <th className="py-3 px-6">Tipo do Evento</th>
                <th className="py-3 px-6">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-850/50 transition">
                  <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="py-4 px-6 font-bold text-white font-sans">
                    {log.user_name}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.user_role === "ADMIN"
                          ? "bg-amber-500/20 text-amber-400"
                          : log.user_role === "CAPTADOR"
                          ? "bg-brand-neon/20 text-brand-neon"
                          : "bg-brand-primary/20 text-brand-primary"
                      }`}
                    >
                      {log.user_role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-zinc-300 font-semibold">
                    {log.action}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 font-sans">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
