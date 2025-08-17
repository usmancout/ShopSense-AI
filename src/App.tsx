import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence, motion, Variants, Transition } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProductSearch from './pages/ProductSearch';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import GDPRCompliance from "./pages/GDPRCompliance";
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';

// Page transition animations
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 0,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.05,
    } as Transition,
  },
  exit: {
    opacity: 0,
    x: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.55, 0.06, 0.68, 0.19],
    } as Transition,
  },
};

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

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <LandingPage />
            </motion.div>
          } />
          <Route path="/signup" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <SignUp />
            </motion.div>
          } />
          <Route path="/signin" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <SignIn />
            </motion.div>
          } />
          <Route path="/search" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <ProductSearch />
            </motion.div>
          } />
          <Route path="/dashboard" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <Dashboard />
            </motion.div>
          } />
          <Route path="/profile" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <Profile />
            </motion.div>
          } />
          <Route path="/wishlist" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <Wishlist />
            </motion.div>
          } />
          <Route path="/contact" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <Contact />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <About />
            </motion.div>
          } />
          <Route path="/admin" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <AdminDashboard />
            </motion.div>
          } />
          <Route path="/privacy-policy" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <PrivacyPolicy />
            </motion.div>
          } />
          <Route path="/terms-of-service" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <TermsOfService />
            </motion.div>
          } />
          <Route path="/cookie-policy" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <CookiePolicy />
            </motion.div>
          } />
          <Route path="/gdpr-compliance" element={
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="h-full w-full"
            >
              <GDPRCompliance />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
  );
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
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
  );
}

export default App;