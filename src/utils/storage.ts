// Local storage utilities for offline functionality
export class StorageService {
  private static readonly KEYS = {
    WISHLIST: 'shopsense_wishlist',
    RECENT_SEARCHES: 'shopsense_recent_searches',
    USER_ACTIVITY: 'shopsense_user_activity',
    DASHBOARD_CACHE: 'shopsense_dashboard_cache',
  };

  // Generic storage methods
  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  // Wishlist methods
  static getWishlist(): string[] {
    return this.getItem<string[]>(this.KEYS.WISHLIST) || [];
  }

  static addToWishlist(productId: string): void {
    const wishlist = this.getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      this.setItem(this.KEYS.WISHLIST, wishlist);
    }
  }

  static removeFromWishlist(productId: string): void {
    const wishlist = this.getWishlist();
    const filtered = wishlist.filter(id => id !== productId);
    this.setItem(this.KEYS.WISHLIST, filtered);
  }

  static isInWishlist(productId: string): boolean {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  // Recent searches methods
  static getRecentSearches(): string[] {
    return this.getItem<string[]>(this.KEYS.RECENT_SEARCHES) || [];
  }

  static addRecentSearch(query: string): void {
    const searches = this.getRecentSearches();
    const filtered = searches.filter(s => s !== query);
    filtered.unshift(query);
    const limited = filtered.slice(0, 10); // Keep only last 10 searches
    this.setItem(this.KEYS.RECENT_SEARCHES, limited);
  }

  // User activity methods
  static getUserActivity(): any[] {
    return this.getItem<any[]>(this.KEYS.USER_ACTIVITY) || [];
  }

  static addUserActivity(activity: any): void {
    const activities = this.getUserActivity();
    activities.unshift(activity);
    const limited = activities.slice(0, 50); // Keep only last 50 activities
    this.setItem(this.KEYS.USER_ACTIVITY, limited);
  }

  // Dashboard cache methods
  static getDashboardCache(): any {
    const cache = this.getItem<any>(this.KEYS.DASHBOARD_CACHE);
    if (cache && cache.timestamp && Date.now() - cache.timestamp < 5 * 60 * 1000) {
      return cache.data;
    }
    return null;
  }

  static setDashboardCache(data: any): void {
    this.setItem(this.KEYS.DASHBOARD_CACHE, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear all app data
  static clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      this.removeItem(key);
    });
  }
}