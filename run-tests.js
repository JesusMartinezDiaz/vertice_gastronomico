import { exec } from 'child_process';

/**
 * Sistema de Tests Vértice Gastronómico
 * CORREGIDO: Usa Promise.allSettled para detectar TODOS los errores
 */

const runTest = (command, name) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      const result = {
        name,
        command,
        duration,
        success: !error,
        stdout: stdout || '',
        stderr: stderr || '',
        error: error ? error.message : null
      };

      resolve(result);
    });
  });
};

const printResult = (result) => {
  const icon = result.success ? '✅' : '❌';
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${icon} ${result.name} (${result.duration}s)`);
  console.log(`   Comando: ${result.command}`);
  console.log(`${'='.repeat(60)}`);

  if (result.stdout) {
    console.log('\n📋 STDOUT:');
    console.log(result.stdout);
  }

  if (result.stderr && !result.success) {
    console.log('\n🔴 STDERR:');
    console.log(result.stderr);
  }

  if (result.error) {
    console.log('\n💥 ERROR:');
    console.log(result.error);
  }
};

(async () => {
  console.log('\n🧪 SISTEMA DE TESTS - VÉRTICE GASTRONÓMICO');
  console.log('=========================================\n');
  console.log('Ejecutando TODOS los tests en paralelo...\n');

  // Usar Promise.allSettled para ejecutar TODOS los tests
  // independientemente de si alguno falla
  const results = await Promise.allSettled([
    runTest('npm run test:jest -- --passWithNoTests 2>&1', 'Jest Tests'),
    runTest('npm run test:vitest -- --reporter=verbose 2>&1', 'Vitest Tests')
  ]);

  // Extraer resultados
  const testResults = results.map(r => r.value);

  // Mostrar todos los resultados
  console.log('\n📊 RESULTADOS DETALLADOS:');
  testResults.forEach(printResult);

  // Resumen final
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const total = testResults.length;

  console.log('\n' + '═'.repeat(60));
  console.log('📈 RESUMEN FINAL');
  console.log('═'.repeat(60));
  console.log(`   Total de suites: ${total}`);
  console.log(`   ✅ Exitosos: ${passed}`);
  console.log(`   ❌ Fallidos: ${failed}`);
  console.log('═'.repeat(60) + '\n');

  // Listar errores específicos si hay fallos
  if (failed > 0) {
    console.log('🔴 ERRORES DETECTADOS:');
    testResults
      .filter(r => !r.success)
      .forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name}: ${r.error || 'Ver STDERR arriba'}`);
      });
    console.log('');
    process.exit(1);
  }

  console.log('✅ Todas las pruebas pasaron exitosamente.\n');
  process.exit(0);
})();
