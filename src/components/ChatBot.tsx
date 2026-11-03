import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Navigation,
  RotateCcw,
  Bot,
  User
} from 'lucide-react';
import { mockProducts, Product } from '../data/products';
import { searchClientVectorDB } from '../utils/ragVectorClient';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ChatProductSummary {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  lowestPrice: number;
  lowestMartName: string;
  lowestMartDistanceKm: number;
  lowestMartFakePct: number;
  nearestMartName: string;
  nearestMartPrice: number;
  nearestMartDistanceKm: number;
  trustedMartName: string;
  trustedMartPrice: number;
  trustedMartDistanceKm: number;
  trustedMartLat: number;
  trustedMartLng: number;
  availableMartCount: number;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  products?: ChatProductSummary[];
  suggestedQuery?: string;
  showOptions?: boolean;
}

const MARTS_INFO = [
  { id: 'mart1', store: 'Martello', name: 'Martello Downtown', address: 'Johar Town Main Blvd, Lahore', lat: 31.4697, lng: 74.2728, productsCount: 56, reviewNote: '78% Genuine Reviews' },
  { id: 'mart2', store: 'Martello', name: 'Martello West', address: 'Wapda Town Roundabout, Lahore', lat: 31.4312, lng: 74.2644, productsCount: 52, reviewNote: '86% Genuine Reviews' },
  { id: 'mart3', store: 'Prodexa', name: 'Prodexa Central', address: 'MM Alam Road, Gulberg III, Lahore', lat: 31.5102, lng: 74.3441, productsCount: 60, reviewNote: '88% Genuine Reviews' },
  { id: 'mart4', store: 'Storenta', name: 'Storenta Plaza', address: 'DHA Phase 5 Commercial, Lahore', lat: 31.4625, lng: 74.4085, productsCount: 55, reviewNote: 'High Fake Review Alert (60% Fake)' },
];

function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const QUICK_PROMPTS = [
  'I want Nike shoes and a shirt',
  'Best laptop under $1500',
  'Cheapest iPhone 16 Pro Max',
  'Which mart is closest to me?'
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 31.4805,
    lng: 74.3239
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hi! What product would you like to find or compare today?',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const summarizeProductForChat = (product: Product): ChatProductSummary => {
    const offers = (product.offers || []).map(o => {
      const distanceKm = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        o.lat ?? 31.4697,
        o.lng ?? 74.2728
      );
      return { ...o, distanceKm };
    });

    const byPrice = [...offers].sort((a, b) => a.price - b.price);
    const byDistance = [...offers].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    // Trusted mart: low fake review percentage + competitive price
    const byTrust = [...offers].sort((a, b) => {
      const aTrusted = (a.fakeReviewPercentage ?? 0) < 40 ? 1 : 0;
      const bTrusted = (b.fakeReviewPercentage ?? 0) < 40 ? 1 : 0;
      if (aTrusted !== bTrusted) return bTrusted - aTrusted;
      return a.price - b.price;
    });

    const lowest = byPrice[0];
    const nearest = byDistance[0];
    const trusted = byTrust[0] || lowest;

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.image,
      lowestPrice: lowest?.price ?? product.price,
      lowestMartName: lowest?.martName ?? 'Prodexa Central',
      lowestMartDistanceKm: lowest?.distanceKm ?? 3.2,
      lowestMartFakePct: lowest?.fakeReviewPercentage ?? 25,
      nearestMartName: nearest?.martName ?? 'Martello Downtown',
      nearestMartPrice: nearest?.price ?? product.price,
      nearestMartDistanceKm: nearest?.distanceKm ?? 1.8,
      trustedMartName: trusted?.martName ?? 'Prodexa Central',
      trustedMartPrice: trusted?.price ?? product.price,
      trustedMartDistanceKm: trusted?.distanceKm ?? 3.2,
      trustedMartLat: trusted?.lat ?? 31.5102,
      trustedMartLng: trusted?.lng ?? 74.3441,
      availableMartCount: offers.length
    };
  };

  const matchProductsConversational = (rawText: string, maxBudget: number | null): Product[] => {
    const cleaned = rawText
      .toLowerCase()
      .replace(/(?:under|below|less than|max|budget(?:\s+of)?)\s*\$?\s*\d+/gi, '')
      .replace(/\b(?:cheapest|lowest|price|nearest|closest|near|me|genuine|fake|reviews|recommend|suggest|which|mart|has|where|can|buy|find|show|want|need|looking|for|some|please|give|get)\b/gi, ' ')
      .trim();

    const stopWords = new Set([
      'i', 'a', 'an', 'the', 'to', 'in', 'at', 'of', 'from', 'is', 'are', 'my', 'good', 'best', 'product', 'products', 'item', 'items'
    ]);

    const synonyms: Record<string, string[]> = {
      shoe: ['shoes', 'sneakers', 'footwear'],
      shoes: ['shoes', 'sneakers', 'footwear'],
      sneaker: ['sneakers', 'shoes', 'footwear'],
      sneakers: ['sneakers', 'shoes', 'footwear'],
      shirt: ['shirt', 't-shirt', 'tshirt', 'polo'],
      shirts: ['shirt', 't-shirt', 'tshirt', 'polo'],
      tshirt: ['shirt', 't-shirt', 'tshirt'],
      phone: ['smartphone'],
      phones: ['smartphone'],
      mobile: ['smartphone'],
      smartphone: ['smartphone'],
      laptop: ['laptop', 'macbook', 'xps', 'zephyrus', 'spectre', 'notebook'],
      laptops: ['laptop', 'macbook', 'xps', 'zephyrus', 'spectre', 'notebook'],
      earphone: ['earbuds', 'airpods', 'headphones'],
      earphones: ['earbuds', 'airpods', 'headphones'],
      earbuds: ['earbuds', 'airpods'],
      headphone: ['headphones', 'headset', 'earbuds'],
      headphones: ['headphones', 'headset', 'earbuds'],
      coat: ['jacket', 'puffer', 'outerwear'],
      jacket: ['jacket', 'puffer', 'outerwear'],
      pant: ['jeans', 'pants', 'trousers', 'denim'],
      pants: ['jeans', 'pants', 'trousers', 'denim'],
      jeans: ['jeans', 'denim'],
      watch: ['watch', 'smartwatch', 'wristwatch'],
      tv: ['tv', 'television', 'oled', 'qled'],
      book: ['book', 'books'],
      books: ['book', 'books'],
      perfume: ['perfume', 'fragrance', 'sauvage', 'chanel']
    };

    const clauses = cleaned
      .split(/\b(?:and|or|also|plus|with)\b|[,&+]/i)
      .map(c =>
        c
          .replace(/[^a-z0-9\s-]/g, ' ')
          .split(/\s+/)
          .filter(t => t.length > 1 && !stopWords.has(t))
      )
      .filter(tokens => tokens.length > 0);

    let results = mockProducts.filter(product => {
      const fullText = [product.name, product.brand, product.category, product.description, ...(product.tags || [])]
        .join(' ')
        .toLowerCase();

      if (cleaned.length > 2 && fullText.includes(cleaned)) return true;
      if (clauses.length === 0) return false;

      const identityText = [product.name, product.brand, product.category, ...(product.tags || [])]
        .join(' ')
        .toLowerCase();

      return clauses.some(tokens =>
        tokens.every(token => {
          const candidates = synonyms[token] || [token, token.replace(/s$/, '')];
          return candidates.some(
            c => c && new RegExp(`(^|[^a-z0-9])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(identityText)
          );
        })
      );
    });

    if (maxBudget !== null) {
      results = results.filter(p => (p.lowestPrice ?? p.price) <= maxBudget);
    }

    return results;
  };

  const generateBotResponse = async (userText: string): Promise<Omit<ChatMessage, 'id' | 'sender' | 'timestamp'>> => {
    const lower = userText.toLowerCase().trim();

    // 1. Acknowledgment / Closing ("ok", "okay", "thanks", "thank you", "done", "got it", "no", "bye")
    if (/^(ok|okay|k|kk|thanks|thank you|thx|got it|done|alright|great|nice|cool|fine|no|nope|nothing|bye|goodbye)\b[!.]*$/i.test(lower)) {
      return {
        text: 'Do you want something else?',
        showOptions: true
      };
    }

    // 2. Explicit "Suggest Products" button click or request
    if (lower === 'suggest products' || lower === 'show suggestions') {
      const topPicks = [mockProducts[0], mockProducts[24], mockProducts[30]].filter(Boolean).map(summarizeProductForChat);
      return {
        text: 'Here are some popular products across our marts:',
        products: topPicks
      };
    }

    // 3. Greeting / Help
    if (/^(hi|hello|hey|salam|assalam|help|start|how do you work)\b/i.test(lower) && lower.split(/\s+/).length <= 5) {
      return {
        text: 'Hello! Tell me a product or budget to compare marts.'
      };
    }

    // 4. Closest Mart / Mart Information Query
    if (/\b(which mart is closest|nearest mart|closest mart|all marts|list of marts|where are the marts)\b/i.test(lower) && !/\b(iphone|samsung|nike|laptop|shoes|shirt|airpods|sony|watch|tv|book)\b/i.test(lower)) {
      const sortedMarts = MARTS_INFO.map(m => ({
        ...m,
        distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, m.lat, m.lng)
      })).sort((a, b) => a.distanceKm - b.distanceKm);

      const lines = sortedMarts.map(
        (m, idx) => `${idx + 1}. ${m.name} (${m.distanceKm.toFixed(1)} km) • ${m.reviewNote}`
      );

      return {
        text: `Marts nearest to you:\n${lines.join('\n')}`
      };
    }

    // 5. Review Authenticity Question
    if (/\b(fake review|genuine review|storenta review|trustworthy|are reviews real)\b/i.test(lower) && !/\b(iphone|samsung|nike|laptop|shoes|shirt)\b/i.test(lower)) {
      return {
        text: 'Prodexa Central (88%) and Martello West (86%) have the most Genuine Reviews. Storenta Plaza has 60% Fake Reviews.'
      };
    }

    // 6. RAG + Vector DB Product Retrieval (Fetches from SSA-server Vector DB first, falls back to client 384-D Vector Index)
    const budgetMatch = userText.match(/(?:under|below|less than|max|budget(?:\s+of)?)\s*\$?\s*(\d+)/i);
    const maxBudget = budgetMatch ? Number(budgetMatch[1]) : null;

    let matchedProducts: Product[] = [];
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/chat`,
        { message: userText },
        { timeout: 3500 }
      );
      if (Array.isArray(data?.products) && data.products.length > 0) {
        matchedProducts = data.products;
      }
    } catch {
      // Fallback to client-side 384-D Vector DB + Cosine Similarity index when backend is offline
      const clientRag = searchClientVectorDB(userText, maxBudget, 4);
      matchedProducts = clientRag.products;
    }

    if (matchedProducts.length === 0) {
      const clientRag = searchClientVectorDB(userText, maxBudget, 4);
      matchedProducts = clientRag.products;
    }

    if (matchedProducts.length > 0) {
      // Pick up to 2 representative items (e.g. 1 shoe + 1 shirt for multi-item queries) so the chat stays compact
      const uniqueCategoryPicks: Product[] = [];
      const seenIcons = new Set<string>();
      for (const p of matchedProducts) {
        const key = p.tags?.[0] || p.category;
        if (!seenIcons.has(key) && uniqueCategoryPicks.length < 2) {
          seenIcons.add(key);
          uniqueCategoryPicks.push(p);
        }
      }
      for (const p of matchedProducts) {
        if (uniqueCategoryPicks.length >= 2) break;
        if (!uniqueCategoryPicks.some(u => u.id === p.id)) {
          uniqueCategoryPicks.push(p);
        }
      }

      const topProducts = uniqueCategoryPicks.map(summarizeProductForChat);

      return {
        text: '',
        products: topProducts,
        suggestedQuery: userText
          .replace(/(?:under|below|less than|max|budget(?:\s+of)?)\s*\$?\s*\d+/gi, '')
          .replace(/\b(?:cheapest|lowest price|nearest|closest|near me|genuine reviews|fake reviews|recommend|suggest|which mart has|where can i buy)\b/gi, '')
          .trim()
      };
    }

    // Fallback when no specific product matched -> Ask if they want suggestions or to leave
    return {
      text: `No exact match for "${userText}". Do you want something else?`,
      showOptions: true
    };
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? input).trim();
    if (!textToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsTyping(true);

    const response = await generateBotResponse(textToSend);
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: 'Just now',
      ...response
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'Chat cleared. What product can I find for you?',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[410px] max-w-[calc(100vw-2.5rem)] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-extrabold tracking-tight text-white">ShopSense AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 max-h-[390px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.text && (
                  <div className="flex items-start space-x-2 max-w-[92%]">
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white font-medium rounded-br-sm'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                )}

                {/* Option Buttons: Suggest Products or Leave */}
                {msg.showOptions && (
                  <div className="mt-2 pl-8 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSend('Suggest Products')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Suggest Products
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                )}

                {/* Product Comparison Cards Inside Chat */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 w-full pl-8 space-y-2.5">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:border-emerald-400 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-900 flex-shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              {prod.brand} • {prod.availableMartCount} {prod.availableMartCount === 1 ? 'Mart' : 'Marts'}
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-900 truncate">{prod.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                From ${prod.lowestPrice}
                              </span>
                              <span className="inline-flex items-center text-[11px] text-slate-500">
                                <MapPin className="h-3 w-3 text-emerald-600 mr-0.5" />
                                {prod.nearestMartDistanceKm.toFixed(1)} km
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mart & Review Trust Insight */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                              Best Genuine Pick:
                            </span>
                            <span className="font-bold text-slate-900">
                              {prod.trustedMartName} (${prod.trustedMartPrice})
                            </span>
                          </div>
                          {prod.lowestMartFakePct >= 50 && (
                            <div className="flex items-center justify-between text-rose-600">
                              <span className="inline-flex items-center gap-1 font-semibold">
                                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                                Fake Review Alert:
                              </span>
                              <span className="font-semibold">
                                {prod.lowestMartName} ({prod.lowestMartFakePct}% Fake)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigate(`/search?q=${encodeURIComponent(prod.name)}`);
                              setIsOpen(false);
                            }}
                            className="flex-1 inline-flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg transition-colors"
                          >
                            <span>Compare Marts</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${prod.trustedMartLat},${prod.trustedMartLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold py-1.5 px-2.5 rounded-lg transition-colors"
                          >
                            <Navigation className="h-3 w-3 text-emerald-600" />
                            <span>Directions</span>
                          </a>
                        </div>
                      </div>
                    ))}

                    {msg.suggestedQuery && msg.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(msg.suggestedQuery || '')}`);
                          setIsOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors text-center"
                      >
                        View All Matching Products on Search Page →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-500 font-medium">
                  Comparing marts, distances & reviews...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[11px] font-semibold text-slate-700 hover:text-emerald-700 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask e.g. 'I want Nike shoes and a shirt'..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-3.5 rounded-full shadow-xl shadow-emerald-900/20 hover:scale-105 transition-all"
        aria-label="Toggle ShopSense AI Assistant"
      >
        {isOpen ? (
          <>
            <X className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Close Assistant</span>
          </>
        ) : (
          <>
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs sm:text-sm">Ask ShopSense AI</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
