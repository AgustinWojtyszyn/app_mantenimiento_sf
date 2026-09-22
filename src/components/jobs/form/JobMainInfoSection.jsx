import React from 'react';
import { X } from 'lucide-react';

export default function JobMainInfoSection({
  formData,
  setFormData,
  errors,
  locationSearch,
  setLocationSearch,
  filteredLocationOptions,
  showStatus = false
}) {
  const showLocationOptions = Boolean(
    locationSearch?.trim() && locationSearch.trim() !== (formData.location || '').trim()
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Fecha *</label>
          <input
            type="date"
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
          {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
        </div>

        {showStatus ? (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Estado</label>
            <select
              className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            {errors.status && <span className="text-xs text-red-500">{errors.status}</span>}
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Título</label>
            <input
              type="text"
              maxLength="120"
              className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Reparación TV sala principal"
            />
            {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
          </div>
        )}
      </div>

      {showStatus && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Título</label>
          <input
            type="text"
            maxLength="120"
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            value={formData.title || ''}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Reparación TV sala principal"
          />
          <div className="mt-1 flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-slate-400">
            <span>Opcional. Si queda vacío, se usa la descripción como referencia.</span>
            <span>{(formData.title || '').length}/120</span>
          </div>
          {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Ubicación</label>
          <input
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            value={locationSearch}
            onChange={e => setLocationSearch(e.target.value)}
            placeholder="Buscar empresa..."
          />

          {showLocationOptions && (
            <div className="absolute left-0 right-0 z-20 mt-1 max-h-36 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {formData.location && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, location: '' });
                    setLocationSearch('');
                  }}
                  className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-red-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>Quitar selección</span>
                  <X className="h-4 w-4" />
                </button>
              )}
              {filteredLocationOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-slate-400">Sin resultados</div>
              ) : (
                filteredLocationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, location: option });
                      setLocationSearch(option);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-800 ${
                      formData.location === option ? 'bg-blue-100 dark:bg-slate-800' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          )}

          {formData.location && (
            <div className="mt-1 text-xs text-gray-600 dark:text-slate-300">
              Seleccionado: <span className="font-semibold">{formData.location}</span>
            </div>
          )}
          {errors.location && <span className="text-xs text-red-500">{errors.location}</span>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Quién solicita</label>
          <input
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            value={formData.requested_by || ''}
            onChange={e => setFormData({ ...formData, requested_by: e.target.value })}
            placeholder="Nombre del solicitante"
            required
          />
          {errors.requested_by && <span className="text-xs text-red-500">{errors.requested_by}</span>}
        </div>
      </div>

      {!showStatus && (
        <p className="text-xs text-gray-500 dark:text-slate-400">
          El título es opcional; si queda vacío, se usa la descripción como referencia principal.
        </p>
      )}
    </>
  );
}
