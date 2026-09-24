"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Zap, Play, CheckCircle2 } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

interface CarouselSlide {
  id: string;
  type: "custom_card" | "graphic_banner";
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaText: string;
  ctaAction: "play_fruit_cash" | "play_krs777" | "play_blockerino" | "open_wallet";
  gradient: string;
  borderColor: string;
  bannerImg: string;
  floatingTag: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: "slide-pix",
    type: "custom_card",
    badge: "KRS CREATOR HUB • SAQUES 24/7",
    title: "RECEBA INSTANTANEAMENTE O",
    highlightText: "SEU SAQUE VIA PIX",
    subtitle: "Comissões unificadas dos 4 jogos transferidas em segundos direto para sua chave PIX.",
    ctaText: "JOGUE JÁ",
    ctaAction: "open_wallet",
    gradient: "from-[#082214] via-[#05110a] to-[#040906]",
    borderColor: "border-emerald-500/40 shadow-emerald-500/20",
    bannerImg: "/krs-logo.png",
    floatingTag: "KRS OFICIAL 👑",
  },
  {
    id: "slide-fruit-cash",
    type: "graphic_banner",
    badge: "FRUIT CASH OFICIAL 🍓",
    title: "CORTE AS FRUTINHAS E FATIE",
    highlightText: "LUCROS NO PIX!",
    subtitle: "O autêntico jogo da frutinha com 100% de bônus no primeiro depósito.",
    ctaText: "JOGAR AGORA",
    ctaAction: "play_fruit_cash",
    gradient: "from-[#14280f] via-[#0a1708] to-[#040803]",
    borderColor: "border-green-400/40 shadow-green-500/20",
    bannerImg: "https://fruitcash-fun.vercel.app/imagens/og-banner.jpg",
    floatingTag: "100% BÔNUS 🎁",
  },
  {
    id: "slide-krs777",
    type: "graphic_banner",
    badge: "CASSINO ONLINE OFICIAL 🎰",
    title: "KRS 777: FORTUNE TIGER,",
    highlightText: "MINES & SLOTS VIP",
    subtitle: "Slots oficiais, roletas ao vivo e saques rápidos na plataforma KRS.",
    ctaText: "JOGUE JÁ",
    ctaAction: "play_krs777",
    gradient: "from-[#291e07] via-[#120e03] to-[#080601]",
    borderColor: "border-amber-400/40 shadow-amber-500/20",
    bannerImg: "https://krs777.online/assets/images/krs777_share_banner.jpg",
    floatingTag: "SLOTS AO VIVO 🐯",
  },
  {
    id: "slide-blockerino",
    type: "graphic_banner",
    badge: "HABILIDADE & REFLEXO 🧩",
    title: "BLOCKERINO & BUBBLE CASH",
    highlightText: "TORNEIOS NO AR!",
    subtitle: "Limpe linhas no grid 10x10, estoure bolhas e dispute o topo do ranking.",
    ctaText: "JOGAR AGORA",
    ctaAction: "play_blockerino",
    gradient: "from-[#081a2e] via-[#040c17] to-[#02050a]",
    borderColor: "border-cyan-400/40 shadow-cyan-500/20",
    bannerImg: "https://blockerino-play.vercel.app/og.png",
    floatingTag: "RANKING 🏆",
  },
];

export function PromotionalCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { games, openGamePlayer, setWalletModalOpen } = useKrsStore();

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 35;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
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

  // Auto advance every 5 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-7xl mx-auto my-2 sm:my-4 select-none touch-pan-y"
    >
      {/* 
        Strict aspect ratio container matching reference screenshot:
        Mobile: aspect-[16/7] (~140px-160px height) - NEVER GIGANTIC, NEVER CUT OFF
        Desktop: sm:aspect-[3/1] (~190px-240px height)
      */}
      <div
        onClick={handleCtaClick}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border-2 ${slide.borderColor} bg-[#040a06] shadow-xl shadow-black/80 transition-all duration-300 w-full aspect-[16/7] sm:aspect-[3/1] max-h-[175px] sm:max-h-[240px] md:max-h-[270px] flex items-center justify-center`}
      >
        {/* Render Type 1: Graphic Banner (Fruit Cash, KRS 777, Blockerino) */}
        {slide.type === "graphic_banner" ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Ambient Blurred Backdrop to avoid any letterboxing */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-110"
              style={{ backgroundImage: `url(${slide.bannerImg})` }}
            />

            {/* Main Widescreen Banner Image fitted properly without cutting off */}
            <img
              src={slide.bannerImg}
              alt={slide.title}
              className="relative z-10 w-full h-full object-cover object-center sm:object-contain transition-transform duration-500 group-hover:scale-102"
              loading="eager"
            />

            {/* Gradient Overlay & Tag */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-4 z-30 flex items-center gap-1.5 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/80 border border-emerald-500/40 text-[9px] sm:text-xs font-pixel text-emerald-400 backdrop-blur-md shadow-md">
                {slide.badge}
              </span>
            </div>

            {/* Floating Floating Action Pill (Bottom Right) */}
            <div className="absolute bottom-2.5 right-2 sm:bottom-3 sm:right-4 z-30 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCtaClick();
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/50 transition transform group-hover:scale-105 active:scale-95"
              >
                <Play className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-dark-950" />
                <span>{slide.ctaText}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render Type 2: Custom Subway Fortuna / PIX Card (Exact replica from reference) */
          <div className="relative w-full h-full flex items-center justify-between px-3 sm:px-8 md:px-12 py-2 overflow-hidden bg-gradient-to-r from-[#082214] via-[#05110a] to-[#040906]">
            {/* Ambient Background Glow */}
            <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-36 h-36 bg-brand-primary/15 rounded-full blur-2xl pointer-events-none" />

            {/* Floating Neo Cubes */}
            <div className="absolute top-3 left-1/4 w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/40 rotate-12 backdrop-blur-sm hidden sm:block animate-pulse" />
            <div className="absolute bottom-4 right-1/4 w-7 h-7 rounded-lg bg-emerald-500/25 border border-emerald-400/50 -rotate-12 backdrop-blur-sm hidden sm:block animate-bounce" style={{ animationDuration: "4s" }} />

            {/* Left: Icon / Character Artwork - Strictly Bound on Mobile */}
            <div className="relative z-10 shrink-0 flex flex-col items-center">
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center p-0.5 shrink-0">
                <img
                  src={slide.bannerImg}
                  alt="KRS Criadores"
                  className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] drop-shadow-[0_0_15px_rgba(0,245,155,0.35)] animate-sophisticated-float shrink-0"
                />
              </div>
              <span className="mt-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[7.5px] sm:text-[9px] font-black text-emerald-300 shadow-sm shrink-0 whitespace-nowrap">
                {slide.floatingTag}
              </span>
            </div>

            {/* Center / Right Content */}
            <div className="relative z-10 flex-1 min-w-0 flex flex-col items-center text-center px-1.5 sm:px-6">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-emerald-500/30 text-[7.5px] sm:text-[10px] font-bold text-emerald-400 mb-0.5 uppercase tracking-wider backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {slide.badge}
              </div>

              <h2 className="text-[11px] sm:text-lg md:text-xl font-black text-white tracking-tight leading-tight uppercase font-sans">
                {slide.title}{" "}
                <span className="text-[#00F59B] block sm:inline font-extrabold">
                  {slide.highlightText}
                </span>
              </h2>

              <p className="text-[10px] sm:text-xs text-zinc-300 max-w-sm mt-0.5 hidden sm:block line-clamp-1">
                {slide.subtitle}
              </p>

              {/* JOGUE JÁ Pill Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCtaClick();
                }}
                className="mt-1 sm:mt-2.5 flex items-center gap-1 px-3.5 sm:px-6 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-[9px] sm:text-xs tracking-wider uppercase shadow-md shadow-emerald-500/30 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-dark-950" />
                <span>{slide.ctaText}</span>
              </button>
            </div>
          </div>
        )}

        {/* Carousel Nav Arrow: Left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Slide anterior"
          className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white hover:text-emerald-400 transition-all backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Nav Arrow: Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Próximo slide"
          className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white hover:text-emerald-400 transition-all backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Pagination Indicators (Active Green Pill + Dots) */}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-auto">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx
                  ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-[#00F59B] shadow-md shadow-emerald-500/80"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
