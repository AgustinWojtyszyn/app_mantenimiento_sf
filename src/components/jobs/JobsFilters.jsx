import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import LocationCombobox from '@/components/jobs/LocationCombobox';

export default function JobsFilters({
  compact = false,
  isEn,
  date,
  searchTerm,
  selectedLocation,
  selectedStatus,
  requestedBy,
  locationOptions,
  pageSize,
  onDateChange,
  onSearchChange,
  onLocationChange,
  onStatusChange,
  onRequestedByChange,
  onPageSizeChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const hasAdvancedFilters = Boolean(requestedBy || selectedLocation !== 'all');

  if (!compact) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[12rem_minmax(0,1fr)_18rem_13rem_16rem_12rem] gap-3 items-end">
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
            <span className="mb-1 block">{isEn ? 'Date' : 'Fecha'}</span>
            <input data-tour="filtro-fecha" type="date" value={date} onChange={onDateChange} className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-base text-gray-900 outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
            <span className="mb-1 block">{isEn ? 'Search' : 'Búsqueda'}</span>
            <input type="search" value={searchTerm} onChange={onSearchChange} className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-base text-gray-900 outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
        </div>
      </div>
    );
  }

  return (
    <section className="dashboard-filters" aria-label={isEn ? 'Job filters' : 'Filtros de trabajos'}>
      <div className="dashboard-filter-primary">
        <label>
          <span>{isEn ? 'Date' : 'Fecha'}</span>
          <input
            data-tour="filtro-fecha"
            type="date"
            value={date}
            onChange={onDateChange}
          />
        </label>

        <label className="dashboard-search-field">
          <span>{isEn ? 'Search' : 'Búsqueda'}</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="jobs-search"
              type="search"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={isEn ? 'Search jobs…' : 'Buscar trabajos…'}
              className="pl-9"
            />
          </div>
        </label>

        <label>
          <span>{isEn ? 'Status' : 'Estado'}</span>
          <select value={selectedStatus} onChange={onStatusChange} aria-label={isEn ? 'Status' : 'Estado'}>
            <option value="all">{isEn ? 'All' : 'Todos'}</option>
            <option value="pending">{isEn ? 'Pending' : 'Pendientes'}</option>
            <option value="in_progress">{isEn ? 'In progress' : 'En proceso'}</option>
            <option value="completed">{isEn ? 'Completed' : 'Completados'}</option>
            <option value="cancelled">{isEn ? 'Cancelled' : 'Cancelados'}</option>
          </select>
        </label>

        <button
          type="button"
          className="dashboard-filter-toggle"
          aria-expanded={expanded}
          aria-controls="daily-filter-more"
          onClick={() => setExpanded((value) => !value)}
        >
          <SlidersHorizontal size={16} />
          <span>
            {isEn ? 'More filters' : 'Más filtros'}
            {hasAdvancedFilters ? (isEn ? ' · Active' : ' · Activos') : ''}
          </span>
          <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      </div>

      <div id="daily-filter-more" className="dashboard-filter-more" data-expanded={expanded}>
        <div className="dashboard-location-field">
          <span>{isEn ? 'Place' : 'Lugar'}</span>
          <LocationCombobox value={selectedLocation} options={locationOptions} onChange={onLocationChange} />
        </div>

        <label>
          <span>{isEn ? 'Requester' : 'Solicitante'}</span>
          <input
            type="search"
            value={requestedBy}
            onChange={onRequestedByChange}
            placeholder={isEn ? 'Requested by…' : 'Quién solicitó…'}
            aria-label={isEn ? 'Requester' : 'Solicitante'}
          />
        </label>

        <label>
          <span>{isEn ? 'Rows per page' : 'Registros por página'}</span>
          <select value={pageSize} onChange={onPageSizeChange} aria-label={isEn ? 'Rows per page' : 'Registros por página'}>
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </section>
  );
}
