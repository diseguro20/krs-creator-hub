"use client";

import React, { useState } from "react";
import {
  Webhook,
  Key,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Send,
  ExternalLink,
  ArrowRight,
  Code,
  Terminal,
  CheckCircle2,
  RefreshCw,
  Layers,
  DollarSign,
  AlertTriangle,
  Play,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminIntegracoesPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const [activeSnippetTab, setActiveSnippetTab] = useState<"fetch" | "php" | "pixel">("fetch");
  const [selectedGameTest, setSelectedGameTest] = useState("fruit-cash");
  const [testAffiliateCode, setTestAffiliateCode] = useState("nobru");
  const [testDepositAmount, setTestDepositAmount] = useState("50.00");
  const [testPlayerName, setTestPlayerName] = useState("Carlos M.");
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  const webhookUrl = "https://krs-creator-hub.vercel.app/api/webhooks/conversions";
  const apiKey = "krs_sec_live_99f821a084c7e481b3";

  const handleCopy = (text: string, type: "key" | "url" | string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedSnippet(type);
        setTimeout(() => setCopiedSnippet(null), 2000);
      }
    }
  };

  const handleRunWebhookTest = async () => {
    setIsTesting(true);
    setTestResponse(null);

    const payload = {
      game_slug: selectedGameTest,
      game_name:
        selectedGameTest === "fruit-cash"
          ? "Fruit Cash"
          : selectedGameTest === "krs-777"
          ? "KRS 777 (Casino Online)"
          : selectedGameTest === "blockerino"
          ? "Blockerino"
          : "Bubble Cash",
      affiliate_code: testAffiliateCode,
      event_type: "deposit",
      amount_deposited: parseFloat(testDepositAmount) || 50,
      player_name: testPlayerName,
      player_id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
      transaction_id: `PIX-TEST-${Date.now().toString().slice(-6)}`,
    };

    try {
      const res = await fetch("/api/webhooks/conversions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-krs-secret": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestResponse({
        status: res.status,
        ok: res.ok,
        data,
      });
    } catch (err: any) {
      setTestResponse({
        status: 500,
        ok: false,
        data: { error: err.message || "Falha na conexão local" },
      });
    } finally {
      setIsTesting(false);
    }
  };

  const nodeSnippet = `// Exemplo: Disparo no backend de depósito do seu jogo (Fruit Cash, Blockerino, etc)
// Chamado imediatamente após a confirmação do pagamento via PIX

const response = await fetch("https://krs-creator-hub.vercel.app/api/webhooks/conversions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-krs-secret": "${apiKey}",
  },
  body: JSON.stringify({
    game_slug: "${selectedGameTest}", // "fruit-cash", "krs-777", "blockerino" ou "bubbles-cash"
    affiliate_code: req.query.ref || user.referred_by, // Código capturado no link ?ref=...
    event_type: "deposit", // "signup" ou "deposit"
    amount_deposited: 50.00, // Valor depositado pelo jogador em Reais
    commission_amount: 10.00, // Opcional: calcula 20% revshare automático se omitido
    player_name: "Marcos Silva",
    player_id: "user_12345",
    transaction_id: "pix_tx_99812",
  }),
});

const result = await response.json();
console.log("Comissão creditada no KRS Creator Hub:", result);`;

  const phpSnippet = `<?php
// Exemplo PHP / Laravel (Muito usado no KRS 777 Casino)
// Execute ao receber o webhook de pagamento do gateway PIX

$url = "https://krs-creator-hub.vercel.app/api/webhooks/conversions";
$secret = "${apiKey}";

$data = [
    "game_slug" => "${selectedGameTest}",
    "affiliate_code" => $_SESSION['affiliate_ref'] ?? "nobru",
    "event_type" => "deposit",
    "amount_deposited" => 50.00,
    "player_name" => "Marcos Silva",
    "player_id" => "usr_9982",
    "transaction_id" => "PIX_777_88123"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "x-krs-secret: " . $secret
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);
?>`;

  const pixelSnippet = `<!-- Script Frontend de Rastreamento (Colocar no <head> ou <body> de qualquer jogo) -->
<!-- Ele captura automaticamente ?ref= ou ?r= da URL e grava no LocalStorage/Cookie do visitante -->
<script>
  (function() {
    var params = new URLSearchParams(window.location.search);
    var ref = params.get('ref') || params.get('r');
    if (ref) {
      localStorage.setItem('krs_affiliate_ref', ref);
      document.cookie = "krs_affiliate_ref=" + ref + "; path=/; max-age=" + (30*24*60*60);
      console.log("[KRS Creator Hub] Afiliado rastreado:", ref);
    }
  })();
</script>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-pixel text-emerald-400 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SISTEMA CENTRAL DE AFILIADOS MULTI-JOGOS</span>
        </div>
        <h1 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wider">
          CONEXÃO E WEBHOOKS DOS 4 JOGOS
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Como funciona a centralização de saldo: quando qualquer jogador cadastra ou deposita no <strong>Fruit Cash</strong>, <strong>KRS 777 Casino</strong>, <strong>Blockerino</strong> ou <strong>Bubble Cash</strong> com o link do afiliado, o jogo notifica esta API central. As comissões são somadas aqui para o afiliado <strong>sacar tudo via PIX em um só lugar</strong>.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. FLUXO VISUAL PASSO A PASSO DE COMO FUNCIONA                           */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#08120c] p-6 shadow-xl">
        <h2 className="font-pixel text-base text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          FLUXO DA COMISSÃO UNIFICADA (PASSO A PASSO)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Passo 1 */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-pixel text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-white text-sm">Divulgação com Link</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                O afiliado pega seu link no KRS Creator Hub (ex: <code className="text-emerald-400">fruitcash-fun.vercel.app/?ref=nobru</code>) e divulga no Instagram/Stories.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-zinc-500 font-mono">
              Captura automática de tag
            </div>
          </div>

          {/* Passo 2 */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-pixel text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-white text-sm">Depósito no Jogo</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                O jogador entra no jogo, joga e realiza um depósito via PIX (ex: R$ 50,00). O jogo lê o código do afiliado que indicou.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-zinc-500 font-mono">
              Armazenado em cookie/sessão
            </div>
          </div>

          {/* Passo 3 */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-pixel text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Disparo de Webhook</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                O backend do jogo dispara um POST HTTP para este endpoint do Creator Hub notificando o valor e o código do afiliado.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-zinc-500 font-mono">
              Notificação em milissegundos
            </div>
          </div>

          {/* Passo 4 */}
          <div className="rounded-2xl bg-gradient-to-b from-[#112419] to-black border-2 border-emerald-400 p-4 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-400 text-dark-950 font-black font-pixel text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-emerald-400 text-sm">Saque PIX Centralizado</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                O saldo dos 4 jogos é somado na carteira única do afiliado. Ele clica em <strong>"SACAR PIX"</strong> e recebe tudo de uma vez só!
              </p>
            </div>
            <div className="mt-3 text-[10px] text-emerald-300 font-bold font-mono">
              1 único saque para todos os jogos
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHAVES DE API & ENDPOINT DE CONVERSÕES                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoint Webhook */}
        <div className="rounded-3xl border border-white/10 bg-dark-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Webhook className="w-4 h-4 text-emerald-400" />
              ENDPOINT WEBHOOK (URL DE POSTBACK)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              POST
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-2xl p-2.5">
            <code className="text-xs text-emerald-400 font-mono truncate flex-1 select-all">
              {webhookUrl}
            </code>
            <button
              onClick={() => handleCopy(webhookUrl, "url")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
              title="Copiar URL"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">
            Configure esta URL como destino no backend dos seus 4 jogos ao confirmar pagamentos.
          </p>
        </div>

        {/* API Secret Key */}
        <div className="rounded-3xl border border-white/10 bg-dark-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              CHAVE SECRETA (X-KRS-SECRET)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
              AUTORIZAÇÃO
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-2xl p-2.5">
            <code className="text-xs text-amber-300 font-mono truncate flex-1 select-all">
              {apiKey}
            </code>
            <button
              onClick={() => handleCopy(apiKey, "key")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
              title="Copiar Chave Secreta"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">
            Envie esta chave no header <code className="text-amber-400">x-krs-secret</code> de cada requisição para segurança contra fraudes.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TESTADOR / SIMULADOR DE WEBHOOK AO VIVO                                */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#09130e] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <h2 className="font-pixel text-base sm:text-lg text-white uppercase tracking-wider">
                SIMULADOR DE CONVERSÃO AO VIVO
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Dispare um teste real agora mesmo simulando um depósito vindo de um dos seus jogos para ver a comissão creditando.
            </p>
          </div>

          <button
            onClick={handleRunWebhookTest}
            disabled={isTesting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Disparar Webhook de Teste</span>
              </>
            )}
          </button>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1.5 uppercase">
              Jogo de Origem
            </label>
            <select
              value={selectedGameTest}
              onChange={(e) => setSelectedGameTest(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="fruit-cash">Fruit Cash (Habilidade)</option>
              <option value="krs-777">KRS 777 (Casino Online)</option>
              <option value="blockerino">Blockerino (Puzzle)</option>
              <option value="bubbles-cash">Bubble Cash (Habilidade)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1.5 uppercase">
              Código do Afiliado (?ref=)
            </label>
            <input
              type="text"
              value={testAffiliateCode}
              onChange={(e) => setTestAffiliateCode(e.target.value)}
              placeholder="ex: nobru"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
            >
            </input>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1.5 uppercase">
              Valor do Depósito (R$)
            </label>
            <input
              type="text"
              value={testDepositAmount}
              onChange={(e) => setTestDepositAmount(e.target.value)}
              placeholder="50.00"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            >
            </input>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1.5 uppercase">
              Nome do Jogador
            </label>
            <input
              type="text"
              value={testPlayerName}
              onChange={(e) => setTestPlayerName(e.target.value)}
              placeholder="Carlos M."
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
            </input>
          </div>
        </div>

        {/* Test Result Display */}
        {testResponse && (
          <div className="rounded-2xl bg-black/80 border border-emerald-500/30 p-4 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resposta da API (HTTP {testResponse.status}):
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {testResponse.data?.message}
              </span>
            </div>
            <pre className="text-[11px] text-emerald-400 font-mono bg-dark-950 p-3 rounded-xl overflow-x-auto border border-white/5">
              {JSON.stringify(testResponse.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. CÓDIGO PRONTO PARA COPIAR E COLAR NOS 4 JOGOS                          */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Snippets Prontos para Implementar nos Jogos</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Copie o código abaixo de acordo com a tecnologia que cada um dos seus jogos utiliza.
            </p>
          </div>

          {/* Code Tabs */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveSnippetTab("fetch")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSnippetTab === "fetch"
                  ? "bg-emerald-500 text-dark-950 font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Node.js / Next.js
            </button>
            <button
              onClick={() => setActiveSnippetTab("php")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSnippetTab === "php"
                  ? "bg-amber-400 text-dark-950 font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              PHP / Laravel (Casino)
            </button>
            <button
              onClick={() => setActiveSnippetTab("pixel")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSnippetTab === "pixel"
                  ? "bg-cyan-400 text-dark-950 font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Pixel HTML / JS (Frontend)
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="relative">
          <pre className="text-xs font-mono bg-black/80 text-zinc-200 p-4 rounded-2xl overflow-x-auto border border-white/10 leading-relaxed">
            {activeSnippetTab === "fetch" && nodeSnippet}
            {activeSnippetTab === "php" && phpSnippet}
            {activeSnippetTab === "pixel" && pixelSnippet}
          </pre>

          <button
            onClick={() =>
              handleCopy(
                activeSnippetTab === "fetch"
                  ? nodeSnippet
                  : activeSnippetTab === "php"
                  ? phpSnippet
                  : pixelSnippet,
                "snippet"
              )
            }
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer backdrop-blur"
          >
            {copiedSnippet === "snippet" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. GATEWAYS PIX (VIZZION PAY & OMEGA PAY)                                 */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Gateways de Saque PIX dos Afiliados (Vizzion Pay & Omega Pay)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Quando o afiliado acumular comissões e apertar "SACAR PIX", o KRS Creator Hub transfere automaticamente para a chave PIX do criador usando seu gateway configurado.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold self-start sm:self-auto">
            API CASH-OUT PRONTA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Vizzion Pay */}
          <div className="rounded-2xl bg-[#09150e] border-2 border-emerald-500/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="font-bold text-white text-base">Vizzion Pay</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-dark-950 font-bold text-[10px] uppercase font-pixel">
                ATIVO E CONECTADO
              </span>
            </div>
            <p className="text-xs text-zinc-300">
              Gateway principal configurado com as chaves reais de produção da sua operação (Fruit Cash / Blockerino).
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">API Key:</span>
                <span className="text-emerald-400">diseguro20_bbe5bjhaxoz0zcay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Endpoint:</span>
                <span className="text-zinc-400">https://app.vizzionpay.com.br</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className="text-emerald-400 font-bold">● Pronto para Cash-out</span>
              </div>
            </div>
          </div>

          {/* Omega Pay */}
          <div className="rounded-2xl bg-[#08131a] border-2 border-cyan-500/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span className="font-bold text-white text-base">Omega Pay</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-400 text-dark-950 font-bold text-[10px] uppercase font-pixel">
                ATIVO E CONECTADO
              </span>
            </div>
            <p className="text-xs text-zinc-300">
              Gateway oficial extraído do Blockerino e Bubble Cash, totalmente implantado para transferências e saques PIX.
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">API Key:</span>
                <span className="text-cyan-400">diseguro20_jfja0nvfswymuvpt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Endpoint:</span>
                <span className="text-zinc-400">https://app.omegapayments.com.br/api/v1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className="text-cyan-400 font-bold">● Pronto para Cash-out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
