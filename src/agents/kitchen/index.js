/**
 * Kitchen Agents Module - Exportaciones del módulo de agentes culinarios
 */

// Importar clases para factory (deben estar al inicio)
import { ExecChefAgent } from './agents/ExecChefAgent.js';
import { SousChefAgent } from './agents/SousChefAgent.js';
import { PastryChefAgent } from './agents/PastryChefAgent.js';
import { LineCookAgent } from './agents/LineCookAgent.js';
import { PrepCookAgent } from './agents/PrepCookAgent.js';
import { SommelierAgent } from './agents/SommelierAgent.js';
import { BartenderAgent } from './agents/BartenderAgent.js';
import { BaristaAgent } from './agents/BaristaAgent.js';

// Re-exportar agentes
export { ExecChefAgent } from './agents/ExecChefAgent.js';
export { SousChefAgent } from './agents/SousChefAgent.js';
export { PastryChefAgent } from './agents/PastryChefAgent.js';
export { LineCookAgent } from './agents/LineCookAgent.js';
export { PrepCookAgent } from './agents/PrepCookAgent.js';
export { SommelierAgent } from './agents/SommelierAgent.js';
export { BartenderAgent } from './agents/BartenderAgent.js';
export { BaristaAgent } from './agents/BaristaAgent.js';

// Factory
export { KitchenAgentFactory } from './core/KitchenAgentFactory.js';

// Helpers
export * from './utils/kitchenHelpers.js';

// Registro de agentes culinarios
export const KITCHEN_AGENTS = {
  26: { name: 'Chef Ejecutivo', shortName: 'EXEC_CHEF', class: 'ExecChefAgent' },
  27: { name: 'Sous Chef', shortName: 'SOUS_CHEF', class: 'SousChefAgent' },
  28: { name: 'Chef Pastelero', shortName: 'PASTRY_CHEF', class: 'PastryChefAgent' },
  29: { name: 'Chef de Partida', shortName: 'LINE_COOK', class: 'LineCookAgent' },
  30: { name: 'Prep Cook / Steward', shortName: 'PREP_COOK', class: 'PrepCookAgent' },
  31: { name: 'Sommelier', shortName: 'SOMMELIER', class: 'SommelierAgent' },
  32: { name: 'Bartender / Mixólogo', shortName: 'BARTENDER', class: 'BartenderAgent' },
  33: { name: 'Barista', shortName: 'BARISTA', class: 'BaristaAgent' }
};

// Categorías de agentes
export const KITCHEN_CATEGORIES = {
  LEADERSHIP: [26, 27],
  PRODUCTION: [28, 29, 30],
  BEVERAGE: [31, 32, 33]
};

// Mapa de clases
const agentClasses = {
  26: ExecChefAgent,
  27: SousChefAgent,
  28: PastryChefAgent,
  29: LineCookAgent,
  30: PrepCookAgent,
  31: SommelierAgent,
  32: BartenderAgent,
  33: BaristaAgent
};

// Singleton instances
let instances = {};

// Factory function compatible con índice central
export function getKitchenAgent(agentId) {
  const agentInfo = KITCHEN_AGENTS[agentId];
  if (!agentInfo) throw new Error(`Agente kitchen ${agentId} no existe. Válidos: 26-33`);
  if (!instances[agentId]) {
    const AgentClass = agentClasses[agentId];
    instances[agentId] = new AgentClass();
  }
  return instances[agentId];
}

export function getAllKitchenAgents() {
  return {
    26: getKitchenAgent(26),
    27: getKitchenAgent(27),
    28: getKitchenAgent(28),
    29: getKitchenAgent(29),
    30: getKitchenAgent(30),
    31: getKitchenAgent(31),
    32: getKitchenAgent(32),
    33: getKitchenAgent(33)
  };
}

// Alias para compatibilidad
export const createKitchenAgentById = getKitchenAgent;

export default {
  KITCHEN_AGENTS,
  KITCHEN_CATEGORIES,
  getKitchenAgent,
  getAllKitchenAgents,
  createKitchenAgentById
};
