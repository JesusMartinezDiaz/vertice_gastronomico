/**
 * PrepCookAgent - Prep Cook / Steward
 * Agente #30 - Responsable de preparación e ingredientes
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class PrepCookAgent extends UniversalAgent {
  constructor() {
    super({
      id: 30,
      emoji: '🧅',
      nombre: 'Prep Cook / Steward',
      nombreCorto: 'PREP_COOK',
      categoria: 'CULINARIO',
      experiencia: { años: 1, rango: '1+ años' },
      descripcion: 'Responsable de preparación de ingredientes y limpieza de cocina.',
      perfil: {
        formacion: 'Capacitación en seguridad alimentaria básica',
        certificaciones: ['Food Handler Card', 'Safety Training'],
        competencias: ['Knife skills', 'Basic prep techniques', 'Sanitation', 'Organization', 'Equipment operation', 'Time management'],
        herramientas: ['Prep equipment', 'Cleaning supplies', 'Storage containers', 'Labels'],
        kpis: ['Prep Completion Rate', 'Sanitation Score', 'Waste Reduction', 'Accuracy'],
        logros: ['Consistente cumplimiento de prep list', 'Mejora continua en knife skills', 'Promoción a línea'],
        metodologias: ['Prep List Completion', 'FIFO', 'Clean as You Go', 'Batch Prep']
      },
      triggers: ['preparación', 'mise en place', 'limpieza', 'steward', 'prep'],
      delegaA: []
    });

    this.prepLists = new Map();
    this.wasteLog = [];
    this.labelLog = [];
  }

  // ============ GESTIÓN DE PREP LIST ============

  async createPrepList(params) {
    const { date, shift, items } = params;

    this.emitEvent('prep_list_created', { date, itemCount: items.length });

    const prepList = {
      id: `prep_${Date.now()}`,
      date,
      shift,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        method: item.method || 'standard',
        location: item.location, // walk-in, dry storage, etc.
        priority: item.priority || 'normal',
        estimatedTime: item.estimatedTime || 15,
        completed: false,
        completedQuantity: 0,
        completedBy: null,
        completedAt: null,
        notes: item.notes || ''
      })),
      totalEstimatedTime: items.reduce((sum, i) => sum + (i.estimatedTime || 15), 0),
      status: 'pending',
      completedItems: 0
    };

    // Ordenar por prioridad
    prepList.items.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    this.prepLists.set(prepList.id, prepList);
    return prepList;
  }

  async completePrepItem(prepListId, itemName, quantityCompleted, notes = '') {
    const prepList = this.prepLists.get(prepListId);
    if (!prepList) throw new Error(`Prep list no encontrada: ${prepListId}`);

    const item = prepList.items.find(i => i.name === itemName);
    if (!item) throw new Error(`Item no encontrado: ${itemName}`);

    item.completedQuantity = quantityCompleted;
    item.completed = quantityCompleted >= item.quantity;
    item.completedBy = this.nombre;
    item.completedAt = new Date().toISOString();
    item.notes = notes;

    // Actualizar progreso
    prepList.completedItems = prepList.items.filter(i => i.completed).length;
    prepList.progress = (prepList.completedItems / prepList.items.length) * 100;

    if (prepList.completedItems === prepList.items.length) {
      prepList.status = 'completed';
      this.emitEvent('prep_list_completed', { id: prepListId });
    }

    return { item, overallProgress: prepList.progress };
  }

  async getPrepListProgress(prepListId) {
    const prepList = this.prepLists.get(prepListId);
    if (!prepList) throw new Error(`Prep list no encontrada: ${prepListId}`);

    return {
      id: prepList.id,
      totalItems: prepList.items.length,
      completedItems: prepList.completedItems,
      progress: prepList.progress || 0,
      remainingTime: prepList.items
        .filter(i => !i.completed)
        .reduce((sum, i) => sum + i.estimatedTime, 0),
      pendingUrgent: prepList.items.filter(i => !i.completed && i.priority === 'urgent').length
    };
  }

  // ============ ETIQUETADO Y FIFO ============

  async createLabel(params) {
    const { product, quantity, unit, preparedBy, expirationHours = 72 } = params;

    const label = {
      id: `label_${Date.now()}`,
      product,
      quantity,
      unit,
      preparedDate: new Date().toISOString(),
      preparedBy: preparedBy || this.nombre,
      expirationDate: new Date(Date.now() + expirationHours * 3600000).toISOString(),
      expirationHours,
      location: params.location || 'walk-in',
      status: 'active'
    };

    this.labelLog.push(label);
    return label;
  }

  async checkExpiringProducts() {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 3600000);

    const expiring = this.labelLog.filter(label => {
      if (label.status !== 'active') return false;
      const expDate = new Date(label.expirationDate);
      return expDate <= next24Hours && expDate > now;
    });

    const expired = this.labelLog.filter(label => {
      if (label.status !== 'active') return false;
      return new Date(label.expirationDate) <= now;
    });

    // Marcar expirados
    for (const item of expired) {
      item.status = 'expired';
      this.emitEvent('product_expired', { product: item.product, id: item.id });
    }

    return {
      expiring: expiring.map(l => ({
        product: l.product,
        expiresAt: l.expirationDate,
        hoursRemaining: Math.round((new Date(l.expirationDate) - now) / 3600000)
      })),
      expired: expired.map(l => ({
        product: l.product,
        expiredAt: l.expirationDate,
        action: 'DESECHAR INMEDIATAMENTE'
      })),
      alertCount: expiring.length + expired.length
    };
  }

  async rotateInventory(location) {
    const locationItems = this.labelLog.filter(l =>
      l.location === location && l.status === 'active'
    );

    // Ordenar por fecha de expiración (FIFO)
    locationItems.sort((a, b) =>
      new Date(a.expirationDate) - new Date(b.expirationDate)
    );

    return {
      location,
      rotatedAt: new Date().toISOString(),
      rotatedBy: this.nombre,
      items: locationItems.map((item, idx) => ({
        position: idx + 1,
        product: item.product,
        expiresIn: Math.round((new Date(item.expirationDate) - new Date()) / 3600000) + ' horas',
        action: idx === 0 ? 'USAR PRIMERO' : ''
      }))
    };
  }

  // ============ CONTROL DE MERMA ============

  async logWaste(params) {
    const { product, quantity, unit, reason, estimatedValue } = params;

    const wasteEntry = {
      id: `waste_${Date.now()}`,
      product,
      quantity,
      unit,
      reason, // expired, overproduction, damaged, contaminated, spillage
      estimatedValue: estimatedValue || 0,
      recordedBy: this.nombre,
      recordedAt: new Date().toISOString()
    };

    this.wasteLog.push(wasteEntry);

    this.emitEvent('waste_recorded', {
      product,
      value: estimatedValue,
      reason
    });

    return wasteEntry;
  }

  async analyzeWaste(period) {
    const periodWaste = this.wasteLog.filter(w =>
      w.recordedAt.startsWith(period)
    );

    const byReason = {};
    const byProduct = {};
    let totalValue = 0;

    for (const waste of periodWaste) {
      // Por razón
      byReason[waste.reason] = (byReason[waste.reason] || 0) + waste.estimatedValue;

      // Por producto
      if (!byProduct[waste.product]) {
        byProduct[waste.product] = { count: 0, value: 0 };
      }
      byProduct[waste.product].count++;
      byProduct[waste.product].value += waste.estimatedValue;

      totalValue += waste.estimatedValue;
    }

    // Top productos con más merma
    const topWasteProducts = Object.entries(byProduct)
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const analysis = {
      period,
      analyzedBy: this.nombre,
      analyzedAt: new Date().toISOString(),
      totalEntries: periodWaste.length,
      totalValue,
      byReason: Object.entries(byReason).map(([reason, value]) => ({
        reason,
        value,
        percentage: ((value / totalValue) * 100).toFixed(1)
      })),
      topWasteProducts,
      recommendations: this._generateWasteRecommendations(byReason, topWasteProducts)
    };

    return analysis;
  }

  _generateWasteRecommendations(byReason, topProducts) {
    const recommendations = [];

    if (byReason.expired > byReason.overproduction) {
      recommendations.push('Alta merma por expiración: Revisar rotación FIFO y cantidades de prep');
    }
    if (byReason.overproduction) {
      recommendations.push('Merma por sobreproducción: Ajustar cantidades en prep list según demanda real');
    }
    if (byReason.damaged) {
      recommendations.push('Productos dañados: Revisar almacenamiento y manejo de productos');
    }

    for (const product of topProducts.slice(0, 2)) {
      recommendations.push(`${product.product}: Producto con alta merma ($${product.value}). Revisar proceso.`);
    }

    return recommendations;
  }

  // ============ LIMPIEZA Y SANITIZACIÓN ============

  async createCleaningChecklist(area) {
    const checklists = {
      'prep_area': [
        { task: 'Limpiar y sanitizar tablas de corte', frequency: 'cada 4 horas' },
        { task: 'Limpiar superficies de trabajo', frequency: 'cada uso' },
        { task: 'Sanitizar cuchillos y utensilios', frequency: 'cada uso' },
        { task: 'Limpiar procesador de alimentos', frequency: 'cada uso' },
        { task: 'Vaciar contenedores de basura', frequency: 'cuando lleno' },
        { task: 'Barrer piso del área', frequency: 'cada turno' },
        { task: 'Trapear piso del área', frequency: 'cada turno' }
      ],
      'walk_in': [
        { task: 'Verificar temperatura', frequency: 'cada 2 horas' },
        { task: 'Revisar productos por vencer', frequency: 'cada turno' },
        { task: 'Limpiar derrames', frequency: 'inmediato' },
        { task: 'Organizar según FIFO', frequency: 'cada turno' },
        { task: 'Limpiar pisos', frequency: 'diario' }
      ],
      'dishwash': [
        { task: 'Verificar temperatura de agua', frequency: 'cada hora' },
        { task: 'Verificar concentración de químicos', frequency: 'cada turno' },
        { task: 'Limpiar máquina lavaplatos', frequency: 'diario' },
        { task: 'Limpiar área de pre-lavado', frequency: 'cada turno' },
        { task: 'Organizar utensilios limpios', frequency: 'continuo' }
      ]
    };

    const checklist = {
      id: `clean_${Date.now()}`,
      area,
      date: new Date().toISOString().split('T')[0],
      createdBy: this.nombre,
      items: (checklists[area] || checklists.prep_area).map(item => ({
        ...item,
        completed: false,
        completedBy: null,
        completedAt: null,
        notes: ''
      })),
      status: 'pending'
    };

    return checklist;
  }

  async completeCleaningTask(checklistId, taskIndex, notes = '') {
    return {
      checklistId,
      taskIndex,
      completed: true,
      completedBy: this.nombre,
      completedAt: new Date().toISOString(),
      notes
    };
  }

  // ============ REPORTES ============

  async generatePrepReport(date) {
    const dayPrepLists = Array.from(this.prepLists.values())
      .filter(p => p.date === date);

    const totalItems = dayPrepLists.reduce((sum, p) => sum + p.items.length, 0);
    const completedItems = dayPrepLists.reduce((sum, p) => sum + p.completedItems, 0);

    return this.generateDocument('pdf', {
      title: `Reporte de Preparación - ${date}`,
      summary: `Generado por ${this.nombre}`,
      metrics: [
        { name: 'Prep Lists', value: dayPrepLists.length },
        { name: 'Items Totales', value: totalItems },
        { name: 'Items Completados', value: completedItems },
        { name: 'Completado', value: ((completedItems / totalItems) * 100).toFixed(0), unit: '%' }
      ],
      sections: dayPrepLists.map(prep => ({
        title: `${prep.shift} - ${prep.status}`,
        content: prep.items.map(i =>
          `${i.completed ? '✓' : '○'} ${i.name}: ${i.completedQuantity || 0}/${i.quantity} ${i.unit}`
        ).join('\n')
      }))
    }, { type: 'report' });
  }

  async exportWasteLog(period) {
    const periodWaste = this.wasteLog.filter(w =>
      w.recordedAt.startsWith(period)
    );

    const data = periodWaste.map(w => ({
      Fecha: w.recordedAt.split('T')[0],
      Hora: w.recordedAt.split('T')[1].substring(0, 5),
      Producto: w.product,
      Cantidad: w.quantity,
      Unidad: w.unit,
      Razón: w.reason,
      'Valor $': w.estimatedValue,
      'Registrado por': w.recordedBy
    }));

    return this.generateDocument('excel', data, {
      title: `Merma - ${period}`,
      sheetName: 'Waste'
    });
  }
}

export default PrepCookAgent;
