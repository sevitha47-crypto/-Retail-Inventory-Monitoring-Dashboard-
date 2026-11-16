import React, { useRef } from 'react';
import { Filter, CheckSquare, Square, RotateCcw, Upload, Database, MapPin, Building2, Tag, Users, Calendar } from 'lucide-react';
import { FilterState } from '../types/inventory';

interface SidebarFiltersProps {
  availableBranches: string[];
  availableCities: string[];
  availableProductLines: string[];
  availableCustomerTypes: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  onUploadCsv: (file: File) => void;
  onRestoreDefault: () => void;
  totalRecordsCount: number;
  filteredRecordsCount: number;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  availableBranches,
  availableCities,
  availableProductLines,
  availableCustomerTypes,
  filters,
  onFilterChange,
  onResetFilters,
  onUploadCsv,
  onRestoreDefault,
  totalRecordsCount,
  filteredRecordsCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleBranch = (b: string) => {
    const next = filters.branches.includes(b)
      ? filters.branches.filter((item) => item !== b)
      : [...filters.branches, b];
    onFilterChange({ ...filters, branches: next });
  };

  const selectAllBranches = () => {
    onFilterChange({ ...filters, branches: [...availableBranches] });
  };

  const toggleCity = (c: string) => {
    const next = filters.cities.includes(c)
      ? filters.cities.filter((item) => item !== c)
      : [...filters.cities, c];
    onFilterChange({ ...filters, cities: next });
  };

  const selectAllCities = () => {
    onFilterChange({ ...filters, cities: [...availableCities] });
  };

  const toggleProductLine = (p: string) => {
    const next = filters.productLines.includes(p)
      ? filters.productLines.filter((item) => item !== p)
      : [...filters.productLines, p];
    onFilterChange({ ...filters, productLines: next });
  };

  const selectAllProductLines = () => {
    onFilterChange({ ...filters, productLines: [...availableProductLines] });
  };

  const toggleCustomerType = (ct: string) => {
    const next = filters.customerTypes.includes(ct)
      ? filters.customerTypes.filter((item) => item !== ct)
      : [...filters.customerTypes, ct];
    onFilterChange({ ...filters, customerTypes: next });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCsv(file);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">🔎 Filter Options</h3>
            <p className="text-[11px] text-slate-400">Streamlit-style Multiselect</p>
          </div>
        </div>
        <button
          onClick={onResetFilters}
          title="Reset All Filters"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Dataset status & records badge */}
      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" /> Matched Rows:
          </span>
          <span className="font-mono font-bold text-indigo-300">
            {filteredRecordsCount} / {totalRecordsCount}
          </span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(filteredRecordsCount / Math.max(totalRecordsCount, 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Filter 1: Branch Multiselect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" /> Select Branch
          </label>
          <button
            onClick={selectAllBranches}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            All
          </button>
        </div>
        <div className="space-y-1">
          {availableBranches.map((branch) => {
            const isSelected = filters.branches.includes(branch);
            return (
              <button
                key={branch}
                onClick={() => toggleBranch(branch)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 text-white border border-blue-500/40'
                    : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  {branch}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Branch
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 2: City Multiselect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Select City
          </label>
          <button
            onClick={selectAllCities}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            All
          </button>
        </div>
        <div className="space-y-1">
          {availableCities.map((city) => {
            const isSelected = filters.cities.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600/30 text-white border border-emerald-500/40'
                    : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  {city}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  City
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 3: Customer Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-purple-400" /> Customer Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableCustomerTypes.map((ct) => {
            const isSelected = filters.customerTypes.includes(ct);
            return (
              <button
                key={ct}
                onClick={() => toggleCustomerType(ct)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600/30 text-white border border-purple-500/50'
                    : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {ct}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 4: Product Line Category */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" /> Product Categories
          </label>
          <button
            onClick={selectAllProductLines}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            All
          </button>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {availableProductLines.map((prod) => {
            const isSelected = filters.productLines.includes(prod);
            return (
              <button
                key={prod}
                onClick={() => toggleProductLine(prod)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all truncate flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-slate-600'}`} />
                <span className="truncate">{prod}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Custom CSV action */}
      <div className="pt-4 border-t border-slate-800 space-y-2 mt-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Upload Custom Supermarket CSV</span>
        </button>

        <button
          onClick={onRestoreDefault}
          className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300 transition-colors py-1"
        >
          Reload Default Dataset
        </button>
      </div>
    </div>
  );
};
