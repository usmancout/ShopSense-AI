import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Store } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-xl shadow-sm">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                ShopSense <span className="text-emerald-600">AI</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Helping shoppers find products at the lowest prices, nearest to their location, with verified genuine customer reviews across local marts.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                <Store className="h-3 w-3 text-emerald-600" /> Martello
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                <Store className="h-3 w-3 text-emerald-600" /> Prodexa
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                <Store className="h-3 w-3 text-emerald-600" /> Storenta
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Platform</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <Link to="/search" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                Compare Mart Prices
              </Link>
              <Link to="/wishlist" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                Saved Wishlist
              </Link>
              <Link to="/about" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                About Our Team
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Legal & Trust</h3>
            <div className="space-y-2 text-sm">
              <Link to="/privacy-policy" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/gdpr-compliance" className="block text-slate-500 hover:text-emerald-600 transition-colors">
                GDPR Compliance
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Contact</h3>
            <div className="space-y-2.5 text-sm text-slate-500">
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>shopsense@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>+92 344 6679756</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Lahore, Pakistan</span>
              </div>
              <div className="flex space-x-3 pt-2">
                <a href="https://web.facebook.com/profile.php?id=100049922391730" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://x.com/usmancout" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://www.instagram.com/usmancout/" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://www.linkedin.com/in/usmancout/" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ShopSense AI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Multi-Mart Price, Distance & Review Authenticity Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
