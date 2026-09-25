import React, { useEffect, useId, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/customSupabaseClient";
import LocationCombobox from "@/components/jobs/LocationCombobox";
import DateRangePicker from "@/components/common/DateRangePicker";

export default function JobFilters({
  filters,
  onChange,
  showDates = true,
  showClear = true,
  compact = false,
  workers = [],
  locations = [],
  isEn = false,
}) {
  const [groups, setGroups] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const uniqueId = useId();
  const requestedByInputId = `job-filters-requested-by-${uniqueId}`;

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from("groups").select("id, name");
      if (data) setGroups(data);
    };
    fetchGroups();
  }, []);

  const handleChange = (key, value) => {
    onChange(key, value);
  };

  const handleClear = () => {
    handleChange("startDate", "");
    handleChange("endDate", "");
    handleChange("status", "all");
    handleChange("groupId", "all");
    handleChange("workerId", "all");
    handleChange("location", "all");
    handleChange("requestedBy", "");
    handleChange("search", "");
  };

  if (compact) {
    const active = Object.values(filters).some(
      (value) => value && value !== "all",
    );
    const statuses = [
      ["all", isEn ? "All" : "Todos"],
      ["pending", isEn ? "Pending" : "Pendiente"],
      ["in_progress", isEn ? "In progress" : "En proceso"],
      ["completed", isEn ? "Completed" : "Completado"],
      ["cancelled", isEn ? "Cancelled" : "Cancelado"],
    ];
    return (
      <div className="monthly-filters">
        <button
          type="button"
          className="monthly-filter-toggle"
          aria-expanded={isExpanded}
          aria-controls={`monthly-fields-${uniqueId}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter size={16} /> {isEn ? "Filters" : "Filtros"}{" "}
          {isExpanded ? <X size={16} /> : null}
        </button>
        <div
          id={`monthly-fields-${uniqueId}`}
          className="monthly-filter-grid"
          data-expanded={isExpanded}
        >
          <label className="monthly-search">
            {isEn ? "Search" : "Búsqueda"}
            <input
              type="search"
              placeholder={isEn ? "Search jobs…" : "Buscar trabajos…"}
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
            />
          </label>
          <label>
            {isEn ? "From" : "Desde"}
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </label>
          <label>
            {isEn ? "To" : "Hasta"}
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </label>
          <label>
            {isEn ? "Status" : "Estado"}
            <select
              aria-label={isEn ? "Status" : "Estado"}
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {statuses.map(([value, name]) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {isEn ? "Group" : "Grupo"}
            <select
              aria-label={isEn ? "Group" : "Grupo"}
              value={filters.groupId}
              onChange={(e) => handleChange("groupId", e.target.value)}
            >
              <option value="all">{isEn ? "All" : "Todos"}</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {isEn ? "Worker" : "Trabajador"}
            <select
              aria-label={isEn ? "Worker" : "Trabajador"}
              value={filters.workerId}
              onChange={(e) => handleChange("workerId", e.target.value)}
            >
              <option value="all">{isEn ? "All" : "Todos"}</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>
          <div className="monthly-location">
            <span>{isEn ? "Place" : "Lugar"}</span>
            <LocationCombobox
              value={filters.location}
              options={locations}
              onChange={(value) => handleChange("location", value)}
            />
          </div>
          <label>
            {isEn ? "Requester initial" : "Solicitante (inicial)"}
            <input
              type="search"
              maxLength={1}
              placeholder={isEn ? "Initial" : "Inicial"}
              value={filters.requestedBy || ""}
              onChange={(e) => handleChange("requestedBy", e.target.value)}
            />
          </label>
          {showClear && active && (
            <button
              type="button"
              className="monthly-clear"
              onClick={handleClear}
            >
              <X size={15} />
              {isEn ? "Clear filters" : "Limpiar filtros"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all duration-300">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start">
        {/* Search Bar - Always Visible */}
        <div className="relative min-w-0 flex-1">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-slate-400" />
          <input
            type="text"
            className="w-full pl-10 py-3 px-3 text-base md:text-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-400"
            placeholder="Buscar por descripción, ubicación..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        {/* Desktop Filters / Mobile Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between h-11 md:h-12 text-base md:text-lg"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtros
            </span>
            {isExpanded ? <X className="w-5 h-5" /> : null}
          </Button>
        </div>

        <div
          className={`
            min-w-0 flex-col gap-4 items-start lg:flex-1 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end
            ${isExpanded ? "flex" : "hidden lg:flex"}
        `}
        >
          {/* Date Range */}
          {showDates && (
            <DateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={handleChange}
              onClear={() => {
                handleChange("startDate", "");
                handleChange("endDate", "");
              }}
            />
          )}

          {/* Status */}
          <div className="w-full lg:w-52">
            <select
              className="w-full py-3 px-3 text-base md:text-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none text-gray-900 dark:text-slate-50"
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="all">Estado: Todos</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Group */}
          <div className="w-full lg:w-52">
            <select
              className="w-full py-3 px-3 text-base md:text-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none text-gray-900 dark:text-slate-50"
              value={filters.groupId}
              onChange={(e) => handleChange("groupId", e.target.value)}
            >
              <option value="all">Grupo: Todos</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full min-w-0 lg:w-56">
            <label htmlFor={requestedByInputId} className="sr-only">
              Inicial del solicitante
            </label>
            <input
              id={requestedByInputId}
              type="search"
              maxLength={1}
              className="w-full py-3 px-3 text-base md:text-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none text-gray-900 dark:text-slate-50 placeholder:text-gray-400 dark:placeholder:text-slate-400"
              placeholder="Inicial solicitante"
              value={filters.requestedBy || ""}
              onChange={(e) => handleChange("requestedBy", e.target.value)}
              aria-label="Inicial del solicitante"
            />
          </div>

          {/* Clear Button */}
          {showClear && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              title="Limpiar filtros"
              className="text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 w-11 h-11"
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
