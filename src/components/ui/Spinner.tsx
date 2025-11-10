import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-purple-500 ${sizeClasses[size]} ${className}`} />
  );
};
