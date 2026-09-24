"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ArrowLeft,
  MessageCircle,
  Play,
  UploadCloud,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { useKrsStore } from "@/lib/store/useKrsStore";

const FAQS = [
  {
    q: "Como começar minha primeira campanha?",
    a: "Após cadastrar seu perfil e concluir o onboarding, acesse a aba 'Campanhas' no seu painel. Selecione o jogo desejado e clique em 'Começar Campanha'. Você terá acesso à sequência de missões passo a passo.",
  },
  {
    q: "Como enviar os comprovantes das missões?",
    a: "Na página da campanha em andamento, selecione a etapa atual e utilize o uploader profissional para enviar o arquivo de vídeo do gameplay ou insira o link direto do Story / Reel publicado. Em seguida, clique em 'Submeter para Análise'.",
  },
  {
    q: "O que acontece se o moderador solicitar alteração?",
    a: "Você receberá uma notificação com o feedback detalhado do que ajustar (por exemplo: 'mostrar o gameplay por pelo menos 5 segundos'). Basta gravar o trecho solicitado e reenviar o arquivo na mesma página.",
  },
  {
    q: "Como funciona o Creator Pass e os Níveis?",
    a: "A cada missão aprovada você conquista pontos de XP. Esses pontos contam tanto para o seu nível permanente de parceiro (que desbloqueia benefícios como multiplicadores e suporte VIP) quanto para a trilha sazonal de prêmios do Creator Pass.",
  },
  {
    q: "Como os captadores são comissionados?",
    a: "Os captadores recebem um link e código exclusivo (ex: site.com/cadastro?ref=SEUCODIGO). A cada criador cadastrado por você que participa ativamente de campanhas, pontos de XP e bonificações são creditados em seu saldo.",
  },
];

export default function HelpCenterPage() {
  const { settings } = useKrsStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-brand-primary selection:text-dark-950">
      <LandingNavbar />

      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Página Inicial</span>
        </Link>

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <HelpCircle className="w-4 h-4" />
            Suporte & Tutoriais
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Central de Ajuda</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Orientações práticas para gravar, publicar e gerenciar suas campanhas de jogos por habilidade.
          </p>
        </div>

        {/* Quick Tutorial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-dark-900 border border-white/5 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
              <Play className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Como Gravar Gameplays</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Capture a tela do smartphone na vertical sem tapar os placares de torneio e mantenha áudio limpo.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-white/5 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-brand-neon/10 text-brand-neon flex items-center justify-center mb-3">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Como Enviar Materiais</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Arraste seu arquivo MP4 ou envie o link da postagem no painel da campanha e aguarde análise.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-white/5 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Como Pontuar XP</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Entregas no prazo e sequências de semanas ativas garantem bônus especiais no Creator Pass.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">Dúvidas Frequentes (FAQ)</h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="rounded-2xl bg-dark-850 border border-white/5 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-brand-primary transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Support CTA */}
        <div className="rounded-3xl border border-brand-primary/30 bg-gradient-to-r from-dark-900 to-dark-850 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-brand-primary/5">
          <div className="space-y-1">
            <div className="text-xs font-bold text-brand-primary uppercase">Precisa de Ajuda Humana?</div>
            <h3 className="text-xl font-black text-white">Fale com o Time de Parcerias KRS</h3>
            <p className="text-xs text-zinc-400">Atendimento oficial para criadores de conteúdo e captadores.</p>
          </div>

          <a
            href={`https://api.whatsapp.com/send?phone=${settings.support_whatsapp.replace(/\D/g, "")}&text=${encodeURIComponent("Olá! Sou parceiro do KRS Creator Hub e preciso de suporte com uma campanha.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>
      </main>
    </div>
  );
}
