import React, { useState, useEffect } from 'react';
import { Heart, Star, ExternalLink, Trash2, TrendingUp, Filter, Grid, List, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sortOptions = [
    { value: 'dateAdded', label: 'Recently Added' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    sortWishlist();
  }, [sortBy]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ssa-serverr.onrender.com/api/auth/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(response.data.wishlist || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ssa-serverr.onrender.com/api/auth/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  const sortWishlist = () => {
    const sorted = [...wishlistItems].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dateAdded':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });
    setWishlistItems(sorted);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return time.toLocaleDateString();
  };

  const calculateTotalValue = () => {
    return wishlistItems.reduce((sum, item) => sum + item.price, 0);
  };

  const WishlistItemComponent: React.FC<{ product: WishlistItem }> = ({ product }) => (
      <div className={`bg-gray-800 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 ${
          viewMode === 'list' ? 'flex' : ''
      }`}>
        <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
          <img
              src={product.image}
              alt={product.name}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  viewMode === 'list' ? 'h-full' : 'h-48'
              }`}
          />
          <button
              onClick={() => removeFromWishlist(product.productId)}
              className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
          >
            <Heart className="h-5 w-5 text-white fill-current" />
          </button>
          {product.originalPrice && (
              <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
          )}
        </div>

        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-400 text-sm">{product.brand}</p>
            </div>
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
            {product.store}
          </span>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                  <Star
                      key={i}
                      className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                  />
              ))}
            </div>
            <span className="text-sm text-gray-400">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Added {formatTimeAgo(product.dateAdded)}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>View Product</span>
            </button>
            <button
                onClick={() => removeFromWishlist(product.productId)}
                className="p-2 bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
  );

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Checking authentication...</p>
          </div>
        </div>
    );
  }

  if (isLoading) {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                  onClick={fetchWishlist}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-400">
              {wishlistItems.length} items saved • Total value: ${calculateTotalValue().toLocaleString()}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-gray-700'
                    }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-gray-700'
                    }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <button className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                ))}
              </select>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length > 0 ? (
              <div className={`grid gap-6 ${
                  viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
              }`}>
                {wishlistItems.map(product => (
                    <WishlistItemComponent key={product.productId} product={product} />
                ))}
              </div>
          ) : (
              <div className="text-center py-16">
                <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
                  <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-400 mb-6">
                    Start adding products you love to keep track of them and get price alerts.
                  </p>
                  <a
                      href="/search"
                      className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Browse Products
                  </a>
                </div>
              </div>
          )}

          {/* Price Tracking Info */}
          {wishlistItems.length > 0 && (
              <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Price Tracking Enabled</h3>
                    <p className="text-gray-300">
                      We'll notify you when prices drop on your wishlist items.
                      You've saved an average of 15% on tracked items this month!
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Sharing */}
          {wishlistItems.length > 0 && (
              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-4">Share Your Wishlist</h3>
                <div className="flex items-center justify-center space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                    Share on Facebook
                  </button>
                  <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors">
                    Share on Twitter
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default Wishlist;