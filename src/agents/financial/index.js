/**
 * Financial Agents Module - Módulo de Agentes Financieros
 * Exporta todos los agentes del área financiera con capacidades universales
 *
 * Agentes incluidos:
 * - CFO (Director Financiero) - ID: 2
 * - Controller (Controller Financiero) - ID: 3
 * - FoodCostAnalyst (Analista de Costos de Alimentos) - ID: 4
 * - ProfitAnalyst (Analista de Rentabilidad) - ID: 5
 * - Treasurer (Tesorero) - ID: 6
 * - Accountant (Contador General) - ID: 7
 */

export { CFOAgent } from './agents/CFOAgent.js';
export { ControllerAgent } from './agents/ControllerAgent.js';
export { FoodCostAnalystAgent } from './agents/FoodCostAnalystAgent.js';
export { ProfitAnalystAgent } from './agents/ProfitAnalystAgent.js';
export { TreasurerAgent } from './agents/TreasurerAgent.js';
export { AccountantAgent } from './agents/AccountantAgent.js';

// Utilidades financieras
export * from './utils/financialHelpers.js';

// Factory para crear agentes financieros
export { FinancialAgentFactory } from './core/FinancialAgentFactory.js';

// Registro de agentes financieros
export const FINANCIAL_AGENTS = {
  2: { name: 'CFO', class: 'CFOAgent' },
  3: { name: 'Controller', class: 'ControllerAgent' },
  4: { name: 'FoodCostAnalyst', class: 'FoodCostAnalystAgent' },
  5: { name: 'ProfitAnalyst', class: 'ProfitAnalystAgent' },
  6: { name: 'Treasurer', class: 'TreasurerAgent' },
  7: { name: 'Accountant', class: 'AccountantAgent' }
};

// Importar clases para factory
import { CFOAgent } from './agents/CFOAgent.js';
import { ControllerAgent } from './agents/ControllerAgent.js';
import { FoodCostAnalystAgent } from './agents/FoodCostAnalystAgent.js';
import { ProfitAnalystAgent } from './agents/ProfitAnalystAgent.js';
import { TreasurerAgent } from './agents/TreasurerAgent.js';
import { AccountantAgent } from './agents/AccountantAgent.js';

const agentClasses = {
  2: CFOAgent,
  3: ControllerAgent,
  4: FoodCostAnalystAgent,
  5: ProfitAnalystAgent,
  6: TreasurerAgent,
  7: AccountantAgent
};

// Factory functions
let instances = {};

export function getFinancialAgent(agentId) {
  const agentInfo = FINANCIAL_AGENTS[agentId];
  if (!agentInfo) throw new Error(`Agente financiero ${agentId} no existe. Válidos: 2-7`);
  if (!instances[agentId]) {
    const AgentClass = agentClasses[agentId];
    instances[agentId] = new AgentClass();
  }
  return instances[agentId];
}

export function getAllFinancialAgents() {
  return {
    2: getFinancialAgent(2),
    3: getFinancialAgent(3),
    4: getFinancialAgent(4),
    5: getFinancialAgent(5),
    6: getFinancialAgent(6),
    7: getFinancialAgent(7)
  };
}

export default {
  FINANCIAL_AGENTS,
  getFinancialAgent,
  getAllFinancialAgents
};
