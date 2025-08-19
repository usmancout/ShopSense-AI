import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, Filter, SlidersHorizontal, Star,
  ExternalLink, Heart, Grid, List, X
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  categories,
  stores,
  sortOptions,
  Product
} from '../data/products';

const ProductSearch: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show a loading state while authentication is being checked
  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Checking authentication...</p>
          </div>
        </div>
    );
  }

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  useEffect(() => {
    applyFilters(products);
    fetchRecommendedProducts();
  }, [products, selectedCategory, selectedStore, priceRange, minRating, sortBy]);

  // Track search when query changes
  useEffect(() => {
    if (searchQuery.trim() && isAuthenticated) {
      trackSearch(searchQuery, selectedCategory);
    }
  }, [searchQuery, selectedCategory, isAuthenticated]);

  // Show notification for 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const trackSearch = async (query: string, category: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://ssa-serverr.onrender.com/api/auth/search-history', {
        query,
        category: category !== 'All Categories' ? category : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  const trackProductView = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://ssa-serverr.onrender.com/api/auth/product-view', {
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
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      if (searchQuery.trim() !== '') {
        // Fetch from all three APIs in parallel
        const [martelloResponse, prodexaResponse, storentaResponse] = await Promise.allSettled([
          axios.get(`https://martello.onrender.com/api/products?q=${encodeURIComponent(searchQuery)}`),
          axios.get(`https://prodexa.onrender.com/api/products?q=${encodeURIComponent(searchQuery)}`),
          axios.get(`https://storenta.onrender.com/api/products?q=${encodeURIComponent(searchQuery)}`)
        ]);

        let fetchedProducts: Product[] = [];

        // Process responses from each API
        const processResponse = (response: any, storeName: string) => {
          if (response?.data) {
            const products = response.data.products || response.data || [];
            return products.map((p: any) => ({
              id: p.id?.toString() || Math.random().toString(),
              name: p.name || p.title,
              brand: p.brand || 'Unknown',
              category: p.category || 'Other',
              store: storeName,
              price: p.price || 0,
              originalPrice: p.originalPrice || null,
              rating: p.rating || 0,
              reviewCount: p.reviewCount || 0,
              description: p.description || '',
              image: p.imageUrl || p.image || 'https://via.placeholder.com/150',
              url: p.link || p.url || '#',
              tags: p.tags || [],
              inStock: p.inStock ?? true
            }));
          }
          return [];
        };

        if (martelloResponse.status === 'fulfilled') {
          fetchedProducts = [...fetchedProducts, ...processResponse(martelloResponse.value, 'Martello')];
        }

        if (prodexaResponse.status === 'fulfilled') {
          fetchedProducts = [...fetchedProducts, ...processResponse(prodexaResponse.value, 'Prodexa')];
        }

        if (storentaResponse.status === 'fulfilled') {
          fetchedProducts = [...fetchedProducts, ...processResponse(storentaResponse.value, 'Storenta')];
        }

        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('API fetch failed:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      if (selectedCategory !== 'All Categories' && products.length > 0) {
        // Fetch recommended products from the same category
        const [martelloResponse, prodexaResponse, storentaResponse] = await Promise.allSettled([
          axios.get(`https://martello.onrender.com/api/products?category=${encodeURIComponent(selectedCategory)}&limit=4`),
          axios.get(`https://prodexa.onrender.com/api/products?category=${encodeURIComponent(selectedCategory)}&limit=4`),
          axios.get(`https://storenta.onrender.com/api/products?category=${encodeURIComponent(selectedCategory)}&limit=4`)
        ]);

        let recommended: Product[] = [];

        const processResponse = (response: any, storeName: string) => {
          if (response?.data) {
            const products = response.data.products || response.data || [];
            return products.map((p: any) => ({
              id: p.id?.toString() || Math.random().toString(),
              name: p.name || p.title,
              brand: p.brand || 'Unknown',
              category: p.category || 'Other',
              store: storeName,
              price: p.price || 0,
              originalPrice: p.originalPrice || null,
              rating: p.rating || 0,
              reviewCount: p.reviewCount || 0,
              description: p.description || '',
              image: p.imageUrl || p.image || 'https://via.placeholder.com/150',
              url: p.link || p.url || '#',
              tags: p.tags || [],
              inStock: p.inStock ?? true
            }));
          }
          return [];
        };

        if (martelloResponse.status === 'fulfilled') {
          recommended = [...recommended, ...processResponse(martelloResponse.value, 'Martello')];
        }

        if (prodexaResponse.status === 'fulfilled') {
          recommended = [...recommended, ...processResponse(prodexaResponse.value, 'Prodexa')];
        }

        if (storentaResponse.status === 'fulfilled') {
          recommended = [...recommended, ...processResponse(storentaResponse.value, 'Storenta')];
        }

        // Remove duplicates and products already in search results
        const productIds = new Set(products.map(p => p.id));
        const uniqueRecommended = recommended
            .filter(p => !productIds.has(p.id))
            .slice(0, 8); // Limit to 8 recommendations

        setRecommendedProducts(uniqueRecommended);
      } else {
        setRecommendedProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch recommended products:', err);
      setRecommendedProducts([]);
    }
  };

  // Enhanced search matching function
  const matchesSearchQuery = (product: Product, query: string) => {
    if (!query.trim()) return true;

    const searchTerms = query.toLowerCase().split(/\s+/);
    const productText = `${product.name} ${product.brand} ${product.category} ${product.description} ${product.tags.join(' ')}`.toLowerCase();

    // Check if all search terms are present in the product text
    return searchTerms.every(term => productText.includes(term));
  };

  const applyFilters = (productList: Product[]) => {
    let filtered = productList.filter(product => {
      const matchesSearch = matchesSearchQuery(product, searchQuery);
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesStore = selectedStore === 'All Stores' || product.store === selectedStore;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;

      return matchesSearch && matchesCategory && matchesStore && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Relevance sorting - prioritize products that match the search query
        if (searchQuery.trim()) {
          filtered.sort((a, b) => {
            // Score products based on how well they match the search query
            const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
            const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());

            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;

            const aDescMatch = a.description.toLowerCase().includes(searchQuery.toLowerCase());
            const bDescMatch = b.description.toLowerCase().includes(searchQuery.toLowerCase());

            if (aDescMatch && !bDescMatch) return -1;
            if (!aDescMatch && bDescMatch) return 1;

            return 0;
          });
        }
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const toggleWishlist = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      const isInWishlist = wishlist.has(product.id);

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`https://ssa-serverr.onrender.com/api/auth/wishlist/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newWishlist = new Set(wishlist);
        newWishlist.delete(product.id);
        setWishlist(newWishlist);
        setNotification({
          type: 'success',
          message: 'Product removed from your wishlist'
        });
      } else {
        // Add to wishlist
        await axios.post('https://ssa-serverr.onrender.com/api/auth/wishlist', {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          store: product.store,
          rating: product.rating,
          reviewCount: product.reviewCount,
          description: product.description,
          url: product.url
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newWishlist = new Set(wishlist);
        newWishlist.add(product.id);
        setWishlist(newWishlist);
        setNotification({
          type: 'success',
          message: 'Product added to your wishlist!'
        });
      }
    } catch (error: any) {
      console.error('Failed to update wishlist:', error);

      // Check if it's a duplicate error
      if (error.response?.status === 409) {
        setNotification({
          type: 'info',
          message: 'This product is already in your wishlist!'
        });
      } else {
        setNotification({
          type: 'info',
          message: 'This product is already in your wishlist!'
        });
      }
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
      <div className={`bg-gray-800 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
          viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
      }`}>
        <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-48 flex-shrink-0' : ''}`}>
          <img
              src={product.image}
              alt={product.name}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  viewMode === 'list' ? 'h-48 sm:h-full' : 'h-48'
              }`}
          />
          <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-gray-900/80 rounded-full backdrop-blur-sm hover:bg-gray-900 transition-colors"
          >
            <Heart
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    wishlist.has(product.id) ? 'text-red-500 fill-current' : 'text-white'
                }`}
            />
          </button>
          {!product.inStock && (
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                Out of Stock
              </div>
          )}
          {product.originalPrice && (
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
          )}
        </div>

        <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-purple-400 transition-colors truncate">
                {product.name}
              </h3>
              <p className="text-gray-400 text-sm">{product.brand}</p>
            </div>
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0">
            {product.store}
          </span>
          </div>

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
            <span className="text-xs sm:text-sm text-gray-400">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                  <span className="text-base sm:text-lg text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProductView(product)}
                className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>View Product</span>
            </a>
          </div>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm ${
                notification.type === 'success' ? 'bg-green-900/90 text-green-100' :
                    notification.type === 'error' ? 'bg-red-900/90 text-red-100' :
                        'bg-blue-900/90 text-blue-100'
            }`}>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                  onClick={() => setNotification(null)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
        )}

        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-6 sm:mb-8">
            <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, or categories..."
                    className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                <button
                    type="submit"
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 bg-gray-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Filters</span>
                </button>
                <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
                  <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 sm:p-2 rounded transition-colors ${
                          viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-gray-700'
                      }`}
                  >
                    <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 sm:p-2 rounded transition-colors ${
                          viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-gray-700'
                      }`}
                  >
                    <List className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-gray-400 text-sm">
                  {filteredProducts.length} results
                </span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Filters</h3>

                {/* Category Filter */}
                <div>
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Category</h4>
                  <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="All Categories">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Store Filter */}
                <div>
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Store</h4>
                  <select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="All Stores">All Stores</option>
                    <option value="Martello">Martello</option>
                    <option value="Prodexa">Prodexa</option>
                    <option value="Storenta">Storenta</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Price Range</h4>
                  <div className="space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                    />
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span>${priceRange[0]}</span>
                      <span>-</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map(rating => (
                        <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                          <input
                              type="radio"
                              name="rating"
                              value={rating}
                              checked={minRating === rating}
                              onChange={(e) => setMinRating(parseInt(e.target.value))}
                              className="text-purple-600"
                          />
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                    }`}
                                />
                            ))}
                            <span className="ml-2 text-xs sm:text-sm text-gray-300">
                          {rating === 0 ? 'All' : `${rating}+ stars`}
                        </span>
                          </div>
                        </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {!isLoading && filteredProducts.length > 0 && (
                  <div className={`grid gap-4 sm:gap-6 ${
                      viewMode === 'grid'
                          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                          : 'grid-cols-1'
                  }`}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <div className="bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
                      <SlidersHorizontal className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
                      <p className="text-gray-400 mb-6 text-sm sm:text-base">
                        Try adjusting your search criteria or filters to find what you're looking for.
                      </p>
                      <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All Categories');
                            setSelectedStore('All Stores');
                            setPriceRange([0, 2000]);
                            setMinRating(0);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Recommendation Section */}
          {recommendedProducts.length > 0 && (
              <section className="mt-12 sm:mt-16">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Products in {selectedCategory}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {recommendedProducts.map(product => (
                      <div key={`rec-${product.id}`}>
                        <ProductCard product={product} />
                      </div>
                  ))}
                </div>
              </section>
          )}
        </div>
      </div>
  );
};

export default ProductSearch;