import { useState, useEffect, useCallback } from 'react';

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const useNotification = (duration = 3000) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification, duration]);

  const showNotification = useCallback((type: Notification['type'], message: string) => {
    setNotification({ type, message });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
};
