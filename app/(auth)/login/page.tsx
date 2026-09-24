"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, ArrowRight, ShieldCheck, Sparkles, Users, Lock, Mail } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useKrsStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      const isAdm = email.toLowerCase().includes("admin");
      const isCapt = email.toLowerCase().includes("captador");
      const role = isAdm ? "ADMIN" : isCapt ? "CAPTADOR" : "INFLUENCER";

      loginUser(email, role);

      if (isAdm) {
        router.push("/admin");
      } else if (isCapt) {
        router.push("/captador");
      } else {
        router.push("/afiliados");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 sm:mb-6 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-dark-950 font-black shadow-lg shadow-brand-primary/20">
            <Gamepad2 className="w-6 h-6 text-dark-950" />
          </div>
          <span className="text-xl font-black text-white">
            KRS <span className="text-brand-primary">CREATOR</span> HUB
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Acesse sua conta
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Gerencie suas campanhas, entregas e conquistas.
        </p>
      </div>

      <div className="mt-5 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-1 sm:px-4">
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 md:backdrop-blur-xl p-4 sm:p-8 shadow-2xl">
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
