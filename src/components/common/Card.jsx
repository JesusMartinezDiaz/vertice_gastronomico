/**
 * Componente Card - Vértice Gastronómico
 */

import React from 'react';

export function Card({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick
}) {
  const baseClasses = 'bg-gray-800 rounded-xl border border-gray-700';
  const paddingClasses = padding ? 'p-6' : '';
  const hoverClasses = hover ? 'hover:border-gray-600 transition-colors cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
