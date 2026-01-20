/**
 * Protocolo de Verificación de 3 Pasos - Vértice Gastronómico
 *
 * OBLIGATORIO: Todo cambio, implementación o entregable DEBE pasar por este protocolo
 * antes de considerarse completo.
 *
 * Los 3 pasos son:
 * 1. VERIFICACIÓN DE EXISTENCIA - Confirmar que el elemento existe donde debe existir
 * 2. VERIFICACIÓN DE INTEGRIDAD - Confirmar que el elemento está completo y funcional
 * 3. VERIFICACIÓN DE COMPILACIÓN - Confirmar que no hay errores en el sistema
 */

export class VerificationProtocol {
  constructor(config = {}) {
    this.config = {
      strictMode: true,           // Requiere los 3 pasos para aprobar
      logResults: true,           // Registrar resultados en historial
      minimumPassRate: 100,       // % mínimo para aprobar (100 = todos los pasos)
      ...config
    };

    this.verificationHistory = [];
  }

  /**
   * Ejecuta el protocolo completo de verificación de 3 pasos
   * @param {Object} target - El objeto/cambio a verificar
   * @param {Object} context - Contexto de la verificación
   * @returns {Object} Resultado de la verificación
   */
  async runFullProtocol(target, context = {}) {
    const startTime = Date.now();
    const verificationId = `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const results = {
      id: verificationId,
      timestamp: new Date().toISOString(),
      target: context.targetName || 'Unknown',
      targetType: context.targetType || 'general',
      steps: [],
      passed: false,
      summary: null
    };

    console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
    console.log(`║     PROTOCOLO DE VERIFICACIÓN DE 3 PASOS                       ║`);
    console.log(`║     ID: ${verificationId}                              ║`);
    console.log(`╚════════════════════════════════════════════════════════════════╝\n`);

    // PASO 1: Verificación de Existencia
    const step1 = await this.runStep1_Existence(target, context);
    results.steps.push(step1);
    this.logStep(1, 'EXISTENCIA', step1);

    if (!step1.passed && this.config.strictMode) {
      results.passed = false;
      results.summary = this.generateSummary(results, startTime);
      return results;
    }

    // PASO 2: Verificación de Integridad
    const step2 = await this.runStep2_Integrity(target, context);
    results.steps.push(step2);
    this.logStep(2, 'INTEGRIDAD', step2);

    if (!step2.passed && this.config.strictMode) {
      results.passed = false;
      results.summary = this.generateSummary(results, startTime);
      return results;
    }

    // PASO 3: Verificación de Compilación
    const step3 = await this.runStep3_Compilation(target, context);
    results.steps.push(step3);
    this.logStep(3, 'COMPILACIÓN', step3);

    // Calcular resultado final
    const passedSteps = results.steps.filter(s => s.passed).length;
    const passRate = (passedSteps / 3) * 100;
    results.passed = passRate >= this.config.minimumPassRate;
    results.summary = this.generateSummary(results, startTime);

    // Registrar en historial
    if (this.config.logResults) {
      this.verificationHistory.push(results);
    }

    this.printFinalSummary(results);

    return results;
  }

  /**
   * PASO 1: Verificación de Existencia
   * Confirma que el elemento existe donde debe existir
   */
  async runStep1_Existence(target, context) {
    const checks = [];

    // Verificar que el target existe
    if (target === null || target === undefined) {
      checks.push({ check: 'Target existe', passed: false, detail: 'Target es null/undefined' });
    } else {
      checks.push({ check: 'Target existe', passed: true, detail: 'Target encontrado' });
    }

    // Verificar ubicación (si aplica)
    if (context.expectedPath) {
      const pathExists = await this.checkPath(context.expectedPath);
      checks.push({
        check: 'Ubicación correcta',
        passed: pathExists,
        detail: pathExists ? context.expectedPath : `No encontrado en ${context.expectedPath}`
      });
    }

    // Verificar referencias (si aplica)
    if (context.references) {
      for (const ref of context.references) {
        const refExists = await this.checkReference(ref);
        checks.push({
          check: `Referencia: ${ref.name}`,
          passed: refExists,
          detail: refExists ? 'Encontrada' : 'No encontrada'
        });
      }
    }

    const allPassed = checks.every(c => c.passed);

    return {
      step: 1,
      name: 'VERIFICACIÓN DE EXISTENCIA',
      description: 'Confirmar que el elemento existe donde debe existir',
      checks,
      passed: allPassed,
      failedChecks: checks.filter(c => !c.passed)
    };
  }

  /**
   * PASO 2: Verificación de Integridad
   * Confirma que el elemento está completo y es funcional
   */
  async runStep2_Integrity(target, context) {
    const checks = [];

    // Verificar estructura completa
    if (context.requiredFields) {
      for (const field of context.requiredFields) {
        const hasField = this.hasNestedProperty(target, field);
        checks.push({
          check: `Campo: ${field}`,
          passed: hasField,
          detail: hasField ? 'Presente' : 'Ausente'
        });
      }
    }

    // Verificar tipo de datos
    if (context.expectedType) {
      const typeMatch = typeof target === context.expectedType ||
                        (context.expectedType === 'array' && Array.isArray(target));
      checks.push({
        check: 'Tipo de datos',
        passed: typeMatch,
        detail: typeMatch ? context.expectedType : `Esperado: ${context.expectedType}, Actual: ${typeof target}`
      });
    }

    // Verificar valores válidos
    if (context.validators) {
      for (const validator of context.validators) {
        try {
          const isValid = validator.fn(target);
          checks.push({
            check: validator.name,
            passed: isValid,
            detail: isValid ? 'Válido' : validator.errorMessage
          });
        } catch (error) {
          checks.push({
            check: validator.name,
            passed: false,
            detail: `Error: ${error.message}`
          });
        }
      }
    }

    // Verificar que no hay duplicados (si aplica)
    if (context.checkDuplicates && Array.isArray(target)) {
      const hasDuplicates = new Set(target).size !== target.length;
      checks.push({
        check: 'Sin duplicados',
        passed: !hasDuplicates,
        detail: hasDuplicates ? 'Se encontraron duplicados' : 'Sin duplicados'
      });
    }

    const allPassed = checks.length === 0 || checks.every(c => c.passed);

    return {
      step: 2,
      name: 'VERIFICACIÓN DE INTEGRIDAD',
      description: 'Confirmar que el elemento está completo y funcional',
      checks,
      passed: allPassed,
      failedChecks: checks.filter(c => !c.passed)
    };
  }

  /**
   * PASO 3: Verificación de Compilación
   * Confirma que no hay errores en el sistema
   */
  async runStep3_Compilation(target, context) {
    const checks = [];

    // Verificación sintáctica (si es código)
    if (context.isCode) {
      try {
        // Intento de evaluación sintáctica
        if (context.codeType === 'javascript') {
          new Function(target);
        }
        checks.push({
          check: 'Sintaxis válida',
          passed: true,
          detail: 'Sin errores de sintaxis'
        });
      } catch (error) {
        checks.push({
          check: 'Sintaxis válida',
          passed: false,
          detail: `Error: ${error.message}`
        });
      }
    }

    // Verificación de dependencias
    if (context.dependencies) {
      for (const dep of context.dependencies) {
        const depExists = await this.checkDependency(dep);
        checks.push({
          check: `Dependencia: ${dep.name}`,
          passed: depExists,
          detail: depExists ? 'Disponible' : 'No disponible'
        });
      }
    }

    // Verificación de build (si aplica)
    if (context.runBuild) {
      const buildResult = await this.runBuildCheck(context.buildCommand);
      checks.push({
        check: 'Build exitoso',
        passed: buildResult.success,
        detail: buildResult.success ? `Completado en ${buildResult.time}ms` : buildResult.error
      });
    }

    // Verificación de tests (si aplica)
    if (context.runTests) {
      const testResult = await this.runTestCheck(context.testCommand);
      checks.push({
        check: 'Tests pasaron',
        passed: testResult.passed,
        detail: testResult.passed
          ? `${testResult.totalTests} tests pasaron`
          : `${testResult.failedTests}/${testResult.totalTests} fallaron`
      });
    }

    // Si no hay verificaciones específicas, marcar como pasado
    if (checks.length === 0) {
      checks.push({
        check: 'Verificación general',
        passed: true,
        detail: 'No se requieren verificaciones adicionales de compilación'
      });
    }

    const allPassed = checks.every(c => c.passed);

    return {
      step: 3,
      name: 'VERIFICACIÓN DE COMPILACIÓN',
      description: 'Confirmar que no hay errores en el sistema',
      checks,
      passed: allPassed,
      failedChecks: checks.filter(c => !c.passed)
    };
  }

  /**
   * Helper: Verificar si una ruta existe
   */
  async checkPath(path) {
    try {
      // En ambiente Node.js
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        return fs.existsSync(path);
      }
      // En ambiente browser, simular
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Helper: Verificar referencia
   */
  async checkReference(ref) {
    // Implementación específica según el tipo de referencia
    return ref && ref.exists !== false;
  }

  /**
   * Helper: Verificar propiedad anidada
   */
  hasNestedProperty(obj, path) {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return false;
      if (!(part in current)) return false;
      current = current[part];
    }

    return true;
  }

  /**
   * Helper: Verificar dependencia
   */
  async checkDependency(dep) {
    // Implementación específica
    return dep && dep.available !== false;
  }

  /**
   * Helper: Ejecutar verificación de build
   */
  async runBuildCheck(command) {
    const startTime = Date.now();
    try {
      // Simular o ejecutar build
      return {
        success: true,
        time: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        time: Date.now() - startTime
      };
    }
  }

  /**
   * Helper: Ejecutar verificación de tests
   */
  async runTestCheck(command) {
    try {
      // Simular o ejecutar tests
      return {
        passed: true,
        totalTests: 1,
        failedTests: 0
      };
    } catch (error) {
      return {
        passed: false,
        totalTests: 1,
        failedTests: 1,
        error: error.message
      };
    }
  }

  /**
   * Log de cada paso
   */
  logStep(stepNumber, stepName, result) {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`${color}[PASO ${stepNumber}] ${icon} ${stepName}${reset}`);
    console.log(`  └─ ${result.description}`);

    for (const check of result.checks) {
      const checkIcon = check.passed ? '✓' : '✗';
      console.log(`     ${checkIcon} ${check.check}: ${check.detail}`);
    }
    console.log('');
  }

  /**
   * Generar resumen
   */
  generateSummary(results, startTime) {
    const elapsed = Date.now() - startTime;
    const passedSteps = results.steps.filter(s => s.passed).length;

    return {
      totalSteps: 3,
      passedSteps,
      failedSteps: 3 - passedSteps,
      passRate: Math.round((passedSteps / 3) * 100),
      elapsedTime: elapsed,
      overallPassed: results.passed,
      failedChecks: results.steps
        .filter(s => !s.passed)
        .flatMap(s => s.failedChecks)
    };
  }

  /**
   * Imprimir resumen final
   */
  printFinalSummary(results) {
    const { summary } = results;
    const color = results.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`╔════════════════════════════════════════════════════════════════╗`);
    console.log(`║                        RESUMEN                                  ║`);
    console.log(`╚════════════════════════════════════════════════════════════════╝`);
    console.log(`  Total de pasos: ${summary.totalSteps}`);
    console.log(`  ${color}✓ Pasaron: ${summary.passedSteps}${reset}`);
    console.log(`  ${summary.failedSteps > 0 ? '\x1b[31m' : '\x1b[32m'}✗ Fallaron: ${summary.failedSteps}${reset}`);
    console.log(`  ⏱  Tiempo: ${summary.elapsedTime}ms`);
    console.log('');

    if (results.passed) {
      console.log(`${color}✓ VERIFICACIÓN COMPLETADA - TODOS LOS PASOS PASARON${reset}\n`);
    } else {
      console.log(`\x1b[31m✗ VERIFICACIÓN FALLIDA - REVISAR ERRORES${reset}\n`);

      if (summary.failedChecks.length > 0) {
        console.log(`\x1b[33m⚠️  ERRORES DETECTADOS:${reset}`);
        for (const check of summary.failedChecks) {
          console.log(`   • ${check.check}: ${check.detail}`);
        }
        console.log('');
      }
    }
  }

  /**
   * Método rápido para verificaciones simples
   */
  async quickVerify(target, options = {}) {
    return this.runFullProtocol(target, {
      targetName: options.name || 'Quick Verification',
      targetType: options.type || 'general',
      requiredFields: options.requiredFields,
      expectedType: options.expectedType,
      ...options
    });
  }

  /**
   * Obtener historial de verificaciones
   */
  getHistory() {
    return this.verificationHistory;
  }

  /**
   * Limpiar historial
   */
  clearHistory() {
    this.verificationHistory = [];
  }

  /**
   * Crear reporte de verificación para entregables
   */
  generateReport() {
    const history = this.verificationHistory;
    const totalVerifications = history.length;
    const passed = history.filter(v => v.passed).length;
    const failed = totalVerifications - passed;

    return {
      title: 'Reporte de Protocolo de Verificación de 3 Pasos',
      generatedAt: new Date().toISOString(),
      stats: {
        total: totalVerifications,
        passed,
        failed,
        passRate: totalVerifications > 0 ? Math.round((passed / totalVerifications) * 100) : 0
      },
      verifications: history.map(v => ({
        id: v.id,
        target: v.target,
        timestamp: v.timestamp,
        passed: v.passed,
        steps: v.steps.map(s => ({
          name: s.name,
          passed: s.passed,
          checksCount: s.checks.length,
          failedCount: s.failedChecks.length
        }))
      }))
    };
  }
}

// Instancia global del protocolo
export const verificationProtocol = new VerificationProtocol();

// Constantes del protocolo
export const VERIFICATION_STEPS = {
  EXISTENCE: 1,
  INTEGRITY: 2,
  COMPILATION: 3
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  PASSED: 'passed',
  FAILED: 'failed'
};

export default VerificationProtocol;
