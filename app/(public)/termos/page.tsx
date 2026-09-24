"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function TermsPage() {
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
            <ShieldCheck className="w-4 h-4" />
            Contrato & Condutas
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Termos de Parceria</h1>
          <p className="text-xs text-zinc-400 mt-1">Última atualização: Setembro de 2026 • Versão 1.0.0</p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">1. Objeto e Natureza da Parceria</h3>
            <p>
              O KRS Creator Hub conecta influenciadores digitais, criadores de conteúdo e captadores a campanhas oficiais de divulgação de jogos eletrônicos fundamentados estritamente na habilidade motora, reflexo e estratégia dos competidores.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">2. Diretrizes Éticas e Transparência</h3>
            <p>
              É expressamente vedada a fabricação de comprovantes bancários inverídicos, notificações de saque simuladas apresentadas como verdadeiras ou qualquer promessa de rendimento financeiro fácil. O foco da comunicação deve ser sempre a diversão, competitividade e mérito dos jogadores.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">3. Fluxo de Entregas e Aprovação</h3>
            <p>
              Os materiais submetidos pelos parceiros através do painel serão auditados em até 24 horas úteis. A aprovação confere a pontuação de XP correspondente à missão. Caso necessárias correções, o criador deverá realizar os ajustes indicados no feedback da moderação.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white">4. Propriedade Intelectual</h3>
            <p>
              As marcas, logos e assets disponibilizados na Central de Criativos são de uso exclusivo e restrito para as campanhas autorizadas no ecossistema KRS.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
