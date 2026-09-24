"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Sparkles,
  Users,
  Instagram,
  Youtube,
  Share2,
  Trophy,
  Award,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

const NICHES_LIST = [
  "Gaming",
  "Lifestyle",
  "Humor & Memes",
  "Música & Trap",
  "Funk",
  "Moda & Estilo",
  "Tecnologia",
  "Entretenimento",
  "Esportes",
  "Vlogs Diários",
];

const CAMPAIGN_PREFS = [
  "Torneios de Habilidade",
  "Desafios com a Audiência",
  "Reels & TikToks Dinâmicos",
  "Sequência de Stories",
  "Gameplay sem Rosto",
  "Lives & Streaming",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, updateCurrentUser, awardXP } = useKrsStore();

  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser?.name || "Lucas Alencar");
  const [whatsapp, setWhatsapp] = useState("+55 (11) 98765-4321");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [avatar, setAvatar] = useState(currentUser?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80");

  const [partnerType, setPartnerType] = useState<"INFLUENCER" | "CAPTADOR">(currentUser?.role === "CAPTADOR" ? "CAPTADOR" : "INFLUENCER");
  const [selectedSocials, setSelectedSocials] = useState<string[]>(["Instagram", "TikTok"]);
  
  // Social metrics
  const [primaryUsername, setPrimaryUsername] = useState("lucas_gaming");
  const [profileUrl, setProfileUrl] = useState("https://instagram.com/lucas_gaming");
  const [followers, setFollowers] = useState("120.000");
  const [avgViews, setAvgViews] = useState("45.000");
  const [engagementRate, setEngagementRate] = useState("7.2%");

  // Niches & preferences
  const [selectedNiches, setSelectedNiches] = useState<string[]>(["Gaming", "Humor & Memes"]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(["Torneios de Habilidade", "Sequência de Stories"]);

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const togglePref = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const toggleSocial = (social: string) => {
    setSelectedSocials((prev) =>
      prev.includes(social) ? prev.filter((s) => s !== social) : [...prev, social]
    );
  };

  const handleFinish = () => {
    setCompleted(true);
    // Trigger confetti
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00F59B", "#00F0FF", "#F59E0B"],
      });
    } catch (e) {
      console.log(e);
    }

    // Update store
    updateCurrentUser({
      name,
      phone: whatsapp,
      city,
      state,
      avatar_url: avatar,
      role: partnerType,
      onboarding_completed: true,
    });

    awardXP(50, "Completou o onboarding com sucesso");

    // Redirect after brief celebration
    setTimeout(() => {
      if (partnerType === "CAPTADOR") {
        router.push("/captador");
      } else {
        router.push("/dashboard");
      }
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand-primary text-dark-950 font-black flex items-center justify-center text-xs">
            KRS
          </div>
          <span className="font-bold text-sm text-white">Bora Configurar Seu Acesso</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <span>Etapa {step} de 6</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto w-full mt-4 h-1.5 bg-dark-850 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-neon transition-all duration-300"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      {/* Main Content Box */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="rounded-3xl border border-white/10 bg-dark-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          {/* ================================================================= */}
          {/* ETAPA 1: DADOS PESSOAIS & WHATSAPP                                */}
          {/* ================================================================= */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Etapa 01
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Bora se apresentar! Quem é você?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Seus dados pra gente manter contato no WhatsApp e te mandar campanhas quentes.
                </p>
              </div>

              {/* Avatar upload placeholder */}
              <div className="flex items-center gap-4 pt-2">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-dark-800 border border-white/10">
                  <img src={avatar} alt={name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Foto do Perfil</div>
                  <div className="text-[11px] text-zinc-400">Recomendado formato quadrado (PNG ou JPG)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nome Completo ou Artístico
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    WhatsApp com DDD
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+55 (11) 98765-4321"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 2: TIPO DE PARCEIRO                                         */}
          {/* ================================================================= */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Etapa 02
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Qual é a sua praia por aqui?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Conta pra gente como você quer atuar no KRS Creator Hub.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setPartnerType("INFLUENCER")}
                  className={`p-6 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    partnerType === "INFLUENCER"
                      ? "bg-brand-primary/10 border-brand-primary shadow-xl shadow-brand-primary/10"
                      : "bg-dark-850 border-white/5 hover:bg-dark-800"
                  }`}
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Creator / Streamer / Influencer
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Crio vídeos, faço lives ou posto Stories/Reels e quero faturar divulgando os games mais viciantes.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-primary">
                    {partnerType === "INFLUENCER" && <CheckCircle2 className="w-4 h-4" />}
                    <span>Selecionado</span>
                  </div>
                </div>

                <div
                  onClick={() => setPartnerType("CAPTADOR")}
                  className={`p-6 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    partnerType === "CAPTADOR"
                      ? "bg-brand-neon/10 border-brand-neon shadow-xl shadow-brand-neon/10"
                      : "bg-dark-850 border-white/5 hover:bg-dark-800"
                  }`}
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-brand-neon/20 text-brand-neon flex items-center justify-center mb-4">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Captador / Líder de Comunidade
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Conheço uma galera de creators, quero montar meu time, botar a tropa pra rodar e lucrar com cada indicação.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-neon">
                    {partnerType === "CAPTADOR" && <CheckCircle2 className="w-4 h-4" />}
                    <span>Selecionado</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 3: REDES SOCIAIS                                            */}
          {/* ================================================================= */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Etapa 03
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Onde sua galera tá te assistindo?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Marca as redes onde seu público mais curte seu conteúdo.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { name: "Instagram", icon: Instagram },
                  { name: "TikTok", icon: Share2 },
                  { name: "YouTube", icon: Youtube },
                  { name: "Facebook", icon: Share2 },
                  { name: "Telegram", icon: Share2 },
                  { name: "Outros", icon: Share2 },
                ].map(({ name: sName, icon: SIcon }) => {
                  const isSelected = selectedSocials.includes(sName);
                  return (
                    <button
                      key={sName}
                      type="button"
                      onClick={() => toggleSocial(sName)}
                      className={`p-4 rounded-xl border text-left flex items-center gap-3 transition ${
                        isSelected
                          ? "bg-brand-primary/10 border-brand-primary text-white"
                          : "bg-dark-850 border-white/5 text-zinc-400 hover:bg-dark-800"
                      }`}
                    >
                      <SIcon className={`w-5 h-5 ${isSelected ? "text-brand-primary" : "text-zinc-500"}`} />
                      <span className="text-xs font-bold">{sName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 4: MÉTRICAS DO PERFIL                                       */}
          {/* ================================================================= */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Etapa 04
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Solta os números da sua rede principal
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Não precisa ter milhões de seguidores — games de habilidade valorizam comunidade engajada de verdade!
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Username / @
                    </label>
                    <input
                      type="text"
                      value={primaryUsername}
                      onChange={(e) => setPrimaryUsername(e.target.value)}
                      placeholder="@seunome"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      URL do Perfil
                    </label>
                    <input
                      type="text"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Seguidores
                    </label>
                    <input
                      type="text"
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      placeholder="Ex: 50.000"
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Views Médias / Story
                    </label>
                    <input
                      type="text"
                      value={avgViews}
                      onChange={(e) => setAvgViews(e.target.value)}
                      placeholder="Ex: 15.000"
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Engajamento Médio
                    </label>
                    <input
                      type="text"
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(e.target.value)}
                      placeholder="Ex: 5%"
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 5: NICHOS                                                   */}
          {/* ================================================================= */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Etapa 05
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Qual é a vibe do seu conteúdo?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Marca os temas que mais combinam com você e seu público.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {NICHES_LIST.map((niche) => {
                  const isSelected = selectedNiches.includes(niche);
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => toggleNiche(niche)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? "bg-brand-primary text-dark-950 shadow-md shadow-brand-primary/20"
                          : "bg-dark-850 border border-white/10 text-zinc-300 hover:bg-dark-800"
                      }`}
                    >
                      {niche}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 6: PREFERÊNCIAS DE CAMPANHA & CONCLUSÃO                     */}
          {/* ================================================================= */}
          {step === 6 && !completed && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Etapa 06
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Como você mais curte criar?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Escolhe o jeito que você mais se diverte gravando.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {CAMPAIGN_PREFS.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePref(pref)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? "bg-brand-primary/10 border-brand-primary text-white"
                          : "bg-dark-850 border-white/5 text-zinc-400 hover:bg-dark-800"
                      }`}
                    >
                      <span>{pref}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Celebration Screen */}
          {completed && (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-90 duration-300">
              <div className="h-20 w-20 rounded-2xl bg-brand-primary/20 text-brand-primary border border-brand-primary/40 flex items-center justify-center mx-auto shadow-2xl shadow-brand-primary/30 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+50 XP Conquistados!</span>
              </div>

              <h3 className="text-2xl font-black text-white">
                Tá no ar, {name}! Bem-vindo ao time!
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Seu perfil tá tinindo! Partiu começar a jornada e desbloquear as primeiras recompensas...
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          {!completed && (
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-zinc-300 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-dark-950 text-xs font-bold hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-dark-950 text-xs font-bold hover:bg-brand-primaryHover transition shadow-xl shadow-brand-primary/25"
                >
                  <span>Partiu pro Hub! (+50 XP)</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-zinc-500">
        KRS Creator Hub • Onboarding Seguro & Criptografado
      </div>
    </div>
  );
}
