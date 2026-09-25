import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import LanguageToggle from '@/components/layout/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function AppLayout() {
  return (
    <div className="orders-inspired-shell relative flex min-h-dvh w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-slate-900">
      <Sidebar />

      <div className="fixed right-3 top-3 z-[55] flex items-center gap-2 md:right-4 md:top-4">
        <LanguageToggle className="h-9 border-white/30 bg-white/95 px-3 text-xs font-bold text-slate-700 shadow-md backdrop-blur hover:bg-white hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800" />
        <ThemeToggle className="h-9 w-9 border-white/30 bg-white/95 text-slate-700 shadow-md backdrop-blur hover:bg-white hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800" />
      </div>

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className="min-h-dvh w-full p-3 pt-16 sm:p-4 sm:pt-16 md:p-5 md:pt-16"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="maintenance-workspace mx-auto min-h-[calc(100dvh-5rem)] w-full max-w-[1500px] rounded-2xl border border-white/30 bg-white p-3 shadow-xl shadow-blue-950/10 sm:p-4 md:p-5 dark:border-slate-800 dark:bg-slate-950">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
