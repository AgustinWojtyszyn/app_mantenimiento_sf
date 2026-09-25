import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { isOnboardingInProgress, markManualNavNow, clearOnboardingState } from '@/onboarding/onboardingStorage';
import {
  Calendar,
  CalendarDays,
  Users,
  UserCog,
  BookOpen,
  ClipboardList,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Wrench,
  Settings,
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const copy = (es, en) => (isEn ? en : es);
  const location = useLocation();


  const operationItems = useMemo(() => ([
    { label: t('nav.daily'), path: '/app/trabajos-diarios', icon: Calendar },
    { label: t('nav.workers'), path: '/app/trabajadores', icon: UserCog },
    { label: t('nav.equipmentLog'), path: '/app/equipment-log', icon: ClipboardList },
  ]), [t]);

  const reportItems = useMemo(() => ([
    { label: t('nav.monthly'), path: '/app/panel-mensual', icon: CalendarDays },
  ]), [t]);

  const administrationItems = useMemo(() => ([
    { label: t('nav.groups'), path: '/app/grupos', icon: Users, adminOnly: true },
    { label: t('nav.admin'), path: '/app/admin', icon: ShieldAlert, adminOnly: true },
  ].filter((item) => (item.adminOnly ? isAdmin : true))), [t, isAdmin]);

  const menuSections = [
    { label: copy('Operación', 'Operations'), items: operationItems },
    { label: copy('Reportes y análisis', 'Reports & analytics'), items: reportItems },
    { label: copy('Administración', 'Administration'), items: administrationItems },
  ].filter((section) => section.items.length > 0);

  const allItems = [...operationItems, ...reportItems, ...administrationItems];
  const isItemActive = (item) => {
    if (item.path === '/app/trabajos-diarios') {
      return location.pathname === item.path
        || location.pathname.startsWith('/app/trabajos-diarios/')
        || location.pathname.startsWith('/app/jobs/');
    }
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  };
  const activeItem = allItems.find(isItemActive);
  const currentLabel = activeItem?.label ?? t('nav.daily');

  const toggleSidebar = () => setIsOpen((value) => !value);

  const handleNavClick = () => {
    markManualNavNow();
    if (isOnboardingInProgress()) clearOnboardingState();
    setIsOpen(false);
  };

  const itemClass = (active) => [
    'flex min-h-11 items-center rounded-xl px-3 py-2.5 text-[15px] font-bold transition-colors duration-150',
    active
      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700',
  ].join(' ');

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return (
      <li key={item.path}>
        <Link to={item.path} onClick={handleNavClick} className={itemClass(active)}>
          <Icon className="mr-3 h-5 w-5 shrink-0" />
          <span className="min-w-0 flex-1 leading-tight">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-[60] rounded-md bg-blue-900/95 p-2 text-white shadow-lg transition-colors hover:bg-blue-900 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`
        sidebar orders-sidebar fixed left-0 top-0 z-50 flex h-dvh w-[min(85vw,320px)] flex-col
        border-r-4 border-orange-500 bg-white shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:sticky md:top-0 md:w-64 md:translate-x-0
      `}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link to="/app/trabajos-diarios" onClick={handleNavClick} className="min-w-0">
            <div className="leading-none">
              <span className="text-[2.35rem] font-black tracking-[-0.055em] text-blue-600">Servi</span>
              <span className="text-[2.35rem] font-black tracking-[-0.055em] text-orange-500">Food</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              <Wrench className="h-3 w-3" />
              {copy('Mantenimiento', 'Maintenance')}
            </div>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-3 pb-4 pt-4">
          <div className="flex-1 space-y-5">
            {menuSections.map((section) => (
              <section key={section.label} aria-label={section.label}>
                <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {section.label}
                </p>
                <ul className="space-y-1">
                  {section.items.map(renderItem)}
                </ul>
              </section>
            ))}
          </div>

          <section aria-label="Cuenta y ayuda" className="mt-5 border-t border-slate-200 pt-4">
            <p className="mb-1.5 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
              {copy('Cuenta y ayuda', 'Account & help')}
            </p>

            <ul className="space-y-1">
              <li>
                <Link
                  to="/app/configuracion"
                  onClick={handleNavClick}
                  className={itemClass(location.pathname === '/app/configuracion')}
                >
                  <Settings className="mr-3 h-5 w-5 shrink-0" />
                  <span>{t('nav.settings')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/app/tutorial"
                  onClick={handleNavClick}
                  className={itemClass(location.pathname === '/app/tutorial')}
                >
                  <BookOpen className="mr-3 h-5 w-5 shrink-0" />
                  <span>{t('nav.tutorial')}</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex min-h-11 w-full items-center rounded-xl px-3 py-2.5 text-[15px] font-bold text-red-700 transition-colors hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-5 w-5 shrink-0" />
                  <span>{t('nav.logout')}</span>
                </button>
              </li>
            </ul>
          </section>
        </nav>
      </aside>

      <div className="pointer-events-none fixed left-16 top-4 z-50 rounded-lg bg-blue-950/70 px-3 py-2 text-xs font-bold text-white shadow-md backdrop-blur md:hidden">
        {currentLabel}
      </div>
    </>
  );
}
