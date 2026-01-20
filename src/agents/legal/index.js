/**
 * Legal Agents - Agentes Legales (34-39)
 *
 * CONTEXTO: Vértice Gastronómico es una CONSULTORÍA que asesora restaurantes.
 * Estos agentes proveen servicios legales y de cumplimiento a los clientes.
 *
 * Agentes:
 * - 34: Director Legal (CLO)
 * - 35: Abogado Corporativo
 * - 36: Abogado Laboral
 * - 37: Especialista en Contratos
 * - 38: Especialista en Cumplimiento Regulatorio
 * - 39: Especialista en Propiedad Intelectual
 */

import { EventEmitter } from 'events';

// Constantes Legales
export const LEGAL_AREAS = {
  CORPORATE: 'corporate',
  LABOR: 'labor',
  CONTRACTS: 'contracts',
  REGULATORY: 'regulatory',
  IP: 'intellectual_property',
  REAL_ESTATE: 'real_estate',
  TAX: 'tax',
  LITIGATION: 'litigation'
};

export const CONTRACT_TYPES = {
  LEASE: 'lease',
  VENDOR: 'vendor',
  EMPLOYMENT: 'employment',
  FRANCHISE: 'franchise',
  LICENSING: 'licensing',
  NDA: 'nda',
  PARTNERSHIP: 'partnership',
  SERVICE: 'service'
};

export const COMPLIANCE_STATUS = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  EXPIRED: 'expired'
};

export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  APPROVED: 'approved',
  SIGNED: 'signed',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated'
};

/**
 * Clase base para agentes Legales
 */
class BaseLegalAgent extends EventEmitter {
  constructor(id, name, specialty) {
    super();
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.category = 'legal';
    this.initialized = false;
    this.currentTasks = [];
    this.metrics = {
      documentsReviewed: 0,
      contractsDrafted: 0,
      auditsCompleted: 0
    };
  }

  async initialize() {
    if (this.initialized) return;
    console.log(`[Agent ${this.id}] Inicializando ${this.name}...`);
    this.initialized = true;
    this.emit('initialized', { agentId: this.id, name: this.name });
  }

  async processRequest(message, context = {}) {
    await this.initialize();

    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      context,
      startedAt: new Date().toISOString(),
      status: 'processing'
    };

    this.currentTasks.push(task);
    this.emit('task:started', { task });

    try {
      const result = await this.executeTask(task);
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = result;
      this.emit('task:completed', { task });
      return result;
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      this.emit('task:failed', { task, error });
      throw error;
    }
  }

  async executeTask(task) {
    throw new Error('executeTask debe ser implementado por subclases');
  }

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      specialty: this.specialty,
      category: this.category,
      initialized: this.initialized,
      activeTasks: this.currentTasks.filter(t => t.status === 'processing').length,
      metrics: this.metrics
    };
  }
}

/**
 * Agent 34 - Director Legal (CLO)
 * Responsable de la estrategia legal global
 */
export class CLOAgent extends BaseLegalAgent {
  constructor() {
    super(34, 'Director Legal (CLO)', 'Estrategia legal y gestión de riesgos');
    this.capabilities = [
      'legal_strategy',
      'risk_management',
      'compliance_oversight',
      'litigation_management',
      'team_coordination',
      'regulatory_relations',
      'corporate_governance',
      'contract_oversight'
    ];
    this.subordinates = [35, 36, 37, 38, 39];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'legal_leadership',
      legalAssessment: await this.assessLegalNeeds(context),
      riskAnalysis: this.analyzeRisks(context),
      recommendations: this.generateRecommendations(context),
      delegation: this.planDelegation(context),
      timestamp: new Date().toISOString()
    };
  }

  async assessLegalNeeds(context) {
    return {
      corporateStructure: 'review_needed',
      contracts: { total: 0, expiring: 0, needsReview: 0 },
      compliance: { status: 'assessment_needed', areas: [] },
      employment: { employees: 0, contractors: 0, issues: [] },
      licenses: { total: 0, expiring: 0, missing: [] },
      risks: []
    };
  }

  analyzeRisks(context) {
    return {
      categories: [
        {
          category: 'Regulatory',
          level: 'high',
          risks: ['Health permits', 'Liquor license', 'Business license'],
          mitigation: 'Compliance audit'
        },
        {
          category: 'Employment',
          level: 'medium',
          risks: ['Worker classification', 'Wage compliance', 'Harassment'],
          mitigation: 'HR policies review'
        },
        {
          category: 'Contractual',
          level: 'medium',
          risks: ['Lease terms', 'Vendor disputes', 'Insurance gaps'],
          mitigation: 'Contract review'
        },
        {
          category: 'Intellectual Property',
          level: 'low',
          risks: ['Trademark', 'Recipe protection', 'Brand infringement'],
          mitigation: 'IP registration'
        }
      ]
    };
  }

  generateRecommendations(context) {
    return [
      {
        priority: 'crítica',
        area: 'Compliance',
        action: 'Auditoría completa de permisos y licencias',
        assignTo: 38
      },
      {
        priority: 'alta',
        area: 'Employment',
        action: 'Revisar contratos y clasificación de empleados',
        assignTo: 36
      },
      {
        priority: 'alta',
        area: 'Contracts',
        action: 'Revisar y actualizar contratos con proveedores',
        assignTo: 37
      },
      {
        priority: 'media',
        area: 'Corporate',
        action: 'Revisar estructura corporativa y protecciones',
        assignTo: 35
      },
      {
        priority: 'media',
        area: 'IP',
        action: 'Registrar marca y proteger propiedad intelectual',
        assignTo: 39
      }
    ];
  }

  planDelegation(context) {
    return {
      delegateTo: this.subordinates,
      assignments: [
        { agentId: 35, task: 'corporate_review', priority: 'medium' },
        { agentId: 36, task: 'employment_audit', priority: 'high' },
        { agentId: 37, task: 'contract_review', priority: 'high' },
        { agentId: 38, task: 'compliance_audit', priority: 'critical' },
        { agentId: 39, task: 'ip_protection', priority: 'medium' }
      ]
    };
  }

  async createLegalStrategy(data, context = {}) {
    return {
      strategyId: `legal_strategy_${Date.now()}`,
      clientId: data.clientId,
      restaurantName: data.restaurantName,
      assessment: await this.assessLegalNeeds(context),
      risks: this.analyzeRisks(context),
      priorities: this.definePriorities(data),
      timeline: this.createTimeline(data),
      budget: this.estimateLegalBudget(data),
      created: new Date().toISOString()
    };
  }

  definePriorities(data) {
    return [
      { priority: 1, area: 'Compliance', reason: 'Regulatory requirement' },
      { priority: 2, area: 'Employment', reason: 'Risk mitigation' },
      { priority: 3, area: 'Contracts', reason: 'Cost optimization' },
      { priority: 4, area: 'Corporate', reason: 'Asset protection' },
      { priority: 5, area: 'IP', reason: 'Brand protection' }
    ];
  }

  createTimeline(data) {
    return {
      immediate: ['Compliance audit', 'Critical contract review'],
      shortTerm: ['Employment audit', 'Insurance review'],
      mediumTerm: ['Corporate restructuring', 'IP registration'],
      ongoing: ['Contract management', 'Compliance monitoring']
    };
  }

  estimateLegalBudget(data) {
    return {
      complianceAudit: 2000,
      contractReview: 3000,
      employmentAudit: 2500,
      corporateReview: 1500,
      ipRegistration: 2000,
      retainer: 500,
      total: 11500,
      notes: 'Estimates based on typical restaurant needs'
    };
  }
}

/**
 * Agent 35 - Abogado Corporativo
 * Estructura corporativa y gobierno
 */
export class CorporateLawyerAgent extends BaseLegalAgent {
  constructor() {
    super(35, 'Abogado Corporativo', 'Estructura corporativa y gobierno empresarial');
    this.capabilities = [
      'corporate_structure',
      'entity_formation',
      'governance',
      'mergers_acquisitions',
      'shareholder_agreements',
      'corporate_compliance',
      'business_planning',
      'asset_protection'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'corporate_law',
      corporateAssessment: await this.assessCorporateStructure(context),
      recommendations: this.generateRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async assessCorporateStructure(context) {
    return {
      entityType: 'to_be_determined',
      registrations: {
        state: 'check',
        federal: 'check',
        local: 'check'
      },
      ownership: {
        structure: 'unknown',
        agreements: 'review_needed'
      },
      governance: {
        bylaws: 'review',
        minutes: 'review',
        resolutions: 'review'
      },
      liability: {
        protection: 'assessment_needed',
        insurance: 'check'
      }
    };
  }

  generateRecommendations(context) {
    return [
      {
        area: 'Entity Structure',
        recommendation: 'Consider LLC or S-Corp for liability protection and tax benefits',
        priority: 'alta'
      },
      {
        area: 'Asset Protection',
        recommendation: 'Separate real estate from operating entity',
        priority: 'media'
      },
      {
        area: 'Governance',
        recommendation: 'Establish formal operating agreement and meeting minutes',
        priority: 'media'
      }
    ];
  }

  async recommendEntityStructure(data, context = {}) {
    return {
      analysisId: `entity_analysis_${Date.now()}`,
      currentStructure: data.currentStructure,
      options: [
        {
          type: 'LLC',
          pros: ['Liability protection', 'Tax flexibility', 'Simple management'],
          cons: ['Self-employment tax', 'State fees vary'],
          bestFor: 'Small operations, flexibility needed'
        },
        {
          type: 'S-Corporation',
          pros: ['Tax savings on profits', 'Liability protection', 'Credibility'],
          cons: ['More formalities', 'Salary requirements', 'Restrictions on shareholders'],
          bestFor: 'Profitable operations, tax optimization'
        },
        {
          type: 'C-Corporation',
          pros: ['Unlimited growth potential', 'Investor friendly', 'Fringe benefits'],
          cons: ['Double taxation', 'Most formalities'],
          bestFor: 'Growth-focused, seeking investors'
        }
      ],
      recommendation: '',
      factors: this.analyzeEntityFactors(data)
    };
  }

  analyzeEntityFactors(data) {
    return {
      liability: 'High - food service industry',
      ownership: data.owners || 1,
      revenue: data.revenue || 0,
      growth: data.growthPlans || 'unknown',
      employees: data.employees || 0
    };
  }

  async draftOperatingAgreement(data, context = {}) {
    return {
      documentId: `op_agreement_${Date.now()}`,
      type: 'Operating Agreement',
      entityName: data.entityName,
      sections: [
        'Formation and Name',
        'Principal Place of Business',
        'Purpose',
        'Members and Ownership',
        'Capital Contributions',
        'Profits and Losses',
        'Management',
        'Voting Rights',
        'Meetings',
        'Transfer of Interests',
        'Dissolution',
        'Miscellaneous'
      ],
      status: DOCUMENT_STATUS.DRAFT,
      created: new Date().toISOString()
    };
  }
}

/**
 * Agent 36 - Abogado Laboral
 * Derecho laboral y relaciones de empleo
 */
export class EmploymentLawyerAgent extends BaseLegalAgent {
  constructor() {
    super(36, 'Abogado Laboral', 'Derecho laboral y relaciones de empleo');
    this.capabilities = [
      'employment_law',
      'wage_compliance',
      'worker_classification',
      'harassment_prevention',
      'termination_procedures',
      'employee_handbook',
      'labor_disputes',
      'workplace_safety'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'employment_law',
      employmentAssessment: await this.assessEmployment(context),
      complianceStatus: this.evaluateCompliance(context),
      recommendations: this.generateRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async assessEmployment(context) {
    return {
      workforce: {
        fullTime: 0,
        partTime: 0,
        contractors: 0,
        total: 0
      },
      documentation: {
        i9Forms: 'check',
        w4Forms: 'check',
        jobDescriptions: 'check',
        handbook: 'check'
      },
      policies: {
        antiHarassment: 'check',
        overtime: 'check',
        breaks: 'check',
        pto: 'check'
      },
      issues: []
    };
  }

  evaluateCompliance(context) {
    return {
      federal: {
        flsa: 'review', // Wages and hours
        osha: 'review', // Safety
        ada: 'review', // Disabilities
        title7: 'review', // Discrimination
        fmla: 'review' // Family leave
      },
      state: {
        minimumWage: 'check',
        mealBreaks: 'check',
        sickLeave: 'check',
        scheduling: 'check'
      },
      local: {
        permits: 'check',
        specificRequirements: []
      }
    };
  }

  generateRecommendations(context) {
    return [
      {
        area: 'Worker Classification',
        recommendation: 'Audit all contractors to ensure proper classification',
        priority: 'crítica',
        risk: 'Misclassification penalties'
      },
      {
        area: 'Wage Compliance',
        recommendation: 'Review tip pooling and wage calculations',
        priority: 'alta',
        risk: 'Back pay liability'
      },
      {
        area: 'Documentation',
        recommendation: 'Update employee handbook with current policies',
        priority: 'alta'
      },
      {
        area: 'Training',
        recommendation: 'Implement harassment prevention training',
        priority: 'alta'
      }
    ];
  }

  async conductEmploymentAudit(data, context = {}) {
    this.metrics.auditsCompleted++;

    return {
      auditId: `emp_audit_${Date.now()}`,
      clientId: data.clientId,
      date: new Date().toISOString(),
      areas: {
        classification: this.auditClassification(data),
        wages: this.auditWages(data),
        documentation: this.auditDocumentation(data),
        policies: this.auditPolicies(data),
        safety: this.auditSafety(data)
      },
      findings: [],
      recommendations: [],
      riskLevel: 'medium'
    };
  }

  auditClassification(data) {
    return {
      area: 'Worker Classification',
      items: [
        { item: 'Employee vs Contractor analysis', status: 'check' },
        { item: 'Exempt vs Non-exempt classification', status: 'check' },
        { item: 'Documentation of classification', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditWages(data) {
    return {
      area: 'Wage Compliance',
      items: [
        { item: 'Minimum wage compliance', status: 'check' },
        { item: 'Overtime calculations', status: 'check' },
        { item: 'Tip handling and tip credit', status: 'check' },
        { item: 'Pay frequency', status: 'check' },
        { item: 'Pay stub requirements', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditDocumentation(data) {
    return {
      area: 'Employment Documentation',
      items: [
        { item: 'I-9 verification', status: 'check' },
        { item: 'W-4 forms', status: 'check' },
        { item: 'Offer letters', status: 'check' },
        { item: 'Job descriptions', status: 'check' },
        { item: 'Personnel files', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditPolicies(data) {
    return {
      area: 'Employment Policies',
      items: [
        { item: 'Employee handbook', status: 'check' },
        { item: 'Anti-harassment policy', status: 'check' },
        { item: 'Equal opportunity policy', status: 'check' },
        { item: 'Leave policies', status: 'check' },
        { item: 'Discipline procedures', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditSafety(data) {
    return {
      area: 'Workplace Safety',
      items: [
        { item: 'OSHA compliance', status: 'check' },
        { item: 'Safety training', status: 'check' },
        { item: 'Incident reporting', status: 'check' },
        { item: 'Workers comp insurance', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  async createEmployeeHandbook(data, context = {}) {
    return {
      handbookId: `handbook_${Date.now()}`,
      clientId: data.clientId,
      version: '1.0',
      sections: [
        { title: 'Welcome and Company Overview', status: 'draft' },
        { title: 'Employment Relationship', status: 'draft' },
        { title: 'Equal Opportunity', status: 'draft' },
        { title: 'Anti-Harassment', status: 'draft' },
        { title: 'Compensation and Benefits', status: 'draft' },
        { title: 'Work Schedules', status: 'draft' },
        { title: 'Time Off Policies', status: 'draft' },
        { title: 'Conduct and Discipline', status: 'draft' },
        { title: 'Safety and Security', status: 'draft' },
        { title: 'Acknowledgment Form', status: 'draft' }
      ],
      created: new Date().toISOString()
    };
  }
}

/**
 * Agent 37 - Especialista en Contratos
 * Redacción y revisión de contratos
 */
export class ContractSpecialistAgent extends BaseLegalAgent {
  constructor() {
    super(37, 'Especialista en Contratos', 'Redacción, revisión y negociación de contratos');
    this.capabilities = [
      'contract_drafting',
      'contract_review',
      'negotiation_support',
      'lease_agreements',
      'vendor_contracts',
      'franchise_agreements',
      'nda_drafting',
      'contract_management'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'contract_management',
      contractAnalysis: await this.analyzeContracts(context),
      recommendations: this.generateRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async analyzeContracts(context) {
    return {
      inventory: {
        leases: [],
        vendorContracts: [],
        employmentContracts: [],
        serviceAgreements: [],
        other: []
      },
      expiring: [],
      needsReview: [],
      issues: []
    };
  }

  generateRecommendations(context) {
    return [
      {
        contractType: 'Lease',
        recommendation: 'Review assignment and sublease clauses',
        priority: 'alta'
      },
      {
        contractType: 'Vendor',
        recommendation: 'Standardize vendor contract template',
        priority: 'media'
      },
      {
        contractType: 'Employment',
        recommendation: 'Update non-compete and confidentiality clauses',
        priority: 'media'
      }
    ];
  }

  async reviewContract(data, context = {}) {
    this.metrics.documentsReviewed++;

    return {
      reviewId: `contract_review_${Date.now()}`,
      contractType: data.contractType,
      parties: data.parties,
      keyTerms: this.extractKeyTerms(data),
      risks: this.identifyRisks(data),
      recommendations: this.makeRecommendations(data),
      score: 0,
      status: 'reviewed'
    };
  }

  extractKeyTerms(data) {
    return {
      term: { value: '', analysis: '' },
      payment: { value: '', analysis: '' },
      termination: { value: '', analysis: '' },
      renewal: { value: '', analysis: '' },
      liability: { value: '', analysis: '' },
      indemnification: { value: '', analysis: '' },
      insurance: { value: '', analysis: '' },
      dispute: { value: '', analysis: '' }
    };
  }

  identifyRisks(data) {
    return [
      { risk: 'Unfavorable termination clause', severity: 'high', recommendation: '' },
      { risk: 'Excessive liability exposure', severity: 'medium', recommendation: '' },
      { risk: 'Auto-renewal without notice', severity: 'medium', recommendation: '' }
    ];
  }

  makeRecommendations(data) {
    return [
      { section: 'Term', recommendation: '', priority: 'high' },
      { section: 'Payment', recommendation: '', priority: 'medium' },
      { section: 'Termination', recommendation: '', priority: 'high' }
    ];
  }

  async draftContract(data, context = {}) {
    this.metrics.contractsDrafted++;

    return {
      contractId: `contract_${Date.now()}`,
      type: data.type,
      parties: data.parties,
      template: this.selectTemplate(data.type),
      keyTerms: data.terms,
      sections: this.getContractSections(data.type),
      status: DOCUMENT_STATUS.DRAFT,
      created: new Date().toISOString()
    };
  }

  selectTemplate(contractType) {
    const templates = {
      lease: 'Commercial Lease Agreement',
      vendor: 'Vendor Supply Agreement',
      employment: 'Employment Agreement',
      nda: 'Non-Disclosure Agreement',
      service: 'Service Agreement'
    };
    return templates[contractType] || 'General Contract';
  }

  getContractSections(contractType) {
    const sections = {
      lease: [
        'Parties',
        'Premises',
        'Term',
        'Rent and Expenses',
        'Security Deposit',
        'Use of Premises',
        'Maintenance and Repairs',
        'Insurance',
        'Default and Remedies',
        'Termination',
        'Miscellaneous'
      ],
      vendor: [
        'Parties',
        'Products/Services',
        'Pricing',
        'Payment Terms',
        'Delivery',
        'Quality Standards',
        'Warranties',
        'Liability',
        'Term and Termination',
        'Confidentiality'
      ],
      employment: [
        'Position and Duties',
        'Compensation',
        'Benefits',
        'Work Schedule',
        'At-Will Employment',
        'Confidentiality',
        'Non-Compete',
        'Termination',
        'General Provisions'
      ]
    };
    return sections[contractType] || ['Parties', 'Terms', 'Signatures'];
  }

  async reviewLeaseAgreement(data, context = {}) {
    return {
      reviewId: `lease_review_${Date.now()}`,
      property: data.property,
      landlord: data.landlord,
      criticalTerms: {
        baseRent: { value: data.rent, analysis: '' },
        cam: { value: data.cam, analysis: '' },
        term: { value: data.term, analysis: '' },
        options: { value: data.options, analysis: '' },
        exclusivity: { value: data.exclusivity, analysis: '' },
        hvac: { value: data.hvac, analysis: '' },
        signage: { value: data.signage, analysis: '' },
        parking: { value: data.parking, analysis: '' },
        personalGuarantee: { value: data.personalGuarantee, analysis: 'High risk if required' }
      },
      redFlags: [],
      negotiationPoints: [],
      overallAssessment: ''
    };
  }
}

/**
 * Agent 38 - Especialista en Cumplimiento Regulatorio
 * Cumplimiento de normas y regulaciones
 */
export class ComplianceSpecialistAgent extends BaseLegalAgent {
  constructor() {
    super(38, 'Especialista en Cumplimiento', 'Cumplimiento regulatorio y permisos');
    this.capabilities = [
      'regulatory_compliance',
      'license_management',
      'health_regulations',
      'liquor_licensing',
      'fire_safety_compliance',
      'ada_compliance',
      'food_safety_regulations',
      'permit_tracking'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'compliance_management',
      complianceAssessment: await this.assessCompliance(context),
      licenses: this.trackLicenses(context),
      recommendations: this.generateRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async assessCompliance(context) {
    return {
      overall: COMPLIANCE_STATUS.PENDING,
      areas: {
        business: { status: 'check', licenses: [] },
        health: { status: 'check', permits: [], inspectionDue: null },
        liquor: { status: 'check', license: null, renewal: null },
        fire: { status: 'check', inspection: null, extinguishers: null },
        ada: { status: 'check', issues: [] },
        labor: { status: 'check', posters: [], certifications: [] },
        tax: { status: 'check', registrations: [] }
      },
      expiring: [],
      missing: [],
      violations: []
    };
  }

  trackLicenses(context) {
    return {
      required: [
        { type: 'Business License', status: 'check', expiration: null },
        { type: 'Food Service Permit', status: 'check', expiration: null },
        { type: 'Health Department Permit', status: 'check', expiration: null },
        { type: 'Liquor License', status: 'check', expiration: null },
        { type: 'Fire Department Permit', status: 'check', expiration: null },
        { type: 'Sign Permit', status: 'check', expiration: null },
        { type: 'Music/Entertainment License', status: 'check', expiration: null },
        { type: 'Outdoor Seating Permit', status: 'check', expiration: null }
      ],
      calendar: []
    };
  }

  generateRecommendations(context) {
    return [
      {
        area: 'Health Permit',
        recommendation: 'Schedule health inspection and renew permit',
        priority: 'crítica',
        deadline: 'Immediate'
      },
      {
        area: 'Liquor License',
        recommendation: 'Begin renewal process 90 days before expiration',
        priority: 'alta'
      },
      {
        area: 'Fire Safety',
        recommendation: 'Schedule fire extinguisher inspection',
        priority: 'alta'
      },
      {
        area: 'Labor Posters',
        recommendation: 'Update required workplace posters',
        priority: 'media'
      }
    ];
  }

  async conductComplianceAudit(data, context = {}) {
    this.metrics.auditsCompleted++;

    return {
      auditId: `compliance_audit_${Date.now()}`,
      clientId: data.clientId,
      date: new Date().toISOString(),
      categories: {
        licensing: this.auditLicensing(data),
        health: this.auditHealth(data),
        safety: this.auditSafety(data),
        accessibility: this.auditAccessibility(data),
        labor: this.auditLabor(data)
      },
      overallScore: 0,
      criticalIssues: [],
      recommendations: [],
      nextAuditDate: null
    };
  }

  auditLicensing(data) {
    return {
      category: 'Business Licensing',
      items: [
        { item: 'Business license current', status: 'check', expiration: null },
        { item: 'DBA registration (if applicable)', status: 'check' },
        { item: 'State registrations', status: 'check' },
        { item: 'Federal EIN', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditHealth(data) {
    return {
      category: 'Health & Food Safety',
      items: [
        { item: 'Food service permit', status: 'check', expiration: null },
        { item: 'Health inspection grade', status: 'check', grade: null },
        { item: 'Food handler certifications', status: 'check' },
        { item: 'Food safety plan (HACCP)', status: 'check' },
        { item: 'Temperature logs', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditSafety(data) {
    return {
      category: 'Fire & Safety',
      items: [
        { item: 'Fire department permit', status: 'check', expiration: null },
        { item: 'Fire extinguishers certified', status: 'check', expiration: null },
        { item: 'Hood suppression system', status: 'check', expiration: null },
        { item: 'Exit signs and lighting', status: 'check' },
        { item: 'Occupancy posted', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditAccessibility(data) {
    return {
      category: 'ADA Compliance',
      items: [
        { item: 'Accessible entrance', status: 'check' },
        { item: 'Accessible restroom', status: 'check' },
        { item: 'Accessible seating', status: 'check' },
        { item: 'Service animal policy', status: 'check' },
        { item: 'Accessible menu (braille/large print)', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  auditLabor(data) {
    return {
      category: 'Labor Compliance',
      items: [
        { item: 'Required posters displayed', status: 'check' },
        { item: 'Workers comp insurance', status: 'check' },
        { item: 'Unemployment insurance', status: 'check' },
        { item: 'Break room requirements', status: 'check' }
      ],
      score: 0,
      issues: []
    };
  }

  async createComplianceCalendar(data, context = {}) {
    return {
      calendarId: `compliance_calendar_${Date.now()}`,
      clientId: data.clientId,
      items: [
        { item: 'Health inspection', frequency: 'annual', nextDue: null },
        { item: 'Business license renewal', frequency: 'annual', nextDue: null },
        { item: 'Liquor license renewal', frequency: 'annual', nextDue: null },
        { item: 'Fire extinguisher inspection', frequency: 'annual', nextDue: null },
        { item: 'Hood cleaning', frequency: 'quarterly', nextDue: null },
        { item: 'Grease trap service', frequency: 'monthly', nextDue: null },
        { item: 'Food handler certification', frequency: 'varies', nextDue: null }
      ],
      alerts: {
        days90: [],
        days60: [],
        days30: [],
        overdue: []
      }
    };
  }
}

/**
 * Agent 39 - Especialista en Propiedad Intelectual
 * Protección de marcas y propiedad intelectual
 */
export class IPSpecialistAgent extends BaseLegalAgent {
  constructor() {
    super(39, 'Especialista en Propiedad Intelectual', 'Marcas, patentes y protección IP');
    this.capabilities = [
      'trademark_registration',
      'copyright_protection',
      'trade_secrets',
      'brand_protection',
      'ip_strategy',
      'infringement_analysis',
      'licensing',
      'ip_portfolio_management'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'ip_management',
      ipAssessment: await this.assessIP(context),
      protectionStrategy: this.developProtectionStrategy(context),
      recommendations: this.generateRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async assessIP(context) {
    return {
      assets: {
        trademarks: [],
        copyrights: [],
        tradeSecrets: [],
        designs: []
      },
      registered: {
        trademarks: [],
        domains: []
      },
      atRisk: [],
      infringements: []
    };
  }

  developProtectionStrategy(context) {
    return {
      priorities: [
        {
          asset: 'Restaurant Name/Logo',
          protection: 'Federal trademark registration',
          urgency: 'high'
        },
        {
          asset: 'Signature Recipes',
          protection: 'Trade secret protocols',
          urgency: 'medium'
        },
        {
          asset: 'Menu Design',
          protection: 'Copyright registration',
          urgency: 'low'
        },
        {
          asset: 'Domain Names',
          protection: 'Domain registration and monitoring',
          urgency: 'high'
        }
      ],
      monitoring: [
        'Trademark watch service',
        'Domain monitoring',
        'Social media monitoring'
      ]
    };
  }

  generateRecommendations(context) {
    return [
      {
        asset: 'Brand Name',
        recommendation: 'File federal trademark application',
        priority: 'alta',
        cost: '$275-$400 per class'
      },
      {
        asset: 'Logo',
        recommendation: 'Register logo as trademark',
        priority: 'alta',
        cost: '$275-$400 per class'
      },
      {
        asset: 'Recipes',
        recommendation: 'Implement trade secret protections',
        priority: 'media',
        cost: 'Internal process'
      },
      {
        asset: 'Domain',
        recommendation: 'Register key domain variations',
        priority: 'alta',
        cost: '$10-50 per domain'
      }
    ];
  }

  async conductTrademarkSearch(data, context = {}) {
    return {
      searchId: `tm_search_${Date.now()}`,
      mark: data.mark,
      searchDate: new Date().toISOString(),
      results: {
        identicalMatches: [],
        similarMatches: [],
        phoneticMatches: [],
        relatedClasses: []
      },
      riskAssessment: '',
      recommendation: '',
      nextSteps: []
    };
  }

  async prepareTrademarkApplication(data, context = {}) {
    return {
      applicationId: `tm_app_${Date.now()}`,
      mark: data.mark,
      type: data.type, // word, logo, combined
      classes: data.classes, // Nice Classification
      description: data.description,
      specimen: data.specimen,
      basisOfFiling: data.basis, // Use in commerce, intent to use
      applicant: data.applicant,
      status: 'draft',
      estimatedCost: this.calculateTrademarkCost(data),
      timeline: this.estimateTrademarkTimeline()
    };
  }

  calculateTrademarkCost(data) {
    const baseFee = 350; // TEAS Plus
    const classes = data.classes?.length || 1;
    const attorneyFee = 500;
    return {
      governmentFees: baseFee * classes,
      attorneyFees: attorneyFee,
      total: (baseFee * classes) + attorneyFee,
      notes: 'Additional fees may apply for office actions'
    };
  }

  estimateTrademarkTimeline() {
    return {
      filing: '1-2 weeks',
      examination: '3-4 months',
      publication: '30 days',
      registration: '8-12 months total',
      notes: 'Timeline assumes no objections or oppositions'
    };
  }

  async developTradeSecretProtocol(data, context = {}) {
    return {
      protocolId: `trade_secret_${Date.now()}`,
      assets: data.assets || ['recipes', 'processes', 'customer_lists'],
      measures: {
        identification: 'Mark all confidential materials',
        access: 'Limit access to need-to-know basis',
        physical: 'Locked storage, restricted kitchen areas',
        digital: 'Password protection, encryption',
        contractual: 'NDAs for all employees and vendors',
        training: 'Employee awareness training'
      },
      documentation: [
        'Confidential information inventory',
        'Access logs',
        'NDA tracking',
        'Training records'
      ],
      enforcement: [
        'Regular audits',
        'Exit interviews',
        'Device retrieval upon termination'
      ]
    };
  }
}

// ============================================
// Factory y Exports
// ============================================

// Singletons
let cloAgentInstance = null;
let corporateLawyerInstance = null;
let employmentLawyerInstance = null;
let contractSpecialistInstance = null;
let complianceSpecialistInstance = null;
let ipSpecialistInstance = null;

/**
 * Obtiene la instancia del agente legal especificado
 */
export function getLegalAgent(agentId) {
  switch (agentId) {
    case 34:
      if (!cloAgentInstance) {
        cloAgentInstance = new CLOAgent();
      }
      return cloAgentInstance;
    case 35:
      if (!corporateLawyerInstance) {
        corporateLawyerInstance = new CorporateLawyerAgent();
      }
      return corporateLawyerInstance;
    case 36:
      if (!employmentLawyerInstance) {
        employmentLawyerInstance = new EmploymentLawyerAgent();
      }
      return employmentLawyerInstance;
    case 37:
      if (!contractSpecialistInstance) {
        contractSpecialistInstance = new ContractSpecialistAgent();
      }
      return contractSpecialistInstance;
    case 38:
      if (!complianceSpecialistInstance) {
        complianceSpecialistInstance = new ComplianceSpecialistAgent();
      }
      return complianceSpecialistInstance;
    case 39:
      if (!ipSpecialistInstance) {
        ipSpecialistInstance = new IPSpecialistAgent();
      }
      return ipSpecialistInstance;
    default:
      throw new Error(`Agente legal ${agentId} no existe. Agentes válidos: 34-39`);
  }
}

/**
 * Obtiene todos los agentes legales
 */
export function getAllLegalAgents() {
  return {
    34: getLegalAgent(34),
    35: getLegalAgent(35),
    36: getLegalAgent(36),
    37: getLegalAgent(37),
    38: getLegalAgent(38),
    39: getLegalAgent(39)
  };
}

// Registro de agentes legales
export const LEGAL_AGENTS = {
  34: { name: 'CLO', class: CLOAgent },
  35: { name: 'CorporateLawyer', class: CorporateLawyerAgent },
  36: { name: 'EmploymentLawyer', class: EmploymentLawyerAgent },
  37: { name: 'ContractSpecialist', class: ContractSpecialistAgent },
  38: { name: 'ComplianceSpecialist', class: ComplianceSpecialistAgent },
  39: { name: 'IPSpecialist', class: IPSpecialistAgent }
};

export default {
  getLegalAgent,
  getAllLegalAgents,
  LEGAL_AGENTS,
  LEGAL_AREAS,
  CONTRACT_TYPES,
  COMPLIANCE_STATUS,
  DOCUMENT_STATUS
};
