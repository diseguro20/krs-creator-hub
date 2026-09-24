"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, ArrowRight, ShieldCheck, User, Mail, Lock, Sparkles, Users } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser } = useKrsStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"INFLUENCER" | "CAPTADOR">("INFLUENCER");
  const [affiliateTag, setAffiliateTag] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    // Registra conta real do usuário com sua tag exclusiva
    registerUser({
      name,
      email,
      password,
      role,
      affiliate_code: affiliateTag || referralCode || name.toLowerCase().replace(/\s+/g, ""),
    });

    // Direciona imediatamente para o painel de afiliados
    router.push("/afiliados");
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-dark-950 font-black shadow-lg shadow-brand-primary/20">
            <Gamepad2 className="w-6 h-6 text-dark-950" />
          </div>
          <span className="text-xl font-black text-white">
            KRS <span className="text-brand-primary">CREATOR</span> HUB
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Crie seu perfil de parceiro
        </h2>
        <p className="mt-1.5 text-xs text-zinc-400">
          Acesso imediato ao catálogo de campanhas e ao Creator Pass.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Como você deseja atuar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("INFLUENCER")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    role === "INFLUENCER"
                      ? "bg-brand-primary/15 border-brand-primary text-brand-primary"
                      : "bg-dark-850 border-white/5 text-zinc-400 hover:bg-dark-800"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold">Influencer / Creator</span>
                  <span className="text-[10px] opacity-75">Quero divulgar jogos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("CAPTADOR")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    role === "CAPTADOR"
                      ? "bg-brand-neon/15 border-brand-neon text-brand-neon"
                      : "bg-dark-850 border-white/5 text-zinc-400 hover:bg-dark-800"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold">Captador de Talentos</span>
                  <span className="text-[10px] opacity-75">Quero indicar creators</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou nome artístico"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@seucanal.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Senha Segura
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Sua Tag de Afiliado (Link dos Jogos)</span>
                <span className="text-[10px] text-brand-primary font-mono font-bold">SEU LINK EXCLUSIVO</span>
              </label>
              <input
                type="text"
                required
                value={affiliateTag}
                onChange={(e) => setAffiliateTag(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="Ex: seu_canal ou seu_nome"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-emerald-400 font-mono placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition lowercase"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Seus links de jogos serão gerados com essa tag (ex: <code>?ref={affiliateTag || "suatag"}</code>).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Código de Indicação de Amigo (Opcional)
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Ex: MARCOS10"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-brand-primary font-mono placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition uppercase"
              />
              {referralCode && (
                <p className="mt-1 text-[11px] text-brand-primary flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Código de indicação aplicado!
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded bg-dark-800 border-white/10 text-brand-primary focus:ring-0"
              />
              <label htmlFor="terms" className="text-[11px] text-zinc-400 leading-tight">
                Concordo com os <Link href="/termos" className="text-zinc-200 underline">Termos de Parceria</Link> e com as diretrizes de conteúdo ético da KRS.
              </label>
            </div>

            <button
              type="submit"
              disabled={!termsAccepted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-dark-950 font-black text-sm transition shadow-lg shadow-brand-primary/20 disabled:opacity-50 cursor-pointer"
            >
              <span>Criar Minha Conta & Acessar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Já possui cadastro?{" "}
            <Link href="/login" className="font-bold text-brand-primary hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950 flex items-center justify-center text-zinc-500 text-xs">Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
