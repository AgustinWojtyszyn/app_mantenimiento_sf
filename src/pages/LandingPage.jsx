import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  MapPin,
  Plus,
  Users,
  Wrench,
} from "lucide-react";
import { Helmet } from "react-helmet";
import ThemeToggle from "@/components/layout/ThemeToggle";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import "./LandingPage.css";

export default function LandingPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const t = (es, en) => (isEn ? en : es);
  const jobs = [
    [
      t("Revisión de cámara de frío", "Cold room inspection"),
      t("Cocina central", "Central kitchen"),
      t("En curso", "In progress"),
      "active",
    ],
    [
      t("Mantenimiento de horno", "Oven maintenance"),
      t("Planta de producción", "Production facility"),
      t("Completado", "Completed"),
      "done",
    ],
    [
      t("Control de extracción", "Extraction inspection"),
      t("Comedor corporativo", "Corporate dining"),
      t("Pendiente", "Pending"),
      "pending",
    ],
  ];
  return (
    <div className="tracking-landing">
      <Helmet>
        <title>
          {t(
            "Tracking · ServiFood | Control de tu operación",
            "Tracking · ServiFood | Your operation under control",
          )}
        </title>
        <meta
          name="description"
          content={t(
            "Trabajos, costos, equipos y reportes en un solo lugar. Conocé Tracking, la herramienta de seguimiento operativo de ServiFood.",
            "Jobs, costs, teams and reports in one place. Discover Tracking by ServiFood.",
          )}
        />
      </Helmet>
      <a className="tracking-skip" href="#contenido">
        {t("Ir al contenido", "Skip to content")}
      </a>
      <header className="tracking-header">
        <nav
          className="tracking-container tracking-nav"
          aria-label={t("Navegación principal", "Main navigation")}
        >
          <a
            href="#"
            className="tracking-brand"
            aria-label="ServiFood Tracking"
          >
            <img src="/servifood_logo_white_text_HQ.png" alt="ServiFood" />
            <span>TRACKING</span>
          </a>
          <div className="tracking-nav-sections">
            <a href="#plataforma">{t("Plataforma", "Platform")}</a>
            <a href="#flujo">{t("Cómo funciona", "How it works")}</a>
          </div>
          <div className="tracking-nav-actions">
            <LanguageToggle className="tracking-toggle" />
            <ThemeToggle className="tracking-toggle tracking-theme" />
            <Link className="tracking-signin" to="/login">
              {t("Ingresar", "Sign in")}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </nav>
      </header>
      <main id="contenido">
        <section className="tracking-hero">
          <div className="tracking-container tracking-hero-grid">
            <div className="tracking-hero-copy">
              <div className="tracking-eyebrow">
                <span className="tracking-dot" />
                {t(
                  "GESTIÓN OPERATIVA · SERVIFOOD",
                  "OPERATIONS MANAGEMENT · SERVIFOOD",
                )}
              </div>
              <h1>
                {t("Cada trabajo.", "Every job.")}
                <br />
                {t("Cada detalle.", "Every detail.")}
                <br />
                <em>{t("Bajo control.", "Under control.")}</em>
              </h1>
              <p>
                {t(
                  "Conectá lo que pasa en campo con las decisiones de tu operación. Trabajos, costos y equipos, con el seguimiento que necesitás.",
                  "Connect work in the field with your operational decisions. Jobs, costs and teams, with the tracking you need.",
                )}
              </p>
              <div className="tracking-hero-actions">
                <Link
                  to="/register"
                  className="tracking-button tracking-button-accent"
                >
                  {t("Crear mi cuenta", "Create my account")}
                  <ArrowRight size={18} />
                </Link>
                <a href="#plataforma" className="tracking-text-link">
                  {t("Explorar la plataforma", "Explore the platform")}
                  <ArrowDownIcon />
                </a>
              </div>
              <div className="tracking-hero-note">
                <Check size={14} />
                {t(
                  "Del primer registro al reporte final.",
                  "From the first entry to the final report.",
                )}
              </div>
            </div>
            <div className="tracking-hero-visual">
              <div className="tracking-photo-frame">
                <img
                  className="tracking-operation-photo"
                  src="/images/tracking-operation.webp"
                  width="1536"
                  height="1024"
                  alt={t(
                    "Técnico inspeccionando equipamiento de una cocina industrial",
                    "Technician inspecting commercial kitchen equipment",
                  )}
                  fetchPriority="high"
                />
                <div className="tracking-photo-caption">
                  <span>01 / {t("EN CAMPO", "IN THE FIELD")}</span>
                  <span>
                    {t("Donde el trabajo sucede.", "Where work happens.")}
                  </span>
                </div>
              </div>
              <div className="tracking-job-card">
                <div className="tracking-job-card-top">
                  <span className="tracking-icon-box">
                    <Wrench size={19} />
                  </span>
                  <span className="tracking-status active">
                    {t("En curso", "In progress")}
                  </span>
                </div>
                <small>{t("SEGUIMIENTO DE TRABAJO", "JOB TRACKING")}</small>
                <h3>
                  {t("Mantenimiento preventivo", "Preventive maintenance")}
                </h3>
                <p>
                  <MapPin size={13} />
                  {t(
                    "Cocina central · Equipo de frío",
                    "Central kitchen · Cooling equipment",
                  )}
                </p>
                <div className="tracking-job-progress">
                  <span />
                </div>
                <div className="tracking-job-card-bottom">
                  <span>
                    <span className="tracking-avatar">ML</span>
                    {t("Responsable asignado", "Owner assigned")}
                  </span>
                  <CheckCircle2 size={17} />
                </div>
              </div>
              <span className="tracking-visual-label">
                {t(
                  "Vista ilustrativa del seguimiento",
                  "Illustrative tracking preview",
                )}
              </span>
            </div>
          </div>
          <div className="tracking-container tracking-capabilities">
            {[
              [ClipboardList, t("Trabajos organizados", "Organized jobs")],
              [Users, t("Equipos conectados", "Connected teams")],
              [Wrench, t("Operación visible", "Visible operations")],
              [FileSpreadsheet, t("Reportes claros", "Clear reports")],
            ].map(([Icon, label]) => (
              <div key={label}>
                <Icon size={18} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="plataforma" className="tracking-platform tracking-section">
          <div className="tracking-container">
            <div className="tracking-section-heading">
              <div>
                <div className="tracking-eyebrow">
                  {t(
                    "VISIBILIDAD PARA DECIDIR",
                    "VISIBILITY TO MAKE DECISIONS",
                  )}
                </div>
                <h2>
                  {t("Toda la operación.", "Your entire operation.")}
                  <br />
                  <span>{t("Una mirada clara.", "One clear view.")}</span>
                </h2>
              </div>
              <p>
                {t(
                  "Menos información dispersa. Más contexto para saber qué se hizo, quién lo hizo y cuánto costó.",
                  "Less scattered information. More context to know what was done, who did it and what it cost.",
                )}
              </p>
            </div>
            <div className="tracking-workspace">
              <aside className="tracking-workspace-sidebar" aria-hidden="true">
                <span className="tracking-mini-brand">
                  S<span>F</span>
                  <i />
                </span>
                <ClipboardList size={21} />
                <Users size={21} />
                <FileSpreadsheet size={21} />
                <Wrench size={21} />
              </aside>
              <div className="tracking-workspace-main">
                <div className="tracking-workspace-top">
                  <div>
                    <small>WORKSPACE / {t("OPERACIÓN", "OPERATIONS")}</small>
                    <h3>{t("Resumen de trabajos", "Job overview")}</h3>
                  </div>
                  <span className="tracking-preview-label">
                    {t("Vista ilustrativa", "Illustrative preview")}
                  </span>
                </div>
                <div className="tracking-kpis">
                  {[
                    ["12", t("Trabajos registrados", "Registered jobs")],
                    ["04", t("En curso", "In progress")],
                    ["08", t("Completados", "Completed")],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                      <span className="tracking-kpi-line" />
                    </div>
                  ))}
                </div>
                <div className="tracking-job-table">
                  <div className="tracking-table-heading">
                    <span>{t("TRABAJO / UBICACIÓN", "JOB / LOCATION")}</span>
                    <span>{t("ESTADO", "STATUS")}</span>
                  </div>
                  {jobs.map(([name, location, status, kind]) => (
                    <div className="tracking-table-row" key={name}>
                      <div className="tracking-table-job">
                        <span className="tracking-table-icon">
                          <Wrench size={16} />
                        </span>
                        <div>
                          <strong>{name}</strong>
                          <small>{location}</small>
                        </div>
                      </div>
                      <span className={`tracking-status ${kind}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="tracking-workspace-callout">
                <span className="tracking-eyebrow">
                  {t("DEL DATO A LA ACCIÓN", "FROM DATA TO ACTION")}
                </span>
                <h3>
                  {t(
                    "El detalle hace la diferencia.",
                    "The details make the difference.",
                  )}
                </h3>
                <p>
                  {t(
                    "Horas, ubicaciones, responsables y notas. Cada registro suma contexto para tu próximo paso.",
                    "Hours, locations, owners and notes. Every entry adds context for your next step.",
                  )}
                </p>
                <a href="#flujo">
                  {t("Conocé el flujo de trabajo", "Discover the workflow")}
                  <ArrowUpRight size={19} />
                </a>
                <div className="tracking-record">
                  <CheckCircle2 size={24} />
                  <div>
                    <strong>
                      {t("Información conectada", "Connected information")}
                    </strong>
                    <small>
                      {t(
                        "Un mismo lugar para todo el equipo",
                        "One place for the whole team",
                      )}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="tracking-benefits">
              <article className="tracking-benefit">
                <div className="tracking-finance-visual" aria-hidden="true">
                  <div>
                    <small>
                      {t("DISTRIBUCIÓN DE COSTOS", "COST BREAKDOWN")}
                    </small>
                    <div className="tracking-cost-bar">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="tracking-cost-legend">
                      <span>{t("Materiales", "Materials")}</span>
                      <span>{t("Mano de obra", "Labor")}</span>
                      <span>{t("Otros", "Other")}</span>
                    </div>
                  </div>
                </div>
                <span className="tracking-card-number">
                  01 / {t("COSTOS", "COSTS")}
                </span>
                <h3>
                  {t("Cada costo, en contexto.", "Every cost, in context.")}
                </h3>
                <p>
                  {t(
                    "Relacioná ingresos y gastos con tus trabajos. Entendé tus números sin reconstruir planillas.",
                    "Connect income and expenses to your jobs. Understand your numbers without rebuilding spreadsheets.",
                  )}
                </p>
              </article>
              <article className="tracking-benefit">
                <div className="tracking-team-visual" aria-hidden="true">
                  <div className="tracking-team-avatars">
                    <span>ML</span>
                    <span>JR</span>
                    <span>AC</span>
                    <span>
                      <Plus size={18} />
                    </span>
                  </div>
                  <div className="tracking-team-line">
                    <span />
                    <CheckCircle2 size={20} />
                    <span />
                  </div>
                  <small>
                    {t(
                      "UN EQUIPO. LA MISMA INFORMACIÓN.",
                      "ONE TEAM. THE SAME INFORMATION.",
                    )}
                  </small>
                </div>
                <span className="tracking-card-number">
                  02 / {t("EQUIPOS", "TEAMS")}
                </span>
                <h3>
                  {t("Responsabilidades claras.", "Clear responsibilities.")}
                </h3>
                <p>
                  {t(
                    "Organizá grupos y asigná responsables. Que cada persona sepa dónde aportar y qué seguir.",
                    "Organize groups and assign owners. Help everyone know where to contribute and what to track.",
                  )}
                </p>
              </article>
              <article className="tracking-benefit">
                <div className="tracking-report-visual" aria-hidden="true">
                  <div className="tracking-report-file">
                    <FileSpreadsheet size={28} />
                    <div>
                      <strong>{t("Reporte de trabajos", "Job report")}</strong>
                      <small>Excel · .xlsx</small>
                    </div>
                    <Download size={19} />
                  </div>
                  <span className="tracking-report-lines" />
                </div>
                <span className="tracking-card-number">
                  03 / {t("REPORTES", "REPORTS")}
                </span>
                <h3>{t("Listos para compartir.", "Ready to share.")}</h3>
                <p>
                  {t(
                    "Convertí tus registros en reportes de Excel para tu equipo, tus clientes o tu estudio contable.",
                    "Turn your records into Excel reports for your team, your clients or your accountant.",
                  )}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="flujo" className="tracking-flow tracking-section">
          <div className="tracking-container tracking-flow-grid">
            <div>
              <div className="tracking-eyebrow">
                {t("UN FLUJO SIMPLE", "A SIMPLE WORKFLOW")}
              </div>
              <h2>
                {t("Del trabajo diario", "From daily work")}
                <br />
                {t("a una visión completa.", "to the full picture.")}
              </h2>
              <p>
                {t(
                  "Una forma más ordenada de trabajar, de principio a fin.",
                  "A more organized way to work, from start to finish.",
                )}
              </p>
              <Link to="/register" className="tracking-text-link">
                {t("Empezar ahora", "Get started")}
                <ArrowRight size={18} />
              </Link>
              <div className="tracking-flow-stamp">
                <Wrench size={27} />
                <span>
                  TRACKING
                  <br />
                  <small>BY SERVIFOOD</small>
                </span>
              </div>
            </div>
            <ol className="tracking-steps">
              {[
                [
                  t("Prepará tu espacio", "Set up your workspace"),
                  t(
                    "Creá tu cuenta y organizá la información de tu equipo.",
                    "Create your account and organize your team information.",
                  ),
                  Users,
                ],
                [
                  t("Registrá lo que pasa", "Record what happens"),
                  t(
                    "Cargá trabajos, horas, ubicaciones y gastos asociados.",
                    "Add jobs, hours, locations and associated expenses.",
                  ),
                  ClipboardList,
                ],
                [
                  t(
                    "Convertí registros en decisiones",
                    "Turn records into decisions",
                  ),
                  t(
                    "Revisá resultados y exportá reportes para planificar lo que sigue.",
                    "Review results and export reports to plan your next steps.",
                  ),
                  FileSpreadsheet,
                ],
              ].map(([title, description, Icon], i) => (
                <li key={title}>
                  <span className="tracking-step-number">0{i + 1}</span>
                  <div>
                    <Icon size={23} />
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="tracking-cta">
          <div className="tracking-container tracking-cta-inner">
            <div>
              <div className="tracking-eyebrow">
                {t("TU PRÓXIMO PASO", "YOUR NEXT STEP")}
              </div>
              <h2>
                {t("Más claridad.", "More clarity.")}
                <br />
                {t("Mejor operación.", "Better operations.")}
              </h2>
            </div>
            <div>
              <p>
                {t(
                  "Dale a cada trabajo el seguimiento que merece.",
                  "Give every job the tracking it deserves.",
                )}
              </p>
              <Link
                to="/register"
                className="tracking-button tracking-button-accent"
              >
                {t("Crear mi cuenta", "Create my account")}
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="tracking-cta-login">
                {t(
                  "¿Ya tenés cuenta? Ingresá",
                  "Already have an account? Sign in",
                )}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="tracking-footer">
        <div className="tracking-container">
          <a
            href="#"
            className="tracking-brand"
            aria-label="ServiFood Tracking"
          >
            <img src="/servifood_logo_white_text_HQ.png" alt="ServiFood" />
            <span>TRACKING</span>
          </a>
          <p>
            {t(
              "Seguimiento profesional. Todos los días.",
              "Professional tracking. Every day.",
            )}
          </p>
          <span>© {new Date().getFullYear()} ServiFood</span>
        </div>
      </footer>
    </div>
  );
}

function ArrowDownIcon() {
  return <ArrowRight size={16} className="tracking-arrow-down" />;
}
