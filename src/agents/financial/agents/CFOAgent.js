/**
 * CFOAgent - Director Financiero (CFO)
 * Agente #2 - Estratega financiero especializado en el sector gastronómico
 *
 * CAPACIDADES UNIVERSALES INCLUIDAS:
 * - Generación de documentos (PDF, Word, Excel, CSV, JSON)
 * - Procesamiento AI
 * - WebSocket (eventos en tiempo real)
 * - Colas de procesamiento
 * - Sistema de calidad
 * - Almacenamiento IndexedDB
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class CFOAgent extends UniversalAgent {
  constructor() {
    super({
      id: 2,
      emoji: '💰',
      nombre: 'Director Financiero (CFO)',
      nombreCorto: 'CFO',
      categoria: 'FINANZAS',
      experiencia: { años: 15, rango: '15+ años' },
      descripcion: 'Estratega financiero especializado en el sector gastronómico. Domina modelación financiera, M&A, y estructuración de capital.',
      perfil: {
        formacion: 'CPA + MBA con especialidad en Finanzas Corporativas',
        certificaciones: ['CFA', 'CMA', 'FRM', 'FMVA'],
        competencias: [
          'Modelación financiera avanzada',
          'Valuación de empresas',
          'Gestión de tesorería',
          'Planificación fiscal',
          'Due diligence financiero',
          'Reporting IFRS/USGAAP'
        ],
        herramientas: ['SAP FI/CO', 'Oracle Financials', 'Bloomberg Terminal', 'Adaptive Insights', 'Anaplan', 'BlackLine'],
        kpis: ['EBITDA Margin', 'Working Capital Ratio', 'ROIC', 'Cash Conversion Cycle', 'Cost per Cover'],
        logros: [
          'Estructuración de financiamiento por $50M USD para expansión',
          'Reducción de ciclo de conversión de efectivo de 45 a 28 días',
          'Implementación de modelo de costeo ABC'
        ],
        metodologias: ['Activity-Based Costing', 'Zero-Based Budgeting', 'Rolling Forecasts', 'Monte Carlo Simulation']
      },
      triggers: ['finanzas', 'presupuesto', 'costos', 'inversión', 'ROI', 'flujo de caja', 'estados financieros'],
      delegaA: [3, 4, 5, 6, 7]
    });

    // Capacidades específicas del CFO
    this.financialModels = new Map();
    this.budgets = new Map();
    this.forecasts = new Map();
  }

  // ============ MÉTODOS ESPECÍFICOS DEL CFO ============

  async analyzeFinancialHealth(data) {
    this.emitEvent('analysis_started', { type: 'financial_health' });

    const analysis = {
      liquidity: this._analyzeLiquidity(data),
      profitability: this._analyzeProfitability(data),
      efficiency: this._analyzeEfficiency(data),
      leverage: this._analyzeLeverage(data),
      recommendations: []
    };

    // Generar recomendaciones basadas en el análisis
    analysis.recommendations = this._generateFinancialRecommendations(analysis);

    this.emitEvent('analysis_completed', { type: 'financial_health', result: analysis });
    return analysis;
  }

  _analyzeLiquidity(data) {
    const currentRatio = (data.currentAssets || 0) / (data.currentLiabilities || 1);
    const quickRatio = ((data.currentAssets || 0) - (data.inventory || 0)) / (data.currentLiabilities || 1);
    const cashRatio = (data.cash || 0) / (data.currentLiabilities || 1);

    return {
      currentRatio: { value: currentRatio, status: currentRatio >= 1.5 ? 'good' : currentRatio >= 1 ? 'warning' : 'critical' },
      quickRatio: { value: quickRatio, status: quickRatio >= 1 ? 'good' : quickRatio >= 0.5 ? 'warning' : 'critical' },
      cashRatio: { value: cashRatio, status: cashRatio >= 0.2 ? 'good' : 'warning' },
      workingCapital: (data.currentAssets || 0) - (data.currentLiabilities || 0)
    };
  }

  _analyzeProfitability(data) {
    const grossMargin = ((data.revenue || 0) - (data.cogs || 0)) / (data.revenue || 1) * 100;
    const operatingMargin = (data.operatingIncome || 0) / (data.revenue || 1) * 100;
    const netMargin = (data.netIncome || 0) / (data.revenue || 1) * 100;
    const ebitdaMargin = (data.ebitda || 0) / (data.revenue || 1) * 100;

    return {
      grossMargin: { value: grossMargin, status: grossMargin >= 60 ? 'excellent' : grossMargin >= 50 ? 'good' : 'warning' },
      operatingMargin: { value: operatingMargin, status: operatingMargin >= 15 ? 'excellent' : operatingMargin >= 10 ? 'good' : 'warning' },
      netMargin: { value: netMargin, status: netMargin >= 10 ? 'excellent' : netMargin >= 5 ? 'good' : 'warning' },
      ebitdaMargin: { value: ebitdaMargin, status: ebitdaMargin >= 20 ? 'excellent' : ebitdaMargin >= 15 ? 'good' : 'warning' }
    };
  }

  _analyzeEfficiency(data) {
    const assetTurnover = (data.revenue || 0) / (data.totalAssets || 1);
    const inventoryTurnover = (data.cogs || 0) / (data.averageInventory || 1);
    const receivablesTurnover = (data.revenue || 0) / (data.averageReceivables || 1);
    const payablesTurnover = (data.cogs || 0) / (data.averagePayables || 1);

    return {
      assetTurnover: { value: assetTurnover, daysInYear: 365 / assetTurnover },
      inventoryTurnover: { value: inventoryTurnover, daysInInventory: 365 / inventoryTurnover },
      receivablesTurnover: { value: receivablesTurnover, daysToCollect: 365 / receivablesTurnover },
      payablesTurnover: { value: payablesTurnover, daysToPay: 365 / payablesTurnover },
      cashConversionCycle: (365 / inventoryTurnover) + (365 / receivablesTurnover) - (365 / payablesTurnover)
    };
  }

  _analyzeLeverage(data) {
    const debtToEquity = (data.totalDebt || 0) / (data.equity || 1);
    const debtToAssets = (data.totalDebt || 0) / (data.totalAssets || 1);
    const interestCoverage = (data.ebit || 0) / (data.interestExpense || 1);

    return {
      debtToEquity: { value: debtToEquity, status: debtToEquity <= 1 ? 'good' : debtToEquity <= 2 ? 'warning' : 'critical' },
      debtToAssets: { value: debtToAssets, status: debtToAssets <= 0.5 ? 'good' : debtToAssets <= 0.7 ? 'warning' : 'critical' },
      interestCoverage: { value: interestCoverage, status: interestCoverage >= 3 ? 'good' : interestCoverage >= 1.5 ? 'warning' : 'critical' }
    };
  }

  _generateFinancialRecommendations(analysis) {
    const recommendations = [];

    // Liquidez
    if (analysis.liquidity.currentRatio.status === 'critical') {
      recommendations.push({
        area: 'Liquidez',
        priority: 'alta',
        recommendation: 'Mejorar capital de trabajo: negociar plazos con proveedores o acelerar cobranza'
      });
    }

    // Rentabilidad
    if (analysis.profitability.grossMargin.value < 50) {
      recommendations.push({
        area: 'Rentabilidad',
        priority: 'alta',
        recommendation: 'Revisar estructura de costos: food cost probablemente elevado'
      });
    }

    // Eficiencia
    if (analysis.efficiency.cashConversionCycle > 30) {
      recommendations.push({
        area: 'Eficiencia',
        priority: 'media',
        recommendation: 'Optimizar ciclo de conversión de efectivo para mejorar liquidez'
      });
    }

    // Apalancamiento
    if (analysis.leverage.debtToEquity.status === 'critical') {
      recommendations.push({
        area: 'Estructura de Capital',
        priority: 'alta',
        recommendation: 'Reducir deuda o aumentar capital para mejorar solidez financiera'
      });
    }

    return recommendations;
  }

  // ============ PRESUPUESTOS ============

  async createBudget(params) {
    const { period, departments, assumptions } = params;

    this.emitEvent('budget_creation_started', { period });

    const budget = {
      id: `budget_${Date.now()}`,
      period,
      createdAt: new Date().toISOString(),
      createdBy: this.nombre,
      status: 'draft',
      departments: {},
      totals: {
        revenue: 0,
        expenses: 0,
        profit: 0
      },
      assumptions
    };

    // Procesar cada departamento
    for (const dept of departments) {
      budget.departments[dept.name] = {
        revenue: dept.projectedRevenue || 0,
        expenses: this._calculateDepartmentExpenses(dept, assumptions),
        variance: 0
      };
      budget.totals.revenue += budget.departments[dept.name].revenue;
      budget.totals.expenses += budget.departments[dept.name].expenses;
    }

    budget.totals.profit = budget.totals.revenue - budget.totals.expenses;

    this.budgets.set(budget.id, budget);
    this.emitEvent('budget_created', { budgetId: budget.id });

    return budget;
  }

  _calculateDepartmentExpenses(dept, assumptions) {
    const baseExpenses = dept.baseExpenses || 0;
    const inflationFactor = 1 + ((assumptions?.inflation || 4) / 100);
    const growthFactor = 1 + ((dept.expectedGrowth || 0) / 100);

    return baseExpenses * inflationFactor * growthFactor;
  }

  // ============ PROYECCIONES ============

  async createFinancialForecast(params) {
    const { baseData, periods, growthAssumptions } = params;

    // Validar períodos mínimos
    if (!periods || periods < 1) {
      throw new Error('El forecast requiere al menos 1 período');
    }

    this.emitEvent('forecast_started', { periods });

    const forecast = {
      id: `forecast_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: this.nombre,
      baseData,
      periods: [],
      summary: {}
    };

    let previousPeriod = baseData;

    for (let i = 1; i <= periods; i++) {
      const periodData = this._projectPeriod(previousPeriod, growthAssumptions, i);
      forecast.periods.push(periodData);
      previousPeriod = periodData;
    }

    // Calcular resumen
    forecast.summary = {
      totalRevenueGrowth: ((forecast.periods[periods - 1].revenue / baseData.revenue) - 1) * 100,
      averageMargin: forecast.periods.reduce((sum, p) => sum + p.netMargin, 0) / periods,
      cumulativeProfit: forecast.periods.reduce((sum, p) => sum + p.netProfit, 0)
    };

    this.forecasts.set(forecast.id, forecast);
    this.emitEvent('forecast_completed', { forecastId: forecast.id });

    return forecast;
  }

  _projectPeriod(previousData, assumptions, periodNumber) {
    const revenueGrowth = assumptions.revenueGrowth || 5;
    const costInflation = assumptions.costInflation || 3;
    const laborGrowth = assumptions.laborGrowth || 4;

    const revenue = previousData.revenue * (1 + revenueGrowth / 100);
    const cogs = previousData.cogs * (1 + costInflation / 100);
    const laborCost = previousData.laborCost * (1 + laborGrowth / 100);
    const otherExpenses = previousData.otherExpenses * (1 + costInflation / 100);

    const grossProfit = revenue - cogs;
    const operatingExpenses = laborCost + otherExpenses;
    const operatingProfit = grossProfit - operatingExpenses;
    const netProfit = operatingProfit * (1 - (assumptions.taxRate || 30) / 100);

    return {
      period: periodNumber,
      revenue,
      cogs,
      grossProfit,
      grossMargin: (grossProfit / revenue) * 100,
      laborCost,
      otherExpenses,
      operatingExpenses,
      operatingProfit,
      operatingMargin: (operatingProfit / revenue) * 100,
      netProfit,
      netMargin: (netProfit / revenue) * 100
    };
  }

  // ============ GENERACIÓN DE REPORTES ESPECÍFICOS DEL CFO ============

  async generateExecutiveFinancialReport(data, options = {}) {
    const reportData = {
      title: options.title || 'Reporte Financiero Ejecutivo',
      period: options.period || 'Mensual',
      summary: data.summary || 'Análisis financiero del período',
      metrics: [
        { name: 'Ingresos Totales', value: data.revenue, unit: '', trend: data.revenueTrend },
        { name: 'EBITDA', value: data.ebitda, unit: '', trend: data.ebitdaTrend },
        { name: 'Margen Bruto', value: data.grossMargin, unit: '%', trend: data.marginTrend },
        { name: 'Food Cost', value: data.foodCost, unit: '%', trend: data.foodCostTrend },
        { name: 'Labor Cost', value: data.laborCost, unit: '%', trend: data.laborTrend },
        { name: 'Prime Cost', value: data.primeCost, unit: '%', trend: data.primeCostTrend }
      ],
      sections: [
        {
          title: 'Resumen Ejecutivo',
          content: this._generateExecutiveSummary(data)
        },
        {
          title: 'Análisis de Rentabilidad',
          content: this._generateProfitabilityAnalysis(data)
        },
        {
          title: 'Recomendaciones',
          content: this._generateCFORecommendations(data)
        }
      ]
    };

    // Usar capacidad universal de generación de documentos
    return this.generateDocument('pdf', reportData, {
      ...options,
      type: 'report'
    });
  }

  _generateExecutiveSummary(data) {
    return `Los resultados financieros del período muestran ingresos de $${(data.revenue || 0).toLocaleString('es-MX')} ` +
      `con un EBITDA de $${(data.ebitda || 0).toLocaleString('es-MX')} (${((data.ebitda / data.revenue) * 100).toFixed(1)}% de margen). ` +
      `El food cost se mantiene en ${data.foodCost?.toFixed(1) || 'N/A'}% y el labor cost en ${data.laborCost?.toFixed(1) || 'N/A'}%, ` +
      `resultando en un prime cost de ${data.primeCost?.toFixed(1) || 'N/A'}%.`;
  }

  _generateProfitabilityAnalysis(data) {
    const targetFoodCost = 30;
    const targetLaborCost = 30;
    const targetPrimeCost = 60;

    let analysis = '';

    if (data.foodCost > targetFoodCost) {
      analysis += `Food cost por encima del objetivo (${data.foodCost.toFixed(1)}% vs ${targetFoodCost}%). `;
    }

    if (data.laborCost > targetLaborCost) {
      analysis += `Labor cost elevado (${data.laborCost.toFixed(1)}% vs ${targetLaborCost}% objetivo). `;
    }

    if (data.primeCost > targetPrimeCost) {
      analysis += `Prime cost requiere atención inmediata (${data.primeCost.toFixed(1)}% vs ${targetPrimeCost}% objetivo).`;
    }

    return analysis || 'Los indicadores de rentabilidad se encuentran dentro de los parámetros esperados.';
  }

  _generateCFORecommendations(data) {
    const recommendations = [];

    if (data.foodCost > 32) {
      recommendations.push('• Revisar proveedores y negociar mejores precios');
      recommendations.push('• Implementar control de mermas más estricto');
    }

    if (data.laborCost > 32) {
      recommendations.push('• Optimizar programación de turnos');
      recommendations.push('• Evaluar productividad por colaborador');
    }

    if (data.cashFlow < 0) {
      recommendations.push('• Revisar política de cobranza');
      recommendations.push('• Negociar plazos extendidos con proveedores');
    }

    return recommendations.length > 0
      ? recommendations.join('\n')
      : '• Mantener estrategia actual\n• Continuar monitoreo de indicadores clave';
  }

  // ============ EXPORTACIÓN DE DATOS FINANCIEROS ============

  async exportFinancialData(dataType, data, format = 'excel') {
    const formattedData = this._formatFinancialData(dataType, data);
    return this.generateDocument(format, formattedData, {
      title: `Datos Financieros - ${dataType}`,
      sheetName: dataType
    });
  }

  _formatFinancialData(dataType, data) {
    switch (dataType) {
      case 'incomeStatement':
        return this._formatIncomeStatement(data);
      case 'balanceSheet':
        return this._formatBalanceSheet(data);
      case 'cashFlow':
        return this._formatCashFlow(data);
      default:
        return data;
    }
  }

  _formatIncomeStatement(data) {
    return [
      { Concepto: 'Ventas Totales', Monto: data.revenue || 0 },
      { Concepto: 'Costo de Ventas', Monto: -(data.cogs || 0) },
      { Concepto: 'UTILIDAD BRUTA', Monto: (data.revenue || 0) - (data.cogs || 0) },
      { Concepto: 'Gastos de Operación', Monto: -(data.operatingExpenses || 0) },
      { Concepto: '  - Nómina', Monto: -(data.payroll || 0) },
      { Concepto: '  - Renta', Monto: -(data.rent || 0) },
      { Concepto: '  - Servicios', Monto: -(data.utilities || 0) },
      { Concepto: '  - Marketing', Monto: -(data.marketing || 0) },
      { Concepto: '  - Otros', Monto: -(data.otherExpenses || 0) },
      { Concepto: 'EBITDA', Monto: data.ebitda || 0 },
      { Concepto: 'Depreciación', Monto: -(data.depreciation || 0) },
      { Concepto: 'UTILIDAD OPERATIVA', Monto: data.operatingIncome || 0 },
      { Concepto: 'Gastos Financieros', Monto: -(data.interestExpense || 0) },
      { Concepto: 'UTILIDAD ANTES DE IMPUESTOS', Monto: data.ebt || 0 },
      { Concepto: 'Impuestos', Monto: -(data.taxes || 0) },
      { Concepto: 'UTILIDAD NETA', Monto: data.netIncome || 0 }
    ];
  }

  _formatBalanceSheet(data) {
    return {
      Activos: [
        { Cuenta: 'Efectivo', Monto: data.cash || 0 },
        { Cuenta: 'Cuentas por Cobrar', Monto: data.receivables || 0 },
        { Cuenta: 'Inventarios', Monto: data.inventory || 0 },
        { Cuenta: 'Activo Circulante Total', Monto: data.currentAssets || 0 },
        { Cuenta: 'Activo Fijo', Monto: data.fixedAssets || 0 },
        { Cuenta: 'ACTIVO TOTAL', Monto: data.totalAssets || 0 }
      ],
      Pasivos: [
        { Cuenta: 'Cuentas por Pagar', Monto: data.payables || 0 },
        { Cuenta: 'Deuda Corto Plazo', Monto: data.shortTermDebt || 0 },
        { Cuenta: 'Pasivo Circulante Total', Monto: data.currentLiabilities || 0 },
        { Cuenta: 'Deuda Largo Plazo', Monto: data.longTermDebt || 0 },
        { Cuenta: 'PASIVO TOTAL', Monto: data.totalLiabilities || 0 }
      ],
      Capital: [
        { Cuenta: 'Capital Social', Monto: data.equity || 0 },
        { Cuenta: 'Utilidades Retenidas', Monto: data.retainedEarnings || 0 },
        { Cuenta: 'CAPITAL TOTAL', Monto: data.totalEquity || 0 }
      ]
    };
  }

  _formatCashFlow(data) {
    return [
      { Concepto: 'FLUJO DE OPERACIÓN', Monto: '' },
      { Concepto: 'Utilidad Neta', Monto: data.netIncome || 0 },
      { Concepto: '+ Depreciación', Monto: data.depreciation || 0 },
      { Concepto: '+/- Cambio en Capital de Trabajo', Monto: data.workingCapitalChange || 0 },
      { Concepto: 'Flujo de Operación', Monto: data.operatingCashFlow || 0 },
      { Concepto: '', Monto: '' },
      { Concepto: 'FLUJO DE INVERSIÓN', Monto: '' },
      { Concepto: 'Compra de Activos', Monto: -(data.capex || 0) },
      { Concepto: 'Flujo de Inversión', Monto: data.investingCashFlow || 0 },
      { Concepto: '', Monto: '' },
      { Concepto: 'FLUJO DE FINANCIAMIENTO', Monto: '' },
      { Concepto: 'Préstamos', Monto: data.borrowings || 0 },
      { Concepto: 'Pago de Deuda', Monto: -(data.debtPayments || 0) },
      { Concepto: 'Dividendos', Monto: -(data.dividends || 0) },
      { Concepto: 'Flujo de Financiamiento', Monto: data.financingCashFlow || 0 },
      { Concepto: '', Monto: '' },
      { Concepto: 'CAMBIO NETO EN EFECTIVO', Monto: data.netCashChange || 0 }
    ];
  }

  // Método para delegar tareas a otros agentes financieros
  async delegateTask(taskType, targetAgentId, taskData) {
    if (!this.config.delegaA.includes(targetAgentId)) {
      throw new Error(`No se puede delegar al agente ${targetAgentId}`);
    }

    this.emitEvent('task_delegated', {
      from: this.id,
      to: targetAgentId,
      taskType,
      taskData
    });

    return {
      delegated: true,
      from: this.id,
      to: targetAgentId,
      taskType,
      timestamp: new Date().toISOString()
    };
  }
}

export default CFOAgent;
