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

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Professional slide and fade animation variants
const pageVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
    filter: 'blur(4px)',
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.05
    } as Transition
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -50 : 50,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
      ease: [0.55, 0.06, 0.68, 0.19]
    } as Transition
  })
};

const useNavigationDirection = () => {
  const location = useLocation();
  const [direction, setDirection] = React.useState(0);
  const [previousPath, setPreviousPath] = React.useState(location.pathname);

  React.useEffect(() => {
    const paths = [previousPath, location.pathname];
    const currentIndex = paths.indexOf(location.pathname);

    if (currentIndex === -1) {
      setDirection(1);
    } else {
      setDirection(currentIndex === 0 ? -1 : 1);
    }

    setPreviousPath(location.pathname);
  }, [location]);

  return direction;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const direction = useNavigationDirection();

  return (
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {/* Add ScrollToTop component here */}
        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          {[
            { path: "/", component: LandingPage },
            { path: "/signup", component: SignUp },
            { path: "/signin", component: SignIn },
            { path: "/search", component: ProductSearch },
            { path: "/dashboard", component: Dashboard },
            { path: "/profile", component: Profile },
            { path: "/wishlist", component: Wishlist },
            { path: "/contact", component: Contact },
            { path: "/about", component: About },
            { path: "/admin", component: AdminDashboard },
            { path: "/privacy-policy", component: PrivacyPolicy },
            { path: "/terms-of-service", component: TermsOfService },
            { path: "/cookie-policy", component: CookiePolicy },
            { path: "/gdpr-compliance", component: GDPRCompliance },
          ].map(({ path, component: Component }) => (
              <Route
                  key={path}
                  path={path}
                  element={
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        custom={direction}
                        className="h-full w-full"
                    >
                      <Component />
                    </motion.div>
                  }
              />
          ))}
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
              <main className="flex-1 overflow-hidden relative">
                <div style={{ willChange: 'transform, opacity' }}>
                  <AnimatedRoutes />
                </div>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
  );
}

export default App;