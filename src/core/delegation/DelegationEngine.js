/**
 * DelegationEngine - Motor de Delegación entre Agentes
 *
 * Este módulo permite que un agente (especialmente el CEO - Agente 1)
 * delegue tareas a otros agentes y ejecute workflows automáticamente.
 *
 * CONTEXTO: Vértice Gastronómico es una CONSULTORÍA, no un restaurante.
 */

// EventEmitter simple para el navegador
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this;
  }
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
    return this;
  }
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
    return this;
  }
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}

/**
 * Estado de una tarea delegada
 */
export const DELEGATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Tipos de delegación
 */
export const DELEGATION_TYPE = {
  SINGLE: 'single',      // A un solo agente
  PARALLEL: 'parallel',  // A varios agentes en paralelo
  SEQUENTIAL: 'sequential', // A varios agentes en secuencia
  WORKFLOW: 'workflow'   // Workflow completo con pasos
};

/**
 * Registro COMPLETO de los 72 agentes del sistema
 */
export const AGENT_REGISTRY = {
  // ============================================================================
  // LEADERSHIP (1) - CEO / DIRECTOR GENERAL UNIFICADO
  // ============================================================================
  1: { name: 'CEO - Director General IA', shortName: 'CEO', category: 'LEADERSHIP', canDelegate: true, isMainOrchestrator: true },

  // ============================================================================
  // FINANCE (2-8)
  // ============================================================================
  2: { name: 'Director de Finanzas', shortName: 'CFO', category: 'FINANCE' },
  3: { name: 'Controller Financiero', shortName: 'Controller', category: 'FINANCE' },
  4: { name: 'Analista de Food Cost', shortName: 'Food Cost', category: 'FINANCE' },
  5: { name: 'Especialista en Pricing', shortName: 'Pricing', category: 'FINANCE' },
  6: { name: 'Tesorero', shortName: 'Tesorero', category: 'FINANCE' },
  7: { name: 'Analista de Inversiones', shortName: 'Inversiones', category: 'FINANCE' },
  8: { name: 'Auditor Interno', shortName: 'Auditor', category: 'FINANCE' },

  // ============================================================================
  // MARKETING (9-14)
  // ============================================================================
  9: { name: 'Director de Marketing', shortName: 'CMO', category: 'MARKETING' },
  10: { name: 'Community Manager', shortName: 'CM', category: 'MARKETING' },
  11: { name: 'Especialista en Ads', shortName: 'Ads', category: 'MARKETING' },
  12: { name: 'Analista de CRM', shortName: 'CRM', category: 'MARKETING' },
  13: { name: 'Diseñador Gráfico', shortName: 'Diseñador', category: 'MARKETING' },
  14: { name: 'Especialista en Delivery', shortName: 'Delivery', category: 'MARKETING' },

  // ============================================================================
  // OPERATIONS (15-22, 29-30)
  // ============================================================================
  15: { name: 'Gerente de Compras', shortName: 'Compras', category: 'OPERATIONS' },
  16: { name: 'Jefe de Almacén', shortName: 'Almacén', category: 'OPERATIONS' },
  17: { name: 'Chef Ejecutivo', shortName: 'Chef', category: 'OPERATIONS' },
  18: { name: 'Gerente de Operaciones', shortName: 'Ops', category: 'OPERATIONS' },
  22: { name: 'Supervisor de Turno', shortName: 'Supervisor', category: 'OPERATIONS' },
  29: { name: 'Ingeniero de Menú', shortName: 'Menu Eng', category: 'OPERATIONS' },
  30: { name: 'Coordinador de Eventos', shortName: 'Eventos', category: 'OPERATIONS' },

  // ============================================================================
  // HR (19-21, 44, 51, 54)
  // ============================================================================
  19: { name: 'Director de RRHH', shortName: 'RRHH', category: 'HR' },
  20: { name: 'Capacitador', shortName: 'Training', category: 'HR' },
  21: { name: 'Especialista en Nómina', shortName: 'Nómina', category: 'HR' },
  44: { name: 'Culture & Engagement Manager', shortName: 'Culture', category: 'HR' },
  51: { name: 'Organizational Designer', shortName: 'Org Design', category: 'HR' },
  54: { name: 'Leadership Coach', shortName: 'Coach', category: 'HR' },

  // ============================================================================
  // TECH (23-24, 32-33, 38, 45-47, 71)
  // ============================================================================
  23: { name: 'Analista de Datos', shortName: 'Data', category: 'TECH' },
  24: { name: 'Analista de Reportes', shortName: 'Reportes', category: 'TECH' },
  32: { name: 'Gerente de IT', shortName: 'IT', category: 'TECH' },
  33: { name: 'Desarrollador de Software', shortName: 'Dev', category: 'TECH' },
  38: { name: 'UX/UI Designer', shortName: 'UX', category: 'TECH' },
  45: { name: 'Data & Analytics Lead', shortName: 'Analytics', category: 'TECH' },
  46: { name: 'Digital Product Manager', shortName: 'Digital PM', category: 'TECH' },
  47: { name: 'IT Infrastructure Manager', shortName: 'IT Infra', category: 'TECH' },
  71: { name: 'Arquitecto de Sistemas', shortName: 'Architect', category: 'TECH' },

  // ============================================================================
  // LEADERSHIP ESTRATÉGICO (25-28, 39, 48-50, 55-56)
  // ============================================================================
  25: { name: 'Estratega de Negocios', shortName: 'Estrategia', category: 'LEADERSHIP' },
  26: { name: 'Gerente de Ventas', shortName: 'Ventas', category: 'LEADERSHIP' },
  27: { name: 'Especialista en Franquicias', shortName: 'Franquicias', category: 'LEADERSHIP' },
  28: { name: 'Scout de Ubicaciones', shortName: 'Scout', category: 'LEADERSHIP' },
  39: { name: 'Scaling Up Coach', shortName: 'Scaling Up', category: 'LEADERSHIP' },
  48: { name: 'Chief Strategy Officer', shortName: 'CSO', category: 'LEADERSHIP' },
  49: { name: 'New Business Development Lead', shortName: 'Nuevos Negocios', category: 'LEADERSHIP' },
  50: { name: 'Investor Relations Manager', shortName: 'IR', category: 'FINANCE' },
  55: { name: 'Executive Assistant IA', shortName: 'EA', category: 'LEADERSHIP' },
  56: { name: 'Project Manager', shortName: 'PM', category: 'LEADERSHIP' },

  // ============================================================================
  // LEGAL (31, 34)
  // ============================================================================
  31: { name: 'Especialista en Compliance', shortName: 'Compliance', category: 'LEGAL' },
  34: { name: 'Asesor Legal', shortName: 'Legal', category: 'LEGAL' },

  // ============================================================================
  // QUALITY (35, 64)
  // ============================================================================
  35: { name: 'Mystery Shopper Lead', shortName: 'Mystery', category: 'QUALITY' },
  64: { name: 'Food Safety Manager', shortName: 'Food Safety', category: 'QUALITY' },

  // ============================================================================
  // MARKETING AVANZADO (36-37, 41, 53, 57-60)
  // ============================================================================
  36: { name: 'Especialista en SEO', shortName: 'SEO', category: 'MARKETING' },
  37: { name: 'Lead de LinkedIn B2B', shortName: 'LinkedIn', category: 'MARKETING' },
  41: { name: 'Growth Marketing Manager', shortName: 'Growth', category: 'MARKETING' },
  53: { name: 'Brand Architect', shortName: 'Brand', category: 'MARKETING' },
  57: { name: 'Sales & Quotation Manager', shortName: 'Cotizador', category: 'MARKETING' },
  58: { name: 'Social Listening Analyst', shortName: 'Social Listen', category: 'MARKETING' },
  59: { name: 'Influencer Marketing Lead', shortName: 'Influencer', category: 'MARKETING' },
  60: { name: 'PR & Communications Manager', shortName: 'PR', category: 'MARKETING' },

  // ============================================================================
  // FINANCE AVANZADO (40, 61)
  // ============================================================================
  40: { name: 'FP&A Lead', shortName: 'FP&A', category: 'FINANCE' },
  61: { name: 'Revenue Manager', shortName: 'Revenue', category: 'FINANCE' },

  // ============================================================================
  // OPERATIONS AVANZADO (42-43, 52, 62-63, 65-70)
  // ============================================================================
  42: { name: 'Supply Chain Director', shortName: 'Supply Chain', category: 'OPERATIONS' },
  43: { name: 'Multi-Unit Operations Manager', shortName: 'Multi-Unit', category: 'OPERATIONS' },
  52: { name: 'Service Architect', shortName: 'Service Arch', category: 'OPERATIONS' },
  62: { name: 'Guest Experience Manager', shortName: 'Guest Exp', category: 'OPERATIONS' },
  63: { name: 'Sustainability Manager', shortName: 'Sustain', category: 'OPERATIONS' },
  65: { name: 'Recipe Developer', shortName: 'Recipe Dev', category: 'OPERATIONS' },
  66: { name: 'Sommelier', shortName: 'Sommelier', category: 'OPERATIONS' },
  67: { name: 'Mixólogo', shortName: 'Mixólogo', category: 'OPERATIONS' },
  68: { name: 'Pastelero Ejecutivo', shortName: 'Pastelero', category: 'OPERATIONS' },
  69: { name: 'Especialista en Catering', shortName: 'Catering', category: 'OPERATIONS' },
  70: { name: 'Nutriólogo', shortName: 'Nutriólogo', category: 'OPERATIONS' },

  // ============================================================================
  // PRIVADO - SOLO CEO (72)
  // ============================================================================
  72: { name: 'Abogado Familiar', shortName: 'Fam Lawyer', category: 'PRIVATE', isPrivate: true, ceoOnly: true }
};

/**
 * Clase DelegationTask - Representa una tarea delegada
 */
export class DelegationTask {
  constructor(id, fromAgentId, toAgentId, task, context = {}) {
    this.id = id;
    this.fromAgentId = fromAgentId;
    this.toAgentId = toAgentId;
    this.task = task;
    this.context = context;
    this.status = DELEGATION_STATUS.PENDING;
    this.result = null;
    this.error = null;
    this.createdAt = new Date();
    this.startedAt = null;
    this.completedAt = null;
    this.attachments = context.attachments || [];
    this.outputDocuments = [];
  }

  start() {
    this.status = DELEGATION_STATUS.IN_PROGRESS;
    this.startedAt = new Date();
  }

  complete(result) {
    this.status = DELEGATION_STATUS.COMPLETED;
    this.result = result;
    this.completedAt = new Date();
  }

  fail(error) {
    this.status = DELEGATION_STATUS.FAILED;
    this.error = error;
    this.completedAt = new Date();
  }

  addOutputDocument(doc) {
    this.outputDocuments.push(doc);
  }

  toJSON() {
    return {
      id: this.id,
      fromAgentId: this.fromAgentId,
      fromAgent: AGENT_REGISTRY[this.fromAgentId]?.name || `Agente ${this.fromAgentId}`,
      toAgentId: this.toAgentId,
      toAgent: AGENT_REGISTRY[this.toAgentId]?.name || `Agente ${this.toAgentId}`,
      task: this.task,
      status: this.status,
      result: this.result,
      error: this.error,
      attachments: this.attachments.length,
      outputDocuments: this.outputDocuments.length,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      duration: this.completedAt && this.startedAt
        ? this.completedAt - this.startedAt
        : null
    };
  }
}

/**
 * Clase Workflow - Representa un workflow de delegación
 */
export class Workflow {
  constructor(id, name, steps = []) {
    this.id = id;
    this.name = name;
    this.steps = steps;
    this.currentStep = 0;
    this.status = DELEGATION_STATUS.PENDING;
    this.results = [];
    this.createdAt = new Date();
    this.completedAt = null;
  }

  getCurrentStep() {
    return this.steps[this.currentStep] || null;
  }

  advanceStep(result) {
    this.results.push({
      step: this.currentStep,
      result,
      completedAt: new Date()
    });
    this.currentStep++;

    if (this.currentStep >= this.steps.length) {
      this.status = DELEGATION_STATUS.COMPLETED;
      this.completedAt = new Date();
      return null;
    }

    return this.getCurrentStep();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      totalSteps: this.steps.length,
      currentStep: this.currentStep,
      status: this.status,
      progress: `${this.currentStep}/${this.steps.length}`,
      results: this.results,
      createdAt: this.createdAt,
      completedAt: this.completedAt
    };
  }
}

/**
 * DelegationEngine - Motor principal de delegación
 */
export class DelegationEngine extends EventEmitter {
  constructor(aiProvider = null) {
    super();
    this.tasks = new Map();
    this.workflows = new Map();
    this.taskCounter = 0;
    this.workflowCounter = 0;
    this.aiProvider = aiProvider;
    this.agentHandlers = new Map();
  }

  /**
   * Registra un handler para un agente específico
   */
  registerAgentHandler(agentId, handler) {
    this.agentHandlers.set(agentId, handler);
  }

  /**
   * Parsea delegateTo desde la respuesta del LLM
   */
  parseDelegation(response) {
    try {
      const responseLower = response?.toLowerCase() || '';
      let agentIds = [];

      // Buscar JSON en la respuesta
      const jsonMatch = response.match(/"delegateTo"\s*:\s*\[([^\]]+)\]/);
      if (jsonMatch) {
        agentIds = jsonMatch[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }

      // Buscar patrón alternativo
      if (agentIds.length === 0) {
        const altMatch = response.match(/delegateTo.*?(\d+(?:\s*,\s*\d+)*)/i);
        if (altMatch) {
          agentIds = altMatch[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        }
      }

      // DETECCIÓN AUTOMÁTICA: Si no se encontró delegateTo pero hay palabras clave del Agente 72
      if (agentIds.length === 0) {
        const agent72Keywords = [
          'custodia', 'guarda', 'divorcio', 'separación', 'pensión alimenticia',
          'alimentos', 'manutención', 'patria potestad', 'tutela', 'menores',
          'convivencia', 'régimen de visitas', 'expediente judicial', 'juzgado familiar',
          'derecho familiar', 'abogado familiar', 'demanda familiar', 'juicio familiar',
          'agente 72', 'abogado de familia', 'custodia compartida',
          // Palabras clave específicas del caso
          'expediente', '512', 'incidente', 'expediente 512'
        ];

        const hasAgent72Keywords = agent72Keywords.some(keyword => responseLower.includes(keyword));

        if (hasAgent72Keywords) {
          console.log('[DelegationEngine] Detectadas palabras clave del Agente 72, delegando automáticamente');
          agentIds.push(72);
        }
      }

      return agentIds;
    } catch (error) {
      console.error('[DelegationEngine] Error parsing delegation:', error);
      return [];
    }
  }

  /**
   * Extrae el contexto/tarea de la respuesta del CEO
   */
  extractTaskContext(response, originalMessage) {
    // Extraer la tarea principal del mensaje original o de la respuesta
    return {
      originalRequest: originalMessage,
      ceoAnalysis: response,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Crea una nueva tarea de delegación
   */
  createTask(fromAgentId, toAgentId, task, context = {}) {
    const id = `TASK-${++this.taskCounter}-${Date.now()}`;
    const delegationTask = new DelegationTask(id, fromAgentId, toAgentId, task, context);
    this.tasks.set(id, delegationTask);

    this.emit('task:created', { task: delegationTask.toJSON() });

    return delegationTask;
  }

  /**
   * Ejecuta una tarea de delegación
   */
  async executeTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Tarea no encontrada: ${taskId}`);
    }

    task.start();
    this.emit('task:started', { task: task.toJSON() });

    try {
      // Verificar permisos para agentes privados
      if (AGENT_REGISTRY[task.toAgentId]?.isPrivate) {
        if (task.fromAgentId !== 1) {
          throw new Error(`Solo el CEO puede delegar al Agente ${task.toAgentId}`);
        }
      }

      // Ejecutar la tarea usando el handler del agente
      const handler = this.agentHandlers.get(task.toAgentId);
      let result;

      if (handler) {
        result = await handler(task);
      } else {
        // Handler por defecto: llamar al AI con el contexto del agente
        result = await this.defaultAgentHandler(task);
      }

      task.complete(result);
      this.emit('task:completed', { task: task.toJSON() });

      return result;
    } catch (error) {
      task.fail(error.message);
      this.emit('task:failed', { task: task.toJSON(), error: error.message });
      throw error;
    }
  }

  /**
   * Handler por defecto para agentes sin handler específico
   */
  async defaultAgentHandler(task) {
    const agent = AGENT_REGISTRY[task.toAgentId];
    if (!agent) {
      throw new Error(`Agente no registrado: ${task.toAgentId}`);
    }

    // Construir prompt para el agente
    const prompt = this.buildAgentPrompt(task);

    // Si hay un proveedor de AI, usarlo
    if (this.aiProvider) {
      return await this.aiProvider.process(prompt, {
        agentId: task.toAgentId,
        agentName: agent.name,
        context: task.context
      });
    }

    // Sin AI provider, retornar análisis básico
    return {
      agentId: task.toAgentId,
      agentName: agent.name,
      task: task.task,
      status: 'processed',
      message: `Tarea procesada por ${agent.name}`,
      requiresAI: true
    };
  }

  /**
   * Construye el prompt para un agente
   */
  buildAgentPrompt(task) {
    const agent = AGENT_REGISTRY[task.toAgentId];
    const attachmentInfo = task.attachments.length > 0
      ? `\n\nARCHIVOS ADJUNTOS (${task.attachments.length}):\n${task.attachments.map(a => `- ${a.name}: ${a.type}`).join('\n')}`
      : '';

    return `
Eres ${agent.name} (Agente #${task.toAgentId}) del sistema Vértice Gastronómico.

CONTEXTO: Vértice Gastronómico es una CONSULTORÍA GASTRONÓMICA, NO un restaurante.

TAREA DELEGADA:
${task.task}

CONTEXTO ADICIONAL:
${JSON.stringify(task.context, null, 2)}
${attachmentInfo}

Por favor, procesa esta tarea según tu especialidad como ${agent.name}.
Proporciona un análisis detallado y acciones recomendadas.
`;
  }

  /**
   * Crea y ejecuta un workflow
   */
  async createWorkflow(name, steps) {
    const id = `WF-${++this.workflowCounter}-${Date.now()}`;
    const workflow = new Workflow(id, name, steps);
    this.workflows.set(id, workflow);

    this.emit('workflow:created', { workflow: workflow.toJSON() });

    return workflow;
  }

  /**
   * Ejecuta un workflow completo
   */
  async executeWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow no encontrado: ${workflowId}`);
    }

    workflow.status = DELEGATION_STATUS.IN_PROGRESS;
    this.emit('workflow:started', { workflow: workflow.toJSON() });

    try {
      let currentStep = workflow.getCurrentStep();

      while (currentStep) {
        // Crear y ejecutar tarea para este paso
        const task = this.createTask(
          currentStep.fromAgentId || 1,
          currentStep.toAgentId,
          currentStep.task,
          currentStep.context
        );

        const result = await this.executeTask(task.id);

        // Avanzar al siguiente paso
        currentStep = workflow.advanceStep(result);

        this.emit('workflow:step:completed', {
          workflow: workflow.toJSON(),
          stepResult: result
        });
      }

      this.emit('workflow:completed', { workflow: workflow.toJSON() });
      return workflow;
    } catch (error) {
      workflow.status = DELEGATION_STATUS.FAILED;
      this.emit('workflow:failed', { workflow: workflow.toJSON(), error: error.message });
      throw error;
    }
  }

  /**
   * Procesa delegación automática desde respuesta del CEO
   */
  async processCEODelegation(ceoResponse, originalMessage, context = {}) {
    // Primero buscar delegación en la respuesta del CEO
    let delegateToAgents = this.parseDelegation(ceoResponse);

    // Si no se encontró delegación, buscar también en el mensaje original
    if (delegateToAgents.length === 0) {
      delegateToAgents = this.parseDelegation(originalMessage);
    }

    // Detección adicional basada en contexto combinado
    if (delegateToAgents.length === 0) {
      const combinedText = `${ceoResponse || ''} ${originalMessage || ''}`.toLowerCase();
      const agent72Keywords = [
        'custodia', 'guarda', 'divorcio', 'separación', 'pensión alimenticia',
        'alimentos', 'manutención', 'patria potestad', 'tutela', 'menores',
        'convivencia', 'régimen de visitas', 'expediente judicial', 'juzgado familiar',
        'derecho familiar', 'abogado familiar', 'demanda familiar', 'juicio familiar',
        'agente 72', 'abogado de familia', 'custodia compartida', 'hijos', 'menor',
        // Palabras clave específicas del caso
        'expediente', '512', 'incidente', 'expediente 512'
      ];

      const hasAgent72Keywords = agent72Keywords.some(keyword => combinedText.includes(keyword));

      if (hasAgent72Keywords) {
        console.log('[DelegationEngine] Detectadas palabras clave del Agente 72 en contexto combinado');
        delegateToAgents.push(72);
      }
    }

    if (delegateToAgents.length === 0) {
      return {
        delegated: false,
        message: 'No se identificaron agentes para delegación'
      };
    }

    console.log('[DelegationEngine] Delegando a agentes:', delegateToAgents);

    const taskContext = this.extractTaskContext(ceoResponse, originalMessage);
    const results = [];

    // Crear tareas para cada agente
    for (const agentId of delegateToAgents) {
      const task = this.createTask(1, agentId, originalMessage, {
        ...context,
        ...taskContext
      });

      try {
        const result = await this.executeTask(task.id);
        results.push({
          agentId,
          agentName: AGENT_REGISTRY[agentId]?.name || `Agente ${agentId}`,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          agentId,
          agentName: AGENT_REGISTRY[agentId]?.name || `Agente ${agentId}`,
          success: false,
          error: error.message
        });
      }
    }

    return {
      delegated: true,
      delegatedTo: delegateToAgents,
      results
    };
  }

  /**
   * Obtiene información de un agente
   */
  getAgentInfo(agentId) {
    return AGENT_REGISTRY[agentId] || null;
  }

  /**
   * Lista todos los agentes disponibles
   */
  listAgents(category = null) {
    const agents = Object.entries(AGENT_REGISTRY)
      .map(([id, info]) => ({ id: parseInt(id), ...info }));

    if (category) {
      return agents.filter(a => a.category === category);
    }

    return agents;
  }

  /**
   * Obtiene estadísticas del motor
   */
  getStats() {
    const tasks = Array.from(this.tasks.values());
    const workflows = Array.from(this.workflows.values());

    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === DELEGATION_STATUS.PENDING).length,
      completedTasks: tasks.filter(t => t.status === DELEGATION_STATUS.COMPLETED).length,
      failedTasks: tasks.filter(t => t.status === DELEGATION_STATUS.FAILED).length,
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === DELEGATION_STATUS.IN_PROGRESS).length
    };
  }
}

// Singleton para uso global
let delegationEngineInstance = null;

export function getDelegationEngine(aiProvider = null) {
  if (!delegationEngineInstance) {
    delegationEngineInstance = new DelegationEngine(aiProvider);
  }
  return delegationEngineInstance;
}

export default DelegationEngine;
