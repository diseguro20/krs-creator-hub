"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  User,
  Gamepad2,
  FileText,
  AlertCircle,
  Plus,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TagRequest {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  tag: string;
  platform: string;
  status: "pending" | "approved" | "rejected";
  proof_url?: string;
  notes?: string;
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  detected_balance?: number;
  detected_deposits_count?: number;
}

export default function AdminTagsPage() {
  const [requests, setRequests] = useState<TagRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Rejection modal
  const [rejectModalReq, setRejectModalReq] = useState<TagRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual create modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualTag, setManualTag] = useState("");
  const [manualCreatorName, setManualCreatorName] = useState("");
  const [manualCreatorEmail, setManualCreatorEmail] = useState("");
  const [manualPlatform, setManualPlatform] = useState("Fruit Cash");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/tag-authorizations", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Falha ao carregar autorizações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyTag = (tag: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tag);
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 2000);
    }
  };

  const handleReview = async (id: string, status: "approved" | "rejected", reason?: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/tag-authorizations/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          rejection_reason: reason,
          reviewed_by: "Administrador Master",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(status === "approved" ? "Tag APROVADA com sucesso! Dados liberados." : "Tag REJEITADA.");
        setRejectModalReq(null);
        setRejectReason("");
        await fetchRequests();
      } else {
        alert(data.message || "Erro ao atualizar status.");
      }
    } catch (err: any) {
      alert(err.message || "Falha ao enviar requisição.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTag.trim()) return;

    setIsProcessing(true);
    try {
      const reqRes = await fetch("/api/affiliates/tag-authorizations/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag: manualTag,
          creator_id: `creator_${manualTag.toLowerCase()}`,
          creator_name: manualCreatorName || "Criador Autorizado Manualmente",
          creator_email: manualCreatorEmail || "admin@krscreatorhub.com",
          platform: manualPlatform,
          notes: "Aprovação direta manual realizada pelo Administrador.",
        }),
      });
      const reqData = await reqRes.json();
      if (reqData.success && reqData.request?.id) {
        // Automatically approve it
        await handleReview(reqData.request.id, "approved");
        setManualModalOpen(false);
        setManualTag("");
        setManualCreatorName("");
        setManualCreatorEmail("");
        showToast("Nova tag autorizada diretamente!");
      }
    } catch (err: any) {
      alert("Erro ao cadastrar tag.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered lists
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  const displayedList = requests.filter((r) => {
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "approved") return r.status === "approved";
    if (activeTab === "rejected") return r.status === "rejected";
    return true;
  }).filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.tag.toLowerCase().includes(term) ||
      r.creator_name.toLowerCase().includes(term) ||
      r.creator_email.toLowerCase().includes(term) ||
      r.platform.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-dark-950 font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Segurança & Titularidade de Afiliados</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Aprovação de Tags das Plataformas
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Nenhum criador pode puxar dados ou solicitar saques de tags de terceiros sem autorização prévia.
            Analise e aprove os pedidos de titularidade antes da liberação.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setManualModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-dark-950 font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Autorizar Tag Direta</span>
          </button>

          <button
            onClick={fetchRequests}
            className="p-2.5 rounded-xl bg-dark-900 border border-white/10 hover:border-amber-400/50 text-zinc-300 hover:text-white transition cursor-pointer"
            title="Atualizar lista"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "pending"
              ? "bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10"
              : "bg-dark-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Pendentes de Análise</span>
            <div className={`p-2 rounded-lg ${pendingRequests.length > 0 ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-500"}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{pendingRequests.length}</span>
            {pendingRequests.length > 0 && (
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider animate-pulse">Requer Ação</span>
            )}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("approved")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "approved"
              ? "bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
              : "bg-dark-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Tags Aprovadas</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{approvedRequests.length}</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("rejected")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "rejected"
              ? "bg-red-500/15 border-red-500/60 shadow-lg shadow-red-500/10"
              : "bg-dark-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Tags Rejeitadas</span>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-zinc-400">{rejectedRequests.length}</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "all"
              ? "bg-blue-500/15 border-blue-500/60 shadow-lg shadow-blue-500/10"
              : "bg-dark-900/60 border-white/5 hover:border-white/15"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
            <span>Total de Registros</span>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">{requests.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-900 border border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-amber-500 text-dark-950 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Pendentes</span>
            {pendingRequests.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${activeTab === "pending" ? "bg-dark-950 text-amber-400" : "bg-amber-500/20 text-amber-400"}`}>
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "approved"
                ? "bg-emerald-500 text-dark-950 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Aprovadas ({approvedRequests.length})
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "rejected"
                ? "bg-red-500 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Rejeitadas ({rejectedRequests.length})
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "all"
                ? "bg-white text-dark-950 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Todas ({requests.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por tag, criador ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50"
          />
        </div>
      </div>

      {/* Main List */}
      {displayedList.length === 0 ? (
        <div className="rounded-3xl bg-dark-900/40 border border-white/5 p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">Nenhuma solicitação encontrada</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {searchTerm ? "Tente buscar com outros termos." : "Nenhuma solicitação com este status no momento."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedList.map((req) => {
            const isPending = req.status === "pending";
            const isApproved = req.status === "approved";
            const isRejected = req.status === "rejected";

            return (
              <div
                key={req.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                  isPending
                    ? "bg-dark-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : isApproved
                    ? "bg-dark-900/50 border-emerald-500/20"
                    : "bg-dark-900/30 border-white/5 opacity-80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Creator & Tag Info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Tag Badge with copy */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black border border-white/10 text-white font-mono font-black text-sm">
                        <span className="text-zinc-500">TAG:</span>
                        <span className="text-amber-400">{req.tag}</span>
                        <button
                          onClick={() => handleCopyTag(req.tag)}
                          className="ml-1 text-zinc-400 hover:text-white transition p-0.5"
                          title="Copiar tag"
                        >
                          {copiedTag === req.tag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Platform Pill */}
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-zinc-300 flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3 text-zinc-400" />
                        <span>{req.platform}</span>
                      </span>

                      {/* Status Badge */}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>Pendente de Análise</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aprovada & Liberada</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>Rejeitada</span>
                        </span>
                      )}
                    </div>

                    {/* Creator Identity */}
                    <div className="flex items-center gap-2 text-xs text-zinc-300 flex-wrap">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{req.creator_name}</span>
                      </div>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">{req.creator_email}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Solicitado em {new Date(req.requested_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Platform Financial Recon Insight (if available) */}
                    {(req.detected_balance !== undefined || req.detected_deposits_count !== undefined) && (
                      <div className="inline-flex items-center gap-3 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Detectado na plataforma:</span>
                        <strong>{formatCurrency(req.detected_balance || 0)} saldo</strong>
                        <span className="text-emerald-500">•</span>
                        <span>{req.detected_deposits_count || 0} depósitos aprovados</span>
                      </div>
                    )}

                    {/* Notes / Proof provided by creator */}
                    {req.notes && (
                      <div className="text-xs text-zinc-300 bg-black/40 border border-white/5 rounded-xl p-2.5 mt-2 flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-zinc-400 block text-[10px] uppercase font-semibold">Comentário / Comprovação do Criador:</strong>
                          <p className="mt-0.5">{req.notes}</p>
                        </div>
                      </div>
                    )}

                    {req.proof_url && (
                      <div className="mt-1">
                        <a
                          href={req.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 underline font-semibold"
                        >
                          <span>Ver link de comprovação de titularidade</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {isRejected && req.rejection_reason && (
                      <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 mt-2 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-red-300 block text-[10px] uppercase font-semibold">Motivo da Recusa:</strong>
                          <p className="mt-0.5">{req.rejection_reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleReview(req.id, "approved")}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          <span>Aprovar Titularidade ✓</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectModalReq(req);
                            setRejectReason("");
                          }}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Recusar</span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => {
                          setRejectModalReq(req);
                          setRejectReason("Revogação de titularidade pelo administrador.");
                        }}
                        disabled={isProcessing}
                        className="text-xs text-zinc-500 hover:text-red-400 transition underline cursor-pointer"
                      >
                        Revogar Acesso
                      </button>
                    )}

                    {isRejected && (
                      <button
                        onClick={() => handleReview(req.id, "approved")}
                        disabled={isProcessing}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition underline cursor-pointer font-bold"
                      >
                        Reconsiderar & Aprovar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Rejection Reason */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-dark-950 border border-red-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-500/15 border border-red-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Recusar Titularidade da Tag</h3>
                <p className="text-xs text-zinc-400">Tag: <strong className="text-amber-400">{rejectModalReq.tag}</strong></p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Informe o motivo da recusa. O criador receberá essa justificativa no painel para que possa enviar a comprovação correta.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex: Print do perfil ilegível, nome do titular difere do cadastro, link não comprova posse da conta..."
              className="w-full rounded-xl bg-dark-900 border border-white/10 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalReq(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReview(rejectModalReq.id, "rejected", rejectReason || "Titularidade não comprovada.")}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                Confirmar Recusa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Direct Manual Tag Authorization */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <form
            onSubmit={handleManualCreate}
            className="w-full max-w-lg rounded-3xl bg-dark-950 border border-amber-500/40 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Autorizar Tag Direta</h3>
                <p className="text-xs text-zinc-400">Pré-aprovação imediata de titularidade pelo Admin</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Tag / Código do Jogo *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: nobru, pivetti.jr, casimiro"
                  value={manualTag}
                  onChange={(e) => setManualTag(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                  className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Plataforma</label>
                <select
                  value={manualPlatform}
                  onChange={(e) => setManualPlatform(e.target.value)}
                  className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="Fruit Cash">Fruit Cash</option>
                  <option value="KRS 777 (Casino Online)">KRS 777 (Casino Online)</option>
                  <option value="Blockerino">Blockerino</option>
                  <option value="Bubble Cash">Bubble Cash</option>
                  <option value="Todas as Plataformas">Todas as Plataformas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Nome do Criador</label>
                  <input
                    type="text"
                    placeholder="ex: Lucas Alencar"
                    value={manualCreatorName}
                    onChange={(e) => setManualCreatorName(e.target.value)}
                    className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Email do Criador</label>
                  <input
                    type="email"
                    placeholder="lucas@exemplo.com"
                    value={manualCreatorEmail}
                    onChange={(e) => setManualCreatorEmail(e.target.value)}
                    className="w-full rounded-xl bg-dark-900 border border-white/10 p-2.5 text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                Autorizar & Liberar Tag
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
