import React from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const bgColors = {
    success: 'bg-green-900/90 text-green-100',
    error: 'bg-red-900/90 text-red-100',
    info: 'bg-blue-900/90 text-blue-100'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm ${bgColors[type]}`}>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
