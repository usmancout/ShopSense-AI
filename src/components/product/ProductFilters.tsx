import React from 'react';
import { Star } from 'lucide-react';

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
  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4">Filters</h3>

      <div>
        <h4 className="font-medium mb-3 text-sm sm:text-base">Category</h4>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All Categories">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="font-medium mb-3 text-sm sm:text-base">Store</h4>
        <select
          value={selectedStore}
          onChange={(e) => onStoreChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All Stores">All Stores</option>
          <option value="Martello">Martello</option>
          <option value="Prodexa">Prodexa</option>
          <option value="Storenta">Storenta</option>
        </select>
      </div>

      <div>
        <h4 className="font-medium mb-3 text-sm sm:text-base">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>${priceRange[0]}</span>
            <span>-</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3 text-sm sm:text-base">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1, 0].map(rating => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={minRating === rating}
                onChange={(e) => onRatingChange(parseInt(e.target.value))}
                className="text-purple-600"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs sm:text-sm text-gray-300">
                  {rating === 0 ? 'All' : `${rating}+ stars`}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
