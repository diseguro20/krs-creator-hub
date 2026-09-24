"use client";

import React, { useState } from "react";
import {
  Users,
  Copy,
  Check,
  QrCode,
  Share2,
  TrendingUp,
  UserCheck,
  Flame,
  Zap,
  Clock,
  CheckCircle2,
  ExternalLink,
  X,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CaptadorProfile } from "@/types";
import { formatXP } from "@/lib/utils";

export default function CaptadorDashboardPage() {
  const { currentUser, referrals, addReferral } = useKrsStore();
  const captador = (currentUser as CaptadorProfile) || {
    referral_code: "PARCEIRO",
    current_xp: 0,
    current_level: 1,
    streak_weeks: 1,
    total_referred: 0,
    active_creators: 0,
    campaigns_completed_by_referred: 0,
    name: "Captador",
    username: "captador",
  };

  const refCode = captador.referral_code || "MARCOS10";
  const refUrl = typeof window !== "undefined"
    ? `${window.location.origin}/cadastro?ref=${refCode}`
    : `https://krscreatorhub.com/cadastro?ref=${refCode}`;

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newCreatorName, setNewCreatorName] = useState("");
  const [newCreatorEmail, setNewCreatorEmail] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreatorName) return;
    addReferral(refCode, newCreatorName, newCreatorEmail);
    setShowInviteModal(false);
    setNewCreatorName("");
    setNewCreatorEmail("");
  };

  // Funnel calculations
  const totalInvites = referrals.length;
  const registeredCount = referrals.length;
  const activeCount = referrals.filter((r) => r.status === "active" || r.status === "completed_campaign").length;
  const completedCount = referrals.filter((r) => r.status === "completed_campaign").length;

  const convReg = totalInvites > 0 ? Math.round((registeredCount / totalInvites) * 100) : 0;
  const convActive = registeredCount > 0 ? Math.round((activeCount / registeredCount) * 100) : 0;
  const convComp = activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header with Referral Link Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-brand-neon/30 bg-dark-900 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-neon mb-1">
              <Users className="w-4 h-4" />
              Rede de Talentos & Indicação
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Traz Sua Tropa de Creators 🤝
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Manda seu link exclusivo pros creators que você conhece. Quando eles entrarem e começarem a produzir, você acumula XP e sobe no ranking de parceiros!
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-3.5 rounded-xl bg-brand-neon text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-300 transition shadow-lg shadow-brand-neon/20 shrink-0"
          >
            + Convidar Creator
          </button>
        </div>

        {/* Link Box */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full p-3 rounded-xl bg-dark-850 border border-white/10 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-brand-neon truncate">{refUrl}</span>
            <span className="px-2 py-0.5 rounded bg-dark-800 text-[10px] font-mono text-zinc-400 uppercase">
              CÓDIGO: {refCode}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-bold text-white transition border border-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-brand-neon" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copiar Link 📋</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="p-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-zinc-300 hover:text-white transition border border-white/5"
              title="Exibir QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Fala mestre! Dá uma olhada no KRS Creator Hub, a nova plataforma oficial de parcerias para criadores de jogos por habilidade: ${refUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>Mandar no Zap</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FUNIL DE CAPTAÇÃO VISUAL COM CONVERSÃO                                 */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Como tá a sua tropa</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Acompanhe quem já se cadastrou, quem já tá gravando e quem já zerou missões.</p>
          </div>
          <span className="text-xs font-semibold text-brand-neon">Atribuição 100% Automática</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
            <div className="text-[10px] uppercase font-bold text-zinc-400">1. Acessaram o Link</div>
            <div className="text-2xl font-black text-white">{totalInvites}</div>
            <div className="text-[11px] text-zinc-500">Cliques no seu link</div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
            <div className="text-[10px] uppercase font-bold text-zinc-400">2. Criaram Perfil</div>
            <div className="text-2xl font-black text-brand-neon">{registeredCount}</div>
            <div className="text-[11px] text-zinc-400">Taxa: <strong className="text-white">{convReg}%</strong> visitas viraram creators</div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
            <div className="text-[10px] uppercase font-bold text-zinc-400">3. Produzindo Conteúdo</div>
            <div className="text-2xl font-black text-white">{activeCount}</div>
            <div className="text-[11px] text-zinc-400">Taxa: <strong className="text-white">{convActive}%</strong> já estão em campanha</div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-850 border border-brand-primary/30 space-y-2 shadow-lg shadow-brand-primary/5">
            <div className="text-[10px] uppercase font-bold text-brand-primary">4. Missões Zeradas 🎉</div>
            <div className="text-2xl font-black text-brand-primary">{completedCount}</div>
            <div className="text-[11px] text-zinc-400">Taxa: <strong className="text-white">{convComp}%</strong> campanhas concluídas</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INFLUENCERS INDICADOS TABLE                                            */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Creators Indicados por Você ({referrals.length})</h3>
          <span className="text-xs text-zinc-400">Seu XP cai direto na conta conforme eles produzem</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-6">Influencer</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Data de Entrada</th>
                <th className="py-3 px-6">Campanhas Concluídas</th>
                <th className="py-3 px-6 text-right">XP Gerado para Você</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400 text-xs">
                    Nenhum criador cadastrado na sua rede ainda. Compartilhe seu link ou convide um criador para começar!
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-dark-850/50 transition">
                    <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-dark-800 border border-white/10 shrink-0">
                        {ref.referred_avatar ? (
                          <img src={ref.referred_avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-bold text-white text-xs">
                            {ref.referred_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{ref.referred_name}</div>
                        <div className="text-[10px] text-zinc-400">@{ref.referred_username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {ref.status === "completed_campaign" && (
                      <span className="px-2.5 py-1 rounded-full bg-brand-primary/20 text-brand-primary font-bold text-[10px]">
                        Campanha Concluída
                      </span>
                    )}
                    {ref.status === "active" && (
                      <span className="px-2.5 py-1 rounded-full bg-brand-neon/20 text-brand-neon font-bold text-[10px]">
                        Em Campanha
                      </span>
                    )}
                    {ref.status === "registered" && (
                      <span className="px-2.5 py-1 rounded-full bg-dark-800 text-zinc-400 font-medium text-[10px]">
                        Cadastro Concluído
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    {new Date(ref.joined_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-4 px-6 text-zinc-200 font-semibold">
                    {ref.campaigns_completed}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-brand-neon">
                    +{ref.xp_generated_for_captador} XP
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-dark-900 p-6 text-center space-y-4">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-brand-neon/10 text-brand-neon flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">QR Code de Indicação</h3>
            <p className="text-xs text-zinc-400">
              Apresente na tela para outros criadores escanearem diretamente com a câmera do celular.
            </p>

            {/* Simulated Vector QR Code Graphic */}
            <div className="p-6 bg-white rounded-2xl mx-auto w-52 h-52 flex flex-col items-center justify-center space-y-2">
              <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      (i % 2 === 0 || i % 5 === 0 || i < 6 || i > 30) ? "bg-dark-950" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-400">
              Código: <strong className="text-white">{refCode}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Direct Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-dark-900 p-6 space-y-4">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Convidar Creator Direto</h3>
            <p className="text-xs text-zinc-400">
              Coloca o nome e e-mail do criador pra gente registrar ele na sua tropa.
            </p>

            <form onSubmit={handleCreateInvite} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nome ou @ do Influencer
                </label>
                <input
                  type="text"
                  required
                  value={newCreatorName}
                  onChange={(e) => setNewCreatorName(e.target.value)}
                  placeholder="Ex: Pedro Henrique (@pedro_games)"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  value={newCreatorEmail}
                  onChange={(e) => setNewCreatorEmail(e.target.value)}
                  placeholder="pedro@exemplo.com"
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-neon text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition shadow-md shadow-brand-neon/15"
                >
                  Bora Cadastrar (+100 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
