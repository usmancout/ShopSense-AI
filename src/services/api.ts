import axios, { AxiosResponse } from 'axios';
import { ApiResponse, DashboardStats, WishlistItem, Product, UserActivity } from '../types';
import { handleError, withRetry, logError } from '../utils/errorHandling';
import { StorageService } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
    const appError = handleError(error);
    logError(appError, 'API Request');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Utility function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success && response.data.data !== undefined) {
    return response.data.data;
  }
  throw new Error(response.data.error || response.data.message || 'API request failed');
};

// Utility function to simulate API delay for testing
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators for fallback
const generateMockDashboardStats = (): DashboardStats => ({
  totalSearches: Math.floor(Math.random() * 500) + 100,
  wishlistItems: Math.floor(Math.random() * 20) + 5,
  productsViewed: Math.floor(Math.random() * 300) + 50,
  recentSearches: [
    'iPhone 15 Pro',
    'Nike Air Jordan',
    'MacBook Air M3',
    'Sony Headphones',
    'Instant Pot'
  ],
  recentActivity: [
    {
      id: '1',
      userId: '1',
      type: 'search',
      description: 'Searched for "iPhone 15 Pro"',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      metadata: { query: 'iPhone 15 Pro' }
    },
    {
      id: '2',
      userId: '1',
      type: 'wishlist_add',
      description: 'Added Nike Air Jordan to wishlist',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      metadata: { productId: '3' }
    },
    {
      id: '3',
      userId: '1',
      type: 'view',
      description: 'Viewed trending products',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  recommendedProducts: []
});

export class ApiService {
  // Dashboard API methods
  static async getDashboardStats(): Promise<DashboardStats> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get('/dashboard/stats');
        const data = handleApiResponse(response);
        
        // Cache successful response
        StorageService.setDashboardCache(data);
        return data;
      } catch (error) {
        // Try to return cached data first
        const cachedData = StorageService.getDashboardCache();
        if (cachedData) {
          console.warn('Using cached dashboard data due to API error');
          return cachedData;
        }
        
        // Fallback to mock data
        console.warn('API not available, using mock data');
        return generateMockDashboardStats();
      }
    });
  }

  static async getRecentActivity(): Promise<UserActivity[]> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<UserActivity[]>> = await api.get('/dashboard/activity');
        return handleApiResponse(response);
      } catch (error) {
        // Fallback to local storage or mock data
        const localActivity = StorageService.getUserActivity();
        if (localActivity.length > 0) {
          return localActivity;
        }
        return generateMockDashboardStats().recentActivity;
      }
    });
  }

  static async getRecommendedProducts(): Promise<Product[]> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<Product[]>> = await api.get('/dashboard/recommendations');
        return handleApiResponse(response);
      } catch (error) {
        // Return mock data as fallback
        const { mockProducts } = await import('../data/products');
        return mockProducts.slice(0, 4);
      }
    });
  }

  // Wishlist API methods
  static async getWishlist(): Promise<WishlistItem[]> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<WishlistItem[]>> = await api.get('/wishlist');
        return handleApiResponse(response);
      } catch (error) {
        // Return mock data as fallback
        const { mockProducts } = await import('../data/products');
        const localWishlist = StorageService.getWishlist();
        
        return mockProducts
          .filter(product => localWishlist.includes(product.id))
          .map((product, index) => ({
            id: `wishlist-${product.id}`,
            userId: '1',
            productId: product.id,
            product,
            addedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
          }));
      }
    });
  }

  static async addToWishlist(productId: string): Promise<WishlistItem> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<WishlistItem>> = await api.post('/wishlist', { productId });
        const result = handleApiResponse(response);
        
        // Update local storage
        StorageService.addToWishlist(productId);
        return result;
      } catch (error) {
        // Create mock wishlist item as fallback
        const { mockProducts } = await import('../data/products');
        const product = mockProducts.find(p => p.id === productId);
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Update local storage
        StorageService.addToWishlist(productId);
        
        return {
          id: `wishlist-${productId}-${Date.now()}`,
          userId: '1',
          productId,
          product,
          addedAt: new Date().toISOString()
        };
      }
    });
  }

  static async removeFromWishlist(productId: string): Promise<void> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/wishlist/${productId}`);
        handleApiResponse(response);
        
        // Update local storage
        StorageService.removeFromWishlist(productId);
      } catch (error) {
        // Update local storage even if API fails
        StorageService.removeFromWishlist(productId);
        console.warn('Using fallback for wishlist removal');
      }
    });
  }

  // Activity tracking
  static async trackActivity(type: UserActivity['type'], description: string, metadata?: any): Promise<void> {
    try {
      const activity = {
        id: `activity-${Date.now()}`,
        userId: '1',
        type,
        description,
        metadata,
        createdAt: new Date().toISOString()
      };
      
      // Store locally first for immediate UI updates
      StorageService.addUserActivity(activity);
      
      await simulateDelay(100); // Shorter delay for activity tracking
      await api.post('/activity', { type, description, metadata });
    } catch (error) {
      console.error('Activity tracking error:', error);
      // Don't throw error for activity tracking to avoid disrupting user experience
    }
  }

  // Product search
  static async searchProducts(query: string, filters?: any): Promise<Product[]> {
    return withRetry(async () => {
      try {
        // Store search query locally
        StorageService.addRecentSearch(query);
        
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<Product[]>> = await api.get('/products/search', {
          params: { q: query, ...filters }
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Product search error:', error);
        // Return mock data as fallback
        const { mockProducts } = await import('../data/products');
        return mockProducts.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
      }
    });
  }

  static async getProduct(productId: string): Promise<Product> {
    return withRetry(async () => {
      try {
        await simulateDelay();
        const response: AxiosResponse<ApiResponse<Product>> = await api.get(`/products/${productId}`);
        return handleApiResponse(response);
      } catch (error) {
        console.error('Product fetch error:', error);
        // Return mock data as fallback
        const { mockProducts } = await import('../data/products');
        const product = mockProducts.find(p => p.id === productId);
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      }
    });
  }

  // Utility methods for better error handling
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  static isApiAvailable(): boolean {
    // Check if we're in development mode and API might not be running
    return !import.meta.env.DEV || !!import.meta.env.VITE_API_URL;
  }

  // Batch operations for better performance
  static async batchTrackActivity(activities: Array<{ type: UserActivity['type'], description: string, metadata?: any }>): Promise<void> {
    try {
      await api.post('/activity/batch', { activities });
    } catch (error) {
      console.error('Batch activity tracking error:', error);
      // Fallback to individual tracking
      for (const activity of activities) {
        await this.trackActivity(activity.type, activity.description, activity.metadata);
      }
    }
  }
}