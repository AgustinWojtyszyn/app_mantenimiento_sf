import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ClipboardList, ShieldCheck, Wrench } from 'lucide-react';
import LanguageToggle from '@/components/layout/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthLayout({ children, icon: Icon, title, subtitle, backTo = '/', backLabel }) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const copy = (es, en) => (isEn ? en : es);

  return (
    <div className="min-h-screen bg-[#06182b] text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 px-10 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle at 20% 15%, rgba(37,99,235,.24), transparent 28%), radial-gradient(circle at 75% 80%, rgba(255,138,31,.12), transparent 26%), linear-gradient(145deg,#06182b 0%,#082b59 58%,#04101f 100%)'
            }}
          />
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-4 text-white">
              <img
                src="/servifood_logo_white_text_HQ.png"
                alt="ServiFood"
                width="180"
                height="230"
                className="h-16 w-auto object-contain"
                decoding="async"
              />
              <span className="border-l border-white/20 pl-4 text-sm font-black tracking-[0.18em]">
                {copy('MANTENIMIENTO', 'MAINTENANCE')}
              </span>
            </Link>

            <div className="mt-20 max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                {copy('Operación ServiFood', 'ServiFood operations')}
              </p>
              <h2 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-0.04em] xl:text-6xl">
                {copy('El trabajo diario,', 'Daily work,')}
                <br />
                <span className="text-blue-200">{copy('mejor organizado.', 'better organized.')}</span>
              </h2>
              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">
                {copy(
                  'Ingresá al espacio donde se registran trabajos, responsables, costos y seguimiento operativo.',
                  'Access the workspace where jobs, owners, costs and operational follow-up are managed.'
                )}
              </p>

              <div className="mt-10 grid gap-4">
                {[
                  [ClipboardList, copy('Trabajos y solicitudes en un solo lugar', 'Jobs and requests in one place')],
                  [Wrench, copy('Seguimiento de mantenimiento', 'Maintenance follow-up')],
                  [ShieldCheck, copy('Accesos y datos protegidos', 'Protected access and data')]
                ].map(([FeatureIcon, label]) => (
                  <div key={label} className="flex items-center gap-4 text-sm font-semibold text-slate-200">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-300/20 bg-blue-300/10 text-blue-200">
                      <FeatureIcon className="h-5 w-5" />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-orange-300" />
            {copy('ServiFood · Panel de Mantenimiento', 'ServiFood · Maintenance Panel')}
          </div>
        </section>

        <section className="relative flex min-h-screen flex-col bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
          <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800 sm:px-8">
            <Link to="/" className="flex items-center gap-3 lg:hidden">
              <img
                src="/servifood_logo_white_text_HQ.png"
                alt="ServiFood"
                width="180"
                height="230"
                className="h-11 w-auto rounded bg-[#06182b] p-1 object-contain"
                decoding="async"
              />
              <span className="text-xs font-black tracking-[0.16em] text-[#082b59] dark:text-blue-200">
                {copy('MANTENIMIENTO', 'MAINTENANCE')}
              </span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle className="border border-border/70 bg-background shadow-sm" />
            </div>
          </div>

          <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[560px]"
            >
              <Link
                to={backTo}
                className="mb-7 inline-flex items-center text-sm font-bold text-[#1e3a8a] transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a8a] focus-visible:ring-offset-2 dark:text-blue-200 dark:hover:text-blue-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                {backLabel || t('auth.backHome')}
              </Link>

              <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
                <div className="h-1.5 bg-gradient-to-r from-[#082b59] via-[#1e3a8a] to-[#ff8a1f]" />
                <div className="p-7 sm:p-9 md:p-10">
                  <div className="mb-8">
                    {Icon ? (
                      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-[#1e3a8a] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                    ) : null}
                    <h1 className="text-3xl font-black tracking-[-0.03em] text-[#082b59] dark:text-blue-100 sm:text-4xl">
                      {title}
                    </h1>
                    {subtitle ? (
                      <p className="mt-3 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
                        {subtitle}
                      </p>
                    ) : null}
                  </div>

                  {children}
                </div>
              </section>
            </motion.div>
          </main>
        </section>
      </div>
    </div>
  );
}
