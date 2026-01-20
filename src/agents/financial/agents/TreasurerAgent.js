/**
 * TreasurerAgent - Tesorero
 * Agente #6 - Gestión de liquidez y capital de trabajo
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class TreasurerAgent extends UniversalAgent {
  constructor() {
    super({
      id: 6,
      emoji: '💳',
      nombre: 'Tesorero',
      nombreCorto: 'TREASURER',
      categoria: 'FINANZAS',
      experiencia: { años: 8, rango: '8+ años' },
      descripcion: 'Responsable de la gestión de liquidez, relaciones bancarias y optimización del capital de trabajo.',
      perfil: {
        formacion: 'Finanzas o Economía + Especialidad en Tesorería Corporativa',
        certificaciones: ['CTP', 'CCM', 'FP&A'],
        competencias: ['Gestión de liquidez', 'Cash pooling', 'Forex management', 'Banking relationships', 'Working capital optimization', 'Cash forecasting'],
        herramientas: ['Kyriba', 'GTreasury', 'FIS Integrity', 'SAP Treasury', 'Bloomberg', 'Swift'],
        kpis: ['Cash Conversion Cycle', 'Days Sales Outstanding', 'Days Payable Outstanding', 'Cash Flow Forecast Accuracy', 'Bank Fee Optimization'],
        logros: ['Reducción de costos bancarios 35% mediante renegociación', 'Implementación de cash pooling regional', 'Mejora de forecast accuracy de 70% a 92%'],
        metodologias: ['Cash Flow Forecasting', 'Working Capital Optimization', 'Bank Relationship Management', 'Liquidity Risk Management']
      },
      triggers: ['tesorería', 'flujo de caja', 'bancos', 'liquidez', 'pagos', 'cobranza'],
      delegaA: [3, 7]
    });
  }

  async createCashFlowForecast(params) {
    const { startingCash, periods, inflows, outflows } = params;

    this.emitEvent('cash_forecast_started', { periods });

    const forecast = {
      createdAt: new Date().toISOString(),
      createdBy: this.nombre,
      startingCash,
      periods: [],
      summary: {}
    };

    let runningCash = startingCash;

    for (let i = 1; i <= periods; i++) {
      const periodInflows = this._calculatePeriodInflows(inflows, i);
      const periodOutflows = this._calculatePeriodOutflows(outflows, i);
      const netCashFlow = periodInflows - periodOutflows;
      runningCash += netCashFlow;

      forecast.periods.push({
        period: i,
        inflows: periodInflows,
        outflows: periodOutflows,
        netCashFlow,
        endingCash: runningCash,
        status: runningCash > 0 ? 'OK' : 'DEFICIT'
      });
    }

    // Resumen
    const deficitPeriods = forecast.periods.filter(p => p.status === 'DEFICIT');
    forecast.summary = {
      totalInflows: forecast.periods.reduce((sum, p) => sum + p.inflows, 0),
      totalOutflows: forecast.periods.reduce((sum, p) => sum + p.outflows, 0),
      netChange: runningCash - startingCash,
      minCash: Math.min(...forecast.periods.map(p => p.endingCash)),
      deficitPeriods: deficitPeriods.length,
      recommendation: deficitPeriods.length > 0
        ? 'Se requiere línea de crédito o ajuste de pagos'
        : 'Liquidez proyectada es adecuada'
    };

    this.emitEvent('cash_forecast_completed', { summary: forecast.summary });
    return forecast;
  }

  _calculatePeriodInflows(inflows, period) {
    return Object.values(inflows).reduce((sum, flow) => {
      const baseAmount = flow.baseAmount || 0;
      const growth = flow.growthRate || 0;
      return sum + (baseAmount * Math.pow(1 + growth / 100, period - 1));
    }, 0);
  }

  _calculatePeriodOutflows(outflows, period) {
    return Object.values(outflows).reduce((sum, flow) => {
      const baseAmount = flow.baseAmount || 0;
      const inflation = flow.inflationRate || 0;
      return sum + (baseAmount * Math.pow(1 + inflation / 100, period - 1));
    }, 0);
  }

  async analyzeWorkingCapital(data) {
    const analysis = {
      analyzedAt: new Date().toISOString(),
      analyzedBy: this.nombre,
      metrics: {},
      recommendations: []
    };

    // Calcular métricas
    analysis.metrics = {
      currentRatio: data.currentAssets / (data.currentLiabilities || 1),
      quickRatio: (data.currentAssets - data.inventory) / (data.currentLiabilities || 1),
      dso: (data.receivables / data.revenue) * 365,
      dpo: (data.payables / data.cogs) * 365,
      dio: (data.inventory / data.cogs) * 365,
      cashConversionCycle: 0
    };

    analysis.metrics.cashConversionCycle =
      analysis.metrics.dso + analysis.metrics.dio - analysis.metrics.dpo;

    // Generar recomendaciones
    if (analysis.metrics.dso > 30) {
      analysis.recommendations.push({
        area: 'Cobranza',
        action: 'Acelerar cobranza',
        impact: `DSO de ${analysis.metrics.dso.toFixed(0)} días es alto para restaurantes`
      });
    }

    if (analysis.metrics.dpo < 15) {
      analysis.recommendations.push({
        area: 'Pagos',
        action: 'Negociar mejores términos con proveedores',
        impact: `DPO de ${analysis.metrics.dpo.toFixed(0)} días puede optimizarse`
      });
    }

    if (analysis.metrics.cashConversionCycle > 20) {
      analysis.recommendations.push({
        area: 'Capital de Trabajo',
        action: 'Optimizar ciclo de conversión de efectivo',
        impact: `CCC de ${analysis.metrics.cashConversionCycle.toFixed(0)} días afecta liquidez`
      });
    }

    return analysis;
  }

  async generateCashReport(period, data) {
    return this.generateDocument('pdf', {
      title: `Reporte de Tesorería - ${period}`,
      summary: 'Estado de liquidez y flujo de efectivo',
      metrics: [
        { name: 'Saldo Inicial', value: data.startingCash },
        { name: 'Ingresos', value: data.totalInflows, trend: 'up' },
        { name: 'Egresos', value: data.totalOutflows, trend: 'down' },
        { name: 'Flujo Neto', value: data.netCashFlow },
        { name: 'Saldo Final', value: data.endingCash },
        { name: 'DSO', value: data.dso, unit: ' días' },
        { name: 'DPO', value: data.dpo, unit: ' días' }
      ],
      sections: data.recommendations?.map(r => ({
        title: r.area,
        content: `${r.action}\n${r.impact}`
      })) || []
    }, { type: 'report' });
  }
}

export default TreasurerAgent;
