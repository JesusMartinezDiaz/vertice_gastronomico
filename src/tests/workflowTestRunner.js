/**
 * WorkflowTestRunner - Script para probar TODOS los workflows de delegación
 *
 * Este script verifica que el sistema de delegación CEO → Agentes funcione
 * correctamente para todos los 72 agentes del sistema.
 *
 * USO:
 * 1. Abrir la consola del navegador en http://localhost:5173
 * 2. Copiar y pegar este código
 * 3. Ejecutar: await window.testAllWorkflows()
 */

import { getDelegationEngine, processCEOResponseAndExecute, AGENT_REGISTRY } from '../services/workflowExecutor';

/**
 * Mensajes de prueba para cada categoría de agente
 */
const TEST_MESSAGES_BY_CATEGORY = {
  LEADERSHIP: 'Necesito un análisis estratégico del negocio',
  OPERATIONS: 'Revisa las operaciones del restaurante cliente y optimiza procesos',
  FINANCE: 'Genera un reporte financiero y análisis de rentabilidad',
  MARKETING: 'Desarrolla una estrategia de marketing digital para el cliente',
  HR: 'Diseña un plan de capacitación para el personal del restaurante',
  LEGAL: 'Revisa los contratos y asegura el cumplimiento normativo',
  TECH: 'Evalúa la infraestructura tecnológica y propón mejoras',
  QUALITY: 'Realiza una auditoría de calidad del establecimiento',
  SPECIAL: 'Necesito tu análisis especializado',
  PRIVATE: 'Analiza los documentos adjuntos y genera un escrito legal'
};

/**
 * Instrucciones específicas para probar cada agente
 */
const AGENT_TEST_INSTRUCTIONS = {
  // DIRECTOR GENERAL
  1: 'Haz un análisis general del estado de la consultoría y prioriza las tareas pendientes',

  // OPERACIONES (2-10)
  2: 'Delego al Agente 2: Revisa los procesos operativos del cliente "Restaurante Sol"',
  3: 'Delego al Agente 3: Diseña un menú de temporada para nuestro cliente',
  7: 'Delego al Agente 7: Calcula el food cost del menú actual del cliente',
  9: 'Delego al Agente 9: Optimiza la cadena de suministros del restaurante cliente',

  // FINANZAS (11-20)
  11: 'Delego al Agente 11: Prepara un análisis financiero completo',
  15: 'Delego al Agente 15: Revisa la contabilidad mensual del cliente',
  17: 'Delego al Agente 17: Genera reportes de control financiero',
  18: 'Delego al Agente 18: Analiza el flujo de caja y proyecciones',

  // MARKETING Y VENTAS (21-30)
  21: 'Delego al Agente 21: Desarrolla estrategia de marketing integral',
  23: 'Delego al Agente 23: Crea contenido para redes sociales del cliente',
  26: 'Delego al Agente 26: Diseña plan de ventas para el siguiente trimestre',
  27: 'Delego al Agente 27: Configura y optimiza el CRM del cliente',

  // CAPITAL HUMANO (31-40)
  31: 'Delego al Agente 31: Diseña política de recursos humanos',
  33: 'Delego al Agente 33: Inicia proceso de reclutamiento para chef',
  35: 'Delego al Agente 35: Prepara programa de capacitación en servicio',
  37: 'Delego al Agente 37: Revisa la nómina y prestaciones',

  // LEGAL Y CUMPLIMIENTO (41-50)
  41: 'Delego al Agente 41: Revisa contratos con proveedores',
  43: 'Delego al Agente 43: Prepara declaración fiscal del cliente',
  45: 'Delego al Agente 45: Audita el manejo de datos personales',
  47: 'Delego al Agente 47: Revisa contratos laborales del personal',

  // TECNOLOGÍA (51-60)
  51: 'Delego al Agente 51: Evalúa infraestructura tecnológica del restaurante',
  53: 'Delego al Agente 53: Desarrolla módulo de inventario',
  55: 'Delego al Agente 55: Configura sistema POS del cliente',
  57: 'Delego al Agente 57: Analiza datos de ventas y genera insights',

  // CALIDAD Y PROCESOS (61-70)
  61: 'Delego al Agente 61: Implementa sistema de gestión de calidad',
  63: 'Delego al Agente 63: Realiza auditoría interna del restaurante',
  65: 'Delego al Agente 65: Propón mejoras en procesos operativos',
  67: 'Delego al Agente 67: Revisa protocolos de seguridad e higiene',

  // ESPECIALES
  71: 'Delego al Agente 71: Diseña la arquitectura del nuevo sistema',
  72: 'Delego al Agente 72: Analiza los documentos del caso de divorcio adjuntos y genera el escrito legal correspondiente'
};

/**
 * Ejecuta prueba de un solo agente
 */
export async function testAgentWorkflow(agentId) {
  const agent = AGENT_REGISTRY[agentId];
  if (!agent) {
    return {
      agentId,
      status: 'NOT_FOUND',
      error: `Agente ${agentId} no existe en el registro`
    };
  }

  const instruction = AGENT_TEST_INSTRUCTIONS[agentId] ||
    `Delego al Agente ${agentId}: ${TEST_MESSAGES_BY_CATEGORY[agent.category] || 'Ejecuta tu función principal'}`;

  console.log(`[TEST] Probando Agente ${agentId}: ${agent.name}`);

  try {
    // Simular respuesta del CEO con delegación
    const ceoResponse = `
      He analizado tu solicitud y procederé a delegarla.

      @DELEGAR[${agentId}]: ${instruction.replace(`Delego al Agente ${agentId}: `, '')}

      El ${agent.name} procesará esta tarea.
    `;

    const result = await processCEOResponseAndExecute(ceoResponse, instruction, {
      attachments: agent.category === 'PRIVATE' ? [{ name: 'test.zip', type: 'application/zip' }] : []
    });

    return {
      agentId,
      agentName: agent.name,
      category: agent.category,
      status: result.delegated ? 'SUCCESS' : 'NO_DELEGATION',
      delegated: result.delegated,
      tasksCreated: result.tasks?.length || 0,
      executedTasks: result.executedTasks?.length || 0,
      result
    };
  } catch (error) {
    return {
      agentId,
      agentName: agent.name,
      category: agent.category,
      status: 'ERROR',
      error: error.message
    };
  }
}

/**
 * Ejecuta pruebas para TODOS los agentes
 */
export async function testAllWorkflows() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     PRUEBA DE TODOS LOS WORKFLOWS - VÉRTICE GASTRONÓMICO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const agentIds = Object.keys(AGENT_REGISTRY).map(Number).sort((a, b) => a - b);
  const results = {
    total: agentIds.length,
    success: 0,
    failed: 0,
    noDelega: 0,
    details: []
  };

  for (const agentId of agentIds) {
    const testResult = await testAgentWorkflow(agentId);
    results.details.push(testResult);

    if (testResult.status === 'SUCCESS') {
      results.success++;
      console.log(`✅ Agente ${agentId} (${testResult.agentName}): PASSED`);
    } else if (testResult.status === 'NO_DELEGATION') {
      results.noDelega++;
      console.log(`⚠️ Agente ${agentId} (${testResult.agentName}): No delegó`);
    } else {
      results.failed++;
      console.log(`❌ Agente ${agentId} (${testResult.agentName}): FAILED - ${testResult.error}`);
    }

    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                      RESUMEN DE PRUEBAS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total agentes probados: ${results.total}`);
  console.log(`✅ Exitosos: ${results.success}`);
  console.log(`⚠️ Sin delegación: ${results.noDelega}`);
  console.log(`❌ Fallidos: ${results.failed}`);
  console.log(`Tasa de éxito: ${((results.success / results.total) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════════');

  return results;
}

/**
 * Prueba específica del flujo CEO → Agente 72 (Abogado Familiar)
 */
export async function testAgent72Workflow() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   PRUEBA ESPECÍFICA: CEO → AGENTE 72 (ABOGADO FAMILIAR)');
  console.log('═══════════════════════════════════════════════════════════');

  const instruction = `
    Necesito que revises los documentos del caso de divorcio que te adjunto.
    Extrae la información relevante del ZIP, analiza los documentos legales
    y genera un escrito inicial para presentar ante el juzgado familiar.
  `;

  const ceoResponse = `
    Entendido. Este es un caso que requiere atención especializada de nuestro
    Abogado Familiar.

    @DELEGAR[72]: Analiza los documentos del caso de divorcio adjuntos (archivo ZIP).
    Extrae todos los documentos, revisa la información del matrimonio, bienes y
    circunstancias. Genera un escrito legal inicial para presentar ante el
    juzgado familiar.

    Este agente es privado y solo yo como CEO puedo asignarle tareas.
  `;

  try {
    const result = await processCEOResponseAndExecute(ceoResponse, instruction, {
      attachments: [
        { name: 'expediente_divorcio.zip', type: 'application/zip', size: 1024000 }
      ]
    });

    console.log('');
    console.log('RESULTADO:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`Delegación detectada: ${result.delegated ? 'SÍ' : 'NO'}`);
    console.log(`Tareas creadas: ${result.tasks?.length || 0}`);
    console.log(`Tareas ejecutadas: ${result.executedTasks?.length || 0}`);

    if (result.executedTasks?.length > 0) {
      const taskResult = result.executedTasks[0];
      console.log('');
      console.log('DETALLES DE LA TAREA:');
      console.log(`  Estado: ${taskResult.status}`);
      console.log(`  Agente: ${taskResult.agentId}`);

      if (taskResult.result) {
        console.log('');
        console.log('RESULTADO DEL ANÁLISIS:');
        console.log(`  Tipo de asunto: ${taskResult.result.analysis?.tipoAsunto || 'N/A'}`);
        console.log(`  Pasos completados: ${taskResult.result.steps?.length || 0}`);
        console.log(`  Documentos generados: ${taskResult.result.outputDocument ? 1 : 0}`);

        if (taskResult.result.analysis?.recomendaciones) {
          console.log('');
          console.log('RECOMENDACIONES:');
          taskResult.result.analysis.recomendaciones.forEach((rec, i) => {
            console.log(`  ${i + 1}. ${rec}`);
          });
        }
      }
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log(result.delegated ? '✅ PRUEBA EXITOSA' : '❌ PRUEBA FALLIDA');
    console.log('═══════════════════════════════════════════════════════════');

    return result;
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    return { error: error.message };
  }
}

/**
 * Prueba de workflow multi-agente
 */
export async function testMultiAgentWorkflow() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('      PRUEBA DE WORKFLOW MULTI-AGENTE (PARALELO)');
  console.log('═══════════════════════════════════════════════════════════');

  const instruction = `
    Necesito un análisis completo del restaurante cliente "El Buen Sabor".
    Incluye: análisis financiero, revisión operativa y propuesta de marketing.
  `;

  const ceoResponse = `
    Perfecto, coordinaré un análisis integral con múltiples equipos.

    @DELEGAR[11]: CFO, prepara análisis financiero completo del cliente "El Buen Sabor"
    @DELEGAR[2]: Gerente de Operaciones, revisa los procesos operativos actuales
    @DELEGAR[21]: CMO, desarrolla propuesta de marketing y posicionamiento

    Cada área reportará sus hallazgos para integrar un diagnóstico completo.
  `;

  try {
    const result = await processCEOResponseAndExecute(ceoResponse, instruction, {});

    console.log('');
    console.log('RESULTADO:');
    console.log(`Delegaciones detectadas: ${result.delegated ? 'SÍ' : 'NO'}`);
    console.log(`Total tareas creadas: ${result.tasks?.length || 0}`);
    console.log(`Tareas ejecutadas: ${result.executedTasks?.length || 0}`);

    if (result.tasks) {
      console.log('');
      console.log('TAREAS CREADAS:');
      result.tasks.forEach((task, i) => {
        console.log(`  ${i + 1}. Agente ${task.toAgentId}: ${AGENT_REGISTRY[task.toAgentId]?.name}`);
      });
    }

    console.log('═══════════════════════════════════════════════════════════');
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    return { error: error.message };
  }
}

// Exportar funciones para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.testAllWorkflows = testAllWorkflows;
  window.testAgent72Workflow = testAgent72Workflow;
  window.testMultiAgentWorkflow = testMultiAgentWorkflow;
  window.testAgentWorkflow = testAgentWorkflow;

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('    WORKFLOW TEST RUNNER - VÉRTICE GASTRONÓMICO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('Comandos disponibles:');
  console.log('  await testAllWorkflows()       - Prueba TODOS los agentes');
  console.log('  await testAgent72Workflow()    - Prueba CEO → Abogado Familiar');
  console.log('  await testMultiAgentWorkflow() - Prueba delegación múltiple');
  console.log('  await testAgentWorkflow(N)     - Prueba agente específico');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
}

export default {
  testAllWorkflows,
  testAgent72Workflow,
  testMultiAgentWorkflow,
  testAgentWorkflow
};
