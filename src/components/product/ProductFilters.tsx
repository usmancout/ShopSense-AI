import React from 'react';
import { Star, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStore: string;
  onStoreChange: (store: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStore,
  onStoreChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All Categories' ||
    selectedStore !== 'All Stores' ||
    priceRange[1] < 3500 ||
    minRating > 0;

  const handleReset = () => {
    onCategoryChange('All Categories');
    onStoreChange('All Stores');
    onPriceChange([0, 3500]);
    onRatingChange(0);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Category
        </h4>
        <div className="space-y-1">
          {['All Categories', ...categories].map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <span>{category}</span>
                {active && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Store Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Store
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {['All Stores', 'Martello', 'Prodexa', 'Storenta'].map((store) => {
            const active = selectedStore === store;
            return (
              <button
                key={store}
                type="button"
                onClick={() => onStoreChange(store)}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {store === 'All Stores' ? 'All' : store}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Max Price
          </h4>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Up to ${priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="3500"
          step="50"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1">
          <span>$0</span>
          <span>$1,750</span>
          <span>$3,500</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2, 0].map(rating => {
            const active = minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onRatingChange(rating)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all border ${
                  active
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rating ? 'text-amber-400 fill-current' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {rating === 0 ? 'All Ratings' : `${rating}.0 & up`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
