import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Check,
  CheckCircle2,
  Calendar,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  MapPin,
  Wrench,
  Users,
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import './LandingPage.css';

const buildSteps = (t) => [
  {
    number: '01',
    icon: ClipboardList,
    title: t('Registrá el trabajo', 'Register the job'),
    text: t('Cargá fecha, ubicación, detalle y la información operativa necesaria.', 'Add date, location, details and the operational information you need.'),
  },
  {
    number: '02',
    icon: Users,
    title: t('Asigná responsables', 'Assign owners'),
    text: t('Vinculá trabajadores y grupos para que cada tarea tenga un responsable claro.', 'Link workers and groups so every task has a clear owner.'),
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: t('Seguí el avance', 'Track progress'),
    text: t('Consultá estados, costos, equipos y reportes desde un mismo lugar.', 'Review status, costs, equipment and reports from one place.'),
  },
];

function AccessLinks({ t }) {
  return (
    <div className="sf-access">
      <Link className="sf-button sf-button-primary" to="/login">
        {t('Iniciar sesión', 'Sign in')} <ArrowUpRight size={19} aria-hidden="true" />
      </Link>
      <Link className="sf-button sf-button-secondary" to="/register">
        {t('Registrarse', 'Register')} <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </div>
  );
}

function MaintenancePreview({ t }) {
  return (
    <figure className="sf-preview" aria-label={t('Ejemplo ilustrativo de un trabajo de mantenimiento', 'Illustrative maintenance job example')}>
      <div className="sf-preview-top">
        <span className="sf-preview-brand">
          ServiFood<span> / {t('Mantenimiento', 'Maintenance')}</span>
        </span>
        <span className="sf-avatar">SF</span>
      </div>
      <div className="sf-preview-content">
        <div className="sf-preview-heading">
          <div>
            <span className="sf-mini-label">{t('OPERACIÓN DE HOY', 'TODAY’S OPERATIONS')}</span>
            <h3>{t('Trabajo del día', 'Today’s job')}</h3>
          </div>
          <span className="sf-today">
            <Calendar size={12} /> {t('Hoy', 'Today')}
          </span>
        </div>

        <div className="sf-preview-option sf-preview-selected">
          <span className="sf-radio"><Check size={12} strokeWidth={3} /></span>
          <div>
            <strong>{t('Revisión de cámara de frío', 'Cold room inspection')}</strong>
            <span>{t('Mantenimiento preventivo', 'Preventive maintenance')}</span>
          </div>
          <span className="sf-option-number">01</span>
        </div>

        <div className="sf-preview-option">
          <span className="sf-radio" />
          <div>
            <strong>{t('Control de horno', 'Oven inspection')}</strong>
            <span>{t('Equipo de planta', 'Plant equipment')}</span>
          </div>
          <span className="sf-option-number">02</span>
        </div>

        <div className="sf-order-details">
          <span><Clock3 size={14} /> 08:30</span>
          <span><MapPin size={14} /> {t('Cocina central', 'Central kitchen')}</span>
        </div>

        <div className="sf-confirmed">
          <CheckCircle2 size={17} />
          <span>{t('Trabajo asignado', 'Job assigned')}</span>
          <Check size={16} />
        </div>

        <div className="sf-delivery">
          <span>{t('Estado', 'Status')}</span>
          <strong><i /> {t('En curso', 'In progress')}</strong>
        </div>
      </div>
      <figcaption>{t('Vista ilustrativa · Los datos dependen de tu operación.', 'Illustrative view · Data depends on your operation.')}</figcaption>
    </figure>
  );
}

export default function LandingPage() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const t = (es, en) => (isEn ? en : es);
  const steps = buildSteps(t);

  return (
    <div className="sf-landing">
      <Helmet>
        <title>{t('Mantenimiento · ServiFood', 'Maintenance · ServiFood')}</title>
        <meta
          name="description"
          content={t(
            'Trabajos, responsables, costos, equipos y reportes de mantenimiento en un solo lugar.',
            'Maintenance jobs, owners, costs, equipment and reports in one place.'
          )}
        />
      </Helmet>

      <a href="#contenido" className="sf-skip">{t('Ir al contenido', 'Skip to content')}</a>

      <div className="sf-blue-stage">
        <header className="sf-header sf-container">
          <Link to="/" className="sf-logo-link" aria-label="ServiFood, inicio">
            <img
              src="/servifood_logo_white_text_HQ.png"
              alt="ServiFood Catering"
              width="180"
              height="70"
              style={{ width: 'auto', height: '58px', objectFit: 'contain' }}
            />
          </Link>

          <nav className="sf-nav" aria-label={t('Navegación principal', 'Main navigation')}>
            <a href="#como-funciona">{t('Cómo funciona', 'How it works')}</a>
            <a href="#experiencia">{t('La experiencia', 'The experience')}</a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle className="h-9 border-white/25 bg-white/10 px-3 text-xs text-white hover:bg-white/20 hover:text-white" />
            <Link to="/login" className="sf-header-login">
              {t('Iniciar sesión', 'Sign in')} <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <main id="contenido">
          <section className="sf-hero sf-container" aria-labelledby="sf-hero-title">
            <div className="sf-hero-copy">
              <span className="sf-eyebrow">
                <span /> {t('OPERACIÓN CLARA. MENOS VUELTAS.', 'CLEAR OPERATIONS. LESS FRICTION.')}
              </span>
              <h1 id="sf-hero-title">
                {t('Tu operación', 'Your operations')}
                <br />
                {t('diaria, ', 'every day, ')}<span>{t('simple', 'simple')}</span>
                <br />
                {t('y organizada', 'and organized')}<span className="sf-period">.</span>
              </h1>
              <p>
                {t('Cada trabajo suma información útil.', 'Every job adds useful context.')}
                <br />
                {t(
                  'Registrá tareas, responsables, costos y equipos con la misma claridad que usás en Pedidos.',
                  'Track tasks, owners, costs and equipment with the same clarity you use in Orders.'
                )}
              </p>

              <AccessLinks t={t} />

              <div className="sf-hero-note">
                <ShieldCheck size={15} aria-hidden="true" />
                <span>{t('Tu operación. Tus registros. Todo en un lugar.', 'Your operations. Your records. All in one place.')}</span>
              </div>
            </div>

            <div className="sf-hero-visual">
              <div className="sf-orbit sf-orbit-one" />
              <div className="sf-orbit sf-orbit-two" />
              <div className="sf-food-frame">
                <img
                  src="/images/servifood-produccion.webp"
                  alt={t('Operación de producción de ServiFood', 'ServiFood production operations')}
                  width="1200"
                  height="800"
                  fetchPriority="high"
                />
              </div>
              <div className="sf-visual-tag">
                <span className="sf-tag-icon"><Wrench size={17} /></span>
                <span>
                  {t('Menos información dispersa.', 'Less scattered information.')}
                  <strong>{t('Más control operativo.', 'More operational control.')}</strong>
                </span>
              </div>
              <MaintenancePreview t={t} />
            </div>

            <div className="sf-hero-bottom">
              <a href="#como-funciona">
                <span className="sf-scroll-icon"><ArrowDown size={15} /></span>
                {t('Conocé cómo funciona', 'See how it works')}
              </a>
              <span>{t('MANTENIMIENTO + TECNOLOGÍA', 'MAINTENANCE + TECHNOLOGY')}</span>
            </div>
          </section>

          <section className="sf-process" id="como-funciona" aria-labelledby="sf-process-title">
            <div className="sf-container">
              <div className="sf-section-heading">
                <div>
                  <span className="sf-eyebrow sf-eyebrow-dark">{t('ASÍ DE SIMPLE', 'THAT SIMPLE')}</span>
                  <h2 id="sf-process-title">
                    {t('Cada trabajo.', 'Every job.')}
                    <br />
                    <span>{t('Sin complicaciones.', 'Without complications.')}</span>
                  </h2>
                </div>
                <p>
                  {t('Un flujo más claro, desde la carga', 'A clearer workflow, from the first entry')}
                  <br className="sf-desktop-break" /> {t('hasta el seguimiento y el reporte.', 'to follow-up and reporting.')}
                </p>
              </div>

              <div className="sf-steps">
                {steps.map(({ number, icon: Icon, title, text }) => (
                  <article className="sf-step" key={number}>
                    <div className="sf-step-top">
                      <span>{number}</span>
                      <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="sf-experience" id="experiencia" aria-labelledby="sf-experience-title">
            <div className="sf-container sf-experience-grid">
              <div className="sf-history-scene" aria-label={t('Ejemplo ilustrativo del seguimiento de trabajos', 'Illustrative job tracking example')}>
                <span className="sf-scene-label"><span /> {t('TU OPERACIÓN, EN ORDEN', 'YOUR OPERATIONS, IN ORDER')}</span>

                <div className="sf-history-card">
                  <div className="sf-history-heading">
                    <span className="sf-history-icon"><ClipboardList size={22} /></span>
                    <div>
                      <h3>{t('Trabajos recientes', 'Recent jobs')}</h3>
                      <p>{t('Todo queda organizado.', 'Everything stays organized.')}</p>
                    </div>
                  </div>

                  <div className="sf-history-row">
                    <span className="sf-date-tile"><Calendar size={19} /></span>
                    <div>
                      <strong>{t('Revisión cámara de frío', 'Cold room inspection')}</strong>
                      <span>{t('Cocina central · Hoy', 'Central kitchen · Today')}</span>
                    </div>
                    <span className="sf-status">{t('En curso', 'In progress')}</span>
                  </div>

                  <div className="sf-history-row">
                    <span className="sf-date-tile"><Check size={19} /></span>
                    <div>
                      <strong>{t('Mantenimiento anterior', 'Previous maintenance')}</strong>
                      <span>{t('Consultá detalle, costos y responsable', 'Review details, costs and owner')}</span>
                    </div>
                    <ChevronRight size={18} />
                  </div>

                  <div className="sf-history-bottom">
                    <ShieldCheck size={14} />
                    <span>{t('Accedé con tu cuenta personal', 'Access with your personal account')}</span>
                  </div>
                </div>

                <div className="sf-mobile-note">
                  <Smartphone size={23} />
                  <span>{t('Con vos,', 'With you,')}<strong>{t('donde estés.', 'wherever you are.')}</strong></span>
                </div>

                <span className="sf-scene-caption">{t('Vista ilustrativa de Mantenimiento ServiFood', 'Illustrative ServiFood Maintenance view')}</span>
              </div>

              <div className="sf-experience-copy">
                <span className="sf-eyebrow sf-eyebrow-dark">{t('PENSADO PARA LA OPERACIÓN', 'BUILT FOR OPERATIONS')}</span>
                <h2 id="sf-experience-title">
                  {t('La tranquilidad de', 'The confidence of')}
                  <br />
                  {t('tenerlo ', 'having it ')}<span>{t('ordenado.', 'organized.')}</span>
                </h2>
                <p>{t('Menos tiempo buscando información. Más claridad para decidir qué sigue.', 'Less time searching for information. More clarity for deciding what comes next.')}</p>

                <ul className="sf-benefits">
                  <li>
                    <Clock3 size={20} />
                    <div>
                      <h3>{t('Simple desde el primer registro', 'Simple from the first entry')}</h3>
                      <p>{t('Cargá lo necesario y seguí trabajando.', 'Add what you need and keep working.')}</p>
                    </div>
                  </li>
                  <li>
                    <ClipboardList size={20} />
                    <div>
                      <h3>{t('Trabajos siempre a mano', 'Jobs always at hand')}</h3>
                      <p>{t('Revisá estados, responsables y costos.', 'Review status, owners and costs.')}</p>
                    </div>
                  </li>
                  <li>
                    <Smartphone size={20} />
                    <div>
                      <h3>{t('Desde donde te quede cómodo', 'From wherever works best')}</h3>
                      <p>{t('Usalo desde celular, tablet o computadora.', 'Use it from phone, tablet or computer.')}</p>
                    </div>
                  </li>
                </ul>

                <Link to="/login" className="sf-text-link">
                  {t('Entrar a Mantenimiento', 'Enter Maintenance')} <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </section>

          <section className="sf-final" aria-labelledby="sf-final-title">
            <div className="sf-container sf-final-inner">
              <div>
                <span className="sf-eyebrow">{t('TU OPERACIÓN EMPIEZA ACÁ', 'YOUR OPERATIONS START HERE')}</span>
                <h2 id="sf-final-title">
                  {t('Trabajo claro.', 'Clear work.')}
                  <br />
                  {t('Todo organizado', 'Everything organized')}<span>.</span>
                </h2>
                <p>{t('Ingresá a ServiFood Mantenimiento y centralizá tu operación.', 'Sign in to ServiFood Maintenance and centralize your operations.')}</p>
              </div>
              <div className="sf-final-actions">
                <AccessLinks t={t} />
                <span>{t('¿Es tu primera vez? Creá tu cuenta para empezar.', 'First time here? Create your account to get started.')}</span>
              </div>
            </div>
          </section>
        </main>

        <footer className="sf-footer sf-container">
          <Link to="/" aria-label="ServiFood, inicio">
            <img
              src="/servifood_logo_white_text_HQ.png"
              alt="ServiFood Catering"
              width="120"
              height="48"
              style={{ width: 'auto', height: '42px', objectFit: 'contain' }}
              loading="lazy"
            />
          </Link>
          <p>{t('Tu operación diaria. Mejor organizada.', 'Your daily operations. Better organized.')}</p>
          <span>© {new Date().getFullYear()} ServiFood.<br />{t('Todos los derechos reservados.', 'All rights reserved.')}</span>
        </footer>
      </div>
    </div>
  );
}
