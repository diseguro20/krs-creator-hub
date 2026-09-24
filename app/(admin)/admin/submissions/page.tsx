"use client";

import React, { useState } from "react";
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Play,
  FileVideo,
  FileText,
  Clock,
  MessageSquare,
  X,
  Check,
  Filter,
  Image as ImageIcon,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { Submission, SubmissionStatus } from "@/types";

export default function AdminSubmissionsPage() {
  const {
    submissions,
    approveSubmission,
    requestChangesSubmission,
    rejectSubmission,
  } = useKrsStore();

  const [filter, setFilter] = useState<"all" | SubmissionStatus>("in_review");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [modalAction, setModalAction] = useState<"changes" | "reject" | null>(null);

  const filteredSubs = submissions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const handleOpenFeedback = (sub: Submission, action: "changes" | "reject") => {
    setSelectedSub(sub);
    setModalAction(action);
    setFeedbackText(action === "changes" ? "Mostrar o gameplay por pelo menos 5 segundos contínuos." : "");
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    if (modalAction === "changes") {
      requestChangesSubmission(selectedSub.id, feedbackText);
    } else if (modalAction === "reject") {
      rejectSubmission(selectedSub.id, feedbackText);
    }

    setModalAction(null);
    setSelectedSub(null);
    setFeedbackText("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Inbox className="w-4 h-4" />
            Fila de Moderação
          </div>
          <h1 className="text-3xl font-black text-white">Análise de Submissions</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Revise entregas de criadores, aprove materiais para liberar XP ou solicite ajustes com feedback obrigatório.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "in_review", label: "Em Análise" },
          { key: "approved", label: "Aprovadas" },
          { key: "changes_requested", label: "Alterações Solicitadas" },
          { key: "all", label: "Todas as Entregas" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === tab.key
                ? "bg-amber-500 text-dark-950 shadow-md shadow-amber-500/20"
                : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubs.length === 0 ? (
          <div className="p-16 rounded-3xl border border-white/5 bg-dark-900 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-brand-primary mx-auto" />
            <h3 className="text-base font-bold text-white">Fila Limpa!</h3>
            <p className="text-xs text-zinc-400">Não há entregas nesta categoria no momento.</p>
          </div>
        ) : (
          filteredSubs.map((sub) => (
            <div
              key={sub.id}
              className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden bg-dark-850 border border-white/10 shrink-0">
                    {sub.creator_avatar ? (
                      <img src={sub.creator_avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-white">
                        {sub.creator_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{sub.creator_name}</span>
                      <span className="text-xs text-zinc-400">@{sub.creator_username}</span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Campanha: <strong className="text-white">{sub.campaign_title}</strong> • Missão: <strong className="text-brand-primary">{sub.mission_title}</strong>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {sub.status === "in_review" && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      Em Análise
                    </span>
                  )}
                  {sub.status === "approved" && (
                    <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold flex items-center gap-1 border border-brand-primary/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprovada
                    </span>
                  )}
                  {sub.status === "changes_requested" && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1 border border-red-500/30">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Ajuste Solicitado
                    </span>
                  )}
                </div>
              </div>

              {/* Deliverable Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Media Preview / Link */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="text-xs font-bold text-zinc-300">Material Submetido:</div>

                  {sub.file_url ? (
                    <div className="rounded-2xl bg-dark-950 border border-white/10 overflow-hidden p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-6 h-6 text-brand-primary shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-xs">
                            Print / Comprovante de Publicação
                          </div>
                          <div className="text-[10px] text-zinc-400">Captura de tela enviada para validação</div>
                        </div>
                      </div>

                      <a
                        href={sub.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs font-bold text-white transition flex items-center gap-1.5"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : null}

                  {sub.content_link && (
                    <div className="p-3 rounded-2xl bg-dark-950 border border-white/10 flex items-center justify-between">
                      <div className="text-xs text-brand-neon font-mono truncate max-w-xs">
                        {sub.content_link}
                      </div>
                      <a
                        href={sub.content_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs font-bold text-white transition"
                      >
                        Acessar Link
                      </a>
                    </div>
                  )}

                  {sub.comments && (
                    <div className="p-3 rounded-2xl bg-dark-850 text-xs text-zinc-300">
                      <strong>Comentário do Creator: </strong>&quot;{sub.comments}&quot;
                    </div>
                  )}
                </div>

                {/* Actions & Feedback Desk */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                  {sub.feedback && (
                    <div className="p-4 rounded-2xl bg-dark-950 border border-amber-500/20 text-xs text-amber-300">
                      <strong>Feedback enviado: </strong>&quot;{sub.feedback}&quot;
                    </div>
                  )}

                  {sub.status === "in_review" && (
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => approveSubmission(sub.id)}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-primary text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprovar (+150 XP)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenFeedback(sub, "changes")}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Solicitar Ajuste</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenFeedback(sub, "reject")}
                        className="w-full sm:w-auto py-3 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Recusar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mandatory Feedback Modal */}
      {modalAction && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-dark-900 p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setModalAction(null)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">
              {modalAction === "changes" ? "Solicitar Alteração na Entrega" : "Recusar Entrega"}
            </h3>

            <p className="text-xs text-zinc-400">
              O criador <strong className="text-white">{selectedSub.creator_name}</strong> receberá esta notificação diretamente em seu painel. Seja claro e objetivo.
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Motivo / Orientações do Ajuste (Obrigatório)
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Ex: Mostrar o gameplay por pelo menos 5 segundos; o sticker do link precisa ficar no centro da tela..."
                  className="w-full p-3 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAction(null)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 transition ${
                    modalAction === "changes"
                      ? "bg-amber-500 hover:bg-amber-400"
                      : "bg-red-500 hover:bg-red-400"
                  }`}
                >
                  Confirmar Envio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
