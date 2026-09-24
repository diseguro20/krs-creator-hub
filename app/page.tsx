"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Trophy,
  Users,
  Layers,
  Flame,
  CheckCircle2,
  ChevronRight,
  Play,
  TrendingUp,
  Gamepad2,
  HelpCircle,
  ExternalLink,
  Award,
  Wallet
} from "lucide-react";
import { ArcadeHeaderBar } from "@/components/gaming/ArcadeHeaderBar";
import { PromotionalCarousel } from "@/components/gaming/PromotionalCarousel";
import { ArcadeGameCard } from "@/components/gaming/ArcadeGameCard";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { formatCurrency } from "@/lib/utils";

export default function LandingPage() {
  const { games, campaigns, totalAffiliateBalance, affiliateStats, isAffiliateUser, openGamePlayer } = useKrsStore();

  return (
    <div className="relative min-h-screen bg-[#070c09] text-white selection:bg-[#00F59B] selection:text-dark-950 font-sans">
      {/* 1. TOP ARCADE HEADER BAR (Exact match to reference screenshot) */}
      <ArcadeHeaderBar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-10 sm:space-y-12">
        {/* ========================================================================= */}
        {/* 1. HERO: PROMOTIONAL CAROUSEL BANNER (Exact layout from reference)         */}
        {/* ========================================================================= */}
        <section className="relative">
          <PromotionalCarousel />
        </section>

        {/* ========================================================================= */}
        {/* 2. JOGOS OFICIAIS (2 colunas mobile / 4 colunas desktop)                 */}
        {/* ========================================================================= */}
        <section id="jogos" className="space-y-6 pt-2">
          {/* Section Arcade Header matching user screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🎮</span>
                <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,245,155,0.4)]">
                  JOGOS
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  {games.length} títulos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
                Nossos jogos oficiais de habilidade, reflexo e entretenimento. Teste os jogos no player arcade integrado, copie seu link e fature com saques imediatos via PIX.
              </p>
            </div>

            <Link
              href="/afiliados"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Ver painel de comissões</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2-Column Mobile / 4-Column Desktop Grid matching reference */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {games.map((game) => (
              <ArcadeGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PAINEL UNIFICADO DE AFILIADO (MULTI-JOGOS PIX)                        */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1912] via-[#09120d] to-[#040805] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 arcade-box overflow-hidden">
          <div className="arcade-scanlines pointer-events-none opacity-30" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-pixel text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NOVIDADE • PAINEL UNIFICADO DE AFILIADOS</span>
              </div>

              <h2 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wide leading-tight">
                TODOS OS SEUS GANHOS <br />
                <span className="text-[#00F59B]">EM UM SÓ LUGAR</span>
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Chega de gerenciar links espalhados! Divulgue o <strong>Fruit Cash</strong>, <strong>KRS 777 Casino</strong>, <strong>Blockerino</strong> e <strong>Bubble Cash</strong> em um único painel e solicite saques consolidados instantâneos via PIX na sua conta.
              </p>

              {/* 4 Games Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {affiliateStats.map((item) => (
                  <div key={item.game_id} className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/20 text-center">
                    <div className="text-[10px] text-zinc-400 font-bold truncate">{item.game_name.split(" ")[0]}</div>
                    <div className="font-pixel text-xs text-emerald-400 font-black mt-1">
                      {formatCurrency(item.available_balance)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl bg-black/70 border-2 border-emerald-400/50 p-6 backdrop-blur-xl min-w-[280px]">
              <div className="text-[10px] uppercase font-pixel text-zinc-400">
                {isAffiliateUser ? "SEU SALDO DISPONÍVEL" : "SALDO AFILIADO"}
              </div>
              <div className="text-3xl font-pixel text-emerald-400 font-black my-2 drop-shadow-[0_0_12px_rgba(0,245,155,0.6)]">
                {formatCurrency(totalAffiliateBalance)}
              </div>
              <div className="text-[11px] text-zinc-400 mb-4 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Liberação imediata no PIX</span>
              </div>

              <Link
                href="/afiliados"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition active:scale-95"
              >
                <Zap className="w-4 h-4 fill-dark-950" />
                <span>ABRIR PAINEL & SACAR PIX</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. COMO FUNCIONA: A JORNADA DO CREATOR                                   */}
        {/* ========================================================================= */}
        <section id="como-funciona" className="py-12 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-emerald-400 mb-2">
              <Layers className="w-4 h-4" />
              Direto ao Ponto
            </div>
            <h2 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wider">
              Como Funciona o Corre
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Etapas simples, links de afiliados exclusivos e roteiros mastigados pra você focar em criar conteúdo massa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: "01", title: "Escolha o Jogo", desc: "Selecione Fruit Cash, KRS 777, Blockerino ou Bubble Cash no seu painel." },
              { num: "02", title: "Pegue seu Link", desc: "Copie seu link de afiliado rastreado e baixe nossos roteiros e templates." },
              { num: "03", title: "Solte o Gameplay", desc: "Grave partidas reais, mostre seus recordes e publique nos Reels, Stories e TikTok." },
              { num: "04", title: "Acompanhe os Leads", desc: "Veja cliques, cadastros e depósitos pingando em tempo real no feed de conversões." },
              { num: "05", title: "Saque via PIX 💸", desc: "Comissões acumuladas de todos os 4 jogos liberadas na hora para a sua chave PIX." },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-[#0a110c] border border-emerald-500/20 flex flex-col justify-between"
              >
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-pixel text-xs mb-3">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{step.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. GAMIFICAÇÃO & CREATOR PASS                                             */}
        {/* ========================================================================= */}
        <section id="gamificacao" className="py-12 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-emerald-400">
                <Trophy className="w-4 h-4" />
                Gamificação & Recompensas
              </div>
              <h2 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-wider leading-tight">
                Creator Pass & Níveis de Prestígio
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Aqui sua dedicação vale ouro. Cada lead indicado e conteúdo aprovado soma XP na sua conta, avança marcos no <strong>Creator Pass</strong>, aumenta seus multiplicadores de ganhos e destrava premiações exclusivas da comunidade.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#0a110c] border border-white/5 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Streaks de Consistência</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Bônus por semanas consecutivas com campanhas e divulgação ativa.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a110c] border border-white/5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Saques 24/7 sem Burocracia</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Solicite qualquer valor a qualquer hora diretamente via PIX.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/creator-pass"
                  className="px-5 py-3 rounded-xl bg-emerald-500 text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition"
                >
                  Ver Creator Pass
                </Link>
                <Link
                  href="/ranking"
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition"
                >
                  Ver Ranking Geral
                </Link>
              </div>
            </div>

            {/* Visual Pass Card */}
            <div className="lg:col-span-5 rounded-3xl border-2 border-emerald-500/30 bg-[#0a110c] p-6 shadow-2xl relative overflow-hidden arcade-box">
              <div className="arcade-scanlines pointer-events-none opacity-20" />
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <span className="text-[9px] font-pixel text-emerald-400 uppercase">TEMPORADA 1</span>
                  <h3 className="font-pixel text-sm text-white mt-1">CYBER GENESIS</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  14 DIAS RESTANTES
                </span>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Progresso do Passe</span>
                  <span className="text-emerald-400 font-bold">Nível 5 de 10</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-dark-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#00F59B] w-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center">
                  <div className="text-[9px] font-pixel text-zinc-500">LVL 1</div>
                  <div className="text-[10px] font-bold text-emerald-400 mt-1">DESBLOQUEADO</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-emerald-400/40 text-center">
                  <div className="text-[9px] font-pixel text-emerald-400">LVL 5</div>
                  <div className="text-[10px] font-bold text-white mt-1">EM CURSO</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-center opacity-50">
                  <div className="text-[9px] font-pixel text-zinc-600">LVL 10</div>
                  <div className="text-[10px] font-medium text-zinc-400 mt-1">BLOQUEADO</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. TRANSPARÊNCIA: JOGOS 100% DE HABILIDADE                                */}
        {/* ========================================================================= */}
        <section className="py-8 border-t border-white/5">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0a110c] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Papo Reto: Ecossistema Oficial de Jogos de Habilidade & Cassino KRS
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Não compactuamos com promessas de dinheiro fácil ou prints bancários falsos. Nossos jogos de habilidade e reflexo possuem premiações reais e saques instantâneos via PIX auditados. Divulgue com credibilidade para sua audiência.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 7. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/5 bg-[#050806] py-10 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-dark-950 font-pixel flex items-center justify-center text-xs font-black">
              K
            </div>
            <div>
              <div className="font-bold text-white text-sm">KRS CREATOR HUB</div>
              <div className="text-[11px]">© 2026 KRS Gaming. Todos os direitos reservados.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <Link href="/afiliados" className="hover:text-emerald-400 transition font-bold text-emerald-400">
              Painel do Afiliado
            </Link>
            <Link href="/jogos" className="hover:text-white transition">Jogos</Link>
            <Link href="/campanhas" className="hover:text-white transition">Campanhas</Link>
            <Link href="/termos" className="hover:text-white transition">Termos</Link>
            <Link href="/privacidade" className="hover:text-white transition">Privacidade</Link>
            <Link href="/ajuda" className="hover:text-white transition">Central de Ajuda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
