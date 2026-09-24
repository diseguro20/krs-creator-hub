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
  Lock,
  ChevronRight,
  Play,
  FileCheck,
  TrendingUp,
  Gamepad2,
  HelpCircle,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroCanvas } from "@/components/landing/HeroCanvas";
import { PromotionalCarousel } from "@/components/gaming/PromotionalCarousel";
import { ArcadeGameCard } from "@/components/gaming/ArcadeGameCard";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function LandingPage() {
  const { games, campaigns } = useKrsStore();

  return (
    <div className="relative min-h-screen bg-dark-950 text-white selection:bg-brand-primary selection:text-dark-950">
      <LandingNavbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-24 text-center sm:px-6 lg:px-8">
        <HeroCanvas />

        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/90 border border-brand-primary/30 text-xs font-semibold text-brand-primary mb-8 backdrop-blur-md shadow-lg shadow-brand-primary/10">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            <span>KRS CREATOR HUB • A CASA DOS CRIADORES DE JOGOS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-zinc-100">
            SEU CONTEÚDO, <br className="hidden sm:inline" />
            SUAS REGRAS, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-neon">PARCERIA DE VERDADE.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Bora criar junto! Escolha campanhas oficiais de jogos por habilidade, solte gameplays autênticos, envie suas entregas sem estresse e suba de nível com o Creator Pass.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-primary text-dark-950 font-black text-base hover:bg-brand-primaryHover transition-all shadow-xl shadow-brand-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>BORA CRIAR JUNTO</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="#jogos"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-dark-900/80 hover:bg-dark-850 text-zinc-200 border border-white/10 hover:border-white/20 font-bold text-base transition-all backdrop-blur-sm"
            >
              <span>VER JOGOS NO AR</span>
            </Link>
          </div>

          {/* Highlights ticker */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/5">
            <div className="text-center p-3">
              <div className="text-2xl font-extrabold text-white">100%</div>
              <div className="text-xs text-zinc-400 font-medium">Habilidade Pura</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-extrabold text-brand-primary">+500</div>
              <div className="text-xs text-zinc-400 font-medium">Creators no Time</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-extrabold text-brand-neon">&lt; 12h</div>
              <div className="text-xs text-zinc-400 font-medium">Análise Rápida</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-extrabold text-amber-400">Zero</div>
              <div className="text-xs text-zinc-400 font-medium">Burocracia</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. JOGOS EM DESTAQUE (CATÁLOGO & PROMOÇÕES)                               */}
      {/* ========================================================================= */}
      <section id="jogos" className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-dark-950">
        <div className="mx-auto max-w-7xl space-y-10">
          
          {/* Promotional Carousel Banner matching user design */}
          <PromotionalCarousel />

          {/* Section Arcade Header matching user screenshot */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎮</span>
                <h2 className="font-pixel text-xl sm:text-3xl text-white tracking-widest uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  JOGOS
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  {games.length} títulos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
                Nossos jogos oficiais de habilidade e reflexo. Teste a jogabilidade, receba materiais prontos e divulgue com saques imediatos via PIX.
              </p>
            </div>

            <Link
              href="/jogos"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2-Column Mobile / 4-Column Desktop Grid matching reference */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {games.map((game) => (
              <ArcadeGameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMO FUNCIONA: A JORNADA DO CREATOR                                   */}
      {/* ========================================================================= */}
      <section id="como-funciona" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-dark-900/60">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-primary mb-2">
              <Layers className="w-4 h-4" />
              Direto ao Ponto
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Como Funciona o Corre (Sem Enrolação)
            </h2>
            <p className="text-base text-zinc-400">
              Etapas simples, roteiros mastigados pra você não perder tempo e aprovação rápida pra você focar no que importa: criar conteúdo massa pra sua comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-dark-850 border border-white/5 flex flex-col relative overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Escolha o Jogo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dá uma olhada nas campanhas ativas e escolhe o jogo que mais combina com seu canal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-dark-850 border border-white/5 flex flex-col relative overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-brand-neon/10 border border-brand-neon/30 text-brand-neon flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">Solta o Gameplay</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Grava uma partida real no celular mostrando seus recordes e seus combos insanos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-dark-850 border border-white/5 flex flex-col relative overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">Posta pra Geral</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Solta nos Stories, Reels ou TikTok usando nossos roteiros prontos e o link do jogo.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-dark-850 border border-white/5 flex flex-col relative overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-purple-400/10 border border-purple-400/30 text-purple-400 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-white mb-2">Manda o Print/Link</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sobe o print do alcance ou link direto no painel pra nossa equipe dar aquela olhada.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-dark-850 border border-brand-primary/30 flex flex-col relative overflow-hidden shadow-lg shadow-brand-primary/10">
              <div className="h-9 w-9 rounded-xl bg-brand-primary text-dark-950 flex items-center justify-center font-bold text-sm mb-4">
                05
              </div>
              <h4 className="text-base font-bold text-white mb-2">XP na Conta! 🎯</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Aprovou? XP cai na hora, você avança no Creator Pass e destrava novos drops épicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. GAMIFICAÇÃO & CREATOR PASS                                             */}
      {/* ========================================================================= */}
      <section id="gamificacao" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-dark-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-primary mb-3">
                <Trophy className="w-4 h-4" />
                Gamificação & Recompensas
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                Creator Pass, Níveis & Badges Exclusivas.
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed mb-6">
                Aqui sua dedicação vale ouro. Cada conteúdo aprovado soma XP na sua conta, avança marcos no <strong>Creator Pass</strong>, aumenta seus multiplicadores e destrava campanhas exclusivas com remuneração especial.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary mt-0.5">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Streaks de Consistência</h4>
                    <p className="text-xs text-zinc-400">Pontuações adicionais por semanas consecutivas com campanhas ativas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-brand-neon/10 text-brand-neon mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fila Rápida de Moderação</h4>
                    <p className="text-xs text-zinc-400">Criadores dos níveis Pro e Elite têm análise garantida em poucas horas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ranking Ético por Desempenho</h4>
                    <p className="text-xs text-zinc-400">Classificação focada estritamente em qualidade de entrega e comprometimento.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-dark-950 font-bold text-sm hover:bg-zinc-200 transition"
              >
                <span>Desbloquear Creator Pass</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Season Pass Preview Card */}
            <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-dark-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">Temporada Inaugural</span>
                  <h3 className="text-xl font-bold text-white">Cyber Genesis</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-dark-850 border border-white/10 text-xs font-medium text-zinc-300">
                  14 dias restantes
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Progresso do Passe</span>
                  <span className="text-brand-primary font-bold">Nível 5 de 10</span>
                </div>
                <div className="h-3 w-full rounded-full bg-dark-800 overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-neon w-[50%]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-dark-850 border border-white/5 text-center">
                  <div className="text-[10px] font-bold uppercase text-zinc-400 mb-1">NÍVEL 1</div>
                  <div className="text-xs font-semibold text-white truncate">Badge Genesis</div>
                  <div className="mt-2 text-[10px] text-brand-primary font-bold">DESBLOQUEADO</div>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-850 border border-brand-primary/40 text-center shadow-md shadow-brand-primary/10">
                  <div className="text-[10px] font-bold uppercase text-brand-primary mb-1">NÍVEL 5</div>
                  <div className="text-xs font-semibold text-white truncate">Campanha VIP</div>
                  <div className="mt-2 text-[10px] text-brand-primary font-bold">EM ANDAMENTO</div>
                </div>
                <div className="p-3.5 rounded-xl bg-dark-850/60 border border-white/5 text-center opacity-60">
                  <div className="text-[10px] font-bold uppercase text-zinc-400 mb-1">NÍVEL 10</div>
                  <div className="text-xs font-semibold text-zinc-300 truncate">Genesis Lord</div>
                  <div className="mt-2 text-[10px] text-zinc-400 font-medium">BLOQUEADO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PARA CAPTADORES                                                        */}
      {/* ========================================================================= */}
      <section id="captadores" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-dark-900/60">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl border border-white/10 bg-dark-950 p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-neon" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">Funil do Captador</h4>
                  </div>
                  <span className="text-xs text-zinc-400">Atribuição Automática</span>
                </div>

                {/* Funnel bars */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">Convites Enviados</span>
                      <span className="font-bold text-white">45</span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-800"><div className="h-full rounded-full bg-zinc-400 w-full" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">Cadastros Realizados</span>
                      <span className="font-bold text-white">28 (62%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-800"><div className="h-full rounded-full bg-brand-neon w-[62%]" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">Creators Ativos em Campanhas</span>
                      <span className="font-bold text-white">19 (42%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-800"><div className="h-full rounded-full bg-brand-primary w-[42%]" /></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-900 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Seu Link de Referral</span>
                    <div className="text-xs font-mono font-bold text-brand-primary">hub.krs.gg/cadastro?ref=MARCOS10</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-dark-800 text-xs font-semibold text-white">
                    Copiar
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-neon mb-3">
                <Users className="w-4 h-4" />
                Programa de Captação
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                Conhece Creators que Mandam Bem? Monte Sua Tropa.
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed mb-6">
                Se você tem contato com criadores e streamers, seja nosso parceiro captador. Você ganha link exclusivo, QR Code na hora e acompanha cada indicado direto no seu painel.
              </p>

              <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>Atribuição 100% segura (seu link e código não se perdem).</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>XP e bonificações sempre que seus creators entregam campanhas.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>Mensagens mastigadas pra mandar no WhatsApp dos criadores.</span>
                </li>
              </ul>

              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-neon text-dark-950 font-bold text-sm hover:bg-cyan-300 transition shadow-lg shadow-brand-neon/20"
              >
                <span>Bora Captar Creators</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRANSPARÊNCIA E RESPONSABILIDADE                                      */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-dark-950">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-dark-900/60 p-8 sm:p-10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Papo Reto: Jogo de Habilidade & Sem Truques
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                A gente não compactua com prints bancários fakes, simulação de saque mentirosa ou promessas de dinheiro fácil. Nossos jogos são torneios competitivos de habilidade e reflexo. Conteúdo autêntico e verdadeiro é o que conecta com seu público de verdade!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAQ                                                                    */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-dark-950">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-primary mb-2">
              <HelpCircle className="w-4 h-4" />
              Tira-Dúvidas
            </div>
            <h2 className="text-3xl font-black text-white">Perguntas da Comunidade</h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-dark-900 border border-white/5">
              <h4 className="text-base font-bold text-white mb-2">Preciso ser um creator gigante pra entrar?</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Que nada! O que a gente mais valoriza é criatividade, autenticidade e conexão real com a sua audiência. Seja você micro ou grande influenciador, tem campanhas feitas na medida pro seu canal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-white/5">
              <h4 className="text-base font-bold text-white mb-2">Como envio meus vídeos e gameplays?</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Tudo direto pelo uploader no seu painel. Você sobe o vídeo ou cola o link da postagem e nossa equipe avalia em poucas horas (geralmente em menos de 12h). Se precisar de algum ajuste, te avisamos com dicas bem claras.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-white/5">
              <h4 className="text-base font-bold text-white mb-2">E como os captadores saem ganhando?</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Você acumula XP na plataforma a cada creator da sua rede que manda bem nas campanhas, sobe de nível e destrava premiações exclusivas da comunidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/5 bg-dark-900 py-12 px-4 sm:px-6 lg:px-8 text-xs text-zinc-400">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-primary text-dark-950 font-black flex items-center justify-center text-xs">
              KRS
            </div>
            <div>
              <div className="font-bold text-white text-sm">KRS CREATOR HUB</div>
              <div>© 2026 KRS Gaming. Todos os direitos reservados.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <Link href="/termos" className="hover:text-white transition">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition">Privacidade & LGPD</Link>
            <Link href="/ajuda" className="hover:text-white transition">Central de Ajuda</Link>
            <Link href="/login" className="hover:text-white transition">Acesso à Plataforma</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
