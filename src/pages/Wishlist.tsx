import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { WishlistCard } from '../components/wishlist';
import { Spinner, Notification } from '../components/ui';
import { useNotification } from '../hooks';

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

const sortOptions = [
  { value: 'dateAdded', label: 'Recently Added' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
];

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const sortedWishlist = useMemo(() => {
    const sorted = [...wishlistItems];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'dateAdded':
      default:
        return sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
  }, [wishlistItems, sortBy]);

  const totalValue = useMemo(() => {
    return wishlistItems.reduce((sum, item) => sum + item.price, 0);
  }, [wishlistItems]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/wishlist`, {
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

  const removeFromWishlist = async (productId: string, productName: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      showNotification('success', `"${productName}" removed from wishlist`);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      showNotification('error', 'Failed to remove item from wishlist');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-400 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Spinner />
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
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {wishlistItems.length} items saved • Total value: ${totalValue.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-gray-700'
                }`}
              >
                <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-gray-700'
                }`}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
          }`}>
            {sortedWishlist.map(product => (
              <WishlistCard
                key={product.productId}
                product={product}
                viewMode={viewMode}
                onRemove={removeFromWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base">
                Start adding products you love to keep track of them and get price alerts.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="inline-block bg-purple-600 hover:bg-purple-700 px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
