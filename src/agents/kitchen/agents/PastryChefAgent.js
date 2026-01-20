/**
 * PastryChefAgent - Chef Pastelero
 * Agente #28 - Maestro pastelero especializado
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class PastryChefAgent extends UniversalAgent {
  constructor() {
    super({
      id: 28,
      emoji: '🎂',
      nombre: 'Chef Pastelero',
      nombreCorto: 'PASTRY_CHEF',
      categoria: 'CULINARIO',
      experiencia: { años: 8, rango: '8+ años' },
      descripcion: 'Maestro pastelero especializado en postres de restaurante y panadería artesanal.',
      perfil: {
        formacion: 'Pastelería y Repostería + Formación en chocolate/pan',
        certificaciones: ['CEPC', 'Chocolate Professional', 'Bread Baker Certification'],
        competencias: ['Pastry production', 'Chocolate work', 'Bread baking', 'Plated desserts', 'Menu development', 'Cost control'],
        herramientas: ['Pastry-specific equipment', 'Temperature monitoring', 'Recipe scaling software'],
        kpis: ['Dessert Sales %', 'Pastry Food Cost', 'Production Efficiency', 'Plate Presentation Score'],
        logros: ['Incremento de venta de postres de 12% a 22%', 'Desarrollo de programa de pan artesanal', 'Reconocimiento en competencia nacional'],
        metodologias: ['Batch Production', 'Mise en Place', 'Temperature Control', 'Plating Standards']
      },
      triggers: ['postres', 'pastelería', 'pan', 'chocolate', 'repostería', 'dulces'],
      delegaA: [29, 30]
    });

    this.recipes = new Map();
    this.productionSchedule = new Map();
    this.TEMP_STANDARDS = {
      chocolate: { min: 27, max: 32, unit: 'C', critical: true },
      proofing: { min: 24, max: 27, unit: 'C', critical: true },
      chilling: { min: 2, max: 4, unit: 'C', critical: true },
      baking: { min: 150, max: 220, unit: 'C', critical: false }
    };
  }

  // ============ PRODUCCIÓN DE PASTELERÍA ============

  async createProductionPlan(params) {
    const { date, items, expectedDemand } = params;

    this.emitEvent('production_plan_started', { date, itemCount: items.length });

    const plan = {
      id: `prod_${Date.now()}`,
      date,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      items: [],
      timeline: [],
      totalPrepTime: 0,
      status: 'draft'
    };

    // Calcular cantidades y tiempos
    for (const item of items) {
      const demand = expectedDemand[item.name] || item.defaultQuantity || 20;
      const batches = Math.ceil(demand / item.batchSize);
      const totalTime = batches * item.batchTime;

      plan.items.push({
        name: item.name,
        category: item.category, // bread, pastry, dessert, chocolate
        quantity: demand,
        batches,
        batchSize: item.batchSize,
        totalTime,
        startTime: null,
        endTime: null,
        priority: this._calculatePriority(item),
        requiresProofing: item.requiresProofing || false,
        requiresTempering: item.requiresTempering || false,
        shelfLife: item.shelfLife
      });

      plan.totalPrepTime += totalTime;
    }

    // Ordenar por prioridad y crear timeline
    plan.items.sort((a, b) => a.priority - b.priority);
    this._createProductionTimeline(plan);

    this.productionSchedule.set(plan.id, plan);
    this.emitEvent('production_plan_created', { id: plan.id });

    return plan;
  }

  _calculatePriority(item) {
    // Prioridad: 1 = más urgente
    let priority = 5;

    if (item.requiresProofing) priority -= 2; // Necesita tiempo de fermentación
    if (item.requiresTempering) priority -= 1; // Trabajo de chocolate
    if (item.category === 'bread') priority = 1; // Pan siempre primero

    return priority;
  }

  _createProductionTimeline(plan) {
    let currentTime = new Date(`${plan.date}T05:00:00`); // Inicio 5am

    for (const item of plan.items) {
      item.startTime = currentTime.toISOString();

      // Agregar tiempo de producción
      const endTime = new Date(currentTime.getTime() + item.totalTime * 60000);

      // Si requiere fermentación, agregar tiempo
      if (item.requiresProofing) {
        endTime.setMinutes(endTime.getMinutes() + 60); // 1 hora de fermentación
      }

      item.endTime = endTime.toISOString();

      plan.timeline.push({
        time: item.startTime.split('T')[1].substring(0, 5),
        action: `Iniciar: ${item.name} (${item.batches} batches)`
      });

      currentTime = endTime;
    }
  }

  // ============ GESTIÓN DE RECETAS ============

  async createPastryRecipe(params) {
    const { name, type, baseYield, ingredients, method, specifications } = params;

    const recipe = {
      id: `pastry_${Date.now()}`,
      name,
      type, // bread, cake, tart, mousse, chocolate
      baseYield,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      version: 1,
      ingredients: this._processIngredients(ingredients),
      method: method.map((step, idx) => ({
        step: idx + 1,
        action: step.action,
        time: step.time,
        temperature: step.temperature,
        tips: step.tips,
        criticalPoint: step.criticalPoint || false
      })),
      specifications: {
        bakingTemp: specifications.bakingTemp,
        bakingTime: specifications.bakingTime,
        internalTemp: specifications.internalTemp,
        appearance: specifications.appearance,
        texture: specifications.texture
      },
      costPerUnit: 0,
      status: 'active'
    };

    // Calcular costo
    recipe.costPerUnit = recipe.ingredients.reduce((sum, ing) => sum + ing.lineCost, 0) / baseYield;

    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  _processIngredients(ingredients) {
    return ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      unitCost: ing.unitCost || 0,
      lineCost: ing.quantity * (ing.unitCost || 0),
      bakersPercentage: ing.bakersPercentage, // Para panadería
      notes: ing.notes
    }));
  }

  async scalePastryRecipe(recipeId, targetYield) {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) throw new Error(`Receta no encontrada: ${recipeId}`);

    const scaleFactor = targetYield / recipe.baseYield;

    return {
      ...recipe,
      baseYield: targetYield,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        quantity: (ing.quantity * scaleFactor).toFixed(2),
        lineCost: ing.lineCost * scaleFactor
      })),
      scaleFactor,
      scaledFrom: recipe.id
    };
  }

  // ============ CONTROL DE CALIDAD PASTELERÍA ============

  async performTemperatureCheck(checkpoints) {
    const check = {
      id: `temp_${Date.now()}`,
      performedBy: this.nombre,
      performedAt: new Date().toISOString(),
      checkpoints: [],
      passed: true,
      criticalFailures: []
    };

    for (const point of checkpoints) {
      const standard = this.TEMP_STANDARDS[point.type];
      const inRange = point.temperature >= standard.min && point.temperature <= standard.max;

      const checkResult = {
        location: point.location,
        type: point.type,
        temperature: point.temperature,
        standard: `${standard.min}-${standard.max}${standard.unit}`,
        passed: inRange,
        critical: standard.critical
      };

      check.checkpoints.push(checkResult);

      if (!inRange) {
        check.passed = false;
        if (standard.critical) {
          check.criticalFailures.push({
            location: point.location,
            issue: `Temperatura fuera de rango: ${point.temperature}°${standard.unit} (esperado: ${standard.min}-${standard.max})`,
            action: this._getCorrectiveAction(point.type, point.temperature, standard)
          });
        }
      }
    }

    if (check.criticalFailures.length > 0) {
      this.emitEvent('temperature_alert', { failures: check.criticalFailures });
    }

    return check;
  }

  _getCorrectiveAction(type, actual, standard) {
    if (type === 'chocolate') {
      if (actual > standard.max) return 'Enfriar chocolate, puede haber perdido temple';
      return 'Calentar suavemente hasta alcanzar temperatura de trabajo';
    }
    if (type === 'proofing') {
      if (actual > standard.max) return 'Reducir temperatura del área de fermentación';
      return 'Incrementar temperatura o mover a área más cálida';
    }
    if (type === 'chilling') {
      return actual > standard.max
        ? 'Verificar refrigerador, mover producto a equipo funcional'
        : 'Evitar sobre-enfriamiento de productos delicados';
    }
    return 'Ajustar temperatura del equipo';
  }

  // ============ CHOCOLATE Y TRABAJO ESPECIALIZADO ============

  async createChocolateWorkOrder(params) {
    const { products, deadline, specifications } = params;

    const workOrder = {
      id: `choc_${Date.now()}`,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      deadline,
      products: products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        type: p.type, // dark, milk, white
        temperingMethod: this._getTemperingMethod(p.type),
        moldType: p.moldType,
        filling: p.filling,
        estimatedTime: p.quantity * 5 // minutos por pieza
      })),
      temperatureLog: [],
      status: 'pending'
    };

    return workOrder;
  }

  _getTemperingMethod(chocolateType) {
    const methods = {
      dark: { melt: 50, cool: 27, work: 31 },
      milk: { melt: 45, cool: 26, work: 29 },
      white: { melt: 40, cool: 25, work: 27 }
    };
    return methods[chocolateType] || methods.dark;
  }

  // ============ REPORTES ============

  async generateDessertMenuAnalysis(salesData) {
    const analysis = {
      period: salesData.period,
      analyzedBy: this.nombre,
      analyzedAt: new Date().toISOString(),
      totalDessertSales: 0,
      dessertAttachRate: 0,
      topSellers: [],
      lowPerformers: [],
      costAnalysis: [],
      recommendations: []
    };

    // Procesar datos
    const desserts = salesData.items.filter(i => i.category === 'dessert');
    analysis.totalDessertSales = desserts.reduce((sum, d) => sum + d.sales, 0);
    analysis.dessertAttachRate = (salesData.dessertOrders / salesData.totalCovers) * 100;

    // Top y low performers
    desserts.sort((a, b) => b.sales - a.sales);
    analysis.topSellers = desserts.slice(0, 5);
    analysis.lowPerformers = desserts.slice(-3);

    // Análisis de costos
    for (const dessert of desserts) {
      analysis.costAnalysis.push({
        name: dessert.name,
        foodCost: ((dessert.cost / dessert.price) * 100).toFixed(1),
        margin: ((dessert.price - dessert.cost) / dessert.price * 100).toFixed(1),
        contribution: (dessert.price - dessert.cost) * dessert.unitsSold
      });
    }

    // Recomendaciones
    if (analysis.dessertAttachRate < 25) {
      analysis.recommendations.push('Attach rate bajo (<25%). Considerar promoción de postres o capacitación a meseros.');
    }

    for (const low of analysis.lowPerformers) {
      if (low.foodCost > 30) {
        analysis.recommendations.push(`${low.name}: Food cost alto. Reformular receta o ajustar precio.`);
      }
    }

    return this.generateDocument('pdf', {
      title: 'Análisis de Postres',
      subtitle: `Período: ${salesData.period}`,
      metrics: [
        { name: 'Ventas Totales', value: analysis.totalDessertSales, prefix: '$' },
        { name: 'Attach Rate', value: analysis.dessertAttachRate.toFixed(1), unit: '%' },
        { name: 'Top Seller', value: analysis.topSellers[0]?.name || 'N/A' }
      ],
      sections: [
        {
          title: 'Top 5 Postres',
          content: analysis.topSellers.map(d => `${d.name}: $${d.sales} (${d.unitsSold} uds)`).join('\n')
        },
        {
          title: 'Recomendaciones',
          content: analysis.recommendations.join('\n')
        }
      ]
    }, { type: 'report' });
  }

  async exportProductionLog() {
    const schedules = Array.from(this.productionSchedule.values());

    const data = [];
    for (const schedule of schedules) {
      for (const item of schedule.items) {
        data.push({
          Fecha: schedule.date,
          Producto: item.name,
          Categoría: item.category,
          Cantidad: item.quantity,
          Batches: item.batches,
          'Tiempo Total (min)': item.totalTime,
          'Hora Inicio': item.startTime?.split('T')[1]?.substring(0, 5) || '',
          Estado: schedule.status
        });
      }
    }

    return this.generateDocument('excel', data, {
      title: 'Log de Producción Pastelería',
      sheetName: 'Producción'
    });
  }
}

export default PastryChefAgent;
