import React from 'react';
import { Filter, Grid, List } from 'lucide-react';

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
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 bg-gray-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Filters</span>
        </button>
        <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 sm:p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 sm:p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            <List className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <span className="text-gray-400 text-sm">{resultsCount} results</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={selectedMart}
          onChange={(e) => onMartChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="Select Mart">Select Mart</option>
          {martLocations.map(mart => (
            <option key={mart.id} value={mart.id}>{mart.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
