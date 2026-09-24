import React from 'react';
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from 'lucide-react';
import {
  formatCurrency,
  getArgentinaToday,
} from '@/utils/formatters';
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
    [
      'all',
      isEn ? 'Total jobs' : 'Total de trabajos',
      summary.total,
      Briefcase,
    ],
    ['pending', isEn ? 'Pending' : 'Pendientes', summary.pending, Clock3],
    [
      'completed',
      isEn ? 'Completed' : 'Completados',
      summary.completed,
      CheckCircle2,
    ],
    [
      'workers',
      isEn ? 'Workers involved' : 'Trabajadores involucrados',
      summary.workers,
      Users,
    ],
    [
      'locations',
      isEn ? 'Places served' : 'Lugares atendidos',
      summary.locations,
      MapPin,
    ],
  ];
  const pending = jobs
    .filter((job) => normalizeJobStatus(job.estado || job.status) === 'pending')
    .slice(0, 3);
  // Only dated records can support a claim about recent activity; this is not an audit log.
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
    ? isEn
      ? 'Loading overview…'
      : 'Cargando resumen…'
    : isEn
      ? 'Overview unavailable. See the table for details.'
      : 'Resumen no disponible. Consultá el detalle en la tabla.';
  return (
    <>
      <section aria-label={isEn ? 'Day summary' : 'Resumen del día'}>
        <div className="dashboard-section-caption">
          <span>{isEn ? 'Day overview' : 'Panorama del día'}</span>
          {hasActiveFilters && <span>{isEn ? 'Filtered' : 'Con filtros'}</span>}
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
                      'aria-pressed': isSummaryStatusCardActive(
                        key,
                        selectedStatus,
                      ),
                    }
                  : {})}
              >
                <Icon size={18} aria-hidden="true" />
                <strong>{unavailable ? '—' : value || 0}</strong>
                <span>{label}</span>
              </Tag>
            );
          })}
        </div>
        <div className="dashboard-balance">
          <h2>{isEn ? 'Estimated balance' : 'Balance estimado'}</h2>
          {[
            [isEn ? 'Charge' : 'A cobrar', summary.totalCharge],
            [isEn ? 'Worker cost' : 'Costo trabajador', summary.workerCost],
            [isEn ? 'Difference' : 'Diferencia', summary.balance],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{unavailable ? '—' : formatCurrency(value)}</strong>
            </div>
          ))}
        </div>
      </section>
      <div className="dashboard-operations">
        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <h2>
              <Clock3 size={18} />
              {today
                ? isEn
                  ? 'Pending today'
                  : 'Pendientes de hoy'
                : isEn
                  ? 'Pending for this date'
                  : 'Pendientes de la fecha'}
            </h2>
          </div>
          <p className="dashboard-note">
            {isEn
              ? 'Up to 3 pending jobs on the current page.'
              : 'Hasta 3 trabajos pendientes de la página actual.'}
          </p>
          {unavailable ? (
            <p className="dashboard-inline-empty" role="status">
              {statusMessage}
            </p>
          ) : pending.length ? (
            <ul className="dashboard-job-list">
              {pending.map((job) => (
                <li key={job.id}>
                  <button type="button" onClick={() => onView(job.id)}>
                    <span>
                      <strong>{job.title || job.description}</strong>
                      <span>
                        {job.location || '—'} ·{' '}
                        {job.workers?.display_name ||
                          job.workers?.alias ||
                          (isEn ? 'Unassigned' : 'Sin asignar')}
                      </span>
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dashboard-inline-empty">
              <CheckCircle2 size={28} />
              <strong>
                {allClear
                  ? isEn
                    ? 'All caught up'
                    : 'Todo al día'
                  : isEn
                    ? 'No pending jobs in this view'
                    : 'Sin pendientes en esta vista'}
              </strong>
              <p>
                {allClear
                  ? today
                    ? isEn
                      ? 'No pending jobs for today'
                      : 'No hay trabajos pendientes para hoy'
                    : isEn
                      ? 'No pending jobs for this date'
                      : 'No hay trabajos pendientes para esta fecha'
                  : isEn
                    ? 'Check the filters or other pages.'
                    : 'Revisá los filtros o las otras páginas.'}
              </p>
            </div>
          )}
        </section>
        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <h2>
              <Activity size={18} />
              {isEn ? 'Recent activity' : 'Actividad reciente'}
            </h2>
          </div>
          <p className="dashboard-note">
            {isEn
              ? 'Latest record updates on the current page.'
              : 'Últimos registros actualizados de la página actual.'}
          </p>
          {unavailable ? (
            <p className="dashboard-inline-empty" role="status">
              {statusMessage}
            </p>
          ) : recent.length ? (
            <ul className="dashboard-job-list">
              {recent.map(({ job, time, modified }) => (
                <li key={job.id}>
                  <button type="button" onClick={() => onView(job.id)}>
                    <span>
                      <strong>{job.title || job.description}</strong>
                      <span>
                        {modified
                          ? isEn
                            ? 'Updated'
                            : 'Actualizado'
                          : isEn
                            ? 'Created'
                            : 'Creado'}{' '}
                        ·{' '}
                        {new Intl.DateTimeFormat(isEn ? 'en-GB' : 'es-AR', {
                          timeZone: 'America/Argentina/Buenos_Aires',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(time)}{' '}
                        ·{' '}
                        {getJobStatusLabel(
                          normalizeJobStatus(job.estado || job.status),
                          isEn,
                        )}
                      </span>
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dashboard-inline-empty">
              <Activity size={28} />
              <strong>
                {isEn
                  ? 'No recent activity available'
                  : 'Sin actividad reciente disponible'}
              </strong>
              <p>
                {isEn
                  ? 'There are no dated updates in this view.'
                  : 'No hay actualizaciones con fecha en esta vista.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
