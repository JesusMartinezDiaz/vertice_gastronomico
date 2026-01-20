/**
 * SISTEMA DE MÉTRICAS ESTRATÉGICAS
 * Vértice Gastronómico - Seguimiento de KPIs del Director General IA
 *
 * Basado en las propuestas estratégicas:
 * 1. Roadmap de especialización vertical
 * 2. Programa de partnerships con consultoras
 * 3. MVP de plataforma de automatización interna
 *
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE MÉTRICAS ESTRATÉGICAS
// ═══════════════════════════════════════════════════════════════════

export const STRATEGIC_METRICS_CONFIG = {
  version: '1.0.0',

  // Métricas del reporte del Director General IA
  benchmarks: {
    industryStrategicReadiness: 65,  // Benchmark de la industria
    currentStrategicReadiness: 78,   // Índice actual de Vértice
    industryGrowthRate: 25,          // Tasa crecimiento industria %
    currentGrowthRate: 45,           // Tasa crecimiento actual %
    currentROI: 185,                 // ROI promedio por iniciativa %
    referralClientRate: 68,          // % clientes por referencias
    currentMarketShare: 12,          // Market share actual %
    targetMarketShare: 35,           // Market share objetivo %
    totalAgents: 72                  // Total de agentes especializados
  },

  // Períodos de medición
  periods: {
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    quarterly: 'quarterly',
    annual: 'annual'
  },

  // Alertas y umbrales
  thresholds: {
    critical: 50,
    warning: 70,
    good: 85,
    excellent: 95
  }
};

// ═══════════════════════════════════════════════════════════════════
// KPIs DE ESPECIALIZACIÓN VERTICAL
// ═══════════════════════════════════════════════════════════════════

export const VERTICAL_SPECIALIZATION_KPIS = {
  id: 'vertical_specialization',
  name: 'Especialización Vertical',
  description: 'KPIs para medir el progreso en sectores emergentes (fintech, healthtech)',

  metrics: [
    {
      id: 'vs_market_penetration',
      name: 'Penetración de Mercado',
      description: 'Porcentaje de mercado capturado en sectores verticales',
      unit: '%',
      baseline: 12,
      target: 35,
      currentValue: 12,
      formula: '(clientes_sector / total_mercado_sector) * 100',
      frequency: 'monthly'
    },
    {
      id: 'vs_sector_revenue',
      name: 'Ingresos por Sector Vertical',
      description: 'Ingresos generados por cada sector especializado',
      unit: 'MXN',
      baseline: 0,
      target: 500000,
      currentValue: 0,
      formula: 'sum(ingresos_por_sector)',
      frequency: 'monthly'
    },
    {
      id: 'vs_client_acquisition',
      name: 'Adquisición de Clientes Verticales',
      description: 'Nuevos clientes en sectores fintech/healthtech',
      unit: 'clientes',
      baseline: 0,
      target: 15,
      currentValue: 0,
      formula: 'count(nuevos_clientes_sector)',
      frequency: 'quarterly'
    },
    {
      id: 'vs_agent_utilization',
      name: 'Utilización de Agentes Especializados',
      description: 'Porcentaje de agentes activos en proyectos verticales',
      unit: '%',
      baseline: 30,
      target: 75,
      currentValue: 30,
      formula: '(agentes_activos_vertical / total_agentes) * 100',
      frequency: 'weekly'
    },
    {
      id: 'vs_service_expansion',
      name: 'Expansión de Servicios',
      description: 'Nuevos servicios desarrollados para verticales',
      unit: 'servicios',
      baseline: 0,
      target: 10,
      currentValue: 0,
      formula: 'count(nuevos_servicios_vertical)',
      frequency: 'quarterly'
    },
    {
      id: 'vs_nps_vertical',
      name: 'NPS Sectores Verticales',
      description: 'Net Promoter Score de clientes en verticales',
      unit: 'score',
      baseline: 0,
      target: 70,
      currentValue: 0,
      formula: '(promotores - detractores) / total_encuestados * 100',
      frequency: 'quarterly'
    }
  ],

  milestones: [
    { phase: 'Q1 2024', goal: 'Identificar 3 nichos principales en fintech', status: 'pending' },
    { phase: 'Q1 2024', goal: 'Desarrollar propuesta de valor diferenciada', status: 'pending' },
    { phase: 'Q2 2024', goal: 'Lanzar primer servicio vertical', status: 'pending' },
    { phase: 'Q2 2024', goal: 'Captar primeros 5 clientes verticales', status: 'pending' },
    { phase: 'Q3 2024', goal: 'Alcanzar 20% penetración objetivo', status: 'pending' },
    { phase: 'Q4 2024', goal: 'Consolidar posición en 2 verticales', status: 'pending' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// KPIs DE PARTNERSHIPS ESTRATÉGICOS
// ═══════════════════════════════════════════════════════════════════

export const PARTNERSHIP_KPIS = {
  id: 'strategic_partnerships',
  name: 'Partnerships Estratégicos',
  description: 'KPIs para programa piloto con 3 consultoras estratégicas',

  metrics: [
    {
      id: 'sp_active_partnerships',
      name: 'Partnerships Activos',
      description: 'Número de alianzas estratégicas activas',
      unit: 'partnerships',
      baseline: 0,
      target: 3,
      currentValue: 0,
      formula: 'count(partnerships_activos)',
      frequency: 'monthly'
    },
    {
      id: 'sp_referral_revenue',
      name: 'Ingresos por Referidos',
      description: 'Ingresos generados por referencias de partners',
      unit: 'MXN',
      baseline: 0,
      target: 300000,
      currentValue: 0,
      formula: 'sum(ingresos_referidos_partners)',
      frequency: 'monthly'
    },
    {
      id: 'sp_joint_projects',
      name: 'Proyectos Conjuntos',
      description: 'Número de proyectos ejecutados con partners',
      unit: 'proyectos',
      baseline: 0,
      target: 10,
      currentValue: 0,
      formula: 'count(proyectos_conjuntos)',
      frequency: 'quarterly'
    },
    {
      id: 'sp_partner_satisfaction',
      name: 'Satisfacción de Partners',
      description: 'Nivel de satisfacción de consultoras aliadas',
      unit: 'score',
      baseline: 0,
      target: 90,
      currentValue: 0,
      formula: 'promedio(satisfaccion_partners)',
      frequency: 'quarterly'
    },
    {
      id: 'sp_conversion_rate',
      name: 'Tasa de Conversión de Leads',
      description: 'Porcentaje de leads de partners convertidos',
      unit: '%',
      baseline: 0,
      target: 40,
      currentValue: 0,
      formula: '(leads_convertidos / total_leads_partners) * 100',
      frequency: 'monthly'
    },
    {
      id: 'sp_cross_selling',
      name: 'Cross-Selling Success',
      description: 'Servicios adicionales vendidos vía partners',
      unit: 'ventas',
      baseline: 0,
      target: 20,
      currentValue: 0,
      formula: 'count(ventas_cruzadas_partners)',
      frequency: 'quarterly'
    }
  ],

  milestones: [
    { phase: 'Mes 1', goal: 'Identificar 10 consultoras potenciales', status: 'pending' },
    { phase: 'Mes 2', goal: 'Contactar y presentar propuesta a 5', status: 'pending' },
    { phase: 'Mes 3', goal: 'Firmar acuerdo con primera consultora', status: 'pending' },
    { phase: 'Mes 4', goal: 'Iniciar proyecto piloto conjunto', status: 'pending' },
    { phase: 'Mes 5', goal: 'Completar acuerdos con 3 consultoras', status: 'pending' },
    { phase: 'Mes 6', goal: 'Evaluar resultados y escalar programa', status: 'pending' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// KPIs DE AUTOMATIZACIÓN INTERNA
// ═══════════════════════════════════════════════════════════════════

export const AUTOMATION_KPIS = {
  id: 'internal_automation',
  name: 'Automatización Interna',
  description: 'KPIs para el MVP de plataforma de automatización',

  metrics: [
    {
      id: 'ia_process_automated',
      name: 'Procesos Automatizados',
      description: 'Número de procesos internos automatizados',
      unit: 'procesos',
      baseline: 5,
      target: 25,
      currentValue: 5,
      formula: 'count(procesos_automatizados)',
      frequency: 'monthly'
    },
    {
      id: 'ia_time_saved',
      name: 'Tiempo Ahorrado',
      description: 'Horas semanales ahorradas por automatización',
      unit: 'horas',
      baseline: 0,
      target: 40,
      currentValue: 0,
      formula: 'sum(tiempo_ahorrado_semanal)',
      frequency: 'weekly'
    },
    {
      id: 'ia_agent_efficiency',
      name: 'Eficiencia de Agentes',
      description: 'Mejora en eficiencia de los 72 agentes',
      unit: '%',
      baseline: 100,
      target: 150,
      currentValue: 100,
      formula: '(tareas_completadas / tiempo_promedio) * 100',
      frequency: 'weekly'
    },
    {
      id: 'ia_error_reduction',
      name: 'Reducción de Errores',
      description: 'Porcentaje de reducción de errores en procesos',
      unit: '%',
      baseline: 0,
      target: 80,
      currentValue: 0,
      formula: '((errores_antes - errores_despues) / errores_antes) * 100',
      frequency: 'monthly'
    },
    {
      id: 'ia_cost_savings',
      name: 'Ahorro en Costos',
      description: 'Reducción de costos operativos por automatización',
      unit: 'MXN',
      baseline: 0,
      target: 100000,
      currentValue: 0,
      formula: 'costos_antes - costos_despues',
      frequency: 'monthly'
    },
    {
      id: 'ia_workflow_completion',
      name: 'Workflows Completados',
      description: 'Tasa de éxito de workflows automatizados',
      unit: '%',
      baseline: 0,
      target: 95,
      currentValue: 0,
      formula: '(workflows_exitosos / total_workflows) * 100',
      frequency: 'daily'
    },
    {
      id: 'ia_api_integrations',
      name: 'Integraciones API',
      description: 'Número de integraciones externas activas',
      unit: 'integraciones',
      baseline: 3,
      target: 15,
      currentValue: 3,
      formula: 'count(integraciones_activas)',
      frequency: 'monthly'
    }
  ],

  milestones: [
    { phase: 'Sprint 1', goal: 'Definir arquitectura MVP', status: 'pending' },
    { phase: 'Sprint 2', goal: 'Automatizar 5 procesos críticos', status: 'pending' },
    { phase: 'Sprint 3', goal: 'Integrar dashboard de métricas', status: 'pending' },
    { phase: 'Sprint 4', goal: 'Conectar con sistema de agentes', status: 'pending' },
    { phase: 'Sprint 5', goal: 'Testing y optimización', status: 'pending' },
    { phase: 'Sprint 6', goal: 'Lanzamiento MVP interno', status: 'pending' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// KPIs DE ADQUISICIÓN DIGITAL (del reporte)
// ═══════════════════════════════════════════════════════════════════

export const DIGITAL_ACQUISITION_KPIS = {
  id: 'digital_acquisition',
  name: 'Adquisición Digital',
  description: 'KPIs para fortalecer canales de adquisición digital',

  metrics: [
    {
      id: 'da_organic_leads',
      name: 'Leads Orgánicos',
      description: 'Leads generados por canales digitales orgánicos',
      unit: 'leads',
      baseline: 10,
      target: 50,
      currentValue: 10,
      formula: 'count(leads_organicos)',
      frequency: 'monthly'
    },
    {
      id: 'da_conversion_rate',
      name: 'Tasa de Conversión Web',
      description: 'Porcentaje de visitantes convertidos en leads',
      unit: '%',
      baseline: 2,
      target: 8,
      currentValue: 2,
      formula: '(leads / visitantes) * 100',
      frequency: 'weekly'
    },
    {
      id: 'da_referral_balance',
      name: 'Balance Referidos vs Digital',
      description: 'Proporción de clientes digitales vs referidos',
      unit: '%',
      baseline: 32,  // 100 - 68% referidos = 32% digital
      target: 50,
      currentValue: 32,
      formula: '(clientes_digitales / total_clientes) * 100',
      frequency: 'monthly'
    },
    {
      id: 'da_cac',
      name: 'Costo de Adquisición (CAC)',
      description: 'Costo promedio por cliente adquirido digitalmente',
      unit: 'MXN',
      baseline: 5000,
      target: 2500,
      currentValue: 5000,
      formula: 'gastos_marketing / nuevos_clientes',
      frequency: 'monthly'
    },
    {
      id: 'da_ltv_cac_ratio',
      name: 'Ratio LTV/CAC',
      description: 'Relación valor del cliente vs costo de adquisición',
      unit: 'ratio',
      baseline: 3,
      target: 5,
      currentValue: 3,
      formula: 'ltv / cac',
      frequency: 'quarterly'
    }
  ],

  milestones: [
    { phase: 'Mes 1', goal: 'Auditar canales digitales actuales', status: 'pending' },
    { phase: 'Mes 2', goal: 'Implementar SEO y contenido', status: 'pending' },
    { phase: 'Mes 3', goal: 'Lanzar campañas PPC optimizadas', status: 'pending' },
    { phase: 'Mes 4', goal: 'Automatizar nurturing de leads', status: 'pending' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL DEL SISTEMA DE MÉTRICAS
// ═══════════════════════════════════════════════════════════════════

export class StrategicMetricsSystem {
  constructor() {
    this.version = '1.0.0';
    this.config = STRATEGIC_METRICS_CONFIG;
    this.kpiSets = {
      verticalSpecialization: VERTICAL_SPECIALIZATION_KPIS,
      partnerships: PARTNERSHIP_KPIS,
      automation: AUTOMATION_KPIS,
      digitalAcquisition: DIGITAL_ACQUISITION_KPIS
    };
    this.metricsHistory = [];
    this.alerts = [];
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGISTRO Y ACTUALIZACIÓN DE MÉTRICAS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Registra un nuevo valor para una métrica
   */
  recordMetric(kpiSetId, metricId, value, metadata = {}) {
    const kpiSet = this.kpiSets[kpiSetId];
    if (!kpiSet) {
      return { success: false, error: `KPI set '${kpiSetId}' no encontrado` };
    }

    const metric = kpiSet.metrics.find(m => m.id === metricId);
    if (!metric) {
      return { success: false, error: `Métrica '${metricId}' no encontrada` };
    }

    const previousValue = metric.currentValue;
    metric.currentValue = value;

    const record = {
      id: `REC-${Date.now()}`,
      kpiSetId,
      metricId,
      previousValue,
      newValue: value,
      change: value - previousValue,
      changePercent: previousValue > 0
        ? ((value - previousValue) / previousValue * 100).toFixed(2)
        : 0,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metricsHistory.push(record);

    // Verificar alertas
    this.checkAlerts(kpiSetId, metricId, value, metric);

    return {
      success: true,
      record,
      progress: this.calculateProgress(metric)
    };
  }

  /**
   * Calcula el progreso hacia el objetivo
   */
  calculateProgress(metric) {
    const range = metric.target - metric.baseline;
    const current = metric.currentValue - metric.baseline;
    const percentage = range > 0 ? (current / range * 100) : 0;

    return {
      percentage: Math.min(100, Math.max(0, percentage)).toFixed(2),
      remaining: metric.target - metric.currentValue,
      status: this.getProgressStatus(percentage)
    };
  }

  /**
   * Obtiene el estado del progreso
   */
  getProgressStatus(percentage) {
    if (percentage >= 100) return 'completed';
    if (percentage >= 75) return 'on_track';
    if (percentage >= 50) return 'moderate';
    if (percentage >= 25) return 'behind';
    return 'critical';
  }

  /**
   * Verifica y genera alertas
   */
  checkAlerts(kpiSetId, metricId, value, metric) {
    const progress = this.calculateProgress(metric);
    const progressNum = parseFloat(progress.percentage);

    if (progressNum < this.config.thresholds.critical) {
      this.alerts.push({
        id: `ALERT-${Date.now()}`,
        type: 'critical',
        kpiSetId,
        metricId,
        message: `CRÍTICO: ${metric.name} está en ${progressNum}% del objetivo`,
        value,
        target: metric.target,
        timestamp: new Date().toISOString()
      });
    } else if (progressNum < this.config.thresholds.warning) {
      this.alerts.push({
        id: `ALERT-${Date.now()}`,
        type: 'warning',
        kpiSetId,
        metricId,
        message: `ADVERTENCIA: ${metric.name} está en ${progressNum}% del objetivo`,
        value,
        target: metric.target,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REPORTES Y DASHBOARDS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Genera dashboard ejecutivo completo
   */
  generateExecutiveDashboard() {
    return {
      dashboardId: `DASH-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      version: this.version,

      // Resumen general basado en el reporte del Director General
      strategicOverview: {
        strategicReadinessIndex: this.config.benchmarks.currentStrategicReadiness,
        industryBenchmark: this.config.benchmarks.industryStrategicReadiness,
        aboveBenchmark: this.config.benchmarks.currentStrategicReadiness -
                       this.config.benchmarks.industryStrategicReadiness,
        totalAgents: this.config.benchmarks.totalAgents,
        currentROI: `${this.config.benchmarks.currentROI}%`,
        growthRate: `${this.config.benchmarks.currentGrowthRate}%`,
        industryGrowthRate: `${this.config.benchmarks.industryGrowthRate}%`,
        referralRate: `${this.config.benchmarks.referralClientRate}%`
      },

      // KPIs por área estratégica
      kpiSummaries: Object.entries(this.kpiSets).map(([key, kpiSet]) => ({
        id: kpiSet.id,
        name: kpiSet.name,
        description: kpiSet.description,
        overallProgress: this.calculateKPISetProgress(kpiSet),
        metrics: kpiSet.metrics.map(m => ({
          id: m.id,
          name: m.name,
          current: m.currentValue,
          target: m.target,
          unit: m.unit,
          progress: this.calculateProgress(m)
        })),
        nextMilestone: kpiSet.milestones.find(ms => ms.status === 'pending')
      })),

      // Alertas activas
      activeAlerts: this.alerts.slice(-10),

      // Métricas de mercado
      marketMetrics: {
        currentMarketShare: `${this.config.benchmarks.currentMarketShare}%`,
        targetMarketShare: `${this.config.benchmarks.targetMarketShare}%`,
        growthOpportunity: `${this.config.benchmarks.targetMarketShare -
                            this.config.benchmarks.currentMarketShare}%`
      },

      // Próximas acciones recomendadas
      recommendedActions: this.generateRecommendedActions()
    };
  }

  /**
   * Calcula el progreso general de un set de KPIs
   */
  calculateKPISetProgress(kpiSet) {
    const progresses = kpiSet.metrics.map(m =>
      parseFloat(this.calculateProgress(m).percentage)
    );
    const average = progresses.reduce((a, b) => a + b, 0) / progresses.length;

    return {
      percentage: average.toFixed(2),
      status: this.getProgressStatus(average),
      metricsOnTrack: progresses.filter(p => p >= 75).length,
      metricsBehind: progresses.filter(p => p < 50).length,
      totalMetrics: kpiSet.metrics.length
    };
  }

  /**
   * Genera reporte de una iniciativa específica
   */
  generateInitiativeReport(kpiSetId) {
    const kpiSet = this.kpiSets[kpiSetId];
    if (!kpiSet) {
      return { success: false, error: 'Iniciativa no encontrada' };
    }

    return {
      reportId: `RPT-${Date.now()}`,
      initiative: kpiSet.name,
      generatedAt: new Date().toISOString(),

      summary: {
        description: kpiSet.description,
        overallProgress: this.calculateKPISetProgress(kpiSet),
        milestonesCompleted: kpiSet.milestones.filter(m => m.status === 'completed').length,
        totalMilestones: kpiSet.milestones.length
      },

      metrics: kpiSet.metrics.map(m => ({
        ...m,
        progress: this.calculateProgress(m),
        history: this.metricsHistory
          .filter(h => h.kpiSetId === kpiSetId && h.metricId === m.id)
          .slice(-10)
      })),

      milestones: kpiSet.milestones,

      trends: this.calculateTrends(kpiSetId),

      recommendations: this.generateInitiativeRecommendations(kpiSet)
    };
  }

  /**
   * Calcula tendencias de métricas
   */
  calculateTrends(kpiSetId) {
    const relevantHistory = this.metricsHistory
      .filter(h => h.kpiSetId === kpiSetId)
      .slice(-30);

    if (relevantHistory.length < 2) {
      return { trend: 'insufficient_data', message: 'Datos insuficientes para calcular tendencia' };
    }

    const changes = relevantHistory.map(h => parseFloat(h.changePercent));
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;

    return {
      trend: avgChange > 5 ? 'positive' : avgChange < -5 ? 'negative' : 'stable',
      averageChange: avgChange.toFixed(2),
      dataPoints: relevantHistory.length,
      message: avgChange > 5
        ? 'Tendencia positiva - métricas mejorando'
        : avgChange < -5
          ? 'Tendencia negativa - requiere atención'
          : 'Tendencia estable'
    };
  }

  /**
   * Genera acciones recomendadas basadas en métricas
   */
  generateRecommendedActions() {
    const actions = [];

    // Analizar cada set de KPIs
    Object.entries(this.kpiSets).forEach(([key, kpiSet]) => {
      const progress = this.calculateKPISetProgress(kpiSet);

      if (parseFloat(progress.percentage) < 50) {
        actions.push({
          priority: 'high',
          initiative: kpiSet.name,
          action: `Acelerar progreso en ${kpiSet.name} - actualmente en ${progress.percentage}%`,
          targetMetrics: kpiSet.metrics
            .filter(m => parseFloat(this.calculateProgress(m).percentage) < 50)
            .map(m => m.name)
        });
      }
    });

    // Acciones específicas del reporte del Director General
    actions.push(
      {
        priority: 'high',
        initiative: 'Especialización Vertical',
        action: 'Crear roadmap de especialización vertical para Q1 2024',
        deadline: 'Q1 2024'
      },
      {
        priority: 'high',
        initiative: 'Partnerships',
        action: 'Iniciar programa piloto con 3 consultoras estratégicas',
        deadline: 'Inmediato'
      },
      {
        priority: 'medium',
        initiative: 'Automatización',
        action: 'Desarrollar MVP de plataforma de automatización interna',
        deadline: 'Q2 2024'
      },
      {
        priority: 'medium',
        initiative: 'Adquisición Digital',
        action: 'Fortalecer canales de adquisición digital para reducir dependencia de referidos (68%)',
        deadline: 'Continuo'
      }
    );

    return actions.sort((a, b) =>
      a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
    );
  }

  /**
   * Genera recomendaciones para una iniciativa específica
   */
  generateInitiativeRecommendations(kpiSet) {
    const recommendations = [];

    kpiSet.metrics.forEach(metric => {
      const progress = this.calculateProgress(metric);

      if (progress.status === 'critical' || progress.status === 'behind') {
        recommendations.push({
          metric: metric.name,
          currentValue: metric.currentValue,
          target: metric.target,
          gap: metric.target - metric.currentValue,
          recommendation: `Priorizar mejora de ${metric.name}. Actual: ${metric.currentValue}${metric.unit}, Objetivo: ${metric.target}${metric.unit}`,
          urgency: progress.status === 'critical' ? 'alta' : 'media'
        });
      }
    });

    return recommendations;
  }

  // ═══════════════════════════════════════════════════════════════════
  // GESTIÓN DE MILESTONES
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Actualiza el estado de un milestone
   */
  updateMilestoneStatus(kpiSetId, phase, newStatus) {
    const kpiSet = this.kpiSets[kpiSetId];
    if (!kpiSet) {
      return { success: false, error: 'KPI set no encontrado' };
    }

    const milestone = kpiSet.milestones.find(m => m.phase === phase);
    if (!milestone) {
      return { success: false, error: 'Milestone no encontrado' };
    }

    milestone.status = newStatus;
    milestone.updatedAt = new Date().toISOString();

    return {
      success: true,
      milestone,
      completedMilestones: kpiSet.milestones.filter(m => m.status === 'completed').length,
      totalMilestones: kpiSet.milestones.length
    };
  }

  /**
   * Obtiene el siguiente milestone pendiente
   */
  getNextMilestone(kpiSetId) {
    const kpiSet = this.kpiSets[kpiSetId];
    if (!kpiSet) return null;

    return kpiSet.milestones.find(m => m.status === 'pending');
  }

  // ═══════════════════════════════════════════════════════════════════
  // EXPORTACIÓN DE DATOS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Exporta todas las métricas en formato JSON
   */
  exportMetrics() {
    return {
      exportId: `EXP-${Date.now()}`,
      exportedAt: new Date().toISOString(),
      config: this.config,
      kpiSets: this.kpiSets,
      history: this.metricsHistory,
      alerts: this.alerts
    };
  }

  /**
   * Genera datos para visualización en gráficos
   */
  getChartData(kpiSetId, metricId) {
    const history = this.metricsHistory
      .filter(h => h.kpiSetId === kpiSetId && h.metricId === metricId);

    return {
      labels: history.map(h => new Date(h.timestamp).toLocaleDateString()),
      values: history.map(h => h.newValue),
      target: this.kpiSets[kpiSetId]?.metrics.find(m => m.id === metricId)?.target
    };
  }

  /**
   * Obtiene resumen para notificaciones
   */
  getNotificationSummary() {
    const criticalAlerts = this.alerts.filter(a => a.type === 'critical');
    const behindMetrics = [];

    Object.values(this.kpiSets).forEach(kpiSet => {
      kpiSet.metrics.forEach(metric => {
        const progress = this.calculateProgress(metric);
        if (progress.status === 'critical' || progress.status === 'behind') {
          behindMetrics.push({
            kpiSet: kpiSet.name,
            metric: metric.name,
            progress: progress.percentage
          });
        }
      });
    });

    return {
      criticalAlertsCount: criticalAlerts.length,
      behindMetricsCount: behindMetrics.length,
      criticalAlerts,
      behindMetrics,
      requiresAttention: criticalAlerts.length > 0 || behindMetrics.length > 3
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// INSTANCIA EXPORTADA
// ═══════════════════════════════════════════════════════════════════

export const strategicMetricsSystem = new StrategicMetricsSystem();

export default {
  StrategicMetricsSystem,
  strategicMetricsSystem,
  STRATEGIC_METRICS_CONFIG,
  VERTICAL_SPECIALIZATION_KPIS,
  PARTNERSHIP_KPIS,
  AUTOMATION_KPIS,
  DIGITAL_ACQUISITION_KPIS
};
