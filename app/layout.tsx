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
  metadataBase: new URL("https://krs-creator-hub.vercel.app"),
  title: "KRS CREATOR HUB - A Plataforma Oficial de Jogos & Criadores",
  description: "Monetize sua audiência com os 4 jogos oficiais da KRS. Comissões em tempo real, saques instantâneos via PIX, campanhas exclusivas e Creator Pass.",
  keywords: [
    "creator hub",
    "krs creator hub",
    "influencers",
    "jogos de habilidade",
    "fruit cash",
    "blockerino",
    "bubble cash",
    "krs 777",
    "saques pix",
    "afiliados",
    "comissoes pix"
  ],
  authors: [{ name: "KRS Creator Hub" }],
  creator: "KRS Creator Hub",
  publisher: "KRS Creator Hub",
  openGraph: {
    title: "KRS CREATOR HUB - A Plataforma Oficial de Jogos & Criadores",
    description: "Monetize sua audiência com os 4 jogos oficiais da KRS. Comissões em tempo real, saques instantâneos via PIX, campanhas exclusivas e Creator Pass.",
    url: "https://krs-creator-hub.vercel.app",
    siteName: "KRS CREATOR HUB",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KRS CREATOR HUB - Plataforma Oficial de Jogos & Criadores",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KRS CREATOR HUB - A Plataforma Oficial de Jogos & Criadores",
    description: "Monetize sua audiência com os 4 jogos oficiais da KRS. Comissões em tempo real e saques instantâneos via PIX.",
    images: ["/og-image.jpg"],
    creator: "@krscreatorhub",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/og-image.jpg",
  },
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
