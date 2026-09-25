import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import LanguageToggle from '@/components/layout/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthLayout({ children, icon: Icon, title, subtitle, backTo = '/', backLabel }) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const copy = (es, en) => (isEn ? en : es);

  return (
    <div
      className="min-h-dvh w-full px-3 py-4 sm:px-6 sm:py-7"
      style={{ background: 'linear-gradient(to bottom right, #1a237e, #283593, #303f9f)' }}
    >
      <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
        <LanguageToggle className="border-white/30 bg-white/95 text-slate-700 shadow-lg hover:bg-white" />
        <ThemeToggle className="border-white/30 bg-white/95 text-slate-700 shadow-lg hover:bg-white" />
      </div>

      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col items-center justify-center sm:min-h-[calc(100dvh-3.5rem)]">
        <div className="mb-4 text-center sm:mb-6">
          <Link to="/" className="inline-flex justify-center">
            <img
              src="/servifood_logo_white_text_HQ.png"
              alt="ServiFood"
              width="220"
              height="260"
              className="max-h-24 w-auto object-contain sm:max-h-32"
              decoding="async"
            />
          </Link>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-blue-100">
            {copy('Mantenimiento', 'Maintenance')}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white drop-shadow-xl sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-blue-100 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <section className="rounded-3xl border-2 border-white/20 bg-white p-5 text-slate-950 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                to={backTo}
                className="inline-flex items-center text-sm font-bold text-blue-700 transition-colors hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                {backLabel || t('auth.backHome')}
              </Link>
              {Icon ? (
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              ) : null}
            </div>

            {children}
          </section>
        </motion.div>
      </div>
    </div>
  );
}
