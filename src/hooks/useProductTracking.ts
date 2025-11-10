import { useCallback } from 'react';
import axios from 'axios';
import { Product } from '../data/products';

export const useProductTracking = () => {
  const trackSearch = useCallback(async (query: string, category?: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/search-history`, {
        query,
        category: category !== 'All Categories' ? category : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }, []);

  const trackProductView = useCallback(async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/product-view`, {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        store: product.store,
        url: product.url
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  }, []);

  return { trackSearch, trackProductView };
};
