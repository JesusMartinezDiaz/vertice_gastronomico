/**
 * ControllerAgent - Controller Financiero
 * Agente #3 - Guardián de la integridad financiera
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class ControllerAgent extends UniversalAgent {
  constructor() {
    super({
      id: 3,
      emoji: '📊',
      nombre: 'Controller Financiero',
      nombreCorto: 'CONTROLLER',
      categoria: 'FINANZAS',
      experiencia: { años: 10, rango: '10+ años' },
      descripcion: 'Guardián de la integridad financiera con expertise en control interno y compliance.',
      perfil: {
        formacion: 'Contador Público + Maestría en Contaduría o Finanzas',
        certificaciones: ['CPA', 'CIA', 'CISA', 'SOX Compliance'],
        competencias: ['Control interno', 'Auditoría financiera', 'Compliance regulatorio', 'Consolidación contable', 'Gestión de riesgos', 'Análisis de variaciones'],
        herramientas: ['SAP', 'Oracle', 'Workiva', 'AuditBoard', 'FloQast', 'Trintech'],
        kpis: ['Close Cycle Time', 'Audit Findings', 'Policy Compliance Rate', 'Restatement Frequency', 'Control Effectiveness'],
        logros: ['Reducción de cierre mensual de 15 a 5 días', 'Cero hallazgos materiales en auditoría externa 3 años consecutivos', 'Implementación de sistema de control continuo'],
        metodologias: ['COSO Framework', 'SOX Compliance', 'Continuous Auditing', 'Risk-Based Internal Audit']
      },
      triggers: ['control', 'auditoría', 'compliance', 'cierre contable', 'variaciones', 'políticas financieras'],
      delegaA: [4, 5]
    });

    this.controls = new Map();
    this.auditFindings = [];
    this.complianceStatus = {};
  }

  async performVarianceAnalysis(actual, budget, period) {
    this.emitEvent('variance_analysis_started', { period });

    const analysis = {
      period,
      analyzedAt: new Date().toISOString(),
      analyzedBy: this.nombre,
      variances: [],
      summary: { favorable: 0, unfavorable: 0, total: 0 },
      recommendations: []
    };

    const categories = ['revenue', 'foodCost', 'laborCost', 'occupancy', 'utilities', 'marketing', 'other'];

    for (const category of categories) {
      const actualVal = actual[category] || 0;
      const budgetVal = budget[category] || 0;
      const variance = actualVal - budgetVal;
      const variancePercent = budgetVal !== 0 ? (variance / budgetVal) * 100 : 0;

      // Para costos, varianza negativa es favorable
      const isCost = ['foodCost', 'laborCost', 'occupancy', 'utilities', 'marketing', 'other'].includes(category);
      const isFavorable = isCost ? variance < 0 : variance > 0;

      analysis.variances.push({
        category,
        actual: actualVal,
        budget: budgetVal,
        variance,
        variancePercent,
        isFavorable,
        status: Math.abs(variancePercent) <= 5 ? 'OK' : Math.abs(variancePercent) <= 10 ? 'WARNING' : 'CRITICAL'
      });

      if (isFavorable) {
        analysis.summary.favorable++;
      } else {
        analysis.summary.unfavorable++;
      }
      analysis.summary.total++;
    }

    // Generar recomendaciones
    for (const v of analysis.variances) {
      if (v.status === 'CRITICAL' && !v.isFavorable) {
        analysis.recommendations.push({
          category: v.category,
          priority: 'ALTA',
          action: `${v.category}: Variación de ${v.variancePercent.toFixed(1)}% requiere acción inmediata`,
          impact: `Impacto: $${Math.abs(v.variance).toLocaleString('es-MX')}`
        });
      }
    }

    this.emitEvent('variance_analysis_completed', { summary: analysis.summary });
    return analysis;
  }

  async performInternalAudit(area, data) {
    this.emitEvent('audit_started', { area });

    const audit = {
      id: `audit_${Date.now()}`,
      area,
      auditedAt: new Date().toISOString(),
      auditor: this.nombre,
      findings: [],
      score: 100,
      status: 'passed'
    };

    // Controles específicos por área
    const controls = this._getControlsForArea(area);

    for (const control of controls) {
      const result = await this._testControl(control, data);
      if (!result.passed) {
        audit.findings.push({
          control: control.name,
          finding: result.finding,
          severity: result.severity,
          recommendation: result.recommendation
        });
        audit.score -= result.severity === 'critical' ? 25 : result.severity === 'major' ? 15 : 5;
      }
    }

    audit.status = audit.score >= 80 ? 'passed' : audit.score >= 60 ? 'conditional' : 'failed';
    this.auditFindings.push(...audit.findings);

    this.emitEvent('audit_completed', { area, score: audit.score, findingsCount: audit.findings.length });
    return audit;
  }

  _getControlsForArea(area) {
    const controlSets = {
      cashHandling: [
        { name: 'Arqueo de caja', test: 'cashCount', severity: 'critical' },
        { name: 'Corte de turno', test: 'shiftCut', severity: 'major' },
        { name: 'Depósitos a tiempo', test: 'depositTimeliness', severity: 'major' }
      ],
      inventory: [
        { name: 'Conteo físico', test: 'physicalCount', severity: 'critical' },
        { name: 'FIFO compliance', test: 'fifoCompliance', severity: 'major' },
        { name: 'Documentación de mermas', test: 'wasteDocumentation', severity: 'minor' }
      ],
      purchasing: [
        { name: 'Órdenes autorizadas', test: 'poAuthorization', severity: 'critical' },
        { name: 'Tres cotizaciones', test: 'threeQuotes', severity: 'major' },
        { name: 'Recepción documentada', test: 'receivingDocs', severity: 'major' }
      ],
      payroll: [
        { name: 'Horas autorizadas', test: 'hoursAuthorization', severity: 'critical' },
        { name: 'Cálculo correcto', test: 'payrollCalculation', severity: 'critical' },
        { name: 'Retenciones correctas', test: 'withholdings', severity: 'major' }
      ]
    };
    return controlSets[area] || [];
  }

  async _testControl(control, data) {
    // Simulación de prueba de control
    const passed = Math.random() > 0.2; // 80% pass rate para demo
    return {
      passed,
      finding: passed ? null : `Deficiencia en ${control.name}`,
      severity: control.severity,
      recommendation: passed ? null : `Implementar controles adicionales para ${control.name}`
    };
  }

  async generateComplianceReport(period) {
    const report = {
      period,
      generatedAt: new Date().toISOString(),
      generatedBy: this.nombre,
      areas: {},
      overallScore: 0,
      status: 'compliant'
    };

    const areas = ['cashHandling', 'inventory', 'purchasing', 'payroll'];
    let totalScore = 0;

    for (const area of areas) {
      const audit = await this.performInternalAudit(area, {});
      report.areas[area] = {
        score: audit.score,
        status: audit.status,
        findings: audit.findings.length
      };
      totalScore += audit.score;
    }

    report.overallScore = totalScore / areas.length;
    report.status = report.overallScore >= 80 ? 'compliant' : report.overallScore >= 60 ? 'partially_compliant' : 'non_compliant';

    return this.generateDocument('pdf', report, {
      title: `Reporte de Compliance - ${period}`,
      type: 'report'
    });
  }
}

export default ControllerAgent;
