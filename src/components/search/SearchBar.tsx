import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit, onClear }) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="relative flex items-center w-full bg-white border-2 border-slate-200/90 focus-within:border-emerald-600 rounded-2xl p-1.5 shadow-sm transition-all">
        <div className="pl-3.5 pr-2 text-emerald-600 pointer-events-none flex items-center">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search any product to compare prices, distances & customer reviews across marts..."
          className="w-full py-2.5 pr-4 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
        />
        {value.trim().length > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            className="p-2 mr-1 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 sm:px-6 py-2.5 rounded-xl shadow-sm transition-colors text-xs sm:text-sm flex-shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
};
