export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const STORE_APIS = {
  MARTELLO: 'https://martello.onrender.com/api/products',
  PRODEXA: 'https://prodexa.onrender.com/api/products',
  STORENTA: 'https://storenta.onrender.com/api/products'
} as const;

export const NOTIFICATION_DURATION = 3000;

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 2000,
  STEP: 50
} as const;
