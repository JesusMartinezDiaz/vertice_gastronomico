/**
 * FinancialAgentFactory - Factory para crear agentes financieros
 * Garantiza que todos los agentes tengan capacidades universales
 */

import { CFOAgent } from '../agents/CFOAgent.js';
import { ControllerAgent } from '../agents/ControllerAgent.js';
import { FoodCostAnalystAgent } from '../agents/FoodCostAnalystAgent.js';
import { ProfitAnalystAgent } from '../agents/ProfitAnalystAgent.js';
import { TreasurerAgent } from '../agents/TreasurerAgent.js';
import { AccountantAgent } from '../agents/AccountantAgent.js';

export class FinancialAgentFactory {
  static agents = new Map();

  static AGENT_TYPES = {
    CFO: { id: 2, class: CFOAgent },
    CONTROLLER: { id: 3, class: ControllerAgent },
    FOOD_COST: { id: 4, class: FoodCostAnalystAgent },
    PROFIT_ANALYST: { id: 5, class: ProfitAnalystAgent },
    TREASURER: { id: 6, class: TreasurerAgent },
    ACCOUNTANT: { id: 7, class: AccountantAgent }
  };

  static createAgent(type) {
    const agentConfig = this.AGENT_TYPES[type];
    if (!agentConfig) {
      throw new Error(`Tipo de agente financiero no válido: ${type}`);
    }

    // Verificar si ya existe
    if (this.agents.has(agentConfig.id)) {
      return this.agents.get(agentConfig.id);
    }

    // Crear nueva instancia
    const agent = new agentConfig.class();
    this.agents.set(agentConfig.id, agent);

    return agent;
  }

  static createAgentById(id) {
    const type = Object.keys(this.AGENT_TYPES).find(
      key => this.AGENT_TYPES[key].id === id
    );

    if (!type) {
      throw new Error(`ID de agente financiero no válido: ${id}`);
    }

    return this.createAgent(type);
  }

  static getAllAgents() {
    const allAgents = [];
    for (const type of Object.keys(this.AGENT_TYPES)) {
      allAgents.push(this.createAgent(type));
    }
    return allAgents;
  }

  static getAgentCapabilities(type) {
    const agent = this.createAgent(type);
    return agent.getCapabilities();
  }

  static getFinancialTeam() {
    return {
      leadership: [this.createAgent('CFO')],
      control: [this.createAgent('CONTROLLER'), this.createAgent('ACCOUNTANT')],
      analysis: [this.createAgent('FOOD_COST'), this.createAgent('PROFIT_ANALYST')],
      treasury: [this.createAgent('TREASURER')]
    };
  }
}

export default FinancialAgentFactory;
