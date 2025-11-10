import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import { Spinner } from './components/ui';
import { AuthProvider } from './contexts/AuthContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const ProductSearch = lazy(() => import('./pages/ProductSearch'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const GDPRCompliance = lazy(() => import('./pages/GDPRCompliance'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
      <GoogleOAuthProvider clientId="370908799853-lsocbk1j2rcqh9atl4etren40squisko.apps.googleusercontent.com">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-white flex flex-col">
              <Header />
              <main className="flex-1 overflow-hidden">
                <ScrollToTop />
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <Spinner />
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <ProductSearch />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
  );
}

export default App;