import { useState, useEffect, useCallback } from 'react';
import { DashboardStats, UserActivity, Product } from '../types';
import { ApiService } from '../services/api';
import { mockProducts } from '../data/products';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  recentActivity: UserActivity[];
  recommendedProducts: Product[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from API, fallback to mock data
      try {
        const [statsData, activityData, recommendationsData] = await Promise.all([
          ApiService.getDashboardStats(),
          ApiService.getRecentActivity(),
          ApiService.getRecommendedProducts()
        ]);

        setStats(statsData);
        setRecentActivity(activityData);
        setRecommendedProducts(recommendationsData);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        
        // Fallback to mock data
        const mockStats: DashboardStats = {
          totalSearches: 247,
          wishlistItems: 12,
          productsViewed: 156,
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
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              userId: '1',
              type: 'wishlist_add',
              description: 'Added Nike Air Jordan to wishlist',
              createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              userId: '1',
              type: 'view',
              description: 'Viewed trending products',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          recommendedProducts: mockProducts.slice(0, 4)
        };

        setStats(mockStats);
        setRecentActivity(mockStats.recentActivity);
        setRecommendedProducts(mockStats.recommendedProducts);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refreshData = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    recommendedProducts,
    isLoading,
    error,
    refreshData
  };
};