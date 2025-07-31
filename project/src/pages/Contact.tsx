import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
    answer: "Order tracking is managed by the individual stores where you completed your checkout. ShopSenseAI provides links to each store’s order tracking page."
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
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-gray-400 mb-6">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions about ShopSenseAI? We're here to help you make the most of your smart shopping experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-gray-400 text-sm mb-2">Send us an email anytime</p>
                      <a href="mailto:support@shopsenseai.com" className="text-purple-400 hover:text-purple-300">
                        support@shopsenseai.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-gray-400 text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                      <a href="tel:+15551234567" className="text-purple-400 hover:text-purple-300">
                        +923446679756
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Visit Us</h3>
                      <p className="text-gray-400 text-sm">
                        47 C Civic Center Johar Town Block D، 2<br/>
                        Block D 2 Phase 1 Johar Town<br/>
                        Lahore, 54600, Pakistan
                      </p>

                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Business Hours</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monday - Friday</span>
                    <span>8:00 AM - 5:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Saturday</span>
                    <span>9:00 AM -   1:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sunday</span>
                    <span className="text-red-400">Closed</span>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Quick Answers</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Check our FAQ section for instant answers to common questions.
                </p>
                <button
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    onClick={() => setShowFAQ(v => !v)}
                >
                  <span>{showFAQ ? "Hide FAQ" : "View FAQ"}</span>
                  {showFAQ ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showFAQ && (
                    <div className="mt-6 space-y-4">
                      {faqs.map((faq, idx) => (
                          <details
                              key={idx}
                              className="bg-gray-900 rounded-lg p-4 text-sm group"
                          >
                            <summary className="font-semibold cursor-pointer text-purple-400 group-open:text-purple-300">
                              {faq.question}
                            </summary>
                            <div className="mt-2 text-gray-300">{faq.answer}</div>
                          </details>
                      ))}
                    </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
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
                    </div>

                    <div>
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
                    </div>
                  </div>

                  <div>
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
                  </div>

                  <div>
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
                  </div>

                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Find Us</h2>
              <a
                  href="https://maps.app.goo.gl/T9tSzhvWEYN7Kkp57"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-700 rounded-lg h-64 flex items-center justify-center hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">Click to view us on Google Maps</p>
                  <p className="text-sm text-gray-500">47 C Civic Center Johar Town Block D، 2, Block D 2 Phase 1 Johar Town, Lahore, 54600, Pakistan
                  </p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
  );
};

export default Contact;