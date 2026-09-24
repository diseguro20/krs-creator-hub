"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, ArrowRight, ShieldCheck, Sparkles, Users, Lock, Mail } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function LoginPage() {
  const router = useRouter();
  const { switchUserRole } = useKrsStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If matches admin or demo, route appropriately
    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes("admin")) {
        switchUserRole("ADMIN");
        router.push("/admin");
      } else if (email.toLowerCase().includes("captador")) {
        switchUserRole("CAPTADOR");
        router.push("/captador");
      } else {
        switchUserRole("INFLUENCER");
        router.push("/dashboard");
      }
    }, 600);
  };

  const handleQuickLogin = (role: "ADMIN" | "INFLUENCER" | "CAPTADOR") => {
    switchUserRole(role);
    if (role === "ADMIN") router.push("/admin");
    else if (role === "CAPTADOR") router.push("/captador");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 blur-[130px] rounded-full pointer-events-none" />

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
          Acesse sua conta
        </h2>
        <p className="mt-1.5 text-xs text-zinc-400">
          Gerencie suas campanhas, entregas e conquistas.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Senha
                </label>
                <Link
                  href="/esqueci-senha"
                  className="text-xs text-brand-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-primary text-dark-950 font-bold text-sm hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>Entrar no Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="text-center mb-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                Acesso Rápido de Avaliação:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("INFLUENCER")}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-brand-primary/30 text-center transition group"
              >
                <Sparkles className="w-4 h-4 text-brand-primary mx-auto mb-1 group-hover:scale-110 transition" />
                <div className="text-[11px] font-bold text-white">Influencer</div>
                <div className="text-[9px] text-zinc-400">Creator Elite</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("CAPTADOR")}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-brand-neon/30 text-center transition group"
              >
                <Users className="w-4 h-4 text-brand-neon mx-auto mb-1 group-hover:scale-110 transition" />
                <div className="text-[11px] font-bold text-white">Captador</div>
                <div className="text-[9px] text-zinc-400">Marcos (Ref)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("ADMIN")}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-amber-500/30 text-center transition group"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition" />
                <div className="text-[11px] font-bold text-white">Admin</div>
                <div className="text-[9px] text-zinc-400">KRS Master</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-bold text-brand-primary hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
