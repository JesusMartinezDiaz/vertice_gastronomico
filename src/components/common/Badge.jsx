/**
 * Componente Badge - Vértice Gastronómico
 */

import React from 'react';

const variants = {
  default: 'bg-gray-600 text-gray-100',
  primary: 'bg-emerald-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-black',
  danger: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          variant === 'warning' ? 'bg-yellow-800' : 'bg-current opacity-75'
        }`} />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status, labels = {}, colors = {} }) {
  const defaultColors = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    PREPARING: 'warning',
    READY: 'success',
    DELIVERED: 'success',
    COMPLETED: 'default',
    CANCELLED: 'danger',
    ACTIVE: 'success',
    INACTIVE: 'default',
    LOW_STOCK: 'warning',
    OUT_OF_STOCK: 'danger',
    EXPIRING: 'warning'
  };

  const variant = colors[status] || defaultColors[status] || 'default';
  const label = labels[status] || status;

  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}

export default Badge;
