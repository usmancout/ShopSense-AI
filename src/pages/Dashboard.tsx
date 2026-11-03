import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Search, Heart, Eye, Clock, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/products';
import { getLocalWishlistItems } from '../hooks/useWishlist';
import axios from 'axios';

interface DashboardStats {
  totalSearches: number;
  wishlistItems: number;
  productsViewed: number;
}

interface RecentSearch {
  query: string;
  category?: string;
  timestamp: string;
}

interface ActivityItem {
  type?: string;
  activityType?: string;
  description: string;
  timestamp: string;
}

interface RecommendedProduct {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  store: string;
  reason?: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentSearches: RecentSearch[];
  recentActivity: ActivityItem[];
  recommendations: RecommendedProduct[];
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function buildLocalDashboardData(): DashboardData {
  try {
    const wishlist = getLocalWishlistItems();
    const searches: RecentSearch[] = JSON.parse(localStorage.getItem('shopsense_search_history') || '[]');
    const views = JSON.parse(localStorage.getItem('shopsense_viewed_products') || '[]');
    const activity: ActivityItem[] = JSON.parse(localStorage.getItem('shopsense_activity_log') || '[]');

    const recommendations: RecommendedProduct[] = mockProducts.slice(0, 4).map(p => ({
      productId: p.id,
      name: p.name,
      brand: p.brand,
      price: p.lowestPrice ?? p.price,
      image: p.image,
      store: p.category,
      reason: `Top rated in ${p.category} (${p.rating}★)`
    }));

    return {
      stats: {
        totalSearches: Array.isArray(searches) ? searches.length : 0,
        wishlistItems: wishlist.length,
        productsViewed: Array.isArray(views) ? views.length : 0
      },
      recentSearches: Array.isArray(searches) ? searches : [],
      recentActivity: Array.isArray(activity) ? activity : [],
      recommendations
    };
  } catch {
    return {
      stats: { totalSearches: 0, wishlistItems: 0, productsViewed: 0 },
      recentSearches: [],
      recentActivity: [],
      recommendations: []
    };
  }
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData>(() => buildLocalDashboardData());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: { pathname: '/dashboard' } }, replace: true });
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    const localData = buildLocalDashboardData();
    setDashboardData(localData);

    const token = localStorage.getItem('token');
    if (!token || token.startsWith('local-jwt-')) return;

    try {
      const response = await axios.get(`${API_BASE}/api/auth/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2500
      });
      if (response.data?.dashboardData) {
        setDashboardData(response.data.dashboardData);
      }
    } catch {
      // Keep local dashboard data
    } finally {
      setIsLoading(false);
    }
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4 text-white" />;
      case 'wishlist_add':
      case 'wishlist_remove':
        return <Heart className="h-4 w-4 text-white" />;
      case 'product_view':
        return <Eye className="h-4 w-4 text-white" />;
      default:
        return <Activity className="h-4 w-4 text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'search':
        return 'bg-emerald-600';
      case 'wishlist_add':
        return 'bg-rose-500';
      case 'wishlist_remove':
        return 'bg-slate-500';
      case 'product_view':
        return 'bg-teal-600';
      default:
        return 'bg-emerald-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Searches',
      value: dashboardData.stats.totalSearches.toString(),
      icon: Search,
      color: 'bg-emerald-600'
    },
    {
      label: 'Saved Items',
      value: dashboardData.stats.wishlistItems.toString(),
      icon: Heart,
      color: 'bg-rose-500'
    },
    {
      label: 'Products Viewed',
      value: dashboardData.stats.productsViewed.toString(),
      icon: Eye,
      color: 'bg-teal-600'
    },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            Welcome back, {user?.username || 'Customer'}!
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Here is your shopping activity and personalized product recommendations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl shadow-sm`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">Recent Activity</h2>
              {dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 6).map((activity, index) => {
                    const activityType = activity.type || activity.activityType || '';
                    return (
                      <div key={index} className="flex items-center space-x-3.5 p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                        <div className={`${getActivityColor(activityType)} p-2 rounded-lg flex-shrink-0`}>
                          {getActivityIcon(activityType)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 text-sm">{activity.description}</p>
                          <p className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-700 font-semibold text-sm">No recent activity yet</p>
                  <p className="text-slate-500 text-xs mt-1">Start searching and comparing products to see your activity here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-2.5">
                <Link
                  to="/search"
                  className="flex items-center space-x-3 w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors text-sm shadow-sm"
                >
                  <Search className="h-4 w-4" />
                  <span>Search & Compare Products</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-3 w-full p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold transition-colors text-sm"
                >
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>Saved Items ({dashboardData.stats.wishlistItems})</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 w-full p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold transition-colors text-sm"
                >
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  <span>Profile Settings</span>
                </Link>
              </div>
            </div>

            {/* Recent Searches */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">Recent Searches</h2>
              {dashboardData.recentSearches.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.recentSearches.slice(0, 6).map((search, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${encodeURIComponent(search.query)}`}
                      className="block p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 transition-colors text-sm text-slate-800"
                    >
                      <div className="flex items-center space-x-2 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{search.query}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 ml-5 mt-0.5">{formatTimeAgo(search.timestamp)}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Search className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">No recent searches</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {dashboardData.recommendations.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-slate-900">Recommended for You</h2>
              <Link to="/search" className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">
                View All Products
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dashboardData.recommendations.slice(0, 4).map(product => (
                <div key={product.productId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative bg-slate-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-xs mb-2">{product.brand}</p>
                    {product.reason && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block mb-3 font-medium">
                        {product.reason}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-base font-extrabold text-slate-900">${product.price}</span>
                      <Link
                        to={`/search?q=${encodeURIComponent(product.name)}`}
                        className="text-emerald-600 hover:text-emerald-700 text-xs font-bold"
                      >
                        Compare Marts →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
