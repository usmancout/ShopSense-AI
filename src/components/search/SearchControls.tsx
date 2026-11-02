import React from 'react';
import { Filter, Grid, List, ArrowUpDown } from 'lucide-react';

interface SearchControlsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  resultsCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOptions: Array<{ value: string; label: string }>;
  martLocations: Array<{ id: string; name: string }>;
  selectedMart: string;
  onMartChange: (martId: string) => void;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  showFilters,
  onToggleFilters,
  viewMode,
  onViewModeChange,
  resultsCount,
  sortBy,
  onSortChange,
  sortOptions,
  martLocations,
  selectedMart,
  onMartChange
}) => {
  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleFilters}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border transition-all text-xs sm:text-sm font-semibold ${
            showFilters
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Filter className="h-4 w-4 text-emerald-600" />
          <span>Filters</span>
        </button>

        <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <span className="text-xs sm:text-sm text-slate-500 pl-1">
          Showing <strong className="text-slate-900 font-bold">{resultsCount}</strong> {resultsCount === 1 ? 'product' : 'products'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex items-center">
          <ArrowUpDown className="h-3.5 w-3.5 text-emerald-600 absolute left-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-semibold"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {martLocations.length > 0 && (
          <select
            value={selectedMart}
            onChange={(e) => onMartChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-semibold"
          >
            <option value="Select Mart">All Available Marts</option>
            {martLocations.map(mart => (
              <option key={mart.id} value={mart.id}>{mart.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
