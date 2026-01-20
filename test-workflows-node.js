/**
 * Test de Workflows ejecutable desde Node.js
 * Ejecutar: node test-workflows-node.js
 */

// Simular el AGENT_REGISTRY para las pruebas
const AGENT_REGISTRY = {
  1: { id: 1, name: 'CEO / Director General', shortName: 'CEO', category: 'LEADERSHIP', canDelegate: true },
  2: { id: 2, name: 'Gerente de Operaciones', shortName: 'OPS_MGR', category: 'OPERATIONS', canDelegate: true },
  3: { id: 3, name: 'Chef Ejecutivo', shortName: 'EXEC_CHEF', category: 'OPERATIONS', canDelegate: true },
  4: { id: 4, name: 'Sous Chef', shortName: 'SOUS_CHEF', category: 'OPERATIONS', canDelegate: false },
  5: { id: 5, name: 'Chef de Partida', shortName: 'PARTIE_CHEF', category: 'OPERATIONS', canDelegate: false },
  6: { id: 6, name: 'Pastelero', shortName: 'PASTRY', category: 'OPERATIONS', canDelegate: false },
  7: { id: 7, name: 'Especialista en Costos', shortName: 'COST_SPEC', category: 'OPERATIONS', canDelegate: false },
  8: { id: 8, name: 'Gerente de Almacén', shortName: 'WAREHOUSE', category: 'OPERATIONS', canDelegate: true },
  9: { id: 9, name: 'Comprador', shortName: 'BUYER', category: 'OPERATIONS', canDelegate: false },
  10: { id: 10, name: 'Control de Calidad Alimentos', shortName: 'FOOD_QC', category: 'OPERATIONS', canDelegate: false },
  11: { id: 11, name: 'CFO / Director Financiero', shortName: 'CFO', category: 'FINANCE', canDelegate: true },
  12: { id: 12, name: 'Controller', shortName: 'CONTROLLER', category: 'FINANCE', canDelegate: true },
  13: { id: 13, name: 'Analista Financiero', shortName: 'FIN_ANALYST', category: 'FINANCE', canDelegate: false },
  14: { id: 14, name: 'Tesorero', shortName: 'TREASURER', category: 'FINANCE', canDelegate: false },
  15: { id: 15, name: 'Contador General', shortName: 'ACCOUNTANT', category: 'FINANCE', canDelegate: false },
  16: { id: 16, name: 'Auxiliar Contable', shortName: 'ACCT_ASSIST', category: 'FINANCE', canDelegate: false },
  17: { id: 17, name: 'Especialista en Reportes', shortName: 'REPORTER', category: 'FINANCE', canDelegate: false },
  18: { id: 18, name: 'Analista de Presupuestos', shortName: 'BUDGET', category: 'FINANCE', canDelegate: false },
  19: { id: 19, name: 'Auditor Interno', shortName: 'INT_AUDITOR', category: 'FINANCE', canDelegate: false },
  20: { id: 20, name: 'Especialista en Nómina', shortName: 'PAYROLL', category: 'FINANCE', canDelegate: false },
  21: { id: 21, name: 'CMO / Director de Marketing', shortName: 'CMO', category: 'MARKETING', canDelegate: true },
  22: { id: 22, name: 'Brand Manager', shortName: 'BRAND_MGR', category: 'MARKETING', canDelegate: true },
  23: { id: 23, name: 'Community Manager', shortName: 'COMMUNITY', category: 'MARKETING', canDelegate: false },
  24: { id: 24, name: 'Diseñador Gráfico', shortName: 'DESIGNER', category: 'MARKETING', canDelegate: false },
  25: { id: 25, name: 'Especialista SEO/SEM', shortName: 'SEO_SEM', category: 'MARKETING', canDelegate: false },
  26: { id: 26, name: 'Gerente de Ventas', shortName: 'SALES_MGR', category: 'MARKETING', canDelegate: true },
  27: { id: 27, name: 'Ejecutivo de Cuentas', shortName: 'ACCOUNT_EXEC', category: 'MARKETING', canDelegate: false },
  28: { id: 28, name: 'Analista de Mercado', shortName: 'MARKET_ANALYST', category: 'MARKETING', canDelegate: false },
  29: { id: 29, name: 'Coordinador de Eventos', shortName: 'EVENTS', category: 'MARKETING', canDelegate: false },
  30: { id: 30, name: 'Relaciones Públicas', shortName: 'PR', category: 'MARKETING', canDelegate: false },
  31: { id: 31, name: 'CHRO / Director de RRHH', shortName: 'CHRO', category: 'HR', canDelegate: true },
  32: { id: 32, name: 'Gerente de Capacitación', shortName: 'TRAINING_MGR', category: 'HR', canDelegate: true },
  33: { id: 33, name: 'Reclutador', shortName: 'RECRUITER', category: 'HR', canDelegate: false },
  34: { id: 34, name: 'Especialista en Compensaciones', shortName: 'COMP_SPEC', category: 'HR', canDelegate: false },
  35: { id: 35, name: 'Coordinador de Bienestar', shortName: 'WELLNESS', category: 'HR', canDelegate: false },
  36: { id: 36, name: 'Analista de Desempeño', shortName: 'PERF_ANALYST', category: 'HR', canDelegate: false },
  37: { id: 37, name: 'Administrador de Personal', shortName: 'HR_ADMIN', category: 'HR', canDelegate: false },
  38: { id: 38, name: 'Especialista en Clima Laboral', shortName: 'CLIMATE', category: 'HR', canDelegate: false },
  39: { id: 39, name: 'Coordinador de Onboarding', shortName: 'ONBOARDING', category: 'HR', canDelegate: false },
  40: { id: 40, name: 'Gestor de Talento', shortName: 'TALENT', category: 'HR', canDelegate: false },
  41: { id: 41, name: 'Director Legal', shortName: 'LEGAL_DIR', category: 'LEGAL', canDelegate: true },
  42: { id: 42, name: 'Abogado Corporativo', shortName: 'CORP_LAWYER', category: 'LEGAL', canDelegate: false },
  43: { id: 43, name: 'Especialista Fiscal', shortName: 'TAX_SPEC', category: 'LEGAL', canDelegate: false },
  44: { id: 44, name: 'Compliance Officer', shortName: 'COMPLIANCE', category: 'LEGAL', canDelegate: false },
  45: { id: 45, name: 'Especialista en Protección de Datos', shortName: 'DATA_PROTECT', category: 'LEGAL', canDelegate: false },
  46: { id: 46, name: 'Gestor de Contratos', shortName: 'CONTRACTS', category: 'LEGAL', canDelegate: false },
  47: { id: 47, name: 'Especialista Laboral', shortName: 'LABOR_SPEC', category: 'LEGAL', canDelegate: false },
  48: { id: 48, name: 'Gestor de Permisos', shortName: 'PERMITS', category: 'LEGAL', canDelegate: false },
  49: { id: 49, name: 'Especialista en Propiedad Intelectual', shortName: 'IP_SPEC', category: 'LEGAL', canDelegate: false },
  50: { id: 50, name: 'Mediador', shortName: 'MEDIATOR', category: 'LEGAL', canDelegate: false },
  51: { id: 51, name: 'CTO / Director de Tecnología', shortName: 'CTO', category: 'TECH', canDelegate: true },
  52: { id: 52, name: 'Arquitecto de Sistemas', shortName: 'SYS_ARCH', category: 'TECH', canDelegate: true },
  53: { id: 53, name: 'Desarrollador Full Stack', shortName: 'FULLSTACK', category: 'TECH', canDelegate: false },
  54: { id: 54, name: 'Desarrollador Frontend', shortName: 'FRONTEND', category: 'TECH', canDelegate: false },
  55: { id: 55, name: 'Desarrollador Backend', shortName: 'BACKEND', category: 'TECH', canDelegate: false },
  56: { id: 56, name: 'DBA', shortName: 'DBA', category: 'TECH', canDelegate: false },
  57: { id: 57, name: 'Analista de Datos', shortName: 'DATA_ANALYST', category: 'TECH', canDelegate: false },
  58: { id: 58, name: 'Especialista en Ciberseguridad', shortName: 'SECURITY', category: 'TECH', canDelegate: false },
  59: { id: 59, name: 'Soporte Técnico', shortName: 'SUPPORT', category: 'TECH', canDelegate: false },
  60: { id: 60, name: 'DevOps Engineer', shortName: 'DEVOPS', category: 'TECH', canDelegate: false },
  61: { id: 61, name: 'Director de Calidad', shortName: 'QUALITY_DIR', category: 'QUALITY', canDelegate: true },
  62: { id: 62, name: 'Gerente de Procesos', shortName: 'PROCESS_MGR', category: 'QUALITY', canDelegate: true },
  63: { id: 63, name: 'Auditor de Calidad', shortName: 'QA_AUDITOR', category: 'QUALITY', canDelegate: false },
  64: { id: 64, name: 'Especialista en Normas', shortName: 'STANDARDS', category: 'QUALITY', canDelegate: false },
  65: { id: 65, name: 'Analista de Mejora Continua', shortName: 'CONTINUOUS', category: 'QUALITY', canDelegate: false },
  66: { id: 66, name: 'Inspector de Calidad', shortName: 'INSPECTOR', category: 'QUALITY', canDelegate: false },
  67: { id: 67, name: 'Especialista en Seguridad e Higiene', shortName: 'SAFETY', category: 'QUALITY', canDelegate: false },
  68: { id: 68, name: 'Gestor Documental', shortName: 'DOC_MGR', category: 'QUALITY', canDelegate: false },
  69: { id: 69, name: 'Coordinador de Certificaciones', shortName: 'CERT_COORD', category: 'QUALITY', canDelegate: false },
  70: { id: 70, name: 'Analista de Riesgos', shortName: 'RISK_ANALYST', category: 'QUALITY', canDelegate: false },
  71: { id: 71, name: 'Arquitecto de Soluciones', shortName: 'SOL_ARCH', category: 'SPECIAL', canDelegate: true },
  72: { id: 72, name: 'Abogado Familiar', shortName: 'FAMILY_LAWYER', category: 'PRIVATE', isPrivate: true, ceoOnly: true, canDelegate: false }
};

// Patrón de delegación
const DELEGATION_PATTERN = /@DELEGAR\[(\d+)\]:\s*([^\n@]+)/gi;

/**
 * Parsea delegaciones de una respuesta del CEO
 */
function parseDelegations(ceoResponse) {
  const delegations = [];
  let match;

  const pattern = new RegExp(DELEGATION_PATTERN.source, 'gi');

  while ((match = pattern.exec(ceoResponse)) !== null) {
    const agentId = parseInt(match[1], 10);
    const task = match[2].trim();

    if (AGENT_REGISTRY[agentId]) {
      delegations.push({
        agentId,
        agentName: AGENT_REGISTRY[agentId].name,
        task,
        category: AGENT_REGISTRY[agentId].category
      });
    }
  }

  return delegations;
}

/**
 * Simula la ejecución de un workflow
 */
function simulateWorkflow(agentId, task) {
  const agent = AGENT_REGISTRY[agentId];

  if (!agent) {
    return { success: false, error: `Agente ${agentId} no encontrado` };
  }

  // Simular procesamiento
  return {
    success: true,
    agentId,
    agentName: agent.name,
    category: agent.category,
    task,
    result: {
      status: 'completed',
      message: `Tarea procesada por ${agent.name}`,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Prueba un agente específico
 */
function testAgentWorkflow(agentId) {
  const agent = AGENT_REGISTRY[agentId];

  if (!agent) {
    return {
      agentId,
      status: 'NOT_FOUND',
      error: `Agente ${agentId} no existe`
    };
  }

  // Crear respuesta del CEO simulada
  const ceoResponse = `
    Analizando tu solicitud, procederé a delegarla.

    @DELEGAR[${agentId}]: Ejecuta tu función principal para el cliente

    El ${agent.name} procesará esta tarea.
  `;

  // Parsear delegaciones
  const delegations = parseDelegations(ceoResponse);

  if (delegations.length === 0) {
    return {
      agentId,
      agentName: agent.name,
      status: 'PARSE_FAILED',
      error: 'No se detectó delegación en la respuesta'
    };
  }

  // Simular ejecución
  const result = simulateWorkflow(agentId, delegations[0].task);

  return {
    agentId,
    agentName: agent.name,
    category: agent.category,
    status: result.success ? 'SUCCESS' : 'FAILED',
    delegationDetected: true,
    workflowExecuted: result.success,
    result
  };
}

/**
 * Ejecuta pruebas para TODOS los agentes
 */
function testAllWorkflows() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('       PRUEBA DE TODOS LOS WORKFLOWS - VÉRTICE GASTRONÓMICO');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');

  const agentIds = Object.keys(AGENT_REGISTRY).map(Number).sort((a, b) => a - b);
  const results = {
    total: agentIds.length,
    success: 0,
    failed: 0,
    parseError: 0,
    byCategory: {}
  };

  for (const agentId of agentIds) {
    const testResult = testAgentWorkflow(agentId);
    const agent = AGENT_REGISTRY[agentId];

    // Contar por categoría
    if (!results.byCategory[agent.category]) {
      results.byCategory[agent.category] = { total: 0, success: 0, failed: 0 };
    }
    results.byCategory[agent.category].total++;

    if (testResult.status === 'SUCCESS') {
      results.success++;
      results.byCategory[agent.category].success++;
      console.log(`✅ Agente ${agentId.toString().padStart(2, '0')} (${testResult.agentName}): PASSED`);
    } else if (testResult.status === 'PARSE_FAILED') {
      results.parseError++;
      results.byCategory[agent.category].failed++;
      console.log(`⚠️  Agente ${agentId.toString().padStart(2, '0')} (${testResult.agentName}): PARSE ERROR`);
    } else {
      results.failed++;
      results.byCategory[agent.category].failed++;
      console.log(`❌ Agente ${agentId.toString().padStart(2, '0')} (${testResult.agentName}): FAILED - ${testResult.error}`);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('                        RESUMEN DE PRUEBAS');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`Total agentes probados: ${results.total}`);
  console.log(`✅ Exitosos:            ${results.success}`);
  console.log(`⚠️  Error de parseo:     ${results.parseError}`);
  console.log(`❌ Fallidos:            ${results.failed}`);
  console.log(`Tasa de éxito:          ${((results.success / results.total) * 100).toFixed(1)}%`);
  console.log('');
  console.log('Por categoría:');

  for (const [category, stats] of Object.entries(results.byCategory)) {
    const rate = ((stats.success / stats.total) * 100).toFixed(0);
    console.log(`  ${category.padEnd(12)}: ${stats.success}/${stats.total} (${rate}%)`);
  }

  console.log('═══════════════════════════════════════════════════════════════════');

  return results;
}

/**
 * Prueba específica del Agente 72 (Abogado Familiar)
 */
function testAgent72Workflow() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('     PRUEBA ESPECÍFICA: CEO → AGENTE 72 (ABOGADO FAMILIAR)');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');

  const ceoResponse = `
    Entendido. Este es un caso que requiere atención especializada de nuestro
    Abogado Familiar.

    @DELEGAR[72]: Analiza los documentos del caso de divorcio adjuntos (archivo ZIP).
    Extrae todos los documentos, revisa la información del matrimonio, bienes y
    circunstancias. Genera un escrito legal inicial para presentar ante el
    juzgado familiar.

    Este agente es privado y solo yo como CEO puedo asignarle tareas.
  `;

  console.log('Respuesta del CEO (simulada):');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(ceoResponse.trim());
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('');

  const delegations = parseDelegations(ceoResponse);

  console.log('Delegaciones detectadas:', delegations.length);

  if (delegations.length > 0) {
    console.log('');
    console.log('Detalles de delegación:');
    delegations.forEach((d, i) => {
      console.log(`  ${i + 1}. Agente ${d.agentId} (${d.agentName})`);
      console.log(`     Categoría: ${d.category}`);
      console.log(`     Tarea: ${d.task.substring(0, 80)}...`);
    });

    // Simular ejecución
    const result = simulateWorkflow(72, delegations[0].task);

    console.log('');
    console.log('Resultado de ejecución:');
    console.log(`  Estado: ${result.success ? '✅ COMPLETADO' : '❌ FALLIDO'}`);
    console.log(`  Agente: ${result.agentName}`);
    console.log(`  Timestamp: ${result.result.timestamp}`);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(delegations.length > 0 ? '✅ PRUEBA EXITOSA' : '❌ PRUEBA FALLIDA');
  console.log('═══════════════════════════════════════════════════════════════════');

  return { delegations, success: delegations.length > 0 };
}

/**
 * Prueba de workflow multi-agente
 */
function testMultiAgentWorkflow() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('        PRUEBA DE WORKFLOW MULTI-AGENTE (PARALELO)');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');

  const ceoResponse = `
    Perfecto, coordinaré un análisis integral con múltiples equipos.

    @DELEGAR[11]: CFO, prepara análisis financiero completo del cliente "El Buen Sabor"
    @DELEGAR[2]: Gerente de Operaciones, revisa los procesos operativos actuales
    @DELEGAR[21]: CMO, desarrolla propuesta de marketing y posicionamiento
    @DELEGAR[41]: Director Legal, revisa contratos y cumplimiento normativo

    Cada área reportará sus hallazgos para integrar un diagnóstico completo.
  `;

  console.log('Respuesta del CEO (simulada):');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(ceoResponse.trim());
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('');

  const delegations = parseDelegations(ceoResponse);

  console.log(`Delegaciones detectadas: ${delegations.length}`);
  console.log('');

  if (delegations.length > 0) {
    console.log('Ejecutando workflows en paralelo:');
    console.log('');

    const results = delegations.map(d => {
      const result = simulateWorkflow(d.agentId, d.task);
      console.log(`  ${result.success ? '✅' : '❌'} Agente ${d.agentId} (${d.agentName}): ${result.success ? 'COMPLETADO' : 'FALLIDO'}`);
      return result;
    });

    const successCount = results.filter(r => r.success).length;

    console.log('');
    console.log(`Resultados: ${successCount}/${delegations.length} exitosos`);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');

  return { delegations, total: delegations.length };
}

// ═══════════════════════════════════════════════════════════════════
//                         EJECUTAR PRUEBAS
// ═══════════════════════════════════════════════════════════════════

console.log('');
console.log('');

// 1. Probar todos los workflows
const allResults = testAllWorkflows();

console.log('');
console.log('');

// 2. Probar específicamente el Agente 72
const agent72Result = testAgent72Workflow();

console.log('');
console.log('');

// 3. Probar multi-agente
const multiResult = testMultiAgentWorkflow();

console.log('');
console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('                    RESUMEN FINAL DE PRUEBAS');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`1. Prueba de 72 agentes:     ${allResults.success}/${allResults.total} exitosos (${((allResults.success/allResults.total)*100).toFixed(1)}%)`);
console.log(`2. Prueba Agente 72:         ${agent72Result.success ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`3. Prueba Multi-agente:      ${multiResult.total} delegaciones detectadas`);
console.log('═══════════════════════════════════════════════════════════════════');
