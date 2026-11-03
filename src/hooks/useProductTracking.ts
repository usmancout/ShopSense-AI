import { useCallback } from 'react';
import axios from 'axios';
import { Product } from '../data/products';

const LOCAL_SEARCHES_KEY = 'shopsense_search_history';
const LOCAL_VIEWS_KEY = 'shopsense_viewed_products';
const LOCAL_ACTIVITY_KEY = 'shopsense_activity_log';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useProductTracking = () => {
  const trackSearch = useCallback(async (query: string, category?: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    try {
      const rawSearches = localStorage.getItem(LOCAL_SEARCHES_KEY);
      const searches = rawSearches ? JSON.parse(rawSearches) : [];
      const nextSearches = [
        {
          query: cleanQuery,
          category: category !== 'All Categories' ? category : undefined,
          timestamp: new Date().toISOString()
        },
        ...(Array.isArray(searches) ? searches.filter((s: any) => s.query !== cleanQuery) : [])
      ].slice(0, 15);
      localStorage.setItem(LOCAL_SEARCHES_KEY, JSON.stringify(nextSearches));

      const rawActivity = localStorage.getItem(LOCAL_ACTIVITY_KEY);
      const activity = rawActivity ? JSON.parse(rawActivity) : [];
      const nextActivity = [
        {
          type: 'search',
          description: `Searched for "${cleanQuery}"`,
          timestamp: new Date().toISOString()
        },
        ...(Array.isArray(activity) ? activity : [])
      ].slice(0, 20);
      localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(nextActivity));
    } catch {
      // Ignore storage errors
    }

    const token = localStorage.getItem('token');
    if (!token || token.startsWith('local-jwt-')) return;
    try {
      await axios.post(
        `${API_BASE}/api/auth/search-history`,
        {
          query: cleanQuery,
          category: category !== 'All Categories' ? category : undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        }
      );
    } catch {
      // Local tracking already stored
    }
  }, []);

  const trackProductView = useCallback(async (product: Product) => {
    try {
      const rawViews = localStorage.getItem(LOCAL_VIEWS_KEY);
      const views = rawViews ? JSON.parse(rawViews) : [];
      const nextViews = [
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          store: product.store,
          timestamp: new Date().toISOString()
        },
        ...(Array.isArray(views) ? views.filter((v: any) => v.productId !== product.id) : [])
      ].slice(0, 25);
      localStorage.setItem(LOCAL_VIEWS_KEY, JSON.stringify(nextViews));

      const rawActivity = localStorage.getItem(LOCAL_ACTIVITY_KEY);
      const activity = rawActivity ? JSON.parse(rawActivity) : [];
      const nextActivity = [
        {
          type: 'product_view',
          description: `Viewed "${product.name}"`,
          timestamp: new Date().toISOString()
        },
        ...(Array.isArray(activity) ? activity : [])
      ].slice(0, 20);
      localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(nextActivity));
    } catch {
      // Ignore storage errors
    }

    const token = localStorage.getItem('token');
    if (!token || token.startsWith('local-jwt-')) return;
    try {
      await axios.post(
        `${API_BASE}/api/auth/product-view`,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          store: product.store,
          url: product.url
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        }
      );
    } catch {
      // Local tracking already stored
    }
  }, []);

  return { trackSearch, trackProductView };
};
