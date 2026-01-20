/**
 * ClientManager - Sistema de Gestión de Clientes para Consultoría
 *
 * IMPORTANTE: Vértice Gastronómico es una CONSULTORÍA que atiende
 * múltiples restaurantes clientes, NO un restaurante individual.
 *
 * Este módulo gestiona:
 * - Múltiples clientes (restaurantes)
 * - Aislamiento de datos por cliente
 * - Contexto de trabajo por consultor
 * - Reportes multi-cliente
 */

// Estados de cliente
export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ONBOARDING: 'onboarding',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived'
};

// Tipos de servicio de consultoría
export const SERVICE_TYPES = {
  FULL_SERVICE: 'full_service',           // Todos los servicios
  FINANCIAL_ONLY: 'financial_only',       // Solo finanzas
  OPERATIONS_ONLY: 'operations_only',     // Solo operaciones
  KITCHEN_CONSULTING: 'kitchen_consulting', // Solo cocina
  STARTUP: 'startup',                     // Apertura de restaurante
  TURNAROUND: 'turnaround',              // Reestructuración
  MENU_ENGINEERING: 'menu_engineering',   // Ingeniería de menú
  TRAINING: 'training'                    // Capacitación
};

// Niveles de suscripción
export const SUBSCRIPTION_TIERS = {
  BASIC: {
    name: 'Básico',
    maxAgents: 10,
    maxReportsPerMonth: 20,
    features: ['financial_basic', 'operations_basic']
  },
  PROFESSIONAL: {
    name: 'Profesional',
    maxAgents: 30,
    maxReportsPerMonth: 100,
    features: ['financial_full', 'operations_full', 'kitchen_basic']
  },
  ENTERPRISE: {
    name: 'Empresarial',
    maxAgents: 72, // Todos los agentes
    maxReportsPerMonth: Infinity,
    features: ['all']
  }
};

/**
 * Clase Cliente - Representa un restaurante cliente
 */
export class Client {
  constructor(config = {}) {
    // Identificación
    this.id = config.id || this.generateClientId();
    this.code = config.code || ''; // Código corto (ej: "REST001")
    this.name = config.name || '';
    this.legalName = config.legalName || '';
    this.taxId = config.taxId || '';

    // Contacto
    this.contact = {
      primary: config.primaryContact || {},
      billing: config.billingContact || {},
      operations: config.operationsContact || {}
    };

    // Ubicación
    this.locations = config.locations || [];

    // Configuración del negocio
    this.businessType = config.businessType || 'restaurant'; // restaurant, bar, cafe, hotel, catering
    this.cuisine = config.cuisine || [];
    this.seats = config.seats || 0;
    this.employees = config.employees || 0;
    this.avgTicket = config.avgTicket || 0;
    this.monthlyRevenue = config.monthlyRevenue || 0;

    // Servicio de consultoría
    this.serviceType = config.serviceType || SERVICE_TYPES.FULL_SERVICE;
    this.subscriptionTier = config.subscriptionTier || 'PROFESSIONAL';
    this.status = config.status || CLIENT_STATUS.ONBOARDING;

    // Fechas
    this.createdAt = config.createdAt || new Date();
    this.contractStartDate = config.contractStartDate || null;
    this.contractEndDate = config.contractEndDate || null;
    this.lastActivityAt = null;

    // Consultores asignados
    this.assignedConsultants = config.assignedConsultants || [];

    // Configuración específica
    this.settings = {
      currency: config.currency || 'MXN',
      language: config.language || 'es',
      timezone: config.timezone || 'America/Mexico_City',
      fiscalYearStart: config.fiscalYearStart || 1, // Mes (1 = enero)
      reportingDay: config.reportingDay || 1, // Día del mes para reportes
      ...config.settings
    };

    // Branding del cliente (para reportes)
    this.branding = {
      logo: config.logo || null,
      primaryColor: config.primaryColor || '#1a365d',
      secondaryColor: config.secondaryColor || '#2d3748',
      ...config.branding
    };

    // Métricas y estadísticas
    this.metrics = {
      totalReports: 0,
      lastReportDate: null,
      healthScore: null,
      ...config.metrics
    };
  }

  generateClientId() {
    return `CLI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getSubscriptionFeatures() {
    return SUBSCRIPTION_TIERS[this.subscriptionTier]?.features || [];
  }

  canUseAgent(agentId) {
    const tier = SUBSCRIPTION_TIERS[this.subscriptionTier];
    if (!tier) return false;
    if (tier.features.includes('all')) return true;
    // Aquí se verificaría si el agente está incluido en las features
    return true; // Simplificado por ahora
  }

  isActive() {
    return this.status === CLIENT_STATUS.ACTIVE;
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      legalName: this.legalName,
      status: this.status,
      serviceType: this.serviceType,
      subscriptionTier: this.subscriptionTier,
      settings: this.settings,
      metrics: this.metrics
    };
  }
}

/**
 * ClientContext - Contexto de trabajo para un cliente específico
 *
 * Cuando un agente trabaja, siempre lo hace en el contexto de un cliente.
 * Esto asegura aislamiento de datos y configuración correcta.
 */
export class ClientContext {
  constructor(client, consultant = null) {
    if (!client) {
      throw new Error('ClientContext requiere un cliente válido');
    }

    this.client = client;
    this.consultant = consultant;
    this.createdAt = new Date();
    this.sessionId = this.generateSessionId();

    // Cache de configuración
    this._configCache = new Map();
  }

  generateSessionId() {
    return `CTX-${this.client.id}-${Date.now()}`;
  }

  // Obtener configuración del cliente
  getConfig(key, defaultValue = null) {
    if (this._configCache.has(key)) {
      return this._configCache.get(key);
    }

    const value = this.client.settings[key] ?? defaultValue;
    this._configCache.set(key, value);
    return value;
  }

  // Obtener información para documentos
  getDocumentHeader() {
    return {
      clientName: this.client.name,
      clientCode: this.client.code,
      logo: this.client.branding?.logo,
      primaryColor: this.client.branding?.primaryColor,
      preparedBy: this.consultant?.name || 'Vértice Gastronómico',
      date: new Date().toLocaleDateString(this.getConfig('language', 'es'))
    };
  }

  // Obtener información para pie de página
  getDocumentFooter() {
    return {
      consultant: 'Vértice Gastronómico - Consultoría Gastronómica',
      confidential: `Confidencial - Preparado exclusivamente para ${this.client.name}`,
      contact: 'www.verticegastronomico.com'
    };
  }

  // Verificar permisos
  hasPermission(action) {
    // Verificar si el cliente está activo
    if (!this.client.isActive() && action !== 'view') {
      return false;
    }

    // Verificar si el consultor tiene permiso
    if (this.consultant && !this.consultant.hasClientAccess(this.client.id)) {
      return false;
    }

    return true;
  }

  // Log de actividad
  logActivity(action, details = {}) {
    return {
      timestamp: new Date(),
      sessionId: this.sessionId,
      clientId: this.client.id,
      clientName: this.client.name,
      consultantId: this.consultant?.id,
      action,
      details
    };
  }
}

/**
 * Consultant - Representa un consultor de Vértice Gastronómico
 */
export class Consultant {
  constructor(config = {}) {
    this.id = config.id || this.generateConsultantId();
    this.name = config.name || '';
    this.email = config.email || '';
    this.role = config.role || 'consultant'; // admin, senior_consultant, consultant, junior
    this.specialties = config.specialties || []; // financial, operations, kitchen, legal
    this.assignedClients = config.assignedClients || [];
    this.active = config.active ?? true;
    this.createdAt = config.createdAt || new Date();
  }

  generateConsultantId() {
    return `CON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  hasClientAccess(clientId) {
    if (this.role === 'admin') return true;
    return this.assignedClients.includes(clientId);
  }

  canManageClient(clientId) {
    if (this.role === 'admin' || this.role === 'senior_consultant') {
      return this.hasClientAccess(clientId);
    }
    return false;
  }
}

/**
 * ClientManager - Gestor principal de clientes
 */
export class ClientManager {
  constructor(config = {}) {
    this.clients = new Map();
    this.consultants = new Map();
    this.activeContexts = new Map();

    // Configuración de la consultoría
    this.consultancyInfo = {
      name: 'Vértice Gastronómico',
      legalName: config.legalName || 'Vértice Gastronómico S.A. de C.V.',
      taxId: config.taxId || '',
      address: config.address || '',
      phone: config.phone || '',
      email: config.email || 'contacto@verticegastronomico.com',
      website: config.website || 'www.verticegastronomico.com',
      logo: config.logo || null
    };

    // Listeners para eventos
    this.listeners = new Map();
  }

  // ============ GESTIÓN DE CLIENTES ============

  /**
   * Registrar nuevo cliente
   */
  registerClient(clientData) {
    const client = new Client(clientData);
    this.clients.set(client.id, client);

    this.emit('client:registered', { client: client.toJSON() });

    return client;
  }

  /**
   * Obtener cliente por ID
   */
  getClient(clientId) {
    return this.clients.get(clientId);
  }

  /**
   * Obtener cliente por código
   */
  getClientByCode(code) {
    for (const client of this.clients.values()) {
      if (client.code === code) {
        return client;
      }
    }
    return null;
  }

  /**
   * Listar todos los clientes
   */
  listClients(filters = {}) {
    let clients = Array.from(this.clients.values());

    if (filters.status) {
      clients = clients.filter(c => c.status === filters.status);
    }

    if (filters.serviceType) {
      clients = clients.filter(c => c.serviceType === filters.serviceType);
    }

    if (filters.consultantId) {
      clients = clients.filter(c =>
        c.assignedConsultants.includes(filters.consultantId)
      );
    }

    return clients.map(c => c.toJSON());
  }

  /**
   * Actualizar cliente
   */
  updateClient(clientId, updates) {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new Error(`Cliente no encontrado: ${clientId}`);
    }

    // Actualizar propiedades
    Object.assign(client, updates);
    client.lastActivityAt = new Date();

    this.emit('client:updated', { clientId, updates });

    return client;
  }

  /**
   * Cambiar estado del cliente
   */
  setClientStatus(clientId, status) {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new Error(`Cliente no encontrado: ${clientId}`);
    }

    const previousStatus = client.status;
    client.status = status;

    this.emit('client:status_changed', {
      clientId,
      previousStatus,
      newStatus: status
    });

    return client;
  }

  // ============ CONTEXTOS DE TRABAJO ============

  /**
   * Crear contexto de trabajo para un cliente
   */
  createContext(clientId, consultantId = null) {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new Error(`Cliente no encontrado: ${clientId}`);
    }

    const consultant = consultantId ? this.consultants.get(consultantId) : null;

    const context = new ClientContext(client, consultant);
    this.activeContexts.set(context.sessionId, context);

    // Actualizar última actividad
    client.lastActivityAt = new Date();

    this.emit('context:created', {
      sessionId: context.sessionId,
      clientId,
      consultantId
    });

    return context;
  }

  /**
   * Obtener contexto activo
   */
  getContext(sessionId) {
    return this.activeContexts.get(sessionId);
  }

  /**
   * Cerrar contexto
   */
  closeContext(sessionId) {
    const context = this.activeContexts.get(sessionId);
    if (context) {
      this.activeContexts.delete(sessionId);
      this.emit('context:closed', { sessionId });
    }
  }

  // ============ GESTIÓN DE CONSULTORES ============

  /**
   * Registrar consultor
   */
  registerConsultant(consultantData) {
    const consultant = new Consultant(consultantData);
    this.consultants.set(consultant.id, consultant);
    return consultant;
  }

  /**
   * Asignar cliente a consultor
   */
  assignClientToConsultant(clientId, consultantId) {
    const client = this.clients.get(clientId);
    const consultant = this.consultants.get(consultantId);

    if (!client || !consultant) {
      throw new Error('Cliente o consultor no encontrado');
    }

    if (!client.assignedConsultants.includes(consultantId)) {
      client.assignedConsultants.push(consultantId);
    }

    if (!consultant.assignedClients.includes(clientId)) {
      consultant.assignedClients.push(clientId);
    }

    this.emit('consultant:assigned', { clientId, consultantId });
  }

  // ============ REPORTES MULTI-CLIENTE ============

  /**
   * Generar resumen de todos los clientes
   */
  generateClientsSummary() {
    const clients = Array.from(this.clients.values());

    const summary = {
      generatedAt: new Date(),
      generatedBy: this.consultancyInfo.name,
      totalClients: clients.length,
      byStatus: {},
      byServiceType: {},
      bySubscription: {},
      activeClients: 0,
      totalSeats: 0,
      totalMonthlyRevenue: 0
    };

    // Agrupar por estado
    Object.values(CLIENT_STATUS).forEach(status => {
      summary.byStatus[status] = clients.filter(c => c.status === status).length;
    });

    // Agrupar por tipo de servicio
    Object.values(SERVICE_TYPES).forEach(type => {
      summary.byServiceType[type] = clients.filter(c => c.serviceType === type).length;
    });

    // Agrupar por suscripción
    Object.keys(SUBSCRIPTION_TIERS).forEach(tier => {
      summary.bySubscription[tier] = clients.filter(c => c.subscriptionTier === tier).length;
    });

    // Totales
    clients.forEach(client => {
      if (client.status === CLIENT_STATUS.ACTIVE) {
        summary.activeClients++;
        summary.totalSeats += client.seats || 0;
        summary.totalMonthlyRevenue += client.monthlyRevenue || 0;
      }
    });

    return summary;
  }

  /**
   * Generar reporte de salud de clientes
   */
  generateHealthReport() {
    const clients = Array.from(this.clients.values())
      .filter(c => c.status === CLIENT_STATUS.ACTIVE);

    return clients.map(client => ({
      id: client.id,
      code: client.code,
      name: client.name,
      healthScore: client.metrics.healthScore,
      lastReportDate: client.metrics.lastReportDate,
      lastActivityAt: client.lastActivityAt,
      daysInactive: this.calculateDaysInactive(client.lastActivityAt),
      status: this.determineHealthStatus(client)
    }));
  }

  calculateDaysInactive(lastActivity) {
    if (!lastActivity) return Infinity;
    const now = new Date();
    const diff = now - new Date(lastActivity);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  determineHealthStatus(client) {
    const daysInactive = this.calculateDaysInactive(client.lastActivityAt);

    if (daysInactive > 30) return 'critical';
    if (daysInactive > 14) return 'warning';
    if (daysInactive > 7) return 'attention';
    return 'healthy';
  }

  // ============ EVENTOS ============

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (error) {
        console.error(`Error en listener de ${event}:`, error);
      }
    });
  }

  // ============ INFORMACIÓN DE LA CONSULTORÍA ============

  getConsultancyInfo() {
    return { ...this.consultancyInfo };
  }

  getReportBranding() {
    return {
      consultancy: this.consultancyInfo.name,
      logo: this.consultancyInfo.logo,
      website: this.consultancyInfo.website,
      confidentialNotice: 'Este documento es confidencial y propiedad de Vértice Gastronómico',
      copyright: `© ${new Date().getFullYear()} ${this.consultancyInfo.name}. Todos los derechos reservados.`
    };
  }
}

// Singleton del gestor de clientes
let clientManagerInstance = null;

export function getClientManager(config = {}) {
  if (!clientManagerInstance) {
    clientManagerInstance = new ClientManager(config);
  }
  return clientManagerInstance;
}

export default ClientManager;
