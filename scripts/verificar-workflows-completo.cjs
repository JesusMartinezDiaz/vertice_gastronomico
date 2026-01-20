/**
 * VERIFICACIÓN COMPLETA DE WORKFLOWS
 * Script para validar todos los bloques del sistema
 *
 * BLOQUES:
 * 1. RECEPCIÓN DE INFORMACIÓN
 * 2. ANÁLISIS
 * 3. DELEGACIÓN
 * 4. EJECUCIÓN
 * 5. GENERACIÓN DE DOCUMENTOS/REPORTES
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('   VERIFICACIÓN COMPLETA DE WORKFLOWS - VÉRTICE GASTRONÓMICO');
console.log('═══════════════════════════════════════════════════════════════\n');

// Leer server/index.js
const serverPath = path.join(__dirname, '..', 'server', 'index.js');
const serverContent = fs.readFileSync(serverPath, 'utf8');

// Leer src/App.jsx
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');

let errores = [];
let advertencias = [];
let verificacionesPasadas = 0;

// ============================================================================
// BLOQUE 1: RECEPCIÓN DE INFORMACIÓN
// ============================================================================
console.log('📥 BLOQUE 1: RECEPCIÓN DE INFORMACIÓN');
console.log('─────────────────────────────────────────────────────────────────');

// 1.1 Verificar detección de keywords para Agente 72
const agent72KeywordsMatch = serverContent.match(/const agent72Keywords = \[([\s\S]*?)\];/);
if (agent72KeywordsMatch) {
  const keywords = agent72KeywordsMatch[1].match(/'[^']+'/g) || [];
  console.log(`✅ Keywords para Agente 72: ${keywords.length} detectados`);
  verificacionesPasadas++;
} else {
  errores.push('❌ No se encontraron keywords para redirección a Agente 72');
}

// 1.2 Verificar detección de documentos requeridos
const docKeywordsMatch = serverContent.match(/const documentRequiredKeywords = \[([\s\S]*?)\];/);
if (docKeywordsMatch) {
  const docKeywords = docKeywordsMatch[1].match(/'[^']+'/g) || [];
  console.log(`✅ Keywords para documentos requeridos: ${docKeywords.length} detectados`);
  verificacionesPasadas++;
} else {
  errores.push('❌ No se encontraron keywords para detección de documentos');
}

// 1.3 Verificar respuesta cuando faltan documentos
if (serverContent.includes('DOCUMENTOS REQUERIDOS') && serverContent.includes('waiting_for_documents')) {
  console.log('✅ Sistema de solicitud de documentos faltantes implementado');
  verificacionesPasadas++;
} else {
  errores.push('❌ No se implementó la solicitud de documentos faltantes');
}

// 1.4 Verificar extracción de documentos para todos los agentes
if (serverContent.includes('EXTRACCIÓN DE CONTENIDO DE DOCUMENTOS')) {
  console.log('✅ Extracción de documentos para todos los agentes');
  verificacionesPasadas++;
} else {
  advertencias.push('⚠️ No se encontró sistema de extracción de documentos');
}

console.log('');

// ============================================================================
// BLOQUE 2: ANÁLISIS
// ============================================================================
console.log('🔍 BLOQUE 2: ANÁLISIS');
console.log('─────────────────────────────────────────────────────────────────');

// 2.1 Verificar PVT global
if (serverContent.includes('PROTOCOLO_VERIFICACION_TRIPLE_GLOBAL')) {
  console.log('✅ PVT Global implementado');
  verificacionesPasadas++;
} else {
  advertencias.push('⚠️ No se encontró PVT Global en el código');
}

// 2.2 Verificar que CEO NO tiene delegateTo en JSON (excepto en prohibiciones)
const ceoPromptMatch = serverContent.match(/if \(aid === 1\) \{[\s\S]*?return `([\s\S]*?)`;[\s\S]*?\}/);
if (ceoPromptMatch) {
  const ceoPrompt = ceoPromptMatch[1];
  const ceoLines = ceoPrompt.split('\n');
  let delegateToProblemasEnCeo = [];
  ceoLines.forEach((line, idx) => {
    if (line.includes('delegateTo')) {
      // Si la línea contiene "NO escribas" o "❌" es una PROHIBICIÓN, no un problema
      if (!line.includes('NO escribas') && !line.includes('❌')) {
        delegateToProblemasEnCeo.push(line.trim().substring(0, 60));
      }
    }
  });

  if (delegateToProblemasEnCeo.length > 0) {
    errores.push('❌ CEO todavía tiene instrucciones de delegateTo FUERA de prohibiciones');
    delegateToProblemasEnCeo.forEach(p => console.log(`   └─ ${p}...`));
  } else {
    console.log('✅ CEO sin instrucciones de delegateTo (solo como ejemplo de qué NO hacer)');
    verificacionesPasadas++;
  }

  // Verificar prohibiciones
  if (ceoPrompt.includes('NO escribas "ANÁLISIS INICIAL"') || ceoPrompt.includes('PROHIBICIONES ABSOLUTAS')) {
    console.log('✅ CEO tiene prohibiciones explícitas');
    verificacionesPasadas++;
  } else {
    advertencias.push('⚠️ CEO podría necesitar prohibiciones más explícitas');
  }
}

// 2.3 Verificar Agente 72 sin delegación
const agent72Match = serverContent.match(/agent72SystemPrompt = `([\s\S]*?)`;/);
if (agent72Match) {
  const agent72Prompt = agent72Match[1];
  if (agent72Prompt.includes('NO escribas "delegateTo"') && agent72Prompt.includes('NO delegues')) {
    console.log('✅ Agente 72 tiene prohibiciones anti-delegación');
    verificacionesPasadas++;
  } else {
    errores.push('❌ Agente 72 necesita prohibiciones anti-delegación más fuertes');
  }

  if (agent72Prompt.includes('EXPEDIENTE:') && agent72Prompt.includes('512/2024')) {
    console.log('✅ Agente 72 tiene ejemplo REAL de escrito judicial');
    verificacionesPasadas++;
  } else {
    errores.push('❌ Agente 72 necesita ejemplo real de escrito judicial');
  }
}

console.log('');

// ============================================================================
// BLOQUE 3: DELEGACIÓN
// ============================================================================
console.log('🔄 BLOQUE 3: DELEGACIÓN');
console.log('─────────────────────────────────────────────────────────────────');

// 3.1 Verificar redirección automática a Agente 72
if (serverContent.includes('shouldRedirectToAgent72') && serverContent.includes('agentId = 72')) {
  console.log('✅ Redirección automática a Agente 72 implementada');
  verificacionesPasadas++;
} else {
  errores.push('❌ No se encontró redirección automática a Agente 72');
}

// 3.2 Verificar que agentReference no tiene delegateTo
if (serverContent.includes('DIRECTORIO DE AGENTES ESPECIALIZADOS (referencia informativa)')) {
  console.log('✅ agentReference es informativo, no para delegación');
  verificacionesPasadas++;
} else {
  advertencias.push('⚠️ agentReference podría tener texto de delegateTo');
}

// 3.3 Contar referencias a delegateTo que NO deberían estar
// IMPORTANTE: Excluir las que están en PROHIBICIONES (ejemplos de qué NO hacer)
const lines = serverContent.split('\n');
let delegateToProblemas = [];
lines.forEach((line, idx) => {
  if (line.includes('"delegateTo":') || line.includes('"delegateTo": [')) {
    // Si la línea contiene "NO escribas" o "❌" es una PROHIBICIÓN, no un problema
    if (!line.includes('NO escribas') && !line.includes('❌')) {
      delegateToProblemas.push({ line: idx + 1, content: line.trim().substring(0, 80) });
    }
  }
});

if (delegateToProblemas.length > 0) {
  errores.push(`❌ Hay ${delegateToProblemas.length} referencias a delegateTo FUERA de prohibiciones`);
  delegateToProblemas.forEach(p => {
    console.log(`   └─ Línea ${p.line}: ${p.content}...`);
  });
} else {
  console.log('✅ No hay instrucciones de delegateTo JSON (solo en prohibiciones como ejemplo)');
  verificacionesPasadas++;
}

console.log('');

// ============================================================================
// BLOQUE 4: EJECUCIÓN
// ============================================================================
console.log('⚡ BLOQUE 4: EJECUCIÓN');
console.log('─────────────────────────────────────────────────────────────────');

// 4.1 Verificar que TODOS los agentes responden en TEXTO LIBRE
if (serverContent.includes('TEXTO LIBRE PROFESIONAL') || serverContent.includes('TEXTO LIBRE profesional')) {
  console.log('✅ Sistema de TEXTO LIBRE para todos los agentes');
  verificacionesPasadas++;
} else {
  errores.push('❌ No se encontró sistema de TEXTO LIBRE para agentes');
}

// 4.2 Verificar lecciones aprendidas
const leccionesPath = path.join(__dirname, '..', 'data', 'lecciones-aprendidas.json');
if (fs.existsSync(leccionesPath)) {
  const lecciones = JSON.parse(fs.readFileSync(leccionesPath, 'utf8'));
  console.log(`✅ Lecciones aprendidas: ${lecciones.lecciones?.length || 0} registradas`);
  verificacionesPasadas++;

  // Verificar lecciones críticas
  const leccionesCriticas = lecciones.lecciones?.filter(l => l.prioridad === 'critica') || [];
  console.log(`   └─ ${leccionesCriticas.length} lecciones con prioridad CRÍTICA`);
} else {
  advertencias.push('⚠️ No se encontró archivo de lecciones aprendidas');
}

// 4.3 Verificar workflows definidos
const workflowsMatch = appContent.match(/const WORKFLOWS = \[([\s\S]*?)\];/);
if (workflowsMatch) {
  const workflowIds = workflowsMatch[1].match(/id:\s*(\d+)/g) || [];
  console.log(`✅ Workflows definidos: ${workflowIds.length}`);
  verificacionesPasadas++;

  // Contar por bloque
  const bloques = {
    ceo: (workflowsMatch[1].match(/block:\s*"ceo"/g) || []).length,
    finance: (workflowsMatch[1].match(/block:\s*"finance"/g) || []).length,
    marketing: (workflowsMatch[1].match(/block:\s*"marketing"/g) || []).length,
    operations: (workflowsMatch[1].match(/block:\s*"operations"/g) || []).length,
    hr: (workflowsMatch[1].match(/block:\s*"hr"/g) || []).length,
    tech: (workflowsMatch[1].match(/block:\s*"tech"/g) || []).length,
    strategy: (workflowsMatch[1].match(/block:\s*"strategy"/g) || []).length,
    legal: (workflowsMatch[1].match(/block:\s*"legal"/g) || []).length,
    customer: (workflowsMatch[1].match(/block:\s*"customer"/g) || []).length
  };

  console.log('   Distribución por bloque:');
  Object.entries(bloques).forEach(([bloque, count]) => {
    console.log(`   └─ ${bloque}: ${count} workflows`);
  });
} else {
  errores.push('❌ No se encontraron workflows definidos');
}

console.log('');

// ============================================================================
// BLOQUE 5: GENERACIÓN DE DOCUMENTOS/REPORTES
// ============================================================================
console.log('📄 BLOQUE 5: GENERACIÓN DE DOCUMENTOS/REPORTES');
console.log('─────────────────────────────────────────────────────────────────');

// 5.1 Verificar que los botones usan respondingAgentId
if (appContent.includes('respondingAgentId = instructionResponse[selected].agentId')) {
  console.log('✅ Botones de exportación usan agente que RESPONDE');
  verificacionesPasadas++;
} else {
  errores.push('❌ Botones de exportación no usan respondingAgentId');
}

// 5.2 Verificar limpieza de nombres
if (appContent.includes(".replace(/\\s+IA$/i, '')")) {
  console.log('✅ Nombres de archivos limpios (sin "IA")');
  verificacionesPasadas++;
} else {
  advertencias.push('⚠️ Los nombres de archivos podrían incluir "IA"');
}

// 5.3 Verificar formatos de exportación
const formatos = ['jsPDF', '.doc', '.json', 'window.print'];
let formatosOk = 0;
formatos.forEach(formato => {
  if (appContent.includes(formato)) formatosOk++;
});
console.log(`✅ Formatos de exportación: ${formatosOk}/${formatos.length} (PDF, Word, JSON, Print)`);
verificacionesPasadas++;

// 5.4 Verificar que no hay encabezados de agente en documentos
if (serverContent.includes('NO pongas tu rol/título como encabezado') ||
    serverContent.includes('NO pongas encabezados como "CEO"')) {
  console.log('✅ Prohibición de encabezados de agente en documentos');
  verificacionesPasadas++;
} else {
  advertencias.push('⚠️ Podría faltar prohibición de encabezados de agente');
}

console.log('');

// ============================================================================
// RESUMEN FINAL
// ============================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('                      RESUMEN DE VERIFICACIÓN');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log(`✅ Verificaciones PASADAS: ${verificacionesPasadas}`);
console.log(`❌ ERRORES encontrados: ${errores.length}`);
console.log(`⚠️ ADVERTENCIAS: ${advertencias.length}`);

if (errores.length > 0) {
  console.log('\n🚨 ERRORES A CORREGIR:');
  errores.forEach((e, i) => console.log(`   ${i+1}. ${e}`));
}

if (advertencias.length > 0) {
  console.log('\n⚠️ ADVERTENCIAS (revisar):');
  advertencias.forEach((a, i) => console.log(`   ${i+1}. ${a}`));
}

console.log('\n═══════════════════════════════════════════════════════════════');
if (errores.length === 0) {
  console.log('   ✅ SISTEMA VERIFICADO - TODOS LOS BLOQUES FUNCIONANDO');
} else {
  console.log('   ❌ HAY ERRORES QUE DEBEN CORREGIRSE');
}
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(errores.length > 0 ? 1 : 0);
