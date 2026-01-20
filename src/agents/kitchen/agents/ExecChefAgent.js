/**
 * ExecChefAgent - Chef Ejecutivo
 * Agente #26 - Líder culinario con visión creativa
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class ExecChefAgent extends UniversalAgent {
  constructor() {
    super({
      id: 26,
      emoji: '👨‍🍳',
      nombre: 'Chef Ejecutivo',
      nombreCorto: 'EXEC_CHEF',
      categoria: 'CULINARIO',
      experiencia: { años: 15, rango: '15+ años' },
      descripcion: 'Líder culinario con visión creativa y expertise en gestión de cocinas de alto volumen.',
      perfil: {
        formacion: 'Licenciatura en Gastronomía + Formación internacional',
        certificaciones: ['CMC/CEC', 'ServSafe Manager', 'Sommelier Level 2', 'Pastry Arts'],
        competencias: ['Menu development', 'Kitchen management', 'Food costing', 'Team development', 'Culinary creativity', 'Quality standards'],
        herramientas: ['ChefTec', 'meez', 'Galley Solutions', 'MarketMan', 'Recipe costing software'],
        kpis: ['Food Cost %', 'Menu Engineering Score', 'Kitchen Labor Cost', 'Food Quality Score', 'New Menu Item Success Rate'],
        logros: ['Desarrollo de 15 conceptos culinarios exitosos', 'Reducción de food cost de 35% a 28%', 'Formación de 50+ chefs que lideran sus propias cocinas'],
        metodologias: ['Brigade de Cuisine', 'Mise en Place', 'Menu Engineering', 'Flavor Profiling']
      },
      triggers: ['menú', 'recetas', 'cocina', 'platos', 'sabores', 'creatividad culinaria'],
      delegaA: [27, 28, 29, 30, 31]
    });

    this.recipes = new Map();
    this.menus = new Map();
  }

  // ============ DESARROLLO DE MENÚ ============

  async createMenu(params) {
    const { name, type, season, targetFoodCost = 28 } = params;

    this.emitEvent('menu_creation_started', { name, type });

    const menu = {
      id: `menu_${Date.now()}`,
      name,
      type, // breakfast, lunch, dinner, tasting, special
      season,
      targetFoodCost,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      status: 'draft',
      sections: [],
      metrics: {
        avgFoodCost: 0,
        avgContributionMargin: 0,
        itemCount: 0
      }
    };

    this.menus.set(menu.id, menu);
    this.emitEvent('menu_created', { id: menu.id, name });

    return menu;
  }

  async addMenuSection(menuId, section) {
    const menu = this.menus.get(menuId);
    if (!menu) throw new Error(`Menú no encontrado: ${menuId}`);

    const newSection = {
      id: `section_${Date.now()}`,
      name: section.name,
      description: section.description,
      displayOrder: menu.sections.length + 1,
      items: []
    };

    menu.sections.push(newSection);
    return newSection;
  }

  async addMenuItem(menuId, sectionId, item) {
    const menu = this.menus.get(menuId);
    if (!menu) throw new Error(`Menú no encontrado: ${menuId}`);

    const section = menu.sections.find(s => s.id === sectionId);
    if (!section) throw new Error(`Sección no encontrada: ${sectionId}`);

    const menuItem = {
      id: `item_${Date.now()}`,
      name: item.name,
      description: item.description,
      price: item.price,
      cost: item.cost,
      foodCost: (item.cost / item.price) * 100,
      contributionMargin: item.price - item.cost,
      allergens: item.allergens || [],
      dietary: item.dietary || [], // vegetarian, vegan, gluten-free
      calories: item.calories,
      prepTime: item.prepTime,
      recipeId: item.recipeId,
      isNew: item.isNew || false,
      isChefRecommendation: item.isChefRecommendation || false
    };

    section.items.push(menuItem);
    this._updateMenuMetrics(menu);

    return menuItem;
  }

  _updateMenuMetrics(menu) {
    let totalFoodCost = 0;
    let totalContributionMargin = 0;
    let itemCount = 0;

    for (const section of menu.sections) {
      for (const item of section.items) {
        totalFoodCost += item.foodCost;
        totalContributionMargin += item.contributionMargin;
        itemCount++;
      }
    }

    menu.metrics = {
      avgFoodCost: itemCount > 0 ? totalFoodCost / itemCount : 0,
      avgContributionMargin: itemCount > 0 ? totalContributionMargin / itemCount : 0,
      itemCount
    };
  }

  // ============ DESARROLLO DE RECETAS ============

  async createRecipe(params) {
    const { name, category, servings, ingredients, instructions } = params;

    this.emitEvent('recipe_creation_started', { name });

    // Calcular costo total
    let totalCost = 0;
    const processedIngredients = ingredients.map(ing => {
      const lineCost = ing.quantity * ing.unitCost;
      totalCost += lineCost;
      return {
        ...ing,
        lineCost,
        yieldAdjustedQuantity: ing.yieldPercentage
          ? ing.quantity / (ing.yieldPercentage / 100)
          : ing.quantity
      };
    });

    const recipe = {
      id: `recipe_${Date.now()}`,
      name,
      category,
      servings,
      ingredients: processedIngredients,
      instructions: instructions.map((inst, idx) => ({
        step: idx + 1,
        instruction: inst.instruction,
        timeMinutes: inst.timeMinutes,
        temperature: inst.temperature,
        tips: inst.tips
      })),
      totalCost,
      costPerServing: totalCost / servings,
      totalPrepTime: instructions.reduce((sum, i) => sum + (i.timeMinutes || 0), 0),
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      version: 1,
      status: 'active'
    };

    this.recipes.set(recipe.id, recipe);
    this.emitEvent('recipe_created', { id: recipe.id, name, costPerServing: recipe.costPerServing });

    return recipe;
  }

  async scaleRecipe(recipeId, newServings) {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) throw new Error(`Receta no encontrada: ${recipeId}`);

    const scaleFactor = newServings / recipe.servings;

    const scaledRecipe = {
      ...recipe,
      id: `recipe_${Date.now()}`,
      servings: newServings,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        quantity: ing.quantity * scaleFactor,
        yieldAdjustedQuantity: ing.yieldAdjustedQuantity * scaleFactor,
        lineCost: ing.lineCost * scaleFactor
      })),
      totalCost: recipe.totalCost * scaleFactor,
      scaledFrom: recipe.id,
      scaleFactor
    };

    return scaledRecipe;
  }

  // ============ INGENIERÍA DE MENÚ ============

  async performMenuEngineering(salesData) {
    this.emitEvent('menu_engineering_started', { itemCount: salesData.length });

    // Calcular promedios
    const avgContributionMargin = salesData.reduce((sum, item) =>
      sum + item.contributionMargin, 0) / salesData.length;
    const avgPopularity = salesData.reduce((sum, item) =>
      sum + item.unitsSold, 0) / salesData.length;

    // Clasificar items
    const analysis = {
      analyzedAt: new Date().toISOString(),
      analyzedBy: this.nombre,
      avgContributionMargin,
      avgPopularity,
      categories: {
        stars: [],      // Alto margen, alta popularidad
        plowHorses: [], // Bajo margen, alta popularidad
        puzzles: [],    // Alto margen, baja popularidad
        dogs: []        // Bajo margen, baja popularidad
      },
      recommendations: []
    };

    for (const item of salesData) {
      const highMargin = item.contributionMargin >= avgContributionMargin;
      const highPopularity = item.unitsSold >= avgPopularity;

      const classification = {
        ...item,
        marginVsAvg: ((item.contributionMargin - avgContributionMargin) / avgContributionMargin * 100).toFixed(1),
        popularityVsAvg: ((item.unitsSold - avgPopularity) / avgPopularity * 100).toFixed(1)
      };

      if (highMargin && highPopularity) {
        classification.category = 'star';
        analysis.categories.stars.push(classification);
      } else if (!highMargin && highPopularity) {
        classification.category = 'plowHorse';
        analysis.categories.plowHorses.push(classification);
        analysis.recommendations.push({
          item: item.name,
          action: 'OPTIMIZAR COSTO',
          detail: 'Reducir tamaño de porción o sustituir ingredientes costosos'
        });
      } else if (highMargin && !highPopularity) {
        classification.category = 'puzzle';
        analysis.categories.puzzles.push(classification);
        analysis.recommendations.push({
          item: item.name,
          action: 'PROMOVER',
          detail: 'Destacar en menú, capacitar meseros, ofrecer como recomendación'
        });
      } else {
        classification.category = 'dog';
        analysis.categories.dogs.push(classification);
        analysis.recommendations.push({
          item: item.name,
          action: 'ELIMINAR O REFORMULAR',
          detail: 'Considerar remover del menú o rediseñar completamente'
        });
      }
    }

    this.emitEvent('menu_engineering_completed', {
      stars: analysis.categories.stars.length,
      dogs: analysis.categories.dogs.length
    });

    return analysis;
  }

  // ============ GESTIÓN DE COCINA ============

  async createKitchenSchedule(params) {
    const { date, shifts, stations } = params;

    const schedule = {
      id: `schedule_${Date.now()}`,
      date,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      shifts: shifts.map(shift => ({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        assignments: stations.map(station => ({
          station: station.name,
          assignedTo: null,
          notes: ''
        }))
      }))
    };

    return schedule;
  }

  async createPrepList(params) {
    const { date, expectedCovers, menuItems } = params;

    const prepList = {
      id: `prep_${Date.now()}`,
      date,
      expectedCovers,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      items: [],
      status: 'pending'
    };

    // Calcular prep basado en covers esperados
    for (const item of menuItems) {
      const expectedOrders = Math.ceil(expectedCovers * (item.popularityRate || 0.1));

      prepList.items.push({
        name: item.name,
        expectedOrders,
        prepQuantity: Math.ceil(expectedOrders * 1.2), // 20% buffer
        unit: item.unit,
        station: item.station,
        prepTime: item.prepTime,
        priority: item.priority || 'normal',
        completed: false,
        completedBy: null,
        completedAt: null
      });
    }

    // Ordenar por prioridad y tiempo de prep
    prepList.items.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return (priorityOrder[a.priority] - priorityOrder[b.priority]) || (b.prepTime - a.prepTime);
    });

    return prepList;
  }

  // ============ REPORTES Y DOCUMENTOS ============

  async generateMenuDocument(menuId) {
    const menu = this.menus.get(menuId);
    if (!menu) throw new Error(`Menú no encontrado: ${menuId}`);

    return this.generateDocument('pdf', {
      title: menu.name,
      subtitle: `${menu.type} - ${menu.season}`,
      sections: menu.sections.map(section => ({
        title: section.name,
        description: section.description,
        items: section.items.map(item => ({
          name: item.name,
          description: item.description,
          price: `$${item.price.toFixed(2)}`,
          dietary: item.dietary.join(', '),
          isNew: item.isNew,
          isChefRecommendation: item.isChefRecommendation
        }))
      })),
      footer: `Creado por ${this.nombre}`
    }, { type: 'menu' });
  }

  async generateRecipeCard(recipeId) {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) throw new Error(`Receta no encontrada: ${recipeId}`);

    return this.generateDocument('pdf', {
      title: recipe.name,
      summary: `${recipe.servings} porciones | Costo: $${recipe.costPerServing.toFixed(2)}/porción`,
      metrics: [
        { name: 'Porciones', value: recipe.servings },
        { name: 'Tiempo Total', value: recipe.totalPrepTime, unit: ' min' },
        { name: 'Costo por Porción', value: recipe.costPerServing.toFixed(2), prefix: '$' }
      ],
      sections: [
        {
          title: 'Ingredientes',
          content: recipe.ingredients.map(ing =>
            `${ing.quantity} ${ing.unit} ${ing.name} - $${ing.lineCost.toFixed(2)}`
          ).join('\n')
        },
        {
          title: 'Procedimiento',
          content: recipe.instructions.map(inst =>
            `${inst.step}. ${inst.instruction}${inst.timeMinutes ? ` (${inst.timeMinutes} min)` : ''}`
          ).join('\n')
        }
      ]
    }, { type: 'recipe' });
  }

  async exportRecipesToExcel() {
    const recipes = Array.from(this.recipes.values());

    const data = recipes.map(recipe => ({
      Nombre: recipe.name,
      Categoría: recipe.category,
      Porciones: recipe.servings,
      'Costo Total': recipe.totalCost,
      'Costo/Porción': recipe.costPerServing,
      'Tiempo Prep (min)': recipe.totalPrepTime,
      'Num Ingredientes': recipe.ingredients.length,
      Estado: recipe.status
    }));

    return this.generateDocument('excel', data, {
      title: 'Catálogo de Recetas',
      sheetName: 'Recetas'
    });
  }
}

export default ExecChefAgent;
