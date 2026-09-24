# KRS CREATOR HUB 🚀

> Plataforma web premium, profissional, escalável e gamificada para gerenciamento de parcerias com **influencers**, **creators** e **captadores** de jogos por habilidade.

---

## 🎮 Visão Geral do Produto

O **KRS CREATOR HUB** foi construído com visual dark sofisticado (`#070707`, `#0C0C0C`, `#121212`, `#181818`), toques refinados de neon esmeralda (`#00F59B`), ciano e âmbar, microinterações fluídas, experiência app-like no mobile (com bottom navigation nativa) e esteiras dinâmicas de moderação.

### Principais Pilares:
1. **Campaign Engine Dinâmica**: Administradores criam campanhas e sequenciadores de etapas/missões pelo painel sem alterar código. A interface do criador monta a jornada automaticamente.
2. **Sistema de Gamificação Completo**: XP administrável por ação, níveis e patentes configuráveis, galeria de badges por raridade, streaks semanais de consistência e **Creator Pass** sazonal com trilhas de recompensas.
3. **Uploader & Fila de Moderação**: Upload profissional com drag-and-drop, preview de mídia, links de postagem e moderação administrativa com fluxo de Aprovação (+XP), Recusa ou Solicitação de Ajustes com feedback obrigatório.
4. **Programa de Captadores & Referral**: Links de indicação (`/cadastro?ref=CODE`), QR Code instantâneo, funil visual de conversão (Convites -> Cadastros -> Ativos -> Concluíram Campanha) e comissões automáticas em XP.
5. **Central de Criativos & Roteiros**: Roteiros de Stories e Reels validados para copiar em 1 clique, logos transparentes e banners promocionais.
6. **Ferramenta de Mockup / Wallpaper**: Teste demonstrativo de layouts em smartphone com selo visual obrigatório e permanente de **"SIMULAÇÃO / DEMO"**, em conformidade com as diretrizes de transparência.
7. **Privacidade & LGPD**: Exportação completa de dados em JSON e solicitação de exclusão cadastral.

---

## 🛠️ Stack Tecnológica

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, React 19, TypeScript strict)
- **Estilização & Design System**: Tailwind CSS, CSS Variables, paleta escura própria
- **Animações & Canvas**: HTML5 Canvas interativo com física de bolhas no Hero, Canvas Confetti para celebrações de Level Up e Badges
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Banco de Dados & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage, Realtime)
- **Estado Reativo**: React Context API com sincronização local inteligente e Dual-Mode (produção com Supabase + engine reativo local para testes imediatos sem dependências)

---

## ⚡ Primeiro Acesso & Modo de Demonstração (Zero Setup)

A plataforma conta com um **Demo Switcher Flutuante** no canto inferior direito que permite alternar instantaneamente entre os 3 perfis principais:

| Papel | Nome de Demonstração | Permissões & Acesso |
|---|---|---|
| **Influencer / Creator** | Lucas Alencar (`@lucas_gaming`) | Dashboard do criador, envio de missões, catálogo de jogos, Creator Pass, conquistas e ranking. |
| **Captador** | Marcos Vinicius (`@marcos_captador`) | Painel do captador, link de referral `MARCOS10`, QR Code e funil de captação. |
| **Administrador** | KRS Operations Master | Painel geral de métricas, aprovação de entregas, Campaign Builder, gestão de jogos, regras de XP e logs. |

---

## 📦 Instalação & Execução Local

### 1. Pré-requisitos
- Node.js versão 18+ ou superior
- Gerenciador de pacotes npm, pnpm ou yarn

### 2. Clonar e Instalar Dependências
```bash
git clone https://github.com/krs-gaming/krs-creator-hub.git
cd "KRS CREATOR HUB"
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Conteúdo padrão do `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_DEMO_MODE=true

# Opcional caso utilize Supabase em produção:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 5. Compilar para Produção (Build)
```bash
npm run build
npm run start
```

---

## 🗄️ Configuração do Banco de Dados no Supabase (Produção)

Para conectar o projeto ao seu banco de dados Supabase:

1. Crie um novo projeto no [painel do Supabase](https://app.supabase.com/).
2. Acesse a aba **SQL Editor**.
3. Copie e cole todo o conteúdo do arquivo de migração:
   `supabase/migrations/20260916000000_krs_creator_hub_schema.sql`
4. Clique em **Run** para criar todas as tabelas, triggers e políticas de segurança (Row Level Security).
5. No painel do Supabase em **Settings > API**, copie a **Project URL** e a **anon public key** para o seu arquivo `.env.local`.

---

## 🚀 Deploy na Vercel

O projeto está 100% pronto para deploy na **Vercel**:

1. Faça push do repositório para o GitHub / GitLab.
2. Acesse [vercel.com](https://vercel.com/) e clique em **Add New Project**.
3. Importe o repositório.
4. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_ENABLE_DEMO_MODE=true` (para manter a demonstração interativa no ar)
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (se já possuir banco Supabase)
5. Clique em **Deploy**.

---

## 🛡️ Diretrizes Éticas e de Conteúdo

O **KRS CREATOR HUB** adota uma política rigorosa de respeito ao usuário e integridade comercial:
- ✅ Foco em **jogos por habilidade pura** onde a vitória depende exclusivamente do reflexo e precisão do jogador.
- 🚫 Proibição absoluta de comprovantes bancários forjados, simulações de depósitos ou notificações fraudulentas.
- ⚠️ Qualquer tela gerada para treinamento ou mockup possui a inscrição obrigatória de **"SIMULAÇÃO / DEMONSTRAÇÃO"**.

---

## 📄 Licença

Propriedade exclusiva do ecossistema KRS Gaming. Todos os direitos reservados.
