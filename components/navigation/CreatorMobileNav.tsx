"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Gamepad2, Trophy, User, Zap } from "lucide-react";

const MOBILE_TABS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Afiliado", href: "/afiliados", icon: Zap },
  { label: "Campanhas", href: "/campanhas", icon: Layers },
  { label: "Jogos", href: "/jogos", icon: Gamepad2 },
  { label: "Perfil", href: "/perfil", icon: User },
];

export function CreatorMobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-500/20 bg-[#09100b] md:bg-dark-950/95 md:backdrop-blur-xl px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] shadow-2xl shadow-black">
      <nav className="flex items-center justify-around">
        {MOBILE_TABS.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition ${
                isActive
                  ? "text-brand-primary"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary stroke-[2.2]" : "text-zinc-500"}`} />
              <span className={`text-[10px] mt-1 font-semibold ${isActive ? "text-brand-primary" : "text-zinc-400"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
