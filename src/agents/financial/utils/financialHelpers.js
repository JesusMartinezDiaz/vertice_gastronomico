/**
 * Financial Helpers - Utilidades financieras para agentes
 */

// ============ CÁLCULOS DE RENTABILIDAD ============

export function calculateFoodCost(cost, sellingPrice) {
  if (sellingPrice <= 0) return 0;
  return (cost / sellingPrice) * 100;
}

export function calculateGrossMargin(revenue, cogs) {
  if (revenue <= 0) return 0;
  return ((revenue - cogs) / revenue) * 100;
}

export function calculatePrimeCost(foodCost, laborCost) {
  return foodCost + laborCost;
}

export function calculateContributionMargin(price, variableCost) {
  return price - variableCost;
}

export function calculateBreakEvenUnits(fixedCosts, contributionMargin) {
  if (contributionMargin <= 0) return Infinity;
  return Math.ceil(fixedCosts / contributionMargin);
}

// ============ MÉTRICAS DE LIQUIDEZ ============

export function calculateCurrentRatio(currentAssets, currentLiabilities) {
  if (currentLiabilities <= 0) return Infinity;
  return currentAssets / currentLiabilities;
}

export function calculateQuickRatio(currentAssets, inventory, currentLiabilities) {
  if (currentLiabilities <= 0) return Infinity;
  return (currentAssets - inventory) / currentLiabilities;
}

export function calculateWorkingCapital(currentAssets, currentLiabilities) {
  return currentAssets - currentLiabilities;
}

// ============ MÉTRICAS DE EFICIENCIA ============

export function calculateDSO(receivables, revenue) {
  if (revenue <= 0) return 0;
  return (receivables / revenue) * 365;
}

export function calculateDPO(payables, cogs) {
  if (cogs <= 0) return 0;
  return (payables / cogs) * 365;
}

export function calculateDIO(inventory, cogs) {
  if (cogs <= 0) return 0;
  return (inventory / cogs) * 365;
}

export function calculateCashConversionCycle(dso, dio, dpo) {
  return dso + dio - dpo;
}

export function calculateInventoryTurnover(cogs, averageInventory) {
  if (averageInventory <= 0) return 0;
  return cogs / averageInventory;
}

// ============ CÁLCULOS GASTRONÓMICOS ============

export function suggestSellingPrice(cost, targetFoodCost = 28) {
  if (targetFoodCost <= 0) return 0;
  return cost / (targetFoodCost / 100);
}

export function calculateCostPerPortion(totalCost, portions) {
  if (portions <= 0) return totalCost;
  return totalCost / portions;
}

export function adjustForYield(quantity, yieldPercentage) {
  if (yieldPercentage <= 0) return quantity;
  return quantity / (yieldPercentage / 100);
}

export function calculateWastePercentage(wasteValue, totalPurchases) {
  if (totalPurchases <= 0) return 0;
  return (wasteValue / totalPurchases) * 100;
}

// ============ ANÁLISIS DE VARIACIONES ============

export function calculateVariance(actual, budget) {
  return actual - budget;
}

export function calculateVariancePercentage(actual, budget) {
  if (budget === 0) return actual === 0 ? 0 : 100;
  return ((actual - budget) / Math.abs(budget)) * 100;
}

export function isFavorableVariance(variance, isCost = false) {
  return isCost ? variance < 0 : variance > 0;
}

// ============ FORMATEO ============

export function formatCurrency(amount, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
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

// ============ VALIDACIONES ============

export function isValidFoodCost(foodCost, maxAllowed = 35) {
  return foodCost >= 0 && foodCost <= maxAllowed;
}

export function isValidPrimeCost(primeCost, maxAllowed = 65) {
  return primeCost >= 0 && primeCost <= maxAllowed;
}

export function isValidMargin(margin, minRequired = 20) {
  return margin >= minRequired;
}

// ============ CONSTANTES FINANCIERAS ============

export const FINANCIAL_CONSTANTS = {
  TARGET_FOOD_COST: 28,
  MAX_FOOD_COST: 35,
  TARGET_LABOR_COST: 28,
  MAX_LABOR_COST: 35,
  TARGET_PRIME_COST: 56,
  MAX_PRIME_COST: 65,
  MIN_GROSS_MARGIN: 60,
  MIN_NET_MARGIN: 10,
  TARGET_CURRENT_RATIO: 1.5,
  TARGET_DSO: 15,
  TARGET_DPO: 30,
  TARGET_CCC: 15
};

export default {
  calculateFoodCost,
  calculateGrossMargin,
  calculatePrimeCost,
  suggestSellingPrice,
  formatCurrency,
  formatPercentage,
  FINANCIAL_CONSTANTS
};
