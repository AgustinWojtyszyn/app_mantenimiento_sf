
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { getMonthStart, getMonthEnd } from '@/utils/dates';
import { getJobStatusBadgeClass, getJobStatusLabel, normalizeJobStatus } from '@/utils/jobStatus';
import './monthlyDashboard.css';
import { Briefcase, Clock3, CheckCircle2, TrendingUp, Trash2, MessageCircle, FileSpreadsheet, Eye, Edit2, MoreHorizontal } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ExcelExportButton from '@/components/common/ExcelExportButton';
import JobFilters from '@/components/jobs/JobFilters';
import { useFilters } from '@/hooks/useFilters';
import { Button } from '@/components/ui/button';
import { exportService } from '@/services/export.service';
import { jobsService } from '@/services/jobs.service';
import { onboardingService } from '@/services/onboarding.service';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import JobForm from '@/components/jobs/JobForm';
import {
  applyMonthlyPanelFilters,
  buildMonthlyLocationOptions,
  buildMonthlyPeriodSummary,
  createLatestRequestGuard,
  getPreviousDateRange,
  normalizeDateOnly,
  paginateMonthlyJobs,
  shouldApplyMonthlyJobsResult
} from '@/pages/monthlyPanel.helpers';

const DEBUG_MAINTENANCE = false;

export default function MonthlyPanelPage() {
  const { user, isAdmin, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getJobsByDateRange, loading } = useJobs();
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const { resumeTourIfNeeded } = useOnboardingTour();
  const isEn = language === 'en';
  const role = ['admin', 'solicitante', 'trabajador', 'chofer'].includes(userRole)
    ? userRole
    : (isAdmin ? 'admin' : 'solicitante');
  const [jobs, setJobs] = useState([]);
  const [clearing, setClearing] = useState(false);
  const [clearingPending, setClearingPending] = useState(false);
  const [exportingCompleted, setExportingCompleted] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const appliedIncomingFiltersRef = useRef(false);
  const mountedRef = useRef(false);
  const requestGuardRef = useRef(createLatestRequestGuard());
  const summaryRequestGuardRef = useRef(createLatestRequestGuard());
  
  // Use filter hook for state management
  const { filters, setFilter } = useFilters({
      startDate: getMonthStart(),
      endDate: getMonthEnd(),
      status: 'all',
      groupId: 'all',
      workerId: 'all',
      requestedBy: '',
      location: 'all',
      search: ''
  });

  const handleFilterChange = useCallback((key, value) => {
    setCurrentPage(1);
    setFilter(key, value);
  }, [setFilter]);

  useEffect(() => {
    const incomingState = location.state;
    if (!incomingState?.fromWorkerActivity || appliedIncomingFiltersRef.current) return;

    const nextStartDate = incomingState.startDate || filters.startDate;
    const nextEndDate = incomingState.endDate || filters.endDate;
    const nextWorkerId = incomingState.workerId || 'all';

    setCurrentPage(1);
    setFilter('startDate', nextStartDate);
    setFilter('endDate', nextEndDate);
    setFilter('workerId', nextWorkerId);
    appliedIncomingFiltersRef.current = true;
  }, [location.state, filters.startDate, filters.endDate, setFilter]);

  const handleRetrySummary = () => {
    void fetchMonthlySummary();
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchJobs = useCallback(async () => {
    const requestId = requestGuardRef.current.next();
    const queryFilters = {
      startDate: filters.startDate,
      endDate: filters.endDate,
      currentUserId: user?.id,
      requestedBy: filters.requestedBy,
    };
    const result = await getJobsByDateRange(filters.startDate, filters.endDate, queryFilters);
    if (!shouldApplyMonthlyJobsResult({
      isMounted: mountedRef.current,
      isLatest: requestGuardRef.current.isLatest(requestId)
    })) return;
    if (result.success) setJobs(result.data);
  }, [
    filters.startDate,
    filters.endDate,
    filters.requestedBy,
    user?.id,
    getJobsByDateRange
  ]);

  const fetchMonthlySummary = useCallback(async () => {
    if (!user || !filters.startDate || !filters.endDate) {
      setSummary(null);
      setSummaryError('');
      return;
    }

    const requestId = summaryRequestGuardRef.current.next();
    setSummaryLoading(true);
    setSummaryError('');

    const previousRange = getPreviousDateRange(filters.startDate, filters.endDate);
    const currentQueryFilters = {
      startDate: filters.startDate,
      endDate: filters.endDate,
      currentUserId: user?.id,
      status: 'all',
      groupId: filters.groupId === 'all' ? null : filters.groupId,
      workerId: filters.workerId === 'all' ? null : filters.workerId,
      requestedBy: filters.requestedBy,
      location: filters.location === 'all' ? null : filters.location,
      search: filters.search,
    };
    const previousQueryFilters = {
      ...currentQueryFilters,
      startDate: previousRange.startDate,
      endDate: previousRange.endDate,
    };

    try {
      const [currentResult, previousResult] = await Promise.all([
        getJobsByDateRange(filters.startDate, filters.endDate, currentQueryFilters),
        getJobsByDateRange(previousRange.startDate, previousRange.endDate, previousQueryFilters),
      ]);
      if (!shouldApplyMonthlyJobsResult({
        isMounted: mountedRef.current,
        isLatest: summaryRequestGuardRef.current.isLatest(requestId)
      })) return;

      if (!currentResult.success || !previousResult.success) {
        throw new Error(currentResult.error || previousResult.error || 'No se pudo cargar el resumen.');
      }

      const nextSummary = buildMonthlyPeriodSummary({
        currentJobs: currentResult.data || [],
        previousJobs: previousResult.data || [],
        normalizeStatus: normalizeStatusValue,
        isEn,
      });
      setSummary(nextSummary);
    } catch (error) {
      if (!shouldApplyMonthlyJobsResult({
        isMounted: mountedRef.current,
        isLatest: summaryRequestGuardRef.current.isLatest(requestId)
      })) return;
      setSummary(null);
      setSummaryError(error?.message || (isEn ? 'The summary could not be loaded.' : 'No se pudo cargar el resumen.'));
    } finally {
      if (shouldApplyMonthlyJobsResult({
        isMounted: mountedRef.current,
        isLatest: summaryRequestGuardRef.current.isLatest(requestId)
      })) {
        setSummaryLoading(false);
      }
    }
  }, [filters.startDate, filters.endDate, filters.groupId, filters.workerId, filters.requestedBy, filters.location, filters.search, user?.id, getJobsByDateRange, isEn]);

  useEffect(() => {
    if (user && filters.startDate && filters.endDate) {
      fetchJobs();
      void fetchMonthlySummary();
      return;
    }

    // An incomplete date range must never keep showing results from the
    // previously selected period. Invalidate any in-flight responses too.
    requestGuardRef.current.next();
    summaryRequestGuardRef.current.next();
    setJobs([]);
    setSummary(null);
    setSummaryError('');
    setSummaryLoading(false);
    setCurrentPage(1);
  }, [user, filters.startDate, filters.endDate, filters.groupId, filters.workerId, filters.requestedBy, filters.location, filters.search, fetchJobs, fetchMonthlySummary]);

  useEffect(() => {
    if (!user) return;
    resumeTourIfNeeded({
      role,
      onComplete: () => onboardingService.setOnboardingCompleted(user.id, role)
    });
  }, [user, role, resumeTourIfNeeded]);

  const workerOptions = useMemo(() => (
    jobs.reduce((acc, job) => {
      if (!job?.worker_id) return acc;
      if (!acc.some((w) => w.id === job.worker_id)) {
        const label = job.workers?.display_name || job.workers?.alias || job.worker_id;
        acc.push({ id: job.worker_id, name: label });
      }
      return acc;
    }, [])
  ), [jobs]);

  const normalizeStatusValue = (record) => normalizeJobStatus(record?.estado || record?.status);
  const getRawStatusValue = (record) => String(record?.estado ?? record?.status ?? '');
  const isWithinSelectedRange = (record) => {
    const recordDate = normalizeDateOnly(record?.date || record?.fecha);
    const start = normalizeDateOnly(filters.startDate);
    const end = normalizeDateOnly(filters.endDate);
    if (!recordDate || !start || !end) return false;
    return recordDate >= start && recordDate <= end;
  };
  const filteredJobs = useMemo(
    () => applyMonthlyPanelFilters(jobs, filters, normalizeStatusValue),
    [jobs, filters]
  );
  const summaryCards = useMemo(() => {
    if (!summary?.current) return [];
    return [
      { key: 'all', label: isEn ? 'Total jobs' : 'Total de trabajos', value: summary.current.total, delta: summary.current.total - summary.previous.total },
      { key: 'pending', label: isEn ? 'Pending' : 'Pendientes', value: summary.current.pending, delta: summary.current.pending - summary.previous.pending },
      { key: 'completed', label: isEn ? 'Completed' : 'Completados', value: summary.current.completed, delta: summary.current.completed - summary.previous.completed },
    ];
  }, [isEn, summary]);
  const periodLabel = useMemo(() => {
    const start = new Date(`${filters.startDate}T12:00:00`);
    const end = new Date(`${filters.endDate}T12:00:00`);
    if (!filters.startDate || !filters.endDate || !Number.isFinite(+start) || !Number.isFinite(+end) || start > end) return isEn ? 'Select a date range' : 'Seleccioná un rango de fechas';
    const formatter = new Intl.DateTimeFormat(isEn ? 'en-GB' : 'es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    return isEn ? `Operational summary for ${formatter.formatRange(start, end)}` : `Resumen operativo del ${formatter.formatRange(start, end).replace('–', ' al ')}`;
  }, [filters.startDate, filters.endDate, isEn]);
  const trend = useMemo(() => {
    const start = normalizeDateOnly(filters.startDate);
    const end = normalizeDateOnly(filters.endDate);
    if (!start || !end || start > end) return [];
    const counts = new Map();
    filteredJobs.forEach(job => {
      const date = normalizeDateOnly(job.date || job.fecha);
      if (date >= start && date <= end) counts.set(date, (counts.get(date) || 0) + 1);
    });
    const points = [];
    const cursor = new Date(`${start}T00:00:00Z`);
    const last = new Date(`${end}T00:00:00Z`);
    while (cursor <= last) {
      const date = cursor.toISOString().slice(0, 10);
      points.push({ date, count: counts.get(date) || 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return points;
  }, [filteredJobs, filters.startDate, filters.endDate]);
  const trendMax = trend.reduce((max, point) => Math.max(max, point.count), 1);
  const [activeTrendIndex, setActiveTrendIndex] = useState(null);
  const activeTrend = trend[activeTrendIndex];
  const locationOptions = useMemo(() => buildMonthlyLocationOptions(jobs), [jobs]);
  const pagination = useMemo(
    () => paginateMonthlyJobs(filteredJobs, currentPage, rowsPerPage),
    [filteredJobs, currentPage, rowsPerPage]
  );
  const paginatedJobs = pagination.records;
  const hasJobs = filteredJobs.length > 0;
  const clearDisabled = clearing || loading;
  const clearPendingDisabled = clearingPending || loading;

  useEffect(() => {
    if (currentPage !== pagination.currentPage) {
      setCurrentPage(pagination.currentPage);
    }
  }, [currentPage, pagination.currentPage]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const visiblePageNumbers = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

    const pages = new Set([1, total, current - 1, current, current + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= total)
      .sort((a, b) => a - b);
  }, [pagination.currentPage, pagination.totalPages]);

  const isCompletedRecord = (record) => {
    const normalized = normalizeStatusValue(record);
    return normalized === 'completed';
  };
  const getStatusMeta = (job) => {
    const normalized = normalizeStatusValue(job);
    return {
      badgeClass: getJobStatusBadgeClass(normalized),
      label: getJobStatusLabel(normalized, isEn),
    };
  };
  const completedJobsInView = useMemo(
    () => filteredJobs.filter((record) => isCompletedRecord(record) && isWithinSelectedRange(record)),
    [filteredJobs, filters.startDate, filters.endDate]
  );
  const pendingJobsInView = useMemo(
    () => filteredJobs.filter((record) => normalizeStatusValue(record) === 'pending' && isWithinSelectedRange(record)),
    [filteredJobs, filters.startDate, filters.endDate]
  );

  useEffect(() => {
    const allRawStatuses = jobs.map(getRawStatusValue);
    const allStatuses = jobs.map(normalizeStatusValue).filter(Boolean);
    const filteredStatuses = filteredJobs.map(normalizeStatusValue).filter(Boolean);
    const uniqueRawStatuses = Array.from(new Set(allRawStatuses)).sort();
    const uniqueStatuses = Array.from(new Set(allStatuses)).sort();
    const statusCounts = allStatuses.reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    if (DEBUG_MAINTENANCE) {
      console.group('[MonthlyPanel] Diagnóstico exportación completados');
      console.log('Filtros activos', {
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
        groupId: filters.groupId,
        workerId: filters.workerId,
        requestedBy: filters.requestedBy,
        location: filters.location,
        search: filters.search
      });
      console.log('Total registros cargados', jobs.length);
      console.log('Total registros filtrados en pantalla', filteredJobs.length);
      console.log('Total registros completados (pantalla)', completedJobsInView.length);
      const dateValues = jobs.map((job) => normalizeDateOnly(job?.date || job?.fecha)).filter(Boolean).sort();
      console.log('Fecha desde (filtro UI/backend)', filters.startDate);
      console.log('Fecha hasta (filtro UI/backend)', filters.endDate);
      console.log('Fecha mínima jobs recibidos', dateValues[0] || null);
      console.log('Fecha máxima jobs recibidos', dateValues[dateValues.length - 1] || null);
      console.log('Estados únicos RAW (dataset cargado)', uniqueRawStatuses);
      console.log('Estados únicos normalizados (dataset cargado)', uniqueStatuses);
      console.log('Conteo por estado normalizado', statusCounts);
      console.log('Estados en pantalla (muestra)', filteredStatuses.slice(0, 20));
      if (filters.status && filters.status !== 'all') {
        console.warn(`Filtro de estado activo: "${filters.status}". Esto limita lo exportable.`);
      }
      console.groupEnd();
    }
  }, [jobs, filteredJobs, completedJobsInView.length, filters]);

  const handleShare = () => {
    if (!filteredJobs || filteredJobs.length === 0) return;
    const title = isEn
      ? `Monthly orders ${filters.startDate} to ${filters.endDate}`
      : `Órdenes mensuales ${filters.startDate} a ${filters.endDate}`;
    exportService.shareJobsViaWhatsApp(filteredJobs, title);
  };

  const handleExportCompletedExcel = () => {
    // Usa registros visibles (ya respetan fecha/estado/grupo/trabajador/búsqueda).
    const completedRecords = completedJobsInView;

    if (completedRecords.length === 0) {
      addToast(
        isEn
          ? 'No completed records to export with the active filters.'
          : 'No hay registros completados para exportar con los filtros activos.',
        'error'
      );
      return;
    }

    if (!mountedRef.current) return;
    setExportingCompleted(true);
    setTimeout(async () => {
      if (!mountedRef.current) return;
      if (DEBUG_MAINTENANCE) {
        console.log('[MonthlyPanel] Fechas de completados exportados', completedRecords.map((r) => ({
          id: r.id,
          date: r.date || r.fecha || null,
          normalizedDate: normalizeDateOnly(r.date || r.fecha || null),
          status: r.status || r.estado || null
        })));
      }
      try {
        await exportService.exportRecordsToExcel(
          completedRecords,
          'mantenimiento-completados.xlsx',
          'Completados'
        );
      } catch (error) {
        addToast(isEn ? 'Export failed.' : 'No se pudo exportar el Excel.', 'error');
      } finally {
        if (mountedRef.current) setExportingCompleted(false);
      }
    }, 300);
  };

  const handleClearCompleted = async () => {
    if (!isAdmin) {
      addToast(isEn ? 'Only administrators can clean completed jobs.' : 'Solo los administradores pueden limpiar trabajos completados.', 'error');
      return;
    }
    if (!mountedRef.current) return;

    setClearing(true);
    const result = await jobsService.deleteJobsByIds(completedJobsInView, { actorId: user?.id || null });

    if (!mountedRef.current) return;
    if (result.success) {
      const removed = result.removed || 0;
      addToast(
        removed === 0
          ? (isEn ? 'No completed jobs match the active filters.' : 'No hay trabajos completados con los filtros activos.')
          : (isEn ? `Removed ${removed} completed jobs.` : `Se eliminaron ${removed} trabajos completados.`),
        'success'
      );
      await Promise.all([fetchJobs(), fetchMonthlySummary()]);
    } else {
      addToast(result.error, 'error');
    }
    if (mountedRef.current) setClearing(false);
  };

  const handleClearPending = async () => {
    if (!isAdmin) {
      addToast(isEn ? 'Only administrators can clean pending jobs.' : 'Solo los administradores pueden limpiar trabajos pendientes.', 'error');
      return;
    }
    if (!mountedRef.current) return;

    setClearingPending(true);
    const result = await jobsService.deleteJobsByIds(pendingJobsInView, { actorId: user?.id || null });

    if (!mountedRef.current) return;
    if (result.success) {
      const removed = result.removed || 0;
      addToast(
        removed === 0
          ? (isEn ? 'No pending jobs match the active filters.' : 'No hay trabajos pendientes con los filtros activos.')
          : (isEn ? `Removed ${removed} pending jobs.` : `Se eliminaron ${removed} trabajos pendientes.`),
        'success'
      );
      await Promise.all([fetchJobs(), fetchMonthlySummary()]);
    } else {
      addToast(result.error, 'error');
    }
    if (mountedRef.current) setClearingPending(false);
  };

  const handleDeleteJob = async (jobId) => {
    if (!jobId || deletingJobId) return;
    if (!mountedRef.current) return;
    setDeletingJobId(jobId);
    const result = await jobsService.deleteJob(jobId, { actorId: user?.id || null });
    if (!mountedRef.current) return;
    addToast(
      result.success
        ? (isEn ? 'Job deleted.' : 'Solicitud eliminada.')
        : (result.error || (isEn ? 'Could not delete job.' : 'No se pudo eliminar la solicitud.')),
      result.success ? 'success' : 'error'
    );
    if (result.success) {
      await fetchJobs();
    }
    if (mountedRef.current) {
      setDeletingJobId(null);
    }
  };

  return (
    <div className="monthly-dashboard">
      <div className="monthly-header">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[#082b59] dark:text-slate-50 md:text-3xl">{t('monthlyPage.title')}</h1>
          <p>{periodLabel}</p>
        </div>

        <div className="monthly-actions">
          <details className="relative w-full sm:w-auto">
            <summary className="flex h-10 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto">
              <MoreHorizontal className="h-4 w-4" />
              {isEn ? 'Actions' : 'Acciones'}
            </summary>
            <div className="absolute right-0 z-30 mt-2 grid w-full min-w-[250px] gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:w-72">
              <Button
                type="button"
                variant="ghost"
                onClick={handleShare}
                disabled={!hasJobs || loading}
                className="h-10 w-full justify-start gap-2 text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4" />
                {isEn ? 'Share WhatsApp' : 'Compartir WhatsApp'}
              </Button>
              <ExcelExportButton
                jobs={filteredJobs}
                grouped={true}
                startDate={filters.startDate}
                endDate={filters.endDate}
                label={isEn ? 'Export to Excel' : 'Exportar a Excel'}
                icon={FileSpreadsheet}
                className="h-10 w-full justify-start bg-emerald-50 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={handleExportCompletedExcel}
                disabled={loading || exportingCompleted}
                className="h-10 w-full justify-start gap-2 text-sm font-semibold"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {isEn ? 'Export completed' : 'Exportar completados'}
              </Button>
              <ConfirmationModal
                title={isEn ? 'Clean completed?' : '¿Limpiar completados?'}
                description={isEn ? 'Delete completed jobs that match the active filters.' : 'Eliminar los trabajos completados que coinciden con los filtros activos.'}
                confirmLabel={isEn ? 'Delete' : 'Eliminar'}
                onConfirm={handleClearCompleted}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={clearDisabled}
                    className="h-10 w-full justify-start gap-2 text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    {clearing ? (isEn ? 'Cleaning...' : 'Limpiando...') : (isEn ? 'Clear completed' : 'Limpiar completados')}
                  </Button>
                }
              />
              <ConfirmationModal
                title={isEn ? 'Clean pending?' : '¿Limpiar pendientes?'}
                description={isEn ? 'Delete pending jobs that match the active filters.' : 'Eliminar los trabajos pendientes que coinciden con los filtros activos.'}
                confirmLabel={isEn ? 'Delete pending' : 'Eliminar pendientes'}
                onConfirm={handleClearPending}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={clearPendingDisabled}
                    className="h-10 w-full justify-start gap-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 hover:text-amber-900 dark:text-amber-200 dark:hover:bg-amber-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    {clearingPending ? (isEn ? 'Cleaning pending...' : 'Limpiando pendientes...') : (isEn ? 'Clear pending' : 'Limpiar pendientes')}
                  </Button>
                }
              />
            </div>
          </details>
        </div>
      </div>

      <div data-tour="panel-mensual-filtros">
        <JobFilters compact filters={filters} onChange={handleFilterChange} workers={workerOptions} locations={locationOptions} isEn={isEn} />
      </div>
      <section className="monthly-summary" aria-label={isEn ? 'Period summary' : 'Resumen del período'}>
        <div className="monthly-section-heading">
          <h2>{isEn ? 'Period summary' : 'Resumen del período'}</h2>
          <span>{isEn ? 'Essential indicators · comparison with the previous period' : 'Indicadores esenciales · comparación con el período anterior'}</span>
        </div>

        {summaryLoading ? (
          <div className="monthly-kpis" role="status" aria-label={isEn ? 'Loading summary' : 'Cargando resumen'}>
            {[0, 1, 2].map((i) => <div key={i} className="monthly-kpi monthly-skeleton" />)}
          </div>
        ) : summaryError ? (
          <div className="monthly-empty" role="alert">
            <p>{summaryError}</p>
            <Button variant="outline" size="sm" onClick={handleRetrySummary}>{isEn ? 'Retry' : 'Reintentar'}</Button>
          </div>
        ) : summary ? (
          <>
            <div className="monthly-kpis">
              {summaryCards.map((card, index) => {
                const Icon = [Briefcase, Clock3, CheckCircle2][index];
                const delta = new Intl.NumberFormat(isEn ? 'en-GB' : 'es-AR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(card.delta);
                return (
                  <div key={card.key} className={`monthly-kpi monthly-kpi--${card.key}`}>
                    <Icon size={18} aria-hidden="true" />
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <small>
                      {card.delta === 0
                        ? (isEn ? 'No change from previous period' : 'Sin cambios frente al período anterior')
                        : `${delta} ${isEn ? 'vs. previous period' : 'vs. período anterior'}`}
                    </small>
                  </div>
                );
              })}
            </div>

            <div className="monthly-summary-line">
              <span>
                {isEn ? 'Compliance' : 'Cumplimiento'}
                <strong>{summary.current.completionRate.toLocaleString(isEn ? 'en-GB' : 'es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</strong>
                {summary.current.complianceDelta !== 0 ? (
                  <small>
                    {new Intl.NumberFormat(isEn ? 'en-GB' : 'es-AR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(summary.current.complianceDelta)} {isEn ? 'pts' : 'puntos'}
                  </small>
                ) : null}
              </span>
              <span>{isEn ? 'Workers' : 'Trabajadores'} <strong>{summary.current.workers}</strong></span>
              <span>{isEn ? 'Places' : 'Lugares'} <strong>{summary.current.locations}</strong></span>
            </div>

            <div className="monthly-finance-strip">
              {[
                [isEn ? 'To charge' : 'A cobrar', summary.current.amountToCharge],
                [isEn ? 'Worker cost' : 'Costo trabajadores', summary.current.workerCost],
                [isEn ? 'Difference' : 'Diferencia', summary.current.difference],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{formatCurrency(value)}</strong>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="monthly-empty">{isEn ? 'Select a complete date range to load the summary.' : 'Seleccioná un rango completo para cargar el resumen.'}</p>
        )}
      </section>

      {trend.length > 0 ? (
        <details className="monthly-trend-details">
          <summary>
            <span><TrendingUp size={17} aria-hidden="true" />{isEn ? 'Daily trend' : 'Tendencia diaria'}</span>
            <small>{isEn ? 'Open chart' : 'Ver gráfico'}</small>
          </summary>
          <section className="monthly-trend" aria-label={isEn ? 'Daily job trend' : 'Tendencia diaria de trabajos'}>
            {loading ? (
              <p className="monthly-empty" role="status">{isEn ? 'Loading trend…' : 'Cargando tendencia…'}</p>
            ) : filteredJobs.length === 0 ? (
              <p className="monthly-empty">{isEn ? 'No jobs to plot with these filters.' : 'No hay trabajos para graficar con estos filtros.'}</p>
            ) : (
              <>
                <div className="monthly-chart-readout" aria-live="polite">
                  {activeTrend
                    ? `${formatDate(activeTrend.date)} · ${activeTrend.count} ${isEn ? 'jobs' : 'trabajos'}`
                    : (isEn ? 'Explore the chart to see each day' : 'Explorá el gráfico para ver cada día')}
                </div>
                <div className="monthly-chart-plot">
                  <div className="monthly-chart-scale" aria-hidden="true">
                    <span>{trendMax}</span><span>{Number((trendMax / 2).toFixed(1))}</span><span>0</span>
                  </div>
                  <svg className="monthly-chart" viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label={isEn ? 'Number of jobs per day in the selected period' : 'Cantidad de trabajos por día del período seleccionado'}>
                    {[0, 0.5, 1].map((fraction) => <g key={fraction}><line x1="30" x2="990" y1={126 - fraction * 112} y2={126 - fraction * 112} /></g>)}
                    <polyline points={trend.map((point, index) => `${30 + (index / Math.max(1, trend.length - 1)) * 960},${126 - (point.count / trendMax) * 112}`).join(' ')} />
                    {trend.map((point, index) => (
                      <circle
                        key={point.date}
                        cx={30 + (index / Math.max(1, trend.length - 1)) * 960}
                        cy={126 - (point.count / trendMax) * 112}
                        r={trend.length > 90 ? 2 : 4}
                        tabIndex={0}
                        onFocus={() => setActiveTrendIndex(index)}
                        onMouseEnter={() => setActiveTrendIndex(index)}
                        onBlur={() => setActiveTrendIndex(null)}
                        onMouseLeave={() => setActiveTrendIndex(null)}
                        aria-label={`${formatDate(point.date)}: ${point.count}`}
                      >
                        <title>{formatDate(point.date)}: {point.count}</title>
                      </circle>
                    ))}
                  </svg>
                </div>
                <div className="monthly-chart-dates"><span>{formatDate(filters.startDate)}</span><span>{formatDate(filters.endDate)}</span></div>
              </>
            )}
          </section>
        </details>
      ) : null}

      <section className="monthly-table-panel" data-tour="panel-mensual-tabla">
        <div className="monthly-section-heading"><h2>{isEn ? 'Period jobs' : 'Trabajos del período'}</h2><span>{filteredJobs.length} {isEn ? 'records' : 'registros'}</span></div>
        <table className="monthly-table">
          <thead><tr>{[isEn ? 'Date' : 'Fecha', isEn ? 'Description' : 'Descripción', isEn ? 'Created by' : 'Creado por', isEn ? 'Status' : 'Estado', isEn ? 'Actions' : 'Acciones'].map(label => <th key={label}>{label}</th>)}</tr></thead>
          <tbody>{paginatedJobs.length === 0 ? <tr><td colSpan={5} className="monthly-empty">{loading ? (isEn ? 'Loading jobs…' : 'Cargando trabajos…') : t('monthlyPage.emptyDesc')}</td></tr> : paginatedJobs.map(job => {
            const statusMeta = getStatusMeta(job);
            const worker = job.workers?.display_name || job.workers?.alias;
            return <tr key={job.id}>
              <td data-label={isEn ? 'Date' : 'Fecha'}>{formatDate(job.date)}</td>
              <td data-label={isEn ? 'Description' : 'Descripción'}><strong>{job.title || job.description}</strong><small>{[job.location, job.groups?.name].filter(Boolean).join(' · ') || '—'}</small></td>
              <td data-label={isEn ? 'Created by' : 'Creado por'}><span>{job.creator?.full_name || job.creator?.email || '—'}</span>{worker && <small>{worker}</small>}</td>
              <td data-label={isEn ? 'Status' : 'Estado'}><span className={`monthly-status ${statusMeta.badgeClass}`}>{statusMeta.label}</span></td>
              <td data-label={isEn ? 'Actions' : 'Acciones'}><div className="monthly-row-actions">
                <button type="button" aria-label={`${isEn ? 'View details' : 'Ver detalle'}: ${job.title || job.description}`} title={isEn ? 'View details' : 'Ver detalle'} onClick={() => navigate(`/app/jobs/${job.id}`)}><Eye size={17} /></button>
                <details className="monthly-row-menu" onKeyDown={e => { if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary').focus(); } }}>
                  <summary aria-label={`${isEn ? 'Actions' : 'Acciones'}: ${job.title || job.description}`}><MoreHorizontal size={18} /></summary>
                  <div className="monthly-menu-items">
                    <button type="button" onClick={(e) => { e.currentTarget.closest('details').open = false; setEditingJob(job); }}><Edit2 size={15} />{isEn ? 'Edit' : 'Editar'}</button>
                    <ConfirmationModal title={isEn ? 'Delete request?' : '¿Eliminar solicitud?'} description={isEn ? 'This will delete the selected request.' : 'Se eliminará la solicitud seleccionada.'} confirmLabel={isEn ? 'Delete' : 'Eliminar'} onConfirm={() => handleDeleteJob(job.id)} trigger={<button type="button" className="monthly-delete" disabled={deletingJobId === job.id}><Trash2 size={15} />{deletingJobId === job.id ? (isEn ? 'Deleting…' : 'Eliminando…') : (isEn ? 'Delete' : 'Eliminar')}</button>} />
                  </div>
                </details>
              </div></td>
            </tr>;
          })}</tbody>
        </table>
        <div className="border-t border-gray-100 px-4 py-4 dark:border-slate-800 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-300 sm:flex-row sm:items-center sm:gap-4">
              <label className="flex items-center gap-2 font-medium">
                <span>Filas por página:</span>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#1e3a8a] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  aria-label="Filas por página"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <span>
                {filteredJobs.length === 0
                  ? 'Mostrando 0 de 0 registros'
                  : `Mostrando ${pagination.startIndex + 1}-${pagination.endIndex} de ${filteredJobs.length} registros`}
              </span>
              <span>
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={pagination.currentPage === 1}
                className="w-auto"
              >
                Anterior
              </Button>
              {visiblePageNumbers.map((page, index) => {
                const previous = visiblePageNumbers[index - 1];
                const showGap = previous && page - previous > 1;
                return (
                  <React.Fragment key={page}>
                    {showGap ? (
                      <span className="px-1 text-sm text-gray-400" aria-hidden="true">...</span>
                    ) : null}
                    <Button
                      type="button"
                      variant={page === pagination.currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-9 w-9 px-0"
                      aria-label={`Ir a página ${page}`}
                      aria-current={page === pagination.currentPage ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="w-auto"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </section>

      {loading ? <LoadingSpinner /> : null}
      {editingJob && (
        <JobForm
          jobToEdit={editingJob}
          onSuccess={() => {
            if (!mountedRef.current) return;
            setEditingJob(null);
            void fetchJobs();
          }}
        />
      )}
    </div>
  );
}
