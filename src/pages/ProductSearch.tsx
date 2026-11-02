import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { categories, sortOptions, Product, mockProducts } from '../data/products';
import { ProductCard, ProductFilters } from '../components/product';
import { SearchBar, SearchControls } from '../components/search';
import { Spinner, Notification } from '../components/ui';
import { useNotification, useWishlist, useProductTracking } from '../hooks';

interface MartLocation {
  id: string;
  store?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  distanceKm?: number;
  driveMinutes?: number;
}

const defaultMartLocations: MartLocation[] = [
  { id: 'mart1', store: 'Martello', name: 'Martello Downtown', address: 'Johar Town Main Blvd, Lahore', lat: 31.4697, lng: 74.2728, rating: 4.7 },
  { id: 'mart2', store: 'Martello', name: 'Martello West', address: 'Wapda Town Roundabout, Lahore', lat: 31.4312, lng: 74.2644, rating: 4.4 },
  { id: 'mart3', store: 'Prodexa', name: 'Prodexa Central', address: 'MM Alam Road, Gulberg III, Lahore', lat: 31.5102, lng: 74.3441, rating: 4.8 },
  { id: 'mart4', store: 'Storenta', name: 'Storenta Plaza', address: 'DHA Phase 5 Commercial, Lahore', lat: 31.4625, lng: 74.4085, rating: 4.2 },
];

function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const ProductSearch: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [rawMarts, setRawMarts] = useState<MartLocation[]>(defaultMartLocations);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [selectedMart, setSelectedMart] = useState('Select Mart');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 31.4805,
    lng: 74.3239
  });

  const { notification, showNotification, hideNotification } = useNotification();
  const { wishlist, toggleWishlist } = useWishlist();
  const { trackSearch, trackProductView } = useProductTracking();

  // Only show marts and mart locations when a specific product is being searched
  const isSearchingSpecificProduct = searchQuery.trim().length > 0;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    const urlQ = searchParams.get('q');
    const urlCat = searchParams.get('category');
    if (urlQ !== null) setSearchQuery(urlQ);
    if (urlCat !== null) setSelectedCategory(urlCat);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedStore, selectedMart]);

  useEffect(() => {
    if (searchQuery.trim() && isAuthenticated) {
      trackSearch(searchQuery, selectedCategory);
    }
  }, [searchQuery, selectedCategory, isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiBase}/api/products`, {
        params: {
          store: selectedStore,
          martId: selectedMart
        }
      });

      if (response.data?.products) {
        setAllProducts(response.data.products);
      }
      if (response.data?.marts) {
        setRawMarts(response.data.marts);
      }
    } catch (err) {
      console.error('Failed to fetch from backend product catalog:', err);
      setAllProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute live distances for all marts from userLocation
  const martsWithDistance = useMemo(() => {
    return rawMarts
      .map(m => {
        const distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, m.lat, m.lng);
        const driveMinutes = Math.max(3, Math.round(distanceKm * 2.4));
        return { ...m, distanceKm, driveMinutes };
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [rawMarts, userLocation]);

  // Enrich products with distance for when a specific product is searched
  const productsWithDistance = useMemo(() => {
    return allProducts.map(product => {
      const enrichedOffers = (product.offers || [])
        .filter(offer => offer.inStock !== false)
        .map(offer => {
          const lat = offer.lat ?? 31.4697;
          const lng = offer.lng ?? 74.2728;
          const distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, lat, lng);
          const driveMinutes = Math.max(3, Math.round(distanceKm * 2.4));
          return {
            ...offer,
            distanceKm,
            driveMinutes
          };
        });

      const nearestOffer = enrichedOffers.length > 0
        ? [...enrichedOffers].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))[0]
        : undefined;

      return {
        ...product,
        offers: enrichedOffers,
        nearestMartName: nearestOffer?.martName,
        nearestDistanceKm: nearestOffer?.distanceKm,
        nearestMartPrice: nearestOffer?.price
      };
    });
  }, [allProducts, userLocation]);

  // Apply standard filters (category, store, mart, price, rating, sort)
  const applyFiltersAndSort = (list: Product[]) => {
    const filtered = list.filter(product => {
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesStore = selectedStore === 'All Stores' || product.store === selectedStore || product.offers?.some(o => o.store === selectedStore);
      const matchesMart = selectedMart === 'Select Mart' || product.martId === selectedMart || product.offers?.some(o => o.martId === selectedMart);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      return matchesCategory && matchesStore && matchesMart && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.lowestPrice ?? a.price) - (b.lowestPrice ?? b.price));
        break;
      case 'distance':
        filtered.sort((a, b) => (a.nearestDistanceKm ?? 999) - (b.nearestDistanceKm ?? 999));
        break;
      case 'savings':
        filtered.sort((a, b) => (b.maxSavings || 0) - (a.maxSavings || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  };

  // Products matching the specific search query (Displayed WITH side-by-side Mart Comparison)
  // Note: Ignores category/store/price sidebar filters so searching a product name ALWAYS finds it even if a different category was previously selected
  const searchedProducts = useMemo(() => {
    if (!isSearchingSpecificProduct) return [];
    const q = searchQuery.trim().toLowerCase();
    return productsWithDistance.filter(product =>
      [product.name, product.brand, product.category, product.description, ...(product.tags || [])]
        .some(val => val && val.toLowerCase().includes(q))
    );
  }, [productsWithDistance, isSearchingSpecificProduct, searchQuery]);

  // Suggested / Relevant Products (Displayed NORMALLY without any mart locations or comparison tables)
  const normalProducts = useMemo(() => {
    if (!isSearchingSpecificProduct) {
      // Not searching a specific product -> show all filtered products normally
      return applyFiltersAndSort(productsWithDistance);
    }
    // When searching a specific product -> show other relevant products from the same category/catalog normally below
    const searchedIds = new Set(searchedProducts.map(p => p.id));
    const targetCategories = new Set(searchedProducts.map(p => p.category));
    const others = productsWithDistance.filter(p => !searchedIds.has(p.id));
    const sameCategory = others.filter(p => targetCategories.has(p.category));
    const remaining = others.filter(p => !targetCategories.has(p.category));
    return [...sameCategory, ...remaining].slice(0, 6);
  }, [productsWithDistance, isSearchingSpecificProduct, searchedProducts, selectedCategory, selectedStore, selectedMart, priceRange, minRating, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleSelectProductToCompare = (productName: string) => {
    setSearchQuery(productName);
    const params = new URLSearchParams(searchParams);
    params.set('q', productName);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    setSearchParams(params);
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      showNotification('info', 'Please sign in to save items to your wishlist');
      return;
    }
    const result = await toggleWishlist(product);
    showNotification(result.success ? 'success' : 'info', result.message);
  };

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
        {/* Search Bar & Controls */}
        <div className="mb-6 sm:mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            onClear={handleClearSearch}
          />
          <SearchControls
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultsCount={isSearchingSpecificProduct ? searchedProducts.length : normalProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            martLocations={
              isSearchingSpecificProduct
                ? martsWithDistance
                    .filter(m =>
                      searchedProducts.some(p =>
                        (p.offers || []).some(o => o.martId === m.id && o.inStock !== false)
                      )
                    )
                    .map(m => ({
                      id: m.id,
                      name: `${m.name} (${m.distanceKm?.toFixed(1)} km)`
                    }))
                : []
            }
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

          <div className="flex-1 space-y-10">
            {/* SECTION 1: Specific Searched Product(s) WITH Side-by-Side Mart Comparison */}
            {!isLoading && isSearchingSpecificProduct && searchedProducts.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-6 rounded-full bg-emerald-600" />
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Available Marts for "{searchQuery}"
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {searchedProducts.length} {searchedProducts.length === 1 ? 'Product Found' : 'Products Found'}
                  </span>
                </div>
                <div className="grid gap-6 grid-cols-1">
                  {searchedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      showMartComparison={true}
                      isInWishlist={wishlist.has(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onProductClick={trackProductView}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No matching searched product state */}
            {!isLoading && isSearchingSpecificProduct && searchedProducts.length === 0 && (
              <div className="text-center py-10">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
                  <SlidersHorizontal className="h-12 w-12 text-emerald-600 mx-auto mb-3 opacity-80" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No exact match for "{searchQuery}"</h3>
                  <p className="text-slate-500 mb-5 text-sm">
                    Try another product name or browse the suggested products below.
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-sm"
                  >
                    Show All Products
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: Normal / Suggested / Relevant Products (WITHOUT any mart locations) */}
            {!isLoading && normalProducts.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-6 rounded-full bg-teal-600" />
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {isSearchingSpecificProduct ? 'Relevant & Suggested Products' : 'Suggested Products'}
                    </h2>
                  </div>
                  {!isSearchingSpecificProduct && (
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      Click "Compare Marts" on any product to compare store prices & distances
                    </span>
                  )}
                </div>
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                }`}>
                  {normalProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      showMartComparison={false}
                      isInWishlist={wishlist.has(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onProductClick={trackProductView}
                      onCompareProduct={handleSelectProductToCompare}
                    />
                  ))}
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
