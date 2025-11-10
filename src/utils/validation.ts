export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true;
  return /^\+?[\d\s-]{10,}$/.test(phone);
};
