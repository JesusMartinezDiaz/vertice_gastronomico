/**
 * PRUEBAS UNITARIAS - AGENTES FINANCIEROS
 * Vértice Gastronómico - Test Suite Completa
 *
 * Cobertura:
 * - CFOAgent: Análisis financiero, presupuestos, proyecciones
 * - FoodCostAnalystAgent: Fichas de costos, menu engineering, mermas
 * - Módulo completo: Factory functions, exports
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DE UniversalAgent
// ═══════════════════════════════════════════════════════════════════════════

vi.mock('../../shared/UniversalCapabilities.js', () => ({
  UniversalAgent: class MockUniversalAgent {
    constructor(config) {
      this.config = config;
      this.id = config.id;
      this.nombre = config.nombre;
      this.categoria = config.categoria;
    }

    emitEvent(eventName, data) {
      // Mock event emission
    }

    async validateDeliverable(deliverable) {
      return { passed: true, score: 95 };
    }

    async generateDocument(format, data, options) {
      return { format, data, options, generated: true };
    }
  }
}));

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTACIONES
// ═══════════════════════════════════════════════════════════════════════════

import { CFOAgent } from '../agents/CFOAgent.js';
import { FoodCostAnalystAgent } from '../agents/FoodCostAnalystAgent.js';
import {
  getFinancialAgent,
  getAllFinancialAgents,
  FINANCIAL_AGENTS
} from '../index.js';

// ═══════════════════════════════════════════════════════════════════════════
// CFOAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('CFOAgent', () => {
  let cfoAgent;

  beforeEach(() => {
    cfoAgent = new CFOAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID correcto', () => {
      expect(cfoAgent.id).toBe(2);
    });

    it('debe tener nombre correcto', () => {
      expect(cfoAgent.nombre).toBe('Director Financiero (CFO)');
    });

    it('debe pertenecer a categoría FINANZAS', () => {
      expect(cfoAgent.categoria).toBe('FINANZAS');
    });

    it('debe inicializar maps vacíos', () => {
      expect(cfoAgent.financialModels).toBeInstanceOf(Map);
      expect(cfoAgent.budgets).toBeInstanceOf(Map);
      expect(cfoAgent.forecasts).toBeInstanceOf(Map);
    });
  });

  describe('Análisis de Liquidez', () => {
    it('debe calcular current ratio correctamente', () => {
      const data = { currentAssets: 150000, currentLiabilities: 100000 };
      const analysis = cfoAgent._analyzeLiquidity(data);

      expect(analysis.currentRatio.value).toBe(1.5);
      expect(analysis.currentRatio.status).toBe('good');
    });

    it('debe marcar current ratio crítico cuando es menor a 1', () => {
      const data = { currentAssets: 80000, currentLiabilities: 100000 };
      const analysis = cfoAgent._analyzeLiquidity(data);

      expect(analysis.currentRatio.value).toBe(0.8);
      expect(analysis.currentRatio.status).toBe('critical');
    });

    it('debe calcular quick ratio excluyendo inventario', () => {
      const data = {
        currentAssets: 150000,
        currentLiabilities: 100000,
        inventory: 50000
      };
      const analysis = cfoAgent._analyzeLiquidity(data);

      expect(analysis.quickRatio.value).toBe(1); // (150000 - 50000) / 100000
    });

    it('debe calcular working capital correctamente', () => {
      const data = { currentAssets: 150000, currentLiabilities: 100000 };
      const analysis = cfoAgent._analyzeLiquidity(data);

      expect(analysis.workingCapital).toBe(50000);
    });
  });

  describe('Análisis de Rentabilidad', () => {
    it('debe calcular gross margin correctamente', () => {
      const data = { revenue: 100000, cogs: 35000 };
      const analysis = cfoAgent._analyzeProfitability(data);

      expect(analysis.grossMargin.value).toBe(65);
      expect(analysis.grossMargin.status).toBe('excellent');
    });

    it('debe marcar gross margin warning cuando es bajo', () => {
      const data = { revenue: 100000, cogs: 55000 };
      const analysis = cfoAgent._analyzeProfitability(data);

      expect(analysis.grossMargin.value).toBe(45);
      expect(analysis.grossMargin.status).toBe('warning');
    });

    it('debe calcular operating margin', () => {
      const data = { revenue: 100000, operatingIncome: 12000 };
      const analysis = cfoAgent._analyzeProfitability(data);

      expect(analysis.operatingMargin.value).toBe(12);
      expect(analysis.operatingMargin.status).toBe('good');
    });
  });

  describe('Análisis de Eficiencia', () => {
    it('debe calcular inventory turnover', () => {
      const data = { cogs: 360000, averageInventory: 30000 };
      const analysis = cfoAgent._analyzeEfficiency(data);

      expect(analysis.inventoryTurnover.value).toBe(12);
      expect(analysis.inventoryTurnover.daysInInventory).toBeCloseTo(30.4, 1);
    });

    it('debe calcular cash conversion cycle', () => {
      const data = {
        cogs: 365000,
        revenue: 500000,
        averageInventory: 36500,
        averageReceivables: 50000,
        averagePayables: 36500
      };
      const analysis = cfoAgent._analyzeEfficiency(data);

      // CCC = DIO + DSO - DPO
      expect(analysis.cashConversionCycle).toBeDefined();
    });
  });

  describe('Análisis de Apalancamiento', () => {
    it('debe calcular debt to equity ratio', () => {
      const data = { totalDebt: 100000, equity: 200000 };
      const analysis = cfoAgent._analyzeLeverage(data);

      expect(analysis.debtToEquity.value).toBe(0.5);
      expect(analysis.debtToEquity.status).toBe('good');
    });

    it('debe marcar leverage crítico cuando es alto', () => {
      const data = { totalDebt: 300000, equity: 100000 };
      const analysis = cfoAgent._analyzeLeverage(data);

      expect(analysis.debtToEquity.value).toBe(3);
      expect(analysis.debtToEquity.status).toBe('critical');
    });

    it('debe calcular interest coverage', () => {
      const data = { ebit: 50000, interestExpense: 10000 };
      const analysis = cfoAgent._analyzeLeverage(data);

      expect(analysis.interestCoverage.value).toBe(5);
      expect(analysis.interestCoverage.status).toBe('good');
    });
  });

  describe('Análisis Financiero Completo', () => {
    it('debe realizar análisis completo de salud financiera', async () => {
      const data = {
        currentAssets: 200000,
        currentLiabilities: 100000,
        inventory: 50000,
        cash: 30000,
        revenue: 500000,
        cogs: 175000,
        operatingIncome: 75000,
        netIncome: 50000,
        ebitda: 90000,
        totalAssets: 400000,
        averageInventory: 45000,
        averageReceivables: 40000,
        averagePayables: 35000,
        totalDebt: 150000,
        equity: 250000,
        ebit: 80000,
        interestExpense: 15000
      };

      const analysis = await cfoAgent.analyzeFinancialHealth(data);

      expect(analysis.liquidity).toBeDefined();
      expect(analysis.profitability).toBeDefined();
      expect(analysis.efficiency).toBeDefined();
      expect(analysis.leverage).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
    });

    it('debe generar recomendaciones cuando hay problemas', async () => {
      const data = {
        currentAssets: 80000,
        currentLiabilities: 100000,
        revenue: 500000,
        cogs: 275000, // 55% - alto
        totalDebt: 400000,
        equity: 100000,
        totalAssets: 500000
      };

      const analysis = await cfoAgent.analyzeFinancialHealth(data);

      expect(analysis.recommendations.length).toBeGreaterThan(0);
      expect(analysis.recommendations.some(r => r.area === 'Liquidez')).toBe(true);
      expect(analysis.recommendations.some(r => r.area === 'Rentabilidad')).toBe(true);
    });
  });

  describe('Presupuestos', () => {
    it('debe crear presupuesto correctamente', async () => {
      const params = {
        period: '2024-Q1',
        departments: [
          { name: 'Cocina', projectedRevenue: 150000, baseExpenses: 45000 },
          { name: 'Bar', projectedRevenue: 80000, baseExpenses: 24000 }
        ],
        assumptions: { inflation: 4 }
      };

      const budget = await cfoAgent.createBudget(params);

      expect(budget.id).toMatch(/^budget_/);
      expect(budget.period).toBe('2024-Q1');
      expect(budget.departments).toHaveProperty('Cocina');
      expect(budget.departments).toHaveProperty('Bar');
      expect(budget.totals.revenue).toBe(230000);
      expect(budget.totals.profit).toBeDefined();
    });

    it('debe aplicar factor de inflación a gastos', async () => {
      const params = {
        period: '2024',
        departments: [
          { name: 'Test', projectedRevenue: 100000, baseExpenses: 10000 }
        ],
        assumptions: { inflation: 10 }
      };

      const budget = await cfoAgent.createBudget(params);

      // 10000 * 1.10 = 11000
      expect(budget.departments.Test.expenses).toBe(11000);
    });

    it('debe guardar presupuesto en Map', async () => {
      const params = {
        period: '2024',
        departments: [],
        assumptions: {}
      };

      const budget = await cfoAgent.createBudget(params);

      expect(cfoAgent.budgets.has(budget.id)).toBe(true);
    });
  });

  describe('Proyecciones Financieras', () => {
    it('debe crear forecast correctamente', async () => {
      const params = {
        baseData: {
          revenue: 100000,
          cogs: 30000,
          laborCost: 25000,
          otherExpenses: 20000
        },
        periods: 4,
        growthAssumptions: {
          revenueGrowth: 5,
          costInflation: 3,
          laborGrowth: 4,
          taxRate: 30
        }
      };

      const forecast = await cfoAgent.createFinancialForecast(params);

      expect(forecast.id).toMatch(/^forecast_/);
      expect(forecast.periods.length).toBe(4);
      expect(forecast.summary.totalRevenueGrowth).toBeDefined();
    });

    it('debe proyectar crecimiento de ingresos', async () => {
      const params = {
        baseData: {
          revenue: 100000,
          cogs: 30000,
          laborCost: 25000,
          otherExpenses: 20000
        },
        periods: 1,
        growthAssumptions: {
          revenueGrowth: 10,
          costInflation: 0,
          laborGrowth: 0,
          taxRate: 0
        }
      };

      const forecast = await cfoAgent.createFinancialForecast(params);

      expect(forecast.periods[0].revenue).toBeCloseTo(110000, 0);
    });
  });

  describe('Formateo de Estados Financieros', () => {
    it('debe formatear estado de resultados', () => {
      const data = {
        revenue: 100000,
        cogs: 35000,
        operatingExpenses: 40000,
        payroll: 25000,
        rent: 10000,
        utilities: 3000,
        marketing: 2000,
        ebitda: 25000,
        netIncome: 15000
      };

      const formatted = cfoAgent._formatIncomeStatement(data);

      expect(formatted[0].Concepto).toBe('Ventas Totales');
      expect(formatted[0].Monto).toBe(100000);
    });

    it('debe formatear balance general', () => {
      const data = {
        cash: 50000,
        receivables: 30000,
        inventory: 20000,
        currentAssets: 100000,
        fixedAssets: 200000,
        totalAssets: 300000
      };

      const formatted = cfoAgent._formatBalanceSheet(data);

      expect(formatted.Activos).toBeDefined();
      expect(formatted.Pasivos).toBeDefined();
      expect(formatted.Capital).toBeDefined();
    });
  });

  describe('Delegación de Tareas', () => {
    it('debe permitir delegar a agentes subordinados', async () => {
      const result = await cfoAgent.delegateTask('food_cost_analysis', 4, { period: '2024' });

      expect(result.delegated).toBe(true);
      expect(result.from).toBe(2);
      expect(result.to).toBe(4);
    });

    it('debe rechazar delegación a agentes no subordinados', async () => {
      await expect(
        cfoAgent.delegateTask('task', 99, {})
      ).rejects.toThrow('No se puede delegar al agente 99');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FoodCostAnalystAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('FoodCostAnalystAgent', () => {
  let foodCostAgent;

  beforeEach(() => {
    foodCostAgent = new FoodCostAnalystAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID correcto', () => {
      expect(foodCostAgent.id).toBe(4);
    });

    it('debe tener targets definidos', () => {
      expect(foodCostAgent.TARGETS.FOOD_COST_MAX).toBe(30);
      expect(foodCostAgent.TARGETS.WASTE_MAX).toBe(3);
      expect(foodCostAgent.TARGETS.YIELD_MIN).toBe(85);
    });
  });

  describe('Fichas de Costos', () => {
    it('debe crear ficha de costos correctamente', async () => {
      const recipe = {
        name: 'Pasta Carbonara',
        category: 'Pastas',
        portions: 4,
        sellingPrice: 250,
        ingredients: [
          { name: 'Pasta', quantity: 400, unit: 'g', unitCost: 0.05, yield: 100 },
          { name: 'Tocino', quantity: 200, unit: 'g', unitCost: 0.25, yield: 90 },
          { name: 'Huevos', quantity: 4, unit: 'pz', unitCost: 5, yield: 100 }
        ]
      };

      const costSheet = await foodCostAgent.createCostSheet(recipe);

      expect(costSheet.id).toMatch(/^cs_/);
      expect(costSheet.recipeName).toBe('Pasta Carbonara');
      expect(costSheet.portions).toBe(4);
      expect(costSheet.totalCost).toBeGreaterThan(0);
      expect(costSheet.costPerPortion).toBeDefined();
      expect(costSheet.foodCostPercentage).toBeDefined();
    });

    it('debe calcular costo por porción correctamente', async () => {
      const recipe = {
        name: 'Test',
        portions: 2,
        sellingPrice: 100,
        ingredients: [
          { name: 'Ingrediente', quantity: 10, unit: 'kg', unitCost: 5, yield: 100 }
        ]
      };

      const costSheet = await foodCostAgent.createCostSheet(recipe);

      expect(costSheet.totalCost).toBe(50);
      expect(costSheet.costPerPortion).toBe(25);
    });

    it('debe ajustar cantidad por rendimiento', () => {
      const ingredient = {
        name: 'Carne',
        quantity: 1000,
        unit: 'g',
        unitCost: 0.15,
        yield: 80
      };

      const result = foodCostAgent._calculateIngredientCost(ingredient);

      expect(result.adjustedQuantity).toBe(1250); // 1000 / 0.8
      expect(result.totalCost).toBe(187.5); // 1250 * 0.15
    });

    it('debe calcular precio sugerido basado en food cost objetivo', () => {
      const costPerPortion = 70;
      const suggestedPrice = foodCostAgent._calculateSuggestedPrice(costPerPortion, 28);

      expect(suggestedPrice).toBeCloseTo(250, 0);
    });

    it('debe clasificar receta como STAR cuando tiene alta rentabilidad', () => {
      const costSheet = {
        foodCostPercentage: 22,
        marginPercentage: 78
      };

      const classification = foodCostAgent._classifyRecipe(costSheet);

      expect(classification.category).toBe('STAR');
    });

    it('debe clasificar receta como DOG cuando tiene baja rentabilidad', () => {
      const costSheet = {
        foodCostPercentage: 40,
        marginPercentage: 45
      };

      const classification = foodCostAgent._classifyRecipe(costSheet);

      expect(classification.category).toBe('DOG');
    });
  });

  describe('Menu Engineering', () => {
    it('debe analizar menú correctamente', async () => {
      const menuItems = [
        { name: 'Platillo A', margin: 100, salesCount: 50 },
        { name: 'Platillo B', margin: 50, salesCount: 100 },
        { name: 'Platillo C', margin: 120, salesCount: 20 },
        { name: 'Platillo D', margin: 40, salesCount: 30 }
      ];

      const analysis = await foodCostAgent.analyzeMenu(menuItems);

      expect(analysis.totalItems).toBe(4);
      expect(analysis.averages.contributionMargin).toBeDefined();
      expect(analysis.categories.stars).toBeDefined();
      expect(analysis.categories.plowHorses).toBeDefined();
      expect(analysis.categories.puzzles).toBeDefined();
      expect(analysis.categories.dogs).toBeDefined();
    });

    it('debe clasificar STARS correctamente (alto margen + alta popularidad)', async () => {
      const menuItems = [
        { name: 'Star Item', margin: 200, salesCount: 200 },
        { name: 'Other', margin: 50, salesCount: 50 }
      ];

      const analysis = await foodCostAgent.analyzeMenu(menuItems);

      expect(analysis.categories.stars.some(i => i.name === 'Star Item')).toBe(true);
    });

    it('debe calcular health score del menú', async () => {
      const menuItems = [
        { name: 'A', margin: 100, salesCount: 100 },
        { name: 'B', margin: 50, salesCount: 50 }
      ];

      const analysis = await foodCostAgent.analyzeMenu(menuItems);

      expect(analysis.summary.healthScore).toBeDefined();
      expect(typeof analysis.summary.healthScore).toBe('number');
    });

    it('debe generar recomendaciones por categoría', async () => {
      const menuItems = [
        { name: 'Dog Item', margin: 10, salesCount: 10 },
        { name: 'Star Item', margin: 200, salesCount: 200 }
      ];

      const analysis = await foodCostAgent.analyzeMenu(menuItems);

      expect(analysis.recommendations.some(r => r.category === 'DOGS')).toBe(true);
      expect(analysis.recommendations.some(r => r.action === 'REVISAR')).toBe(true);
    });
  });

  describe('Análisis de Mermas', () => {
    it('debe analizar mermas correctamente', async () => {
      const wasteData = {
        period: '2024-01',
        totalPurchases: 100000,
        items: [
          { name: 'Lechuga', value: 500, category: 'Verduras', reason: 'Caducidad' },
          { name: 'Pollo', value: 800, category: 'Proteínas', reason: 'Mal almacenamiento' },
          { name: 'Pan', value: 200, category: 'Panadería', reason: 'Caducidad' }
        ]
      };

      const analysis = await foodCostAgent.analyzeWaste(wasteData);

      expect(analysis.totalWasteValue).toBe(1500);
      expect(analysis.wastePercentage).toBe(1.5);
      expect(analysis.byCategory).toHaveProperty('Verduras');
      expect(analysis.byReason).toHaveProperty('Caducidad');
    });

    it('debe calcular ahorros potenciales cuando merma excede objetivo', async () => {
      const wasteData = {
        period: '2024-01',
        totalPurchases: 100000,
        items: [
          { name: 'Item', value: 5000, category: 'Test', reason: 'Test' }
        ]
      };

      const analysis = await foodCostAgent.analyzeWaste(wasteData);

      // 5% merma vs 3% objetivo
      expect(analysis.potentialSavings).toBe(2000); // 5000 - 3000
    });

    it('debe identificar top items con más merma', async () => {
      const wasteData = {
        period: '2024-01',
        totalPurchases: 100000,
        items: [
          { name: 'Item A', value: 100 },
          { name: 'Item B', value: 500 },
          { name: 'Item C', value: 300 }
        ]
      };

      const analysis = await foodCostAgent.analyzeWaste(wasteData);

      expect(analysis.topWastedItems[0].name).toBe('Item B');
      expect(analysis.topWastedItems[1].name).toBe('Item C');
    });
  });

  describe('Análisis de Yield (Rendimiento)', () => {
    it('debe calcular yield correctamente', async () => {
      const product = {
        name: 'Res',
        purchaseWeight: 10,
        purchaseUnit: 'kg',
        purchaseCost: 1500,
        processes: [
          { name: 'Limpieza', wastePercentage: 5 },
          { name: 'Deshuese', wastePercentage: 20 }
        ]
      };

      const analysis = await foodCostAgent.calculateYield(product);

      // 10kg -> 9.5kg (5%) -> 7.6kg (20% de 9.5)
      expect(analysis.usableWeight).toBeCloseTo(7.6, 1);
      expect(analysis.finalYield).toBeCloseTo(76, 0);
      expect(analysis.costPerUsableUnit).toBeCloseTo(197.37, 1);
    });

    it('debe generar alerta cuando yield está bajo', async () => {
      const product = {
        name: 'Producto',
        purchaseWeight: 10,
        purchaseCost: 1000,
        processes: [
          { name: 'Proceso 1', wastePercentage: 10 },
          { name: 'Proceso 2', wastePercentage: 10 }
        ]
      };

      const analysis = await foodCostAgent.calculateYield(product);

      // 81% yield < 85% mínimo
      expect(analysis.alert).toBeDefined();
      expect(analysis.alert.type).toBe('warning');
    });
  });

  describe('Comparación de Proveedores', () => {
    it('debe comparar proveedores correctamente', async () => {
      const suppliers = [
        { name: 'Proveedor A', price: 100, quantity: 10, qualityRating: 4, deliveryReliability: 4, marketAvgPrice: 10 },
        { name: 'Proveedor B', price: 90, quantity: 10, qualityRating: 3, deliveryReliability: 5, marketAvgPrice: 10 }
      ];

      const comparison = await foodCostAgent.compareSuppliers('Tomate', suppliers);

      expect(comparison.suppliers.length).toBe(2);
      expect(comparison.recommendation).toBeDefined();
      expect(comparison.suppliers[0].pricePerUnit).toBeDefined();
    });

    it('debe calcular score de proveedor', () => {
      const supplier = {
        pricePerUnit: 10,
        marketAvgPrice: 10,
        qualityRating: 5,
        deliveryReliability: 5
      };

      const score = foodCostAgent._calculateSupplierScore(supplier);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(10);
    });
  });

  describe('Proyección de Food Cost', () => {
    it('debe proyectar food cost correctamente', async () => {
      const params = {
        baseData: {
          currentFoodCost: 30000,
          monthlyRevenue: 100000
        },
        periods: 3,
        assumptions: {
          ingredientInflation: 5,
          revenueGrowth: 10,
          efficiencyImprovement: 2
        }
      };

      const projection = await foodCostAgent.projectFoodCost(params);

      expect(projection.periods.length).toBe(3);
      expect(projection.periods[0].projectedCost).toBeDefined();
      expect(projection.periods[0].foodCostPercentage).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Module Integration Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('Financial Module Integration', () => {
  describe('Factory Functions', () => {
    it('debe obtener CFO con getFinancialAgent(2)', () => {
      const agent = getFinancialAgent(2);
      expect(agent).toBeInstanceOf(CFOAgent);
    });

    it('debe obtener FoodCostAnalyst con getFinancialAgent(4)', () => {
      const agent = getFinancialAgent(4);
      expect(agent).toBeInstanceOf(FoodCostAnalystAgent);
    });

    it('debe retornar singleton (misma instancia)', () => {
      const agent1 = getFinancialAgent(2);
      const agent2 = getFinancialAgent(2);
      expect(agent1).toBe(agent2);
    });

    it('debe lanzar error para agente no válido', () => {
      expect(() => getFinancialAgent(99)).toThrow('Agente financiero 99 no existe');
    });

    it('debe obtener todos los agentes financieros', () => {
      const agents = getAllFinancialAgents();

      expect(agents[2]).toBeDefined();
      expect(agents[3]).toBeDefined();
      expect(agents[4]).toBeDefined();
      expect(agents[5]).toBeDefined();
      expect(agents[6]).toBeDefined();
      expect(agents[7]).toBeDefined();
    });
  });

  describe('FINANCIAL_AGENTS Registry', () => {
    it('debe contener todos los agentes financieros', () => {
      expect(Object.keys(FINANCIAL_AGENTS).length).toBe(6);
    });

    it('debe tener información correcta de CFO', () => {
      expect(FINANCIAL_AGENTS[2].name).toBe('CFO');
      expect(FINANCIAL_AGENTS[2].class).toBe('CFOAgent');
    });

    it('debe tener información correcta de FoodCostAnalyst', () => {
      expect(FINANCIAL_AGENTS[4].name).toBe('FoodCostAnalyst');
      expect(FINANCIAL_AGENTS[4].class).toBe('FoodCostAnalystAgent');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Edge Cases & Error Handling Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('Edge Cases & Error Handling', () => {
  describe('CFOAgent Edge Cases', () => {
    let cfoAgent;

    beforeEach(() => {
      cfoAgent = new CFOAgent();
    });

    it('debe manejar datos vacíos en análisis de liquidez', () => {
      const analysis = cfoAgent._analyzeLiquidity({});

      expect(analysis.currentRatio.value).toBe(0);
      expect(analysis.workingCapital).toBe(0);
    });

    it('debe prevenir división por cero', () => {
      const data = { currentAssets: 100, currentLiabilities: 0 };
      const analysis = cfoAgent._analyzeLiquidity(data);

      expect(analysis.currentRatio.value).toBe(100);
    });

    it('debe lanzar error para forecast sin períodos válidos', async () => {
      const params = {
        baseData: { revenue: 100000 },
        periods: 0,
        growthAssumptions: {}
      };

      await expect(cfoAgent.createFinancialForecast(params))
        .rejects.toThrow('El forecast requiere al menos 1 período');
    });
  });

  describe('FoodCostAnalystAgent Edge Cases', () => {
    let foodCostAgent;

    beforeEach(() => {
      foodCostAgent = new FoodCostAnalystAgent();
    });

    it('debe manejar receta sin ingredientes', async () => {
      const recipe = {
        name: 'Empty Recipe',
        portions: 1,
        sellingPrice: 100,
        ingredients: []
      };

      const costSheet = await foodCostAgent.createCostSheet(recipe);

      expect(costSheet.totalCost).toBe(0);
      expect(costSheet.costPerPortion).toBe(0);
    });

    it('debe manejar menú sin items', async () => {
      const analysis = await foodCostAgent.analyzeMenu([]);

      expect(analysis.totalItems).toBe(0);
      expect(analysis.summary.healthScore).toBe(0);
    });

    it('debe manejar análisis de mermas sin items', async () => {
      const wasteData = {
        period: '2024-01',
        totalPurchases: 100000,
        items: []
      };

      const analysis = await foodCostAgent.analyzeWaste(wasteData);

      expect(analysis.totalWasteValue).toBe(0);
      expect(analysis.wastePercentage).toBe(0);
    });

    it('debe manejar producto sin procesos en yield', async () => {
      const product = {
        name: 'Simple',
        purchaseWeight: 10,
        purchaseCost: 100,
        processes: []
      };

      const analysis = await foodCostAgent.calculateYield(product);

      expect(analysis.finalYield).toBe(100);
      expect(analysis.costPerUsableUnit).toBe(10);
    });
  });
});
