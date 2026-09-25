import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout() {
  return (
    <div className="orders-inspired-shell flex min-h-dvh w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-slate-900">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className="min-h-dvh w-full p-4 pt-16 md:p-8 md:pt-8"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
