/**
 * PRUEBAS UNITARIAS - AGENTES DE COCINA
 * Vértice Gastronómico - Test Suite Completa
 *
 * Cobertura:
 * - ExecChefAgent: Menús, recetas, menu engineering
 * - Módulo completo: Factory functions, exports, categorías
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

import { ExecChefAgent } from '../agents/ExecChefAgent.js';
import {
  getKitchenAgent,
  getAllKitchenAgents,
  KITCHEN_AGENTS,
  KITCHEN_CATEGORIES
} from '../index.js';

// ═══════════════════════════════════════════════════════════════════════════
// ExecChefAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('ExecChefAgent', () => {
  let chefAgent;

  beforeEach(() => {
    chefAgent = new ExecChefAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID correcto', () => {
      expect(chefAgent.id).toBe(26);
    });

    it('debe tener nombre correcto', () => {
      expect(chefAgent.nombre).toBe('Chef Ejecutivo');
    });

    it('debe pertenecer a categoría CULINARIO', () => {
      expect(chefAgent.categoria).toBe('CULINARIO');
    });

    it('debe inicializar maps vacíos', () => {
      expect(chefAgent.recipes).toBeInstanceOf(Map);
      expect(chefAgent.menus).toBeInstanceOf(Map);
    });
  });

  describe('Creación de Menú', () => {
    it('debe crear menú correctamente', async () => {
      const params = {
        name: 'Menú Degustación Primavera',
        type: 'tasting',
        season: 'primavera',
        targetFoodCost: 25
      };

      const menu = await chefAgent.createMenu(params);

      expect(menu.id).toMatch(/^menu_/);
      expect(menu.name).toBe('Menú Degustación Primavera');
      expect(menu.type).toBe('tasting');
      expect(menu.season).toBe('primavera');
      expect(menu.targetFoodCost).toBe(25);
      expect(menu.status).toBe('draft');
      expect(menu.sections).toEqual([]);
    });

    it('debe usar food cost por defecto de 28%', async () => {
      const params = {
        name: 'Test Menu',
        type: 'dinner'
      };

      const menu = await chefAgent.createMenu(params);

      expect(menu.targetFoodCost).toBe(28);
    });

    it('debe guardar menú en Map', async () => {
      const params = { name: 'Test', type: 'lunch' };
      const menu = await chefAgent.createMenu(params);

      expect(chefAgent.menus.has(menu.id)).toBe(true);
    });
  });

  describe('Secciones de Menú', () => {
    let menu;

    beforeEach(async () => {
      menu = await chefAgent.createMenu({ name: 'Test', type: 'dinner' });
    });

    it('debe agregar sección al menú', async () => {
      const section = await chefAgent.addMenuSection(menu.id, {
        name: 'Entradas',
        description: 'Para comenzar'
      });

      expect(section.id).toMatch(/^section_/);
      expect(section.name).toBe('Entradas');
      expect(section.displayOrder).toBe(1);
      expect(section.items).toEqual([]);
    });

    it('debe incrementar displayOrder para cada sección', async () => {
      await chefAgent.addMenuSection(menu.id, { name: 'Entradas' });
      const section2 = await chefAgent.addMenuSection(menu.id, { name: 'Platos Fuertes' });

      expect(section2.displayOrder).toBe(2);
    });

    it('debe lanzar error si menú no existe', async () => {
      await expect(
        chefAgent.addMenuSection('invalid_id', { name: 'Test' })
      ).rejects.toThrow('Menú no encontrado');
    });
  });

  describe('Items de Menú', () => {
    let menu;
    let section;

    beforeEach(async () => {
      menu = await chefAgent.createMenu({ name: 'Test', type: 'dinner' });
      section = await chefAgent.addMenuSection(menu.id, { name: 'Entradas' });
    });

    it('debe agregar item al menú', async () => {
      const item = await chefAgent.addMenuItem(menu.id, section.id, {
        name: 'Ceviche de Camarón',
        description: 'Camarones frescos marinados',
        price: 220,
        cost: 55,
        allergens: ['mariscos'],
        dietary: ['sin gluten'],
        calories: 280,
        prepTime: 15
      });

      expect(item.id).toMatch(/^item_/);
      expect(item.name).toBe('Ceviche de Camarón');
      expect(item.foodCost).toBe(25); // (55/220)*100
      expect(item.contributionMargin).toBe(165); // 220 - 55
    });

    it('debe calcular food cost correctamente', async () => {
      const item = await chefAgent.addMenuItem(menu.id, section.id, {
        name: 'Test',
        price: 100,
        cost: 30
      });

      expect(item.foodCost).toBe(30);
    });

    it('debe actualizar métricas del menú', async () => {
      await chefAgent.addMenuItem(menu.id, section.id, {
        name: 'Item 1',
        price: 100,
        cost: 25
      });

      await chefAgent.addMenuItem(menu.id, section.id, {
        name: 'Item 2',
        price: 200,
        cost: 60
      });

      const updatedMenu = chefAgent.menus.get(menu.id);

      expect(updatedMenu.metrics.itemCount).toBe(2);
      expect(updatedMenu.metrics.avgFoodCost).toBe(27.5); // (25 + 30) / 2
    });

    it('debe lanzar error si sección no existe', async () => {
      await expect(
        chefAgent.addMenuItem(menu.id, 'invalid_section', { name: 'Test' })
      ).rejects.toThrow('Sección no encontrada');
    });
  });

  describe('Creación de Recetas', () => {
    it('debe crear receta correctamente', async () => {
      const params = {
        name: 'Risotto de Hongos',
        category: 'Platos Fuertes',
        servings: 4,
        ingredients: [
          { name: 'Arroz Arborio', quantity: 400, unit: 'g', unitCost: 0.08 },
          { name: 'Hongos', quantity: 300, unit: 'g', unitCost: 0.15 },
          { name: 'Caldo', quantity: 1.5, unit: 'L', unitCost: 25 }
        ],
        instructions: [
          { instruction: 'Sofreír hongos', timeMinutes: 5 },
          { instruction: 'Agregar arroz y tostar', timeMinutes: 3 },
          { instruction: 'Agregar caldo gradualmente', timeMinutes: 18 }
        ]
      };

      const recipe = await chefAgent.createRecipe(params);

      expect(recipe.id).toMatch(/^recipe_/);
      expect(recipe.name).toBe('Risotto de Hongos');
      expect(recipe.servings).toBe(4);
      expect(recipe.ingredients.length).toBe(3);
      expect(recipe.instructions.length).toBe(3);
      expect(recipe.totalPrepTime).toBe(26);
    });

    it('debe calcular costo total correctamente', async () => {
      const params = {
        name: 'Test Recipe',
        servings: 2,
        ingredients: [
          { name: 'A', quantity: 10, unit: 'kg', unitCost: 5 },
          { name: 'B', quantity: 5, unit: 'kg', unitCost: 10 }
        ],
        instructions: []
      };

      const recipe = await chefAgent.createRecipe(params);

      expect(recipe.totalCost).toBe(100); // (10*5) + (5*10)
      expect(recipe.costPerServing).toBe(50); // 100/2
    });

    it('debe calcular cantidad ajustada por yield', async () => {
      const params = {
        name: 'Test',
        servings: 1,
        ingredients: [
          { name: 'Carne', quantity: 1000, unit: 'g', unitCost: 0.1, yieldPercentage: 80 }
        ],
        instructions: []
      };

      const recipe = await chefAgent.createRecipe(params);

      expect(recipe.ingredients[0].yieldAdjustedQuantity).toBe(1250);
    });

    it('debe numerar instrucciones correctamente', async () => {
      const params = {
        name: 'Test',
        servings: 1,
        ingredients: [],
        instructions: [
          { instruction: 'Paso 1' },
          { instruction: 'Paso 2' },
          { instruction: 'Paso 3' }
        ]
      };

      const recipe = await chefAgent.createRecipe(params);

      expect(recipe.instructions[0].step).toBe(1);
      expect(recipe.instructions[1].step).toBe(2);
      expect(recipe.instructions[2].step).toBe(3);
    });
  });

  describe('Escalado de Recetas', () => {
    let recipe;

    beforeEach(async () => {
      recipe = await chefAgent.createRecipe({
        name: 'Base Recipe',
        servings: 4,
        ingredients: [
          { name: 'Ingrediente', quantity: 100, unit: 'g', unitCost: 0.1, lineCost: 10, yieldAdjustedQuantity: 100 }
        ],
        instructions: []
      });
    });

    it('debe escalar receta correctamente', async () => {
      const scaled = await chefAgent.scaleRecipe(recipe.id, 8);

      expect(scaled.servings).toBe(8);
      expect(scaled.scaleFactor).toBe(2);
      expect(scaled.ingredients[0].quantity).toBe(200);
      expect(scaled.totalCost).toBe(20);
    });

    it('debe escalar hacia abajo', async () => {
      const scaled = await chefAgent.scaleRecipe(recipe.id, 2);

      expect(scaled.servings).toBe(2);
      expect(scaled.scaleFactor).toBe(0.5);
      expect(scaled.ingredients[0].quantity).toBe(50);
    });

    it('debe mantener referencia a receta original', async () => {
      const scaled = await chefAgent.scaleRecipe(recipe.id, 8);

      expect(scaled.scaledFrom).toBe(recipe.id);
    });

    it('debe lanzar error si receta no existe', async () => {
      await expect(
        chefAgent.scaleRecipe('invalid_id', 8)
      ).rejects.toThrow('Receta no encontrada');
    });
  });

  describe('Menu Engineering', () => {
    it('debe realizar análisis de ingeniería de menú', async () => {
      const salesData = [
        { name: 'Star Item', contributionMargin: 150, unitsSold: 100 },
        { name: 'Plow Horse', contributionMargin: 50, unitsSold: 120 },
        { name: 'Puzzle', contributionMargin: 180, unitsSold: 30 },
        { name: 'Dog', contributionMargin: 40, unitsSold: 20 }
      ];

      const analysis = await chefAgent.performMenuEngineering(salesData);

      expect(analysis.avgContributionMargin).toBeDefined();
      expect(analysis.avgPopularity).toBeDefined();
      expect(analysis.categories.stars).toBeDefined();
      expect(analysis.categories.plowHorses).toBeDefined();
      expect(analysis.categories.puzzles).toBeDefined();
      expect(analysis.categories.dogs).toBeDefined();
    });

    it('debe clasificar STARS correctamente', async () => {
      const salesData = [
        { name: 'Star', contributionMargin: 200, unitsSold: 200 },
        { name: 'Average', contributionMargin: 50, unitsSold: 50 }
      ];

      const analysis = await chefAgent.performMenuEngineering(salesData);

      expect(analysis.categories.stars.some(i => i.name === 'Star')).toBe(true);
    });

    it('debe generar recomendaciones para PLOW_HORSES', async () => {
      const salesData = [
        { name: 'High Sales Low Margin', contributionMargin: 30, unitsSold: 200 },
        { name: 'Average', contributionMargin: 100, unitsSold: 50 }
      ];

      const analysis = await chefAgent.performMenuEngineering(salesData);

      expect(analysis.recommendations.some(r => r.action === 'OPTIMIZAR COSTO')).toBe(true);
    });

    it('debe generar recomendaciones para PUZZLES', async () => {
      const salesData = [
        { name: 'High Margin Low Sales', contributionMargin: 200, unitsSold: 10 },
        { name: 'Average', contributionMargin: 50, unitsSold: 100 }
      ];

      const analysis = await chefAgent.performMenuEngineering(salesData);

      expect(analysis.recommendations.some(r => r.action === 'PROMOVER')).toBe(true);
    });

    it('debe generar recomendaciones para DOGS', async () => {
      const salesData = [
        { name: 'Bad Item', contributionMargin: 10, unitsSold: 5 },
        { name: 'Good Item', contributionMargin: 100, unitsSold: 100 }
      ];

      const analysis = await chefAgent.performMenuEngineering(salesData);

      expect(analysis.recommendations.some(r => r.action === 'ELIMINAR O REFORMULAR')).toBe(true);
    });
  });

  describe('Programación de Cocina', () => {
    it('debe crear schedule de cocina', async () => {
      const params = {
        date: '2024-01-15',
        shifts: [
          { name: 'Mañana', startTime: '07:00', endTime: '15:00' },
          { name: 'Noche', startTime: '15:00', endTime: '23:00' }
        ],
        stations: [
          { name: 'Caliente' },
          { name: 'Frío' },
          { name: 'Pastelería' }
        ]
      };

      const schedule = await chefAgent.createKitchenSchedule(params);

      expect(schedule.id).toMatch(/^schedule_/);
      expect(schedule.date).toBe('2024-01-15');
      expect(schedule.shifts.length).toBe(2);
      expect(schedule.shifts[0].assignments.length).toBe(3);
    });
  });

  describe('Lista de Prep', () => {
    it('debe crear prep list basada en covers', async () => {
      const params = {
        date: '2024-01-15',
        expectedCovers: 100,
        menuItems: [
          { name: 'Ceviche', popularityRate: 0.3, unit: 'porciones', station: 'Frío', prepTime: 10 },
          { name: 'Filete', popularityRate: 0.4, unit: 'porciones', station: 'Caliente', prepTime: 5 }
        ]
      };

      const prepList = await chefAgent.createPrepList(params);

      expect(prepList.id).toMatch(/^prep_/);
      expect(prepList.expectedCovers).toBe(100);
      expect(prepList.items.length).toBe(2);
    });

    it('debe calcular cantidad de prep con buffer del 20%', async () => {
      const params = {
        date: '2024-01-15',
        expectedCovers: 100,
        menuItems: [
          { name: 'Item', popularityRate: 0.5, unit: 'porciones' }
        ]
      };

      const prepList = await chefAgent.createPrepList(params);

      // 100 * 0.5 = 50 pedidos esperados
      // 50 * 1.2 = 60 prep quantity
      expect(prepList.items[0].expectedOrders).toBe(50);
      expect(prepList.items[0].prepQuantity).toBe(60);
    });

    it('debe ordenar prep list por prioridad', async () => {
      const params = {
        date: '2024-01-15',
        expectedCovers: 100,
        menuItems: [
          { name: 'Low', popularityRate: 0.1, priority: 'low', prepTime: 5 },
          { name: 'High', popularityRate: 0.1, priority: 'high', prepTime: 5 },
          { name: 'Normal', popularityRate: 0.1, priority: 'normal', prepTime: 5 }
        ]
      };

      const prepList = await chefAgent.createPrepList(params);

      expect(prepList.items[0].name).toBe('High');
      expect(prepList.items[1].name).toBe('Normal');
      expect(prepList.items[2].name).toBe('Low');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Module Integration Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('Kitchen Module Integration', () => {
  describe('Factory Functions', () => {
    it('debe obtener ExecChef con getKitchenAgent(26)', () => {
      const agent = getKitchenAgent(26);
      expect(agent).toBeInstanceOf(ExecChefAgent);
    });

    it('debe retornar singleton (misma instancia)', () => {
      const agent1 = getKitchenAgent(26);
      const agent2 = getKitchenAgent(26);
      expect(agent1).toBe(agent2);
    });

    it('debe lanzar error para agente no válido', () => {
      expect(() => getKitchenAgent(99)).toThrow('Agente kitchen 99 no existe');
    });

    it('debe obtener todos los agentes de cocina', () => {
      const agents = getAllKitchenAgents();

      expect(agents[26]).toBeDefined();
      expect(agents[27]).toBeDefined();
      expect(agents[28]).toBeDefined();
      expect(agents[29]).toBeDefined();
      expect(agents[30]).toBeDefined();
      expect(agents[31]).toBeDefined();
      expect(agents[32]).toBeDefined();
      expect(agents[33]).toBeDefined();
    });
  });

  describe('KITCHEN_AGENTS Registry', () => {
    it('debe contener todos los agentes de cocina', () => {
      expect(Object.keys(KITCHEN_AGENTS).length).toBe(8);
    });

    it('debe tener información correcta de ExecChef', () => {
      expect(KITCHEN_AGENTS[26].name).toBe('Chef Ejecutivo');
      expect(KITCHEN_AGENTS[26].shortName).toBe('EXEC_CHEF');
      expect(KITCHEN_AGENTS[26].class).toBe('ExecChefAgent');
    });

    it('debe tener información correcta de Sommelier', () => {
      expect(KITCHEN_AGENTS[31].name).toBe('Sommelier');
      expect(KITCHEN_AGENTS[31].shortName).toBe('SOMMELIER');
    });
  });

  describe('KITCHEN_CATEGORIES', () => {
    it('debe tener categoría LEADERSHIP', () => {
      expect(KITCHEN_CATEGORIES.LEADERSHIP).toEqual([26, 27]);
    });

    it('debe tener categoría PRODUCTION', () => {
      expect(KITCHEN_CATEGORIES.PRODUCTION).toEqual([28, 29, 30]);
    });

    it('debe tener categoría BEVERAGE', () => {
      expect(KITCHEN_CATEGORIES.BEVERAGE).toEqual([31, 32, 33]);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Edge Cases & Error Handling Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('Edge Cases & Error Handling', () => {
  let chefAgent;

  beforeEach(() => {
    chefAgent = new ExecChefAgent();
  });

  it('debe manejar receta sin ingredientes', async () => {
    const recipe = await chefAgent.createRecipe({
      name: 'Empty Recipe',
      servings: 1,
      ingredients: [],
      instructions: []
    });

    expect(recipe.totalCost).toBe(0);
    expect(recipe.costPerServing).toBe(0);
    expect(recipe.totalPrepTime).toBe(0);
  });

  it('debe manejar menu engineering con un solo item', async () => {
    const salesData = [
      { name: 'Single Item', contributionMargin: 100, unitsSold: 50 }
    ];

    const analysis = await chefAgent.performMenuEngineering(salesData);

    expect(analysis.avgContributionMargin).toBe(100);
    expect(analysis.avgPopularity).toBe(50);
  });

  it('debe manejar prep list sin menu items', async () => {
    const prepList = await chefAgent.createPrepList({
      date: '2024-01-15',
      expectedCovers: 100,
      menuItems: []
    });

    expect(prepList.items.length).toBe(0);
  });

  it('debe manejar item sin popularity rate', async () => {
    const prepList = await chefAgent.createPrepList({
      date: '2024-01-15',
      expectedCovers: 100,
      menuItems: [
        { name: 'Item without rate' }
      ]
    });

    // Default popularity rate de 0.1
    expect(prepList.items[0].expectedOrders).toBe(10);
  });

  it('debe actualizar métricas correctamente con menú vacío', () => {
    const emptyMenu = {
      sections: [],
      metrics: {}
    };

    chefAgent._updateMenuMetrics(emptyMenu);

    expect(emptyMenu.metrics.avgFoodCost).toBe(0);
    expect(emptyMenu.metrics.avgContributionMargin).toBe(0);
    expect(emptyMenu.metrics.itemCount).toBe(0);
  });
});
