import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Search, Heart, ShoppingBag, TrendingUp, Star, Eye, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useWishlist } from '../hooks/useWishlist';

const Dashboard: React.FC = () => {
  const { user, trackUserActivity } = useAuth();
  const { 
    stats, 
    recentActivity, 
    recommendedProducts, 
    isLoading: dashboardLoading, 
    error: dashboardError, 
    refreshData 
  } = useDashboard();
  const { wishlistItems } = useWishlist();

  const dashboardStats = [
    { 
      label: 'Total Searches', 
      value: stats?.totalSearches?.toString() || '0', 
      icon: Search, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Wishlist Items', 
      value: wishlistItems.length.toString(), 
      icon: Heart, 
      color: 'bg-red-500' 
    },
    { 
      label: 'Products Viewed', 
      value: stats?.productsViewed?.toString() || '0', 
      icon: Eye, 
      color: 'bg-purple-500' 
    },
  ];

  const handleQuickAction = async (action: string, path: string) => {
    await trackUserActivity('navigation', `Navigated to ${action}`, { path });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (dashboardLoading) {
    return (
      <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-gray-400 text-sm sm:text-base">Here's your shopping overview and personalized recommendations.</p>
            </div>
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Error Display */}
          {dashboardError && (
            <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{dashboardError}</span>
              <button 
                onClick={refreshData}
                className="ml-auto text-red-200 hover:text-white underline text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {dashboardStats.map((stat, index) => (
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
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case 'search': return { icon: Search, color: 'bg-blue-500' };
                          case 'wishlist_add': return { icon: Heart, color: 'bg-red-500' };
                          case 'wishlist_remove': return { icon: Heart, color: 'bg-gray-500' };
                          case 'view': return { icon: Eye, color: 'bg-green-500' };
                          default: return { icon: BarChart3, color: 'bg-purple-500' };
                        }
                      };

                      const { icon: IconComponent, color } = getActivityIcon(activity.type);

                      return (
                        <div key={activity.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-700 rounded-lg">
                          <div className={`${color} p-2 rounded-lg flex-shrink-0`}>
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base">{activity.description}</p>
                            <p className="text-xs sm:text-sm text-gray-400">{formatTimeAgo(activity.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No recent activity</p>
                      <p className="text-gray-500 text-xs">Start shopping to see your activity here</p>
                    </div>
                  )}
                </div>
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
                      onClick={() => handleQuickAction('Product Search', '/search')}
                      className="flex items-center space-x-3 w-full p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-sm sm:text-base"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Search Products</span>
                  </Link>
                  <Link
                      to="/wishlist"
                      onClick={() => handleQuickAction('Wishlist', '/wishlist')}
                      className="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>View Wishlist</span>
                  </Link>
                  <Link
                      to="/profile"
                      onClick={() => handleQuickAction('Profile', '/profile')}
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
                <div className="space-y-2">
                  {stats?.recentSearches && stats.recentSearches.length > 0 ? (
                    stats.recentSearches.map((search, index) => (
                      <Link
                          key={index}
                          to={`/search?q=${encodeURIComponent(search)}`}
                          onClick={() => trackUserActivity('search', `Searched for "${search}"`, { query: search })}
                          className="block p-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm text-gray-300 hover:text-white"
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{search}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Search className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs">No recent searches</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <section className="mt-8 sm:mt-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Recommended for You</h2>
              <Link to="/search" className="text-purple-400 hover:text-purple-300 text-sm sm:text-base">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map(product => (
                  <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300">
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
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                              <Star
                                  key={i}
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                  }`}
                              />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-bold">${product.price}</span>
                        <Link
                            to={`/product/${product.id}`}
                            onClick={() => trackUserActivity('view', `Viewed product: ${product.name}`, { productId: product.id })}
                            className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {recommendedProducts.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No recommendations available</p>
                <p className="text-gray-500 text-sm">Start browsing products to get personalized recommendations</p>
              </div>
            )}
          </section>
        </div>
      </div>
  );
};

export default Dashboard;
