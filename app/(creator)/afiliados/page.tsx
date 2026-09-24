"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowUpRight,
  Copy,
  Check,
  Gamepad2,
  TrendingUp,
  Users,
  MousePointerClick,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Filter,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Award
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency } from "@/lib/utils";
import { GameAffiliateStats, AffiliateConversionRecord, Game } from "@/types";

export default function AffiliateHubPage() {
  const {
    affiliateStats,
    affiliateConversions,
    totalAffiliateBalance,
    withdrawAffiliate,
    currentUser,
    openGamePlayer,
    games,
  } = useKrsStore();

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>("all");

  // Withdrawal Drawer/Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawGameId, setWithdrawGameId] = useState<string>("all");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [pixKeyType, setPixKeyType] = useState<string>("cpf");
  const [pixKey, setPixKey] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    txId: string;
    amount: number;
    pixKey: string;
    gameName: string;
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy referral link handler
  const handleCopyLink = (url: string, gameId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(gameId);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  // Open withdrawal for a specific game or total
  const handleOpenWithdraw = (gameId: string = "all") => {
    setWithdrawGameId(gameId);
    setErrorMessage(null);
    setReceipt(null);

    if (gameId === "all") {
      setWithdrawAmount(totalAffiliateBalance.toFixed(2));
    } else {
      const g = affiliateStats.find((s) => s.game_id === gameId);
      setWithdrawAmount(g ? g.available_balance.toFixed(2) : "0.00");
    }

    setWithdrawModalOpen(true);
  };

  // Execute withdrawal
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const amountNum = parseFloat(withdrawAmount.replace(",", "."));
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage("Por favor, digite um valor válido maior que zero.");
      return;
    }

    if (!pixKey.trim()) {
      setErrorMessage("Informe sua chave PIX para receber a transferência.");
      return;
    }

    // Limit check
    const maxAvailable =
      withdrawGameId === "all"
        ? totalAffiliateBalance
        : affiliateStats.find((g) => g.game_id === withdrawGameId)?.available_balance || 0;

    if (amountNum > maxAvailable) {
      setErrorMessage(
        `Saldo insuficiente. Seu limite disponível para saque é de ${formatCurrency(maxAvailable)}.`
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate real-time network PIX handshake
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const res = await withdrawAffiliate(amountNum, pixKey, pixKeyType, withdrawGameId);

      if (res.success) {
        const gameObj = affiliateStats.find((g) => g.game_id === withdrawGameId);
        setReceipt({
          txId: res.txId,
          amount: amountNum,
          pixKey,
          gameName: gameObj ? gameObj.game_name : "Saldo Consolidado (Todos os Jogos)",
          timestamp: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage("Ocorreu um erro ao processar o saque PIX. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Total consolidated stats
  const totalClicks = affiliateStats.reduce((acc, g) => acc + g.clicks, 0);
  const totalSignups = affiliateStats.reduce((acc, g) => acc + g.signups, 0);
  const totalDeposited = affiliateStats.reduce((acc, g) => acc + g.total_deposited, 0);
  const totalCommissionsEarned = affiliateStats.reduce((acc, g) => acc + g.commission_earned, 0);

  // Filter conversions
  const filteredConversions =
    selectedGameFilter === "all"
      ? affiliateConversions
      : affiliateConversions.filter((c) => c.game_id === selectedGameFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. RETRO ARCADE TOP BANNER & HUD                                         */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c1611] via-[#09120c] to-[#040805] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 overflow-hidden arcade-box">
        {/* Scanline CRT overlay */}
        <div className="arcade-scanlines pointer-events-none opacity-40" />

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] sm:text-xs font-pixel text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PAINEL UNIFICADO DE AFILIADO • 4 JOGOS NO AR</span>
            </div>

            <h1 className="font-pixel text-2xl sm:text-4xl text-white tracking-wide uppercase drop-shadow-[0_0_15px_rgba(0,245,155,0.4)]">
              TODOS OS SEUS GANHOS <br className="hidden sm:inline" />
              <span className="text-[#00F59B]">EM UM SÓ LUGAR</span>
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Divulgue os 4 jogos oficiais da KRS, acompanhe cliques e cadastros em tempo real, e
              receba as comissões consolidadas na sua conta via <strong className="text-emerald-400">PIX Instantâneo</strong>.
            </p>
          </div>

          {/* Master Balance Action Box (Arcade Card Style) */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-black/60 border-2 border-emerald-400/60 p-5 sm:p-6 backdrop-blur-xl shadow-xl min-w-[280px]">
            <div className="text-[10px] uppercase font-pixel text-zinc-400 tracking-wider">
              SALDO TOTAL DISPONÍVEL
            </div>

            <div className="text-3xl sm:text-4xl font-pixel text-emerald-400 font-black my-2 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
              {formatCurrency(totalAffiliateBalance)}
            </div>

            <div className="text-[11px] text-zinc-400 mb-3 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saques liberados 24/7 sem taxa</span>
            </div>

            <button
              onClick={() => handleOpenWithdraw("all")}
              disabled={totalAffiliateBalance <= 0}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 fill-dark-950" />
              <span>SACAR TUDO VIA PIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. AGGREGATED KPI TILES                                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Clicks */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Cliques Agregados</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalClicks.toLocaleString("pt-BR")}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Em todos os 4 links
            </div>
          </div>
        </div>

        {/* Signups */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Cadastros Ativos</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalSignups.toLocaleString("pt-BR")}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Jogadores registrados
            </div>
          </div>
        </div>

        {/* Total Deposited */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Volume Depositado</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(totalDeposited)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium mt-1">
              Gera comissão contínua
            </div>
          </div>
        </div>

        {/* Total Commissions Earned */}
        <div className="rounded-2xl bg-[#0b120d] border border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Comissões Acumuladas</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatCurrency(totalCommissionsEarned)}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium mt-1">
              Histórico geral de ganhos
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OS 4 JOGOS: MULTI-LINK & METRICS GRID                                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕹️</span>
            <h2 className="font-pixel text-lg sm:text-xl text-white uppercase tracking-wider">
              SEUS LINKS E SALDOS POR JOGO
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            Seus links já contêm seu código de afiliado rastreado: <code className="text-emerald-400 font-bold bg-dark-900 px-2 py-0.5 rounded border border-emerald-500/30">lucas_gaming</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {affiliateStats.map((item) => {
            const correspondingGame = games.find((g) => g.id === item.game_id);

            return (
              <div
                key={item.game_id}
                className="group relative rounded-3xl bg-[#0c140f] border-2 border-emerald-500/25 hover:border-emerald-400 p-5 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Game Header: Logo/Banner + Name + Category */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-emerald-500/30 shadow-md">
                      <img
                        src={item.thumbnail_url}
                        alt={item.game_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {item.commission_rate}
                        </span>
                      </div>

                      <h3 className="font-pixel text-sm sm:text-base text-white mt-1.5 truncate">
                        {item.game_name}
                      </h3>

                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Cliques</span>
                          <span className="font-bold text-white">{item.clicks}</span>
                        </div>
                        <div className="w-[1px] h-5 bg-white/10" />
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Cadastros</span>
                          <span className="font-bold text-white">{item.signups}</span>
                        </div>
                        <div className="w-[1px] h-5 bg-white/10" />
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Depósitos</span>
                          <span className="font-bold text-emerald-400">{item.deposits_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Game Balance Box */}
                  <div className="rounded-2xl bg-black/40 border border-emerald-500/20 p-3.5 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-zinc-400">
                        Saldo a Sacar deste Jogo
                      </div>
                      <div className="text-xl font-pixel text-emerald-400 font-black mt-0.5">
                        {formatCurrency(item.available_balance)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenWithdraw(item.game_id)}
                      disabled={item.available_balance <= 0}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-dark-950 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Sacar Jogo</span>
                    </button>
                  </div>

                  {/* Unique Tracking Link with Copy Button */}
                  <div className="space-y-1.5 mb-4">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Seu Link de Divulgação Oficial:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono truncate select-all">
                        {item.referral_url}
                      </div>

                      <button
                        onClick={() => handleCopyLink(item.referral_url, item.game_id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                          copiedLink === item.game_id
                            ? "bg-emerald-500 text-dark-950 font-black"
                            : "bg-dark-850 hover:bg-dark-800 text-white border border-white/10"
                        }`}
                      >
                        {copiedLink === item.game_id ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons: Test Game in Arcade Player + Open External */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  {correspondingGame && (
                    <button
                      onClick={() => openGamePlayer(correspondingGame)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      <span>Testar no Player</span>
                    </button>
                  )}

                  <a
                    href={item.referral_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
                    title="Abrir jogo em nova aba"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LIVE CONVERSION FEED (HISTÓRICO EM TEMPO REAL)                         */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0a100c] border border-emerald-500/20 p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-pixel text-sm sm:text-base text-white uppercase tracking-wider">
                FEED DE CONVERSÕES AO VIVO
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Comissões que pingaram dos jogadores indicados através dos seus 4 links de afiliado.
            </p>
          </div>

          {/* Filter by Game */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedGameFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedGameFilter === "all"
                  ? "bg-emerald-500 text-dark-950 font-black"
                  : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              Todos ({affiliateConversions.length})
            </button>
            {affiliateStats.map((g) => (
              <button
                key={g.game_id}
                onClick={() => setSelectedGameFilter(g.game_id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  selectedGameFilter === g.game_id
                    ? "bg-emerald-500 text-dark-950 font-black"
                    : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {g.game_name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Conversions List */}
        <div className="divide-y divide-white/5">
          {filteredConversions.map((conv) => (
            <div
              key={conv.id}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-pixel text-xs">
                  💰
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      {conv.lead_name}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      @{conv.lead_username}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span className="text-emerald-400 font-medium">{conv.game_name}</span>
                    <span>•</span>
                    <span className="capitalize">{conv.type}</span>
                    {conv.amount_deposited && (
                      <>
                        <span>•</span>
                        <span>Depositou {formatCurrency(conv.amount_deposited)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm sm:text-base font-pixel text-emerald-400 font-black">
                  +{formatCurrency(conv.commission_amount)}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {new Date(conv.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL DE SAQUE INSTANTÂNEO VIA PIX                                     */}
      {/* ========================================================================= */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0a110c] border-2 border-emerald-500/40 p-6 shadow-2xl shadow-emerald-500/20 arcade-box max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                if (!isProcessing) {
                  setWithdrawModalOpen(false);
                  setReceipt(null);
                }
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
            >
              ✕
            </button>

            {receipt ? (
              /* Receipt View */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <div className="text-xs font-pixel text-emerald-400 uppercase">
                    SAQUE PIX CONFIRMADO!
                  </div>
                  <div className="text-3xl font-pixel text-white font-black mt-2">
                    {formatCurrency(receipt.amount)}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Transferência bancária instantânea liquidada com sucesso no BACEN.
                  </p>
                </div>

                {/* Digital Receipt Card */}
                <div className="rounded-2xl bg-black/60 border border-emerald-500/30 p-4 text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">ID da Transação:</span>
                    <span className="text-emerald-400 font-bold">{receipt.txId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Origem do Saldo:</span>
                    <span className="text-white">{receipt.gameName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Chave PIX ({pixKeyType.toUpperCase()}):</span>
                    <span className="text-white">{receipt.pixKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Horário da Transferência:</span>
                    <span className="text-white">{receipt.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWithdrawModalOpen(false);
                    setReceipt(null);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition cursor-pointer"
                >
                  CONCLUÍDO
                </button>
              </div>
            ) : (
              /* Withdrawal Form */
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Zap className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-sm sm:text-base text-white">
                      SOLICITAR SAQUE PIX
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Transferência automática para a sua conta bancária
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Game Origin Selector */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Origem dos Fundos
                  </label>
                  <select
                    value={withdrawGameId}
                    onChange={(e) => {
                      const gid = e.target.value;
                      setWithdrawGameId(gid);
                      if (gid === "all") {
                        setWithdrawAmount(totalAffiliateBalance.toFixed(2));
                      } else {
                        const target = affiliateStats.find((s) => s.game_id === gid);
                        setWithdrawAmount(target ? target.available_balance.toFixed(2) : "0.00");
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="all">
                      Saldo Consolidado (Todos os 4 Jogos) - Disponível: {formatCurrency(totalAffiliateBalance)}
                    </option>
                    {affiliateStats.map((g) => (
                      <option key={g.game_id} value={g.game_id}>
                        {g.game_name} - Disponível: {formatCurrency(g.available_balance)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount input */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Valor do Saque (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-zinc-400 font-bold text-sm">
                      R$
                    </span>
                    <input
                      type="text"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-base font-black text-emerald-400 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  {/* Quick Chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[50, 100, 500, 1000].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setWithdrawAmount(val.toFixed(2))}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-zinc-300 transition cursor-pointer"
                      >
                        +R$ {val}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const maxVal =
                          withdrawGameId === "all"
                            ? totalAffiliateBalance
                            : affiliateStats.find((s) => s.game_id === withdrawGameId)?.available_balance || 0;
                        setWithdrawAmount(maxVal.toFixed(2));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold transition ml-auto cursor-pointer"
                    >
                      TUDO
                    </button>
                  </div>
                </div>

                {/* PIX Key Type */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Tipo de Chave PIX
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "cpf", label: "CPF/CNPJ" },
                      { id: "email", label: "E-mail" },
                      { id: "phone", label: "Telefone" },
                      { id: "random", label: "Aleatória" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setPixKeyType(item.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          pixKeyType === item.id
                            ? "bg-emerald-500 text-dark-950 font-black"
                            : "bg-dark-900 text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PIX Key Input */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Sua Chave PIX
                  </label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder={
                      pixKeyType === "cpf"
                        ? "000.000.000-00"
                        : pixKeyType === "email"
                        ? "seuemail@exemplo.com"
                        : pixKeyType === "phone"
                        ? "(11) 98765-4321"
                        : "Chave aleatória EVP"
                    }
                    className="w-full p-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                      <span>AUTENTICANDO COM O BANCO CENTRAL...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-dark-950" />
                      <span>CONFIRMAR E TRANSFERIR VIA PIX</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
