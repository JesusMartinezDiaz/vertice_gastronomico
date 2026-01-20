/**
 * KitchenAgentFactory - Factory para crear agentes de cocina
 * Garantiza que todos los agentes tengan capacidades universales
 */

import { ExecChefAgent } from '../agents/ExecChefAgent.js';
import { SousChefAgent } from '../agents/SousChefAgent.js';
import { PastryChefAgent } from '../agents/PastryChefAgent.js';
import { LineCookAgent } from '../agents/LineCookAgent.js';
import { PrepCookAgent } from '../agents/PrepCookAgent.js';
import { SommelierAgent } from '../agents/SommelierAgent.js';
import { BartenderAgent } from '../agents/BartenderAgent.js';
import { BaristaAgent } from '../agents/BaristaAgent.js';

export class KitchenAgentFactory {
  static agents = new Map();

  static AGENT_TYPES = {
    EXEC_CHEF: { id: 26, class: ExecChefAgent },
    SOUS_CHEF: { id: 27, class: SousChefAgent },
    PASTRY_CHEF: { id: 28, class: PastryChefAgent },
    LINE_COOK: { id: 29, class: LineCookAgent },
    PREP_COOK: { id: 30, class: PrepCookAgent },
    SOMMELIER: { id: 31, class: SommelierAgent },
    BARTENDER: { id: 32, class: BartenderAgent },
    BARISTA: { id: 33, class: BaristaAgent }
  };

  static createAgent(type) {
    const agentConfig = this.AGENT_TYPES[type];
    if (!agentConfig) {
      throw new Error(`Tipo de agente de cocina no válido: ${type}`);
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
      throw new Error(`ID de agente de cocina no válido: ${id}`);
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

  static getKitchenTeam() {
    return {
      leadership: [
        this.createAgent('EXEC_CHEF'),
        this.createAgent('SOUS_CHEF')
      ],
      production: [
        this.createAgent('PASTRY_CHEF'),
        this.createAgent('LINE_COOK'),
        this.createAgent('PREP_COOK')
      ],
      beverage: [
        this.createAgent('SOMMELIER'),
        this.createAgent('BARTENDER'),
        this.createAgent('BARISTA')
      ]
    };
  }

  static getKitchenBrigade() {
    return {
      chefExecutivo: this.createAgent('EXEC_CHEF'),
      sousChef: this.createAgent('SOUS_CHEF'),
      chefPastelero: this.createAgent('PASTRY_CHEF'),
      chefsDePartida: [this.createAgent('LINE_COOK')],
      prepCooks: [this.createAgent('PREP_COOK')],
      sommelier: this.createAgent('SOMMELIER'),
      bartender: this.createAgent('BARTENDER'),
      barista: this.createAgent('BARISTA')
    };
  }

  static getAgentsBySkill(skill) {
    const skillMap = {
      'menu_development': ['EXEC_CHEF', 'PASTRY_CHEF'],
      'quality_control': ['SOUS_CHEF', 'EXEC_CHEF'],
      'recipe_creation': ['EXEC_CHEF', 'PASTRY_CHEF', 'BARTENDER'],
      'cost_control': ['EXEC_CHEF', 'SOUS_CHEF'],
      'training': ['SOUS_CHEF', 'SOMMELIER'],
      'inventory': ['PREP_COOK', 'SOMMELIER', 'BARTENDER'],
      'wine_service': ['SOMMELIER'],
      'cocktails': ['BARTENDER'],
      'coffee': ['BARISTA'],
      'production': ['LINE_COOK', 'PREP_COOK', 'PASTRY_CHEF']
    };

    const agentTypes = skillMap[skill] || [];
    return agentTypes.map(type => this.createAgent(type));
  }
}

export default KitchenAgentFactory;
