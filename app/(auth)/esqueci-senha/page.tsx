"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gamepad2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Recuperar sua senha
        </h2>
        <p className="mt-1.5 text-xs text-zinc-400">
          Enviaremos um link de redefinição para o seu e-mail cadastrado.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-white/10 bg-dark-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <div className="h-12 w-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">E-mail Enviado!</h3>
              <p className="text-xs text-zinc-400">
                Se houver uma conta associada a <span className="text-white">{email}</span>, você receberá instruções de acesso em instantes.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-xs font-bold text-brand-primary hover:underline"
              >
                Retornar à tela de login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Seu E-mail
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-primary text-dark-950 font-bold text-sm hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20"
              >
                Enviar Link de Redefinição
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
