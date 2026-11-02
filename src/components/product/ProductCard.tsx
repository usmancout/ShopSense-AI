import React, { useState } from 'react';
import {
  Star,
  Heart,
  ExternalLink,
  MapPin,
  Compass,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Store
} from 'lucide-react';
import { Product } from '../../data/products';
import { calculateDiscount } from '../../utils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isInWishlist?: boolean;
  showMartComparison?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  onCompareProduct?: (productName: string) => void;
}

type OfferSortMode = 'default' | 'price' | 'distance' | 'reviews';
type ReviewFilterMode = 'all' | 'genuine' | 'fake';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  isInWishlist = false,
  showMartComparison = false,
  onToggleWishlist,
  onProductClick,
  onCompareProduct
}) => {
  const [offerSort, setOfferSort] = useState<OfferSortMode>('default');
  const [selectedMartId, setSelectedMartId] = useState<string | null>(null);
  const [expandedReviewsMartId, setExpandedReviewsMartId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilterMode>('all');
  const [showNormalCardReviews, setShowNormalCardReviews] = useState(false);

  const rawOffers = (product.offers || []).filter(o => o.inStock !== false);
  const lowestPrice = rawOffers.length > 0 ? Math.min(...rawOffers.map(o => o.price)) : product.price;
  const highestPrice = rawOffers.length > 0 ? Math.max(...rawOffers.map(o => o.price)) : product.price;

  const allProductReviews = rawOffers.flatMap(o =>
    (o.reviews || []).map(r => ({ ...r, storeName: o.martName || o.store }))
  );

  // ============================================================================
  // MODE 1: NORMAL PRODUCT CARD (When browsing / suggested / relevant products)
  // ============================================================================
  if (!showMartComparison) {
    const genuineCount = allProductReviews.filter(r => r.bertLabel !== 'FAKE').length;
    const fakeCount = allProductReviews.filter(r => r.bertLabel === 'FAKE').length;

    return (
      <div
        className={`bg-white border border-slate-200/90 hover:border-emerald-500/60 rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 flex flex-col ${
          viewMode === 'list' ? 'sm:flex-row' : ''
        }`}
      >
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-slate-100 ${viewMode === 'list' ? 'w-full sm:w-52 flex-shrink-0' : ''}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              viewMode === 'list' ? 'h-52 sm:h-full' : 'h-52'
            }`}
          />

          {onToggleWishlist && (
            <button
              onClick={() => onToggleWishlist(product)}
              className="absolute top-3 right-3 p-2 bg-white/90 border border-slate-200 rounded-full shadow-sm hover:bg-white hover:scale-105 transition-all"
              title={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart
                className={`h-4 w-4 ${
                  isInWishlist ? 'text-rose-500 fill-current' : 'text-slate-600'
                }`}
              />
            </button>
          )}

          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
              Out of Stock
            </div>
          )}

          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute bottom-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
              {calculateDiscount(product.price, product.originalPrice)}% OFF
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                {product.brand}
              </span>
              <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                {product.category}
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1" title={product.name}>
              {product.name}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount.toLocaleString()})
                </span>
              </div>

              {allProductReviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNormalCardReviews(!showNormalCardReviews)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{showNormalCardReviews ? 'Hide Reviews' : 'Reviews'}</span>
                </button>
              )}
            </div>

            <p className="text-slate-500 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Expandable Reviews Drawer on Normal Card */}
            {showNormalCardReviews && allProductReviews.length > 0 && (
              <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">Customer Reviews</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-emerald-700 font-semibold">{genuineCount} Genuine</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-rose-600 font-semibold">{fakeCount} Fake</span>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {allProductReviews.slice(0, 6).map((rev, idx) => {
                    const isFake = rev.bertLabel === 'FAKE';
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs space-y-1 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{rev.user}</span>
                            <span className="text-amber-500 font-semibold">★ {rev.rating}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              isFake
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isFake ? (
                              <>
                                <AlertTriangle className="h-2.5 w-2.5" />
                                <span>Fake Review</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>Genuine Review</span>
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-slate-600">{rev.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Price & Action Row */}
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Starting from</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-extrabold text-slate-900">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            {onCompareProduct ? (
              <button
                type="button"
                onClick={() => {
                  onProductClick?.(product);
                  onCompareProduct(product.name);
                }}
                className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-sm"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Compare Marts</span>
              </button>
            ) : product.url && product.url !== '#' ? (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onProductClick?.(product)}
                className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all text-xs sm:text-sm font-bold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Product</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODE 2: SEARCHED PRODUCT MART COMPARISON VIEW
  // Side-by-side marts with Price, Distance & Customer Reviews
  // ============================================================================
  const sortedOffers = [...rawOffers].sort((a, b) => {
    if (offerSort === 'price') return a.price - b.price;
    if (offerSort === 'distance') return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    if (offerSort === 'reviews') return (b.rating ?? 4.5) - (a.rating ?? 4.5);
    return 0;
  });

  const customerChosenOffer = rawOffers.find(o => o.martId === selectedMartId) || null;
  const inspectedOffer = rawOffers.find(o => o.martId === expandedReviewsMartId) || null;

  const inspectedReviews = inspectedOffer?.reviews || [];
  const genuineReviewsCount = inspectedReviews.filter(r => r.bertLabel !== 'FAKE').length;
  const fakeReviewsCount = inspectedReviews.filter(r => r.bertLabel === 'FAKE').length;

  const filteredInspectedReviews = inspectedReviews.filter(r => {
    if (reviewFilter === 'genuine') return r.bertLabel !== 'FAKE';
    if (reviewFilter === 'fake') return r.bertLabel === 'FAKE';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-md transition-all duration-300 flex flex-col">
      {/* Top Product Overview Banner */}
      <div className="flex flex-col md:flex-row border-b border-slate-200/80 bg-white">
        <div className="relative w-full md:w-64 h-56 md:h-auto flex-shrink-0 bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {onToggleWishlist && (
            <button
              onClick={() => onToggleWishlist(product)}
              className="absolute top-3 right-3 p-2 bg-white/90 border border-slate-200 rounded-full shadow-sm hover:bg-white transition-colors"
              title={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart
                className={`h-4 w-4 ${
                  isInWishlist ? 'text-rose-500 fill-current' : 'text-slate-600'
                }`}
              />
            </button>
          )}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Store className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              Available at {rawOffers.length || 1} {(rawOffers.length || 1) === 1 ? 'Mart' : 'Marts'}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {product.name}
                </h3>
              </div>

              <div className="sm:text-right bg-emerald-50/70 border border-emerald-200/80 rounded-2xl px-4 py-2.5 flex-shrink-0 self-start">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  {lowestPrice === highestPrice ? 'Store Price' : 'Price Range'}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {lowestPrice === highestPrice ? `$${lowestPrice}` : `$${lowestPrice} – $${highestPrice}`}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
              {product.description}
            </p>

            {/* Key Product Specs/Features */}
            {product.features && product.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {product.features.map((feat, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-slate-100 border border-slate-200/80 text-slate-700 px-2.5 py-1 rounded-lg"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sort Controls Bar */}
          {sortedOffers.length > 1 && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Compare available marts side-by-side and choose your preferred store:
              </span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
                {(
                  [
                    { key: 'default', label: 'Default' },
                    { key: 'price', label: 'Price' },
                    { key: 'distance', label: 'Distance' },
                    { key: 'reviews', label: 'Rating' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setOfferSort(tab.key)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      offerSort === tab.key
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Mart Comparison Grid */}
      <div className="p-5 sm:p-6 bg-slate-50/70">
        <div
          className={`grid grid-cols-1 gap-4 ${
            sortedOffers.length === 1
              ? 'md:grid-cols-1 max-w-md'
              : sortedOffers.length === 2
              ? 'md:grid-cols-2'
              : sortedOffers.length === 3
              ? 'md:grid-cols-3'
              : 'md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {sortedOffers.map((offer) => {
            const isSelectedByCustomer = selectedMartId === offer.martId;
            const isViewingReviews = expandedReviewsMartId === offer.martId;
            const storeRating = offer.rating ?? 4.5;
            const reviewListCount = offer.reviews?.length || 0;

            return (
              <div
                key={`${offer.store}-${offer.martId}`}
                onClick={() => setSelectedMartId(isSelectedByCustomer ? null : offer.martId)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col justify-between bg-white ${
                  isSelectedByCustomer
                    ? 'border-emerald-600 ring-4 ring-emerald-500/15 shadow-lg'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Mart Header */}
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mb-1.5">
                        {offer.store}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 leading-snug truncate" title={offer.martName}>
                        {offer.martName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1" title={offer.martAddress}>
                        <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{offer.martAddress}</span>
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelectedByCustomer
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Metrics Table: Price, Distance, Rating */}
                  <div className="divide-y divide-slate-200/70 bg-slate-50 rounded-xl px-3.5 py-1 border border-slate-200/80 text-xs mb-3.5">
                    {/* Price */}
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-slate-500 font-medium">Price</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        ${offer.price}
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-slate-500 font-medium">Distance</span>
                      <span className="font-semibold text-slate-800 inline-flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        {offer.distanceKm !== undefined ? `${offer.distanceKm.toFixed(1)} km (~${offer.driveMinutes}m)` : 'N/A'}
                      </span>
                    </div>

                    {/* Customer Rating */}
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-slate-500 font-medium">Rating</span>
                      <span className="font-bold text-slate-900 inline-flex items-center">
                        <Star className="h-3.5 w-3.5 mr-1 text-amber-400 fill-current" />
                        {storeRating.toFixed(1)}
                        <span className="text-slate-400 font-normal ml-1">
                          ({offer.reviewCount || reviewListCount})
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* View Customer Reviews Button */}
                  {reviewListCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReviewFilter('all');
                        setExpandedReviewsMartId(isViewingReviews ? null : offer.martId);
                      }}
                      className={`w-full mb-3 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                        isViewingReviews
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{isViewingReviews ? 'Hide Reviews' : `View Reviews (${reviewListCount})`}</span>
                      </span>
                      {isViewingReviews ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMartId(isSelectedByCustomer ? null : offer.martId);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      isSelectedByCustomer
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {isSelectedByCustomer ? '✓ Mart Selected' : 'Select Mart'}
                  </button>

                  {offer.lat && offer.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${offer.lat},${offer.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title={`Directions to ${offer.martName}`}
                    >
                      <Compass className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable Customer Reviews Drawer */}
        {inspectedOffer && inspectedReviews.length > 0 && (
          <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-bold text-slate-900">
                    Customer Reviews — {inspectedOffer.martName}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {genuineReviewsCount} Genuine • {fakeReviewsCount} Fake
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    All ({inspectedReviews.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('genuine')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      reviewFilter === 'genuine' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:text-emerald-800'
                    }`}
                  >
                    Genuine ({genuineReviewsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('fake')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      reviewFilter === 'fake' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 hover:text-rose-700'
                    }`}
                  >
                    Fake ({fakeReviewsCount})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedReviewsMartId(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredInspectedReviews.map((rev, idx) => {
                const isFake = rev.bertLabel === 'FAKE';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 text-xs ${
                      isFake
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-slate-50/70 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs uppercase flex-shrink-0 shadow-sm">
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm block">{rev.user}</span>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < rev.rating ? 'text-amber-400 fill-current' : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-slate-400 text-[11px]">• {rev.date}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border flex-shrink-0 ${
                          isFake
                            ? 'bg-rose-100/80 text-rose-700 border-rose-200'
                            : 'bg-emerald-100/80 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isFake ? (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            <span>Fake Review</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Genuine Review</span>
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{rev.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Mart Checkout / Directions Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {customerChosenOffer ? (
            <>
              <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-700">
                <span className="text-slate-500 font-medium">Selected Store:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                  {customerChosenOffer.martName}
                </span>
                <span className="font-extrabold text-slate-900 text-base">${customerChosenOffer.price}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">{customerChosenOffer.distanceKm?.toFixed(1)} km away</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-500 font-bold">★ {customerChosenOffer.rating?.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                {customerChosenOffer.lat && customerChosenOffer.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${customerChosenOffer.lat},${customerChosenOffer.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <Compass className="h-4 w-4 text-emerald-600" />
                    <span>Directions</span>
                  </a>
                )}
                <a
                  href={customerChosenOffer.url || product.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onProductClick?.(product)}
                  className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Buy from {customerChosenOffer.martName} (${customerChosenOffer.price})</span>
                </a>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500">
              Click <strong className="text-slate-800">"View Reviews"</strong> to inspect store reviews, or <strong className="text-slate-800">"Select Mart"</strong> on any card above to proceed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
