import { useState, useEffect, useCallback } from 'react';
import { WishlistItem, Product } from '../types';
import { ApiService } from '../services/api';
import { mockProducts } from '../data/products';

interface UseWishlistReturn {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  clearError: () => void;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from API, fallback to mock data
      try {
        const items = await ApiService.getWishlist();
        setWishlistItems(items);
      } catch (apiError) {
        console.warn('Wishlist API not available, using mock data:', apiError);
        
        // Fallback to mock wishlist data
        const mockWishlistItems: WishlistItem[] = mockProducts.slice(0, 6).map((product, index) => ({
          id: `wishlist-${product.id}`,
          userId: '1',
          productId: product.id,
          product,
          addedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        setWishlistItems(mockWishlistItems);
      }
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      setError(null);
      
      // Find product in mock data for fallback
      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      try {
        const newItem = await ApiService.addToWishlist(productId);
        setWishlistItems(prev => [...prev, newItem]);
        
        // Track activity
        await ApiService.trackActivity('wishlist_add', `Added ${product.name} to wishlist`, { productId });
      } catch (apiError) {
        console.warn('Wishlist API not available, using local state:', apiError);
        
        // Fallback to local state management
        const newItem: WishlistItem = {
          id: `wishlist-${productId}-${Date.now()}`,
          userId: '1',
          productId,
          product,
          addedAt: new Date().toISOString()
        };
        
        setWishlistItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      setError('Failed to add item to wishlist. Please try again.');
      throw error;
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      setError(null);
      
      // Find product for activity tracking
      const wishlistItem = wishlistItems.find(item => item.productId === productId);
      
      try {
        await ApiService.removeFromWishlist(productId);
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        
        // Track activity
        if (wishlistItem) {
          await ApiService.trackActivity('wishlist_remove', `Removed ${wishlistItem.product.name} from wishlist`, { productId });
        }
      } catch (apiError) {
        console.warn('Wishlist API not available, using local state:', apiError);
        
        // Fallback to local state management
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      setError('Failed to remove item from wishlist. Please try again.');
      throw error;
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  const refreshWishlist = useCallback(async () => {
    await fetchWishlist();
  }, [fetchWishlist]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlistItems,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
    clearError
  };
};