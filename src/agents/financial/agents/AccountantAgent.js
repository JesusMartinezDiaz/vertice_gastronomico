/**
 * AccountantAgent - Contador General
 * Agente #7 - Contabilidad general y cumplimiento fiscal
 */

import { UniversalAgent } from '../../shared/UniversalCapabilities.js';

export class AccountantAgent extends UniversalAgent {
  constructor() {
    super({
      id: 7,
      emoji: '🧾',
      nombre: 'Contador General',
      nombreCorto: 'ACCOUNTANT',
      categoria: 'FINANZAS',
      experiencia: { años: 7, rango: '7+ años' },
      descripcion: 'Responsable de la contabilidad general, reportes fiscales y cumplimiento normativo.',
      perfil: {
        formacion: 'Contador Público Certificado',
        certificaciones: ['CPA', 'Especialista en ISR/IVA', 'IFRS Certification'],
        competencias: ['Contabilidad general', 'Reportes fiscales', 'Conciliaciones bancarias', 'Nóminas', 'Declaraciones fiscales', 'Facturación electrónica'],
        herramientas: ['SAP', 'CONTPAQi', 'Aspel', 'FacturaE', 'IDSE', 'SUA'],
        kpis: ['Days to Close', 'Journal Entry Accuracy', 'Tax Filing Timeliness', 'Reconciliation Rate', 'Audit Adjustments'],
        logros: ['Implementación de facturación 4.0', 'Automatización del 80% de asientos recurrentes', 'Reducción de tiempo de cierre a 3 días'],
        metodologias: ['Month-End Close Process', 'Account Reconciliation', 'Tax Planning', 'Continuous Accounting']
      },
      triggers: ['contabilidad', 'impuestos', 'facturas', 'SAT', 'declaraciones', 'nómina'],
      delegaA: [3, 6]
    });

    this.ledger = new Map();
    this.taxObligations = [];
  }

  async processJournalEntry(entry) {
    this.emitEvent('journal_entry_started', { description: entry.description });

    // Validar partida doble
    const totalDebits = entry.lines.filter(l => l.type === 'debit').reduce((sum, l) => sum + l.amount, 0);
    const totalCredits = entry.lines.filter(l => l.type === 'credit').reduce((sum, l) => sum + l.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error(`Partida doble no cuadra: Débitos ${totalDebits} vs Créditos ${totalCredits}`);
    }

    const journalEntry = {
      id: `je_${Date.now()}`,
      date: entry.date || new Date().toISOString(),
      description: entry.description,
      reference: entry.reference,
      lines: entry.lines,
      totalAmount: totalDebits,
      status: 'posted',
      createdBy: this.nombre,
      createdAt: new Date().toISOString()
    };

    this.ledger.set(journalEntry.id, journalEntry);
    this.emitEvent('journal_entry_completed', { id: journalEntry.id });

    return journalEntry;
  }

  async generateTrialBalance(period) {
    const trialBalance = {
      period,
      generatedAt: new Date().toISOString(),
      generatedBy: this.nombre,
      accounts: [],
      totalDebits: 0,
      totalCredits: 0,
      isBalanced: false
    };

    // Agrupar por cuenta
    const accountBalances = new Map();

    for (const entry of this.ledger.values()) {
      for (const line of entry.lines) {
        const current = accountBalances.get(line.account) || { debit: 0, credit: 0 };
        if (line.type === 'debit') {
          current.debit += line.amount;
        } else {
          current.credit += line.amount;
        }
        accountBalances.set(line.account, current);
      }
    }

    for (const [account, balances] of accountBalances) {
      trialBalance.accounts.push({
        account,
        debit: balances.debit,
        credit: balances.credit,
        balance: balances.debit - balances.credit
      });
      trialBalance.totalDebits += balances.debit;
      trialBalance.totalCredits += balances.credit;
    }

    trialBalance.isBalanced = Math.abs(trialBalance.totalDebits - trialBalance.totalCredits) < 0.01;

    return trialBalance;
  }

  async calculateTaxes(data) {
    this.emitEvent('tax_calculation_started', { period: data.period });

    const taxes = {
      period: data.period,
      calculatedAt: new Date().toISOString(),
      calculatedBy: this.nombre,
      iva: {},
      isr: {},
      payrollTaxes: {},
      summary: {}
    };

    // IVA
    taxes.iva = {
      ivaCobrado: data.revenue * 0.16,
      ivaPagado: (data.purchases || 0) * 0.16,
      ivaAPagar: (data.revenue * 0.16) - ((data.purchases || 0) * 0.16)
    };

    // ISR (simplificado - tasa efectiva del 30%)
    const utilidadFiscal = data.revenue - (data.deductibleExpenses || data.revenue * 0.7);
    taxes.isr = {
      ingresos: data.revenue,
      deducciones: data.deductibleExpenses || data.revenue * 0.7,
      utilidadFiscal,
      tasaISR: 30,
      isrACargo: utilidadFiscal * 0.30
    };

    // Impuestos sobre nómina (3% promedio estatal)
    taxes.payrollTaxes = {
      baseGravable: data.payroll || 0,
      tasa: 3,
      impuesto: (data.payroll || 0) * 0.03
    };

    // Resumen
    taxes.summary = {
      totalAPagar: taxes.iva.ivaAPagar + taxes.isr.isrACargo + taxes.payrollTaxes.impuesto,
      fechaLimite: this._getNextTaxDeadline(),
      obligaciones: [
        { concepto: 'IVA', monto: taxes.iva.ivaAPagar, fechaLimite: '17 del mes siguiente' },
        { concepto: 'ISR', monto: taxes.isr.isrACargo, fechaLimite: '17 del mes siguiente' },
        { concepto: 'ISN', monto: taxes.payrollTaxes.impuesto, fechaLimite: '17 del mes siguiente' }
      ]
    };

    this.emitEvent('tax_calculation_completed', { totalAPagar: taxes.summary.totalAPagar });
    return taxes;
  }

  _getNextTaxDeadline() {
    const today = new Date();
    const deadline = new Date(today.getFullYear(), today.getMonth() + 1, 17);
    return deadline.toISOString().split('T')[0];
  }

  async generateFinancialStatements(period, data) {
    const statements = {
      period,
      generatedAt: new Date().toISOString(),
      generatedBy: this.nombre,
      incomeStatement: this._generateIncomeStatement(data),
      balanceSheet: this._generateBalanceSheet(data),
      cashFlowStatement: this._generateCashFlowStatement(data)
    };

    return this.generateDocument('pdf', statements, {
      title: `Estados Financieros - ${period}`,
      type: 'financial'
    });
  }

  _generateIncomeStatement(data) {
    const grossProfit = (data.revenue || 0) - (data.cogs || 0);
    const operatingExpenses = (data.laborCost || 0) + (data.rent || 0) + (data.utilities || 0) + (data.marketing || 0) + (data.other || 0);
    const operatingIncome = grossProfit - operatingExpenses;
    const ebt = operatingIncome - (data.interestExpense || 0);
    const netIncome = ebt * 0.70; // 30% impuestos

    return {
      revenue: data.revenue || 0,
      cogs: data.cogs || 0,
      grossProfit,
      grossMargin: ((grossProfit / (data.revenue || 1)) * 100).toFixed(1),
      operatingExpenses,
      operatingIncome,
      operatingMargin: ((operatingIncome / (data.revenue || 1)) * 100).toFixed(1),
      interestExpense: data.interestExpense || 0,
      ebt,
      taxes: ebt * 0.30,
      netIncome,
      netMargin: ((netIncome / (data.revenue || 1)) * 100).toFixed(1)
    };
  }

  _generateBalanceSheet(data) {
    return {
      assets: {
        current: {
          cash: data.cash || 0,
          receivables: data.receivables || 0,
          inventory: data.inventory || 0,
          total: (data.cash || 0) + (data.receivables || 0) + (data.inventory || 0)
        },
        fixed: {
          equipment: data.equipment || 0,
          furniture: data.furniture || 0,
          leasehold: data.leasehold || 0,
          accumulated_depreciation: -(data.depreciation || 0),
          total: (data.equipment || 0) + (data.furniture || 0) + (data.leasehold || 0) - (data.depreciation || 0)
        }
      },
      liabilities: {
        current: {
          payables: data.payables || 0,
          accruedExpenses: data.accruedExpenses || 0,
          shortTermDebt: data.shortTermDebt || 0,
          total: (data.payables || 0) + (data.accruedExpenses || 0) + (data.shortTermDebt || 0)
        },
        longTerm: {
          longTermDebt: data.longTermDebt || 0,
          total: data.longTermDebt || 0
        }
      },
      equity: {
        capital: data.capital || 0,
        retainedEarnings: data.retainedEarnings || 0,
        total: (data.capital || 0) + (data.retainedEarnings || 0)
      }
    };
  }

  _generateCashFlowStatement(data) {
    return {
      operating: {
        netIncome: data.netIncome || 0,
        depreciation: data.depreciation || 0,
        changesInWorkingCapital: data.workingCapitalChange || 0,
        total: (data.netIncome || 0) + (data.depreciation || 0) + (data.workingCapitalChange || 0)
      },
      investing: {
        capex: -(data.capex || 0),
        total: -(data.capex || 0)
      },
      financing: {
        debtProceeds: data.newDebt || 0,
        debtRepayment: -(data.debtRepayment || 0),
        dividends: -(data.dividends || 0),
        total: (data.newDebt || 0) - (data.debtRepayment || 0) - (data.dividends || 0)
      }
    };
  }

  async exportToExcel(dataType, data) {
    let formattedData;

    switch (dataType) {
      case 'journalEntries':
        formattedData = Array.from(this.ledger.values()).map(je => ({
          Fecha: je.date,
          Descripción: je.description,
          Referencia: je.reference,
          Monto: je.totalAmount,
          Estado: je.status
        }));
        break;
      case 'trialBalance':
        formattedData = data.accounts.map(acc => ({
          Cuenta: acc.account,
          Débito: acc.debit,
          Crédito: acc.credit,
          Saldo: acc.balance
        }));
        break;
      case 'taxes':
        formattedData = data.summary.obligaciones;
        break;
      default:
        formattedData = data;
    }

    return this.generateDocument('excel', formattedData, {
      title: `Exportación - ${dataType}`,
      sheetName: dataType
    });
  }
}

export default AccountantAgent;
