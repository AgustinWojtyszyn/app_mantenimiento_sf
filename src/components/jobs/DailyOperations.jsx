import React from 'react';
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
  ChevronDown,
} from 'lucide-react';
import { formatCurrency, getArgentinaToday } from '@/utils/formatters';
import { getJobStatusLabel, normalizeJobStatus } from '@/utils/jobStatus';
import {
  getSummaryStatusCardFilter,
  isSummaryStatusCardActive,
} from '@/pages/dailyJobsQuickStatus';

export default function DailyOperations({
  summary,
  jobs,
  date,
  loading,
  error,
  isEn,
  selectedStatus,
  hasActiveFilters,
  onStatusChange,
  onView,
}) {
  const cards = [
    ['all', isEn ? 'Total jobs' : 'Total de trabajos', summary.total, Briefcase],
    ['pending', isEn ? 'Pending' : 'Pendientes', summary.pending, Clock3],
    ['completed', isEn ? 'Completed' : 'Completados', summary.completed, CheckCircle2],
  ];

  const pending = jobs
    .filter((job) => normalizeJobStatus(job.estado || job.status) === 'pending')
    .slice(0, 3);

  const recent = jobs
    .map((job) => {
      const updated = Date.parse(job.updated_at);
      const created = Date.parse(job.created_at);
      return {
        job,
        time: Math.max(updated || 0, created || 0),
        modified:
          Number.isFinite(updated) &&
          (!Number.isFinite(created) || updated > created),
      };
    })
    .filter((item) => item.time > 0)
    .sort((a, b) => b.time - a.time)
    .slice(0, 3);

  const today = date === getArgentinaToday();
  const allClear = !hasActiveFilters && Number(summary.pending) === 0;
  const unavailable = loading || error;
  const statusMessage = loading
    ? (isEn ? 'Loading overview…' : 'Cargando resumen…')
    : (isEn ? 'Overview unavailable. See the table for details.' : 'Resumen no disponible. Consultá el detalle en la tabla.');

  return (
    <section className="dashboard-overview" aria-label={isEn ? 'Day summary' : 'Resumen del día'}>
      <div className="dashboard-overview-top">
        <div>
          <h2>{isEn ? 'Day overview' : 'Panorama del día'}</h2>
          {hasActiveFilters ? <span>{isEn ? 'Filtered view' : 'Vista filtrada'}</span> : null}
        </div>

        <div className="dashboard-kpis">
          {cards.map(([key, label, value, Icon]) => {
            const filter = getSummaryStatusCardFilter(key);
            const Tag = filter ? 'button' : 'div';
            return (
              <Tag
                key={key}
                className={`dashboard-kpi dashboard-kpi--${key}`}
                {...(filter
                  ? {
                      type: 'button',
                      onClick: () => onStatusChange(filter),
                      'aria-pressed': isSummaryStatusCardActive(key, selectedStatus),
                    }
                  : {})}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
                <strong>{unavailable ? '—' : value || 0}</strong>
              </Tag>
            );
          })}
        </div>
      </div>

      <div className="dashboard-secondary-strip">
        <span><Users size={15} /> {isEn ? 'Workers' : 'Trabajadores'} <strong>{unavailable ? '—' : summary.workers || 0}</strong></span>
        <span><MapPin size={15} /> {isEn ? 'Places' : 'Lugares'} <strong>{unavailable ? '—' : summary.locations || 0}</strong></span>
        <span>{isEn ? 'To charge' : 'A cobrar'} <strong>{unavailable ? '—' : formatCurrency(summary.totalCharge)}</strong></span>
        <span>{isEn ? 'Worker cost' : 'Costo trabajador'} <strong>{unavailable ? '—' : formatCurrency(summary.workerCost)}</strong></span>
        <span>{isEn ? 'Difference' : 'Diferencia'} <strong>{unavailable ? '—' : formatCurrency(summary.balance)}</strong></span>
      </div>

      <details className="dashboard-activity">
        <summary>
          <span>
            <Activity size={16} />
            {isEn ? 'Activity and pending jobs' : 'Actividad y pendientes'}
          </span>
          <span className="dashboard-activity-hint">
            {isEn ? 'Open details' : 'Ver detalle'}
            <ChevronDown size={15} aria-hidden="true" />
          </span>
        </summary>

        <div className="dashboard-operations">
          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <h2>
                <Clock3 size={18} />
                {today
                  ? (isEn ? 'Pending today' : 'Pendientes de hoy')
                  : (isEn ? 'Pending for this date' : 'Pendientes de la fecha')}
              </h2>
            </div>
            {unavailable ? (
              <p className="dashboard-inline-empty" role="status">{statusMessage}</p>
            ) : pending.length ? (
              <ul className="dashboard-job-list">
                {pending.map((job) => (
                  <li key={job.id}>
                    <button type="button" onClick={() => onView(job.id)}>
                      <span>
                        <strong>{job.title || job.description}</strong>
                        <span>
                          {job.location || '—'} · {job.workers?.display_name || job.workers?.alias || (isEn ? 'Unassigned' : 'Sin asignar')}
                        </span>
                      </span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="dashboard-inline-empty">
                <CheckCircle2 size={24} />
                <strong>
                  {allClear
                    ? (isEn ? 'All caught up' : 'Todo al día')
                    : (isEn ? 'No pending jobs in this view' : 'Sin pendientes en esta vista')}
                </strong>
                <p>
                  {allClear
                    ? today
                      ? (isEn ? 'No pending jobs for today' : 'No hay trabajos pendientes para hoy')
                      : (isEn ? 'No pending jobs for this date' : 'No hay trabajos pendientes para esta fecha')
                    : (isEn ? 'Check the filters or other pages.' : 'Revisá los filtros o las otras páginas.')}
                </p>
              </div>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <h2><Activity size={18} />{isEn ? 'Recent activity' : 'Actividad reciente'}</h2>
            </div>
            {unavailable ? (
              <p className="dashboard-inline-empty" role="status">{statusMessage}</p>
            ) : recent.length ? (
              <ul className="dashboard-job-list">
                {recent.map(({ job, time, modified }) => (
                  <li key={job.id}>
                    <button type="button" onClick={() => onView(job.id)}>
                      <span>
                        <strong>{job.title || job.description}</strong>
                        <span>
                          {modified ? (isEn ? 'Updated' : 'Actualizado') : (isEn ? 'Created' : 'Creado')} ·{' '}
                          {new Intl.DateTimeFormat(isEn ? 'en-GB' : 'es-AR', {
                            timeZone: 'America/Argentina/Buenos_Aires',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(time)} · {getJobStatusLabel(normalizeJobStatus(job.estado || job.status), isEn)}
                        </span>
                      </span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="dashboard-inline-empty">
                <Activity size={24} />
                <strong>{isEn ? 'No recent activity available' : 'Sin actividad reciente disponible'}</strong>
              </div>
            )}
          </section>
        </div>
      </details>
    </section>
  );
}
