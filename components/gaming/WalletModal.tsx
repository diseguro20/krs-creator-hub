"use client";

import React, { useState } from "react";
import {
  X,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Clock,
  Sparkles
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export function WalletModal() {
  const { walletModalOpen, setWalletModalOpen, walletBalance, depositWallet, withdrawWallet } = useKrsStore();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "history">("deposit");

  // Deposit state
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [copiedPix, setCopiedPix] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<string>("100");
  const [pixKeyType, setPixKeyType] = useState<"cpf" | "phone" | "email" | "random">("cpf");
  const [pixKey, setPixKey] = useState<string>("123.456.789-00");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  if (!walletModalOpen) return null;

  const handleDepositConfirm = () => {
    depositWallet(depositAmount);
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setWalletModalOpen(false);
    }, 1800);
  };

  const handleWithdrawConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0 || val > walletBalance) return;
    withdrawWallet(val, pixKey);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWalletModalOpen(false);
    }, 1800);
  };

  const fakePixCode = `00020126580014br.gov.bcb.pix0136krs-${depositAmount}-pix-qrcode-instant5204000053039865405${depositAmount.toFixed(2)}5802BR5915KRS CREATOR HUB6009SAO PAULO62070503***6304`;

  const copyPixCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fakePixCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0a120c] border-2 border-emerald-500/40 shadow-2xl p-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setWalletModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-dark-900 hover:bg-white/10 text-zinc-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Balance */}
        <div className="text-center pb-4 border-b border-white/5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400 mb-2">
            <span>Meu saldo 💰</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">
            R$ {walletBalance.toFixed(2).replace(".", ",")}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Carteira Digital KRS • Saques e Depósitos instantâneos via PIX
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-dark-900 p-1 my-4 border border-white/5">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "deposit"
                ? "bg-gradient-to-r from-[#00F59B] to-emerald-400 text-dark-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>DEPOSITAR</span>
          </button>

          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "withdraw"
                ? "bg-gradient-to-r from-[#00F59B] to-emerald-400 text-dark-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>SACAR VIA PIX</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "history"
                ? "bg-gradient-to-r from-[#00F59B] to-emerald-400 text-dark-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>HISTÓRICO</span>
          </button>
        </div>

        {/* Tab 1: DEPOSIT */}
        {activeTab === "deposit" && (
          <div className="space-y-4">
            {depositSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center space-y-2 animate-in zoom-in-95">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-black text-white">Depósito Confirmado!</h4>
                <p className="text-xs text-emerald-200">
                  +R$ {depositAmount.toFixed(2)} foram adicionados com sucesso ao seu saldo.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-2">
                    Escolha o valor do depósito:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[20, 50, 100, 200].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDepositAmount(amt)}
                        className={`py-2 px-1 rounded-xl text-xs font-black border transition ${
                          depositAmount === amt
                            ? "bg-emerald-500 text-dark-950 border-emerald-400 shadow-md shadow-emerald-500/30"
                            : "bg-dark-900 border-white/10 text-zinc-300 hover:text-white hover:bg-dark-850"
                        }`}
                      >
                        R$ {amt}
                        {amt === 50 && (
                          <span className="block text-[8px] text-dark-950 font-bold tracking-tighter">
                            +100% BÔNUS
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR Code Simulation */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-36 h-36 bg-white rounded-xl p-2.5 shadow-md flex items-center justify-center mb-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(fakePixCode)}`}
                      alt="QR Code Pix"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Escaneie com o app do seu banco ou copie o código abaixo
                  </span>
                </div>

                {/* Pix Copia e Cola */}
                <button
                  onClick={copyPixCode}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 text-xs font-bold text-white transition"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Código PIX Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Chave Pix Copia e Cola</span>
                    </>
                  )}
                </button>

                {/* Simulation Confirm Button */}
                <button
                  onClick={handleDepositConfirm}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirmar Pagamento Simulado (R$ {depositAmount.toFixed(2)})
                </button>
              </>
            )}
          </div>
        )}

        {/* Tab 2: WITHDRAW (exact copy from reference image: RECEBA INSTANTANEAMENTE O SEU SAQUE VIA PIX) */}
        {activeTab === "withdraw" && (
          <form onSubmit={handleWithdrawConfirm} className="space-y-4">
            {withdrawSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center space-y-2 animate-in zoom-in-95">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-black text-white">Saque Concluído com Sucesso!</h4>
                <p className="text-xs text-emerald-200">
                  R$ {parseFloat(withdrawAmount).toFixed(2)} foram enviados instantaneamente via PIX para {pixKey}.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <div className="text-[10px] font-pixel text-emerald-400 tracking-wider uppercase mb-1">
                    PIX INSTANTÂNEO ⚡
                  </div>
                  <h4 className="text-sm font-black text-white">
                    RECEBA INSTANTANEAMENTE O SEU SAQUE VIA PIX
                  </h4>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Valor do Saque (R$):
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={walletBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-emerald-400 transition"
                    placeholder="0,00"
                    required
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Disponível para saque: R$ {walletBalance.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Tipo de Chave PIX:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[
                      { id: "cpf", label: "CPF" },
                      { id: "phone", label: "Telefone" },
                      { id: "email", label: "E-mail" },
                      { id: "random", label: "Aleatória" },
                    ].map((k) => (
                      <button
                        type="button"
                        key={k.id}
                        onClick={() => setPixKeyType(k.id as any)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                          pixKeyType === k.id
                            ? "bg-emerald-500 text-dark-950 border-emerald-400"
                            : "bg-dark-900 border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 transition"
                    placeholder="Digite sua chave PIX"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={parseFloat(withdrawAmount) > walletBalance || parseFloat(withdrawAmount) <= 0}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  SOLICITAR SAQUE PIX AGORA
                </button>
              </>
            )}
          </form>
        )}

        {/* Tab 3: HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {[
              {
                type: "deposit",
                title: "Depósito PIX Instantâneo",
                val: "+R$ 150,00",
                date: "Hoje, 14:32",
                status: "Confirmado",
              },
              {
                type: "withdraw",
                title: "Saque PIX para Chave CPF",
                val: "-R$ 80,00",
                date: "Ontem, 19:10",
                status: "Liquidado",
              },
              {
                type: "deposit",
                title: "Bônus Creator Hub Fruit Cash",
                val: "+R$ 100,00",
                date: "20 Set, 11:00",
                status: "Creditado",
              },
              {
                type: "deposit",
                title: "Comissão de Indicação Blockerino",
                val: "+R$ 210,00",
                date: "18 Set, 17:45",
                status: "Liquidado",
              },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-dark-900 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      tx.type === "deposit"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.type === "deposit" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{tx.title}</div>
                    <div className="text-[10px] text-zinc-400">{tx.date}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-black ${
                      tx.type === "deposit" ? "text-emerald-400" : "text-zinc-200"
                    }`}
                  >
                    {tx.val}
                  </div>
                  <div className="text-[9px] text-emerald-400 font-bold uppercase">
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security badge footer */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Transações seguras processadas via Banco Central do Brasil • PIX 24h</span>
        </div>
      </div>
    </div>
  );
}
