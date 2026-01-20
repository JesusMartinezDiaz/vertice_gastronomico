/**
 * Índice Central de Agentes - Vértice Gastronómico
 *
 * Este archivo exporta todos los 72 agentes del sistema organizados por categoría.
 * CONTEXTO: Vértice Gastronómico es una CONSULTORÍA que asesora restaurantes.
 *
 * Estructura de Agentes:
 * - 1: CEO (Director General IA) - Orquestador principal
 * - 2-7: Financieros
 * - 8-12: Estratégicos
 * - 13-17: Marketing
 * - 18-25: Operaciones
 * - 26-33: Kitchen (Cocina)
 * - 34-39: Legal
 * - 40-45: RRHH
 * - 46-51: Tecnología
 * - 52-57: Calidad
 * - 58-63: Sostenibilidad
 * - 64-70: Innovación
 * - 71: Project Manager
 * - 72: Abogado Familiar (Privado - Solo CEO)
 */

// Financial Agents (2-7)
import financialAgents, {
  getFinancialAgent,
  getAllFinancialAgents,
  FINANCIAL_AGENTS,
  CFOAgent,
  ControllerAgent,
  FoodCostAnalystAgent,
  ProfitAnalystAgent,
  TreasurerAgent,
  AccountantAgent
} from './financial/index.js';

// Strategic Agents (8-12)
import strategicAgents, {
  getStrategicAgent,
  getAllStrategicAgents,
  STRATEGIC_AGENTS
} from './strategic/index.js';

// Marketing Agents (13-17)
import marketingAgents, {
  getMarketingAgent,
  getAllMarketingAgents,
  MARKETING_AGENTS
} from './marketing/index.js';

// Operations Agents (18-25)
import operationsAgents, {
  getOperationsAgent,
  getAllOperationsAgents,
  OPERATIONS_AGENTS
} from './operations/index.js';

// Kitchen Agents (26-33)
import kitchenAgents, {
  getKitchenAgent,
  getAllKitchenAgents,
  KITCHEN_AGENTS
} from './kitchen/index.js';

// Legal Agents (34-39)
import legalAgents, {
  getLegalAgent,
  getAllLegalAgents,
  LEGAL_AGENTS
} from './legal/index.js';

// HR Agents (40-45)
import hrAgents, {
  getHRAgent,
  getAllHRAgents,
  HR_AGENTS
} from './hr/index.js';

// Tech Agents (46-51)
import techAgents, {
  getTechAgent,
  getAllTechAgents,
  TECH_AGENTS
} from './tech/index.js';

// Quality Agents (52-57)
import qualityAgents, {
  getQualityAgent,
  getAllQualityAgents,
  QUALITY_AGENTS
} from './quality/index.js';

// Sustainability Agents (58-63)
import sustainabilityAgents, {
  getSustainabilityAgent,
  getAllSustainabilityAgents,
  SUSTAINABILITY_AGENTS
} from './sustainability/index.js';

// Innovation Agents (64-70)
import innovationAgents, {
  getInnovationAgent,
  getAllInnovationAgents,
  INNOVATION_AGENTS
} from './innovation/index.js';

// Special Agents (71-72)
import { ProjectManagerAgent, getProjectManagerAgent } from './agent71-project-manager/index.js';
import { FamilyLawyerAgent, getFamilyLawyerAgent } from './agent72-family-lawyer/index.js';

/**
 * Mapa completo de categorías por ID de agente
 */
const AGENT_CATEGORIES = {
  1: 'ceo',
  2: 'financial', 3: 'financial', 4: 'financial', 5: 'financial', 6: 'financial', 7: 'financial',
  8: 'strategic', 9: 'strategic', 10: 'strategic', 11: 'strategic', 12: 'strategic',
  13: 'marketing', 14: 'marketing', 15: 'marketing', 16: 'marketing', 17: 'marketing',
  18: 'operations', 19: 'operations', 20: 'operations', 21: 'operations',
  22: 'operations', 23: 'operations', 24: 'operations', 25: 'operations',
  26: 'kitchen', 27: 'kitchen', 28: 'kitchen', 29: 'kitchen',
  30: 'kitchen', 31: 'kitchen', 32: 'kitchen', 33: 'kitchen',
  34: 'legal', 35: 'legal', 36: 'legal', 37: 'legal', 38: 'legal', 39: 'legal',
  40: 'hr', 41: 'hr', 42: 'hr', 43: 'hr', 44: 'hr', 45: 'hr',
  46: 'tech', 47: 'tech', 48: 'tech', 49: 'tech', 50: 'tech', 51: 'tech',
  52: 'quality', 53: 'quality', 54: 'quality', 55: 'quality', 56: 'quality', 57: 'quality',
  58: 'sustainability', 59: 'sustainability', 60: 'sustainability',
  61: 'sustainability', 62: 'sustainability', 63: 'sustainability',
  64: 'innovation', 65: 'innovation', 66: 'innovation', 67: 'innovation',
  68: 'innovation', 69: 'innovation', 70: 'innovation',
  71: 'special', 72: 'special'
};

/**
 * Obtiene un agente por su ID
 * @param {number} agentId - ID del agente (1-72)
 * @returns {Object} Instancia del agente
 */
export function getAgent(agentId) {
  const category = AGENT_CATEGORIES[agentId];

  if (!category) {
    throw new Error(`Agente ${agentId} no existe. IDs válidos: 1-72`);
  }

  switch (category) {
    case 'ceo':
      throw new Error('Agente 1 (CEO) se maneja por separado como orquestador');
    case 'financial':
      return getFinancialAgent(agentId);
    case 'strategic':
      return getStrategicAgent(agentId);
    case 'marketing':
      return getMarketingAgent(agentId);
    case 'operations':
      return getOperationsAgent(agentId);
    case 'kitchen':
      return getKitchenAgent(agentId);
    case 'legal':
      return getLegalAgent(agentId);
    case 'hr':
      return getHRAgent(agentId);
    case 'tech':
      return getTechAgent(agentId);
    case 'quality':
      return getQualityAgent(agentId);
    case 'sustainability':
      return getSustainabilityAgent(agentId);
    case 'innovation':
      return getInnovationAgent(agentId);
    case 'special':
      if (agentId === 71) return getProjectManagerAgent();
      if (agentId === 72) return getFamilyLawyerAgent();
      break;
  }

  throw new Error(`Agente ${agentId} no encontrado`);
}

/**
 * Obtiene todos los agentes de una categoría
 * @param {string} category - Categoría del agente
 * @returns {Object} Mapa de agentes de esa categoría
 */
export function getAgentsByCategory(category) {
  switch (category) {
    case 'financial':
      return getAllFinancialAgents();
    case 'strategic':
      return getAllStrategicAgents();
    case 'marketing':
      return getAllMarketingAgents();
    case 'operations':
      return getAllOperationsAgents();
    case 'kitchen':
      return getAllKitchenAgents();
    case 'legal':
      return getAllLegalAgents();
    case 'hr':
      return getAllHRAgents();
    case 'tech':
      return getAllTechAgents();
    case 'quality':
      return getAllQualityAgents();
    case 'sustainability':
      return getAllSustainabilityAgents();
    case 'innovation':
      return getAllInnovationAgents();
    case 'special':
      return {
        71: getProjectManagerAgent(),
        72: getFamilyLawyerAgent()
      };
    default:
      throw new Error(`Categoría ${category} no existe`);
  }
}

/**
 * Obtiene información de todos los agentes registrados
 */
export function getAllAgentsInfo() {
  return {
    financial: FINANCIAL_AGENTS,
    strategic: STRATEGIC_AGENTS,
    marketing: MARKETING_AGENTS,
    operations: OPERATIONS_AGENTS,
    kitchen: KITCHEN_AGENTS,
    legal: LEGAL_AGENTS,
    hr: HR_AGENTS,
    tech: TECH_AGENTS,
    quality: QUALITY_AGENTS,
    sustainability: SUSTAINABILITY_AGENTS,
    innovation: INNOVATION_AGENTS,
    special: {
      71: { name: 'ProjectManager', category: 'special' },
      72: { name: 'FamilyLawyer', category: 'special', private: true, accessibleBy: [1] }
    }
  };
}

/**
 * Verifica si un agente es privado
 * @param {number} agentId - ID del agente
 * @returns {boolean}
 */
export function isPrivateAgent(agentId) {
  return agentId === 72;
}

/**
 * Obtiene la categoría de un agente
 * @param {number} agentId - ID del agente
 * @returns {string} Nombre de la categoría
 */
export function getAgentCategory(agentId) {
  return AGENT_CATEGORIES[agentId] || null;
}

// Re-exportar todo para facilitar imports individuales
export {
  // Financial
  getFinancialAgent,
  getAllFinancialAgents,
  FINANCIAL_AGENTS,
  CFOAgent,
  ControllerAgent,
  FoodCostAnalystAgent,
  ProfitAnalystAgent,
  TreasurerAgent,
  AccountantAgent,

  // Strategic
  getStrategicAgent,
  getAllStrategicAgents,
  STRATEGIC_AGENTS,

  // Marketing
  getMarketingAgent,
  getAllMarketingAgents,
  MARKETING_AGENTS,

  // Operations
  getOperationsAgent,
  getAllOperationsAgents,
  OPERATIONS_AGENTS,

  // Kitchen
  getKitchenAgent,
  getAllKitchenAgents,
  KITCHEN_AGENTS,

  // Legal
  getLegalAgent,
  getAllLegalAgents,
  LEGAL_AGENTS,

  // HR
  getHRAgent,
  getAllHRAgents,
  HR_AGENTS,

  // Tech
  getTechAgent,
  getAllTechAgents,
  TECH_AGENTS,

  // Quality
  getQualityAgent,
  getAllQualityAgents,
  QUALITY_AGENTS,

  // Sustainability
  getSustainabilityAgent,
  getAllSustainabilityAgents,
  SUSTAINABILITY_AGENTS,

  // Innovation
  getInnovationAgent,
  getAllInnovationAgents,
  INNOVATION_AGENTS,

  // Special
  ProjectManagerAgent,
  getProjectManagerAgent,
  FamilyLawyerAgent,
  getFamilyLawyerAgent,

  // Categories map
  AGENT_CATEGORIES
};

export default {
  getAgent,
  getAgentsByCategory,
  getAllAgentsInfo,
  isPrivateAgent,
  getAgentCategory,
  AGENT_CATEGORIES
};
