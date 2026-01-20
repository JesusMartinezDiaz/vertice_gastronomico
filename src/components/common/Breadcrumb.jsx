/**
 * Componente Breadcrumb - Navegación contextual
 * Vértice Gastronómico
 */

import React from 'react';

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export function Breadcrumb({ items = [], onNavigate }) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      <button
        onClick={() => onNavigate?.('dashboard')}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <HomeIcon />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <ChevronIcon />
          {index === items.length - 1 ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <button
              onClick={() => onNavigate?.(item.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
