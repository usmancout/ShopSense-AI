import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Shield, Zap, Star, ArrowRight, Play } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if user is authenticated before navigating to search
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', icon: '👕', color: 'from-pink-500 to-rose-500' },
    { name: 'Home & Garden', icon: '🏡', color: 'from-green-500 to-emerald-500' },
    { name: 'Books', icon: '📚', color: 'from-purple-500 to-violet-500' },
    { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-amber-500' },
    { name: 'Beauty', icon: '💄', color: 'from-red-500 to-pink-500' },
  ];

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized product suggestions based on your preferences and shopping history.',
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Price Comparison',
      description: 'Compare prices across multiple stores to ensure you get the best deals available.',
    },
    {
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Real-time Updates',
      description: 'Stay informed with live price changes, stock availability, and exclusive offers.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      comment: 'ShopSenseAI has completely transformed how I shop online. The recommendations are spot-on!',
    },
    {
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      comment: 'Saved me hundreds of dollars with accurate price comparisons. Highly recommended!',
    },
    {
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      comment: 'The AI recommendations helped me discover products I never knew I needed. Amazing platform!',
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideInFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
      <div className="min-h-screen overflow-x-hidden bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="text-center space-y-6 sm:space-y-8"
                initial="hidden"
                animate="visible"
                variants={container}
            >
              <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  variants={item}
              >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Smart Shopping
            </span>
                <br />
                <span className="text-white">Made Simple</span>
              </motion.h1>

              <motion.p
                  className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
                  variants={item}
              >
                Discover the best products across multiple stores with our AI-powered platform.
                Compare prices, get personalized recommendations, and never miss a great deal again.
              </motion.p>

              {/* Search Bar with Fixed Button */}
              <motion.form
                  onSubmit={handleSearch}
                  className="max-w-2xl mx-auto px-4"
                  variants={item}
              >
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-400 h-5 w-5" />
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, brands, or categories..."
                      className="w-full pl-12 pr-28 py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
                  />
                  <motion.button
                      type="submit"
                      className="absolute right-1 h-[calc(100%-8px)] bg-purple-600 hover:bg-purple-700 px-6 rounded-full font-medium transition-colors mr-1"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: 'auto',
                        minWidth: '90px'
                      }}
                  >
                    Search
                  </motion.button>
                </div>
              </motion.form>

              <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 px-4"
                  variants={item}
              >
                <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: isHovering ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                  >
                    Get Started Free
                  </motion.span>
                  <motion.div
                      animate={{ x: isHovering ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                </Link>

                <a
                    href="https://www.youtube.com/watch?v=ofHGE-85EIA&t=12011s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="h-4 w-4 sm:h-5 sm:w-5 bg-white text-gray-900 rounded-full p-1 flex items-center justify-center"
                  >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                  <span>Watch Demo</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 bg-opacity-70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.h2
                className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInFromLeft}
            >
              Popular Categories
            </motion.h2>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
              {categories.map((category, index) => (
                  <motion.div
                      key={category.name}
                      variants={item}
                      whileHover={{ y: -10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                        to={`/search?category=${encodeURIComponent(category.name)}`}
                        className="group block"
                    >
                      <div className={`bg-gradient-to-r ${category.color} p-4 sm:p-6 rounded-2xl text-center transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}>
                        <motion.div
                            className="text-2xl sm:text-3xl mb-2 sm:mb-3"
                            animate={{
                              y: [0, -5, 0],
                              transition: {
                                repeat: Infinity,
                                repeatDelay: 3,
                                duration: 1.5
                              }
                            }}
                        >
                          {category.icon}
                        </motion.div>
                        <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base">{category.name}</h3>
                      </div>
                    </Link>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" ref={ref}>
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="text-center mb-12 sm:mb-16"
                initial="hidden"
                animate={controls}
                variants={slideInFromRight}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose ShopSenseAI?</h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                Our advanced AI technology and comprehensive marketplace integration deliver an unmatched shopping experience.
              </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
                initial="hidden"
                animate={controls}
                variants={container}
            >
              {features.map((feature, index) => (
                  <motion.div
                      key={index}
                      className="bg-gray-800 p-6 sm:p-8 rounded-2xl text-center group hover:bg-gray-750 transition-all duration-300"
                      variants={item}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                  >
                    <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 bg-opacity-70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="text-center mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-400 text-base sm:text-lg">Join thousands of satisfied customers who've transformed their shopping experience.</p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={container}
            >
              {testimonials.map((testimonial, index) => (
                  <motion.div
                      key={index}
                      className="bg-gray-900 p-4 sm:p-6 rounded-2xl"
                      variants={item}
                      whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-center mb-4">
                      <motion.img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover mr-3 sm:mr-4"
                          whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                              <motion.div
                                  key={i}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                              >
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                              </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <motion.p
                        className="text-gray-300 italic text-sm sm:text-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                      "{testimonial.comment}"
                    </motion.p>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Shopping?</h2>
            <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of smart shoppers who save time and money with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <Link
                  to="/signup"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
              >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  Start Shopping Smart
                </motion.div>
              </Link>
              <Link
                  to="/search"
                  className="w-full sm:w-auto border border-gray-600 hover:border-purple-500 px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
              >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  Explore Products
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
  );
};

export default LandingPage;