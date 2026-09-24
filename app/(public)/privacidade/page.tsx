"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-brand-primary selection:text-dark-950">
      <LandingNavbar />

      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Página Inicial</span>
        </Link>

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <Lock className="w-4 h-4" />
            LGPD & Segurança
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Política de Privacidade</h1>
          <p className="text-xs text-zinc-400 mt-1">Conformidade estrita com a Lei Federal nº 13.709/2018 (LGPD)</p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">1. Coleta e Finalidade dos Dados</h3>
            <p>
              Coletamos dados estritamente necessários para a operacionalização das campanhas e verificação dos criadores de conteúdo (nome, WhatsApp, redes sociais, métricas públicas de audiência e comprovantes de entrega de conteúdo).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">2. Segurança e Armazenamento</h3>
            <p>
              Todas as informações são transmitidas sob criptografia de ponta a ponta (TLS 1.3) e armazenadas em bancos de dados protegidos com Row Level Security (RLS), garantindo que apenas administradores autorizados e o próprio criador tenham acesso a seus dados privados.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">3. Direitos do Titular de Dados</h3>
            <p>
              O parceiro pode, a qualquer momento diretamente na aba <strong className="text-white">&quot;Meu Perfil&quot;</strong>, solicitar o download integral de suas informações em formato JSON legível por máquina ou requerer a exclusão e revogação do consentimento cadastral.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">4. Encarregado de Proteção de Dados (DPO)</h3>
            <p>
              Dúvidas adicionais sobre o tratamento dos seus dados podem ser encaminhadas diretamente ao nosso canal de privacidade: <strong className="text-brand-primary">privacidade@krscreatorhub.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
