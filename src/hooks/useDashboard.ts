import { useState, useEffect, useCallback } from 'react';
import { DashboardStats, UserActivity, Product } from '../types';
import { ApiService } from '../services/api';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  recentActivity: UserActivity[];
  recommendedProducts: Product[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  clearError: () => void;
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

      // Fetch all dashboard data concurrently
      const [statsData, activityData, recommendationsData] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getRecentActivity(),
        ApiService.getRecommendedProducts()
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
      setRecommendedProducts(recommendationsData);
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stats,
    recentActivity,
    recommendedProducts,
    isLoading,
    error,
    refreshData,
    clearError
  };
};