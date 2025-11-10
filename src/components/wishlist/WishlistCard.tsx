import React from 'react';
import { Star, Heart, ExternalLink, Trash2 } from 'lucide-react';
import { calculateDiscount, formatTimeAgo } from '../../utils';

interface WishlistItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  rating: number;
  reviewCount: number;
  description: string;
  dateAdded: string;
}

interface WishlistCardProps {
  product: WishlistItem;
  viewMode: 'grid' | 'list';
  onRemove: (productId: string, productName: string) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({ product, viewMode, onRemove }) => {
  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 ${
      viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
    }`}>
      <div className={`relative ${viewMode === 'list' ? 'w-full md:w-48 flex-shrink-0' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === 'list' ? 'h-48 md:h-full' : 'h-48'
          }`}
        />
        <button
          onClick={() => onRemove(product.productId, product.name)}
          className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" />
        </button>
        {product.originalPrice && (
          <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            {calculateDiscount(product.price, product.originalPrice)}% OFF
          </div>
        )}
      </div>

      <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-purple-400 transition-colors truncate">
              {product.name}
            </h3>
            <p className="text-gray-400 text-sm">{product.brand}</p>
          </div>
          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0">
            {product.store}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-400">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base sm:text-lg text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Added {formatTimeAgo(product.dateAdded)}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm">
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>View Product</span>
          </button>
          <button
            onClick={() => onRemove(product.productId, product.name)}
            className="p-2 bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
