import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Target, Users, Zap, Award, TrendingUp, Shield, Globe } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import usmanImg from '../static/usman.png'
import ahsanImg from '../static/ahsan.png'
import faseehImg from '../static/faseeh.png'


const About: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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

  const slideInFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms analyze millions of products to deliver personalized recommendations.'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Real-Time Price Tracking',
      description: 'Monitor price changes across multiple stores and get instant alerts when your favorite items go on sale.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security. We never share your personal information.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Marketplace',
      description: 'Access products from thousands of stores worldwide, all in one convenient platform.'
    }
  ];

  const team = [
    {
      name: 'Usman Ali',
      role: 'CEO & Co-Founder',
      image: usmanImg,
      bio: 'Former VP of Product at Amazon, passionate about revolutionizing e-commerce through AI.',
      linkedin: 'https://www.linkedin.com/in/usmancout' // Replace with actual LinkedIn URL
    },
    {
      name: 'Ahsan Waheed',
      role: 'CTO & Co-Founder',
      image: ahsanImg,
      bio: 'CEO of Web Bugs !! Topi Baaz CTO !! Do not trust this for any event.',
      linkedin: 'https://www.linkedin.com/in/ahsan-waheed-661012294/' // Replace with actual LinkedIn URL
    },
    {
      name: 'Faseeh Ali',
      role: 'Head of AI',
      image: faseehImg,
      bio: 'PhD in Computer Science from Stanford, specializing in recommendation systems.',
      linkedin: 'https://www.linkedin.com/in/faseeh-ali-57ba152a0/' // Replace with actual LinkedIn URL
    },
    {
      name: 'David Kim',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Award-winning designer with experience at Apple and Airbnb, focused on user experience.',
      linkedin: 'https://www.linkedin.com/in/davidkim' // Replace with actual LinkedIn URL
    }
  ];

  const stats = [
    { label: 'Active Users', value: '2M+' },
    { label: 'Partner Stores', value: '10K+' },
    { label: 'Products Tracked', value: '50M+' },
    { label: 'Money Saved', value: '$100M+' }
  ];

  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <motion.div
              className="max-w-7xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={container}
          >
            <motion.h1
                className="text-4xl sm:text-5xl font-bold mb-6"
                variants={item}
            >
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Revolutionizing
            </span>
              <br />
              <span className="text-white">Smart Shopping</span>
            </motion.h1>
            <motion.p
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                variants={item}
            >
              ShopSenseAI combines artificial intelligence with comprehensive marketplace data to help you discover the best products at the best prices, saving you time and money on every purchase.
            </motion.p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="grid lg:grid-cols-2 gap-12 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={container}
            >
              <motion.div variants={slideInFromLeft}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  We believe shopping should be intelligent, efficient, and enjoyable. Our mission is to empower consumers with AI-driven insights that transform how they discover and purchase products online.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  By aggregating data from thousands of stores and applying advanced machine learning algorithms, we help millions of users make informed purchasing decisions while saving both time and money.
                </p>
              </motion.div>
              <motion.div
                  className="bg-gray-800 rounded-2xl p-8"
                  variants={slideInFromRight}
              >
                <h3 className="text-xl font-semibold mb-6">Why We Started ShopSenseAI</h3>
                <div className="space-y-4">
                  <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                  >
                    <div className="bg-blue-500 w-2 h-2 rounded-full mt-2"></div>
                    <p className="text-gray-300">Online shopping was becoming overwhelming with too many choices</p>
                  </motion.div>
                  <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      viewport={{ once: true }}
                  >
                    <div className="bg-green-500 w-2 h-2 rounded-full mt-2"></div>
                    <p className="text-gray-300">Price comparison across stores was time-consuming and inefficient</p>
                  </motion.div>
                  <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                  >
                    <div className="bg-purple-500 w-2 h-2 rounded-full mt-2"></div>
                    <p className="text-gray-300">Consumers needed personalized recommendations based on their preferences</p>
                  </motion.div>
                  <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                  >
                    <div className="bg-red-500 w-2 h-2 rounded-full mt-2"></div>
                    <p className="text-gray-300">AI technology could solve these problems at scale</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800" ref={ref}>
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="text-center mb-12"
                initial="hidden"
                animate={controls}
                variants={slideInFromRight}
            >
              <h2 className="text-3xl font-bold mb-4">What Makes Us Different</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Our cutting-edge technology and user-centric approach set us apart in the e-commerce intelligence space.
              </p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                animate={controls}
                variants={container}
            >
              {features.map((feature, index) => (
                  <motion.div
                      key={index}
                      className="bg-gray-900 p-6 rounded-xl text-center group hover:bg-gray-750 transition-all duration-300"
                      variants={item}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                  >
                    <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-gray-400 text-lg">Numbers that showcase our commitment to helping shoppers worldwide</p>
            </motion.div>

            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={container}
            >
              {stats.map((stat, index) => (
                  <motion.div
                      key={index}
                      className="text-center"
                      variants={item}
                      whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text text-4xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <p className="text-gray-400 font-medium">{stat.label}</p>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="text-center mb-12"
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                viewport={{once: true}}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Users className="h-8 w-8 text-purple-400"/>
                <h2 className="text-3xl font-bold">Meet Our Team</h2>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Our diverse team of experts combines deep technical knowledge with a passion for improving the shopping
                experience.
              </p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={container}
            >
              {team.map((member, index) => (
                  <motion.div
                      key={index}
                      className="bg-gray-900 rounded-xl p-6 text-center group hover:bg-gray-750 transition-all duration-300 relative"
                      variants={item}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                  >
                    <motion.img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 group-hover:scale-105 transition-transform"
                        whileHover={{rotate: 2}}
                    />
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-purple-400 text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>

                    {/* Bold external link arrow (bottom right) */}
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 text-gray-400 hover:text-white transition-colors"
                        aria-label="Open LinkedIn profile"
                    >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5" // Increased size for boldness
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5" // Added stroke for bold effect
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        />
                      </svg>
                    </a>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
                className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 lg:p-12 text-center"
                initial={{opacity: 0, scale: 0.95}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                viewport={{once: true}}
            >
              <motion.div
                  className="flex items-center justify-center space-x-3 mb-6"
                  initial={{opacity: 0}}
                  whileInView={{opacity: 1}}
                  transition={{delay: 0.3}}
                  viewport={{once: true}}
              >
                <Zap className="h-8 w-8 text-yellow-400"/>
                <h2 className="text-3xl font-bold">Our Vision for the Future</h2>
              </motion.div>
              <motion.p
                  className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8"
                  initial={{opacity: 0}}
                  whileInView={{opacity: 1}}
                  transition={{delay: 0.4}}
                  viewport={{once: true}}
              >
                We envision a world where every shopping decision is informed, efficient, and personalized. Through
                continuous innovation in AI and machine learning, we're building the future of intelligent commerce.
              </motion.p>
              <motion.div
                  className="grid md:grid-cols-3 gap-6 text-left"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  variants={container}
              >
                <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                    variants={item}
                    whileHover={{y: -5}}
                >
                  <Award className="h-8 w-8 text-yellow-400 mb-3"/>
                  <h3 className="font-semibold mb-2">Industry Leadership</h3>
                  <p className="text-gray-300 text-sm">Setting new standards for AI-powered shopping intelligence and
                    user experience.</p>
                </motion.div>
                <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                    variants={item}
                    whileHover={{y: -5}}
                >
                  <Globe className="h-8 w-8 text-blue-400 mb-3"/>
                  <h3 className="font-semibold mb-2">Global Expansion</h3>
                  <p className="text-gray-300 text-sm">Bringing smart shopping solutions to consumers worldwide across all major markets.</p>
                </motion.div>
                <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                    variants={item}
                    whileHover={{ y: -5 }}
                >
                  <Zap className="h-8 w-8 text-green-400 mb-3" />
                  <h3 className="font-semibold mb-2">Innovation Focus</h3>
                  <p className="text-gray-300 text-sm">Continuously advancing our AI capabilities to deliver even more personalized experiences.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Join the Smart Shopping Revolution</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Experience the future of online shopping with personalized recommendations, real-time price tracking, and intelligent product discovery.
            </p>
            <motion.div
                className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={container}
            >
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-colors">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.div>
              </Link>
              <Link to="/search" className="border border-gray-600 hover:border-purple-500 px-8 py-3 rounded-full font-semibold transition-colors">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
  );
};

export default About;