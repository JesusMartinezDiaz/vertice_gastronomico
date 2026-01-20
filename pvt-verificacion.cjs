// PVT - Protocolo de Verificación Triple
// Ejecutar punto por punto

const http = require('http');

const tests = [];
let currentTest = 0;

function log(msg) {
  console.log(msg);
}

function makeRequest(instruction, agentId = 1) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      instruction,
      agentId,
      agentName: "CEO",
      agentTools: [],
      documents: []
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/process-instruction',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid JSON: ' + body.substring(0, 200)));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(120000, () => reject(new Error('Timeout')));
    req.write(data);
    req.end();
  });
}

async function runPVT() {
  log('');
  log('═══════════════════════════════════════════════════════════');
  log('   PVT - PROTOCOLO DE VERIFICACIÓN TRIPLE');
  log('   Ejecutando punto por punto');
  log('═══════════════════════════════════════════════════════════');
  log('');

  // ============================================================
  // VERIFICACIÓN 1: COMPLETITUD
  // ============================================================
  log('┌─────────────────────────────────────────────────────────┐');
  log('│ VERIFICACIÓN 1: COMPLETITUD                             │');
  log('│ ¿Respondí TODO lo que me pidieron?                      │');
  log('└─────────────────────────────────────────────────────────┘');
  log('');

  // Test 1.1: Redirección con "expediente 512"
  log('TEST 1.1: ¿La instrucción con "expediente 512" redirige al Agente 72?');
  try {
    const result = await makeRequest('que el agente 72 revise el expediente 512 y realice los escritos necesarios');
    const passed = result.agentId === 72;
    log(`  → agentId retornado: ${result.agentId}`);
    log(`  → status: ${result.status}`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '1.1 Redirección expediente 512', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '1.1 Redirección expediente 512', passed: false });
  }
  log('');

  // Test 1.2: Redirección con "custodia"
  log('TEST 1.2: ¿La instrucción con "custodia" redirige al Agente 72?');
  try {
    const result = await makeRequest('necesito ayuda con un caso de custodia de mi hijo');
    const passed = result.agentId === 72;
    log(`  → agentId retornado: ${result.agentId}`);
    log(`  → status: ${result.status}`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '1.2 Redirección custodia', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '1.2 Redirección custodia', passed: false });
  }
  log('');

  // Test 1.3: El escrito tiene formato judicial
  log('TEST 1.3: ¿El escrito retornado tiene formato judicial (EXPEDIENTE, HECHOS, PETITORIO)?');
  try {
    const result = await makeRequest('redacta un escrito para solicitar custodia');
    const response = result.response || '';
    const tieneExpediente = response.includes('EXPEDIENTE') || response.includes('expediente');
    const tieneHechos = response.includes('HECHOS') || response.includes('ANTECEDENTES') || response.includes('hechos');
    const tienePetitorio = response.includes('PETITORIO') || response.includes('PIDO') || response.includes('SOLICITO');
    const passed = tieneExpediente && (tieneHechos || tienePetitorio);
    log(`  → Tiene EXPEDIENTE: ${tieneExpediente ? 'SÍ' : 'NO'}`);
    log(`  → Tiene HECHOS/ANTECEDENTES: ${tieneHechos ? 'SÍ' : 'NO'}`);
    log(`  → Tiene PETITORIO/PIDO: ${tienePetitorio ? 'SÍ' : 'NO'}`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '1.3 Formato judicial', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '1.3 Formato judicial', passed: false });
  }
  log('');

  // ============================================================
  // VERIFICACIÓN 2: EXACTITUD
  // ============================================================
  log('┌─────────────────────────────────────────────────────────┐');
  log('│ VERIFICACIÓN 2: EXACTITUD                               │');
  log('│ ¿Los datos que usé son CORRECTOS?                       │');
  log('└─────────────────────────────────────────────────────────┘');
  log('');

  // Test 2.1: No hay "undefined", "null" o "[object Object]" en respuesta
  log('TEST 2.1: ¿La respuesta no tiene errores de datos (undefined, null, [object)?');
  try {
    const result = await makeRequest('dame un resumen del expediente 512');
    const response = result.response || '';
    const hasUndefined = response.includes('undefined');
    const hasNull = response.includes('null') && !response.includes('null)'); // evitar falsos positivos
    const hasObject = response.includes('[object');
    const passed = !hasUndefined && !hasObject;
    log(`  → Tiene "undefined": ${hasUndefined ? 'SÍ ❌' : 'NO ✅'}`);
    log(`  → Tiene "[object Object]": ${hasObject ? 'SÍ ❌' : 'NO ✅'}`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '2.1 Sin errores de datos', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '2.1 Sin errores de datos', passed: false });
  }
  log('');

  // Test 2.2: agentId correcto cuando es Agent 72
  log('TEST 2.2: ¿El servidor incluye agentId: 72 cuando procesa con Agent 72?');
  try {
    const result = await makeRequest('necesito un escrito de divorcio');
    const passed = result.agentId === 72;
    log(`  → agentId en respuesta: ${result.agentId}`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '2.2 agentId correcto', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '2.2 agentId correcto', passed: false });
  }
  log('');

  // ============================================================
  // VERIFICACIÓN 3: FUNCIONALIDAD
  // ============================================================
  log('┌─────────────────────────────────────────────────────────┐');
  log('│ VERIFICACIÓN 3: FUNCIONALIDAD                           │');
  log('│ ¿Mi respuesta es USABLE inmediatamente?                 │');
  log('└─────────────────────────────────────────────────────────┘');
  log('');

  // Test 3.1: La respuesta es texto, no JSON crudo
  log('TEST 3.1: ¿La respuesta es TEXTO profesional, no JSON?');
  try {
    const result = await makeRequest('redacta un escrito de pensión alimenticia');
    const response = result.response || '';
    const isJson = response.trim().startsWith('{') || response.trim().startsWith('[');
    const hasMarkdown = response.includes('```') || response.includes('**');
    const passed = !isJson;
    log(`  → Empieza con { o [: ${isJson ? 'SÍ ❌' : 'NO ✅'}`);
    log(`  → Tiene markdown excesivo: ${hasMarkdown ? 'ALGO' : 'NO'}`);
    log(`  → Longitud respuesta: ${response.length} chars`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '3.1 Texto no JSON', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '3.1 Texto no JSON', passed: false });
  }
  log('');

  // Test 3.2: No dice "ANÁLISIS INICIAL" ni "delegateTo"
  log('TEST 3.2: ¿No usa términos prohibidos (ANÁLISIS INICIAL, delegateTo)?');
  try {
    const result = await makeRequest('elabora una demanda de custodia');
    const response = result.response || '';
    const hasAnalisis = response.includes('ANÁLISIS INICIAL') || response.includes('ANALISIS INICIAL');
    const hasDelegateTo = response.includes('delegateTo') || response.includes('DELEGACIÓN ACTIVADA');
    const passed = !hasAnalisis && !hasDelegateTo;
    log(`  → Tiene "ANÁLISIS INICIAL": ${hasAnalisis ? 'SÍ ❌' : 'NO ✅'}`);
    log(`  → Tiene "delegateTo": ${hasDelegateTo ? 'SÍ ❌' : 'NO ✅'}`);
    log(`  → Resultado: ${passed ? '✅ PASA' : '❌ FALLA'}`);
    tests.push({ name: '3.2 Sin términos prohibidos', passed });
  } catch (e) {
    log(`  → ERROR: ${e.message}`);
    tests.push({ name: '3.2 Sin términos prohibidos', passed: false });
  }
  log('');

  // ============================================================
  // RESUMEN FINAL
  // ============================================================
  log('═══════════════════════════════════════════════════════════');
  log('                    RESUMEN PVT');
  log('═══════════════════════════════════════════════════════════');
  log('');

  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;

  tests.forEach((t, i) => {
    log(`  ${i + 1}. ${t.name}: ${t.passed ? '✅ PASA' : '❌ FALLA'}`);
  });

  log('');
  log(`  TOTAL: ${passed}/${tests.length} tests pasaron`);
  log(`  ${failed === 0 ? '🎉 TODOS LOS TESTS PASARON' : '⚠️ HAY TESTS FALLIDOS'}`);
  log('');
  log('═══════════════════════════════════════════════════════════');

  process.exit(failed === 0 ? 0 : 1);
}

runPVT().catch(e => {
  console.error('Error ejecutando PVT:', e);
  process.exit(1);
});
