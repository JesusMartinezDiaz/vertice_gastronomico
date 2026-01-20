/**
 * SISTEMA DE PREPARACIÓN ESTRATÉGICA DE ALTO NIVEL
 * Vértice Gastronómico - Alcanzar 95%+ de Índice de Preparación Estratégica
 *
 * Estado Actual: 78% | Benchmark Industria: 65% | Objetivo: 95%+
 *
 * Este sistema implementa las mejores prácticas para alcanzar
 * el máximo nivel de preparación estratégica.
 *
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════
// MODELO DE MADUREZ ESTRATÉGICA
// ═══════════════════════════════════════════════════════════════════

export const STRATEGIC_MATURITY_MODEL = {
  levels: {
    INICIAL: { min: 0, max: 40, label: 'Inicial', color: '#ef4444' },
    EN_DESARROLLO: { min: 41, max: 60, label: 'En Desarrollo', color: '#f97316' },
    DEFINIDO: { min: 61, max: 75, label: 'Definido', color: '#eab308' },
    GESTIONADO: { min: 76, max: 85, label: 'Gestionado', color: '#22c55e' },
    OPTIMIZADO: { min: 86, max: 95, label: 'Optimizado', color: '#3b82f6' },
    ELITE: { min: 96, max: 100, label: 'Élite', color: '#8b5cf6' }
  },

  currentLevel: 'GESTIONADO',  // 78%
  targetLevel: 'ELITE'         // 95%+
};

// ═══════════════════════════════════════════════════════════════════
// PILARES DE PREPARACIÓN ESTRATÉGICA
// ═══════════════════════════════════════════════════════════════════

export const STRATEGIC_PILLARS = {
  // PILAR 1: Capacidades Organizacionales
  organizationalCapabilities: {
    id: 'org_capabilities',
    name: 'Capacidades Organizacionales',
    weight: 20,  // 20% del índice total
    currentScore: 85,
    targetScore: 98,

    components: [
      {
        id: 'agent_portfolio',
        name: 'Portafolio de Agentes IA',
        description: '72 agentes especializados',
        currentScore: 95,
        targetScore: 100,
        actions: [
          'Completar cobertura de 100% de áreas gastronómicas',
          'Implementar agentes predictivos para tendencias',
          'Desarrollar agentes de integración cross-funcional'
        ]
      },
      {
        id: 'process_maturity',
        name: 'Madurez de Procesos',
        currentScore: 80,
        targetScore: 95,
        actions: [
          'Documentar todos los procesos críticos',
          'Implementar mejora continua Kaizen',
          'Establecer ciclos PDCA automatizados'
        ]
      },
      {
        id: 'knowledge_management',
        name: 'Gestión del Conocimiento',
        currentScore: 75,
        targetScore: 98,
        actions: [
          'Crear base de conocimiento centralizada',
          'Implementar transferencia automática entre agentes',
          'Desarrollar sistema de lecciones aprendidas'
        ]
      },
      {
        id: 'talent_development',
        name: 'Desarrollo de Talento',
        currentScore: 70,
        targetScore: 95,
        actions: [
          'Programa de certificación en IA gastronómica',
          'Rotación cross-funcional de equipos',
          'Academia interna Vértice'
        ]
      }
    ]
  },

  // PILAR 2: Posicionamiento de Mercado
  marketPositioning: {
    id: 'market_positioning',
    name: 'Posicionamiento de Mercado',
    weight: 25,  // 25% del índice total
    currentScore: 72,
    targetScore: 95,

    components: [
      {
        id: 'market_share',
        name: 'Participación de Mercado',
        description: 'Actual: 12% | Objetivo: 35%',
        currentScore: 60,
        targetScore: 90,
        actions: [
          'Expansión a 3 nuevos mercados verticales',
          'Alianzas con 10+ cadenas de restaurantes',
          'Penetración en fintech y healthtech gastronómico'
        ]
      },
      {
        id: 'brand_recognition',
        name: 'Reconocimiento de Marca',
        currentScore: 65,
        targetScore: 95,
        actions: [
          'Programa de thought leadership',
          'Publicaciones en medios especializados',
          'Participación en eventos de la industria'
        ]
      },
      {
        id: 'competitive_advantage',
        name: 'Ventaja Competitiva',
        description: '72 agentes especializados = diferenciador único',
        currentScore: 90,
        targetScore: 98,
        actions: [
          'Patentar metodologías propietarias',
          'Desarrollar algoritmos exclusivos',
          'Crear barreras de entrada tecnológicas'
        ]
      },
      {
        id: 'customer_loyalty',
        name: 'Lealtad del Cliente',
        description: '68% clientes por referidos',
        currentScore: 85,
        targetScore: 95,
        actions: [
          'NPS > 75 en todos los segmentos',
          'Programa de embajadores de marca',
          'Casos de éxito documentados por vertical'
        ]
      }
    ]
  },

  // PILAR 3: Innovación y Tecnología
  innovationTechnology: {
    id: 'innovation_tech',
    name: 'Innovación y Tecnología',
    weight: 25,  // 25% del índice total
    currentScore: 82,
    targetScore: 98,

    components: [
      {
        id: 'ai_capabilities',
        name: 'Capacidades de IA',
        currentScore: 88,
        targetScore: 99,
        actions: [
          'Integrar modelos de última generación',
          'Desarrollar IA generativa especializada',
          'Implementar aprendizaje federado'
        ]
      },
      {
        id: 'automation_level',
        name: 'Nivel de Automatización',
        currentScore: 75,
        targetScore: 95,
        actions: [
          'Automatizar 95% de procesos repetitivos',
          'Implementar RPA para integraciones',
          'Crear workflows self-healing'
        ]
      },
      {
        id: 'data_analytics',
        name: 'Analítica de Datos',
        currentScore: 80,
        targetScore: 98,
        actions: [
          'Real-time analytics para todos los agentes',
          'Predictive analytics para demanda',
          'Prescriptive analytics para decisiones'
        ]
      },
      {
        id: 'innovation_pipeline',
        name: 'Pipeline de Innovación',
        currentScore: 70,
        targetScore: 95,
        actions: [
          'Laboratorio de innovación interno',
          'Hackathons trimestrales',
          'Partnerships con universidades'
        ]
      }
    ]
  },

  // PILAR 4: Gestión Financiera
  financialManagement: {
    id: 'financial_mgmt',
    name: 'Gestión Financiera',
    weight: 15,  // 15% del índice total
    currentScore: 80,
    targetScore: 95,

    components: [
      {
        id: 'revenue_growth',
        name: 'Crecimiento de Ingresos',
        description: 'Actual: 45% anual vs Industria: 25%',
        currentScore: 90,
        targetScore: 95,
        actions: [
          'Mantener crecimiento > 40% anual',
          'Diversificar fuentes de ingreso',
          'Modelo de ingresos recurrentes > 70%'
        ]
      },
      {
        id: 'roi_initiatives',
        name: 'ROI por Iniciativa',
        description: 'Actual: 185%',
        currentScore: 85,
        targetScore: 95,
        actions: [
          'ROI mínimo 150% por proyecto',
          'Tiempo de recuperación < 6 meses',
          'Métricas de valor claras'
        ]
      },
      {
        id: 'cost_efficiency',
        name: 'Eficiencia en Costos',
        currentScore: 75,
        targetScore: 92,
        actions: [
          'Reducir CAC en 50%',
          'Optimizar operaciones con IA',
          'Economías de escala en infraestructura'
        ]
      },
      {
        id: 'investment_capacity',
        name: 'Capacidad de Inversión',
        currentScore: 70,
        targetScore: 90,
        actions: [
          'Fondo de innovación dedicado',
          'Partnerships estratégicos de inversión',
          'Reinversión del 30% de utilidades'
        ]
      }
    ]
  },

  // PILAR 5: Alianzas Estratégicas
  strategicAlliances: {
    id: 'strategic_alliances',
    name: 'Alianzas Estratégicas',
    weight: 15,  // 15% del índice total
    currentScore: 65,
    targetScore: 95,

    components: [
      {
        id: 'partner_ecosystem',
        name: 'Ecosistema de Partners',
        description: 'Programa piloto con 3 consultoras',
        currentScore: 50,
        targetScore: 95,
        actions: [
          'Red de 15+ partners estratégicos',
          'Programa de certificación de partners',
          'Revenue sharing estructurado'
        ]
      },
      {
        id: 'technology_partners',
        name: 'Partners Tecnológicos',
        currentScore: 70,
        targetScore: 95,
        actions: [
          'Alianzas con proveedores de IA',
          'Integraciones con ERPs líderes',
          'Partnerships con cloud providers'
        ]
      },
      {
        id: 'industry_associations',
        name: 'Asociaciones de la Industria',
        currentScore: 60,
        targetScore: 90,
        actions: [
          'Membresía en 5+ asociaciones clave',
          'Participación en comités directivos',
          'Co-creación de estándares de la industria'
        ]
      },
      {
        id: 'academic_partnerships',
        name: 'Alianzas Académicas',
        currentScore: 55,
        targetScore: 90,
        actions: [
          'Convenios con 3+ universidades',
          'Programas de investigación conjunta',
          'Pipeline de talento especializado'
        ]
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// GAPS CRÍTICOS Y PLAN DE CIERRE
// ═══════════════════════════════════════════════════════════════════

export const CRITICAL_GAPS = {
  summary: {
    currentScore: 78,
    targetScore: 95,
    gap: 17,
    estimatedTimeToClose: '6-9 meses'
  },

  prioritizedGaps: [
    {
      id: 'gap_1',
      area: 'Ecosistema de Partners',
      currentScore: 50,
      targetScore: 95,
      gap: 45,
      priority: 'CRÍTICA',
      impact: 'ALTO',
      effort: 'MEDIO',
      quickWins: [
        'Firmar acuerdo con primera consultora estratégica',
        'Lanzar programa de referidos formal',
        'Crear kit de onboarding para partners'
      ],
      roadmap: [
        { phase: 'Mes 1-2', action: 'Identificar y contactar 10 consultoras potenciales' },
        { phase: 'Mes 3-4', action: 'Cerrar 3 acuerdos piloto' },
        { phase: 'Mes 5-6', action: 'Escalar a 10+ partners activos' }
      ]
    },
    {
      id: 'gap_2',
      area: 'Participación de Mercado',
      currentScore: 60,
      targetScore: 90,
      gap: 30,
      priority: 'CRÍTICA',
      impact: 'MUY ALTO',
      effort: 'ALTO',
      quickWins: [
        'Lanzar campaña de adquisición digital',
        'Crear casos de éxito por vertical',
        'Programa de prueba gratuita de 30 días'
      ],
      roadmap: [
        { phase: 'Q1', action: 'Penetrar mercado fintech gastronómico' },
        { phase: 'Q2', action: 'Expansión healthtech y ghost kitchens' },
        { phase: 'Q3-Q4', action: 'Consolidar 25%+ market share' }
      ]
    },
    {
      id: 'gap_3',
      area: 'Alianzas Académicas',
      currentScore: 55,
      targetScore: 90,
      gap: 35,
      priority: 'ALTA',
      impact: 'MEDIO',
      effort: 'BAJO',
      quickWins: [
        'Contactar 5 universidades con programas de gastronomía',
        'Ofrecer charlas y workshops gratuitos',
        'Crear programa de becarios'
      ],
      roadmap: [
        { phase: 'Mes 1', action: 'Establecer contacto inicial' },
        { phase: 'Mes 2-3', action: 'Firmar convenios marco' },
        { phase: 'Mes 4-6', action: 'Iniciar proyectos de investigación' }
      ]
    },
    {
      id: 'gap_4',
      area: 'Asociaciones de la Industria',
      currentScore: 60,
      targetScore: 90,
      gap: 30,
      priority: 'ALTA',
      impact: 'MEDIO',
      effort: 'BAJO',
      quickWins: [
        'Unirse a CANIRAC y asociaciones relevantes',
        'Participar en próximos 3 eventos de la industria',
        'Publicar artículos de liderazgo de pensamiento'
      ],
      roadmap: [
        { phase: 'Inmediato', action: 'Solicitar membresías' },
        { phase: 'Mes 1-2', action: 'Participación activa en comités' },
        { phase: 'Mes 3-6', action: 'Posicionarse como referente' }
      ]
    },
    {
      id: 'gap_5',
      area: 'Reconocimiento de Marca',
      currentScore: 65,
      targetScore: 95,
      gap: 30,
      priority: 'MEDIA',
      impact: 'ALTO',
      effort: 'MEDIO',
      quickWins: [
        'Crear blog con contenido de valor',
        'Webinars mensuales gratuitos',
        'Presencia activa en LinkedIn'
      ],
      roadmap: [
        { phase: 'Mes 1', action: 'Estrategia de contenido' },
        { phase: 'Mes 2-3', action: 'Campaña de awareness' },
        { phase: 'Mes 4-6', action: 'PR y medios especializados' }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// PLAN DE ACCIÓN PARA 95%+
// ═══════════════════════════════════════════════════════════════════

export const ELITE_ACTION_PLAN = {
  phases: [
    {
      phase: 'FASE 1: FUNDAMENTOS',
      duration: 'Meses 1-2',
      targetScore: 82,
      objectives: [
        'Cerrar gaps críticos en alianzas',
        'Establecer métricas y dashboards',
        'Quick wins en todas las áreas'
      ],
      actions: [
        { action: 'Firmar 3 partnerships estratégicos', owner: 'CEO', deadline: 'Mes 2' },
        { action: 'Implementar sistema de métricas', owner: 'CTO', deadline: 'Mes 1' },
        { action: 'Lanzar programa de embajadores', owner: 'Marketing', deadline: 'Mes 2' },
        { action: 'Unirse a 3 asociaciones industriales', owner: 'BD', deadline: 'Mes 1' }
      ],
      kpis: [
        { metric: 'Partners activos', target: 3 },
        { metric: 'Membresías asociaciones', target: 3 },
        { metric: 'Casos de éxito publicados', target: 5 }
      ]
    },
    {
      phase: 'FASE 2: ACELERACIÓN',
      duration: 'Meses 3-4',
      targetScore: 87,
      objectives: [
        'Escalar partnerships',
        'Penetrar nuevos mercados verticales',
        'Fortalecer capacidades tecnológicas'
      ],
      actions: [
        { action: 'Escalar a 8+ partners', owner: 'BD', deadline: 'Mes 4' },
        { action: 'Lanzar vertical fintech', owner: 'Producto', deadline: 'Mes 3' },
        { action: 'Implementar analytics avanzado', owner: 'CTO', deadline: 'Mes 4' },
        { action: 'Programa de certificación partners', owner: 'Operaciones', deadline: 'Mes 4' }
      ],
      kpis: [
        { metric: 'Partners activos', target: 8 },
        { metric: 'Clientes nuevos verticales', target: 10 },
        { metric: 'NPS promedio', target: 70 }
      ]
    },
    {
      phase: 'FASE 3: CONSOLIDACIÓN',
      duration: 'Meses 5-6',
      targetScore: 92,
      objectives: [
        'Consolidar liderazgo de mercado',
        'Optimizar operaciones',
        'Escalar innovación'
      ],
      actions: [
        { action: 'Alcanzar 15+ partners', owner: 'BD', deadline: 'Mes 6' },
        { action: 'Market share 25%', owner: 'Ventas', deadline: 'Mes 6' },
        { action: 'Lanzar laboratorio de innovación', owner: 'CTO', deadline: 'Mes 5' },
        { action: 'Certificar equipo interno', owner: 'RRHH', deadline: 'Mes 6' }
      ],
      kpis: [
        { metric: 'Market share', target: 25 },
        { metric: 'ROI promedio', target: 200 },
        { metric: 'Automatización', target: 85 }
      ]
    },
    {
      phase: 'FASE 4: ÉLITE',
      duration: 'Meses 7-9',
      targetScore: 95,
      objectives: [
        'Alcanzar nivel élite',
        'Establecer barreras de entrada',
        'Liderazgo indiscutible'
      ],
      actions: [
        { action: 'Red de 20+ partners', owner: 'BD', deadline: 'Mes 9' },
        { action: 'Market share 35%', owner: 'Ventas', deadline: 'Mes 9' },
        { action: '5 patentes/IP registrados', owner: 'Legal', deadline: 'Mes 9' },
        { action: 'Premio/reconocimiento industria', owner: 'Marketing', deadline: 'Mes 8' }
      ],
      kpis: [
        { metric: 'Índice preparación', target: 95 },
        { metric: 'Market share', target: 35 },
        { metric: 'NPS', target: 80 }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL DEL SISTEMA
// ═══════════════════════════════════════════════════════════════════

export class StrategicReadinessSystem {
  constructor() {
    this.version = '1.0.0';
    this.pillars = STRATEGIC_PILLARS;
    this.maturityModel = STRATEGIC_MATURITY_MODEL;
    this.gaps = CRITICAL_GAPS;
    this.actionPlan = ELITE_ACTION_PLAN;
    this.history = [];
  }

  /**
   * Calcula el índice de preparación estratégica actual
   */
  calculateStrategicReadinessIndex() {
    let totalWeightedScore = 0;

    Object.values(this.pillars).forEach(pillar => {
      const pillarScore = this.calculatePillarScore(pillar);
      totalWeightedScore += pillarScore * (pillar.weight / 100);
    });

    return {
      currentIndex: Math.round(totalWeightedScore),
      targetIndex: 95,
      gap: 95 - Math.round(totalWeightedScore),
      maturityLevel: this.getMaturityLevel(totalWeightedScore),
      pillarScores: this.getAllPillarScores(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calcula el score de un pilar
   */
  calculatePillarScore(pillar) {
    const componentScores = pillar.components.map(c => c.currentScore);
    return componentScores.reduce((a, b) => a + b, 0) / componentScores.length;
  }

  /**
   * Obtiene todos los scores de pilares
   */
  getAllPillarScores() {
    const scores = {};
    Object.entries(this.pillars).forEach(([key, pillar]) => {
      scores[key] = {
        name: pillar.name,
        currentScore: Math.round(this.calculatePillarScore(pillar)),
        targetScore: pillar.targetScore,
        gap: pillar.targetScore - Math.round(this.calculatePillarScore(pillar)),
        weight: pillar.weight
      };
    });
    return scores;
  }

  /**
   * Obtiene el nivel de madurez
   */
  getMaturityLevel(score) {
    for (const [level, config] of Object.entries(this.maturityModel.levels)) {
      if (score >= config.min && score <= config.max) {
        return {
          level,
          label: config.label,
          color: config.color,
          nextLevel: this.getNextLevel(level)
        };
      }
    }
    return null;
  }

  /**
   * Obtiene el siguiente nivel
   */
  getNextLevel(currentLevel) {
    const levels = Object.keys(this.maturityModel.levels);
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      return {
        level: nextLevel,
        ...this.maturityModel.levels[nextLevel]
      };
    }
    return null;
  }

  /**
   * Actualiza el score de un componente
   */
  updateComponentScore(pillarId, componentId, newScore) {
    const pillar = this.pillars[pillarId];
    if (!pillar) return { success: false, error: 'Pilar no encontrado' };

    const component = pillar.components.find(c => c.id === componentId);
    if (!component) return { success: false, error: 'Componente no encontrado' };

    const previousScore = component.currentScore;
    component.currentScore = newScore;

    this.history.push({
      timestamp: new Date().toISOString(),
      pillarId,
      componentId,
      previousScore,
      newScore,
      change: newScore - previousScore
    });

    return {
      success: true,
      previousScore,
      newScore,
      newPillarScore: this.calculatePillarScore(pillar),
      newOverallIndex: this.calculateStrategicReadinessIndex()
    };
  }

  /**
   * Genera reporte de progreso
   */
  generateProgressReport() {
    const currentIndex = this.calculateStrategicReadinessIndex();

    return {
      reportId: `PROG-${Date.now()}`,
      generatedAt: new Date().toISOString(),

      executiveSummary: {
        currentIndex: currentIndex.currentIndex,
        targetIndex: 95,
        gap: currentIndex.gap,
        maturityLevel: currentIndex.maturityLevel,
        industryBenchmark: 65,
        aboveBenchmark: currentIndex.currentIndex - 65
      },

      pillarAnalysis: Object.entries(this.pillars).map(([key, pillar]) => ({
        id: key,
        name: pillar.name,
        weight: pillar.weight,
        currentScore: Math.round(this.calculatePillarScore(pillar)),
        targetScore: pillar.targetScore,
        status: this.getPillarStatus(pillar),
        criticalComponents: pillar.components
          .filter(c => c.targetScore - c.currentScore > 20)
          .map(c => ({
            name: c.name,
            gap: c.targetScore - c.currentScore,
            topAction: c.actions[0]
          }))
      })),

      criticalGaps: this.gaps.prioritizedGaps.slice(0, 5),

      nextActions: this.getTopActions(10),

      projectedTimeline: this.actionPlan.phases.map(p => ({
        phase: p.phase,
        duration: p.duration,
        targetScore: p.targetScore,
        keyObjective: p.objectives[0]
      }))
    };
  }

  /**
   * Obtiene el estado de un pilar
   */
  getPillarStatus(pillar) {
    const score = this.calculatePillarScore(pillar);
    const gap = pillar.targetScore - score;

    if (gap <= 5) return { status: 'ON_TRACK', label: 'En Camino', color: '#22c55e' };
    if (gap <= 15) return { status: 'NEEDS_ATTENTION', label: 'Requiere Atención', color: '#eab308' };
    if (gap <= 25) return { status: 'AT_RISK', label: 'En Riesgo', color: '#f97316' };
    return { status: 'CRITICAL', label: 'Crítico', color: '#ef4444' };
  }

  /**
   * Obtiene las acciones prioritarias
   */
  getTopActions(limit = 10) {
    const actions = [];

    // Recopilar acciones de gaps críticos
    this.gaps.prioritizedGaps.forEach(gap => {
      gap.quickWins.forEach((qw, i) => {
        actions.push({
          action: qw,
          area: gap.area,
          priority: gap.priority,
          impact: gap.impact,
          type: 'QUICK_WIN'
        });
      });
    });

    // Recopilar acciones del plan
    this.actionPlan.phases[0].actions.forEach(a => {
      actions.push({
        action: a.action,
        owner: a.owner,
        deadline: a.deadline,
        type: 'PHASE_1'
      });
    });

    return actions.slice(0, limit);
  }

  /**
   * Simula escenario de mejora
   */
  simulateImprovement(improvements) {
    const simulation = { ...this.calculateStrategicReadinessIndex() };

    improvements.forEach(imp => {
      const pillar = this.pillars[imp.pillarId];
      if (pillar) {
        const component = pillar.components.find(c => c.id === imp.componentId);
        if (component) {
          const improvement = imp.newScore - component.currentScore;
          simulation.currentIndex += (improvement * pillar.weight) / 100 / pillar.components.length;
        }
      }
    });

    return {
      currentIndex: this.calculateStrategicReadinessIndex().currentIndex,
      simulatedIndex: Math.round(simulation.currentIndex),
      potentialGain: Math.round(simulation.currentIndex) - this.calculateStrategicReadinessIndex().currentIndex,
      wouldReachTarget: simulation.currentIndex >= 95
    };
  }

  /**
   * Genera dashboard ejecutivo
   */
  generateExecutiveDashboard() {
    const index = this.calculateStrategicReadinessIndex();

    return {
      dashboardId: `DASH-${Date.now()}`,
      timestamp: new Date().toISOString(),

      headline: {
        currentIndex: index.currentIndex,
        target: 95,
        gap: index.gap,
        maturity: index.maturityLevel.label,
        vsIndustry: `+${index.currentIndex - 65} puntos vs industria`
      },

      scorecard: {
        pillars: index.pillarScores,
        overallHealth: index.currentIndex >= 85 ? 'SALUDABLE' :
                      index.currentIndex >= 70 ? 'ESTABLE' : 'REQUIERE_ATENCION'
      },

      topPriorities: this.getTopActions(5),

      roadmapStatus: {
        currentPhase: this.getCurrentPhase(index.currentIndex),
        nextMilestone: this.getNextMilestone(index.currentIndex),
        estimatedCompletion: this.getEstimatedCompletion(index.currentIndex)
      },

      alerts: this.generateAlerts()
    };
  }

  /**
   * Obtiene la fase actual
   */
  getCurrentPhase(score) {
    if (score < 82) return this.actionPlan.phases[0];
    if (score < 87) return this.actionPlan.phases[1];
    if (score < 92) return this.actionPlan.phases[2];
    return this.actionPlan.phases[3];
  }

  /**
   * Obtiene el siguiente hito
   */
  getNextMilestone(score) {
    if (score < 82) return { target: 82, label: 'Completar Fase 1: Fundamentos' };
    if (score < 87) return { target: 87, label: 'Completar Fase 2: Aceleración' };
    if (score < 92) return { target: 92, label: 'Completar Fase 3: Consolidación' };
    if (score < 95) return { target: 95, label: 'Alcanzar Nivel Élite' };
    return { target: 100, label: 'Mantener Excelencia' };
  }

  /**
   * Estima tiempo de completación
   */
  getEstimatedCompletion(score) {
    const gap = 95 - score;
    const monthsPerPoint = 0.5;  // Aproximadamente 2 puntos por mes
    const months = Math.ceil(gap * monthsPerPoint);
    return `${months} meses aproximadamente`;
  }

  /**
   * Genera alertas
   */
  generateAlerts() {
    const alerts = [];

    Object.entries(this.pillars).forEach(([key, pillar]) => {
      pillar.components.forEach(component => {
        const gap = component.targetScore - component.currentScore;
        if (gap > 30) {
          alerts.push({
            type: 'CRITICAL',
            component: component.name,
            pillar: pillar.name,
            gap,
            message: `Gap crítico de ${gap} puntos requiere acción inmediata`
          });
        } else if (gap > 20) {
          alerts.push({
            type: 'WARNING',
            component: component.name,
            pillar: pillar.name,
            gap,
            message: `Gap significativo de ${gap} puntos`
          });
        }
      });
    });

    return alerts.sort((a, b) => b.gap - a.gap);
  }

  /**
   * Exporta datos completos
   */
  exportFullData() {
    return {
      exportId: `EXP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      currentIndex: this.calculateStrategicReadinessIndex(),
      pillars: this.pillars,
      maturityModel: this.maturityModel,
      gaps: this.gaps,
      actionPlan: this.actionPlan,
      history: this.history
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// INSTANCIA EXPORTADA
// ═══════════════════════════════════════════════════════════════════

export const strategicReadinessSystem = new StrategicReadinessSystem();

export default {
  StrategicReadinessSystem,
  strategicReadinessSystem,
  STRATEGIC_MATURITY_MODEL,
  STRATEGIC_PILLARS,
  CRITICAL_GAPS,
  ELITE_ACTION_PLAN
};
