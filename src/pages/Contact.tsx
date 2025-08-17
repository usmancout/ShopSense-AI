import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const faqs = [
  {
    question: "What is ShopSenseAI?",
    answer: "ShopSenseAI is a centralized e-commerce platform that helps you search, compare, and shop products from multiple stores in one place."
  },
  {
    question: "How do I search for products?",
    answer: "Simply use the search bar on the homepage to find products by name, brand, or category. You can also filter results by store, price, and more."
  },
  {
    question: "Can I buy from different stores in a single checkout?",
    answer: "ShopSenseAI allows you to browse products from many stores, but checkout is completed on each respective store's website."
  },
  {
    question: "How do I track my orders?",
    answer: "Order tracking is managed by the individual stores where you completed your checkout. ShopSenseAI provides links to each store's order tracking page."
  },
  {
    question: "Is my personal data safe?",
    answer: "Yes, we take your privacy seriously. ShopSenseAI only stores your data with your consent and never shares it with third parties without your approval."
  },
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch('https://formspree.io/f/mnnvkapq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      alert('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
        <motion.div
            className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          <motion.div
              className="max-w-md w-full text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="bg-gray-800 rounded-xl p-8">
              <motion.div
                  className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
              >
                Message Sent!
              </motion.h2>
              <motion.p
                  className="text-gray-400 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
              >
                Thank you for contacting us. We'll get back to you within 24 hours.
              </motion.p>
              <motion.button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                Send Another Message
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
    );
  }

  return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          >
            <motion.h1
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Contact
            </span>{' '}
              <span className="text-white">Us</span>
            </motion.h1>
            <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
              Have questions about ShopSenseAI? We're here to help you make the most of your smart shopping experience.
            </motion.p>
          </motion.div>

          <motion.div
              className="grid lg:grid-cols-3 gap-12"
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={container}
          >
            {/* Contact Information */}
            <motion.div
                className="space-y-8"
                variants={slideInFromLeft}
            >
              <motion.div
                  className="bg-gray-800 rounded-xl p-6"
                  whileHover={{ y: -5 }}
              >
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <motion.div
                      className="flex items-start space-x-4"
                      variants={item}
                  >
                    <motion.div
                        className="bg-purple-600 p-3 rounded-lg"
                        whileHover={{ rotate: 15 }}
                    >
                      <Mail className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-gray-400 text-sm mb-2">Send us an email anytime</p>
                      <a href="mailto:support@shopsenseai.com" className="text-purple-400 hover:text-purple-300">
                        support@shopsenseai.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                      className="flex items-start space-x-4"
                      variants={item}
                  >
                    <motion.div
                        className="bg-blue-600 p-3 rounded-lg"
                        whileHover={{ rotate: 15 }}
                    >
                      <Phone className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-gray-400 text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                      <a href="tel:+923446679756" className="text-purple-400 hover:text-purple-300">
                        +923446679756
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                      className="flex items-start space-x-4"
                      variants={item}
                  >
                    <motion.div
                        className="bg-green-600 p-3 rounded-lg"
                        whileHover={{ rotate: 15 }}
                    >
                      <MapPin className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">Visit Us</h3>
                      <p className="text-gray-400 text-sm">
                        47 C Civic Center Johar Town Block D، 2<br/>
                        Block D 2 Phase 1 Johar Town<br/>
                        Lahore, 54600, Pakistan
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                  className="bg-gray-800 rounded-xl p-6"
                  variants={item}
                  whileHover={{ y: -5 }}
              >
                <motion.h3
                    className="text-lg font-semibold mb-4 flex items-center space-x-2"
                    whileHover={{ x: 5 }}
                >
                  <Clock className="h-5 w-5" />
                  <span>Business Hours</span>
                </motion.h3>
                <div className="space-y-2 text-sm">
                  <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                  >
                    <span className="text-gray-400">Monday - Friday</span>
                    <span>8:00 AM - 5:00 PM PST</span>
                  </motion.div>
                  <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                  >
                    <span className="text-gray-400">Saturday</span>
                    <span>9:00 AM - 1:00 PM PST</span>
                  </motion.div>
                  <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                  >
                    <span className="text-gray-400">Sunday</span>
                    <span className="text-red-400">Closed</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* FAQ Link */}
              <motion.div
                  className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6"
                  variants={item}
                  whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold mb-2">Quick Answers</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Check our FAQ section for instant answers to common questions.
                </p>
                <motion.button
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    onClick={() => setShowFAQ(v => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  <span>{showFAQ ? "Hide FAQ" : "View FAQ"}</span>
                  {showFAQ ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </motion.button>
                {showFAQ && (
                    <motion.div
                        className="mt-6 space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                      {faqs.map((faq, idx) => (
                          <motion.div
                              key={idx}
                              className="bg-gray-900 rounded-lg p-4 text-sm"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                          >
                            <details className="group">
                              <summary className="font-semibold cursor-pointer text-purple-400 group-open:text-purple-300">
                                {faq.question}
                              </summary>
                              <motion.div
                                  className="mt-2 text-gray-300"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                              >
                                {faq.answer}
                              </motion.div>
                            </details>
                          </motion.div>
                      ))}
                    </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
                className="lg:col-span-2"
                variants={slideInFromRight}
            >
              <motion.div
                  className="bg-gray-800 rounded-xl p-8"
                  whileHover={{
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
              >
                <motion.h2
                    className="text-2xl font-semibold mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                  Send us a Message
                </motion.h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                      className="grid md:grid-cols-2 gap-6"
                      variants={container}
                      initial="hidden"
                      animate="visible"
                  >
                    <motion.div variants={item}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Your full name"
                      />
                    </motion.div>

                    <motion.div variants={item}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="your@email.com"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tell us how we can help you..."
                    />
                  </motion.div>

                  <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                        <motion.div
                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Map Section */}
          <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
          >
            <motion.div
                className="bg-gray-800 rounded-xl p-6"
                whileHover={{ y: -5 }}
            >
              <motion.h2
                  className="text-xl font-semibold mb-4"
                  whileHover={{ x: 5 }}
              >
                Find Us
              </motion.h2>
              <motion.a
                  href="https://maps.app.goo.gl/T9tSzhvWEYN7Kkp57"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-700 rounded-lg h-64 flex items-center justify-center hover:ring-2 hover:ring-purple-500 transition-all"
                  whileHover={{ scale: 1.01 }}
              >
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                  <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">Click to view us on Google Maps</p>
                  <p className="text-sm text-gray-500">
                    47 C Civic Center Johar Town Block D، 2, Block D 2 Phase 1 Johar Town, Lahore, 54600, Pakistan
                  </p>
                </motion.div>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
  );
};

export default Contact;