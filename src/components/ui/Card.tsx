import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-gray-800 rounded-xl overflow-hidden ${
        hover ? 'group hover:shadow-xl transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
