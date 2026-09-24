"use client";

import React from "react";
import { CreatorSidebar } from "@/components/navigation/CreatorSidebar";
import { CreatorHeader } from "@/components/navigation/CreatorHeader";
import { CreatorMobileNav } from "@/components/navigation/CreatorMobileNav";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 flex text-zinc-100 selection:bg-brand-primary selection:text-dark-950">
      {/* Desktop Left Sidebar */}
      <CreatorSidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        <CreatorHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <CreatorMobileNav />
    </div>
  );
}
