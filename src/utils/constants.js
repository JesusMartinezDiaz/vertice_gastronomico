/**
 * Constantes - Vértice Gastronómico
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  PREPARING: 'En preparación',
  READY: 'Lista',
  DELIVERED: 'Entregada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada'
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-blue-500',
  PREPARING: 'bg-orange-500',
  READY: 'bg-green-500',
  DELIVERED: 'bg-teal-500',
  COMPLETED: 'bg-gray-500',
  CANCELLED: 'bg-red-500'
};

// Tipos de pago
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  TRANSFER: 'TRANSFER',
  OTHER: 'OTHER'
};

export const PAYMENT_METHOD_LABELS = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  OTHER: 'Otro'
};

// Tipos de alerta de inventario
export const ALERT_TYPES = {
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  EXPIRING: 'EXPIRING',
  OVER_STOCK: 'OVER_STOCK'
};

export const ALERT_TYPE_LABELS = {
  LOW_STOCK: 'Stock bajo',
  OUT_OF_STOCK: 'Sin stock',
  EXPIRING: 'Por vencer',
  OVER_STOCK: 'Sobrestock'
};

// Unidades de medida
export const UNITS = {
  KG: 'kg',
  G: 'g',
  L: 'L',
  ML: 'ml',
  PZ: 'pz',
  UNIT: 'unidad'
};

// Roles de usuario
export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CHEF: 'CHEF',
  WAITER: 'WAITER',
  CASHIER: 'CASHIER'
};

export const USER_ROLE_LABELS = {
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  CHEF: 'Chef',
  WAITER: 'Mesero',
  CASHIER: 'Cajero'
};

// Planes de suscripción
export const SUBSCRIPTION_PLANS = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE'
};

// Configuración de archivos
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

// Navegación
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'orders', label: 'Órdenes', icon: 'ClipboardList', path: '/orders' },
  { id: 'menu', label: 'Menú', icon: 'UtensilsCrossed', path: '/menu' },
  { id: 'inventory', label: 'Inventario', icon: 'Package', path: '/inventory' },
  { id: 'reports', label: 'Reportes', icon: 'BarChart3', path: '/reports' },
  { id: 'ai-agents', label: 'Agentes IA', icon: 'Bot', path: '/agents' },
  { id: 'gamification', label: 'Mi Progreso', icon: 'Trophy', path: '/progress' },
  { id: 'settings', label: 'Configuración', icon: 'Settings', path: '/settings' }
];

export default {
  API_URL,
  WS_URL,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  ALERT_TYPES,
  ALERT_TYPE_LABELS,
  UNITS,
  USER_ROLES,
  USER_ROLE_LABELS,
  SUBSCRIPTION_PLANS,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOC_TYPES,
  NAV_ITEMS
};
