/**
 * Helpers - Utilidades del Agente 71
 * Funciones de apoyo para la gestión de proyectos
 */

// ============ Generadores de ID ============

export function generateProjectId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `proj-${timestamp}-${random}`;
}

export function generateTaskId(prefix = 'task') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}`;
}

export function generateDeliverableId() {
  return `del-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

// ============ Formateo de Fechas ============

export function formatDate(date, format = 'full') {
  const d = new Date(date);

  const formats = {
    full: { year: 'numeric', month: 'long', day: 'numeric' },
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    iso: null, // Handled specially
    relative: null // Handled specially
  };

  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }

  if (format === 'relative') {
    return getRelativeTime(d);
  }

  return d.toLocaleDateString('es-ES', formats[format] || formats.full);
}

export function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'ahora mismo';
}

export function calculateDaysUntil(deadline) {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ============ Formateo de Números ============

export function formatCurrency(amount, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// ============ Cálculos Gastronómicos ============

export function calculateFoodCost(cost, sellingPrice) {
  if (sellingPrice <= 0) return 0;
  return (cost / sellingPrice) * 100;
}

export function calculateMargin(sellingPrice, cost) {
  return sellingPrice - cost;
}

export function calculateMarginPercentage(sellingPrice, cost) {
  if (sellingPrice <= 0) return 0;
  return ((sellingPrice - cost) / sellingPrice) * 100;
}

export function suggestSellingPrice(cost, targetFoodCost = 30) {
  if (targetFoodCost <= 0) return 0;
  return cost / (targetFoodCost / 100);
}

export function calculateBreakEven(fixedCosts, contributionMargin) {
  if (contributionMargin <= 0) return Infinity;
  return fixedCosts / contributionMargin;
}

// ============ Validaciones ============

export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone) {
  const re = /^[\d\s\-+()]{8,}$/;
  return re.test(phone);
}

export function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isPositiveNumber(value) {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

export function isInRange(value, min, max) {
  return value >= min && value <= max;
}

// ============ Transformaciones de Datos ============

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function mergeDeep(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      result[key] = mergeDeep(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

export function sortByKey(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    }
    return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
  });
}

export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function filterByStatus(items, status) {
  return items.filter(item => item.status === status);
}

// ============ Estadísticas ============

export function calculateAverage(values) {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export function calculateSum(values) {
  if (!values || values.length === 0) return 0;
  return values.reduce((acc, val) => acc + val, 0);
}

export function calculateMin(values) {
  if (!values || values.length === 0) return 0;
  return Math.min(...values);
}

export function calculateMax(values) {
  if (!values || values.length === 0) return 0;
  return Math.max(...values);
}

export function calculateMedian(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ============ Generación de Reportes ============

export function generateSummary(project) {
  const tasks = project.structure?.tasks || [];
  const deliverables = project.structure?.deliverables || [];

  return {
    projectName: project.meta?.name,
    status: project.meta?.status,
    progress: calculateProgress(tasks),
    tasksCompleted: tasks.filter(t => t.status === 'completed').length,
    totalTasks: tasks.length,
    deliverablesReady: deliverables.filter(d => d.validated).length,
    totalDeliverables: deliverables.length,
    qualityScore: project.quality?.score || 0,
    daysRemaining: project.meta?.deadline
      ? calculateDaysUntil(project.meta.deadline)
      : null,
    lastUpdate: project.meta?.updatedAt
  };
}

export function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
}

// ============ Logging y Debug ============

export function createLog(action, details, level = 'info') {
  return {
    timestamp: new Date().toISOString(),
    action,
    details,
    level,
    agent: 'agent-71'
  };
}

export function formatLogEntry(log) {
  const levelEmoji = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return `[${log.timestamp}] ${levelEmoji[log.level] || '📋'} ${log.action}: ${JSON.stringify(log.details)}`;
}

// ============ Constantes Útiles ============

export const GASTRONOMIC_CONSTANTS = {
  RECOMMENDED_FOOD_COST_MAX: 35,
  RECOMMENDED_LABOR_COST_MAX: 35,
  RECOMMENDED_MARGIN_MIN: 20,
  QUALITY_SCORE_MIN: 95,
  EXPIRATION_WARNING_DAYS: 7
};

export const PROJECT_PHASES = [
  'preparation',
  'analysis',
  'development',
  'review',
  'delivery'
];

export const TASK_PRIORITIES = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

export const DELIVERABLE_STATUSES = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  review: 'En Revisión',
  approved: 'Aprobado',
  delivered: 'Entregado'
};

// ============ Exports Adicionales ============

export default {
  generateProjectId,
  generateTaskId,
  generateDeliverableId,
  formatDate,
  formatCurrency,
  formatPercentage,
  calculateFoodCost,
  calculateMargin,
  suggestSellingPrice,
  calculateProgress,
  generateSummary,
  createLog,
  GASTRONOMIC_CONSTANTS,
  PROJECT_PHASES,
  TASK_PRIORITIES
};
