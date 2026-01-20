/**
 * Delegation Middleware - Middleware para procesar delegaciones de agentes
 *
 * Este middleware intercepta las respuestas del CEO (Agente 1) y otros agentes
 * que contienen instrucciones de delegación, y ejecuta la delegación real.
 */

import { EventEmitter } from 'events';

// Registro de agentes implementados - TODOS LOS 72 AGENTES
const IMPLEMENTED_AGENTS = {
  // Financieros (2-7)
  2: { name: 'CFO', category: 'financial', implemented: true },
  3: { name: 'Controller', category: 'financial', implemented: true },
  4: { name: 'FoodCostAnalyst', category: 'financial', implemented: true },
  5: { name: 'ProfitAnalyst', category: 'financial', implemented: true },
  6: { name: 'Treasurer', category: 'financial', implemented: true },
  7: { name: 'Accountant', category: 'financial', implemented: true },

  // Estratégicos (8-12)
  8: { name: 'StrategyDirector', category: 'strategic', implemented: true },
  9: { name: 'MarketAnalyst', category: 'strategic', implemented: true },
  10: { name: 'BusinessDevelopment', category: 'strategic', implemented: true },
  11: { name: 'BusinessModelInnovation', category: 'strategic', implemented: true },
  12: { name: 'StrategicAlliances', category: 'strategic', implemented: true },

  // Marketing (13-17)
  13: { name: 'CMO', category: 'marketing', implemented: true },
  14: { name: 'BrandManager', category: 'marketing', implemented: true },
  15: { name: 'DigitalMarketing', category: 'marketing', implemented: true },
  16: { name: 'ContentCreator', category: 'marketing', implemented: true },
  17: { name: 'CommunityManager', category: 'marketing', implemented: true },

  // Operaciones (18-25)
  18: { name: 'COO', category: 'operations', implemented: true },
  19: { name: 'RestaurantManager', category: 'operations', implemented: true },
  20: { name: 'FloorManager', category: 'operations', implemented: true },
  21: { name: 'Purchasing', category: 'operations', implemented: true },
  22: { name: 'Inventory', category: 'operations', implemented: true },
  23: { name: 'Maintenance', category: 'operations', implemented: true },
  24: { name: 'Safety', category: 'operations', implemented: true },
  25: { name: 'Sanitation', category: 'operations', implemented: true },

  // Kitchen (26-33)
  26: { name: 'ExecChef', category: 'kitchen', implemented: true },
  27: { name: 'SousChef', category: 'kitchen', implemented: true },
  28: { name: 'LineCook', category: 'kitchen', implemented: true },
  29: { name: 'PrepCook', category: 'kitchen', implemented: true },
  30: { name: 'PastryChef', category: 'kitchen', implemented: true },
  31: { name: 'Bartender', category: 'kitchen', implemented: true },
  32: { name: 'Sommelier', category: 'kitchen', implemented: true },
  33: { name: 'Barista', category: 'kitchen', implemented: true },

  // Legal (34-39)
  34: { name: 'CLO', category: 'legal', implemented: true },
  35: { name: 'CorporateLawyer', category: 'legal', implemented: true },
  36: { name: 'EmploymentLawyer', category: 'legal', implemented: true },
  37: { name: 'ContractSpecialist', category: 'legal', implemented: true },
  38: { name: 'ComplianceSpecialist', category: 'legal', implemented: true },
  39: { name: 'IPSpecialist', category: 'legal', implemented: true },

  // RRHH (40-45)
  40: { name: 'CHRO', category: 'hr', implemented: true },
  41: { name: 'Recruiter', category: 'hr', implemented: true },
  42: { name: 'TrainingManager', category: 'hr', implemented: true },
  43: { name: 'CompensationManager', category: 'hr', implemented: true },
  44: { name: 'EmployeeRelations', category: 'hr', implemented: true },
  45: { name: 'PayrollManager', category: 'hr', implemented: true },

  // Tecnología (46-51)
  46: { name: 'CTO', category: 'tech', implemented: true },
  47: { name: 'SystemsArchitect', category: 'tech', implemented: true },
  48: { name: 'POSSpecialist', category: 'tech', implemented: true },
  49: { name: 'DataAnalyst', category: 'tech', implemented: true },
  50: { name: 'Cybersecurity', category: 'tech', implemented: true },
  51: { name: 'ITSupport', category: 'tech', implemented: true },

  // Calidad (52-57)
  52: { name: 'QualityDirector', category: 'quality', implemented: true },
  53: { name: 'QualityAuditor', category: 'quality', implemented: true },
  54: { name: 'FoodQuality', category: 'quality', implemented: true },
  55: { name: 'CustomerExperience', category: 'quality', implemented: true },
  56: { name: 'ContinuousImprovement', category: 'quality', implemented: true },
  57: { name: 'Certifications', category: 'quality', implemented: true },

  // Sostenibilidad (58-63)
  58: { name: 'SustainabilityDirector', category: 'sustainability', implemented: true },
  59: { name: 'WasteManagement', category: 'sustainability', implemented: true },
  60: { name: 'EnergyEfficiency', category: 'sustainability', implemented: true },
  61: { name: 'SustainableSourcing', category: 'sustainability', implemented: true },
  62: { name: 'CarbonFootprint', category: 'sustainability', implemented: true },
  63: { name: 'SocialResponsibility', category: 'sustainability', implemented: true },

  // Innovación (64-70)
  64: { name: 'InnovationDirector', category: 'innovation', implemented: true },
  65: { name: 'RD', category: 'innovation', implemented: true },
  66: { name: 'TrendAnalyst', category: 'innovation', implemented: true },
  67: { name: 'DigitalInnovation', category: 'innovation', implemented: true },
  68: { name: 'ConceptDevelopment', category: 'innovation', implemented: true },
  69: { name: 'ExperienceDesign', category: 'innovation', implemented: true },
  70: { name: 'CulinaryLab', category: 'innovation', implemented: true },

  // Especiales (71-72)
  71: { name: 'ProjectManager', category: 'special', implemented: true },
  72: { name: 'FamilyLawyer', category: 'special', implemented: true, private: true, accessibleBy: [1] }
};

// Estado de las delegaciones activas
const activeDelegations = new Map();

/**
 * Parsea la respuesta del LLM para extraer delegaciones
 */
function parseDelegation(response) {
  const delegations = [];

  // Buscar patrón "delegateTo": [lista de IDs]
  const jsonMatch = response.match(/"delegateTo"\s*:\s*\[([^\]]+)\]/);
  if (jsonMatch) {
    const idsStr = jsonMatch[1];
    const ids = idsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    delegations.push(...ids);
  }

  // Buscar patrones alternativos
  const delegatePatterns = [
    /delegar?(?:é|emos)?\s+(?:al?\s+)?agent[e]?s?\s*:?\s*(\d+(?:\s*,\s*\d+)*)/gi,
    /agent[e]?s?\s+(\d+(?:\s*,\s*\d+)*)\s+(?:se\s+)?encargar/gi,
    /asignar?\s+(?:al?\s+)?agent[e]?s?\s*:?\s*(\d+(?:\s*,\s*\d+)*)/gi
  ];

  for (const pattern of delegatePatterns) {
    const matches = response.matchAll(pattern);
    for (const match of matches) {
      const ids = match[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      delegations.push(...ids);
    }
  }

  return [...new Set(delegations)]; // Eliminar duplicados
}

/**
 * Verifica si un agente está implementado
 */
function isAgentImplemented(agentId) {
  return IMPLEMENTED_AGENTS[agentId]?.implemented === true;
}

/**
 * Verifica permisos de acceso a un agente
 */
function checkAgentPermission(agentId, requestingAgentId) {
  const agent = IMPLEMENTED_AGENTS[agentId];
  if (!agent) return { allowed: false, reason: 'Agente no existe' };

  if (agent.private) {
    if (!agent.accessibleBy?.includes(requestingAgentId)) {
      return { allowed: false, reason: `Agente ${agentId} es privado y solo accesible por agentes ${agent.accessibleBy.join(', ')}` };
    }
  }

  return { allowed: true };
}

/**
 * Procesa archivos adjuntos para delegación
 */
function processAttachments(attachments = []) {
  const processed = [];

  for (const attachment of attachments) {
    processed.push({
      id: attachment.id || `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: attachment.name || 'archivo_adjunto',
      type: attachment.type || 'unknown',
      size: attachment.size || 0,
      content: attachment.content || attachment.data || null,
      url: attachment.url || null,
      processed: false,
      analysis: null
    });
  }

  return processed;
}

/**
 * Crea una tarea de delegación
 */
function createDelegationTask(fromAgentId, toAgentId, message, context = {}) {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const task = {
    id: taskId,
    fromAgentId,
    toAgentId,
    message,
    context,
    attachments: processAttachments(context.attachments || []),
    status: 'pending',
    created: new Date().toISOString(),
    started: null,
    completed: null,
    result: null,
    error: null
  };

  activeDelegations.set(taskId, task);

  return task;
}

/**
 * Ejecuta una delegación
 */
async function executeDelegation(task, aiProvider, apiClient) {
  task.status = 'in_progress';
  task.started = new Date().toISOString();

  try {
    const agent = IMPLEMENTED_AGENTS[task.toAgentId];

    if (!agent) {
      throw new Error(`Agente ${task.toAgentId} no está implementado`);
    }

    // Construir prompt para el agente delegado
    const delegatedPrompt = buildDelegatedPrompt(task, agent);

    // Llamar al agente delegado
    const response = await callAgent(task.toAgentId, delegatedPrompt, aiProvider, apiClient);

    task.result = response;
    task.status = 'completed';
    task.completed = new Date().toISOString();

    return task;

  } catch (error) {
    task.error = error.message;
    task.status = 'failed';
    task.completed = new Date().toISOString();
    throw error;
  }
}

/**
 * Construye el prompt para el agente delegado
 */
function buildDelegatedPrompt(task, agent) {
  let prompt = `
[DELEGACIÓN DEL AGENTE ${task.fromAgentId}]

Tarea asignada:
${task.message}

`;

  if (task.context.originalRequest) {
    prompt += `
Solicitud original del usuario:
${task.context.originalRequest}

`;
  }

  if (task.attachments.length > 0) {
    prompt += `
Archivos adjuntos (${task.attachments.length}):
${task.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.type}, ${a.size} bytes)`).join('\n')}

`;
  }

  if (task.context.additionalInfo) {
    prompt += `
Información adicional:
${task.context.additionalInfo}

`;
  }

  prompt += `
Por favor, procesa esta solicitud según tus capacidades como ${agent.name} y genera una respuesta completa.
`;

  return prompt;
}

/**
 * Llama a un agente específico
 */
async function callAgent(agentId, prompt, aiProvider, apiClient) {
  // Esta función debe integrarse con el sistema de llamadas a LLM existente
  // Por ahora, retorna un placeholder

  console.log(`[DelegationMiddleware] Llamando a Agente ${agentId} con prompt de ${prompt.length} caracteres`);

  // TODO: Integrar con el sistema de llamadas a LLM real
  return {
    agentId,
    response: `[Respuesta del Agente ${agentId}]`,
    timestamp: new Date().toISOString()
  };
}

/**
 * Middleware principal de delegación
 */
export function createDelegationMiddleware(options = {}) {
  const emitter = new EventEmitter();

  return {
    emitter,

    /**
     * Procesa una respuesta del CEO para detectar y ejecutar delegaciones
     */
    async processCEOResponse(ceoResponse, originalMessage, context = {}) {
      const delegateToAgents = parseDelegation(ceoResponse);

      if (delegateToAgents.length === 0) {
        return {
          hasDelegations: false,
          response: ceoResponse
        };
      }

      emitter.emit('delegation:detected', { agents: delegateToAgents, originalMessage });

      const results = {
        hasDelegations: true,
        delegations: [],
        errors: [],
        combinedResponse: ceoResponse
      };

      for (const agentId of delegateToAgents) {
        // Verificar si está implementado
        if (!isAgentImplemented(agentId)) {
          results.errors.push({
            agentId,
            error: `Agente ${agentId} no está implementado en el sistema`,
            suggestion: getAlternativeAgent(agentId)
          });
          continue;
        }

        // Verificar permisos
        const permission = checkAgentPermission(agentId, 1); // CEO es agente 1
        if (!permission.allowed) {
          results.errors.push({
            agentId,
            error: permission.reason
          });
          continue;
        }

        // Crear y ejecutar tarea
        const task = createDelegationTask(1, agentId, originalMessage, context);
        results.delegations.push(task);

        emitter.emit('delegation:started', { task });
      }

      // Agregar información sobre errores al response
      if (results.errors.length > 0) {
        results.combinedResponse += '\n\n**Nota sobre delegaciones:**\n';
        for (const err of results.errors) {
          results.combinedResponse += `- Agente ${err.agentId}: ${err.error}`;
          if (err.suggestion) {
            results.combinedResponse += ` (Sugerencia: usar ${err.suggestion})`;
          }
          results.combinedResponse += '\n';
        }
      }

      return results;
    },

    /**
     * Obtiene el estado de una delegación
     */
    getDelegationStatus(taskId) {
      return activeDelegations.get(taskId) || null;
    },

    /**
     * Lista todas las delegaciones activas
     */
    listActiveDelegations() {
      return Array.from(activeDelegations.values())
        .filter(d => d.status === 'pending' || d.status === 'in_progress');
    },

    /**
     * Obtiene información de agentes implementados
     */
    getImplementedAgents() {
      return { ...IMPLEMENTED_AGENTS };
    },

    /**
     * Verifica si un agente está implementado
     */
    isAgentImplemented,

    /**
     * Verifica permisos de acceso
     */
    checkAgentPermission
  };
}

/**
 * Sugiere un agente alternativo o proporciona info del agente implementado
 * NOTA: Todos los agentes 2-72 están ahora implementados
 */
function getAlternativeAgent(agentId) {
  // Todos los agentes están implementados - retornar info del agente
  const agent = IMPLEMENTED_AGENTS[agentId];
  if (agent) {
    return `Agente ${agentId} (${agent.name}) - Categoría: ${agent.category}`;
  }

  // Solo para agentes fuera del rango válido (1-72)
  if (agentId < 1 || agentId > 72) {
    return 'ID de agente inválido. Agentes válidos: 1-72';
  }

  // Agente 1 es el CEO - no se delega a sí mismo
  if (agentId === 1) {
    return 'Agente 1 (CEO) - Este es el agente orquestador principal';
  }

  return 'Agente no encontrado en el registro';
}

// Exportar funciones individuales también
export {
  parseDelegation,
  isAgentImplemented,
  checkAgentPermission,
  processAttachments,
  createDelegationTask,
  executeDelegation,
  IMPLEMENTED_AGENTS,
  getAlternativeAgent
};

export default createDelegationMiddleware;
