/**
 * TripleReviewSystem - Sistema de Triple Revisión de Calidad
 *
 * "El más mínimo error es nuestro prestigio"
 *
 * Este sistema garantiza que TODOS los reportes y documentos generados
 * por cualquier agente pasen por un riguroso proceso de 3 revisiones
 * antes de ser emitidos al usuario final.
 *
 * REVISIÓN 1: Validación Técnica Automatizada
 * - Cálculos matemáticos y fórmulas
 * - Rangos y límites válidos
 * - Formatos de datos correctos
 * - Completitud de campos requeridos
 *
 * REVISIÓN 2: Verificación de Consistencia y Lógica
 * - Referencias cruzadas entre datos
 * - Coherencia lógica de resultados
 * - Validación de totales y subtotales
 * - Detección de anomalías estadísticas
 *
 * REVISIÓN 3: Control de Calidad Final
 * - Ortografía y gramática
 * - Formato profesional
 * - Estándares de presentación
 * - Verificación de marca y branding
 */

// ============ ERRORES Y ALERTAS ============

export const ERROR_SEVERITY = {
  CRITICAL: 'critical',    // Bloquea emisión
  HIGH: 'high',            // Requiere corrección manual
  MEDIUM: 'medium',        // Advertencia importante
  LOW: 'low',              // Sugerencia de mejora
  INFO: 'info'             // Informativo
};

export const ERROR_CATEGORIES = {
  CALCULATION: 'calculation',
  FORMAT: 'format',
  LOGIC: 'logic',
  COMPLETENESS: 'completeness',
  CONSISTENCY: 'consistency',
  SPELLING: 'spelling',
  PRESENTATION: 'presentation',
  COMPLIANCE: 'compliance'
};

// ============ REVISIÓN 1: VALIDACIÓN TÉCNICA ============

export class TechnicalValidator {
  constructor(config = {}) {
    this.tolerancePercentage = config.tolerancePercentage || 0.01; // 1% tolerancia
    this.requiredFields = config.requiredFields || [];
    this.validRanges = config.validRanges || {};
  }

  async validate(document, documentType) {
    const errors = [];
    const warnings = [];
    const corrections = [];

    // 1.1 Validar cálculos matemáticos
    const calcResult = this._validateCalculations(document, documentType);
    errors.push(...calcResult.errors);
    corrections.push(...calcResult.corrections);

    // 1.2 Validar rangos válidos
    const rangeResult = this._validateRanges(document, documentType);
    errors.push(...rangeResult.errors);
    warnings.push(...rangeResult.warnings);

    // 1.3 Validar formatos de datos
    const formatResult = this._validateFormats(document);
    errors.push(...formatResult.errors);
    corrections.push(...formatResult.corrections);

    // 1.4 Validar completitud
    const completenessResult = this._validateCompleteness(document, documentType);
    errors.push(...completenessResult.errors);
    warnings.push(...completenessResult.warnings);

    return {
      reviewLevel: 1,
      reviewName: 'Validación Técnica',
      passed: errors.filter(e => e.severity === ERROR_SEVERITY.CRITICAL).length === 0,
      errors,
      warnings,
      corrections,
      timestamp: new Date().toISOString()
    };
  }

  _validateCalculations(document, documentType) {
    const errors = [];
    const corrections = [];

    // Validaciones específicas por tipo de documento
    if (documentType === 'costSheet' || documentType === 'financial') {
      // Verificar suma de ingredientes = total
      if (document.ingredients && document.totalCost !== undefined) {
        const calculatedTotal = document.ingredients.reduce(
          (sum, ing) => sum + (ing.totalCost || ing.quantity * ing.unitCost || 0), 0
        );
        const difference = Math.abs(calculatedTotal - document.totalCost);
        const tolerance = calculatedTotal * this.tolerancePercentage;

        if (difference > tolerance) {
          errors.push({
            category: ERROR_CATEGORIES.CALCULATION,
            severity: ERROR_SEVERITY.CRITICAL,
            field: 'totalCost',
            message: `Discrepancia en costo total: calculado $${calculatedTotal.toFixed(2)} vs declarado $${document.totalCost.toFixed(2)}`,
            expected: calculatedTotal,
            actual: document.totalCost
          });
          corrections.push({
            field: 'totalCost',
            originalValue: document.totalCost,
            correctedValue: calculatedTotal,
            reason: 'Suma de ingredientes no coincide con total'
          });
        }
      }

      // Verificar food cost percentage
      if (document.foodCostPercentage !== undefined && document.totalCost && document.sellingPrice) {
        const calculatedPercentage = (document.totalCost / document.sellingPrice) * 100;
        if (Math.abs(calculatedPercentage - document.foodCostPercentage) > 0.5) {
          errors.push({
            category: ERROR_CATEGORIES.CALCULATION,
            severity: ERROR_SEVERITY.HIGH,
            field: 'foodCostPercentage',
            message: `Food cost incorrecto: calculado ${calculatedPercentage.toFixed(1)}% vs declarado ${document.foodCostPercentage.toFixed(1)}%`,
            expected: calculatedPercentage,
            actual: document.foodCostPercentage
          });
          corrections.push({
            field: 'foodCostPercentage',
            originalValue: document.foodCostPercentage,
            correctedValue: parseFloat(calculatedPercentage.toFixed(1)),
            reason: 'Recálculo basado en costo/precio'
          });
        }
      }

      // Verificar márgenes
      if (document.margin !== undefined && document.totalCost && document.sellingPrice) {
        const calculatedMargin = ((document.sellingPrice - document.totalCost) / document.sellingPrice) * 100;
        if (Math.abs(calculatedMargin - document.margin) > 0.5) {
          errors.push({
            category: ERROR_CATEGORIES.CALCULATION,
            severity: ERROR_SEVERITY.HIGH,
            field: 'margin',
            message: `Margen incorrecto: calculado ${calculatedMargin.toFixed(1)}% vs declarado ${document.margin}%`
          });
        }
      }
    }

    // Validar reportes financieros
    if (documentType === 'financial') {
      // Verificar utilidad bruta = ventas - costo
      if (document.totalSales && document.costOfSales && document.grossProfit) {
        const calculatedGross = document.totalSales - document.costOfSales;
        if (Math.abs(calculatedGross - document.grossProfit) > 1) {
          errors.push({
            category: ERROR_CATEGORIES.CALCULATION,
            severity: ERROR_SEVERITY.CRITICAL,
            field: 'grossProfit',
            message: `Utilidad bruta incorrecta: esperado $${calculatedGross.toFixed(2)}, declarado $${document.grossProfit.toFixed(2)}`
          });
        }
      }

      // Verificar utilidad neta
      if (document.operatingProfit && document.financialExpenses !== undefined && document.netProfit) {
        const calculatedNet = document.operatingProfit - (document.financialExpenses || 0);
        if (Math.abs(calculatedNet - document.netProfit) > 1) {
          errors.push({
            category: ERROR_CATEGORIES.CALCULATION,
            severity: ERROR_SEVERITY.CRITICAL,
            field: 'netProfit',
            message: `Utilidad neta incorrecta: esperado $${calculatedNet.toFixed(2)}`
          });
        }
      }
    }

    // Validar porcentajes (deben sumar 100% cuando aplica)
    if (document.percentageDistribution) {
      const total = Object.values(document.percentageDistribution).reduce((a, b) => a + b, 0);
      if (Math.abs(total - 100) > 0.5) {
        errors.push({
          category: ERROR_CATEGORIES.CALCULATION,
          severity: ERROR_SEVERITY.MEDIUM,
          field: 'percentageDistribution',
          message: `Distribución porcentual suma ${total.toFixed(1)}%, debería ser 100%`
        });
      }
    }

    return { errors, corrections };
  }

  _validateRanges(document, documentType) {
    const errors = [];
    const warnings = [];

    // Rangos estándar de la industria gastronómica
    const industryRanges = {
      foodCostPercentage: { min: 15, max: 40, optimal: { min: 25, max: 32 } },
      beverageCostPercentage: { min: 15, max: 30, optimal: { min: 18, max: 24 } },
      laborCostPercentage: { min: 20, max: 40, optimal: { min: 25, max: 32 } },
      primeCoast: { min: 50, max: 70, optimal: { min: 55, max: 65 } },
      pourCost: { min: 15, max: 28, optimal: { min: 18, max: 22 } },
      margin: { min: 40, max: 85, optimal: { min: 60, max: 75 } },
      temperature: {
        danger_zone: { min: 4, max: 60 },
        cold_holding: { max: 4 },
        hot_holding: { min: 60 }
      }
    };

    // Validar food cost
    if (document.foodCostPercentage !== undefined) {
      const range = industryRanges.foodCostPercentage;
      if (document.foodCostPercentage < range.min || document.foodCostPercentage > range.max) {
        errors.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.HIGH,
          field: 'foodCostPercentage',
          message: `Food cost ${document.foodCostPercentage}% fuera de rango aceptable (${range.min}%-${range.max}%)`
        });
      } else if (document.foodCostPercentage < range.optimal.min || document.foodCostPercentage > range.optimal.max) {
        warnings.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.LOW,
          field: 'foodCostPercentage',
          message: `Food cost ${document.foodCostPercentage}% fuera del rango óptimo (${range.optimal.min}%-${range.optimal.max}%)`
        });
      }
    }

    // Validar pour cost (bebidas)
    if (document.pourCost !== undefined) {
      const range = industryRanges.pourCost;
      if (document.pourCost < range.min || document.pourCost > range.max) {
        errors.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.MEDIUM,
          field: 'pourCost',
          message: `Pour cost ${document.pourCost}% fuera de rango aceptable`
        });
      }
    }

    // Validar temperaturas de seguridad alimentaria
    if (document.temperature !== undefined) {
      const dangerZone = industryRanges.temperature.danger_zone;
      if (document.temperature > dangerZone.min && document.temperature < dangerZone.max) {
        if (document.temperatureContext !== 'cooking') {
          errors.push({
            category: ERROR_CATEGORIES.COMPLIANCE,
            severity: ERROR_SEVERITY.CRITICAL,
            field: 'temperature',
            message: `ALERTA: Temperatura ${document.temperature}°C en zona de peligro (${dangerZone.min}°C-${dangerZone.max}°C)`
          });
        }
      }
    }

    // Validar valores negativos donde no deberían existir
    const nonNegativeFields = ['totalCost', 'sellingPrice', 'quantity', 'totalSales', 'revenue'];
    nonNegativeFields.forEach(field => {
      if (document[field] !== undefined && document[field] < 0) {
        errors.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.CRITICAL,
          field,
          message: `Valor negativo no permitido en ${field}: ${document[field]}`
        });
      }
    });

    return { errors, warnings };
  }

  _validateFormats(document) {
    const errors = [];
    const corrections = [];

    // Validar fechas
    const dateFields = ['date', 'createdAt', 'updatedAt', 'expirationDate', 'timestamp'];
    dateFields.forEach(field => {
      if (document[field]) {
        const date = new Date(document[field]);
        if (isNaN(date.getTime())) {
          errors.push({
            category: ERROR_CATEGORIES.FORMAT,
            severity: ERROR_SEVERITY.MEDIUM,
            field,
            message: `Formato de fecha inválido: ${document[field]}`
          });
        }
      }
    });

    // Validar formato de moneda
    const currencyFields = ['totalCost', 'sellingPrice', 'unitCost', 'revenue', 'profit'];
    currencyFields.forEach(field => {
      if (document[field] !== undefined) {
        if (typeof document[field] === 'string') {
          const cleaned = parseFloat(document[field].replace(/[$,]/g, ''));
          if (!isNaN(cleaned)) {
            corrections.push({
              field,
              originalValue: document[field],
              correctedValue: cleaned,
              reason: 'Convertido de string a número'
            });
          } else {
            errors.push({
              category: ERROR_CATEGORIES.FORMAT,
              severity: ERROR_SEVERITY.HIGH,
              field,
              message: `Formato de moneda inválido: ${document[field]}`
            });
          }
        }
      }
    });

    // Validar formato de porcentajes
    const percentFields = ['foodCostPercentage', 'margin', 'pourCost', 'laborCost'];
    percentFields.forEach(field => {
      if (document[field] !== undefined && document[field] > 100) {
        errors.push({
          category: ERROR_CATEGORIES.FORMAT,
          severity: ERROR_SEVERITY.HIGH,
          field,
          message: `Porcentaje mayor a 100%: ${document[field]}%`
        });
      }
    });

    return { errors, corrections };
  }

  _validateCompleteness(document, documentType) {
    const errors = [];
    const warnings = [];

    // Campos requeridos por tipo de documento
    const requiredByType = {
      costSheet: ['name', 'ingredients', 'totalCost', 'sellingPrice', 'yield'],
      financial: ['period', 'totalSales', 'costOfSales', 'grossProfit'],
      report: ['title', 'generatedBy', 'date'],
      menu: ['name', 'items', 'category'],
      inventory: ['items', 'date', 'location'],
      recipe: ['name', 'ingredients', 'instructions', 'yield', 'prepTime'],
      analysis: ['title', 'data', 'conclusions']
    };

    const required = requiredByType[documentType] || [];

    required.forEach(field => {
      if (document[field] === undefined || document[field] === null || document[field] === '') {
        errors.push({
          category: ERROR_CATEGORIES.COMPLETENESS,
          severity: ERROR_SEVERITY.HIGH,
          field,
          message: `Campo requerido faltante: ${field}`
        });
      }
    });

    // Advertir sobre campos recomendados
    const recommendedFields = ['createdBy', 'createdAt', 'version', 'status'];
    recommendedFields.forEach(field => {
      if (document[field] === undefined) {
        warnings.push({
          category: ERROR_CATEGORIES.COMPLETENESS,
          severity: ERROR_SEVERITY.INFO,
          field,
          message: `Campo recomendado faltante: ${field}`
        });
      }
    });

    return { errors, warnings };
  }
}

// ============ REVISIÓN 2: CONSISTENCIA Y LÓGICA ============

export class ConsistencyValidator {
  constructor(config = {}) {
    this.historicalData = config.historicalData || null;
    this.anomalyThreshold = config.anomalyThreshold || 2; // 2 desviaciones estándar
  }

  async validate(document, documentType, context = {}) {
    const errors = [];
    const warnings = [];
    const flags = [];

    // 2.1 Referencias cruzadas
    const crossRefResult = this._validateCrossReferences(document, documentType);
    errors.push(...crossRefResult.errors);
    warnings.push(...crossRefResult.warnings);

    // 2.2 Coherencia lógica
    const logicResult = this._validateLogicalCoherence(document, documentType);
    errors.push(...logicResult.errors);
    flags.push(...logicResult.flags);

    // 2.3 Totales y subtotales
    const totalsResult = this._validateTotalsAndSubtotals(document);
    errors.push(...totalsResult.errors);

    // 2.4 Detección de anomalías
    const anomalyResult = this._detectAnomalies(document, context);
    warnings.push(...anomalyResult.warnings);
    flags.push(...anomalyResult.flags);

    return {
      reviewLevel: 2,
      reviewName: 'Verificación de Consistencia',
      passed: errors.filter(e => e.severity === ERROR_SEVERITY.CRITICAL).length === 0,
      errors,
      warnings,
      flags,
      timestamp: new Date().toISOString()
    };
  }

  _validateCrossReferences(document, documentType) {
    const errors = [];
    const warnings = [];

    // Verificar que los IDs referenciados existan
    if (document.ingredients && Array.isArray(document.ingredients)) {
      const ingredientIds = new Set();
      document.ingredients.forEach((ing, index) => {
        // Verificar duplicados
        const key = ing.id || ing.name?.toLowerCase();
        if (key && ingredientIds.has(key)) {
          warnings.push({
            category: ERROR_CATEGORIES.CONSISTENCY,
            severity: ERROR_SEVERITY.MEDIUM,
            field: `ingredients[${index}]`,
            message: `Ingrediente duplicado detectado: ${ing.name || ing.id}`
          });
        }
        ingredientIds.add(key);

        // Verificar coherencia entre cantidad y costo
        if (ing.quantity && ing.unitCost && ing.totalCost) {
          const expectedTotal = ing.quantity * ing.unitCost;
          if (Math.abs(expectedTotal - ing.totalCost) > 0.01) {
            errors.push({
              category: ERROR_CATEGORIES.CONSISTENCY,
              severity: ERROR_SEVERITY.HIGH,
              field: `ingredients[${index}].totalCost`,
              message: `Inconsistencia en ${ing.name}: cantidad × costo unitario ≠ costo total`
            });
          }
        }
      });
    }

    // Verificar referencias a categorías válidas
    const validCategories = {
      menu: ['appetizer', 'main', 'dessert', 'beverage', 'side', 'special'],
      cocktail: ['classic', 'signature', 'tiki', 'low-abv', 'mocktail'],
      wine: ['sparkling', 'white', 'red', 'rose', 'dessert', 'fortified'],
      inventory: ['spirit', 'liqueur', 'mixer', 'garnish', 'wine', 'beer', 'produce', 'protein', 'dairy']
    };

    if (document.category && validCategories[documentType]) {
      if (!validCategories[documentType].includes(document.category.toLowerCase())) {
        warnings.push({
          category: ERROR_CATEGORIES.CONSISTENCY,
          severity: ERROR_SEVERITY.LOW,
          field: 'category',
          message: `Categoría no estándar: ${document.category}`
        });
      }
    }

    return { errors, warnings };
  }

  _validateLogicalCoherence(document, documentType) {
    const errors = [];
    const flags = [];

    // Precio de venta debe ser mayor al costo
    if (document.sellingPrice && document.totalCost) {
      if (document.sellingPrice <= document.totalCost) {
        errors.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.CRITICAL,
          field: 'sellingPrice',
          message: `Precio de venta ($${document.sellingPrice}) es menor o igual al costo ($${document.totalCost})`
        });
      }
    }

    // Fechas lógicas
    if (document.startDate && document.endDate) {
      if (new Date(document.startDate) > new Date(document.endDate)) {
        errors.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.HIGH,
          field: 'dates',
          message: 'Fecha de inicio posterior a fecha de fin'
        });
      }
    }

    // Cantidades lógicas
    if (document.currentLevel !== undefined && document.parLevel !== undefined) {
      if (document.currentLevel > document.parLevel * 3) {
        flags.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.MEDIUM,
          field: 'inventory',
          message: `Nivel actual (${document.currentLevel}) excede significativamente el nivel par (${document.parLevel})`
        });
      }
    }

    // Rendimiento del platillo (yield)
    if (document.yield && document.ingredients) {
      const totalWeight = document.ingredients.reduce((sum, ing) => {
        if (ing.unit?.toLowerCase().includes('g') || ing.unit?.toLowerCase().includes('kg')) {
          return sum + (ing.quantity || 0) * (ing.unit?.toLowerCase().includes('kg') ? 1000 : 1);
        }
        return sum;
      }, 0);

      if (totalWeight > 0 && document.yield > totalWeight * 1.5) {
        flags.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.MEDIUM,
          field: 'yield',
          message: 'El rendimiento declarado parece excesivo comparado con el peso de ingredientes'
        });
      }
    }

    // Validar coherencia temporal de ventas
    if (documentType === 'salesReport' && document.byHour) {
      const totalByHour = Object.values(document.byHour).reduce((a, b) => a + b, 0);
      if (document.totalSales && Math.abs(totalByHour - document.totalSales) > 1) {
        errors.push({
          category: ERROR_CATEGORIES.LOGIC,
          severity: ERROR_SEVERITY.HIGH,
          field: 'byHour',
          message: 'Suma de ventas por hora no coincide con el total'
        });
      }
    }

    return { errors, flags };
  }

  _validateTotalsAndSubtotals(document) {
    const errors = [];

    // Verificar estructura jerárquica de totales
    if (document.sections && document.grandTotal !== undefined) {
      const calculatedGrandTotal = document.sections.reduce((sum, section) => {
        return sum + (section.subtotal || 0);
      }, 0);

      if (Math.abs(calculatedGrandTotal - document.grandTotal) > 0.01) {
        errors.push({
          category: ERROR_CATEGORIES.CALCULATION,
          severity: ERROR_SEVERITY.CRITICAL,
          field: 'grandTotal',
          message: `Gran total ($${document.grandTotal}) no coincide con suma de subtotales ($${calculatedGrandTotal.toFixed(2)})`
        });
      }
    }

    // Verificar desglose de costos
    if (document.costBreakdown && document.totalCost) {
      const breakdownTotal = Object.values(document.costBreakdown).reduce((a, b) => a + b, 0);
      if (Math.abs(breakdownTotal - document.totalCost) > 0.01) {
        errors.push({
          category: ERROR_CATEGORIES.CALCULATION,
          severity: ERROR_SEVERITY.HIGH,
          field: 'costBreakdown',
          message: 'Desglose de costos no suma al costo total'
        });
      }
    }

    return { errors };
  }

  _detectAnomalies(document, context) {
    const warnings = [];
    const flags = [];

    // Detectar valores atípicos comparados con históricos
    if (context.historicalAverages) {
      const fieldsToCheck = ['totalCost', 'sellingPrice', 'foodCostPercentage', 'margin'];

      fieldsToCheck.forEach(field => {
        if (document[field] !== undefined && context.historicalAverages[field]) {
          const avg = context.historicalAverages[field].average;
          const stdDev = context.historicalAverages[field].stdDev;

          if (stdDev > 0) {
            const zScore = Math.abs(document[field] - avg) / stdDev;

            if (zScore > this.anomalyThreshold) {
              flags.push({
                category: ERROR_CATEGORIES.CONSISTENCY,
                severity: ERROR_SEVERITY.MEDIUM,
                field,
                message: `Valor atípico detectado: ${document[field]} (promedio histórico: ${avg.toFixed(2)}, desviación: ${(zScore * stdDev).toFixed(2)})`
              });
            }
          }
        }
      });
    }

    // Detectar cambios drásticos
    if (context.previousVersion) {
      const significantFields = ['totalCost', 'sellingPrice', 'foodCostPercentage'];

      significantFields.forEach(field => {
        if (document[field] !== undefined && context.previousVersion[field] !== undefined) {
          const change = ((document[field] - context.previousVersion[field]) / context.previousVersion[field]) * 100;

          if (Math.abs(change) > 20) {
            warnings.push({
              category: ERROR_CATEGORIES.CONSISTENCY,
              severity: ERROR_SEVERITY.MEDIUM,
              field,
              message: `Cambio significativo en ${field}: ${change > 0 ? '+' : ''}${change.toFixed(1)}% respecto a versión anterior`
            });
          }
        }
      });
    }

    return { warnings, flags };
  }
}

// ============ REVISIÓN 3: CONTROL DE CALIDAD FINAL ============

export class FinalQualityControl {
  constructor(config = {}) {
    this.brandingConfig = config.branding || {};
    this.languageConfig = config.language || 'es-MX';
  }

  async validate(document, documentType, format) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // 3.1 Ortografía y gramática
    const spellingResult = this._checkSpellingAndGrammar(document);
    errors.push(...spellingResult.errors);
    suggestions.push(...spellingResult.suggestions);

    // 3.2 Formato profesional
    const formatResult = this._checkProfessionalFormat(document, format);
    warnings.push(...formatResult.warnings);
    suggestions.push(...formatResult.suggestions);

    // 3.3 Estándares de presentación
    const presentationResult = this._checkPresentationStandards(document, documentType);
    warnings.push(...presentationResult.warnings);

    // 3.4 Branding y marca
    const brandingResult = this._checkBranding(document);
    warnings.push(...brandingResult.warnings);

    // 3.5 Revisión final de legibilidad
    const readabilityResult = this._checkReadability(document);
    suggestions.push(...readabilityResult.suggestions);

    return {
      reviewLevel: 3,
      reviewName: 'Control de Calidad Final',
      passed: errors.filter(e => e.severity === ERROR_SEVERITY.CRITICAL).length === 0,
      errors,
      warnings,
      suggestions,
      qualityScore: this._calculateQualityScore(errors, warnings, suggestions),
      timestamp: new Date().toISOString()
    };
  }

  _checkSpellingAndGrammar(document) {
    const errors = [];
    const suggestions = [];

    // Patrones comunes de errores ortográficos en español
    const commonMisspellings = {
      'ingrediente': ['ingredente', 'ingediente', 'ingredeinte'],
      'restaurante': ['restaurate', 'resturante', 'restarante'],
      'receta': ['reseta', 'receta', 'rezeta'],
      'porcentaje': ['porsentaje', 'porcetaje', 'porcentage'],
      'inventario': ['imventario', 'inventaro', 'inbentario'],
      'preparación': ['preparacion', 'preparasion', 'preperación'],
      'cóctel': ['coctel', 'cocktail', 'coktel'],
      'análisis': ['analisis', 'analizis', 'análizis'],
      'período': ['periodo', 'perioro', 'pereodo'],
      'métrica': ['metrica', 'metrika'],
      'utilidad': ['utilidád', 'utildad'],
      'eficiencia': ['eficiecia', 'efisciencia', 'eficencia']
    };

    // Función recursiva para buscar en todos los campos de texto
    const checkText = (obj, path = '') => {
      if (typeof obj === 'string') {
        const lowerText = obj.toLowerCase();

        Object.entries(commonMisspellings).forEach(([correct, incorrect]) => {
          incorrect.forEach(misspelled => {
            if (lowerText.includes(misspelled)) {
              suggestions.push({
                category: ERROR_CATEGORIES.SPELLING,
                severity: ERROR_SEVERITY.LOW,
                field: path,
                message: `Posible error ortográfico: "${misspelled}" → "${correct}"`,
                original: misspelled,
                suggestion: correct
              });
            }
          });
        });

        // Detectar caracteres problemáticos
        if (/[<>{}|\\]/.test(obj)) {
          errors.push({
            category: ERROR_CATEGORIES.FORMAT,
            severity: ERROR_SEVERITY.MEDIUM,
            field: path,
            message: 'Caracteres especiales no permitidos detectados'
          });
        }
      } else if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
          checkText(value, path ? `${path}.${key}` : key);
        });
      }
    };

    checkText(document);

    return { errors, suggestions };
  }

  _checkProfessionalFormat(document, format) {
    const warnings = [];
    const suggestions = [];

    // Verificar capitalización de títulos
    if (document.title) {
      if (document.title === document.title.toLowerCase()) {
        suggestions.push({
          category: ERROR_CATEGORIES.PRESENTATION,
          severity: ERROR_SEVERITY.LOW,
          field: 'title',
          message: 'Considere capitalizar el título para mayor formalidad'
        });
      }
    }

    // Verificar nombres propios
    if (document.generatedBy) {
      const words = document.generatedBy.split(' ');
      const improperCaps = words.some(w => w.length > 2 && w === w.toLowerCase());
      if (improperCaps) {
        suggestions.push({
          category: ERROR_CATEGORIES.PRESENTATION,
          severity: ERROR_SEVERITY.LOW,
          field: 'generatedBy',
          message: 'Verificar capitalización de nombres propios'
        });
      }
    }

    // Verificar decimales consistentes
    const numericFields = ['totalCost', 'sellingPrice', 'unitCost', 'margin', 'foodCostPercentage'];
    const decimals = new Set();

    numericFields.forEach(field => {
      if (document[field] !== undefined) {
        const decimalPlaces = (String(document[field]).split('.')[1] || '').length;
        decimals.add(decimalPlaces);
      }
    });

    if (decimals.size > 2) {
      warnings.push({
        category: ERROR_CATEGORIES.PRESENTATION,
        severity: ERROR_SEVERITY.LOW,
        field: 'numeric_fields',
        message: 'Inconsistencia en decimales: usar 2 decimales para moneda'
      });
    }

    return { warnings, suggestions };
  }

  _checkPresentationStandards(document, documentType) {
    const warnings = [];

    // Estándares por tipo de documento
    const standards = {
      costSheet: {
        requiredSections: ['ingredients', 'totalCost', 'sellingPrice', 'foodCostPercentage'],
        recommendedSections: ['yield', 'prepTime', 'method']
      },
      financial: {
        requiredSections: ['period', 'totalSales', 'netProfit'],
        recommendedSections: ['comparison', 'trends', 'recommendations']
      },
      report: {
        requiredSections: ['title', 'summary', 'data'],
        recommendedSections: ['conclusions', 'recommendations', 'nextSteps']
      },
      menu: {
        requiredSections: ['name', 'items'],
        recommendedSections: ['description', 'pricing', 'allergens']
      }
    };

    const standard = standards[documentType];
    if (standard) {
      // Verificar secciones recomendadas
      standard.recommendedSections?.forEach(section => {
        if (!document[section]) {
          warnings.push({
            category: ERROR_CATEGORIES.PRESENTATION,
            severity: ERROR_SEVERITY.INFO,
            field: section,
            message: `Sección recomendada faltante: ${section}`
          });
        }
      });
    }

    // Verificar longitud apropiada de descripciones
    if (document.description) {
      if (document.description.length < 20) {
        warnings.push({
          category: ERROR_CATEGORIES.PRESENTATION,
          severity: ERROR_SEVERITY.LOW,
          field: 'description',
          message: 'Descripción muy corta, considere ampliar para mayor claridad'
        });
      } else if (document.description.length > 500) {
        warnings.push({
          category: ERROR_CATEGORIES.PRESENTATION,
          severity: ERROR_SEVERITY.LOW,
          field: 'description',
          message: 'Descripción muy larga, considere resumir'
        });
      }
    }

    return { warnings };
  }

  _checkBranding(document) {
    const warnings = [];

    // Verificar que se incluya información de origen
    if (!document.generatedBy && !document.createdBy && !document.author) {
      warnings.push({
        category: ERROR_CATEGORIES.PRESENTATION,
        severity: ERROR_SEVERITY.MEDIUM,
        field: 'attribution',
        message: 'Falta atribución del documento (generatedBy/createdBy)'
      });
    }

    // Verificar timestamp
    if (!document.createdAt && !document.timestamp && !document.date) {
      warnings.push({
        category: ERROR_CATEGORIES.PRESENTATION,
        severity: ERROR_SEVERITY.MEDIUM,
        field: 'timestamp',
        message: 'Falta marca de tiempo del documento'
      });
    }

    // Verificar versión (para documentos que la requieren)
    if (document.version === undefined && document.revision === undefined) {
      warnings.push({
        category: ERROR_CATEGORIES.PRESENTATION,
        severity: ERROR_SEVERITY.INFO,
        field: 'version',
        message: 'Considere agregar número de versión'
      });
    }

    return { warnings };
  }

  _checkReadability(document) {
    const suggestions = [];

    // Verificar legibilidad de números grandes
    const checkLargeNumbers = (obj, path = '') => {
      if (typeof obj === 'number') {
        if (obj >= 10000 && !path.includes('id') && !path.includes('timestamp')) {
          suggestions.push({
            category: ERROR_CATEGORIES.PRESENTATION,
            severity: ERROR_SEVERITY.INFO,
            field: path,
            message: `Considere formatear número grande: ${obj.toLocaleString('es-MX')}`
          });
        }
      } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
          checkLargeNumbers(value, path ? `${path}.${key}` : key);
        });
      }
    };

    checkLargeNumbers(document);

    return { suggestions };
  }

  _calculateQualityScore(errors, warnings, suggestions) {
    let score = 100;

    // Penalizaciones por errores
    errors.forEach(error => {
      switch (error.severity) {
        case ERROR_SEVERITY.CRITICAL: score -= 25; break;
        case ERROR_SEVERITY.HIGH: score -= 15; break;
        case ERROR_SEVERITY.MEDIUM: score -= 10; break;
        case ERROR_SEVERITY.LOW: score -= 5; break;
      }
    });

    // Penalizaciones por advertencias
    warnings.forEach(warning => {
      switch (warning.severity) {
        case ERROR_SEVERITY.CRITICAL: score -= 15; break;
        case ERROR_SEVERITY.HIGH: score -= 8; break;
        case ERROR_SEVERITY.MEDIUM: score -= 4; break;
        case ERROR_SEVERITY.LOW: score -= 2; break;
        case ERROR_SEVERITY.INFO: score -= 1; break;
      }
    });

    // Sugerencias no penalizan, solo informan
    return Math.max(0, Math.min(100, score));
  }
}

// ============ SISTEMA PRINCIPAL DE TRIPLE REVISIÓN ============

export class TripleReviewSystem {
  constructor(config = {}) {
    this.technicalValidator = new TechnicalValidator(config.technical);
    this.consistencyValidator = new ConsistencyValidator(config.consistency);
    this.finalQualityControl = new FinalQualityControl(config.quality);

    this.minimumPassingScore = config.minimumPassingScore || 85;
    this.autoCorrect = config.autoCorrect !== false;
    this.strictMode = config.strictMode || false;
  }

  /**
   * Ejecuta el proceso completo de triple revisión
   * @param {Object} document - Documento a revisar
   * @param {string} documentType - Tipo de documento
   * @param {string} format - Formato de salida (pdf, excel, etc.)
   * @param {Object} context - Contexto adicional (históricos, versión anterior)
   * @returns {Object} Resultado completo de las 3 revisiones
   */
  async executeTripleReview(document, documentType, format = 'pdf', context = {}) {
    const startTime = Date.now();
    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // REVISIÓN 1: Validación Técnica
    const review1 = await this.technicalValidator.validate(document, documentType);

    // Aplicar correcciones automáticas si están habilitadas
    let correctedDocument = { ...document };
    if (this.autoCorrect && review1.corrections.length > 0) {
      correctedDocument = this._applyCorrections(correctedDocument, review1.corrections);
    }

    // REVISIÓN 2: Consistencia y Lógica
    const review2 = await this.consistencyValidator.validate(correctedDocument, documentType, context);

    // REVISIÓN 3: Control de Calidad Final
    const review3 = await this.finalQualityControl.validate(correctedDocument, documentType, format);

    // Consolidar resultados
    const allErrors = [...review1.errors, ...review2.errors, ...review3.errors];
    const allWarnings = [...review1.warnings, ...review2.warnings, ...review3.warnings];
    const allSuggestions = review3.suggestions || [];
    const allCorrections = review1.corrections || [];
    const allFlags = review2.flags || [];

    // Determinar si pasa
    const criticalErrors = allErrors.filter(e => e.severity === ERROR_SEVERITY.CRITICAL);
    const highErrors = allErrors.filter(e => e.severity === ERROR_SEVERITY.HIGH);

    const passed = this.strictMode
      ? criticalErrors.length === 0 && highErrors.length === 0
      : criticalErrors.length === 0;

    // Calcular score final
    const finalScore = review3.qualityScore;
    const meetsMinimum = finalScore >= this.minimumPassingScore;

    // Generar certificado de revisión
    const certificate = this._generateReviewCertificate({
      reviewId,
      passed: passed && meetsMinimum,
      score: finalScore,
      reviews: [review1, review2, review3],
      corrections: allCorrections,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    });

    return {
      reviewId,
      documentType,
      format,

      // Resultado final
      approved: passed && meetsMinimum,
      finalScore,
      minimumRequired: this.minimumPassingScore,

      // Detalle por revisión
      reviews: {
        technical: review1,
        consistency: review2,
        quality: review3
      },

      // Consolidado
      summary: {
        totalErrors: allErrors.length,
        criticalErrors: criticalErrors.length,
        highErrors: highErrors.length,
        warnings: allWarnings.length,
        suggestions: allSuggestions.length,
        correctionsApplied: allCorrections.length,
        flagsRaised: allFlags.length
      },

      // Listas completas
      errors: allErrors,
      warnings: allWarnings,
      suggestions: allSuggestions,
      corrections: allCorrections,
      flags: allFlags,

      // Documento corregido
      correctedDocument: this.autoCorrect ? correctedDocument : null,

      // Certificado
      certificate,

      // Metadatos
      metadata: {
        reviewedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        strictMode: this.strictMode,
        autoCorrect: this.autoCorrect
      }
    };
  }

  _applyCorrections(document, corrections) {
    const corrected = JSON.parse(JSON.stringify(document));

    corrections.forEach(correction => {
      if (correction.field && correction.correctedValue !== undefined) {
        // Manejar campos anidados
        const parts = correction.field.split('.');
        let obj = corrected;

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          // Manejar arrays
          const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
          if (arrayMatch) {
            obj = obj[arrayMatch[1]][parseInt(arrayMatch[2])];
          } else {
            obj = obj[part];
          }
        }

        const lastPart = parts[parts.length - 1];
        const arrayMatch = lastPart.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
          obj[arrayMatch[1]][parseInt(arrayMatch[2])] = correction.correctedValue;
        } else {
          obj[lastPart] = correction.correctedValue;
        }
      }
    });

    return corrected;
  }

  _generateReviewCertificate(data) {
    const statusEmoji = data.passed ? '✅' : '❌';
    const scoreEmoji = data.score >= 95 ? '🏆' : data.score >= 85 ? '✓' : '⚠️';

    return {
      id: data.reviewId,
      status: data.passed ? 'APROBADO' : 'RECHAZADO',
      statusIcon: statusEmoji,
      score: data.score,
      scoreIcon: scoreEmoji,
      grade: this._getGrade(data.score),

      reviewSummary: {
        level1_technical: data.reviews[0].passed ? 'PASÓ' : 'FALLÓ',
        level2_consistency: data.reviews[1].passed ? 'PASÓ' : 'FALLÓ',
        level3_quality: data.reviews[2].passed ? 'PASÓ' : 'FALLÓ'
      },

      correctionsApplied: data.corrections.length,
      processingTime: `${data.duration}ms`,

      certification: data.passed
        ? `Este documento ha pasado el proceso de Triple Revisión de Calidad de Vértice Gastronómico con un score de ${data.score}/100.`
        : `Este documento NO ha superado el proceso de Triple Revisión. Se requieren correcciones antes de su emisión.`,

      timestamp: data.timestamp,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas

      digitalSignature: this._generateDigitalSignature(data)
    };
  }

  _getGrade(score) {
    if (score >= 98) return 'A+';
    if (score >= 95) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 85) return 'B';
    if (score >= 82) return 'B-';
    if (score >= 78) return 'C+';
    if (score >= 75) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 65) return 'D';
    return 'F';
  }

  _generateDigitalSignature(data) {
    // Generar firma digital simple basada en los datos
    const payload = JSON.stringify({
      id: data.reviewId,
      score: data.score,
      passed: data.passed,
      timestamp: data.timestamp
    });

    // Hash simple para verificación
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return `VG-TR-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
  }

  /**
   * Revisa múltiples documentos en lote
   */
  async batchReview(documents, documentType, format = 'pdf') {
    const results = [];

    for (const doc of documents) {
      const result = await this.executeTripleReview(doc, documentType, format);
      results.push({
        documentId: doc.id || doc.name || `doc_${results.length}`,
        ...result
      });
    }

    // Resumen del lote
    const summary = {
      total: results.length,
      approved: results.filter(r => r.approved).length,
      rejected: results.filter(r => !r.approved).length,
      averageScore: results.reduce((sum, r) => sum + r.finalScore, 0) / results.length,
      totalErrors: results.reduce((sum, r) => sum + r.summary.totalErrors, 0),
      totalCorrections: results.reduce((sum, r) => sum + r.summary.correctionsApplied, 0)
    };

    return { results, summary };
  }
}

// Exportar instancia por defecto con configuración estándar
export const defaultTripleReview = new TripleReviewSystem({
  minimumPassingScore: 85,
  autoCorrect: true,
  strictMode: false
});

export default TripleReviewSystem;
