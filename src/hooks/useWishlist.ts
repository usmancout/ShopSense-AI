import { useState, useCallback } from 'react';
import axios from 'axios';
import { Product } from '../data/products';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = useCallback(async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      const isInWishlist = wishlist.has(product.id);

      if (isInWishlist) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/wishlist/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
        return { success: true, action: 'removed', message: 'Product removed from your wishlist' };
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/wishlist`, {
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
          url: product.url
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(prev => new Set(prev).add(product.id));
        return { success: true, action: 'added', message: 'Product added to your wishlist!' };
      }
    } catch (error: any) {
      console.error('Failed to update wishlist:', error);
      return { success: false, message: 'This product is already in your wishlist!' };
    }
  }, [wishlist]);

  return { wishlist, toggleWishlist, setWishlist };
};
