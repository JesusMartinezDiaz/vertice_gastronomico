/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANÁLISIS COMPETITIVO REAL - SIN SUPOSICIONES
 * Vértice Gastronómico
 *
 * Fecha: 29 de Noviembre 2025
 * Basado en investigación de mercado real
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// DATOS DEL MERCADO REAL
// ═══════════════════════════════════════════════════════════════════════════

export const MARKET_DATA = {
  global: {
    restaurantManagementSoftware: {
      size2024: 5.79,  // USD Billones
      size2030: 14.70, // USD Billones
      cagr: 17.4,      // %
      source: 'Grand View Research 2024'
    },
    restaurantAI: {
      size2024: 9.68,  // USD Billones
      size2029: 49.0,  // USD Billones
      cagr: 38.3,      // % aproximado
      source: 'Slang AI Report 2024'
    },
    northAmericaShare: 32,  // % del mercado global
    asiaPacificGrowth: 20.4 // % CAGR más rápido
  },

  mexico: {
    restaurantes: 700000,  // Aproximado en México
    adoptionTech: 15,      // % que usa tecnología avanzada (estimado)
    growthOpportunity: 'ALTA'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPETIDORES GLOBALES - SOFTWARE/IA
// ═══════════════════════════════════════════════════════════════════════════

export const GLOBAL_COMPETITORS = {
  tier1_giants: [
    {
      name: 'Toast',
      type: 'Software + POS',
      founded: 2012,
      funding: '$900M+',
      valuation: '$30B+ (IPO 2021)',
      restaurants: 100000,
      features: [
        'POS integrado',
        'Gestión de inventarios (xtraCHEF)',
        'Analytics en tiempo real',
        'AI para upselling',
        'Automatización de cuentas por pagar'
      ],
      strengths: [
        'Ecosystem completo',
        'Escala masiva',
        'Integraciones extensas',
        'Datos de 100,000+ restaurantes'
      ],
      weaknesses: [
        'Enfocado en USA',
        'Precio alto para PyMEs',
        'No especializado en consultoría'
      ],
      threatToVertice: 'ALTA - Si entra a LATAM'
    },
    {
      name: 'Lightspeed',
      type: 'POS + Commerce',
      founded: 2005,
      funding: '$1.3B+',
      valuation: '$5B+ (público)',
      features: [
        'POS omnicanal',
        'Inventory management',
        'eCommerce integrado',
        'Analytics'
      ],
      strengths: [
        'Presencia global',
        'Multi-industria',
        'Robusto'
      ],
      weaknesses: [
        'Generalista, no especializado',
        'No enfocado en IA avanzada'
      ],
      threatToVertice: 'MEDIA'
    },
    {
      name: 'MarketMan',
      type: 'Inventory + Procurement',
      founded: 2012,
      features: [
        'Inventory tracking tiempo real',
        'Gestión de proveedores',
        'Costeo automático',
        'Integración con POS'
      ],
      strengths: [
        'Especializado en inventarios',
        'AI para recosteo de menús',
        'Fácil de usar'
      ],
      weaknesses: [
        'Solo inventarios, no consultoría integral'
      ],
      threatToVertice: 'MEDIA'
    },
    {
      name: 'Square/Block',
      type: 'Payments + POS',
      valuation: '$40B+',
      features: [
        'Pagos',
        'POS',
        'Payroll',
        'Préstamos'
      ],
      strengths: [
        'Ecosistema financiero completo',
        'Precio accesible'
      ],
      weaknesses: [
        'No especializado en restaurantes',
        'Sin consultoría'
      ],
      threatToVertice: 'BAJA'
    }
  ],

  tier2_specialized: [
    {
      name: 'Meez',
      type: 'Recipe Costing + AI',
      focus: 'Costeo de recetas con IA',
      threatToVertice: 'MEDIA - Nicho específico'
    },
    {
      name: 'Apicbase',
      type: 'Back-of-house',
      focus: 'Gestión de cocina y producción',
      threatToVertice: 'BAJA'
    },
    {
      name: 'BlueCart',
      type: 'Procurement',
      focus: 'Compras y proveedores',
      threatToVertice: 'BAJA'
    },
    {
      name: 'Fourth',
      type: 'Workforce + Inventory',
      focus: '25+ herramientas AI para restaurantes',
      threatToVertice: 'MEDIA'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPETIDORES DIRECTOS EN MÉXICO/LATAM - CONSULTORÍA TRADICIONAL
// ═══════════════════════════════════════════════════════════════════════════

export const LATAM_COMPETITORS = {
  mexico: [
    {
      name: 'Grupo Consultor Restaurantero (GCR)',
      url: 'grupoconsultorrestaurantero.com',
      experience: '22 años',
      operationalExperience: '30 años',
      clientsServed: 600,
      focus: 'Consultoría y coaching HORECA',
      strengths: [
        'Experiencia comprobada',
        'Red de contactos establecida',
        '600+ clientes atendidos',
        'Modelo tradicional validado'
      ],
      weaknesses: [
        'Sin tecnología IA',
        'Modelo manual',
        'Escalabilidad limitada'
      ],
      usesAI: false,
      marketPosition: 'LÍDER TRADICIONAL'
    },
    {
      name: 'Gastronomía Estratégica',
      url: 'gastronomiaestrategica.com',
      experience: '30 años',
      focus: 'Consultoría y asesoría especializada',
      strengths: [
        'Experiencia extensa',
        'Portafolio diversificado'
      ],
      weaknesses: [
        'Modelo tradicional',
        'Sin automatización'
      ],
      usesAI: false,
      marketPosition: 'ESTABLECIDO'
    },
    {
      name: 'Connega',
      url: 'connega.com',
      experience: '100+ restaurantes',
      focus: 'Control de costos y buffets',
      specialization: 'Sistema de control de costos',
      strengths: [
        'Especializado en costos',
        'Cursos y capacitación'
      ],
      weaknesses: [
        'Nicho específico',
        'Sin IA'
      ],
      usesAI: false,
      marketPosition: 'NICHO'
    },
    {
      name: 'Cateres Consultores',
      url: 'cateres.com',
      location: 'Monterrey',
      experience: '30 años',
      focus: 'Foodservice integral',
      strengths: [
        'Multidisciplinario',
        'Regional fuerte (NL)'
      ],
      weaknesses: [
        'Enfoque regional',
        'Modelo tradicional'
      ],
      usesAI: false,
      marketPosition: 'REGIONAL'
    },
    {
      name: 'TGJ Consulting',
      url: 'tgjconsulting.com',
      experience: '12 años',
      focus: 'F&B para hoteles y restaurantes',
      leader: 'Manu Balanzino',
      strengths: [
        'Especializado en hoteles',
        'Marca personal fuerte'
      ],
      weaknesses: [
        'Dependencia del líder',
        'Sin tecnología'
      ],
      usesAI: false,
      marketPosition: 'ESPECIALIZADO'
    },
    {
      name: 'NS Consultores Gastronómicos',
      url: 'nscgastronomicos.com',
      coverage: 'Latinoamérica y USA',
      focus: 'Desarrollo de mejoras operativas',
      strengths: [
        'Cobertura internacional',
        'Enfoque en resultados económicos'
      ],
      weaknesses: [
        'Sin diferenciador tecnológico claro'
      ],
      usesAI: false,
      marketPosition: 'INTERNACIONAL'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EVALUACIÓN REALISTA DE VÉRTICE GASTRONÓMICO
// ═══════════════════════════════════════════════════════════════════════════

export const VERTICE_REAL_ASSESSMENT = {
  currentStatus: {
    founded: 2024,      // Recién iniciando
    clients: 0,         // Sin clientes reales aún
    revenue: 0,         // Sin ingresos
    marketShare: 0,     // Sin participación de mercado
    brandRecognition: 'NINGUNA', // No conocidos
    partnerships: 0,    // Sin alianzas formales
    teamSize: 'INDEFINIDO'
  },

  capabilities: {
    technical: {
      agents: 72,
      description: '72 agentes IA especializados en gastronomía',
      status: 'EN DESARROLLO',
      readiness: 'MVP'
    },
    unique: [
      'Sistema multi-agente especializado en gastronomía',
      'Arquitectura moderna (React, Node.js, IA)',
      'Enfoque integral (72 áreas cubiertas)',
      'Potencial de escalabilidad'
    ],
    gaps: [
      'Sin validación de mercado',
      'Sin casos de éxito reales',
      'Sin testimonios de clientes',
      'Sin track record',
      'Sin equipo comercial',
      'Sin presencia de marca'
    ]
  },

  differentiators: {
    potential: [
      {
        factor: 'IA Multi-agente',
        description: '72 agentes vs 0 de competencia tradicional',
        validated: false,
        risk: 'ALTO - No probado en mercado real'
      },
      {
        factor: 'Automatización',
        description: 'Procesos automatizados vs consultoría manual',
        validated: false,
        risk: 'MEDIO - Depende de adopción del cliente'
      },
      {
        factor: 'Escalabilidad',
        description: 'Software vs servicios humanos',
        validated: false,
        risk: 'MEDIO - Requiere infraestructura'
      }
    ],
    real: []  // Ningún diferenciador validado aún
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ANÁLISIS COMPARATIVO REALISTA
// ═══════════════════════════════════════════════════════════════════════════

export const COMPETITIVE_MATRIX = {
  criteria: [
    {
      factor: 'Experiencia en mercado',
      weight: 20,
      scores: {
        GCR: 95,          // 22 años, 600 clientes
        GastronomiaEstrategica: 90,  // 30 años
        Toast: 85,        // 12 años, 100k restaurantes
        Cateres: 85,      // 30 años regional
        VerticeGastronomico: 5  // Nuevo, sin track record
      }
    },
    {
      factor: 'Tecnología IA',
      weight: 25,
      scores: {
        Toast: 80,        // IA integrada en POS
        MarketMan: 70,    // IA para costeo
        Fourth: 75,       // 25 tools AI
        VerticeGastronomico: 60,  // 72 agentes pero no validados
        GCR: 10,          // Tradicional
        GastronomiaEstrategica: 10,
        Cateres: 10
      }
    },
    {
      factor: 'Casos de éxito documentados',
      weight: 20,
      scores: {
        Toast: 95,        // 100,000+ restaurantes
        GCR: 90,          // 600 clientes
        GastronomiaEstrategica: 85,
        Cateres: 80,
        VerticeGastronomico: 0  // Ninguno aún
      }
    },
    {
      factor: 'Reconocimiento de marca',
      weight: 15,
      scores: {
        Toast: 95,
        Lightspeed: 85,
        GCR: 70,
        GastronomiaEstrategica: 65,
        VerticeGastronomico: 0
      }
    },
    {
      factor: 'Cobertura LATAM',
      weight: 10,
      scores: {
        NSConsultores: 80,
        GCR: 70,
        VerticeGastronomico: 0,  // Sin presencia
        Toast: 20          // USA focused
      }
    },
    {
      factor: 'Precio/Accesibilidad',
      weight: 10,
      scores: {
        VerticeGastronomico: 70,  // Potencialmente más accesible
        Square: 85,
        Toast: 40,        // Costoso
        GCR: 60           // Consultoría tradicional es cara
      }
    }
  ],

  calculateScore(competitor) {
    let totalScore = 0;
    this.criteria.forEach(c => {
      const score = c.scores[competitor] || 0;
      totalScore += (score * c.weight) / 100;
    });
    return Math.round(totalScore);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// POSICIÓN REAL EN EL MERCADO
// ═══════════════════════════════════════════════════════════════════════════

export const REAL_MARKET_POSITION = {
  vertice: {
    overallScore: 22,  // De 100
    position: 'ENTRANTE SIN VALIDACIÓN',
    ranking: 'NO CLASIFICADO',

    reality: {
      marketShare: '0%',
      brandAwareness: 'Nula',
      customerBase: 'Inexistente',
      revenue: '$0',
      validated: false
    },

    vsCompetitors: {
      vsTraditionalConsulting: {
        advantage: 'Tecnología potencial',
        disadvantage: 'Sin experiencia ni credibilidad',
        gap: 'ENORME - Necesitan décadas de track record'
      },
      vsGlobalSoftware: {
        advantage: 'Enfoque LATAM potencial',
        disadvantage: 'Sin recursos ni escala',
        gap: 'MASIVO - Miles de millones de diferencia'
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GAPS REALES A CERRAR
// ═══════════════════════════════════════════════════════════════════════════

export const REAL_GAPS = {
  critical: [
    {
      id: 'validation',
      name: 'Validación de Mercado',
      current: 0,
      required: 100,
      gap: 100,
      priority: 'CRÍTICA',
      action: 'Conseguir primeros clientes beta',
      timeframe: 'Inmediato'
    },
    {
      id: 'revenue',
      name: 'Generación de Ingresos',
      current: 0,
      required: 100,
      gap: 100,
      priority: 'CRÍTICA',
      action: 'Cerrar primeras ventas',
      timeframe: '1-3 meses'
    },
    {
      id: 'cases',
      name: 'Casos de Éxito',
      current: 0,
      required: 3,
      gap: 3,
      priority: 'CRÍTICA',
      action: 'Documentar resultados con primeros clientes',
      timeframe: '3-6 meses'
    }
  ],

  important: [
    {
      id: 'team',
      name: 'Equipo Comercial',
      current: 0,
      required: 3,
      gap: 3,
      priority: 'ALTA',
      action: 'Contratar vendedores especializados'
    },
    {
      id: 'brand',
      name: 'Presencia de Marca',
      current: 0,
      required: 50,
      gap: 50,
      priority: 'ALTA',
      action: 'Marketing digital, contenido, eventos'
    },
    {
      id: 'partnerships',
      name: 'Alianzas Estratégicas',
      current: 0,
      required: 5,
      gap: 5,
      priority: 'ALTA',
      action: 'Acercamiento a asociaciones y consultoras'
    }
  ],

  product: [
    {
      id: 'mvp_completion',
      name: 'Completar MVP funcional',
      current: 70,  // Estimado
      required: 100,
      gap: 30,
      priority: 'ALTA'
    },
    {
      id: 'testing',
      name: 'Pruebas con usuarios reales',
      current: 0,
      required: 100,
      gap: 100,
      priority: 'CRÍTICA'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// PLAN DE ACCIÓN REALISTA
// ═══════════════════════════════════════════════════════════════════════════

export const REALISTIC_ACTION_PLAN = {
  phase1_validation: {
    name: 'VALIDACIÓN (0-3 meses)',
    objective: 'Probar producto con clientes reales',
    actions: [
      {
        action: 'Conseguir 3-5 restaurantes beta GRATUITOS',
        why: 'Validar que el producto funciona',
        metric: 'Restaurantes usando la plataforma'
      },
      {
        action: 'Medir resultados concretos',
        why: 'Crear casos de éxito reales',
        metric: '% mejora en costos/eficiencia'
      },
      {
        action: 'Recopilar feedback',
        why: 'Iterar producto',
        metric: 'NPS de usuarios beta'
      }
    ],
    success: 'Al menos 1 cliente dispuesto a pagar'
  },

  phase2_firstRevenue: {
    name: 'PRIMEROS INGRESOS (3-6 meses)',
    objective: 'Generar revenue inicial',
    actions: [
      {
        action: 'Convertir betas en clientes pagos',
        metric: 'MRR > $0'
      },
      {
        action: 'Documentar 3 casos de éxito',
        metric: 'Casos publicables'
      },
      {
        action: 'Definir pricing validado',
        metric: 'Precio que clientes paguen'
      }
    ],
    success: 'MRR de $5,000-10,000 USD'
  },

  phase3_growth: {
    name: 'CRECIMIENTO (6-12 meses)',
    objective: 'Escalar con modelo validado',
    actions: [
      {
        action: 'Contratar primer vendedor',
        metric: '1 FTE comercial'
      },
      {
        action: 'Marketing de contenidos',
        metric: 'Leads orgánicos'
      },
      {
        action: 'Primera alianza estratégica',
        metric: '1 partner referidor'
      }
    ],
    success: '20-50 clientes, MRR $30,000+'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export class RealCompetitiveAnalysis {
  constructor() {
    this.marketData = MARKET_DATA;
    this.globalCompetitors = GLOBAL_COMPETITORS;
    this.latamCompetitors = LATAM_COMPETITORS;
    this.verticeAssessment = VERTICE_REAL_ASSESSMENT;
    this.competitiveMatrix = COMPETITIVE_MATRIX;
    this.realPosition = REAL_MARKET_POSITION;
    this.realGaps = REAL_GAPS;
    this.actionPlan = REALISTIC_ACTION_PLAN;
  }

  /**
   * Genera reporte ejecutivo realista
   */
  generateRealityReport() {
    return {
      reportId: `REALITY-${Date.now()}`,
      generatedAt: new Date().toISOString(),

      executiveSummary: {
        title: 'ANÁLISIS REALISTA DE POSICIÓN COMPETITIVA',
        status: 'STARTUP SIN VALIDACIÓN DE MERCADO',
        marketShare: '0%',
        revenue: '$0',
        clients: 0,
        brandRecognition: 'Ninguna'
      },

      marketContext: {
        globalMarketSize: `$${this.marketData.global.restaurantManagementSoftware.size2024}B (2024)`,
        aiMarketSize: `$${this.marketData.global.restaurantAI.size2024}B (2024)`,
        growth: `${this.marketData.global.restaurantManagementSoftware.cagr}% CAGR`,
        opportunity: 'Mercado grande y creciente, pero altamente competitivo'
      },

      competitorAnalysis: {
        global: {
          leaders: ['Toast (100k+ restaurants)', 'Lightspeed', 'Square'],
          threat: 'ALTA si entran agresivamente a LATAM'
        },
        latam: {
          leaders: ['GCR (22 años, 600 clientes)', 'Gastronomía Estratégica (30 años)'],
          characteristics: 'Tradicionales, sin IA, pero con credibilidad establecida'
        }
      },

      verticePosition: {
        score: 22,
        outOf: 100,
        ranking: 'ENTRANTE NO VALIDADO',
        strengths: [
          'Tecnología innovadora (72 agentes IA)',
          'Enfoque integral',
          'Escalabilidad potencial'
        ],
        criticalWeaknesses: [
          'CERO clientes',
          'CERO revenue',
          'CERO casos de éxito',
          'CERO reconocimiento de marca',
          'Producto no validado en mercado real'
        ]
      },

      immediateActions: [
        '1. CONSEGUIR PRIMEROS CLIENTES BETA (aunque sean gratis)',
        '2. VALIDAR que el producto realmente funciona',
        '3. MEDIR resultados concretos y documentarlos',
        '4. GENERAR primer ingreso real',
        '5. CONSTRUIR credibilidad con casos reales'
      ],

      honestConclusion: `
        Vértice Gastronómico tiene tecnología innovadora pero CERO validación
        de mercado. Competir contra consultoras con 20-30 años de experiencia
        y contra gigantes como Toast requiere primero PROBAR que el producto
        funciona con clientes reales. El focus debe ser 100% en conseguir los
        primeros 3-5 clientes y demostrar resultados medibles.
      `.trim()
    };
  }

  /**
   * Obtiene gaps prioritarios
   */
  getPriorityGaps() {
    return {
      mustFix: this.realGaps.critical,
      shouldFix: this.realGaps.important,
      product: this.realGaps.product
    };
  }

  /**
   * Obtiene plan de acción inmediato
   */
  getImmediateActions() {
    return this.actionPlan.phase1_validation;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INSTANCIA EXPORTADA
// ═══════════════════════════════════════════════════════════════════════════

export const realCompetitiveAnalysis = new RealCompetitiveAnalysis();

export default {
  RealCompetitiveAnalysis,
  realCompetitiveAnalysis,
  MARKET_DATA,
  GLOBAL_COMPETITORS,
  LATAM_COMPETITORS,
  VERTICE_REAL_ASSESSMENT,
  COMPETITIVE_MATRIX,
  REAL_MARKET_POSITION,
  REAL_GAPS,
  REALISTIC_ACTION_PLAN
};
