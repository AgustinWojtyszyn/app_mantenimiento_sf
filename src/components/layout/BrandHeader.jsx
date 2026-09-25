import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function BrandHeader() {
  return (
    <header className="w-full">
      <Link
        to="/"
        className="flex min-h-16 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5"
        aria-label="ServiFood Mantenimiento, inicio"
      >
        <div className="min-w-0">
          <div className="leading-none">
            <span className="text-3xl font-black tracking-[-0.05em] text-blue-600">Servi</span>
            <span className="text-3xl font-black tracking-[-0.05em] text-orange-500">Food</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            <Wrench className="h-3 w-3" />
            Mantenimiento
          </div>
        </div>
        <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 sm:inline-flex">
          ServiFood
        </span>
      </Link>
    </header>
  );
}
