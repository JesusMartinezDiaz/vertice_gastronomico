/**
 * SommelierAgent - Sommelier
 * Agente #31 - Experto en vinos y maridajes
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class SommelierAgent extends UniversalAgent {
  constructor() {
    super({
      id: 31,
      emoji: '🍷',
      nombre: 'Sommelier',
      nombreCorto: 'SOMMELIER',
      categoria: 'CULINARIO',
      experiencia: { años: 8, rango: '8+ años' },
      descripcion: 'Experto en vinos y maridajes con certificación avanzada.',
      perfil: {
        formacion: 'Sommelier certificado + Formación en destilados',
        certificaciones: ['Court of Master Sommeliers Level 3', 'WSET Level 3', 'Certified Specialist of Spirits'],
        competencias: ['Wine selection', 'Pairing expertise', 'Cellar management', 'Staff training', 'Beverage costing', 'Guest service'],
        herramientas: ['Wine inventory systems', 'CellarTracker', 'Coravin', 'Wine education platforms'],
        kpis: ['Wine Sales %', 'Beverage Cost %', 'Average Check', 'Wine Training Hours', 'Guest Satisfaction'],
        logros: ['Incremento de venta de vinos de 15% a 28%', 'Desarrollo de carta de vinos galardonada', 'Programa de maridaje con incremento de 35% en attach rate'],
        metodologias: ['Deductive Tasting', 'Food Pairing Theory', 'Cellar Management', 'Staff Wine Education']
      },
      triggers: ['vinos', 'maridaje', 'carta de vinos', 'cava', 'sommelier', 'bebidas'],
      delegaA: [32, 33]
    });

    this.wineInventory = new Map();
    this.pairings = new Map();
    this.tastingNotes = [];
  }

  // ============ CARTA DE VINOS ============

  async createWineList(params) {
    const { name, style, sections } = params;

    this.emitEvent('wine_list_creation_started', { name });

    const wineList = {
      id: `winelist_${Date.now()}`,
      name,
      style, // classic, progressive, regional
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      version: 1,
      sections: sections.map(section => ({
        name: section.name,
        description: section.description,
        wines: []
      })),
      totalSelections: 0,
      avgPrice: 0,
      avgMargin: 0,
      status: 'draft'
    };

    return wineList;
  }

  async addWineToList(wineListId, sectionName, wine) {
    // En implementación real, actualizaría el wineList
    const wineEntry = {
      id: `wine_${Date.now()}`,
      name: wine.name,
      producer: wine.producer,
      region: wine.region,
      country: wine.country,
      vintage: wine.vintage,
      varietal: wine.varietal,
      style: wine.style, // light, medium, full
      price: {
        glass: wine.glassPrice,
        bottle: wine.bottlePrice
      },
      cost: wine.cost,
      margin: ((wine.bottlePrice - wine.cost) / wine.bottlePrice * 100).toFixed(1),
      parLevel: wine.parLevel || 6,
      tastingNotes: wine.tastingNotes,
      pairings: wine.pairings || [],
      isFeature: wine.isFeature || false,
      isByTheGlass: wine.glassPrice ? true : false
    };

    // Agregar al inventario
    this.wineInventory.set(wineEntry.id, {
      ...wineEntry,
      currentStock: wine.currentStock || wine.parLevel
    });

    return wineEntry;
  }

  // ============ MARIDAJE ============

  async suggestPairing(dish) {
    const pairingRules = {
      // Proteínas
      'beef': { styles: ['full_red'], regions: ['Mendoza', 'Napa', 'Ribera del Duero'] },
      'lamb': { styles: ['full_red', 'medium_red'], regions: ['Rioja', 'Rhône', 'Barossa'] },
      'pork': { styles: ['medium_red', 'rich_white'], regions: ['Loire', 'Alsace', 'Oregon'] },
      'chicken': { styles: ['light_red', 'rich_white'], regions: ['Burgundy', 'California'] },
      'fish_white': { styles: ['light_white', 'medium_white'], regions: ['Burgundy', 'Galicia'] },
      'fish_fatty': { styles: ['rich_white', 'light_red'], regions: ['Burgundy', 'Oregon'] },
      'shellfish': { styles: ['sparkling', 'light_white'], regions: ['Champagne', 'Chablis'] },

      // Preparaciones
      'grilled': { modifiers: ['oak', 'smoke'] },
      'cream_sauce': { modifiers: ['rich', 'buttery'] },
      'spicy': { modifiers: ['off_dry', 'fruity'] },
      'acidic': { modifiers: ['high_acid'] }
    };

    const suggestions = {
      dish: dish.name,
      protein: dish.protein,
      preparation: dish.preparation,
      sauce: dish.sauce,
      suggestedBy: this.nombre,
      pairings: []
    };

    // Obtener reglas base
    const proteinRules = pairingRules[dish.protein] || pairingRules.chicken;
    const prepRules = pairingRules[dish.preparation] || {};

    // Buscar vinos que coincidan
    for (const wine of this.wineInventory.values()) {
      let score = 0;

      if (proteinRules.styles.includes(wine.style)) score += 3;
      if (proteinRules.regions.includes(wine.region)) score += 2;

      if (score > 0) {
        suggestions.pairings.push({
          wine: wine.name,
          producer: wine.producer,
          region: wine.region,
          score,
          reason: `${wine.style} complementa ${dish.protein}`,
          glassPrice: wine.price.glass,
          bottlePrice: wine.price.bottle
        });
      }
    }

    // Ordenar por score
    suggestions.pairings.sort((a, b) => b.score - a.score);
    suggestions.topPairing = suggestions.pairings[0] || null;

    return suggestions;
  }

  async createPairingMenu(menuItems) {
    this.emitEvent('pairing_menu_started', { itemCount: menuItems.length });

    const pairingMenu = {
      id: `pairing_${Date.now()}`,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      courses: [],
      totalWineCost: 0,
      suggestedWinePrice: 0
    };

    for (const item of menuItems) {
      const pairing = await this.suggestPairing(item);

      if (pairing.topPairing) {
        pairingMenu.courses.push({
          course: item.courseName,
          dish: item.name,
          wine: pairing.topPairing.wine,
          producer: pairing.topPairing.producer,
          pourSize: item.pourSize || '3oz',
          reason: pairing.topPairing.reason
        });
      }
    }

    return pairingMenu;
  }

  // ============ GESTIÓN DE CAVA ============

  async performInventoryCheck() {
    this.emitEvent('inventory_check_started', {});

    const inventory = {
      checkDate: new Date().toISOString(),
      checkedBy: this.nombre,
      totalSKUs: this.wineInventory.size,
      totalValue: 0,
      belowPar: [],
      overstock: [],
      recommendations: []
    };

    for (const wine of this.wineInventory.values()) {
      const value = wine.currentStock * wine.cost;
      inventory.totalValue += value;

      if (wine.currentStock < wine.parLevel * 0.3) {
        inventory.belowPar.push({
          name: wine.name,
          current: wine.currentStock,
          par: wine.parLevel,
          needed: wine.parLevel - wine.currentStock,
          urgency: wine.currentStock === 0 ? 'critical' : 'high'
        });
      }

      if (wine.currentStock > wine.parLevel * 2) {
        inventory.overstock.push({
          name: wine.name,
          current: wine.currentStock,
          par: wine.parLevel,
          excess: wine.currentStock - wine.parLevel,
          value: (wine.currentStock - wine.parLevel) * wine.cost
        });
      }
    }

    // Generar recomendaciones
    if (inventory.belowPar.length > 0) {
      inventory.recommendations.push(`${inventory.belowPar.length} vinos bajo nivel par - generar orden de compra`);
    }
    if (inventory.overstock.length > 0) {
      const excessValue = inventory.overstock.reduce((sum, w) => sum + w.value, 0);
      inventory.recommendations.push(`Exceso de inventario: $${excessValue.toFixed(2)} - considerar promociones`);
    }

    this.emitEvent('inventory_check_completed', {
      totalValue: inventory.totalValue,
      alerts: inventory.belowPar.length + inventory.overstock.length
    });

    return inventory;
  }

  async generatePurchaseOrder(vendorId) {
    const belowPar = [];

    for (const wine of this.wineInventory.values()) {
      if (wine.currentStock < wine.parLevel * 0.5) {
        belowPar.push({
          name: wine.name,
          producer: wine.producer,
          needed: wine.parLevel - wine.currentStock,
          cost: wine.cost,
          totalCost: (wine.parLevel - wine.currentStock) * wine.cost
        });
      }
    }

    const order = {
      id: `po_wine_${Date.now()}`,
      vendorId,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      items: belowPar,
      totalItems: belowPar.reduce((sum, w) => sum + w.needed, 0),
      totalCost: belowPar.reduce((sum, w) => sum + w.totalCost, 0),
      status: 'draft'
    };

    return order;
  }

  // ============ CAPACITACIÓN ============

  async createWineTraining(topic) {
    const trainings = {
      'deductive_tasting': {
        title: 'Cata Deductiva',
        duration: 90,
        modules: [
          { name: 'Evaluación Visual', points: ['Claridad', 'Intensidad', 'Color', 'Viscosidad'] },
          { name: 'Evaluación Aromática', points: ['Intensidad', 'Frutas', 'Flores', 'Tierra', 'Roble'] },
          { name: 'Evaluación Gustativa', points: ['Acidez', 'Taninos', 'Alcohol', 'Cuerpo', 'Final'] },
          { name: 'Conclusión', points: ['Varietal', 'Región', 'Calidad', 'Edad'] }
        ]
      },
      'pairing_basics': {
        title: 'Fundamentos de Maridaje',
        duration: 60,
        modules: [
          { name: 'Principios Básicos', points: ['Complementar', 'Contrastar', 'Intensidad'] },
          { name: 'Maridaje por Proteína', points: ['Carnes rojas', 'Aves', 'Pescados', 'Mariscos'] },
          { name: 'Maridaje por Preparación', points: ['Asado', 'Salsas', 'Especias'] },
          { name: 'Práctica', points: ['Ejercicios de maridaje con menú actual'] }
        ]
      },
      'wine_service': {
        title: 'Servicio de Vinos',
        duration: 45,
        modules: [
          { name: 'Presentación', points: ['Mostrar etiqueta', 'Confirmar selección'] },
          { name: 'Apertura', points: ['Cortar cápsula', 'Extraer corcho', 'Oler corcho'] },
          { name: 'Servicio', points: ['Verter para cata', 'Servir invitados', 'Rellenar'] },
          { name: 'Temperaturas', points: ['Blancos: 7-12°C', 'Tintos: 15-18°C', 'Espumosos: 6-8°C'] }
        ]
      }
    };

    const training = trainings[topic] || trainings.wine_service;

    return {
      id: `training_${Date.now()}`,
      ...training,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      attendees: [],
      status: 'scheduled'
    };
  }

  // ============ REPORTES ============

  async generateWineSalesReport(period) {
    // En implementación real, obtendría datos de ventas
    const mockSales = Array.from(this.wineInventory.values()).map(wine => ({
      ...wine,
      unitsSold: Math.floor(Math.random() * 20) + 1,
      glassesSold: wine.isByTheGlass ? Math.floor(Math.random() * 50) : 0
    }));

    const totalSales = mockSales.reduce((sum, w) =>
      sum + (w.unitsSold * w.price.bottle) + (w.glassesSold * (w.price.glass || 0)), 0
    );

    const totalCost = mockSales.reduce((sum, w) =>
      sum + (w.unitsSold * w.cost) + (w.glassesSold * w.cost / 5), 0
    );

    const report = {
      period,
      generatedBy: this.nombre,
      generatedAt: new Date().toISOString(),
      totalSales,
      totalCost,
      grossMargin: ((totalSales - totalCost) / totalSales * 100).toFixed(1),
      topSellers: mockSales.sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5),
      byTheGlassPerformance: mockSales
        .filter(w => w.isByTheGlass)
        .sort((a, b) => b.glassesSold - a.glassesSold)
        .slice(0, 5)
    };

    return this.generateDocument('pdf', {
      title: `Reporte de Vinos - ${period}`,
      summary: `Generado por ${this.nombre}`,
      metrics: [
        { name: 'Ventas Totales', value: totalSales, prefix: '$' },
        { name: 'Costo', value: totalCost, prefix: '$' },
        { name: 'Margen', value: report.grossMargin, unit: '%' },
        { name: 'SKUs Activos', value: this.wineInventory.size }
      ],
      sections: [
        {
          title: 'Top 5 Vinos',
          content: report.topSellers.map(w => `${w.name}: ${w.unitsSold} botellas`).join('\n')
        },
        {
          title: 'Top Vinos por Copa',
          content: report.byTheGlassPerformance.map(w => `${w.name}: ${w.glassesSold} copas`).join('\n')
        }
      ]
    }, { type: 'report' });
  }

  async exportWineList() {
    const wines = Array.from(this.wineInventory.values());

    const data = wines.map(w => ({
      Nombre: w.name,
      Productor: w.producer,
      Región: w.region,
      País: w.country,
      Varietal: w.varietal,
      Vintage: w.vintage,
      'Precio Copa': w.price.glass || '-',
      'Precio Botella': w.price.bottle,
      Costo: w.cost,
      'Margen %': w.margin,
      Stock: w.currentStock,
      'Nivel Par': w.parLevel
    }));

    return this.generateDocument('excel', data, {
      title: 'Carta de Vinos',
      sheetName: 'Wines'
    });
  }
}

export default SommelierAgent;
