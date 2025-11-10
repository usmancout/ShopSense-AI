import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { categories, sortOptions, Product } from '../data/products';
import { ProductCard, ProductFilters } from '../components/product';
import { SearchBar, SearchControls } from '../components/search';
import { Spinner, Notification } from '../components/ui';
import { useNotification, useWishlist, useProductTracking } from '../hooks';

const martLocations = [
  { id: 'mart1', name: 'Martello Downtown', address: '123 Main St, City', lat: 31.458677908180455, lng: 74.28865302384219 },
  { id: 'mart2', name: 'Martello West', address: '456 West Ave, City', lat: 31.45133397893662, lng: 74.29248982384179 },
  { id: 'mart3', name: 'Prodexa Central', address: '789 Central Rd, City', lat: 40.7328, lng: -74.0260 },
  { id: 'mart4', name: 'Storenta Plaza', address: '321 Plaza Dr, City', lat: 40.7428, lng: -74.0360 },
];

const ProductSearch: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [selectedMart, setSelectedMart] = useState('Select Mart');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const { notification, showNotification, hideNotification } = useNotification();
  const { wishlist, toggleWishlist } = useWishlist();
  const { trackSearch, trackProductView } = useProductTracking();

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() && isAuthenticated) {
      trackSearch(searchQuery, selectedCategory);
    }
  }, [searchQuery, selectedCategory, isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const [martelloResponse, prodexaResponse, storentaResponse] = await Promise.allSettled([
        axios.get(`https://martello.onrender.com/api/products?q=${encodeURIComponent(searchQuery)}`),
        axios.get(`https://prodexa.onrender.com/api/products?q=${encodeURIComponent(searchQuery)}`),
        axios.get(`https://storenta.onrender.com/api/products?q=${encodeURIComponent(searchQuery)}`)
      ]);

      let fetchedProducts: Product[] = [];
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
    } catch (err) {
      console.error('API fetch failed:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesStore = selectedStore === 'All Stores' || product.store === selectedStore;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      return matchesCategory && matchesStore && matchesPrice && matchesRating;
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
    }

    return filtered;
  }, [products, selectedCategory, selectedStore, priceRange, minRating, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set('q', searchQuery);
      setSearchParams(params);
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    const result = await toggleWishlist(product);
    showNotification(result.success ? 'success' : 'info', result.message);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-400 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
          />
          <SearchControls
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultsCount={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            martLocations={martLocations}
            selectedMart={selectedMart}
            onMartChange={setSelectedMart}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <ProductFilters
              categories={categories.filter(c => c !== 'All Categories')}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStore={selectedStore}
              onStoreChange={setSelectedStore}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minRating={minRating}
              onRatingChange={setMinRating}
            />
          </div>

          <div className="flex-1">
            {!isLoading && filteredProducts.length > 0 && (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    isInWishlist={wishlist.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onProductClick={trackProductView}
                  />
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
      </div>
    </div>
  );
};

export default ProductSearch;
