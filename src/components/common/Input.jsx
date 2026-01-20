/**
 * Componente Input - Vértice Gastronómico
 */

import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={`
            w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-gray-600'}
            ${className}
          `}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export function TextArea({
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  required = false,
  disabled = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed resize-none
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  options = [],
  placeholder = 'Seleccionar...',
  className = '',
  required = false,
  disabled = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-gray-700 border rounded-lg text-white
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default Input;
