import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { WishlistCard } from '../components/wishlist';
import { Spinner, Notification } from '../components/ui';
import { useNotification } from '../hooks';
import { getLocalWishlistItems, saveLocalWishlistItems, StoredWishlistItem } from '../hooks/useWishlist';

const sortOptions = [
  { value: 'dateAdded', label: 'Recently Added' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<StoredWishlistItem[]>(() => getLocalWishlistItems());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [isLoading, setIsLoading] = useState(false);

  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: { pathname: '/wishlist' } }, replace: true });
      return;
    }
    fetchWishlist();
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
    const local = getLocalWishlistItems();
    setWishlistItems(local);

    const token = localStorage.getItem('token');
    if (!token || token.startsWith('local-jwt-')) return;

    try {
      setIsLoading(local.length === 0);
      const response = await axios.get(`${API_BASE}/api/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2500
      });
      if (Array.isArray(response.data?.wishlist) && response.data.wishlist.length > 0) {
        setWishlistItems(response.data.wishlist);
        saveLocalWishlistItems(response.data.wishlist);
      }
    } catch {
      // Keep local wishlist items
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string, productName: string) => {
    const updated = wishlistItems.filter(item => item.productId !== productId);
    setWishlistItems(updated);
    saveLocalWishlistItems(updated);
    showNotification('success', `"${productName}" removed from saved items`);

    const token = localStorage.getItem('token');
    if (token && !token.startsWith('local-jwt-')) {
      try {
        await axios.delete(`${API_BASE}/api/auth/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        });
      } catch {
        // Already removed locally
      }
    }
  };

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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">Saved Products</h1>
          <p className="text-slate-500 text-sm sm:text-base">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved • Total value: ${totalValue.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
            <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
              <Heart className="h-14 w-14 text-emerald-600/70 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No saved products yet</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Save products while searching to compare their store prices and customer reviews anytime.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
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
