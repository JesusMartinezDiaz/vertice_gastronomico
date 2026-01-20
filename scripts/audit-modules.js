#!/usr/bin/env node
/**
 * Script de Auditoría de Módulos ES6 - Vértice Gastronómico
 *
 * Este script realiza una verificación REAL de importaciones ES6,
 * detectando errores que `node --check` NO puede detectar:
 * - Módulos faltantes
 * - Exportaciones nombradas inexistentes
 * - Dependencias circulares
 * - Errores de sintaxis ES6
 *
 * USO:
 *   node scripts/audit-modules.js           # Auditoría completa
 *   node scripts/audit-modules.js --quick   # Solo módulos principales
 *   node scripts/audit-modules.js --verbose # Muestra detalles de cada módulo
 *
 * IMPORTANTE: Este script usa importación dinámica (import()) que ejecuta
 * la resolución real de módulos, a diferencia de `node --check` que solo
 * verifica sintaxis.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Configuración
const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const QUICK = args.includes('--quick') || args.includes('-q');
const HELP = args.includes('--help') || args.includes('-h');

if (HELP) {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║     AUDITORÍA DE MÓDULOS ES6 - VÉRTICE GASTRONÓMICO           ║
╚════════════════════════════════════════════════════════════════╝

USO:
  node scripts/audit-modules.js [opciones]

OPCIONES:
  --quick, -q     Solo audita módulos principales (más rápido)
  --verbose, -v   Muestra información detallada de cada módulo
  --help, -h      Muestra esta ayuda

EJEMPLOS:
  node scripts/audit-modules.js              # Auditoría completa
  node scripts/audit-modules.js --quick      # Solo principales
  node scripts/audit-modules.js -v           # Con detalles

NOTA: Este script detecta errores que 'node --check' NO detecta:
  - Módulos importados que no existen
  - Exportaciones nombradas faltantes
  - Dependencias circulares problemáticas
`);
  process.exit(0);
}

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// Módulos a auditar
const AGENT_MODULES = [
  { name: 'Financial (2-7)', path: 'src/agents/financial/index.js' },
  { name: 'Strategic (8-12)', path: 'src/agents/strategic/index.js' },
  { name: 'Marketing (13-17)', path: 'src/agents/marketing/index.js' },
  { name: 'Operations (18-25)', path: 'src/agents/operations/index.js' },
  { name: 'Kitchen (26-33)', path: 'src/agents/kitchen/index.js' },
  { name: 'Legal (34-39)', path: 'src/agents/legal/index.js' },
  { name: 'HR (40-45)', path: 'src/agents/hr/index.js' },
  { name: 'Tech (46-51)', path: 'src/agents/tech/index.js' },
  { name: 'Quality (52-57)', path: 'src/agents/quality/index.js' },
  { name: 'Sustainability (58-63)', path: 'src/agents/sustainability/index.js' },
  { name: 'Innovation (64-70)', path: 'src/agents/innovation/index.js' },
  { name: 'Agent 71 - Project Manager', path: 'src/agents/agent71-project-manager/index.js' },
  { name: 'Agent 72 - Family Lawyer', path: 'src/agents/agent72-family-lawyer/index.js' },
];

const CORE_MODULES = [
  { name: 'Índice Central de Agentes', path: 'src/agents/index.js' },
  { name: 'Delegation Middleware', path: 'server/delegation-middleware.js' },
];

const SERVER_MODULES = [
  { name: 'Server Index', path: 'server/index.js' },
];

/**
 * Verifica un módulo usando importación dinámica
 */
async function verifyModule(modulePath, moduleName) {
  const fullPath = join(ROOT_DIR, modulePath);
  const startTime = Date.now();

  try {
    // Verificar que el archivo existe
    await stat(fullPath);

    // Intentar importar el módulo (esto detecta errores reales)
    const module = await import(fullPath);

    const elapsed = Date.now() - startTime;
    const exports = Object.keys(module).length;

    return {
      success: true,
      name: moduleName,
      path: modulePath,
      exports,
      elapsed,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      name: moduleName,
      path: modulePath,
      exports: 0,
      elapsed: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * Busca archivos JS en un directorio recursivamente
 */
async function findJSFiles(dir, files = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await findJSFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath.replace(ROOT_DIR + '/', ''));
      }
    }
  } catch (e) {
    // Ignorar errores de acceso
  }

  return files;
}

/**
 * Ejecuta la auditoría
 */
async function runAudit() {
  console.log(`
${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════════╗
║     AUDITORÍA DE MÓDULOS ES6 - VÉRTICE GASTRONÓMICO           ║
║     Sistema de 72 Agentes IA para Consultoría Gastronómica    ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}
`);

  const results = {
    passed: [],
    failed: [],
    totalTime: 0
  };

  const startTime = Date.now();

  // 1. Auditar módulos de agentes
  log('\n📁 MÓDULOS DE AGENTES (11 categorías + 2 especiales)', 'bold');
  log('─'.repeat(60), 'cyan');

  for (const mod of AGENT_MODULES) {
    const result = await verifyModule(mod.path, mod.name);
    results.totalTime += result.elapsed;

    if (result.success) {
      results.passed.push(result);
      log(`  ✓ ${mod.name}`, 'green');
      if (VERBOSE) {
        log(`    └─ ${result.exports} exports, ${result.elapsed}ms`, 'cyan');
      }
    } else {
      results.failed.push(result);
      log(`  ✗ ${mod.name}`, 'red');
      log(`    └─ ERROR: ${result.error}`, 'red');
    }
  }

  // 2. Auditar módulos core
  log('\n🔧 MÓDULOS CORE', 'bold');
  log('─'.repeat(60), 'cyan');

  for (const mod of CORE_MODULES) {
    const result = await verifyModule(mod.path, mod.name);
    results.totalTime += result.elapsed;

    if (result.success) {
      results.passed.push(result);
      log(`  ✓ ${mod.name}`, 'green');
      if (VERBOSE) {
        log(`    └─ ${result.exports} exports, ${result.elapsed}ms`, 'cyan');
      }
    } else {
      results.failed.push(result);
      log(`  ✗ ${mod.name}`, 'red');
      log(`    └─ ERROR: ${result.error}`, 'red');
    }
  }

  // 3. Si no es quick, auditar más módulos
  if (!QUICK) {
    log('\n🖥️  MÓDULOS DEL SERVIDOR', 'bold');
    log('─'.repeat(60), 'cyan');

    for (const mod of SERVER_MODULES) {
      const result = await verifyModule(mod.path, mod.name);
      results.totalTime += result.elapsed;

      if (result.success) {
        results.passed.push(result);
        log(`  ✓ ${mod.name}`, 'green');
        if (VERBOSE) {
          log(`    └─ ${result.exports} exports, ${result.elapsed}ms`, 'cyan');
        }
      } else {
        results.failed.push(result);
        log(`  ✗ ${mod.name}`, 'red');
        log(`    └─ ERROR: ${result.error}`, 'red');
      }
    }
  }

  // Resumen
  const totalElapsed = Date.now() - startTime;

  console.log(`
${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════════╗
║                        RESUMEN                                  ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}
`);

  log(`  Total de módulos verificados: ${results.passed.length + results.failed.length}`, 'bold');
  log(`  ✓ Pasaron: ${results.passed.length}`, 'green');
  log(`  ✗ Fallaron: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');
  log(`  ⏱  Tiempo total: ${totalElapsed}ms`, 'cyan');

  if (results.failed.length > 0) {
    log('\n⚠️  ERRORES DETECTADOS:', 'red');
    log('─'.repeat(60), 'red');

    for (const fail of results.failed) {
      log(`\n  ${fail.name}`, 'red');
      log(`  Archivo: ${fail.path}`, 'yellow');
      log(`  Error: ${fail.error}`, 'red');
    }

    log('\n💡 SUGERENCIAS:', 'yellow');
    log('  1. Verificar que los archivos importados existan', 'yellow');
    log('  2. Verificar que las exportaciones nombradas sean correctas', 'yellow');
    log('  3. Usar: node -e "import(\'./path/to/file.js\')" para debug', 'yellow');

    process.exit(1);
  } else {
    log(`\n${colors.green}${colors.bold}✓ TODOS LOS MÓDULOS PASARON LA AUDITORÍA${colors.reset}\n`);
    process.exit(0);
  }
}

// Ejecutar
runAudit().catch(err => {
  log(`\n❌ Error fatal en auditoría: ${err.message}`, 'red');
  process.exit(1);
});
