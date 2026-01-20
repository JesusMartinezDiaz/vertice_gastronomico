/**
 * Consultancy Module - Sistema de Gestión de Consultoría
 *
 * CONTEXTO FUNDAMENTAL:
 * Vértice Gastronómico es una CONSULTORÍA GASTRONÓMICA que atiende
 * múltiples restaurantes como clientes. NO somos un restaurante.
 *
 * Este módulo proporciona:
 * - Gestión de múltiples clientes (restaurantes)
 * - Gestión de proyectos de consultoría
 * - Aislamiento de datos por cliente
 * - Contexto de trabajo por consultor
 * - Reportes multi-cliente
 */

// Gestión de Clientes
export {
  ClientManager,
  Client,
  ClientContext,
  Consultant,
  getClientManager,
  CLIENT_STATUS,
  SERVICE_TYPES,
  SUBSCRIPTION_TIERS
} from './ClientManager.js';

// Gestión de Proyectos
export {
  ProjectManager,
  Project,
  Milestone,
  ProjectTask,
  Deliverable,
  getProjectManager,
  PROJECT_STATUS,
  PROJECT_TYPES,
  TASK_PRIORITY
} from './ProjectManager.js';

// Re-exportar singletons como default
export default {
  getClientManager,
  getProjectManager
};

/**
 * Inicializar el sistema de consultoría
 *
 * @param {Object} config - Configuración de la consultoría
 * @returns {Object} - Instancias de los gestores
 */
export function initConsultancySystem(config = {}) {
  const clientManager = getClientManager(config.consultancy || {});
  const projectManager = getProjectManager();

  // Configurar eventos entre sistemas
  clientManager.on('client:registered', (data) => {
    console.log(`[Consultancy] Nuevo cliente registrado: ${data.client.name}`);
  });

  projectManager.on('project:created', (data) => {
    console.log(`[Consultancy] Nuevo proyecto creado: ${data.project.code}`);
  });

  return {
    clientManager,
    projectManager,

    // Métodos de conveniencia
    createClientProject: (clientId, projectType, customizations = {}) => {
      const client = clientManager.getClient(clientId);
      if (!client) {
        throw new Error(`Cliente no encontrado: ${clientId}`);
      }
      return projectManager.createFromTemplate(
        projectType,
        client.id,
        client.name,
        customizations
      );
    },

    getClientWithProjects: (clientId) => {
      const client = clientManager.getClient(clientId);
      if (!client) return null;

      const projects = projectManager.listProjects({ clientId });
      return {
        ...client.toJSON(),
        projects
      };
    },

    getDashboard: () => {
      return {
        clients: clientManager.generateClientsSummary(),
        projects: projectManager.getProjectsOverview(),
        consultancy: clientManager.getConsultancyInfo()
      };
    }
  };
}

/**
 * Constantes de configuración de la consultoría
 */
export const CONSULTANCY_CONFIG = {
  // Información de la empresa
  COMPANY_NAME: 'Vértice Gastronómico',
  COMPANY_TYPE: 'consultancy', // NO restaurant

  // Servicios ofrecidos
  SERVICES: [
    'Diagnóstico Integral',
    'Reestructuración Financiera',
    'Optimización Operativa',
    'Ingeniería de Menú',
    'Apertura de Restaurantes',
    'Capacitación',
    'Cumplimiento Legal'
  ],

  // Agentes disponibles
  TOTAL_AGENTS: 72,
  AGENT_CATEGORIES: {
    FINANCIAL: { start: 1, end: 6, count: 6 },
    STRATEGIC: { start: 7, end: 12, count: 6 },
    MARKETING: { start: 13, end: 17, count: 5 },
    OPERATIONS: { start: 18, end: 25, count: 8 },
    KITCHEN: { start: 26, end: 33, count: 8 },
    LEGAL: { start: 34, end: 39, count: 6 },
    HR: { start: 40, end: 45, count: 6 },
    TECH: { start: 46, end: 51, count: 6 },
    QUALITY: { start: 52, end: 57, count: 6 },
    SUSTAINABILITY: { start: 58, end: 63, count: 6 },
    INNOVATION: { start: 64, end: 69, count: 6 },
    SPECIAL: { start: 70, end: 72, count: 3 }
  },

  // Límites por plan
  PLAN_LIMITS: {
    BASIC: {
      maxClients: 5,
      maxActiveProjects: 3,
      maxAgents: 10
    },
    PROFESSIONAL: {
      maxClients: 20,
      maxActiveProjects: 10,
      maxAgents: 30
    },
    ENTERPRISE: {
      maxClients: Infinity,
      maxActiveProjects: Infinity,
      maxAgents: 72
    }
  }
};
