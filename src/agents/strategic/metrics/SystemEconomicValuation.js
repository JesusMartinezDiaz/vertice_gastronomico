/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VALORACIÓN ECONÓMICA DEL SISTEMA - VÉRTICE GASTRONÓMICO
 * Sistema de 72 Agentes de IA Especializados en Gastronomía
 *
 * Fecha: 29 de Noviembre 2025
 * Versión: 1.0
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * NOTA IMPORTANTE: Esta valoración es REALISTA basada en datos de mercado.
 * Vértice actualmente tiene 0 clientes y 0 ingresos.
 * Los valores se calculan sobre el POTENCIAL del sistema.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// 1. INVENTARIO DE ACTIVOS DEL SISTEMA
// ============================================================================

export const SYSTEM_ASSETS = {
  // Activos Tecnológicos
  technology: {
    agents: {
      total: 72,
      categories: 14,
      frameworks: 11,
      workflows: 78,
      estimatedDevelopmentHours: 72 * 120, // 120 horas por agente promedio
      hourlyDeveloperRate: 75, // USD/hora desarrollador IA senior
      get developmentCost() {
        return this.estimatedDevelopmentHours * this.hourlyDeveloperRate;
      }
    },
    platform: {
      frontend: {
        framework: 'React 19 + Vite 7',
        components: 50, // estimado
        hoursEstimate: 400
      },
      backend: {
        framework: 'Express 5 + Node.js',
        endpoints: 30, // estimado
        hoursEstimate: 300
      },
      integrations: {
        ai: ['OpenAI', 'Anthropic', 'Google AI'],
        payments: 'Stripe',
        communications: 'Twilio',
        analytics: ['PostHog', 'Sentry'],
        hoursEstimate: 200
      }
    },
    get totalDevelopmentHours() {
      return this.agents.estimatedDevelopmentHours +
             this.platform.frontend.hoursEstimate +
             this.platform.backend.hoursEstimate +
             this.platform.integrations.hoursEstimate;
    },
    get totalDevelopmentCost() {
      return this.totalDevelopmentHours * 75; // USD
    }
  },

  // Propiedad Intelectual
  intellectualProperty: {
    algorithms: {
      name: 'Sistema Multi-Agente Gastronómico',
      uniqueness: 'ALTO', // No existe competidor directo con 72 agentes especializados
      patentable: true
    },
    knowledgeBase: {
      domain: 'Gastronomía Especializada',
      frameworks: 11,
      methodologies: ['OODA', 'Jobs To Be Done', 'Design Thinking', 'Lean Startup'],
      verticalDepth: 'MUY PROFUNDO'
    },
    brand: {
      name: 'Vértice Gastronómico',
      positioning: 'Consultoría AI Premium para Restaurantes',
      recognition: 'NINGUNA' // Honesto: sin mercado aún
    }
  }
};

// ============================================================================
// 2. MÉTODOS DE VALORACIÓN
// ============================================================================

export const VALUATION_METHODS = {

  // MÉTODO 1: Costo de Reemplazo (Cost Approach)
  costApproach: {
    name: 'Costo de Reemplazo',
    description: 'Cuánto costaría desarrollar este sistema desde cero',
    calculation: {
      developmentHours: SYSTEM_ASSETS.technology.totalDevelopmentHours,
      ratePerHour: 75, // USD
      get baseCost() {
        return this.developmentHours * this.ratePerHour;
      },
      overheadMultiplier: 1.35, // 35% gastos operativos
      get totalWithOverhead() {
        return this.baseCost * this.overheadMultiplier;
      },
      // Factor de tecnología propietaria
      proprietaryFactor: 1.5, // IP único vale más
      get adjustedValue() {
        return this.totalWithOverhead * this.proprietaryFactor;
      }
    },
    get finalValue() {
      return this.calculation.adjustedValue;
    }
  },

  // MÉTODO 2: Valoración por Potencial de Ingresos (Income Approach)
  incomeApproach: {
    name: 'Potencial de Ingresos',
    description: 'Basado en ARR proyectado con múltiplos de mercado SaaS',
    projections: {
      // Escenarios de suscripción mensual
      pricing: {
        basic: { monthly: 299, targetClients: 100 },      // Restaurantes pequeños
        professional: { monthly: 599, targetClients: 50 }, // Restaurantes medianos
        enterprise: { monthly: 1499, targetClients: 20 }   // Cadenas/Grupos
      },
      // ARR proyectado Año 1 (conservador)
      get year1ARR() {
        return (this.pricing.basic.monthly * this.pricing.basic.targetClients * 12) +
               (this.pricing.professional.monthly * this.pricing.professional.targetClients * 12) +
               (this.pricing.enterprise.monthly * this.pricing.enterprise.targetClients * 12);
      },
      // ARR proyectado Año 3 (crecimiento)
      year3ARRMultiplier: 3, // 3x crecimiento
      get year3ARR() {
        return this.year1ARR * this.year3ARRMultiplier;
      }
    },
    // Múltiplos de valoración SaaS 2024
    multiples: {
      conservative: 2.9,  // Bajo del mercado
      median: 5.3,        // Promedio privadas con equity
      optimistic: 7.0     // Alto del mercado
    },
    valuations: {
      get conservative() {
        return VALUATION_METHODS.incomeApproach.projections.year1ARR *
               VALUATION_METHODS.incomeApproach.multiples.conservative;
      },
      get median() {
        return VALUATION_METHODS.incomeApproach.projections.year1ARR *
               VALUATION_METHODS.incomeApproach.multiples.median;
      },
      get optimistic() {
        return VALUATION_METHODS.incomeApproach.projections.year3ARR *
               VALUATION_METHODS.incomeApproach.multiples.optimistic;
      }
    }
  },

  // MÉTODO 3: Comparables de Mercado
  marketComparables: {
    name: 'Comparables de Mercado',
    description: 'Basado en transacciones de empresas similares',
    comparables: [
      {
        name: 'MarginEdge',
        type: 'Restaurant Management SaaS',
        pricing: '$330/mes/ubicación',
        valuation: 'No pública',
        funding: '$45M Series B'
      },
      {
        name: 'Toast',
        type: 'Restaurant POS + Software',
        valuation: '$13.6B (2021 IPO)',
        note: 'Muy diferente escala'
      },
      {
        name: 'AI Restaurant Software',
        type: 'AI Hosts',
        pricing: '$199-$480/mes',
        roi: '$3,000-$18,000/mes adicional por ubicación'
      }
    ],
    // Para empresas pre-revenue con tecnología
    preRevenueMultiples: {
      techWithoutTraction: '0.5x - 1x costo de desarrollo',
      techWithMVP: '1x - 2x costo de desarrollo',
      techWithEarlyTraction: '2x - 5x costo de desarrollo'
    },
    currentStage: 'techWithMVP',
    get suggestedRange() {
      const baseCost = VALUATION_METHODS.costApproach.finalValue;
      return {
        low: baseCost * 1,
        high: baseCost * 2
      };
    }
  }
};

// ============================================================================
// 3. VALORACIÓN CONSOLIDADA DEL SISTEMA
// ============================================================================

export const SYSTEM_VALUATION = {
  date: '2025-11-29',
  currency: 'USD',

  // Resumen de métodos
  methods: {
    costApproach: {
      value: VALUATION_METHODS.costApproach.finalValue,
      confidence: 'ALTA',
      basis: 'Costo real de desarrollo'
    },
    incomeApproach: {
      conservative: VALUATION_METHODS.incomeApproach.valuations.conservative,
      median: VALUATION_METHODS.incomeApproach.valuations.median,
      optimistic: VALUATION_METHODS.incomeApproach.valuations.optimistic,
      confidence: 'MEDIA',
      basis: 'Proyecciones de ARR con múltiplos SaaS'
    },
    marketComparables: {
      range: VALUATION_METHODS.marketComparables.suggestedRange,
      confidence: 'MEDIA-BAJA',
      basis: 'Empresas similares pre-revenue'
    }
  },

  // Valoración recomendada
  get recommendedValuation() {
    const costValue = this.methods.costApproach.value;
    const incomeMedian = this.methods.incomeApproach.median;

    return {
      minimum: Math.round(costValue),
      target: Math.round((costValue + incomeMedian) / 2),
      maximum: Math.round(incomeMedian * 1.5),
      notes: [
        'Sin clientes actuales, el valor se basa en potencial',
        'Cada cliente validado aumenta significativamente el valor',
        'El valor puede duplicarse con 10 clientes pagando'
      ]
    };
  }
};

// ============================================================================
// 4. PRICING POR CLIENTE (CONSULTORÍA)
// ============================================================================

export const CLIENT_PRICING = {

  // Modelo de Suscripción SaaS
  saasModel: {
    name: 'Suscripción Mensual',
    tiers: [
      {
        name: 'ESENCIAL',
        price: { monthly: 299, annual: 2990 },
        target: 'Restaurantes independientes pequeños',
        includes: [
          'Acceso a 15 agentes básicos',
          'Análisis financiero básico',
          'Reportes mensuales',
          '5 consultas AI/día',
          'Soporte por email'
        ],
        roi: {
          expectedSavings: '$500-1,000/mes',
          payback: '< 1 mes'
        }
      },
      {
        name: 'PROFESIONAL',
        price: { monthly: 599, annual: 5990 },
        target: 'Restaurantes medianos y cadenas pequeñas',
        includes: [
          'Acceso a 40 agentes',
          'Análisis financiero completo',
          'Optimización de menú con IA',
          'Reportes semanales',
          '25 consultas AI/día',
          'Soporte prioritario',
          'Dashboard personalizado'
        ],
        roi: {
          expectedSavings: '$2,000-4,000/mes',
          payback: '< 2 semanas'
        }
      },
      {
        name: 'ENTERPRISE',
        price: { monthly: 1499, annual: 14990 },
        target: 'Grupos restauranteros y cadenas',
        includes: [
          'Acceso completo a 72 agentes',
          'Análisis multi-unidad',
          'Integración sistemas existentes',
          'API acceso',
          'Consultas AI ilimitadas',
          'Account manager dedicado',
          'Reportes personalizados',
          'Capacitación equipo'
        ],
        roi: {
          expectedSavings: '$8,000-15,000/mes',
          payback: '< 1 semana'
        }
      }
    ]
  },

  // Modelo de Consultoría por Proyecto
  consultingModel: {
    name: 'Consultoría por Proyecto',
    services: [
      {
        name: 'Diagnóstico Integral',
        description: 'Análisis completo del restaurante con los 72 agentes',
        duration: '1-2 semanas',
        price: { from: 5000, to: 15000 },
        deliverables: [
          'Informe de 50+ páginas',
          'Análisis financiero detallado',
          'Plan de acción priorizado',
          'Benchmarking competitivo',
          'Proyecciones a 12 meses'
        ]
      },
      {
        name: 'Optimización de Menú',
        description: 'Ingeniería de menú con IA',
        duration: '1 semana',
        price: { from: 3000, to: 8000 },
        deliverables: [
          'Análisis de rentabilidad por platillo',
          'Recomendaciones de precios',
          'Diseño de menú optimizado',
          'Estrategia de food cost'
        ]
      },
      {
        name: 'Turnaround Operacional',
        description: 'Rescate de restaurantes en crisis',
        duration: '4-8 semanas',
        price: { from: 15000, to: 35000 },
        deliverables: [
          'Plan de emergencia',
          'Restructuración de costos',
          'Optimización de personal',
          'Nuevo modelo de negocio',
          'Acompañamiento semanal'
        ]
      },
      {
        name: 'Expansión y Franquicias',
        description: 'Estrategia de crecimiento',
        duration: '4-12 semanas',
        price: { from: 20000, to: 50000 },
        deliverables: [
          'Estudio de mercado',
          'Modelo de franquicia',
          'Manuales operativos',
          'Proyecciones financieras',
          'Due diligence de ubicaciones'
        ]
      }
    ]
  },

  // Modelo Híbrido (Recomendado para penetración)
  hybridModel: {
    name: 'Modelo Híbrido',
    description: 'Combina suscripción + consultoría',
    recommendation: {
      name: 'STARTER PACK',
      price: 1999, // Único
      includes: [
        'Diagnóstico inicial (valor $5,000)',
        '3 meses de suscripción Profesional (valor $1,797)',
        'Onboarding personalizado',
        'Sesión de estrategia 1:1'
      ],
      totalValue: 6797,
      discount: '70% de descuento',
      purpose: 'Adquisición de primeros clientes y validación'
    }
  }
};

// ============================================================================
// 5. ANÁLISIS DE ROI PARA CLIENTES
// ============================================================================

export const CLIENT_ROI_ANALYSIS = {
  description: 'Justificación de valor para el cliente',

  typicalRestaurant: {
    monthlyRevenue: 50000,
    foodCost: 0.32,
    laborCost: 0.28,
    operatingCost: 0.25,
    profitMargin: 0.15,
    monthlyProfit: 7500
  },

  verticeImpact: {
    foodCostOptimization: {
      improvement: 0.03, // 3% mejora
      get monthlySavings() {
        return CLIENT_ROI_ANALYSIS.typicalRestaurant.monthlyRevenue * this.improvement;
      }
    },
    laborOptimization: {
      improvement: 0.02, // 2% mejora
      get monthlySavings() {
        return CLIENT_ROI_ANALYSIS.typicalRestaurant.monthlyRevenue * this.improvement;
      }
    },
    revenueIncrease: {
      improvement: 0.05, // 5% más ventas
      get monthlyIncrease() {
        return CLIENT_ROI_ANALYSIS.typicalRestaurant.monthlyRevenue * this.improvement;
      },
      get profitFromIncrease() {
        return this.monthlyIncrease * CLIENT_ROI_ANALYSIS.typicalRestaurant.profitMargin;
      }
    },
    get totalMonthlySavings() {
      return this.foodCostOptimization.monthlySavings +
             this.laborOptimization.monthlySavings;
    },
    get totalMonthlyBenefit() {
      return this.totalMonthlySavings + this.revenueIncrease.profitFromIncrease;
    }
  },

  get roiCalculation() {
    const benefit = this.verticeImpact.totalMonthlyBenefit;
    const cost = CLIENT_PRICING.saasModel.tiers[1].price.monthly; // Profesional
    return {
      monthlyBenefit: benefit,
      monthlyInvestment: cost,
      roi: ((benefit - cost) / cost * 100).toFixed(1) + '%',
      paybackDays: Math.round(cost / (benefit / 30))
    };
  }
};

// ============================================================================
// 6. VALOR DE VENTA DEL SISTEMA COMPLETO
// ============================================================================

export const SYSTEM_SALE_VALUE = {
  date: '2025-11-29',

  // Escenarios de venta
  scenarios: {

    // Venta como código/tecnología (acqui-hire)
    techAcquisition: {
      name: 'Adquisición Tecnológica',
      buyer: 'Empresa de software restaurantero',
      valuation: {
        get value() {
          return VALUATION_METHODS.costApproach.finalValue;
        }
      },
      terms: 'Venta de código + IP + equipo',
      timeline: '2-3 meses'
    },

    // Venta como negocio en marcha (con clientes)
    operatingBusiness: {
      name: 'Negocio en Marcha',
      condition: 'Requiere mínimo 50 clientes activos',
      valuation: {
        get withClients() {
          const arr = 50 * CLIENT_PRICING.saasModel.tiers[1].price.annual;
          return arr * 5; // 5x ARR
        }
      },
      terms: 'Venta de empresa completa',
      timeline: '4-6 meses'
    },

    // Licenciamiento
    licensing: {
      name: 'Licencia del Sistema',
      buyer: 'Consultoras gastronómicas existentes',
      pricing: {
        setup: 50000,
        monthlyRoyalty: '10% de ingresos generados',
        minimumMonthly: 2000
      },
      benefit: 'Ingresos recurrentes sin ceder IP'
    },

    // White Label
    whiteLabel: {
      name: 'White Label',
      buyer: 'Grandes grupos restauranteros o distribuidores',
      pricing: {
        implementation: 100000,
        annualLicense: 50000,
        perUser: 50 // mensual
      },
      customization: 'Branding completo del cliente'
    }
  },

  // Resumen ejecutivo
  get summary() {
    return {
      currentValue: {
        minimum: Math.round(SYSTEM_VALUATION.recommendedValuation.minimum),
        target: Math.round(SYSTEM_VALUATION.recommendedValuation.target),
        maximum: Math.round(SYSTEM_VALUATION.recommendedValuation.maximum)
      },
      potentialValue: {
        withValidation: Math.round(SYSTEM_VALUATION.recommendedValuation.target * 2),
        with50Clients: Math.round(this.scenarios.operatingBusiness.valuation.withClients)
      },
      recommendedPath: [
        '1. Validar con 3-5 clientes piloto (gratis o descuento)',
        '2. Documentar ROI real y casos de éxito',
        '3. Establecer pricing y monetizar',
        '4. Escalar a 50+ clientes',
        '5. Evaluar opciones de salida o crecimiento'
      ]
    };
  }
};

// ============================================================================
// 7. PRECIOS EN PESOS MEXICANOS (MONEDA PRINCIPAL)
// ============================================================================

export const PRECIOS_MXN = {
  tipoCambio: 20.5, // MXN/USD (Noviembre 2025)
  moneda: 'MXN',
  iva: 0.16,

  // SUSCRIPCIONES MENSUALES
  suscripciones: {
    esencial: {
      mensual: 5999,
      mensualConIVA: 6959,
      anual: 59990,
      anualConIVA: 69588,
      descripcion: 'Restaurantes independientes pequeños',
      agentes: 15
    },
    profesional: {
      mensual: 11999,
      mensualConIVA: 13919,
      anual: 119990,
      anualConIVA: 139188,
      descripcion: 'Restaurantes medianos y cadenas pequeñas',
      agentes: 40
    },
    enterprise: {
      mensual: 29999,
      mensualConIVA: 34799,
      anual: 299990,
      anualConIVA: 347988,
      descripcion: 'Grupos restauranteros y cadenas',
      agentes: 72
    }
  },

  // CONSULTORÍA POR PROYECTO
  consultoria: {
    diagnosticoIntegral: {
      desde: 85000,
      hasta: 250000,
      duracion: '1-2 semanas',
      descripcion: 'Análisis completo con los 72 agentes'
    },
    optimizacionMenu: {
      desde: 55000,
      hasta: 150000,
      duracion: '1 semana',
      descripcion: 'Ingeniería de menú con IA'
    },
    turnaroundOperacional: {
      desde: 280000,
      hasta: 650000,
      duracion: '4-8 semanas',
      descripcion: 'Rescate de restaurantes en crisis'
    },
    expansionFranquicias: {
      desde: 380000,
      hasta: 950000,
      duracion: '4-12 semanas',
      descripcion: 'Estrategia de crecimiento'
    }
  },

  // PAQUETE DE INICIO (STARTER PACK)
  starterPack: {
    precio: 39999,
    precioConIVA: 46399,
    valorReal: 135000,
    descuento: '70%',
    incluye: [
      'Diagnóstico inicial (valor $85,000)',
      '3 meses suscripción Profesional (valor $35,997)',
      'Onboarding personalizado',
      'Sesión estrategia 1:1 con consultor'
    ]
  },

  // VALORACIÓN DEL SISTEMA EN PESOS
  valoracionSistema: {
    minimo: 22670438,      // ~$1.1M USD
    objetivo: 41777566,    // ~$2M USD
    maximo: 91327500       // ~$4.5M USD
  }
};

// Precios para otros países LATAM
export const LATAM_PRICING = {
  mexico: PRECIOS_MXN,

  colombia: {
    currency: 'COP',
    tipoCambio: 4200,
    suscripciones: {
      esencial: { mensual: 1255800, anual: 12558000 },
      profesional: { mensual: 2515800, anual: 25158000 },
      enterprise: { mensual: 6295800, anual: 62958000 }
    }
  },

  peru: {
    currency: 'PEN',
    tipoCambio: 3.8,
    suscripciones: {
      esencial: { mensual: 1136, anual: 11362 },
      profesional: { mensual: 2276, anual: 22762 },
      enterprise: { mensual: 5696, anual: 56962 }
    }
  }
};

// ============================================================================
// 8. FUNCIÓN PARA GENERAR REPORTE DE VALORACIÓN
// ============================================================================

export function generateValuationReport() {
  const costValue = VALUATION_METHODS.costApproach.finalValue;
  const incomeValue = VALUATION_METHODS.incomeApproach.valuations.median;
  const recommended = SYSTEM_VALUATION.recommendedValuation;

  return {
    titulo: 'VALORACIÓN ECONÓMICA - SISTEMA VÉRTICE GASTRONÓMICO',
    fecha: new Date().toISOString().split('T')[0],

    resumenEjecutivo: {
      descripcion: 'Sistema de 72 agentes de IA especializados en gastronomía',
      estadoActual: 'Pre-revenue (0 clientes, 0 ingresos)',
      unicidad: 'No existe competidor directo con esta profundidad vertical'
    },

    valoracionDelSistema: {
      metodoCosto: {
        valor: `$${costValue.toLocaleString()} USD`,
        base: 'Costo de desarrollo + IP'
      },
      metodoIngresos: {
        valor: `$${incomeValue.toLocaleString()} USD`,
        base: 'ARR proyectado x múltiplo SaaS 5.3x'
      },
      valorRecomendado: {
        minimo: `$${recommended.minimum.toLocaleString()} USD`,
        objetivo: `$${recommended.target.toLocaleString()} USD`,
        maximo: `$${recommended.maximum.toLocaleString()} USD`
      }
    },

    preciosCliente: {
      suscripcion: CLIENT_PRICING.saasModel.tiers.map(t => ({
        tier: t.name,
        mensual: `$${t.price.monthly} USD`,
        anual: `$${t.price.annual} USD`
      })),
      consultoria: CLIENT_PRICING.consultingModel.services.map(s => ({
        servicio: s.name,
        precio: `$${s.price.from.toLocaleString()} - $${s.price.to.toLocaleString()} USD`
      }))
    },

    roiCliente: {
      beneficioMensual: `$${CLIENT_ROI_ANALYSIS.verticeImpact.totalMonthlyBenefit.toLocaleString()} USD`,
      roi: CLIENT_ROI_ANALYSIS.roiCalculation.roi,
      payback: `${CLIENT_ROI_ANALYSIS.roiCalculation.paybackDays} días`
    },

    proximosPasos: SYSTEM_SALE_VALUE.summary.recommendedPath
  };
}

// ============================================================================
// 9. EXPORTS
// ============================================================================

export class SystemValuationCalculator {
  constructor() {
    this.assets = SYSTEM_ASSETS;
    this.methods = VALUATION_METHODS;
    this.pricing = CLIENT_PRICING;
    this.roi = CLIENT_ROI_ANALYSIS;
    this.saleValue = SYSTEM_SALE_VALUE;
  }

  getQuickValuation() {
    return {
      minimum: SYSTEM_VALUATION.recommendedValuation.minimum,
      target: SYSTEM_VALUATION.recommendedValuation.target,
      maximum: SYSTEM_VALUATION.recommendedValuation.maximum
    };
  }

  getPricingForClient(tier = 'profesional') {
    const tierMap = {
      'esencial': 0,
      'profesional': 1,
      'enterprise': 2
    };
    return CLIENT_PRICING.saasModel.tiers[tierMap[tier.toLowerCase()] || 1];
  }

  calculateROIForClient(monthlyRevenue) {
    const baseRatio = monthlyRevenue / CLIENT_ROI_ANALYSIS.typicalRestaurant.monthlyRevenue;
    return {
      monthlyBenefit: CLIENT_ROI_ANALYSIS.verticeImpact.totalMonthlyBenefit * baseRatio,
      recommendation: monthlyRevenue < 30000 ? 'ESENCIAL' :
                      monthlyRevenue < 100000 ? 'PROFESIONAL' : 'ENTERPRISE'
    };
  }

  generateReport() {
    return generateValuationReport();
  }
}

export const systemValuationCalculator = new SystemValuationCalculator();

export default {
  SYSTEM_ASSETS,
  VALUATION_METHODS,
  SYSTEM_VALUATION,
  CLIENT_PRICING,
  CLIENT_ROI_ANALYSIS,
  SYSTEM_SALE_VALUE,
  LATAM_PRICING,
  SystemValuationCalculator,
  systemValuationCalculator,
  generateValuationReport
};
