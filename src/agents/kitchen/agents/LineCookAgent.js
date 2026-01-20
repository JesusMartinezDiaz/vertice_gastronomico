/**
 * LineCookAgent - Chef de Partida
 * Agente #29 - Especialista de estación
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class LineCookAgent extends UniversalAgent {
  constructor() {
    super({
      id: 29,
      emoji: '🥗',
      nombre: 'Chef de Partida',
      nombreCorto: 'LINE_COOK',
      categoria: 'CULINARIO',
      experiencia: { años: 3, rango: '3+ años' },
      descripcion: 'Especialista de estación responsable de la ejecución perfecta de su área.',
      perfil: {
        formacion: 'Gastronomía o experiencia práctica equivalente',
        certificaciones: ['ServSafe Food Handler', 'Station-specific certifications'],
        competencias: ['Station management', 'Speed and accuracy', 'Mise en place', 'Recipe execution', 'Temperature control', 'Plating'],
        herramientas: ['Station equipment', 'KDS', 'Timers', 'Thermometers'],
        kpis: ['Ticket Time', 'Food Quality Score', 'Waste per Station', 'Mise en Place Completion'],
        logros: ['Ticket times consistentemente bajo objetivo', 'Zero food safety violations', 'Promoción a trainer de estación'],
        metodologias: ['Mise en Place', 'First In First Out', 'Clean as You Go', 'Station Breakdown']
      },
      triggers: ['estación', 'línea de cocina', 'preparación', 'ejecución', 'partida'],
      delegaA: [30]
    });

    this.ticketLog = [];
    this.miseEnPlace = new Map();
    this.stationMetrics = {
      ticketsCompleted: 0,
      avgTicketTime: 0,
      onTimeRate: 0,
      qualityScore: 0
    };
  }

  // ============ MISE EN PLACE ============

  async createMiseEnPlaceList(params) {
    const { station, date, expectedCovers, menuItems } = params;

    this.emitEvent('mise_en_place_started', { station, expectedCovers });

    const miseList = {
      id: `mise_${Date.now()}`,
      station,
      date,
      expectedCovers,
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      items: [],
      totalPrepTime: 0,
      status: 'pending'
    };

    // Calcular necesidades basado en covers
    for (const item of menuItems) {
      const expectedOrders = Math.ceil(expectedCovers * (item.popularityRate || 0.15));
      const parLevel = Math.ceil(expectedOrders * 1.3); // 30% buffer

      const miseItem = {
        name: item.name,
        expectedOrders,
        parLevel,
        currentLevel: item.currentLevel || 0,
        needed: Math.max(0, parLevel - (item.currentLevel || 0)),
        unit: item.unit,
        prepTime: item.prepTime || 5,
        shelfLife: item.shelfLife || 24, // horas
        priority: this._calculateMisePriority(item),
        completed: false,
        completedBy: null,
        completedAt: null,
        notes: item.notes || ''
      };

      if (miseItem.needed > 0) {
        miseList.items.push(miseItem);
        miseList.totalPrepTime += miseItem.prepTime * (miseItem.needed / item.batchSize || 1);
      }
    }

    // Ordenar por prioridad
    miseList.items.sort((a, b) => a.priority - b.priority);

    this.miseEnPlace.set(miseList.id, miseList);
    this.emitEvent('mise_en_place_created', { id: miseList.id, itemCount: miseList.items.length });

    return miseList;
  }

  _calculateMisePriority(item) {
    // 1 = más urgente
    if (item.shelfLife < 4) return 1; // Prep al momento
    if (item.prepTime > 30) return 2; // Items que toman tiempo
    if (item.popularityRate > 0.3) return 3; // Alta rotación
    return 4;
  }

  async updateMiseProgress(miseId, itemName, quantity) {
    const mise = this.miseEnPlace.get(miseId);
    if (!mise) throw new Error(`Mise en place no encontrado: ${miseId}`);

    const item = mise.items.find(i => i.name === itemName);
    if (!item) throw new Error(`Item no encontrado: ${itemName}`);

    item.currentLevel += quantity;
    item.needed = Math.max(0, item.parLevel - item.currentLevel);

    if (item.needed === 0) {
      item.completed = true;
      item.completedBy = this.nombre;
      item.completedAt = new Date().toISOString();
    }

    // Actualizar estado general
    const completed = mise.items.filter(i => i.completed).length;
    mise.progress = (completed / mise.items.length) * 100;

    if (completed === mise.items.length) {
      mise.status = 'completed';
      this.emitEvent('mise_en_place_completed', { id: miseId });
    }

    return { item, overallProgress: mise.progress };
  }

  // ============ EJECUCIÓN DE SERVICIO ============

  async processTicket(ticket) {
    const startTime = new Date();

    const ticketRecord = {
      id: ticket.id,
      items: ticket.items,
      station: ticket.station,
      receivedAt: startTime.toISOString(),
      completedAt: null,
      ticketTime: null,
      targetTime: ticket.targetTime || 12,
      onTime: false,
      quality: null,
      notes: []
    };

    this.emitEvent('ticket_received', { id: ticket.id, items: ticket.items.length });

    // En una implementación real, esto esperaría la completación
    // Por ahora, simulamos el registro
    this.ticketLog.push(ticketRecord);

    return ticketRecord;
  }

  async completeTicket(ticketId, qualityScore) {
    const ticket = this.ticketLog.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket no encontrado: ${ticketId}`);

    ticket.completedAt = new Date().toISOString();
    const startTime = new Date(ticket.receivedAt);
    const endTime = new Date(ticket.completedAt);
    ticket.ticketTime = (endTime - startTime) / 60000; // minutos
    ticket.onTime = ticket.ticketTime <= ticket.targetTime;
    ticket.quality = qualityScore;

    // Actualizar métricas
    this._updateStationMetrics(ticket);

    this.emitEvent('ticket_completed', {
      id: ticketId,
      time: ticket.ticketTime.toFixed(1),
      onTime: ticket.onTime
    });

    return ticket;
  }

  _updateStationMetrics(ticket) {
    const completedTickets = this.ticketLog.filter(t => t.completedAt);
    const count = completedTickets.length;

    this.stationMetrics.ticketsCompleted = count;
    this.stationMetrics.avgTicketTime = completedTickets.reduce((sum, t) => sum + t.ticketTime, 0) / count;
    this.stationMetrics.onTimeRate = (completedTickets.filter(t => t.onTime).length / count) * 100;
    this.stationMetrics.qualityScore = completedTickets.reduce((sum, t) => sum + (t.quality || 0), 0) / count;
  }

  // ============ CONTROL DE TEMPERATURAS ============

  async logTemperature(reading) {
    const tempLog = {
      id: `temp_${Date.now()}`,
      location: reading.location,
      product: reading.product,
      temperature: reading.temperature,
      unit: 'C',
      recordedBy: this.nombre,
      recordedAt: new Date().toISOString(),
      inRange: this._checkTempRange(reading.product, reading.temperature),
      action: null
    };

    if (!tempLog.inRange) {
      tempLog.action = this._getTempCorrectionAction(reading.product, reading.temperature);
      this.emitEvent('temperature_out_of_range', {
        product: reading.product,
        temp: reading.temperature,
        action: tempLog.action
      });
    }

    return tempLog;
  }

  _checkTempRange(product, temp) {
    const ranges = {
      'cold_holding': { min: 0, max: 4 },
      'hot_holding': { min: 60, max: 100 },
      'protein_cooking': { min: 63, max: 100 },
      'poultry_cooking': { min: 74, max: 100 },
      'reheating': { min: 74, max: 100 }
    };

    const range = ranges[product] || ranges.cold_holding;
    return temp >= range.min && temp <= range.max;
  }

  _getTempCorrectionAction(product, temp) {
    if (product.includes('cold') || product.includes('holding')) {
      return temp > 4 ? 'Enfriar inmediatamente o desechar si ha pasado 2+ horas' : 'Verificar refrigeración';
    }
    if (product.includes('hot')) {
      return temp < 60 ? 'Recalentar a 74°C o desechar' : 'Reducir fuente de calor';
    }
    return 'Verificar y ajustar temperatura';
  }

  // ============ CIERRE DE ESTACIÓN ============

  async createStationBreakdown(station) {
    const breakdown = {
      id: `breakdown_${Date.now()}`,
      station,
      date: new Date().toISOString().split('T')[0],
      performedBy: this.nombre,
      checklist: [
        { task: 'Apagar todos los equipos', completed: false },
        { task: 'Limpiar y sanitizar superficies', completed: false },
        { task: 'Cubrir y etiquetar productos', completed: false },
        { task: 'Rotar inventario (FIFO)', completed: false },
        { task: 'Reportar productos bajos', completed: false },
        { task: 'Vaciar y limpiar contenedores de basura', completed: false },
        { task: 'Limpiar pisos del área', completed: false },
        { task: 'Verificar temperaturas de refrigeración', completed: false },
        { task: 'Guardar utensilios limpios', completed: false },
        { task: 'Reportar mantenimiento necesario', completed: false }
      ],
      lowStockItems: [],
      maintenanceIssues: [],
      completedAt: null,
      status: 'in_progress'
    };

    return breakdown;
  }

  async completeBreakdownTask(breakdownId, taskIndex, notes = '') {
    // En implementación real, actualizaría el breakdown
    return {
      taskIndex,
      completed: true,
      completedBy: this.nombre,
      completedAt: new Date().toISOString(),
      notes
    };
  }

  // ============ REPORTES ============

  async generateStationReport(period) {
    const periodTickets = this.ticketLog.filter(t =>
      t.completedAt && t.completedAt.startsWith(period)
    );

    const report = {
      station: 'Mi Estación',
      period,
      generatedBy: this.nombre,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalTickets: periodTickets.length,
        avgTicketTime: this.stationMetrics.avgTicketTime.toFixed(1),
        onTimeRate: this.stationMetrics.onTimeRate.toFixed(1),
        qualityScore: this.stationMetrics.qualityScore.toFixed(1)
      },
      busyHours: this._analyzeBusyHours(periodTickets),
      commonIssues: this._identifyCommonIssues(periodTickets)
    };

    return this.generateDocument('pdf', {
      title: `Reporte de Estación - ${period}`,
      summary: report.station,
      metrics: [
        { name: 'Tickets Completados', value: report.metrics.totalTickets },
        { name: 'Tiempo Promedio', value: report.metrics.avgTicketTime, unit: ' min' },
        { name: 'On-Time Rate', value: report.metrics.onTimeRate, unit: '%' },
        { name: 'Calidad', value: report.metrics.qualityScore, unit: '/10' }
      ],
      sections: [
        {
          title: 'Horas Pico',
          content: report.busyHours.map(h => `${h.hour}:00 - ${h.tickets} tickets`).join('\n')
        },
        {
          title: 'Áreas de Mejora',
          content: report.commonIssues.length > 0
            ? report.commonIssues.join('\n')
            : 'Sin problemas recurrentes identificados'
        }
      ]
    }, { type: 'report' });
  }

  _analyzeBusyHours(tickets) {
    const hourCounts = {};

    for (const ticket of tickets) {
      const hour = new Date(ticket.receivedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    return Object.entries(hourCounts)
      .map(([hour, tickets]) => ({ hour: parseInt(hour), tickets }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5);
  }

  _identifyCommonIssues(tickets) {
    const issues = [];
    const lateTickets = tickets.filter(t => !t.onTime);

    if (lateTickets.length > tickets.length * 0.15) {
      issues.push(`Alta tasa de retrasos: ${(lateTickets.length / tickets.length * 100).toFixed(0)}%`);
    }

    const lowQuality = tickets.filter(t => t.quality && t.quality < 7);
    if (lowQuality.length > tickets.length * 0.1) {
      issues.push(`Calidad por debajo de estándar en ${lowQuality.length} tickets`);
    }

    return issues;
  }

  async exportTicketLog() {
    const data = this.ticketLog.map(t => ({
      ID: t.id,
      Fecha: t.receivedAt.split('T')[0],
      'Hora Recibido': t.receivedAt.split('T')[1].substring(0, 5),
      'Hora Completado': t.completedAt?.split('T')[1]?.substring(0, 5) || '-',
      'Tiempo (min)': t.ticketTime?.toFixed(1) || '-',
      'On-Time': t.onTime ? 'Sí' : 'No',
      Calidad: t.quality || '-',
      Items: t.items.length
    }));

    return this.generateDocument('excel', data, {
      title: 'Log de Tickets',
      sheetName: 'Tickets'
    });
  }
}

export default LineCookAgent;
