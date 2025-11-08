import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Search, Heart, ShoppingBag, TrendingUp, Star, Eye, Clock, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
  type: string;
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: { totalSearches: 0, wishlistItems: 0, productsViewed: 0 },
    recentSearches: [],
    recentActivity: [],
    recommendations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data.dashboardData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
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
        return <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      case 'wishlist_add':
        return <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      case 'wishlist_remove':
        return <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      case 'product_view':
        return <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
      default:
        return <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'search':
        return 'bg-blue-500';
      case 'wishlist_add':
        return 'bg-red-500';
      case 'wishlist_remove':
        return 'bg-gray-500';
      case 'product_view':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                  onClick={fetchDashboardData}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
    );
  }

  const stats = [
    {
      label: 'Total Searches',
      value: dashboardData.stats.totalSearches.toString(),
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      label: 'Wishlist Items',
      value: dashboardData.stats.wishlistItems.toString(),
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      label: 'Products Viewed',
      value: dashboardData.stats.productsViewed.toString(),
      icon: Eye,
      color: 'bg-purple-500'
    },
  ];

  return (
      <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-gray-400 text-sm sm:text-base">Here's your shopping overview and personalized recommendations.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                      <p className="text-lg sm:text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                      <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Activity</h2>
                {dashboardData.recentActivity.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                            <div className={`${getActivityColor(activity.type)} p-2 rounded-lg flex-shrink-0`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm sm:text-base">{activity.description}</p>
                              <p className="text-xs sm:text-sm text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No recent activity</p>
                      <p className="text-gray-500 text-sm">Start searching for products to see your activity here</p>
                    </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                      to="/search"
                      className="flex items-center space-x-3 w-full p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-sm sm:text-base"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Search Products</span>
                  </Link>
                  <Link
                      to="/wishlist"
                      className="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>View Wishlist ({dashboardData.stats.wishlistItems})</span>
                  </Link>
                  <Link
                      to="/profile"
                      className="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Update Profile</span>
                  </Link>
                </div>
              </div>

              {/* Recent Searches */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Searches</h2>
                {dashboardData.recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardData.recentSearches.map((search, index) => (
                          <Link
                              key={index}
                              to={`/search?q=${encodeURIComponent(search.query)}`}
                              className="block p-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm text-gray-300 hover:text-white"
                          >
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="truncate">{search.query}</span>
                              {search.category && (
                                  <span className="text-xs text-purple-400">({search.category})</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 ml-5 sm:ml-6">{formatTimeAgo(search.timestamp)}</p>
                          </Link>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                      <Search className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No recent searches</p>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {dashboardData.recommendations.length > 0 && (
              <section className="mt-8 sm:mt-12">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Recommended for You</h2>
                  <Link to="/search" className="text-purple-400 hover:text-purple-300 text-sm sm:text-base">
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {dashboardData.recommendations.slice(0, 4).map(product => (
                      <div key={product.productId} className="bg-gray-800 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="relative">
                          <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                            {product.store}
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors text-sm sm:text-base truncate">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm mb-2">{product.brand}</p>
                          {product.reason && (
                              <p className="text-xs text-purple-400 mb-2">💡 {product.reason}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-base sm:text-lg font-bold">${product.price}</span>
                            <button className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium">
                              View Details
                            </button>
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