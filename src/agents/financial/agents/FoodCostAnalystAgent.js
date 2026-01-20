/**
 * FoodCostAnalystAgent - Analista de Costos de Alimentos
 * Agente #4 - Especialista en optimización de costos de materia prima
 *
 * CAPACIDADES UNIVERSALES INCLUIDAS:
 * - Generación de documentos (PDF, Word, Excel, CSV, JSON)
 * - Procesamiento AI
 * - WebSocket (eventos en tiempo real)
 * - Colas de procesamiento
 * - Sistema de calidad
 * - Almacenamiento IndexedDB
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class FoodCostAnalystAgent extends UniversalAgent {
  constructor() {
    super({
      id: 4,
      emoji: '🍽️',
      nombre: 'Analista de Costos de Alimentos',
      nombreCorto: 'FOOD_COST',
      categoria: 'FINANZAS',
      experiencia: { años: 5, rango: '5+ años' },
      descripcion: 'Especialista en optimización de costos de materia prima y eficiencia operativa de cocina.',
      perfil: {
        formacion: 'Ingeniería Industrial o Administración + Diplomado en Gastronomía',
        certificaciones: ['CPIM', 'Lean Six Sigma Green Belt', 'Food Cost Control Certification'],
        competencias: [
          'Análisis de recetas',
          'Costeo de menú',
          'Gestión de mermas',
          'Negociación con proveedores',
          'Análisis de yield',
          'Ingeniería de menú'
        ],
        herramientas: ['MarketMan', 'BlueCart', 'Compeat', 'xtraCHEF', 'ChefTec', 'FoodCost Pro'],
        kpis: ['Food Cost %', 'Waste %', 'Recipe Cost Accuracy', 'Purchase Price Variance', 'Menu Engineering Matrix'],
        logros: [
          'Reducción de food cost de 38% a 29%',
          'Implementación de sistema de inventario perpetuo',
          'Desarrollo de 200+ fichas técnicas estandarizadas'
        ],
        metodologias: ['Menu Engineering', 'Yield Analysis', 'Par Level Management', 'ABC Inventory Classification']
      },
      triggers: ['costo de alimentos', 'food cost', 'recetas', 'mermas', 'ingredientes', 'proveedores'],
      delegaA: [5, 21, 22]
    });

    // Almacenamiento específico del agente
    this.recipes = new Map();
    this.costSheets = new Map();
    this.menuMatrix = null;

    // Constantes gastronómicas
    this.TARGETS = {
      FOOD_COST_MAX: 30,
      FOOD_COST_WARNING: 28,
      WASTE_MAX: 3,
      YIELD_MIN: 85
    };
  }

  // ============ FICHAS DE COSTOS ============

  async createCostSheet(recipe) {
    this.emitEvent('cost_sheet_started', { recipeName: recipe.name });

    const costSheet = {
      id: `cs_${Date.now()}`,
      recipeName: recipe.name,
      category: recipe.category,
      portions: recipe.portions || 1,
      createdAt: new Date().toISOString(),
      createdBy: this.nombre,
      ingredients: [],
      totalCost: 0,
      costPerPortion: 0,
      foodCostPercentage: 0,
      suggestedPrice: 0,
      actualPrice: recipe.sellingPrice || 0,
      margin: 0,
      marginPercentage: 0,
      classification: '',
      status: 'draft'
    };

    // Procesar ingredientes
    let totalCost = 0;
    for (const ing of recipe.ingredients || []) {
      const ingredientCost = this._calculateIngredientCost(ing);
      costSheet.ingredients.push(ingredientCost);
      totalCost += ingredientCost.totalCost;
    }

    // Calcular métricas
    costSheet.totalCost = totalCost;
    costSheet.costPerPortion = totalCost / costSheet.portions;

    if (recipe.sellingPrice > 0) {
      costSheet.foodCostPercentage = (costSheet.costPerPortion / recipe.sellingPrice) * 100;
      costSheet.margin = recipe.sellingPrice - costSheet.costPerPortion;
      costSheet.marginPercentage = (costSheet.margin / recipe.sellingPrice) * 100;
    }

    // Calcular precio sugerido basado en food cost objetivo
    costSheet.suggestedPrice = this._calculateSuggestedPrice(costSheet.costPerPortion);

    // Clasificar según rentabilidad
    costSheet.classification = this._classifyRecipe(costSheet);

    // Validar
    const validation = await this.validateDeliverable({
      type: 'costSheet',
      content: costSheet,
      foodCostPercentage: costSheet.foodCostPercentage,
      format: 'structured'
    });

    costSheet.validation = validation;
    costSheet.status = validation.passed ? 'validated' : 'needs_review';

    this.costSheets.set(costSheet.id, costSheet);
    this.emitEvent('cost_sheet_completed', { id: costSheet.id, foodCost: costSheet.foodCostPercentage });

    return costSheet;
  }

  _calculateIngredientCost(ingredient) {
    const { name, quantity, unit, unitCost, yield: yieldPercentage = 100 } = ingredient;

    // Ajustar por rendimiento
    const adjustedQuantity = quantity / (yieldPercentage / 100);
    const totalCost = adjustedQuantity * unitCost;

    return {
      name,
      quantity,
      unit,
      unitCost,
      yield: yieldPercentage,
      adjustedQuantity,
      totalCost,
      percentageOfTotal: 0 // Se calcula después
    };
  }

  _calculateSuggestedPrice(costPerPortion, targetFoodCost = 28) {
    return costPerPortion / (targetFoodCost / 100);
  }

  _classifyRecipe(costSheet) {
    const { foodCostPercentage, marginPercentage } = costSheet;

    if (foodCostPercentage <= 25 && marginPercentage >= 70) {
      return { category: 'STAR', description: 'Alta rentabilidad', color: '#38a169' };
    } else if (foodCostPercentage <= 30 && marginPercentage >= 60) {
      return { category: 'PLOW_HORSE', description: 'Buena rentabilidad', color: '#3182ce' };
    } else if (foodCostPercentage <= 35) {
      return { category: 'PUZZLE', description: 'Rentabilidad media', color: '#d69e2e' };
    } else {
      return { category: 'DOG', description: 'Baja rentabilidad', color: '#e53e3e' };
    }
  }

  // ============ ANÁLISIS DE MENÚ (MENU ENGINEERING) ============

  async analyzeMenu(menuItems) {
    this.emitEvent('menu_analysis_started', { itemCount: menuItems.length });

    // Calcular promedios
    const avgContributionMargin = menuItems.reduce((sum, item) => sum + (item.margin || 0), 0) / menuItems.length;
    const avgPopularity = menuItems.reduce((sum, item) => sum + (item.salesCount || 0), 0) / menuItems.length;

    const analysis = {
      id: `menu_${Date.now()}`,
      analyzedAt: new Date().toISOString(),
      analyzedBy: this.nombre,
      totalItems: menuItems.length,
      averages: {
        contributionMargin: avgContributionMargin,
        popularity: avgPopularity
      },
      categories: {
        stars: [],      // Alta rentabilidad + Alta popularidad
        plowHorses: [], // Baja rentabilidad + Alta popularidad
        puzzles: [],    // Alta rentabilidad + Baja popularidad
        dogs: []        // Baja rentabilidad + Baja popularidad
      },
      recommendations: [],
      summary: {}
    };

    // Clasificar cada platillo
    for (const item of menuItems) {
      const isHighMargin = (item.margin || 0) >= avgContributionMargin;
      const isHighPopularity = (item.salesCount || 0) >= avgPopularity;

      const classifiedItem = {
        ...item,
        isHighMargin,
        isHighPopularity,
        marginVsAvg: ((item.margin || 0) - avgContributionMargin).toFixed(2),
        popularityVsAvg: ((item.salesCount || 0) - avgPopularity).toFixed(0)
      };

      if (isHighMargin && isHighPopularity) {
        classifiedItem.category = 'STAR';
        analysis.categories.stars.push(classifiedItem);
      } else if (!isHighMargin && isHighPopularity) {
        classifiedItem.category = 'PLOW_HORSE';
        analysis.categories.plowHorses.push(classifiedItem);
      } else if (isHighMargin && !isHighPopularity) {
        classifiedItem.category = 'PUZZLE';
        analysis.categories.puzzles.push(classifiedItem);
      } else {
        classifiedItem.category = 'DOG';
        analysis.categories.dogs.push(classifiedItem);
      }
    }

    // Generar recomendaciones
    analysis.recommendations = this._generateMenuRecommendations(analysis);

    // Resumen
    analysis.summary = {
      stars: analysis.categories.stars.length,
      plowHorses: analysis.categories.plowHorses.length,
      puzzles: analysis.categories.puzzles.length,
      dogs: analysis.categories.dogs.length,
      healthScore: this._calculateMenuHealthScore(analysis)
    };

    this.menuMatrix = analysis;
    this.emitEvent('menu_analysis_completed', { summary: analysis.summary });

    return analysis;
  }

  _generateMenuRecommendations(analysis) {
    const recommendations = [];

    // Recomendaciones para STARS
    if (analysis.categories.stars.length > 0) {
      recommendations.push({
        category: 'STARS',
        action: 'MANTENER',
        items: analysis.categories.stars.map(i => i.name),
        description: 'Mantener prominencia en menú, no modificar receta ni precio'
      });
    }

    // Recomendaciones para PLOW HORSES
    if (analysis.categories.plowHorses.length > 0) {
      recommendations.push({
        category: 'PLOW_HORSES',
        action: 'OPTIMIZAR',
        items: analysis.categories.plowHorses.map(i => i.name),
        description: 'Buscar reducir costos sin afectar calidad, considerar aumento de precio'
      });
    }

    // Recomendaciones para PUZZLES
    if (analysis.categories.puzzles.length > 0) {
      recommendations.push({
        category: 'PUZZLES',
        action: 'PROMOVER',
        items: analysis.categories.puzzles.map(i => i.name),
        description: 'Aumentar visibilidad, considerar promociones o renombrar'
      });
    }

    // Recomendaciones para DOGS
    if (analysis.categories.dogs.length > 0) {
      recommendations.push({
        category: 'DOGS',
        action: 'REVISAR',
        items: analysis.categories.dogs.map(i => i.name),
        description: 'Considerar eliminar o reformular completamente'
      });
    }

    return recommendations;
  }

  _calculateMenuHealthScore(analysis) {
    const total = analysis.totalItems;
    if (total === 0) return 0;

    // Ponderación: Stars 100%, PlowHorses 70%, Puzzles 50%, Dogs 20%
    const score = (
      (analysis.categories.stars.length * 100) +
      (analysis.categories.plowHorses.length * 70) +
      (analysis.categories.puzzles.length * 50) +
      (analysis.categories.dogs.length * 20)
    ) / total;

    return Math.round(score);
  }

  // ============ ANÁLISIS DE MERMAS ============

  async analyzeWaste(wasteData) {
    this.emitEvent('waste_analysis_started', { period: wasteData.period });

    const analysis = {
      id: `waste_${Date.now()}`,
      period: wasteData.period,
      analyzedAt: new Date().toISOString(),
      analyzedBy: this.nombre,
      totalWasteValue: 0,
      wastePercentage: 0,
      byCategory: {},
      byReason: {},
      topWastedItems: [],
      recommendations: [],
      potentialSavings: 0
    };

    // Procesar datos de merma
    for (const item of wasteData.items || []) {
      analysis.totalWasteValue += item.value || 0;

      // Por categoría
      if (!analysis.byCategory[item.category]) {
        analysis.byCategory[item.category] = { count: 0, value: 0 };
      }
      analysis.byCategory[item.category].count++;
      analysis.byCategory[item.category].value += item.value || 0;

      // Por razón
      const reason = item.reason || 'Sin especificar';
      if (!analysis.byReason[reason]) {
        analysis.byReason[reason] = { count: 0, value: 0 };
      }
      analysis.byReason[reason].count++;
      analysis.byReason[reason].value += item.value || 0;
    }

    // Calcular porcentaje de merma
    if (wasteData.totalPurchases > 0) {
      analysis.wastePercentage = (analysis.totalWasteValue / wasteData.totalPurchases) * 100;
    }

    // Top items con más merma
    analysis.topWastedItems = (wasteData.items || [])
      .sort((a, b) => (b.value || 0) - (a.value || 0))
      .slice(0, 10);

    // Generar recomendaciones
    analysis.recommendations = this._generateWasteRecommendations(analysis);

    // Calcular ahorros potenciales (reducir merma al objetivo)
    if (analysis.wastePercentage > this.TARGETS.WASTE_MAX) {
      const targetWaste = wasteData.totalPurchases * (this.TARGETS.WASTE_MAX / 100);
      analysis.potentialSavings = analysis.totalWasteValue - targetWaste;
    }

    this.emitEvent('waste_analysis_completed', {
      wastePercentage: analysis.wastePercentage,
      potentialSavings: analysis.potentialSavings
    });

    return analysis;
  }

  _generateWasteRecommendations(analysis) {
    const recommendations = [];

    if (analysis.wastePercentage > this.TARGETS.WASTE_MAX) {
      recommendations.push({
        priority: 'ALTA',
        area: 'General',
        action: `Merma en ${analysis.wastePercentage.toFixed(1)}% supera el objetivo de ${this.TARGETS.WASTE_MAX}%`,
        impact: `Ahorro potencial: $${analysis.potentialSavings.toLocaleString('es-MX')}`
      });
    }

    // Recomendaciones por razón principal
    const topReason = Object.entries(analysis.byReason)
      .sort((a, b) => b[1].value - a[1].value)[0];

    if (topReason) {
      const [reason, data] = topReason;
      recommendations.push({
        priority: 'MEDIA',
        area: reason,
        action: `Principal causa de merma: ${reason} ($${data.value.toLocaleString('es-MX')})`,
        impact: 'Enfocar esfuerzos de control en esta área'
      });
    }

    // Recomendaciones por categoría
    for (const [category, data] of Object.entries(analysis.byCategory)) {
      const categoryPercentage = (data.value / analysis.totalWasteValue) * 100;
      if (categoryPercentage > 30) {
        recommendations.push({
          priority: 'MEDIA',
          area: category,
          action: `${category} representa ${categoryPercentage.toFixed(0)}% de la merma total`,
          impact: 'Revisar proceso de almacenamiento y rotación FIFO'
        });
      }
    }

    return recommendations;
  }

  // ============ ANÁLISIS DE YIELD (RENDIMIENTO) ============

  async calculateYield(product) {
    const yieldAnalysis = {
      product: product.name,
      purchaseWeight: product.purchaseWeight,
      purchaseUnit: product.purchaseUnit,
      purchaseCost: product.purchaseCost,
      processes: [],
      finalYield: 100,
      costPerUsableUnit: 0,
      wastePercentage: 0
    };

    let currentWeight = product.purchaseWeight;

    // Procesar cada etapa de preparación
    for (const process of product.processes || []) {
      const wastage = currentWeight * (process.wastePercentage / 100);
      const afterWeight = currentWeight - wastage;

      yieldAnalysis.processes.push({
        name: process.name,
        beforeWeight: currentWeight,
        wastePercentage: process.wastePercentage,
        wastage,
        afterWeight
      });

      currentWeight = afterWeight;
    }

    // Calcular rendimiento final
    yieldAnalysis.finalYield = (currentWeight / product.purchaseWeight) * 100;
    yieldAnalysis.wastePercentage = 100 - yieldAnalysis.finalYield;
    yieldAnalysis.usableWeight = currentWeight;
    yieldAnalysis.costPerUsableUnit = product.purchaseCost / currentWeight;

    // Evaluar si el rendimiento está por debajo del estándar
    if (yieldAnalysis.finalYield < this.TARGETS.YIELD_MIN) {
      yieldAnalysis.alert = {
        type: 'warning',
        message: `Rendimiento de ${yieldAnalysis.finalYield.toFixed(1)}% por debajo del mínimo esperado (${this.TARGETS.YIELD_MIN}%)`
      };
    }

    return yieldAnalysis;
  }

  // ============ GENERACIÓN DE REPORTES ============

  async generateCostSheetPDF(costSheetId) {
    const costSheet = this.costSheets.get(costSheetId);
    if (!costSheet) {
      throw new Error(`Ficha de costos ${costSheetId} no encontrada`);
    }

    return this.generateDocument('pdf', costSheet, {
      title: `Ficha de Costos - ${costSheet.recipeName}`,
      type: 'costSheet'
    });
  }

  async generateMenuAnalysisReport(format = 'pdf') {
    if (!this.menuMatrix) {
      throw new Error('No hay análisis de menú disponible');
    }

    const reportData = {
      title: 'Análisis de Ingeniería de Menú',
      summary: `Análisis de ${this.menuMatrix.totalItems} platillos del menú`,
      metrics: [
        { name: 'Total Platillos', value: this.menuMatrix.totalItems },
        { name: 'Stars', value: this.menuMatrix.summary.stars, trend: 'up' },
        { name: 'Plow Horses', value: this.menuMatrix.summary.plowHorses },
        { name: 'Puzzles', value: this.menuMatrix.summary.puzzles },
        { name: 'Dogs', value: this.menuMatrix.summary.dogs, trend: 'down' },
        { name: 'Health Score', value: this.menuMatrix.summary.healthScore, unit: '%' }
      ],
      sections: this.menuMatrix.recommendations.map(rec => ({
        title: rec.category,
        content: `${rec.action}: ${rec.description}\nPlatillos: ${rec.items.join(', ')}`
      }))
    };

    return this.generateDocument(format, reportData, {
      title: 'Análisis de Menú',
      type: 'report'
    });
  }

  async exportCostSheetsToExcel() {
    const costSheetsArray = Array.from(this.costSheets.values()).map(cs => ({
      'Platillo': cs.recipeName,
      'Categoría': cs.category,
      'Porciones': cs.portions,
      'Costo Total': cs.totalCost,
      'Costo por Porción': cs.costPerPortion,
      'Food Cost %': cs.foodCostPercentage,
      'Precio Actual': cs.actualPrice,
      'Precio Sugerido': cs.suggestedPrice,
      'Margen': cs.margin,
      'Margen %': cs.marginPercentage,
      'Clasificación': cs.classification.category,
      'Estado': cs.status
    }));

    return this.generateDocument('excel', costSheetsArray, {
      title: 'Fichas de Costos',
      sheetName: 'Fichas'
    });
  }

  // ============ COMPARATIVA DE PROVEEDORES ============

  async compareSuppliers(product, suppliers) {
    const comparison = {
      product,
      analyzedAt: new Date().toISOString(),
      suppliers: [],
      recommendation: null
    };

    for (const supplier of suppliers) {
      const score = this._calculateSupplierScore(supplier);
      comparison.suppliers.push({
        ...supplier,
        score,
        pricePerUnit: supplier.price / supplier.quantity,
        qualityScore: supplier.qualityRating || 3,
        deliveryScore: supplier.deliveryReliability || 3
      });
    }

    // Ordenar por score
    comparison.suppliers.sort((a, b) => b.score - a.score);

    // Recomendación
    comparison.recommendation = {
      supplier: comparison.suppliers[0].name,
      reason: `Mejor balance precio-calidad con score de ${comparison.suppliers[0].score.toFixed(1)}`,
      savings: this._calculatePotentialSavings(comparison.suppliers)
    };

    return comparison;
  }

  _calculateSupplierScore(supplier) {
    // Ponderación: Precio 40%, Calidad 35%, Entrega 25%
    const priceScore = Math.max(0, 10 - (supplier.pricePerUnit / supplier.marketAvgPrice - 1) * 10);
    const qualityScore = (supplier.qualityRating || 3) * 2;
    const deliveryScore = (supplier.deliveryReliability || 3) * 2;

    return (priceScore * 0.4) + (qualityScore * 0.35) + (deliveryScore * 0.25);
  }

  _calculatePotentialSavings(suppliers) {
    if (suppliers.length < 2) return 0;
    const cheapest = suppliers.reduce((min, s) => s.pricePerUnit < min.pricePerUnit ? s : min);
    const mostExpensive = suppliers.reduce((max, s) => s.pricePerUnit > max.pricePerUnit ? s : max);
    return ((mostExpensive.pricePerUnit - cheapest.pricePerUnit) / mostExpensive.pricePerUnit * 100).toFixed(1);
  }

  // ============ PROYECCIÓN DE COSTOS ============

  async projectFoodCost(params) {
    const { baseData, periods, assumptions } = params;

    const projection = {
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: this.nombre,
      baseData,
      assumptions,
      periods: []
    };

    let previousCost = baseData.currentFoodCost;
    let previousRevenue = baseData.monthlyRevenue;

    for (let i = 1; i <= periods; i++) {
      const inflation = assumptions.ingredientInflation || 4;
      const growth = assumptions.revenueGrowth || 5;
      const efficiency = assumptions.efficiencyImprovement || 1;

      const projectedCost = previousCost * (1 + (inflation - efficiency) / 100);
      const projectedRevenue = previousRevenue * (1 + growth / 100);
      const projectedFoodCostPct = (projectedCost / projectedRevenue) * 100;

      projection.periods.push({
        period: i,
        projectedCost,
        projectedRevenue,
        foodCostPercentage: projectedFoodCostPct,
        status: projectedFoodCostPct <= this.TARGETS.FOOD_COST_MAX ? 'OK' : 'ALERTA'
      });

      previousCost = projectedCost;
      previousRevenue = projectedRevenue;
    }

    return projection;
  }
}

export default FoodCostAnalystAgent;
