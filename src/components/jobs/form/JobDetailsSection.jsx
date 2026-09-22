import React from 'react';

export default function JobDetailsSection({
  formData,
  setFormData,
  errors,
  actionTypeOptions,
  sectorTypeOptions
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Tipo de acción</label>
          <select
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            value={formData.action_type || ''}
            onChange={e => setFormData({ ...formData, action_type: e.target.value })}
            required
          >
            <option value="">Seleccionar...</option>
            {actionTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.action_type && <span className="text-xs text-red-500">{errors.action_type}</span>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Sector / equipo</label>
          <select
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            value={formData.sector_type || ''}
            onChange={e => {
              const nextValue = e.target.value;
              setFormData({
                ...formData,
                sector_type: nextValue,
                sector_custom: nextValue === 'Otro' ? formData.sector_custom : '',
              });
            }}
            required
          >
            <option value="">Seleccionar...</option>
            {sectorTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.sector_type && <span className="text-xs text-red-500">{errors.sector_type}</span>}
        </div>
      </div>

      {formData.sector_type === 'Otro' && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Especificar sector o equipo</label>
          <input
            type="text"
            maxLength={120}
            className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-400"
            value={formData.sector_custom || ''}
            onChange={e => setFormData({ ...formData, sector_custom: e.target.value })}
            placeholder="Ej: Cámara de fermentación"
          />
          {errors.sector_custom && <span className="text-xs text-red-500">{errors.sector_custom}</span>}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-slate-100">Descripción</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-400"
          rows="2"
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detalles del trabajo, referencias, etc."
          required
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
      </div>
    </>
  );
}
