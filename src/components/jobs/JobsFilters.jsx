import React from 'react';
import { Search } from 'lucide-react';
import LocationCombobox from '@/components/jobs/LocationCombobox';

export default function JobsFilters({
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
  const inputClass = 'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#1e3a8a]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50';

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-4">
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[9rem_minmax(11rem,1.1fr)_minmax(13rem,1.4fr)_9rem_minmax(11rem,1fr)_9rem]">
        <label className="min-w-0 block text-sm font-semibold text-gray-700 dark:text-slate-200">
          <span className="mb-1 block">{isEn ? 'Date' : 'Fecha'}</span>
          <input
            data-tour="filtro-fecha"
            type="date"
            className={inputClass}
            value={date}
            onChange={onDateChange}
          />
        </label>

        <div className="min-w-0">
          <label htmlFor="jobs-search" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-slate-200">
            {isEn ? 'Search' : 'Búsqueda'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="jobs-search"
              type="search"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={isEn ? 'Search jobs...' : 'Buscar trabajos...'}
              className={`${inputClass} pl-9 dark:placeholder:text-slate-400`}
            />
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-slate-200">
            {isEn ? 'Place' : 'Lugar'}
          </p>
          <LocationCombobox
            value={selectedLocation}
            options={locationOptions}
            onChange={onLocationChange}
          />
        </div>

        <label className="min-w-0 block text-sm font-semibold text-gray-700 dark:text-slate-200">
          <span className="mb-1 block">{isEn ? 'Status' : 'Estado'}</span>
          <select
            value={selectedStatus}
            onChange={onStatusChange}
            className={inputClass}
            aria-label={isEn ? 'Status' : 'Estado'}
          >
            <option value="all">{isEn ? 'All' : 'Todos'}</option>
            <option value="pending">{isEn ? 'Pending' : 'Pendientes'}</option>
            <option value="in_progress">{isEn ? 'In progress' : 'En proceso'}</option>
            <option value="completed">{isEn ? 'Completed' : 'Completados'}</option>
            <option value="cancelled">{isEn ? 'Cancelled' : 'Cancelados'}</option>
          </select>
        </label>

        <label className="min-w-0 block text-sm font-semibold text-gray-700 dark:text-slate-200">
          <span className="mb-1 block">{isEn ? 'Requester' : 'Solicitante'}</span>
          <input
            type="search"
            value={requestedBy}
            onChange={onRequestedByChange}
            placeholder={isEn ? 'Requested by...' : 'Quién solicitó...'}
            className={`${inputClass} dark:placeholder:text-slate-400`}
            aria-label={isEn ? 'Requester' : 'Solicitante'}
          />
        </label>

        <label className="min-w-0 block text-sm font-semibold text-gray-700 dark:text-slate-200">
          <span className="mb-1 block">{isEn ? 'Rows per page' : 'Registros por página'}</span>
          <select
            value={pageSize}
            onChange={onPageSizeChange}
            className={inputClass}
            aria-label={isEn ? 'Rows per page' : 'Registros por página'}
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  );
}
