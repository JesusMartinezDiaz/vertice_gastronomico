/**
 * Kitchen Helpers - Utilidades culinarias para agentes
 */

// ============ CONVERSIONES DE TEMPERATURA ============

export function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

export function getInternalTempTarget(protein) {
  const targets = {
    'beef_rare': { celsius: 52, fahrenheit: 125 },
    'beef_medium_rare': { celsius: 54, fahrenheit: 130 },
    'beef_medium': { celsius: 60, fahrenheit: 140 },
    'beef_medium_well': { celsius: 65, fahrenheit: 150 },
    'beef_well': { celsius: 71, fahrenheit: 160 },
    'pork': { celsius: 63, fahrenheit: 145 },
    'chicken': { celsius: 74, fahrenheit: 165 },
    'fish': { celsius: 63, fahrenheit: 145 },
    'lamb_rare': { celsius: 54, fahrenheit: 130 },
    'lamb_medium': { celsius: 63, fahrenheit: 145 }
  };
  return targets[protein] || targets.chicken;
}

// ============ CONVERSIONES DE PESO Y VOLUMEN ============

export function gramsToOunces(grams) {
  return grams * 0.03527396;
}

export function ouncesToGrams(ounces) {
  return ounces * 28.3495;
}

export function mlToFlOz(ml) {
  return ml * 0.033814;
}

export function flOzToMl(flOz) {
  return flOz * 29.5735;
}

export function litersToGallons(liters) {
  return liters * 0.264172;
}

export function gallonsToLiters(gallons) {
  return gallons * 3.78541;
}

export function kgToLbs(kg) {
  return kg * 2.20462;
}

export function lbsToKg(lbs) {
  return lbs / 2.20462;
}

// ============ ESCALADO DE RECETAS ============

export function scaleRecipe(ingredients, originalYield, newYield) {
  const factor = newYield / originalYield;
  return ingredients.map(ing => ({
    ...ing,
    quantity: roundToNice(ing.quantity * factor),
    originalQuantity: ing.quantity
  }));
}

export function roundToNice(value) {
  // Redondear a valores "bonitos" para cocina
  if (value < 0.125) return Math.ceil(value * 16) / 16; // 1/16
  if (value < 1) return Math.round(value * 8) / 8; // 1/8
  if (value < 10) return Math.round(value * 4) / 4; // 1/4
  if (value < 100) return Math.round(value);
  return Math.round(value / 5) * 5;
}

export function calculateYieldPercentage(rawWeight, cleanWeight) {
  if (rawWeight <= 0) return 0;
  return (cleanWeight / rawWeight) * 100;
}

export function adjustForYield(quantity, yieldPercentage) {
  if (yieldPercentage <= 0) return quantity;
  return quantity / (yieldPercentage / 100);
}

// ============ TIEMPOS DE COCCIÓN ============

export function calculateCookingTime(weight, minutesPerKg, shape = 'round') {
  const shapeMultipliers = {
    round: 1,
    flat: 0.8,
    thick: 1.2
  };
  const multiplier = shapeMultipliers[shape] || 1;
  return weight * minutesPerKg * multiplier;
}

export function calculateRestTime(weight) {
  // Regla general: 1 minuto de reposo por cada 100g de carne
  return Math.max(5, Math.ceil(weight / 100));
}

// ============ MISE EN PLACE ============

export function calculateMiseEnPlace(menuItems, expectedCovers, bufferPercentage = 20) {
  return menuItems.map(item => {
    const expectedOrders = Math.ceil(expectedCovers * (item.salesMix || 0.1));
    const withBuffer = Math.ceil(expectedOrders * (1 + bufferPercentage / 100));

    return {
      item: item.name,
      expectedOrders,
      prepQuantity: withBuffer,
      unit: item.unit || 'portions',
      parLevel: item.parLevel || withBuffer
    };
  });
}

export function prioritizePrepList(items) {
  return [...items].sort((a, b) => {
    // Priorizar por: tiempo de prep (mayor primero), perecederos, popularidad
    const timeDiff = (b.prepTime || 0) - (a.prepTime || 0);
    if (timeDiff !== 0) return timeDiff;

    const perishableDiff = (b.isPerishable ? 1 : 0) - (a.isPerishable ? 1 : 0);
    if (perishableDiff !== 0) return perishableDiff;

    return (b.salesMix || 0) - (a.salesMix || 0);
  });
}

// ============ SEGURIDAD ALIMENTARIA ============

export const DANGER_ZONE = { min: 4, max: 60 }; // Celsius

export function isInDangerZone(temperature) {
  return temperature > DANGER_ZONE.min && temperature < DANGER_ZONE.max;
}

export function getMaxHoldingTime(temperature, product = 'general') {
  if (!isInDangerZone(temperature)) return Infinity;

  // En zona de peligro, máximo 2 horas según regulaciones
  const holdingTimes = {
    'raw_meat': 1,
    'cooked_meat': 2,
    'dairy': 1,
    'seafood': 1,
    'general': 2
  };

  return holdingTimes[product] || 2;
}

export function calculateCoolingTime(startTemp, targetTemp, method = 'ice_bath') {
  // Regla 2-4: enfriar de 60°C a 21°C en 2 horas, luego a 5°C en 4 horas
  const coolingRates = {
    'ice_bath': 1.5, // Factor de velocidad
    'shallow_pan': 1.2,
    'blast_chiller': 3,
    'refrigerator': 0.5
  };

  const rate = coolingRates[method] || 1;
  const tempDiff = startTemp - targetTemp;

  // Tiempo base: 1 hora por cada 10°C en refrigerador
  return Math.ceil((tempDiff / 10) / rate) * 60; // minutos
}

// ============ CAFÉ Y BEBIDAS ============

export function calculateBrewRatio(coffeeGrams, waterMl, method = 'espresso') {
  const ratios = {
    'espresso': { min: 1.5, max: 2.5, target: 2 },
    'filter': { min: 15, max: 18, target: 16 },
    'french_press': { min: 12, max: 15, target: 14 },
    'cold_brew': { min: 5, max: 8, target: 7 }
  };

  const ratio = waterMl / coffeeGrams;
  const standard = ratios[method] || ratios.filter;

  return {
    actual: ratio.toFixed(2),
    target: standard.target,
    inRange: ratio >= standard.min && ratio <= standard.max,
    recommendation: ratio < standard.min
      ? 'Agregar más agua o reducir café'
      : ratio > standard.max
        ? 'Reducir agua o agregar más café'
        : 'Ratio óptimo'
  };
}

export function calculateExtractionYield(tds, brewRatio) {
  // Extraction Yield = TDS × Brew Ratio
  return (tds / 100) * brewRatio * 100;
}

export function getMilkTemperature(milkType) {
  const temps = {
    'whole': { min: 55, max: 65, optimal: 60 },
    'skim': { min: 55, max: 65, optimal: 60 },
    'oat': { min: 50, max: 60, optimal: 55 },
    'almond': { min: 50, max: 60, optimal: 55 },
    'soy': { min: 50, max: 60, optimal: 55 },
    'coconut': { min: 50, max: 60, optimal: 55 }
  };
  return temps[milkType] || temps.whole;
}

// ============ VINOS Y BEBIDAS ============

export function calculatePourCost(ingredientCost, sellingPrice) {
  if (sellingPrice <= 0) return 0;
  return (ingredientCost / sellingPrice) * 100;
}

export function suggestCocktailPrice(ingredientCost, targetPourCost = 20) {
  if (targetPourCost <= 0) return ingredientCost;
  return ingredientCost / (targetPourCost / 100);
}

export function calculateWineMarkup(cost, markupType = 'standard') {
  const markups = {
    'house': 2.5,
    'standard': 3,
    'premium': 2.5,
    'reserve': 2,
    'by_glass': 4
  };

  const multiplier = markups[markupType] || 3;
  return cost * multiplier;
}

export function getWineServingTemp(wineType) {
  const temps = {
    'sparkling': { min: 6, max: 8 },
    'light_white': { min: 7, max: 10 },
    'full_white': { min: 10, max: 12 },
    'rose': { min: 10, max: 12 },
    'light_red': { min: 12, max: 14 },
    'full_red': { min: 15, max: 18 },
    'dessert': { min: 6, max: 8 },
    'fortified': { min: 12, max: 16 }
  };
  return temps[wineType] || temps.full_red;
}

// ============ CONSTANTES CULINARIAS ============

export const KITCHEN_CONSTANTS = {
  // Temperaturas de seguridad (Celsius)
  COLD_HOLDING_MAX: 4,
  HOT_HOLDING_MIN: 60,
  REHEATING_MIN: 74,

  // Tiempos máximos
  MAX_THAW_DAYS_REFRIGERATOR: 3,
  MAX_READY_TO_EAT_DAYS: 7,

  // Estándares de café
  ESPRESSO_DOSE_MIN: 18,
  ESPRESSO_DOSE_MAX: 20,
  ESPRESSO_TIME_MIN: 25,
  ESPRESSO_TIME_MAX: 30,

  // Objetivos de costo
  FOOD_COST_TARGET: 28,
  BEVERAGE_COST_TARGET: 20,
  LABOR_COST_TARGET: 28,

  // Estándares de servicio
  TICKET_TIME_TARGET: 12, // minutos
  QUALITY_SCORE_MIN: 85
};

export default {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  scaleRecipe,
  calculateYieldPercentage,
  isInDangerZone,
  calculateBrewRatio,
  calculatePourCost,
  KITCHEN_CONSTANTS
};
