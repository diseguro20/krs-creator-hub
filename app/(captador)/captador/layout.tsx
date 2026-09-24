"use client";

import React from "react";
import { CaptadorSidebar } from "@/components/navigation/CaptadorSidebar";
import { CreatorHeader } from "@/components/navigation/CreatorHeader";

export default function CaptadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 flex text-zinc-100 selection:bg-brand-neon selection:text-dark-950">
      <CaptadorSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-10">
        <CreatorHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>
    </div>
  );
}
