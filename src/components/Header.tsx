import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Heart, BarChart3, LogOut, Store, Compass, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('shopsense_theme');
    return saved === 'dark';
  });

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('shopsense_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('shopsense_theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Compare Marts' },
    { path: '/wishlist', label: 'Saved Items' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 py-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2.5 rounded-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                ShopSense <span className="text-emerald-600">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                Multi-Mart Price & Review Finder
              </span>
            </div>
          </Link>

          {/* Center Pill Navigation */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 border border-slate-200/70 rounded-full p-1 space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Live Partner Stores Pill */}
            <Link
              to="/search"
              className="hidden xl:flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-emerald-100/70 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Store className="h-3.5 w-3.5 text-emerald-600" />
              <span>Martello • Prodexa • Storenta</span>
            </Link>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-all text-xs font-semibold"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-700" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full pl-1.5 pr-3 py-1 transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="h-7 w-7 rounded-full object-cover border border-white shadow-sm"
                  />
                  <span className="hidden md:block text-xs font-bold text-slate-800 max-w-24 truncate">
                    {user?.username}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.username}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      <BarChart3 className="h-4 w-4 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      <Heart className="h-4 w-4 text-slate-400" />
                      <span>Saved Products</span>
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                      >
                        <BarChart3 className="h-4 w-4 text-slate-400" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2.5 w-full px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/signin"
                  className="text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-xs sm:text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors text-xs sm:text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 space-y-1 border-t border-slate-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
