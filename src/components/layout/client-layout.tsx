"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { YearSelector } from "./year-selector";
import { Menu } from "lucide-react";

interface ClientLayoutProps {
  children: React.ReactNode;
  years: Array<{ id: number; name: string; isActive: boolean }>;
  activeYearId: number | null;
}

export function ClientLayout({ children, years, activeYearId }: ClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Area */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-base md:text-xl font-semibold text-slate-800">
              Gachihata Palli Academy
            </h1>
          </div>
          <YearSelector years={years} activeYearId={activeYearId} />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
