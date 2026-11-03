import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../data/products';

const LOCAL_WISHLIST_KEY = 'shopsense_wishlist_items';
const LOCAL_ACTIVITY_KEY = 'shopsense_activity_log';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface StoredWishlistItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  rating: number;
  reviewCount: number;
  description: string;
  url?: string;
  dateAdded: string;
}

export function getLocalWishlistItems(): StoredWishlistItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalWishlistItems(items: StoredWishlistItem[]): void {
  try {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

function logLocalActivity(type: string, description: string) {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = [{ type, description, timestamp: new Date().toISOString() }, ...(Array.isArray(list) ? list : [])].slice(0, 20);
    localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(next));
  } catch {
    // Ignore
  }
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    return new Set(getLocalWishlistItems().map(i => i.productId));
  });

  useEffect(() => {
    const fetchInitialWishlist = async () => {
      const localItems = getLocalWishlistItems();
      if (localItems.length > 0) {
        setWishlist(new Set(localItems.map(i => i.productId)));
      }

      const token = localStorage.getItem('token');
      if (!token || token.startsWith('local-jwt-')) return;
      try {
        const response = await axios.get(`${API_BASE}/api/auth/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 2500
        });
        if (Array.isArray(response.data?.wishlist)) {
          setWishlist(new Set(response.data.wishlist.map((item: { productId: string }) => item.productId)));
        }
      } catch {
        // Keep local wishlist state
      }
    };
    fetchInitialWishlist();
  }, []);

  const toggleWishlist = useCallback(async (product: Product) => {
    const token = localStorage.getItem('token');
    const isInWishlist = wishlist.has(product.id);
    const localItems = getLocalWishlistItems();

    if (isInWishlist) {
      const updated = localItems.filter(i => i.productId !== product.id);
      saveLocalWishlistItems(updated);
      logLocalActivity('wishlist_remove', `Removed "${product.name}" from saved items`);
      setWishlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });

      if (token && !token.startsWith('local-jwt-')) {
        try {
          await axios.delete(`${API_BASE}/api/auth/wishlist/${product.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 2500
          });
        } catch {
          // Local update already succeeded
        }
      }
      return { success: true, action: 'removed', message: 'Product removed from your saved items' };
    } else {
      const newItem: StoredWishlistItem = {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        store: product.store,
        rating: product.rating,
        reviewCount: product.reviewCount,
        description: product.description,
        url: product.url,
        dateAdded: new Date().toISOString()
      };
      saveLocalWishlistItems([newItem, ...localItems.filter(i => i.productId !== product.id)]);
      logLocalActivity('wishlist_add', `Saved "${product.name}" to wishlist`);
      setWishlist(prev => new Set(prev).add(product.id));

      if (token && !token.startsWith('local-jwt-')) {
        try {
          await axios.post(
            `${API_BASE}/api/auth/wishlist`,
            newItem,
            { headers: { Authorization: `Bearer ${token}` }, timeout: 2500 }
          );
        } catch {
          // Local update already succeeded
        }
      }
      return { success: true, action: 'added', message: 'Product saved to your wishlist!' };
    }
  }, [wishlist]);

  return { wishlist, toggleWishlist, setWishlist };
};
