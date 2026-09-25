import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout() {
  return (
    <div className="orders-inspired-shell flex min-h-dvh w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-slate-900">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className="min-h-dvh w-full p-3 pt-16 sm:p-4 md:p-5 md:pt-5"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="maintenance-workspace mx-auto min-h-[calc(100dvh-2.5rem)] w-full max-w-[1500px] rounded-2xl border border-white/30 bg-white p-3 shadow-xl shadow-blue-950/10 sm:p-4 md:p-5 dark:border-slate-800 dark:bg-slate-950">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
