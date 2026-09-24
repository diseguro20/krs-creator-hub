"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Trophy, User, Zap } from "lucide-react";

interface MobileTabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MOBILE_TABS: MobileTabItem[] = [
  { label: "Jogos", href: "/", icon: Gamepad2 },
  { label: "Ranking", href: "/ranking", icon: Trophy },
  { label: "Afiliado", href: "/afiliados", icon: Zap, badge: "PIX" },
  { label: "Perfil", href: "/perfil", icon: User },
];

export function CreatorMobileNav() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegação Principal Mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-500/25 bg-[#060c08]/95 backdrop-blur-xl px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(0,0,0,0.8)]"
    >
      <nav className="max-w-md mx-auto flex items-center justify-around">
        {MOBILE_TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" || pathname === "/jogos"
              : pathname === tab.href || pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 px-2.5 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-emerald-500/15 text-[#00F59B]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-dark-950 font-black text-[8px]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-bold tracking-tight transition-colors ${
                  isActive ? "text-[#00F59B]" : "text-zinc-400"
                }`}
              >
                {tab.label}
              </span>

              {/* Active Tab Glow Pill */}
              {isActive && (
                <span className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-[#00F59B] shadow-[0_0_8px_#00F59B]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
