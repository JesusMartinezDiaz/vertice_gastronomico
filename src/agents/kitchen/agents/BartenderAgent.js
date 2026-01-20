/**
 * BartenderAgent - Bartender / Mixólogo
 * Agente #32 - Especialista en coctelería
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class BartenderAgent extends UniversalAgent {
  constructor() {
    super({
      id: 32,
      emoji: '🍸',
      nombre: 'Bartender / Mixólogo',
      nombreCorto: 'BARTENDER',
      categoria: 'CULINARIO',
      experiencia: { años: 5, rango: '5+ años' },
      descripcion: 'Especialista en coctelería clásica y de autor.',
      perfil: {
        formacion: 'Bartender profesional + Especialidad en mixología',
        certificaciones: ['BarSmarts', 'Certified Specialist of Spirits', 'TIPS Certified'],
        competencias: ['Cocktail creation', 'Speed and accuracy', 'Guest interaction', 'Bar inventory', 'Cost control', 'Presentation'],
        herramientas: ['Bar POS', 'Inventory systems', 'Recipe databases', 'Specialty equipment'],
        kpis: ['Beverage Sales', 'Pour Cost', 'Speed of Service', 'Drink Quality', 'Tips Average'],
        logros: ['Desarrollo de carta de cocteles de autor', 'Reducción de pour cost de 28% a 22%', 'Ganador de competencia regional'],
        metodologias: ['Speed Bartending', 'Free Pouring', 'Cocktail Balance', 'Mise en Place']
      },
      triggers: ['cocteles', 'bar', 'bebidas', 'mixología', 'barra'],
      delegaA: [33]
    });

    this.cocktailRecipes = new Map();
    this.barInventory = new Map();
    this.salesLog = [];
  }

  // ============ RECETAS DE COCTELES ============

  async createCocktail(params) {
    const { name, category, ingredients, method, glassware, garnish } = params;

    this.emitEvent('cocktail_creation_started', { name });

    // Calcular costo
    let totalCost = 0;
    const processedIngredients = ingredients.map(ing => {
      const costPerOz = ing.bottleCost / ing.bottleOz;
      const ingredientCost = costPerOz * ing.ozUsed;
      totalCost += ingredientCost;

      return {
        name: ing.name,
        amount: ing.ozUsed,
        unit: 'oz',
        costPerOz,
        ingredientCost
      };
    });

    const cocktail = {
      id: `cocktail_${Date.now()}`,
      name,
      category, // classic, signature, tiki, low-abv, mocktail
      ingredients: processedIngredients,
      method, // shaken, stirred, built, blended
      glassware,
      garnish,
      totalCost,
      suggestedPrice: this._calculateSuggestedPrice(totalCost),
      margin: 0,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    cocktail.margin = ((cocktail.suggestedPrice - totalCost) / cocktail.suggestedPrice * 100).toFixed(1);

    this.cocktailRecipes.set(cocktail.id, cocktail);
    this.emitEvent('cocktail_created', { id: cocktail.id, name, margin: cocktail.margin });

    return cocktail;
  }

  _calculateSuggestedPrice(cost) {
    // Target pour cost: 18-22%
    const targetPourCost = 0.20;
    return Math.ceil(cost / targetPourCost);
  }

  async updateCocktailPrice(cocktailId, newPrice) {
    const cocktail = this.cocktailRecipes.get(cocktailId);
    if (!cocktail) throw new Error(`Coctel no encontrado: ${cocktailId}`);

    cocktail.suggestedPrice = newPrice;
    cocktail.margin = ((newPrice - cocktail.totalCost) / newPrice * 100).toFixed(1);
    cocktail.pourCost = ((cocktail.totalCost / newPrice) * 100).toFixed(1);

    return cocktail;
  }

  // ============ CARTA DE COCTELES ============

  async createCocktailMenu(params) {
    const { name, theme, sections } = params;

    const menu = {
      id: `barmenu_${Date.now()}`,
      name,
      theme,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      sections: sections.map(section => ({
        name: section.name,
        description: section.description,
        cocktails: []
      })),
      totalCocktails: 0,
      avgPrice: 0,
      avgPourCost: 0,
      status: 'draft'
    };

    return menu;
  }

  async addCocktailToMenu(menuId, sectionName, cocktailId) {
    const cocktail = this.cocktailRecipes.get(cocktailId);
    if (!cocktail) throw new Error(`Coctel no encontrado: ${cocktailId}`);

    return {
      menuId,
      section: sectionName,
      cocktail: {
        id: cocktail.id,
        name: cocktail.name,
        description: this._generateCocktailDescription(cocktail),
        price: cocktail.suggestedPrice,
        category: cocktail.category
      }
    };
  }

  _generateCocktailDescription(cocktail) {
    const spirits = cocktail.ingredients
      .filter(i => i.amount >= 1)
      .map(i => i.name);

    return `${spirits.join(', ')} | ${cocktail.method} | ${cocktail.glassware}`;
  }

  // ============ INVENTARIO DE BAR ============

  async updateBarInventory(items) {
    const updates = [];

    for (const item of items) {
      const existing = this.barInventory.get(item.name);

      const inventoryItem = {
        name: item.name,
        category: item.category, // spirit, liqueur, mixer, garnish
        currentLevel: item.currentLevel,
        parLevel: item.parLevel || existing?.parLevel || 2,
        unit: item.unit || 'bottles',
        cost: item.cost || existing?.cost || 0,
        lastUpdated: new Date().toISOString(),
        status: item.currentLevel < (item.parLevel || 2) * 0.3 ? 'low' : 'ok'
      };

      this.barInventory.set(item.name, inventoryItem);
      updates.push(inventoryItem);
    }

    // Identificar items bajos
    const lowStock = updates.filter(i => i.status === 'low');
    if (lowStock.length > 0) {
      this.emitEvent('bar_inventory_low', { items: lowStock.map(i => i.name) });
    }

    return { updated: updates.length, lowStock };
  }

  async generateBarOrder() {
    const orderItems = [];

    for (const item of this.barInventory.values()) {
      if (item.currentLevel < item.parLevel) {
        orderItems.push({
          name: item.name,
          category: item.category,
          currentLevel: item.currentLevel,
          parLevel: item.parLevel,
          orderQuantity: item.parLevel - item.currentLevel,
          estimatedCost: (item.parLevel - item.currentLevel) * item.cost
        });
      }
    }

    const order = {
      id: `barorder_${Date.now()}`,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      items: orderItems,
      totalItems: orderItems.reduce((sum, i) => sum + i.orderQuantity, 0),
      totalEstimatedCost: orderItems.reduce((sum, i) => sum + i.estimatedCost, 0),
      status: 'draft'
    };

    return order;
  }

  // ============ ANÁLISIS DE VENTAS ============

  async logSale(sale) {
    const saleRecord = {
      id: `sale_${Date.now()}`,
      cocktailId: sale.cocktailId,
      cocktailName: sale.cocktailName,
      price: sale.price,
      cost: sale.cost,
      timestamp: new Date().toISOString(),
      server: sale.server,
      table: sale.table
    };

    this.salesLog.push(saleRecord);
    return saleRecord;
  }

  async analyzeSales(period) {
    const periodSales = this.salesLog.filter(s =>
      s.timestamp.startsWith(period)
    );

    const analysis = {
      period,
      analyzedBy: this.nombre,
      analyzedAt: new Date().toISOString(),
      totalSales: periodSales.length,
      totalRevenue: 0,
      totalCost: 0,
      avgPourCost: 0,
      byCocktail: {},
      topSellers: [],
      recommendations: []
    };

    // Agrupar por coctel
    for (const sale of periodSales) {
      analysis.totalRevenue += sale.price;
      analysis.totalCost += sale.cost;

      if (!analysis.byCocktail[sale.cocktailName]) {
        analysis.byCocktail[sale.cocktailName] = {
          name: sale.cocktailName,
          count: 0,
          revenue: 0,
          cost: 0
        };
      }

      analysis.byCocktail[sale.cocktailName].count++;
      analysis.byCocktail[sale.cocktailName].revenue += sale.price;
      analysis.byCocktail[sale.cocktailName].cost += sale.cost;
    }

    // Calcular métricas
    analysis.avgPourCost = ((analysis.totalCost / analysis.totalRevenue) * 100).toFixed(1);
    analysis.grossProfit = analysis.totalRevenue - analysis.totalCost;
    analysis.margin = ((analysis.grossProfit / analysis.totalRevenue) * 100).toFixed(1);

    // Top sellers
    analysis.topSellers = Object.values(analysis.byCocktail)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recomendaciones
    if (parseFloat(analysis.avgPourCost) > 22) {
      analysis.recommendations.push('Pour cost alto (>22%). Revisar recetas y porciones.');
    }

    const lowMarginCocktails = Object.values(analysis.byCocktail)
      .filter(c => (c.cost / c.revenue) > 0.25);

    for (const cocktail of lowMarginCocktails) {
      analysis.recommendations.push(`${cocktail.name}: Pour cost alto. Considerar ajuste de precio.`);
    }

    return analysis;
  }

  // ============ VELOCIDAD DE SERVICIO ============

  async createSpeedDrillPlan(targetTime = 45) {
    const drillPlan = {
      id: `drill_${Date.now()}`,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      targetTime, // segundos por bebida
      exercises: [
        {
          name: 'Setup Speed',
          description: 'Preparar mise en place en 5 minutos',
          targetTime: 300
        },
        {
          name: 'Classic Cocktails',
          description: '5 cocteles clásicos consecutivos',
          cocktails: ['Margarita', 'Old Fashioned', 'Martini', 'Mojito', 'Negroni'],
          targetTime: 225 // 45 seg cada uno
        },
        {
          name: 'Build Speed',
          description: '10 highballs consecutivos',
          targetTime: 150 // 15 seg cada uno
        },
        {
          name: 'Shake Speed',
          description: 'Shakeado doble - 2 bebidas simultáneas',
          targetTime: 50
        }
      ],
      bestTimes: {},
      status: 'pending'
    };

    return drillPlan;
  }

  async recordDrillResult(drillId, exerciseName, actualTime) {
    return {
      drillId,
      exercise: exerciseName,
      actualTime,
      recordedBy: this.nombre,
      recordedAt: new Date().toISOString()
    };
  }

  // ============ REPORTES ============

  async generateBarReport(period) {
    const salesAnalysis = await this.analyzeSales(period);

    return this.generateDocument('pdf', {
      title: `Reporte de Bar - ${period}`,
      summary: `Generado por ${this.nombre}`,
      metrics: [
        { name: 'Ventas Totales', value: salesAnalysis.totalSales },
        { name: 'Revenue', value: salesAnalysis.totalRevenue, prefix: '$' },
        { name: 'Pour Cost', value: salesAnalysis.avgPourCost, unit: '%' },
        { name: 'Margen Bruto', value: salesAnalysis.margin, unit: '%' }
      ],
      sections: [
        {
          title: 'Top 10 Cocteles',
          content: salesAnalysis.topSellers
            .map((c, i) => `${i + 1}. ${c.name}: ${c.count} vendidos - $${c.revenue}`)
            .join('\n')
        },
        {
          title: 'Recomendaciones',
          content: salesAnalysis.recommendations.length > 0
            ? salesAnalysis.recommendations.join('\n')
            : 'Sin recomendaciones pendientes'
        }
      ]
    }, { type: 'report' });
  }

  async exportCocktailRecipes() {
    const recipes = Array.from(this.cocktailRecipes.values());

    const data = recipes.map(r => ({
      Nombre: r.name,
      Categoría: r.category,
      Método: r.method,
      Copa: r.glassware,
      Garnish: r.garnish,
      Costo: r.totalCost.toFixed(2),
      Precio: r.suggestedPrice,
      'Margen %': r.margin,
      Ingredientes: r.ingredients.map(i => `${i.amount}oz ${i.name}`).join(', ')
    }));

    return this.generateDocument('excel', data, {
      title: 'Recetas de Cocteles',
      sheetName: 'Cocktails'
    });
  }

  async exportBarInventory() {
    const items = Array.from(this.barInventory.values());

    const data = items.map(i => ({
      Producto: i.name,
      Categoría: i.category,
      'Nivel Actual': i.currentLevel,
      'Nivel Par': i.parLevel,
      Unidad: i.unit,
      Costo: i.cost,
      Estado: i.status,
      'Última Actualización': i.lastUpdated.split('T')[0]
    }));

    return this.generateDocument('excel', data, {
      title: 'Inventario de Bar',
      sheetName: 'Inventory'
    });
  }
}

export default BartenderAgent;
