
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import ThemeToggle from '@/components/layout/ThemeToggle';
import LanguageToggle from '@/components/layout/LanguageToggle';
import BrandHeader from '@/components/layout/BrandHeader';

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100/80 text-foreground font-sans dark:bg-slate-950">
      <Sidebar />
      <div className="hidden lg:flex fixed top-4 right-6 z-50 items-center gap-2">
        <LanguageToggle className="shadow-md bg-background/80 backdrop-blur-md border border-border/70" />
        <ThemeToggle className="shadow-md bg-background/80 backdrop-blur-md border border-border/70" />
      </div>
      <main className="app-main-scroll flex-1 overflow-y-auto w-full px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[1440px] space-y-7 text-[15px] sm:text-base lg:text-[17px]">
          <BrandHeader />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
