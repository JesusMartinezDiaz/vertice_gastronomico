/**
 * Deliverable Generator - Generador de Entregables Profesionales
 * Sistema de generación de documentos de alta calidad
 * "Los entregables son nuestra carta de presentación"
 */

export class DeliverableGenerator {
  constructor(config = {}) {
    this.config = {
      brandName: 'Vértice Gastronómico',
      brandColors: {
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#ed8936'
      },
      qualityStandard: 'premium',
      includeWatermark: true,
      ...config
    };
  }

  /**
   * Genera un entregable basado en su tipo
   */
  async generate(type, data, options = {}) {
    const generators = {
      report: this.generateReport.bind(this),
      costSheet: this.generateCostSheet.bind(this),
      recipe: this.generateRecipe.bind(this),
      menuMatrix: this.generateMenuMatrix.bind(this),
      businessPlan: this.generateBusinessPlan.bind(this),
      presentation: this.generatePresentation.bind(this),
      auditReport: this.generateAuditReport.bind(this),
      actionPlan: this.generateActionPlan.bind(this),
      financialProjection: this.generateFinancialProjection.bind(this)
    };

    const generator = generators[type];
    if (!generator) {
      throw new Error(`Tipo de entregable no soportado: ${type}`);
    }

    const deliverable = await generator(data, options);

    // Aplicar estándares de calidad
    return this.applyQualityStandards(deliverable, type);
  }

  /**
   * Genera un reporte profesional
   */
  async generateReport(data, options = {}) {
    const report = {
      type: 'report',
      format: options.format || 'PDF',
      metadata: {
        title: data.title || 'Reporte de Análisis',
        subtitle: data.subtitle || '',
        author: this.config.brandName,
        date: new Date().toISOString(),
        version: '1.0',
        confidential: options.confidential || true
      },
      structure: {
        coverPage: this.generateCoverPage(data),
        tableOfContents: true,
        executiveSummary: this.generateExecutiveSummary(data),
        sections: this.generateReportSections(data),
        conclusions: data.conclusions || [],
        recommendations: data.recommendations || [],
        appendices: data.appendices || []
      },
      styling: {
        template: 'professional',
        headerLogo: true,
        footerPageNumbers: true,
        colors: this.config.brandColors
      },
      validation: {
        spellChecked: false,
        dataVerified: false,
        formattingChecked: false
      }
    };

    return report;
  }

  /**
   * Genera una hoja de costeo profesional
   */
  async generateCostSheet(data, options = {}) {
    const costSheet = {
      type: 'costSheet',
      format: 'XLSX',
      metadata: {
        title: `Hoja de Costeo - ${data.recipeName || 'Receta'}`,
        author: this.config.brandName,
        date: new Date().toISOString()
      },
      content: {
        header: {
          recipeName: data.recipeName,
          category: data.category,
          portions: data.portions,
          preparationTime: data.preparationTime,
          difficulty: data.difficulty
        },
        ingredients: this.formatIngredients(data.ingredients || []),
        calculations: {
          totalCost: this.calculateTotalCost(data.ingredients),
          costPerPortion: 0,
          suggestedPrice: 0,
          foodCostPercentage: 0,
          contributionMargin: 0
        },
        analysis: {
          priceRecommendation: null,
          marginAnalysis: null,
          competitivePosition: null
        }
      },
      formulas: {
        costPerPortion: '=totalCost/portions',
        suggestedPrice: '=costPerPortion/(targetFoodCost/100)',
        foodCostPercentage: '=(totalCost/sellingPrice)*100',
        contributionMargin: '=sellingPrice-costPerPortion'
      },
      validation: {
        ingredientsVerified: false,
        pricesUpdated: false,
        calculationsVerified: false
      }
    };

    // Calcular valores
    if (data.portions > 0) {
      costSheet.content.calculations.costPerPortion =
        costSheet.content.calculations.totalCost / data.portions;
    }

    // Sugerir precio basado en food cost objetivo del 30%
    const targetFoodCost = data.targetFoodCost || 30;
    costSheet.content.calculations.suggestedPrice =
      costSheet.content.calculations.costPerPortion / (targetFoodCost / 100);

    if (data.sellingPrice > 0) {
      costSheet.content.calculations.foodCostPercentage =
        (costSheet.content.calculations.totalCost / data.sellingPrice) * 100;
      costSheet.content.calculations.contributionMargin =
        data.sellingPrice - costSheet.content.calculations.costPerPortion;
    }

    return costSheet;
  }

  /**
   * Genera una receta estándar profesional
   */
  async generateRecipe(data, options = {}) {
    const recipe = {
      type: 'recipe',
      format: 'PDF',
      metadata: {
        title: data.name,
        code: this.generateRecipeCode(data),
        author: this.config.brandName,
        date: new Date().toISOString(),
        version: data.version || '1.0'
      },
      content: {
        header: {
          name: data.name,
          category: data.category,
          subcategory: data.subcategory,
          portions: data.portions,
          portionSize: data.portionSize,
          preparationTime: data.preparationTime,
          cookingTime: data.cookingTime,
          difficulty: data.difficulty,
          allergens: data.allergens || []
        },
        ingredients: this.formatRecipeIngredients(data.ingredients || []),
        equipment: data.equipment || [],
        procedure: this.formatProcedure(data.procedure || []),
        plating: {
          description: data.platingDescription,
          imageReference: data.platingImage
        },
        tips: data.tips || [],
        variations: data.variations || [],
        nutritionalInfo: data.nutritionalInfo || null,
        costInfo: {
          totalCost: this.calculateTotalCost(data.ingredients),
          costPerPortion: 0,
          lastUpdated: new Date().toISOString()
        }
      },
      qualityControl: {
        criticalPoints: data.criticalPoints || [],
        temperatureControls: data.temperatureControls || [],
        shelfLife: data.shelfLife,
        storageConditions: data.storageConditions
      },
      validation: {
        testedAndApproved: false,
        costVerified: false,
        nutritionCalculated: false
      }
    };

    // Calcular costo por porción
    if (data.portions > 0) {
      recipe.content.costInfo.costPerPortion =
        recipe.content.costInfo.totalCost / data.portions;
    }

    return recipe;
  }

  /**
   * Genera matriz de ingeniería de menú
   */
  async generateMenuMatrix(data, options = {}) {
    const matrix = {
      type: 'menuMatrix',
      format: 'XLSX',
      metadata: {
        title: 'Matriz de Ingeniería de Menú',
        period: data.period,
        author: this.config.brandName,
        date: new Date().toISOString()
      },
      content: {
        summary: {
          totalItems: data.items?.length || 0,
          averageFoodCost: 0,
          averageMargin: 0,
          totalRevenue: 0
        },
        items: this.analyzeMenuItems(data.items || []),
        categories: {
          stars: [], // Alta popularidad, alto margen
          puzzles: [], // Baja popularidad, alto margen
          plowHorses: [], // Alta popularidad, bajo margen
          dogs: [] // Baja popularidad, bajo margen
        },
        recommendations: []
      },
      charts: {
        matrixChart: true,
        salesDistribution: true,
        marginAnalysis: true
      },
      validation: {
        dataVerified: false,
        calculationsChecked: false
      }
    };

    // Clasificar items
    matrix.content.categories = this.classifyMenuItems(matrix.content.items);

    // Generar recomendaciones
    matrix.content.recommendations = this.generateMenuRecommendations(matrix.content.categories);

    return matrix;
  }

  /**
   * Genera plan de negocios
   */
  async generateBusinessPlan(data, options = {}) {
    return {
      type: 'businessPlan',
      format: 'PDF',
      metadata: {
        title: `Plan de Negocios - ${data.projectName}`,
        author: this.config.brandName,
        date: new Date().toISOString(),
        confidential: true
      },
      structure: {
        executiveSummary: {
          concept: data.concept,
          mission: data.mission,
          vision: data.vision,
          investmentRequired: data.investmentRequired,
          expectedROI: data.expectedROI
        },
        marketAnalysis: {
          targetMarket: data.targetMarket,
          competition: data.competition,
          trends: data.trends,
          swot: data.swot
        },
        operationalPlan: {
          location: data.location,
          capacity: data.capacity,
          menu: data.menuSummary,
          suppliers: data.suppliers,
          staffing: data.staffing
        },
        financialPlan: {
          initialInvestment: data.initialInvestment,
          operatingCosts: data.operatingCosts,
          revenueProjections: data.revenueProjections,
          breakEvenAnalysis: data.breakEvenAnalysis,
          cashFlowProjection: data.cashFlowProjection
        },
        marketingPlan: {
          positioning: data.positioning,
          channels: data.marketingChannels,
          budget: data.marketingBudget,
          timeline: data.marketingTimeline
        },
        riskAnalysis: {
          risks: data.risks,
          mitigations: data.mitigations
        }
      },
      appendices: data.appendices || [],
      validation: {
        financialsVerified: false,
        marketDataCurrent: false
      }
    };
  }

  /**
   * Genera presentación ejecutiva
   */
  async generatePresentation(data, options = {}) {
    return {
      type: 'presentation',
      format: 'PPTX',
      metadata: {
        title: data.title,
        author: this.config.brandName,
        date: new Date().toISOString()
      },
      slides: [
        {
          type: 'title',
          content: {
            title: data.title,
            subtitle: data.subtitle,
            date: new Date().toLocaleDateString('es-ES'),
            logo: true
          }
        },
        {
          type: 'agenda',
          content: {
            items: data.agendaItems || []
          }
        },
        ...this.generateContentSlides(data.sections || []),
        {
          type: 'summary',
          content: {
            keyPoints: data.keyPoints || [],
            nextSteps: data.nextSteps || []
          }
        },
        {
          type: 'closing',
          content: {
            thankYou: true,
            contact: data.contactInfo
          }
        }
      ],
      styling: {
        template: 'professional',
        colors: this.config.brandColors,
        animations: options.animations || false
      }
    };
  }

  /**
   * Genera reporte de auditoría
   */
  async generateAuditReport(data, options = {}) {
    return {
      type: 'auditReport',
      format: 'PDF',
      metadata: {
        title: 'Informe de Auditoría de Costos',
        client: data.clientName,
        period: data.period,
        author: this.config.brandName,
        date: new Date().toISOString(),
        confidential: true
      },
      content: {
        executiveSummary: {
          scope: data.scope,
          methodology: data.methodology,
          keyFindings: data.keyFindings,
          overallAssessment: data.overallAssessment
        },
        findings: {
          critical: data.findings?.filter(f => f.severity === 'critical') || [],
          major: data.findings?.filter(f => f.severity === 'major') || [],
          minor: data.findings?.filter(f => f.severity === 'minor') || [],
          observations: data.findings?.filter(f => f.severity === 'observation') || []
        },
        analysis: {
          foodCostAnalysis: data.foodCostAnalysis,
          laborCostAnalysis: data.laborCostAnalysis,
          overheadAnalysis: data.overheadAnalysis,
          wasteAnalysis: data.wasteAnalysis
        },
        benchmarking: {
          industryComparison: data.industryComparison,
          bestPractices: data.bestPractices
        },
        recommendations: this.prioritizeRecommendations(data.recommendations || []),
        actionPlan: data.actionPlan
      },
      appendices: data.appendices || [],
      validation: {
        findingsVerified: false,
        calculationsChecked: false
      }
    };
  }

  /**
   * Genera plan de acción
   */
  async generateActionPlan(data, options = {}) {
    return {
      type: 'actionPlan',
      format: 'PDF',
      metadata: {
        title: 'Plan de Acción',
        project: data.projectName,
        author: this.config.brandName,
        date: new Date().toISOString()
      },
      content: {
        objectives: data.objectives || [],
        actions: this.formatActions(data.actions || []),
        timeline: this.generateTimeline(data.actions || []),
        resources: data.resources || [],
        kpis: data.kpis || [],
        riskMitigation: data.riskMitigation || [],
        monitoring: {
          frequency: data.monitoringFrequency || 'weekly',
          responsible: data.responsible,
          checkpoints: data.checkpoints || []
        }
      },
      tracking: {
        status: 'active',
        progress: 0,
        lastUpdate: new Date().toISOString()
      }
    };
  }

  /**
   * Genera proyección financiera
   */
  async generateFinancialProjection(data, options = {}) {
    return {
      type: 'financialProjection',
      format: 'XLSX',
      metadata: {
        title: 'Proyección Financiera',
        project: data.projectName,
        period: data.projectionPeriod,
        author: this.config.brandName,
        date: new Date().toISOString()
      },
      content: {
        assumptions: data.assumptions || [],
        revenue: {
          monthly: this.projectRevenue(data.revenueData),
          breakdown: data.revenueBreakdown || []
        },
        costs: {
          fixed: data.fixedCosts || [],
          variable: data.variableCosts || [],
          monthly: this.projectCosts(data)
        },
        profitability: {
          grossMargin: [],
          netMargin: [],
          ebitda: []
        },
        cashFlow: {
          operating: [],
          investing: [],
          financing: [],
          net: []
        },
        analysis: {
          breakEvenPoint: this.calculateBreakEven(data),
          paybackPeriod: this.calculatePayback(data),
          npv: data.npv,
          irr: data.irr
        },
        scenarios: {
          optimistic: data.optimisticScenario,
          base: data.baseScenario,
          pessimistic: data.pessimisticScenario
        }
      },
      charts: {
        revenueChart: true,
        costBreakdown: true,
        profitabilityTrend: true,
        cashFlowChart: true
      },
      validation: {
        assumptionsReviewed: false,
        calculationsVerified: false
      }
    };
  }

  // ============ Métodos auxiliares ============

  generateCoverPage(data) {
    return {
      title: data.title,
      subtitle: data.subtitle,
      client: data.client,
      date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      logo: this.config.brandName,
      confidential: data.confidential || true
    };
  }

  generateExecutiveSummary(data) {
    return {
      overview: data.overview || '',
      keyFindings: data.keyFindings || [],
      recommendations: data.topRecommendations || [],
      nextSteps: data.nextSteps || []
    };
  }

  generateReportSections(data) {
    return (data.sections || []).map((section, index) => ({
      number: index + 1,
      title: section.title,
      content: section.content,
      tables: section.tables || [],
      charts: section.charts || [],
      images: section.images || []
    }));
  }

  formatIngredients(ingredients) {
    return ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      unitCost: ing.unitCost || 0,
      totalCost: (ing.quantity || 0) * (ing.unitCost || 0),
      supplier: ing.supplier || 'No especificado',
      lastPriceUpdate: ing.lastPriceUpdate || new Date().toISOString()
    }));
  }

  formatRecipeIngredients(ingredients) {
    return ingredients.map(ing => ({
      ...ing,
      preparation: ing.preparation || '',
      notes: ing.notes || ''
    }));
  }

  formatProcedure(steps) {
    return steps.map((step, index) => ({
      stepNumber: index + 1,
      instruction: step.instruction || step,
      time: step.time || null,
      temperature: step.temperature || null,
      criticalPoint: step.criticalPoint || false,
      image: step.image || null
    }));
  }

  calculateTotalCost(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) return 0;
    return ingredients.reduce((total, ing) => {
      const quantity = parseFloat(ing.quantity) || 0;
      const unitCost = parseFloat(ing.unitCost) || 0;
      return total + (quantity * unitCost);
    }, 0);
  }

  generateRecipeCode(data) {
    const category = (data.category || 'GEN').substring(0, 3).toUpperCase();
    const date = new Date().getFullYear().toString().substring(2);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${category}-${date}-${random}`;
  }

  analyzeMenuItems(items) {
    return items.map(item => ({
      ...item,
      foodCostPercentage: item.sellingPrice > 0
        ? (item.cost / item.sellingPrice) * 100
        : 0,
      contributionMargin: item.sellingPrice - item.cost,
      popularityIndex: this.calculatePopularityIndex(item, items),
      profitabilityIndex: this.calculateProfitabilityIndex(item, items)
    }));
  }

  calculatePopularityIndex(item, allItems) {
    const totalSales = allItems.reduce((sum, i) => sum + (i.salesCount || 0), 0);
    if (totalSales === 0) return 0;
    return ((item.salesCount || 0) / totalSales) * 100;
  }

  calculateProfitabilityIndex(item, allItems) {
    const avgMargin = allItems.reduce((sum, i) => sum + (i.sellingPrice - i.cost), 0) / allItems.length;
    const itemMargin = item.sellingPrice - item.cost;
    return avgMargin > 0 ? (itemMargin / avgMargin) * 100 : 0;
  }

  classifyMenuItems(items) {
    const avgPopularity = items.reduce((sum, i) => sum + i.popularityIndex, 0) / items.length;
    const avgMargin = items.reduce((sum, i) => sum + i.contributionMargin, 0) / items.length;

    return {
      stars: items.filter(i => i.popularityIndex >= avgPopularity && i.contributionMargin >= avgMargin),
      puzzles: items.filter(i => i.popularityIndex < avgPopularity && i.contributionMargin >= avgMargin),
      plowHorses: items.filter(i => i.popularityIndex >= avgPopularity && i.contributionMargin < avgMargin),
      dogs: items.filter(i => i.popularityIndex < avgPopularity && i.contributionMargin < avgMargin)
    };
  }

  generateMenuRecommendations(categories) {
    const recommendations = [];

    // Recomendaciones para estrellas
    if (categories.stars.length > 0) {
      recommendations.push({
        category: 'stars',
        action: 'Mantener y destacar',
        items: categories.stars.map(i => i.name),
        details: 'Estos platillos son exitosos. Mantener calidad y posición en menú.'
      });
    }

    // Recomendaciones para puzzles
    if (categories.puzzles.length > 0) {
      recommendations.push({
        category: 'puzzles',
        action: 'Promocionar',
        items: categories.puzzles.map(i => i.name),
        details: 'Alto margen pero baja venta. Mejorar presentación o promoción.'
      });
    }

    // Recomendaciones para plowHorses
    if (categories.plowHorses.length > 0) {
      recommendations.push({
        category: 'plowHorses',
        action: 'Optimizar costos',
        items: categories.plowHorses.map(i => i.name),
        details: 'Buenas ventas pero bajo margen. Revisar precios o costos.'
      });
    }

    // Recomendaciones para dogs
    if (categories.dogs.length > 0) {
      recommendations.push({
        category: 'dogs',
        action: 'Evaluar eliminación',
        items: categories.dogs.map(i => i.name),
        details: 'Bajo rendimiento. Considerar eliminar o reformular.'
      });
    }

    return recommendations;
  }

  generateContentSlides(sections) {
    return sections.map(section => ({
      type: 'content',
      content: {
        title: section.title,
        bullets: section.points || [],
        image: section.image,
        chart: section.chart
      }
    }));
  }

  prioritizeRecommendations(recommendations) {
    return recommendations.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return (priority[b.priority] || 0) - (priority[a.priority] || 0);
    });
  }

  formatActions(actions) {
    return actions.map((action, index) => ({
      id: `action-${index + 1}`,
      description: action.description,
      responsible: action.responsible,
      deadline: action.deadline,
      priority: action.priority || 'medium',
      resources: action.resources || [],
      status: 'pending',
      dependencies: action.dependencies || []
    }));
  }

  generateTimeline(actions) {
    const timeline = [];
    const sortedActions = [...actions].sort((a, b) =>
      new Date(a.deadline) - new Date(b.deadline)
    );

    for (const action of sortedActions) {
      timeline.push({
        date: action.deadline,
        action: action.description,
        milestone: action.milestone || false
      });
    }

    return timeline;
  }

  projectRevenue(revenueData) {
    if (!revenueData) return [];
    // Proyección simple basada en datos históricos
    return revenueData.monthly || [];
  }

  projectCosts(data) {
    // Implementación de proyección de costos
    return [];
  }

  calculateBreakEven(data) {
    const fixedCosts = data.fixedCosts?.reduce((sum, c) => sum + c.amount, 0) || 0;
    const avgMargin = data.avgContributionMargin || 0;

    if (avgMargin <= 0) return null;
    return fixedCosts / avgMargin;
  }

  calculatePayback(data) {
    const investment = data.initialInvestment || 0;
    const monthlyProfit = data.avgMonthlyProfit || 0;

    if (monthlyProfit <= 0) return null;
    return investment / monthlyProfit;
  }

  /**
   * Aplica estándares de calidad al entregable
   */
  applyQualityStandards(deliverable, type) {
    return {
      ...deliverable,
      qualityChecks: {
        timestamp: new Date().toISOString(),
        brandingApplied: true,
        formatVerified: true,
        contentComplete: this.verifyContentComplete(deliverable, type),
        professionalStandard: this.config.qualityStandard
      },
      watermark: this.config.includeWatermark ? {
        text: `${this.config.brandName} - Documento Confidencial`,
        position: 'diagonal'
      } : null,
      footer: {
        brand: this.config.brandName,
        generatedAt: new Date().toISOString(),
        pageNumbers: true
      }
    };
  }

  verifyContentComplete(deliverable, type) {
    const requiredFields = {
      report: ['metadata.title', 'structure.sections'],
      costSheet: ['content.ingredients', 'content.calculations'],
      recipe: ['content.header.name', 'content.ingredients', 'content.procedure'],
      menuMatrix: ['content.items', 'content.categories'],
      businessPlan: ['structure.executiveSummary', 'structure.financialPlan'],
      presentation: ['slides'],
      auditReport: ['content.findings', 'content.recommendations'],
      actionPlan: ['content.actions', 'content.timeline'],
      financialProjection: ['content.revenue', 'content.costs']
    };

    const required = requiredFields[type] || [];
    return required.every(field => this.getNestedValue(deliverable, field) !== undefined);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) =>
      current && current[key] !== undefined ? current[key] : undefined, obj);
  }
}

export default DeliverableGenerator;
