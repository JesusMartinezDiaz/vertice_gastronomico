/**
 * WorkflowExecutor - Servicio para ejecutar workflows de agentes
 *
 * Este servicio conecta el chat del CEO con el DelegationEngine
 * para ejecutar workflows reales cuando el CEO delega tareas.
 *
 * SOLUCIÓN AL PROBLEMA: El workflow no se ejecutaba porque no había
 * conexión entre la UI del chat y el DelegationEngine.
 */

import { DelegationEngine, AGENT_REGISTRY } from '../core/delegation/DelegationEngine';

// Instancia singleton del motor de delegación
let delegationEngineInstance = null;

/**
 * Obtiene o crea la instancia del DelegationEngine
 */
export function getDelegationEngine() {
  if (!delegationEngineInstance) {
    delegationEngineInstance = new DelegationEngine();

    // Configurar listeners para eventos de workflow
    delegationEngineInstance.on('task:created', (data) => {
      console.log('[WorkflowExecutor] Tarea creada:', data.task.id);
      notifyUI('task:created', data);
    });

    delegationEngineInstance.on('task:started', (data) => {
      console.log('[WorkflowExecutor] Tarea iniciada:', data.task.id);
      notifyUI('task:started', data);
    });

    delegationEngineInstance.on('task:completed', (data) => {
      console.log('[WorkflowExecutor] Tarea completada:', data.task.id);
      notifyUI('task:completed', data);
    });

    delegationEngineInstance.on('task:failed', (data) => {
      console.error('[WorkflowExecutor] Tarea fallida:', data.task.id, data.error);
      notifyUI('task:failed', data);
    });

    delegationEngineInstance.on('workflow:started', (data) => {
      console.log('[WorkflowExecutor] Workflow iniciado:', data.workflow.name);
      notifyUI('workflow:started', data);
    });

    delegationEngineInstance.on('workflow:completed', (data) => {
      console.log('[WorkflowExecutor] Workflow completado:', data.workflow.name);
      notifyUI('workflow:completed', data);
    });

    // Registrar handler para Agente 72 (Abogado Familiar)
    registerAgent72Handler();
  }

  return delegationEngineInstance;
}

// Callbacks para notificar a la UI
const uiCallbacks = new Set();

/**
 * Registra un callback para recibir notificaciones de la UI
 */
export function subscribeToWorkflowEvents(callback) {
  uiCallbacks.add(callback);
  return () => uiCallbacks.delete(callback);
}

/**
 * Notifica a todos los callbacks registrados
 */
function notifyUI(event, data) {
  uiCallbacks.forEach(callback => {
    try {
      callback(event, data);
    } catch (error) {
      console.error('[WorkflowExecutor] Error en callback UI:', error);
    }
  });
}

/**
 * Handler específico para el Agente 72 (Abogado Familiar)
 */
async function agent72Handler(task) {
  console.log('[Agent72] Procesando tarea:', task.task);

  const result = {
    agentId: 72,
    agentName: 'Abogado Familiar',
    taskId: task.id,
    status: 'processing',
    steps: [],
    documents: [],
    analysis: null
  };

  try {
    // Paso 1: Verificar si hay archivos ZIP en los attachments
    const zipFiles = task.attachments?.filter(a =>
      a.name?.endsWith('.zip') || a.type === 'application/zip'
    ) || [];

    result.steps.push({
      step: 1,
      name: 'Verificar archivos',
      status: 'completed',
      details: `Encontrados ${zipFiles.length} archivos ZIP`
    });

    // Paso 2: Procesar archivos ZIP (si existen)
    if (zipFiles.length > 0) {
      result.steps.push({
        step: 2,
        name: 'Extraer documentos',
        status: 'processing',
        details: 'Extrayendo documentos del ZIP...'
      });

      // Simular extracción de documentos
      // En producción, aquí se llamaría al FamilyLawyerAgent real
      for (const zipFile of zipFiles) {
        result.documents.push({
          source: zipFile.name,
          extractedFiles: ['documento_1.pdf', 'documento_2.pdf'],
          status: 'extracted'
        });
      }

      result.steps[1].status = 'completed';
      result.steps[1].details = `Extraídos ${result.documents.length} conjuntos de documentos`;
    }

    // Paso 3: Analizar documentos
    result.steps.push({
      step: 3,
      name: 'Analizar documentos',
      status: 'processing',
      details: 'Analizando contenido legal...'
    });

    // Análisis legal básico
    result.analysis = {
      tipoAsunto: detectarTipoAsunto(task.task),
      documentosRequeridos: [],
      recomendaciones: [],
      proximosPasos: []
    };

    // Detectar tipo de asunto y generar recomendaciones
    if (result.analysis.tipoAsunto === 'DIVORCIO') {
      result.analysis.documentosRequeridos = [
        'Acta de matrimonio',
        'Identificaciones oficiales',
        'Comprobantes de domicilio',
        'Inventario de bienes',
        'Convenio de divorcio (si es voluntario)'
      ];
      result.analysis.recomendaciones = [
        'Se recomienda divorcio voluntario si hay acuerdo',
        'Considerar pensión alimenticia si hay hijos menores',
        'Revisar régimen de bienes del matrimonio'
      ];
      result.analysis.proximosPasos = [
        'Reunir documentación requerida',
        'Elaborar convenio de divorcio',
        'Presentar demanda ante juzgado familiar'
      ];
    } else if (result.analysis.tipoAsunto === 'PENSION_ALIMENTICIA') {
      result.analysis.documentosRequeridos = [
        'Actas de nacimiento',
        'Comprobantes de ingresos del demandado',
        'Comprobantes de gastos de los acreedores',
        'Domicilio del demandado'
      ];
      result.analysis.recomendaciones = [
        'Documentar todos los gastos del menor',
        'Obtener constancia de ingresos del obligado',
        'Considerar pensión provisional durante el juicio'
      ];
    } else if (result.analysis.tipoAsunto === 'CUSTODIA') {
      result.analysis.documentosRequeridos = [
        'Actas de nacimiento',
        'Comprobantes de capacidad económica',
        'Estudios psicológicos (si existen)',
        'Antecedentes del caso'
      ];
      result.analysis.recomendaciones = [
        'Priorizar el interés superior del menor',
        'Considerar custodia compartida si es viable',
        'Evaluar régimen de convivencia'
      ];
    } else {
      result.analysis.recomendaciones = [
        'Consultar con especialista en la materia',
        'Reunir documentación relevante',
        'Evaluar opciones de mediación'
      ];
    }

    result.steps[result.steps.length - 1].status = 'completed';
    result.steps[result.steps.length - 1].details = `Análisis completado: ${result.analysis.tipoAsunto}`;

    // Paso 4: Generar documento (si aplica)
    if (task.context?.generateDocument) {
      result.steps.push({
        step: 4,
        name: 'Generar escrito legal',
        status: 'processing',
        details: 'Generando documento...'
      });

      const documento = generarDocumentoLegal(result.analysis);
      result.outputDocument = documento;

      result.steps[result.steps.length - 1].status = 'completed';
      result.steps[result.steps.length - 1].details = 'Documento generado exitosamente';
    }

    result.status = 'completed';
    result.message = `Análisis completado por Abogado Familiar. Tipo de asunto: ${result.analysis.tipoAsunto}`;

  } catch (error) {
    result.status = 'failed';
    result.error = error.message;
    result.steps.push({
      step: 'error',
      name: 'Error',
      status: 'failed',
      details: error.message
    });
  }

  return result;
}

/**
 * Detecta el tipo de asunto legal basado en el mensaje
 */
function detectarTipoAsunto(mensaje) {
  const mensajeLower = mensaje?.toLowerCase() || '';

  if (mensajeLower.includes('divorcio') || mensajeLower.includes('separación')) {
    return 'DIVORCIO';
  }
  if (mensajeLower.includes('pensión') || mensajeLower.includes('alimentos') || mensajeLower.includes('manutención')) {
    return 'PENSION_ALIMENTICIA';
  }
  if (mensajeLower.includes('custodia') || mensajeLower.includes('patria potestad') || mensajeLower.includes('guarda')) {
    return 'CUSTODIA';
  }
  if (mensajeLower.includes('herencia') || mensajeLower.includes('sucesión') || mensajeLower.includes('testamento')) {
    return 'SUCESION';
  }
  if (mensajeLower.includes('adopción')) {
    return 'ADOPCION';
  }
  if (mensajeLower.includes('reconocimiento') || mensajeLower.includes('paternidad')) {
    return 'RECONOCIMIENTO_PATERNIDAD';
  }

  return 'CONSULTA_GENERAL';
}

/**
 * Genera un documento legal básico
 */
function generarDocumentoLegal(analysis) {
  const fecha = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    tipo: 'ESCRITO_INICIAL',
    fecha: fecha,
    asunto: analysis.tipoAsunto,
    contenido: `
ESCRITO INICIAL - ${analysis.tipoAsunto}

Fecha: ${fecha}

DOCUMENTOS REQUERIDOS:
${analysis.documentosRequeridos?.map((d, i) => `${i + 1}. ${d}`).join('\n') || 'Por determinar'}

RECOMENDACIONES:
${analysis.recomendaciones?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'Sin recomendaciones específicas'}

PRÓXIMOS PASOS:
${analysis.proximosPasos?.map((p, i) => `${i + 1}. ${p}`).join('\n') || 'Por determinar'}

---
Generado por: Agente 72 - Abogado Familiar
Sistema: Vértice Gastronómico
    `.trim(),
    metadata: {
      generatedBy: 'Agent72-FamilyLawyer',
      version: '1.0',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Registra el handler del Agente 72
 */
function registerAgent72Handler() {
  const engine = delegationEngineInstance;
  if (engine) {
    engine.registerAgentHandler(72, agent72Handler);
    console.log('[WorkflowExecutor] Handler del Agente 72 registrado');
  }
}

/**
 * Procesa la respuesta del CEO y ejecuta workflows si es necesario
 *
 * Esta es la función PRINCIPAL que conecta el chat con la ejecución de workflows.
 * Debe llamarse después de que el CEO responde.
 *
 * @param {string} ceoResponse - La respuesta del CEO
 * @param {string} originalMessage - El mensaje original del usuario
 * @param {Object} context - Contexto adicional (archivos adjuntos, etc.)
 * @returns {Promise<Object>} - Resultado de la delegación/workflow
 */
export async function processCEOResponseAndExecute(ceoResponse, originalMessage, context = {}) {
  const engine = getDelegationEngine();

  console.log('[WorkflowExecutor] Procesando respuesta del CEO...');
  console.log('[WorkflowExecutor] Buscando delegaciones en:', ceoResponse?.substring(0, 200));

  try {
    // Procesar delegación automática
    const result = await engine.processCEODelegation(ceoResponse, originalMessage, context);

    if (result.delegated) {
      console.log('[WorkflowExecutor] Delegación ejecutada:', result);

      // Ejecutar las tareas creadas
      if (result.tasks && result.tasks.length > 0) {
        const taskResults = [];

        for (const taskInfo of result.tasks) {
          try {
            const taskResult = await engine.executeTask(taskInfo.id);
            taskResults.push({
              taskId: taskInfo.id,
              agentId: taskInfo.toAgentId,
              status: 'completed',
              result: taskResult
            });
          } catch (taskError) {
            taskResults.push({
              taskId: taskInfo.id,
              agentId: taskInfo.toAgentId,
              status: 'failed',
              error: taskError.message
            });
          }
        }

        result.executedTasks = taskResults;
      }
    }

    return result;
  } catch (error) {
    console.error('[WorkflowExecutor] Error procesando delegación:', error);
    return {
      delegated: false,
      error: error.message,
      message: 'Error al procesar la delegación del CEO'
    };
  }
}

/**
 * Crea y ejecuta un workflow manualmente
 */
export async function executeManualWorkflow(workflowName, steps) {
  const engine = getDelegationEngine();

  const workflow = await engine.createWorkflow(workflowName, steps);
  const result = await engine.executeWorkflow(workflow.id);

  return result;
}

/**
 * Delega una tarea directamente a un agente específico
 */
export async function delegateToAgent(agentId, task, context = {}) {
  const engine = getDelegationEngine();

  // Verificar que el agente existe
  const agent = AGENT_REGISTRY[agentId];
  if (!agent) {
    throw new Error(`Agente ${agentId} no encontrado en el registro`);
  }

  // Verificar permisos para agentes privados
  if (agent.isPrivate && context.requesterId !== 1) {
    throw new Error(`El Agente ${agentId} (${agent.name}) solo es accesible por el CEO`);
  }

  // Crear y ejecutar la tarea
  const delegationTask = engine.createTask(context.requesterId || 1, agentId, task, context);
  const result = await engine.executeTask(delegationTask.id);

  return {
    taskId: delegationTask.id,
    agentId,
    agentName: agent.name,
    result,
    status: 'completed'
  };
}

/**
 * Obtiene el estado de todas las tareas activas
 */
export function getActiveTasks() {
  const engine = getDelegationEngine();
  const tasks = [];

  engine.tasks.forEach((task, id) => {
    tasks.push(task.toJSON());
  });

  return tasks;
}

/**
 * Obtiene el estado de todos los workflows activos
 */
export function getActiveWorkflows() {
  const engine = getDelegationEngine();
  const workflows = [];

  engine.workflows.forEach((workflow, id) => {
    workflows.push(workflow.toJSON());
  });

  return workflows;
}

// Exportar instancia para uso directo
export { AGENT_REGISTRY };

export default {
  getDelegationEngine,
  processCEOResponseAndExecute,
  executeManualWorkflow,
  delegateToAgent,
  subscribeToWorkflowEvents,
  getActiveTasks,
  getActiveWorkflows,
  AGENT_REGISTRY
};
