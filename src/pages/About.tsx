import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Target, Users, Zap, Award, TrendingUp, Shield, Globe, ArrowUpRight, Sparkles } from 'lucide-react';
import usmanImg from '../static/usman.png';
import ahsanImg from '../static/ahsan.png';
import faseehImg from '../static/faseeh.png';

const About: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      title: 'AI Review Verification',
      description: 'Fine-tuned language models analyze customer reviews to separate genuine buyer feedback from fake promotional spam.'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: 'Multi-Mart Price Comparison',
      description: 'Compare live product prices side-by-side across Martello, Prodexa, and Storenta in a single search.'
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: 'Transparent & Neutral',
      description: 'We show you the exact price, store distance, and verified customer reviews so you decide where to buy.'
    },
    {
      icon: <Globe className="h-6 w-6 text-emerald-600" />,
      title: 'Location-Aware Distance',
      description: 'See how many kilometers away each available store is from your location with instant Google Maps directions.'
    }
  ];

  const team = [
    {
      name: 'Usman Ali',
      role: 'Co-Founder & Lead Engineer',
      image: usmanImg,
      bio: 'Passionate about building intelligent e-commerce platforms and scalable multi-store architecture.',
      linkedin: 'https://www.linkedin.com/in/usmancout'
    },
    {
      name: 'Ahsan Waheed',
      role: 'Co-Founder & Backend Architect',
      image: ahsanImg,
      bio: 'Focused on distributed store APIs, real-time data pipelines, and platform reliability.',
      linkedin: 'https://www.linkedin.com/in/ahsan-waheed-661012294/'
    },
    {
      name: 'Faseeh Ali',
      role: 'Head of AI & NLP',
      image: faseehImg,
      bio: 'Specializes in NLP and review authenticity models to help shoppers spot fake reviews effortlessly.',
      linkedin: 'https://www.linkedin.com/in/faseeh-ali-57ba152a0/'
    }
  ];

  const stats = [
    { label: 'Partner Mart APIs', value: '3 Live' },
    { label: 'Reviews Analyzed', value: '100%' },
    { label: 'Product Categories', value: '6+' },
    { label: 'Location Accuracy', value: 'Real-Time' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Banner — Matches Emerald & Slate Theme */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-emerald-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>About ShopSense AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Revolutionizing <span className="text-emerald-600">Smart Shopping</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            ShopSense AI combines multi-mart price comparison, real-time store distance calculation, and AI-powered customer review verification so you can shop with confidence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="bg-emerald-600 p-3 rounded-xl shadow-sm">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
              We believe shopping should be transparent, fast, and trustworthy. Different marts often sell the exact same product at very different prices—some are closer to your home, while others have inflated ratings from fake reviews.
            </p>
            <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
              By connecting live store catalogs (<strong className="text-slate-800">Martello</strong>, <strong className="text-slate-800">Prodexa</strong>, and <strong className="text-slate-800">Storenta</strong>) with location distance tracking and AI review analysis, we put all the facts side-by-side and let the customer decide.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Why We Built ShopSense AI</h3>
            <div className="space-y-4 text-sm sm:text-base text-slate-600">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                <p>Compare prices of the same product across multiple marts in seconds</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <p>See exact travel distance from your house to every store that has the product in stock</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                <p>Detect fake and bot-generated product reviews so you only rely on genuine buyer feedback</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                <p>Give shoppers full control to choose their preferred store without biased ads</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Core Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">What Makes Us Different</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200/90 p-6 rounded-2xl hover:border-emerald-500/50 transition-all shadow-sm"
              >
                <div className="bg-emerald-50 border border-emerald-200 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Platform Overview</h2>
          <p className="text-slate-500 text-sm sm:text-base">Built for fast, transparent multi-mart product comparison</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 mb-1">
                {stat.value}
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 text-emerald-600 mb-2">
              <Users className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">The Creators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Meet Our Team</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-center relative hover:shadow-md transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-emerald-500/30 shadow-sm"
                />
                <h3 className="text-lg font-bold text-slate-900 mb-0.5">{member.name}</h3>
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">{member.bio}</p>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section — Matches Emerald & Slate Theme */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold mb-4">
              <Zap className="h-3.5 w-3.5" />
              <span>Looking Ahead</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Our Vision for the Future
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We envision a world where every shopping decision is informed, transparent, and effortless—combining local store prices, travel distance, and verified customer reviews in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Review Trust & Transparency</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Setting new standards for review authenticity so shoppers never fall for fake or paid promotional ratings.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Expanding Partner Marts</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Connecting more local and regional marts with live inventory, pricing, and store location coordinates.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Smarter AI Comparison</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Continuously improving our NLP and comparison tools to help customers save money and travel time.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/search"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm shadow-sm"
            >
              Compare Marts Now
            </Link>
            <Link
              to="/contact"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold px-7 py-3 rounded-xl transition-colors text-sm"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
