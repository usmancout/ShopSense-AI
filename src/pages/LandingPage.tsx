import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  Store,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Tag
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const quickSearches = ['Samsung', 'iPhone 15 Pro', 'MacBook Air', 'Sony WH-1000XM5', 'PlayStation 5', 'iPad Pro'];

  const categories = [
    { name: 'Electronics', count: 'Smartphones, TVs & Audio', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Fashion', count: 'Apparel, Footwear & Watches', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
    { name: 'Home & Garden', count: 'Appliances & Smart Home', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { name: 'Books', count: 'Bestsellers & Collector Editions', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
    { name: 'Sports', count: 'Fitness Gear & Smartwatches', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Beauty', count: 'Skincare, Styling & Cosmetics', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 bg-white border border-emerald-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Compare Prices, Store Distances & Verified Customer Reviews</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
            Find the <span className="text-emerald-600">Lowest Price</span> at the{' '}
            <span className="underline decoration-emerald-400/60 decoration-wavy underline-offset-8">Nearest Mart</span>{' '}
            with Real Reviews.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Search any product across <strong className="text-slate-900">Martello</strong>, <strong className="text-slate-900">Prodexa</strong>, and <strong className="text-slate-900">Storenta</strong>. Compare live store prices, check how far each mart is from your house, and inspect customer reviews with AI Fake vs. Genuine detection.
          </p>

          {/* Elevated Search Box */}
          <form onSubmit={handleSearch} className="mt-9 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white border-2 border-slate-200/90 focus-within:border-emerald-600 rounded-2xl p-2 shadow-xl shadow-slate-900/5 transition-all">
              <Search className="h-5 w-5 text-emerald-600 ml-3.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a product (e.g. Samsung, iPhone 15, PS5, MacBook)..."
                className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors text-sm sm:text-base flex-shrink-0"
              >
                Compare Marts
              </button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Try searching:</span>
            {quickSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-all shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">How ShopSense Works</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Everything You Need Before You Buy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
              <Tag className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Side-by-Side Store Prices</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              See which marts actually have your searched product in stock and compare their exact prices side-by-side without hidden markups.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-5">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Distance From Your Location</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Check how many kilometers away each store is and get one-click Google Maps directions so you can balance travel distance against price savings.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Fake vs. Genuine Review Check</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Open customer reviews for any mart and immediately see which reviews are{' '}
              <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Genuine
              </span>{' '}
              and which are{' '}
              <span className="inline-flex items-center gap-0.5 font-semibold text-rose-600">
                <AlertTriangle className="h-3.5 w-3.5" /> Fake
              </span>.
            </p>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Product Catalog</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Browse by Category</h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-emerald-500/60 rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-lg"
              >
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-2 ${cat.badge}`}>
                    {cat.name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Explore {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <Store className="h-3.5 w-3.5" />
            <span>3 Live Store Catalogs Integrated</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Start Comparing Product Prices & Reviews
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-7">
            Search any product to view available marts side-by-side and decide where to buy based on price, distance, and verified customer reviews.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm sm:text-base shadow-lg"
          >
            <span>Open Product Search</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
