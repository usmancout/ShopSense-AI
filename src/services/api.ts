import axios, { AxiosResponse } from 'axios';
import { ApiResponse, DashboardStats, WishlistItem, Product, UserActivity } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  // Dashboard API methods
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get('/dashboard/stats');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch dashboard stats');
    } catch (error) {
      console.error('Dashboard stats fetch error:', error);
      throw error;
    }
  }

  static async getRecentActivity(): Promise<UserActivity[]> {
    try {
      const response: AxiosResponse<ApiResponse<UserActivity[]>> = await api.get('/dashboard/activity');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch recent activity');
    } catch (error) {
      console.error('Recent activity fetch error:', error);
      throw error;
    }
  }

  static async getRecommendedProducts(): Promise<Product[]> {
    try {
      const response: AxiosResponse<ApiResponse<Product[]>> = await api.get('/dashboard/recommendations');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch recommendations');
    } catch (error) {
      console.error('Recommendations fetch error:', error);
      throw error;
    }
  }

  // Wishlist API methods
  static async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response: AxiosResponse<ApiResponse<WishlistItem[]>> = await api.get('/wishlist');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch wishlist');
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      throw error;
    }
  }

  static async addToWishlist(productId: string): Promise<WishlistItem> {
    try {
      const response: AxiosResponse<ApiResponse<WishlistItem>> = await api.post('/wishlist', { productId });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to add to wishlist');
    } catch (error) {
      console.error('Add to wishlist error:', error);
      throw error;
    }
  }

  static async removeFromWishlist(productId: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/wishlist/${productId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      throw error;
    }
  }

  // Activity tracking
  static async trackActivity(type: UserActivity['type'], description: string, metadata?: any): Promise<void> {
    try {
      await api.post('/activity', { type, description, metadata });
    } catch (error) {
      console.error('Activity tracking error:', error);
      // Don't throw error for activity tracking to avoid disrupting user experience
    }
  }

  // Product search
  static async searchProducts(query: string, filters?: any): Promise<Product[]> {
    try {
      const response: AxiosResponse<ApiResponse<Product[]>> = await api.get('/products/search', {
        params: { q: query, ...filters }
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to search products');
    } catch (error) {
      console.error('Product search error:', error);
      throw error;
    }
  }

  static async getProduct(productId: string): Promise<Product> {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await api.get(`/products/${productId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch product');
    } catch (error) {
      console.error('Product fetch error:', error);
      throw error;
    }
  }
}