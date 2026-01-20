/**
 * SousChefAgent - Sous Chef
 * Agente #27 - Segundo al mando en cocina
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class SousChefAgent extends UniversalAgent {
  constructor() {
    super({
      id: 27,
      emoji: '🥘',
      nombre: 'Sous Chef',
      nombreCorto: 'SOUS_CHEF',
      categoria: 'CULINARIO',
      experiencia: { años: 8, rango: '8+ años' },
      descripcion: 'Segundo al mando en cocina, especialista en ejecución y estándares.',
      perfil: {
        formacion: 'Gastronomía + Especialidades técnicas',
        certificaciones: ['ServSafe', 'Certified Sous Chef', 'Food Allergen Certificate'],
        competencias: ['Line management', 'Quality control', 'Staff training', 'Prep management', 'Cost control', 'Menu execution'],
        herramientas: ['Kitchen Display Systems', 'ChefTec', 'Time/Temperature logging', 'Inventory systems'],
        kpis: ['Food Quality Score', 'Ticket Times', 'Prep Completion', 'Training Hours', 'Waste Tracking'],
        logros: ['Mantenimiento de estándares de calidad al 98%', 'Reducción de ticket times en 25%', 'Desarrollo de programa de capacitación de línea'],
        metodologias: ['Station Setup', 'Quality Checkpoints', 'Line Communication', 'Pre-Service Prep']
      },
      triggers: ['ejecución de cocina', 'estándares', 'preparación', 'línea', 'calidad de platos'],
      delegaA: [28, 29, 30]
    });

    this.qualityChecks = [];
    this.serviceMetrics = [];
  }

  // ============ CONTROL DE CALIDAD ============

  async performQualityCheck(params) {
    const { station, items, standards } = params;

    this.emitEvent('quality_check_started', { station });

    const check = {
      id: `qc_${Date.now()}`,
      station,
      performedBy: this.nombre,
      performedAt: new Date().toISOString(),
      items: [],
      overallScore: 0,
      passed: false
    };

    let totalScore = 0;

    for (const item of items) {
      const itemCheck = {
        name: item.name,
        criteria: [],
        score: 0,
        maxScore: 0
      };

      // Evaluar cada criterio
      const criteriaList = standards[item.category] || standards.default || [
        { name: 'Temperatura', weight: 25 },
        { name: 'Presentación', weight: 25 },
        { name: 'Porción', weight: 20 },
        { name: 'Sabor', weight: 30 }
      ];

      for (const criterion of criteriaList) {
        const score = item.scores?.[criterion.name.toLowerCase()] || 0;
        const weightedScore = (score / 10) * criterion.weight;

        itemCheck.criteria.push({
          name: criterion.name,
          score,
          weight: criterion.weight,
          weightedScore,
          passed: score >= 7
        });

        itemCheck.score += weightedScore;
        itemCheck.maxScore += criterion.weight;
      }

      itemCheck.percentage = (itemCheck.score / itemCheck.maxScore) * 100;
      itemCheck.passed = itemCheck.percentage >= 85;
      check.items.push(itemCheck);
      totalScore += itemCheck.percentage;
    }

    check.overallScore = totalScore / items.length;
    check.passed = check.overallScore >= 85;

    this.qualityChecks.push(check);
    this.emitEvent('quality_check_completed', {
      station,
      score: check.overallScore,
      passed: check.passed
    });

    return check;
  }

  async trackTicketTime(ticket) {
    const ticketMetric = {
      id: ticket.id,
      receivedAt: ticket.receivedAt,
      completedAt: new Date().toISOString(),
      items: ticket.items,
      station: ticket.station,
      cook: ticket.cook
    };

    const receivedTime = new Date(ticket.receivedAt);
    const completedTime = new Date(ticketMetric.completedAt);
    ticketMetric.totalTimeSeconds = (completedTime - receivedTime) / 1000;
    ticketMetric.totalTimeMinutes = ticketMetric.totalTimeSeconds / 60;

    // Evaluar contra objetivo
    const targetTime = ticket.targetTime || 12; // minutos
    ticketMetric.onTime = ticketMetric.totalTimeMinutes <= targetTime;
    ticketMetric.variance = ticketMetric.totalTimeMinutes - targetTime;

    this.serviceMetrics.push(ticketMetric);

    if (!ticketMetric.onTime) {
      this.emitEvent('ticket_delayed', {
        id: ticket.id,
        delay: ticketMetric.variance
      });
    }

    return ticketMetric;
  }

  // ============ GESTIÓN DE LÍNEA ============

  async setupStations(stationConfig) {
    const setup = {
      id: `setup_${Date.now()}`,
      setupBy: this.nombre,
      setupAt: new Date().toISOString(),
      stations: [],
      status: 'in_progress'
    };

    for (const station of stationConfig) {
      const stationSetup = {
        name: station.name,
        assignedTo: station.cook,
        checklist: [
          { item: 'Mise en place completo', completed: false },
          { item: 'Equipos encendidos y calibrados', completed: false },
          { item: 'Temperaturas verificadas', completed: false },
          { item: 'Utensilios limpios y listos', completed: false },
          { item: 'Backup prep disponible', completed: false },
          { item: 'Comunicación con expedidor confirmada', completed: false }
        ],
        readyAt: null,
        notes: ''
      };

      setup.stations.push(stationSetup);
    }

    return setup;
  }

  async verifyStationReady(setupId, stationName) {
    // En un sistema real, esto actualizaría el setup
    return {
      station: stationName,
      verified: true,
      verifiedBy: this.nombre,
      verifiedAt: new Date().toISOString()
    };
  }

  // ============ CAPACITACIÓN ============

  async createTrainingPlan(params) {
    const { employee, position, startDate, duration } = params;

    const plan = {
      id: `training_${Date.now()}`,
      employee,
      position,
      startDate,
      duration, // weeks
      createdBy: this.nombre,
      createdAt: new Date().toISOString(),
      modules: [],
      progress: 0,
      status: 'pending'
    };

    // Módulos estándar por posición
    const modulesByPosition = {
      'line_cook': [
        { name: 'Seguridad alimentaria', days: 1, priority: 'high' },
        { name: 'Mise en place y organización', days: 2, priority: 'high' },
        { name: 'Técnicas de cocción', days: 3, priority: 'high' },
        { name: 'Recetas del menú', days: 5, priority: 'high' },
        { name: 'Control de tiempos', days: 2, priority: 'medium' },
        { name: 'Trabajo en equipo', days: 1, priority: 'medium' }
      ],
      'prep_cook': [
        { name: 'Seguridad alimentaria', days: 1, priority: 'high' },
        { name: 'Técnicas de corte', days: 3, priority: 'high' },
        { name: 'Almacenamiento FIFO', days: 1, priority: 'high' },
        { name: 'Recetas base', days: 3, priority: 'high' },
        { name: 'Control de inventario', days: 1, priority: 'medium' }
      ]
    };

    plan.modules = (modulesByPosition[position] || modulesByPosition.line_cook).map((mod, idx) => ({
      ...mod,
      order: idx + 1,
      status: 'pending',
      completedAt: null,
      score: null,
      trainer: null
    }));

    return plan;
  }

  async recordTrainingProgress(planId, moduleId, result) {
    // Simular actualización de progreso
    return {
      planId,
      moduleId,
      completedAt: new Date().toISOString(),
      score: result.score,
      passed: result.score >= 80,
      notes: result.notes,
      trainer: this.nombre
    };
  }

  // ============ REPORTES ============

  async generateServiceReport(shift) {
    const shiftMetrics = this.serviceMetrics.filter(m =>
      m.receivedAt >= shift.startTime && m.receivedAt <= shift.endTime
    );

    const totalTickets = shiftMetrics.length;
    const onTimeTickets = shiftMetrics.filter(m => m.onTime).length;
    const avgTime = shiftMetrics.reduce((sum, m) => sum + m.totalTimeMinutes, 0) / totalTickets;

    const report = {
      shift: shift.name,
      date: shift.date,
      totalTickets,
      onTimePercentage: (onTimeTickets / totalTickets) * 100,
      avgTicketTime: avgTime,
      qualityScore: this._calculateShiftQualityScore(shift),
      issues: this._identifyShiftIssues(shiftMetrics)
    };

    return this.generateDocument('pdf', {
      title: `Reporte de Servicio - ${shift.name}`,
      summary: `${shift.date}`,
      metrics: [
        { name: 'Tickets Totales', value: totalTickets },
        { name: 'On-Time %', value: report.onTimePercentage.toFixed(1), unit: '%' },
        { name: 'Tiempo Promedio', value: avgTime.toFixed(1), unit: ' min' },
        { name: 'Calidad', value: report.qualityScore.toFixed(1), unit: '%' }
      ],
      sections: report.issues.length > 0 ? [{
        title: 'Problemas Identificados',
        content: report.issues.map(i => `• ${i}`).join('\n')
      }] : []
    }, { type: 'report' });
  }

  _calculateShiftQualityScore(shift) {
    const shiftChecks = this.qualityChecks.filter(qc =>
      qc.performedAt >= shift.startTime && qc.performedAt <= shift.endTime
    );
    if (shiftChecks.length === 0) return 100;
    return shiftChecks.reduce((sum, qc) => sum + qc.overallScore, 0) / shiftChecks.length;
  }

  _identifyShiftIssues(metrics) {
    const issues = [];
    const delayedTickets = metrics.filter(m => !m.onTime);

    if (delayedTickets.length > metrics.length * 0.1) {
      issues.push(`${delayedTickets.length} tickets retrasados (${(delayedTickets.length / metrics.length * 100).toFixed(0)}%)`);
    }

    // Identificar estaciones problemáticas
    const stationDelays = {};
    for (const ticket of delayedTickets) {
      stationDelays[ticket.station] = (stationDelays[ticket.station] || 0) + 1;
    }

    for (const [station, count] of Object.entries(stationDelays)) {
      if (count >= 3) {
        issues.push(`Estación ${station}: ${count} retrasos`);
      }
    }

    return issues;
  }

  async exportQualityData() {
    const data = this.qualityChecks.map(qc => ({
      Fecha: qc.performedAt.split('T')[0],
      Hora: qc.performedAt.split('T')[1].substring(0, 5),
      Estación: qc.station,
      'Score %': qc.overallScore.toFixed(1),
      Aprobado: qc.passed ? 'Sí' : 'No',
      Items: qc.items.length
    }));

    return this.generateDocument('excel', data, {
      title: 'Control de Calidad',
      sheetName: 'QualityChecks'
    });
  }
}

export default SousChefAgent;
