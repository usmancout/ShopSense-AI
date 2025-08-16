export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  store: string;
  inStock: boolean;
  description: string;
  features: string[];
  tags: string[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'search' | 'view' | 'wishlist_add' | 'wishlist_remove';
  description: string;
  metadata?: any;
  createdAt: string;
}

export interface DashboardStats {
  totalSearches: number;
  wishlistItems: number;
  productsViewed: number;
  recentSearches: string[];
  recentActivity: UserActivity[];
  recommendedProducts: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}