import type { Metadata, Viewport } from "next";
import "./globals.css";
import { KrsStoreProvider } from "@/lib/store/useKrsStore";
import { LevelUpCelebrationModal } from "@/components/gamification/LevelUpCelebrationModal";
import { InAppGameModal } from "@/components/gaming/InAppGameModal";
import { WalletModal } from "@/components/gaming/WalletModal";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070c09",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "KRS CREATOR HUB - Gestão & Gamificação de Influencers e Captadores",
  description: "A plataforma definitiva para influenciadores, creators e captadores de jogos por habilidade. Campanhas sequenciais, Creator Pass, missões e aprovação profissional.",
  keywords: ["creator hub", "influencers", "jogos de habilidade", "campanhas de jogos", "krs", "creator pass"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-dark-950 text-zinc-100 min-h-screen antialiased selection:bg-brand-primary selection:text-dark-950">
        <KrsStoreProvider>
          {children}
          <LevelUpCelebrationModal />
          <InAppGameModal />
          <WalletModal />
        </KrsStoreProvider>
      </body>
    </html>
  );
}
