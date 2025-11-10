import React from 'react';
import { Star, Heart, ExternalLink } from 'lucide-react';
import { Product } from '../../data/products';
import { calculateDiscount } from '../../utils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isInWishlist?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  isInWishlist = false,
  onToggleWishlist,
  onProductClick
}) => {
  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
    }`}>
      <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-48 flex-shrink-0' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === 'list' ? 'h-48 sm:h-full' : 'h-48'
          }`}
        />
        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(product)}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-gray-900/80 rounded-full backdrop-blur-sm hover:bg-gray-900 transition-colors"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                isInWishlist ? 'text-red-500 fill-current' : 'text-white'
              }`}
            />
          </button>
        )}
        {!product.inStock && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base sm:text-lg text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onProductClick?.(product)}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>View Product</span>
          </a>
        </div>
      </div>
    </div>
  );
};
