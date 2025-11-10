export const calculateDiscount = (price: number, originalPrice: number): number => {
  return Math.round((1 - price / originalPrice) * 100);
};

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};
