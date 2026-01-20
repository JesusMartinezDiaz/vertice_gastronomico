/**
 * ProfitAnalystAgent - Analista de Rentabilidad
 * Agente #5 - Experto en análisis de rentabilidad y márgenes
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class ProfitAnalystAgent extends UniversalAgent {
  constructor() {
    super({
      id: 5,
      emoji: '📈',
      nombre: 'Analista de Rentabilidad',
      nombreCorto: 'PROFIT_ANALYST',
      categoria: 'FINANZAS',
      experiencia: { años: 6, rango: '6+ años' },
      descripcion: 'Experto en análisis de rentabilidad por unidad de negocio y optimización de márgenes.',
      perfil: {
        formacion: 'Economía o Finanzas + Especialidad en Análisis de Negocios',
        certificaciones: ['CMA', 'CBAP', 'Tableau Desktop Specialist', 'Power BI Data Analyst'],
        competencias: ['Análisis de rentabilidad', 'Modelación de precios', 'Análisis de break-even', 'Segmentación de clientes', 'Revenue management', 'Análisis de sensibilidad'],
        herramientas: ['Tableau', 'Power BI', 'Alteryx', 'SQL Server', 'Python/Pandas', 'R Studio'],
        kpis: ['Gross Profit Margin', 'Contribution Margin', 'RevPASH', 'Customer Profitability', 'Price Elasticity'],
        logros: ['Incremento de margen bruto de 62% a 71% mediante ingeniería de menú', 'Desarrollo de modelo de pricing dinámico', 'Identificación de 15 productos no rentables para rediseño'],
        metodologias: ['Customer Profitability Analysis', 'Activity-Based Management', 'Revenue Management', 'Price Optimization']
      },
      triggers: ['rentabilidad', 'márgenes', 'precios', 'revenue', 'análisis de negocio', 'break-even'],
      delegaA: [4, 6, 7]
    });
  }

  async calculateBreakEven(params) {
    const { fixedCosts, pricePerUnit, variableCostPerUnit } = params;

    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;
    const contributionMarginRatio = contributionMargin / pricePerUnit;

    return {
      breakEvenUnits: Math.ceil(breakEvenUnits),
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio: contributionMarginRatio * 100,
      safetyMargin: params.currentSales ? ((params.currentSales - breakEvenRevenue) / params.currentSales) * 100 : null,
      analysis: this._generateBreakEvenAnalysis({ breakEvenUnits, breakEvenRevenue, contributionMarginRatio })
    };
  }

  _generateBreakEvenAnalysis(data) {
    if (data.contributionMarginRatio < 0.3) {
      return 'Margen de contribución bajo. Considerar aumentar precios o reducir costos variables.';
    } else if (data.contributionMarginRatio < 0.5) {
      return 'Margen de contribución aceptable. Enfocarse en volumen de ventas.';
    }
    return 'Excelente margen de contribución. Punto de equilibrio alcanzable con volumen moderado.';
  }

  async analyzeProfitabilityByProduct(products) {
    this.emitEvent('profitability_analysis_started', { productCount: products.length });

    const analysis = {
      analyzedAt: new Date().toISOString(),
      products: [],
      summary: { profitable: 0, marginal: 0, unprofitable: 0 },
      totalContribution: 0,
      recommendations: []
    };

    for (const product of products) {
      const contribution = (product.price - product.variableCost) * product.unitsSold;
      const contributionMargin = ((product.price - product.variableCost) / product.price) * 100;
      const profitability = contribution > 0 ? (contributionMargin >= 50 ? 'profitable' : 'marginal') : 'unprofitable';

      analysis.products.push({
        ...product,
        contribution,
        contributionMargin,
        profitability
      });

      analysis.summary[profitability]++;
      analysis.totalContribution += contribution;
    }

    // Ordenar por contribución
    analysis.products.sort((a, b) => b.contribution - a.contribution);

    // Top 5 y Bottom 5
    analysis.top5 = analysis.products.slice(0, 5);
    analysis.bottom5 = analysis.products.slice(-5).reverse();

    // Recomendaciones
    for (const p of analysis.bottom5) {
      if (p.profitability === 'unprofitable') {
        analysis.recommendations.push({
          product: p.name,
          action: 'ELIMINAR o REFORMULAR',
          reason: `Contribución negativa: $${p.contribution.toLocaleString('es-MX')}`
        });
      }
    }

    this.emitEvent('profitability_analysis_completed', { summary: analysis.summary });
    return analysis;
  }

  async analyzePriceSensitivity(product, priceScenarios) {
    const analysis = {
      product: product.name,
      currentPrice: product.price,
      currentVolume: product.volume,
      scenarios: [],
      optimalPrice: null,
      maxRevenue: 0
    };

    for (const scenario of priceScenarios) {
      // Modelo simple de elasticidad: si precio sube 10%, volumen baja según elasticidad
      const priceChange = (scenario.price - product.price) / product.price;
      const volumeChange = priceChange * -product.elasticity;
      const newVolume = product.volume * (1 + volumeChange);
      const revenue = scenario.price * newVolume;
      const profit = (scenario.price - product.variableCost) * newVolume;

      analysis.scenarios.push({
        price: scenario.price,
        projectedVolume: Math.round(newVolume),
        revenue,
        profit,
        priceChangePercent: priceChange * 100,
        volumeChangePercent: volumeChange * 100
      });

      if (revenue > analysis.maxRevenue) {
        analysis.maxRevenue = revenue;
        analysis.optimalPrice = scenario.price;
      }
    }

    return analysis;
  }

  async generateProfitabilityReport(data) {
    return this.generateDocument('pdf', {
      title: 'Análisis de Rentabilidad',
      summary: `Análisis de ${data.products?.length || 0} productos`,
      metrics: [
        { name: 'Margen Bruto Promedio', value: data.avgGrossMargin, unit: '%' },
        { name: 'Contribución Total', value: data.totalContribution },
        { name: 'Productos Rentables', value: data.summary?.profitable || 0 },
        { name: 'Productos No Rentables', value: data.summary?.unprofitable || 0 }
      ],
      sections: data.recommendations?.map(r => ({
        title: r.product,
        content: `${r.action}: ${r.reason}`
      })) || []
    }, { type: 'report' });
  }
}

export default ProfitAnalystAgent;
