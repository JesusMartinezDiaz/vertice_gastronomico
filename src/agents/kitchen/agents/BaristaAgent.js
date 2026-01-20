/**
 * BaristaAgent - Barista
 * Agente #33 - Especialista en café de especialidad
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class BaristaAgent extends UniversalAgent {
  constructor() {
    super({
      id: 33,
      emoji: '☕',
      nombre: 'Barista',
      nombreCorto: 'BARISTA',
      categoria: 'CULINARIO',
      experiencia: { años: 3, rango: '3+ años' },
      descripcion: 'Especialista en café de especialidad y técnicas de preparación.',
      perfil: {
        formacion: 'Certificación en café de especialidad',
        certificaciones: ['SCA Barista Skills', 'Latte Art Certified', 'Coffee Cupping'],
        competencias: ['Espresso extraction', 'Milk texturing', 'Latte art', 'Coffee knowledge', 'Equipment maintenance', 'Guest service'],
        herramientas: ['Espresso machines', 'Grinders', 'Brewing equipment', 'POS systems'],
        kpis: ['Coffee Sales', 'Drink Consistency', 'Speed of Service', 'Guest Feedback', 'Waste Reduction'],
        logros: ['Certificación SCA Intermediate', 'Implementación de programa de café de origen', 'Consistencia en extracción del 95%'],
        metodologias: ['Dial-In Process', 'Milk Steaming Technique', 'Latte Art Practice', 'Taste Testing']
      },
      triggers: ['café', 'espresso', 'latte', 'barista', 'cafetería'],
      delegaA: []
    });

    this.coffeeMenu = new Map();
    this.extractionLog = [];
    this.equipmentLog = [];
    this.EXTRACTION_STANDARDS = {
      espresso: {
        dose: { min: 18, max: 20, unit: 'g' },
        yield: { min: 36, max: 40, unit: 'g' },
        time: { min: 25, max: 30, unit: 's' },
        ratio: '1:2'
      },
      ristretto: {
        dose: { min: 18, max: 20, unit: 'g' },
        yield: { min: 27, max: 30, unit: 'g' },
        time: { min: 20, max: 25, unit: 's' },
        ratio: '1:1.5'
      },
      lungo: {
        dose: { min: 18, max: 20, unit: 'g' },
        yield: { min: 54, max: 60, unit: 'g' },
        time: { min: 35, max: 45, unit: 's' },
        ratio: '1:3'
      }
    };
  }

  // ============ MENÚ DE CAFÉ ============

  async createCoffeeMenu(params) {
    const { name, style } = params;

    const menu = {
      id: `coffee_menu_${Date.now()}`,
      name,
      style, // specialty, classic, seasonal
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      categories: [
        { name: 'Espresso', items: [] },
        { name: 'Leche', items: [] },
        { name: 'Filtrado', items: [] },
        { name: 'Frío', items: [] },
        { name: 'Especialidades', items: [] }
      ],
      totalItems: 0,
      status: 'draft'
    };

    return menu;
  }

  async addCoffeeItem(menuId, categoryName, item) {
    const coffeeItem = {
      id: `coffee_${Date.now()}`,
      name: item.name,
      description: item.description,
      sizes: item.sizes || [{ name: 'Regular', oz: 8 }],
      prices: item.prices || {},
      ingredients: item.ingredients || [],
      caffeineLevel: item.caffeineLevel || 'medium', // low, medium, high, decaf
      calories: item.calories,
      cost: this._calculateCoffeeCost(item),
      isSignature: item.isSignature || false,
      isSeasonal: item.isSeasonal || false,
      allergens: item.allergens || [],
      customizable: item.customizable !== false
    };

    this.coffeeMenu.set(coffeeItem.id, coffeeItem);
    return coffeeItem;
  }

  _calculateCoffeeCost(item) {
    let cost = 0;
    const ingredientCosts = {
      espresso_shot: 0.35,
      milk_8oz: 0.25,
      oat_milk_8oz: 0.50,
      almond_milk_8oz: 0.45,
      vanilla_syrup: 0.15,
      caramel_syrup: 0.15,
      chocolate_sauce: 0.20,
      whipped_cream: 0.15
    };

    for (const ing of (item.ingredients || [])) {
      cost += ingredientCosts[ing] || 0.10;
    }

    return cost;
  }

  // ============ EXTRACCIÓN DE ESPRESSO ============

  async dialInEspresso(params) {
    const { beanName, roastDate, grinder, initialSettings } = params;

    this.emitEvent('dial_in_started', { bean: beanName });

    const dialIn = {
      id: `dialin_${Date.now()}`,
      beanName,
      roastDate,
      roastAge: Math.floor((Date.now() - new Date(roastDate)) / 86400000),
      grinder,
      performedBy: this.nombre,
      performedAt: new Date().toISOString(),
      shots: [],
      finalSettings: null,
      status: 'in_progress'
    };

    // Registrar shot inicial
    if (initialSettings) {
      dialIn.shots.push({
        shotNumber: 1,
        dose: initialSettings.dose,
        grindSetting: initialSettings.grindSetting,
        yield: null,
        time: null,
        notes: 'Shot inicial'
      });
    }

    return dialIn;
  }

  async logExtractionShot(dialInId, shot) {
    const standard = this.EXTRACTION_STANDARDS[shot.type || 'espresso'];

    const extraction = {
      dialInId,
      shotNumber: shot.shotNumber,
      dose: shot.dose,
      yield: shot.yield,
      time: shot.time,
      grindSetting: shot.grindSetting,
      ratio: (shot.yield / shot.dose).toFixed(2),
      recordedAt: new Date().toISOString(),
      inSpec: true,
      adjustments: []
    };

    // Verificar especificaciones
    if (shot.dose < standard.dose.min || shot.dose > standard.dose.max) {
      extraction.inSpec = false;
      extraction.adjustments.push(`Ajustar dosis a ${standard.dose.min}-${standard.dose.max}g`);
    }

    if (shot.yield < standard.yield.min || shot.yield > standard.yield.max) {
      extraction.inSpec = false;
      if (shot.yield < standard.yield.min) {
        extraction.adjustments.push('Molienda más gruesa o aumentar tiempo');
      } else {
        extraction.adjustments.push('Molienda más fina o reducir tiempo');
      }
    }

    if (shot.time < standard.time.min || shot.time > standard.time.max) {
      extraction.inSpec = false;
      if (shot.time < standard.time.min) {
        extraction.adjustments.push('Molienda más fina');
      } else {
        extraction.adjustments.push('Molienda más gruesa');
      }
    }

    this.extractionLog.push(extraction);

    if (extraction.inSpec) {
      this.emitEvent('extraction_in_spec', {
        dose: shot.dose,
        yield: shot.yield,
        time: shot.time
      });
    }

    return extraction;
  }

  // ============ TEXTURIZADO DE LECHE ============

  async logMilkTexturing(params) {
    const { milkType, startTemp, endTemp, textureQuality, notes } = params;

    const standards = {
      'whole': { minTemp: 55, maxTemp: 65, idealTemp: 60 },
      'skim': { minTemp: 55, maxTemp: 65, idealTemp: 60 },
      'oat': { minTemp: 50, maxTemp: 60, idealTemp: 55 },
      'almond': { minTemp: 50, maxTemp: 60, idealTemp: 55 },
      'soy': { minTemp: 50, maxTemp: 60, idealTemp: 55 }
    };

    const standard = standards[milkType] || standards.whole;

    const log = {
      id: `milk_${Date.now()}`,
      milkType,
      startTemp,
      endTemp,
      textureQuality, // 1-10
      recordedBy: this.nombre,
      recordedAt: new Date().toISOString(),
      tempInRange: endTemp >= standard.minTemp && endTemp <= standard.maxTemp,
      notes,
      recommendations: []
    };

    if (endTemp > standard.maxTemp) {
      log.recommendations.push('Temperatura alta - leche quemada. Reducir tiempo de vaporizado.');
    } else if (endTemp < standard.minTemp) {
      log.recommendations.push('Temperatura baja - bebida tibia. Aumentar tiempo de vaporizado.');
    }

    if (textureQuality < 7) {
      log.recommendations.push('Mejorar técnica de texturizado. Practicar posición de la lanza.');
    }

    return log;
  }

  // ============ MANTENIMIENTO DE EQUIPO ============

  async logEquipmentMaintenance(equipment, task) {
    const maintenanceSchedule = {
      'espresso_machine': {
        daily: ['Backflush con agua', 'Limpiar grupo', 'Purgar lanza de vapor'],
        weekly: ['Backflush con detergente', 'Limpiar canasta portafiltros'],
        monthly: ['Descalcificar', 'Revisar empaques']
      },
      'grinder': {
        daily: ['Purgar granos viejos', 'Limpiar tolva exterior'],
        weekly: ['Cepillar muelas', 'Limpiar dosificador'],
        monthly: ['Limpieza profunda de muelas', 'Verificar calibración']
      },
      'steam_wand': {
        daily: ['Purgar después de cada uso', 'Limpiar con paño húmedo'],
        weekly: ['Remojar punta en solución'],
        monthly: ['Revisar orificios de la punta']
      }
    };

    const log = {
      id: `maint_${Date.now()}`,
      equipment,
      task,
      frequency: this._getTaskFrequency(equipment, task, maintenanceSchedule),
      performedBy: this.nombre,
      performedAt: new Date().toISOString(),
      notes: '',
      nextDue: null
    };

    this.equipmentLog.push(log);
    return log;
  }

  _getTaskFrequency(equipment, task, schedule) {
    const equipmentTasks = schedule[equipment];
    if (!equipmentTasks) return 'unknown';

    for (const [freq, tasks] of Object.entries(equipmentTasks)) {
      if (tasks.some(t => t.toLowerCase().includes(task.toLowerCase()))) {
        return freq;
      }
    }
    return 'as_needed';
  }

  async getMaintenanceChecklist(equipment) {
    const checklists = {
      'espresso_machine': {
        opening: [
          { task: 'Encender máquina 30 min antes', completed: false },
          { task: 'Verificar presión de caldera', completed: false },
          { task: 'Purgar grupo con agua', completed: false },
          { task: 'Verificar nivel de agua', completed: false },
          { task: 'Limpiar bandeja de goteo', completed: false }
        ],
        closing: [
          { task: 'Backflush con agua (3 ciclos)', completed: false },
          { task: 'Limpiar y secar canastas', completed: false },
          { task: 'Limpiar lanza de vapor', completed: false },
          { task: 'Vaciar bandeja de goteo', completed: false },
          { task: 'Limpiar exterior de la máquina', completed: false }
        ]
      },
      'grinder': {
        opening: [
          { task: 'Purgar granos viejos (5g)', completed: false },
          { task: 'Verificar ajuste de molienda', completed: false },
          { task: 'Tirar shot de prueba', completed: false }
        ],
        closing: [
          { task: 'Vaciar tolva si café no es fresco', completed: false },
          { task: 'Cepillar salida de café', completed: false },
          { task: 'Limpiar exterior', completed: false }
        ]
      }
    };

    return {
      equipment,
      date: new Date().toISOString().split('T')[0],
      ...checklists[equipment]
    };
  }

  // ============ CONTROL DE CALIDAD ============

  async performCuppingSession(coffees) {
    this.emitEvent('cupping_started', { coffeeCount: coffees.length });

    const session = {
      id: `cupping_${Date.now()}`,
      date: new Date().toISOString(),
      performedBy: this.nombre,
      coffees: coffees.map(coffee => ({
        name: coffee.name,
        origin: coffee.origin,
        process: coffee.process,
        roaster: coffee.roaster,
        scores: {
          fragrance: null, // 6-10
          aroma: null,
          flavor: null,
          aftertaste: null,
          acidity: null,
          body: null,
          balance: null,
          sweetness: null,
          cleanCup: null,
          uniformity: null,
          overall: null
        },
        totalScore: null,
        notes: '',
        descriptors: []
      })),
      status: 'in_progress'
    };

    return session;
  }

  async scoreCoffee(sessionId, coffeeName, scores, notes, descriptors) {
    // Calcular score total SCA
    const scoreSum = Object.values(scores).reduce((sum, s) => sum + (s || 0), 0);
    const defects = 0; // En implementación real, calcular defectos

    const result = {
      coffeeName,
      scores,
      totalScore: scoreSum - defects,
      grade: this._getCoffeeGrade(scoreSum),
      notes,
      descriptors,
      scoredAt: new Date().toISOString()
    };

    return result;
  }

  _getCoffeeGrade(score) {
    if (score >= 90) return 'Outstanding';
    if (score >= 85) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 75) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Below Standard';
  }

  // ============ LATTE ART ============

  async logLatteArtPractice(practice) {
    const log = {
      id: `art_${Date.now()}`,
      design: practice.design, // heart, tulip, rosetta, swan, etc.
      successRate: practice.successRate, // %
      attempts: practice.attempts,
      successful: practice.successful,
      milkType: practice.milkType,
      notes: practice.notes,
      recordedBy: this.nombre,
      recordedAt: new Date().toISOString()
    };

    const designDifficulty = {
      'heart': 1,
      'tulip': 2,
      'rosetta': 3,
      'swan': 4,
      'phoenix': 5
    };

    log.difficulty = designDifficulty[practice.design] || 1;
    log.feedback = this._generateLatteArtFeedback(log);

    return log;
  }

  _generateLatteArtFeedback(log) {
    const feedback = [];

    if (log.successRate < 50) {
      feedback.push('Practicar más la técnica base antes de intentar diseños complejos.');
    }
    if (log.successRate < 70 && log.difficulty >= 3) {
      feedback.push('Considerar dominar diseños más simples primero.');
    }
    if (log.successRate >= 80) {
      feedback.push('Excelente consistencia. Intentar el siguiente nivel de dificultad.');
    }

    return feedback;
  }

  // ============ REPORTES ============

  async generateCoffeeReport(period) {
    const periodExtractions = this.extractionLog.filter(e =>
      e.recordedAt.startsWith(period)
    );

    const inSpecCount = periodExtractions.filter(e => e.inSpec).length;
    const avgTime = periodExtractions.reduce((sum, e) => sum + (e.time || 0), 0) / periodExtractions.length;

    const report = {
      period,
      generatedBy: this.nombre,
      generatedAt: new Date().toISOString(),
      totalExtractions: periodExtractions.length,
      inSpecRate: ((inSpecCount / periodExtractions.length) * 100).toFixed(1),
      avgExtractionTime: avgTime.toFixed(1),
      equipmentMaintenance: this.equipmentLog.filter(l => l.performedAt.startsWith(period)).length
    };

    return this.generateDocument('pdf', {
      title: `Reporte de Café - ${period}`,
      summary: `Generado por ${this.nombre}`,
      metrics: [
        { name: 'Extracciones Totales', value: report.totalExtractions },
        { name: 'En Especificación', value: report.inSpecRate, unit: '%' },
        { name: 'Tiempo Promedio', value: report.avgExtractionTime, unit: 's' },
        { name: 'Mantenimientos', value: report.equipmentMaintenance }
      ],
      sections: [
        {
          title: 'Estándares de Extracción',
          content: `Espresso: ${this.EXTRACTION_STANDARDS.espresso.dose.min}-${this.EXTRACTION_STANDARDS.espresso.dose.max}g dosis, ${this.EXTRACTION_STANDARDS.espresso.time.min}-${this.EXTRACTION_STANDARDS.espresso.time.max}s tiempo`
        }
      ]
    }, { type: 'report' });
  }

  async exportExtractionLog() {
    const data = this.extractionLog.map(e => ({
      Fecha: e.recordedAt.split('T')[0],
      Hora: e.recordedAt.split('T')[1].substring(0, 5),
      Dosis: e.dose,
      Yield: e.yield,
      Tiempo: e.time,
      Ratio: e.ratio,
      'En Spec': e.inSpec ? 'Sí' : 'No',
      Ajustes: e.adjustments.join('; ')
    }));

    return this.generateDocument('excel', data, {
      title: 'Log de Extracciones',
      sheetName: 'Extractions'
    });
  }
}

export default BaristaAgent;
