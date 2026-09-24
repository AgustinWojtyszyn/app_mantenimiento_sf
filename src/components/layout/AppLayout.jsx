
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import ThemeToggle from '@/components/layout/ThemeToggle';
import LanguageToggle from '@/components/layout/LanguageToggle';
import BrandHeader from '@/components/layout/BrandHeader';

export default function AppLayout() {
  const isDashboard = useLocation().pathname.replace(/\/$/, '') === '/app/trabajos-diarios';
  return (
    <div className={isDashboard ? "dashboard-layout flex min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground font-sans" : "flex h-screen bg-background text-foreground overflow-hidden font-sans"}>
      <Sidebar />
      <div className="hidden lg:flex fixed top-4 right-6 z-50 items-center gap-2">
        <LanguageToggle className="shadow-md bg-background/80 backdrop-blur-md border border-border/70" />
        <ThemeToggle className="shadow-md bg-background/80 backdrop-blur-md border border-border/70" />
      </div>
      <main className={isDashboard ? "min-w-0 flex-1 w-full p-4 lg:p-8 pt-16 sm:pt-20" : "flex-1 overflow-y-auto w-full p-4 lg:p-8 pt-16 sm:pt-20 lg:pt-10"}>
        <div className={isDashboard ? "w-full min-w-0 mx-auto text-base" : "max-w-7xl mx-auto space-y-6 text-[15px] sm:text-base lg:text-lg"}>
          {!isDashboard && <BrandHeader />}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
