import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: 'What is ShopSense AI?',
    answer: 'ShopSense AI is a multi-mart comparison platform that helps you compare prices, check store distances from your house, and inspect customer reviews for authenticity across Martello, Prodexa, and Storenta.'
  },
  {
    question: 'How does the customer review check work?',
    answer: 'When you click "View Reviews" on any store offer, our AI Review Analysis labels each review as either Genuine Review or Fake Review so you are not misled by bot or promotional spam.'
  },
  {
    question: 'Why are some marts not shown for certain products?',
    answer: 'Not every product is stocked at every mart. We only display the marts where your searched product is actually available in stock.'
  },
  {
    question: 'Does ShopSense AI pre-select a store for me?',
    answer: 'No. We display Price, Distance, and Customer Reviews side-by-side neutrally so you can decide which store works best for you.'
  }
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

    try {
      const response = await fetch('https://formspree.io/f/mnnvkapq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="bg-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Message Sent!</h2>
          <p className="text-slate-600 text-sm mb-6">
            Thank you for reaching out to ShopSense AI. Our team will get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white border border-emerald-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Contact <span className="text-emerald-600">ShopSense AI</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Have questions about store comparisons, partner marts, or review verification? We are here to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Info & FAQ */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-600 flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Email Us</h3>
                    <p className="text-slate-500 text-xs mb-1">Send us an email anytime</p>
                    <a href="mailto:shopsense@gmail.com" className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold">
                      shopsense@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-600 flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Call Us</h3>
                    <p className="text-slate-500 text-xs mb-1">Mon–Fri from 9am to 6pm</p>
                    <a href="tel:+923446679756" className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold">
                      +92 344 6679756
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-600 flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Location</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Civic Center Johar Town, Block D2<br />
                      Lahore, 54600, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Support Hours</span>
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Monday – Friday</span>
                  <span className="font-semibold text-slate-800">9:00 AM – 6:00 PM PKT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Saturday</span>
                  <span className="font-semibold text-slate-800">10:00 AM – 2:00 PM PKT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sunday</span>
                  <span className="font-semibold text-rose-600">Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Answers / FAQ */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Frequently Asked Questions</h3>
              <p className="text-slate-500 text-xs mb-4">
                Quick answers about how ShopSense AI compares marts and reviews.
              </p>
              <button
                type="button"
                onClick={() => setShowFAQ(v => !v)}
                className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1.5"
              >
                <span>{showFAQ ? 'Hide FAQs' : 'View FAQs'}</span>
                {showFAQ ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showFAQ && (
                <div className="mt-4 space-y-2.5">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs">
                      <p className="font-bold text-slate-900 mb-1">{faq.question}</p>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Store Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3.5 px-6 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 text-sm shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
