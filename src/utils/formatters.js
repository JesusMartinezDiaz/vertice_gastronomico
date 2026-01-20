/**
 * Utilidades de Formato - Vértice Gastronómico
 * Funciones para formateo de moneda, porcentajes y fechas
 */

// Formato de Pesos Mexicanos
export const formatMXN = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00 MXN';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

export const formatMXNShort = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M MXN`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K MXN`;
  }
  return formatMXN(amount, 0);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

// Formato de fechas
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: options.dateStyle || 'medium',
    timeStyle: options.timeStyle,
    ...options
  }).format(d);
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(d);
};

// Formato de números
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

// Formato de tamaño de archivos
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Formato de duración
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 1) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export default {
  formatMXN,
  formatMXNShort,
  formatPercentage,
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatFileSize,
  formatDuration
};
