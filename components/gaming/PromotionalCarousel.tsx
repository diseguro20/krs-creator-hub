"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, Play, Sparkles, ArrowRight } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

interface CarouselSlide {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  ctaAction: "play_fruit_cash" | "play_krs777" | "play_blockerino" | "open_wallet";
  gradient: string;
  borderColor: string;
  characterImg: string;
  floatingTag: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: "slide-pix",
    badge: "KRS CREATOR HUB • SAQUES 24/7",
    title: "RECEBA INSTANTANEAMENTE O",
    highlightText: "SEU SAQUE VIA PIX",
    subtitle: "Comissões unificadas dos 4 jogos transferidas em segundos direto para sua chave PIX.",
    ctaText: "JOGUE JÁ",
    ctaAction: "open_wallet",
    gradient: "from-[#082214] via-[#05110a] to-[#040906]",
    borderColor: "border-emerald-500/40 shadow-emerald-500/20",
    characterImg: "https://fruitcash-fun.vercel.app/imagens/asset_2.png",
    floatingTag: "PIX IMEDIATO ⚡",
  },
  {
    id: "slide-fruit-cash",
    badge: "FRUIT CASH OFICIAL 🍓",
    title: "CORTE AS FRUTINHAS E FATIE",
    highlightText: "LUCROS NO PIX!",
    subtitle: "O jogo de reflexo mais quente do Brasil: 100% de bônus no primeiro depósito.",
    ctaText: "JOGAR AGORA",
    ctaAction: "play_fruit_cash",
    gradient: "from-[#1a2e12] via-[#0c1808] to-[#040803]",
    borderColor: "border-green-400/40 shadow-green-500/20",
    characterImg: "https://fruitcash-fun.vercel.app/imagens/og-banner.jpg",
    floatingTag: "100% BÔNUS 🎁",
  },
  {
    id: "slide-krs777",
    badge: "CASSINO ONLINE OFICIAL 🎰",
    title: "KRS 777: FORTUNE TIGER,",
    highlightText: "MINES & SLOTS VIP",
    subtitle: "A plataforma oficial de slots da KRS com saques rápidos e bônus a partir de R$ 20.",
    ctaText: "JOGUE JÁ",
    ctaAction: "play_krs777",
    gradient: "from-[#291e07] via-[#120e03] to-[#080601]",
    borderColor: "border-amber-400/40 shadow-amber-500/20",
    characterImg: "https://krs777.online/assets/images/krs777_share_banner.jpg",
    floatingTag: "SLOTS AO VIVO 🐯",
  },
  {
    id: "slide-blockerino",
    badge: "HABILIDADE & PUZZLE 🧩",
    title: "BLOCKERINO & BUBBLE CASH",
    highlightText: "TORNEIOS NO AR!",
    subtitle: "Limpe linhas no grid 10x10, estoure bolhas e dispute o topo do ranking.",
    ctaText: "JOGAR AGORA",
    ctaAction: "play_blockerino",
    gradient: "from-[#081a2e] via-[#040c17] to-[#02050a]",
    borderColor: "border-cyan-400/40 shadow-cyan-500/20",
    characterImg: "https://blockerino-play.vercel.app/og.png",
    floatingTag: "RANKING 🏆",
  },
];

export function PromotionalCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { games, openGamePlayer, setWalletModalOpen } = useKrsStore();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Auto advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = SLIDES[currentSlide];

  const handleCtaClick = () => {
    if (slide.ctaAction === "open_wallet") {
      setWalletModalOpen(true);
    } else if (slide.ctaAction === "play_fruit_cash") {
      const g = games.find((x) => x.slug === "fruit-cash") || games[0];
      if (g) openGamePlayer(g);
    } else if (slide.ctaAction === "play_krs777") {
      const g = games.find((x) => x.slug === "krs-777") || games[1];
      if (g) openGamePlayer(g);
    } else if (slide.ctaAction === "play_blockerino") {
      const g = games.find((x) => x.slug === "blockerino") || games[2];
      if (g) openGamePlayer(g);
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full max-w-5xl mx-auto my-3 sm:my-6 select-none touch-pan-y"
    >
      {/* Main Banner Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border bg-gradient-to-r ${slide.gradient} ${slide.borderColor} shadow-2xl transition-all duration-500 min-h-[190px] sm:min-h-[230px] md:min-h-[260px] flex items-center`}
      >
        {/* Animated background particles & ambient grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Green Cubes / Diamonds (Visual elements from reference image) */}
        <div className="absolute top-4 left-1/4 w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 rotate-12 backdrop-blur-sm hidden sm:block animate-pulse" />
        <div className="absolute bottom-6 right-10 w-10 h-10 rounded-xl bg-emerald-500/25 border border-emerald-400/50 -rotate-12 backdrop-blur-sm hidden sm:block animate-bounce" style={{ animationDuration: "4s" }} />
        <div className="absolute top-6 right-1/4 w-6 h-6 rounded-md bg-emerald-400/30 border border-emerald-300/60 rotate-45 backdrop-blur-sm hidden sm:block" />

        {/* Content Container */}
        <div className="relative z-10 w-full px-3 sm:px-8 md:px-12 py-3.5 sm:py-6 flex items-center justify-between gap-2.5 sm:gap-6">
          
          {/* Left Side: Character / Game Badge & Tag */}
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="relative w-18 h-18 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-xl shadow-emerald-950/60 bg-gradient-to-b from-emerald-900/40 to-black/80">
              <img
                src={slide.characterImg}
                alt="Jogo Oficial"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-50" />
            </div>

            {/* Floating Tag */}
            <span className="mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] sm:text-[10px] font-black tracking-wider text-emerald-300 shadow-md whitespace-nowrap">
              {slide.floatingTag}
            </span>
          </div>

          {/* Center / Right Content */}
          <div className="flex-1 flex flex-col items-center text-center px-1 sm:px-4">
            {/* Mini Brand Badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/70 border border-emerald-500/30 text-[9px] sm:text-xs font-bold text-emerald-400 mb-1.5 uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {slide.badge}
            </div>

            {/* Big Headline (exact wording from user screenshot) */}
            <h2 className="text-xs sm:text-lg md:text-2xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              {slide.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#00F59B] to-green-300 font-extrabold block sm:inline">
                {slide.highlightText}
              </span>
            </h2>

            <p className="text-[11px] sm:text-xs md:text-sm text-zinc-300 max-w-md mt-1 hidden sm:block">
              {slide.subtitle}
            </p>

            {/* Glowing CTA Pill Button: "JOGUE JÁ" */}
            <button
              onClick={handleCtaClick}
              className="mt-2 sm:mt-3.5 group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-[10px] sm:text-xs md:text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/70 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-dark-950 text-dark-950" />
              <span>{slide.ctaText}</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Carousel Nav Arrow: Left */}
        <button
          onClick={handlePrev}
          aria-label="Slide anterior"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-emerald-500/30 border border-white/10 hover:border-emerald-400/50 text-white transition-all backdrop-blur-md cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Nav Arrow: Right */}
        <button
          onClick={handleNext}
          aria-label="Próximo slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-emerald-500/30 border border-white/10 hover:border-emerald-400/50 text-white transition-all backdrop-blur-md cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Pagination Indicators (active pill + dots) */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? "w-6 h-2 bg-emerald-400 shadow-md shadow-emerald-500/60"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
