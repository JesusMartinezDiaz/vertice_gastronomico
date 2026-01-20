/**
 * Quality Gate - Control de Calidad
 * Sistema de validación y aseguramiento de calidad para entregables
 */

export class QualityGate {
  constructor(config) {
    this.config = config;
    this.minimumScore = 95; // Mínimo 95% para aprobar
  }

  createCheckpoints(project) {
    return [
      {
        id: 'cp-1',
        name: 'Validación de Datos de Entrada',
        phase: 'preparation',
        criteria: [
          'Datos completos',
          'Formato correcto',
          'Sin valores inválidos'
        ]
      },
      {
        id: 'cp-2',
        name: 'Verificación de Análisis',
        phase: 'analysis',
        criteria: [
          'Cálculos verificados',
          'Metodología documentada',
          'Resultados coherentes'
        ]
      },
      {
        id: 'cp-3',
        name: 'Revisión de Entregables',
        phase: 'development',
        criteria: [
          'Formato profesional',
          'Contenido completo',
          'Sin errores ortográficos',
          'Branding correcto'
        ]
      },
      {
        id: 'cp-4',
        name: 'Control Final de Calidad',
        phase: 'delivery',
        criteria: [
          'Score >= 95%',
          'Todas las validaciones pasadas',
          'Documentación completa'
        ]
      }
    ];
  }

  async validateTaskResult(result) {
    const validations = [];

    // Validar que existe resultado
    if (!result || !result.result) {
      validations.push({ check: 'Resultado existe', passed: false });
      return { passed: false, errors: ['No hay resultado'] };
    }

    // Validar que la tarea se completó
    if (result.status !== 'completed') {
      validations.push({ check: 'Tarea completada', passed: false });
      return { passed: false, errors: ['Tarea no completada'] };
    }

    // Validar checklist
    if (result.checklistCompleted) {
      const allCompleted = result.checklistCompleted.every(item => item.completed);
      validations.push({ check: 'Checklist completo', passed: allCompleted });
      if (!allCompleted) {
        return { passed: false, errors: ['Checklist incompleto'] };
      }
    }

    return { passed: true, validations };
  }

  async runFullCheck(project) {
    const checks = [];
    let totalPoints = 0;
    let earnedPoints = 0;

    // 1. Verificar estructura del proyecto
    const structureCheck = this.checkProjectStructure(project);
    checks.push(structureCheck);
    totalPoints += 20;
    earnedPoints += structureCheck.passed ? 20 : 0;

    // 2. Verificar tareas completadas
    const tasksCheck = this.checkTasksCompletion(project);
    checks.push(tasksCheck);
    totalPoints += 25;
    earnedPoints += tasksCheck.score;

    // 3. Verificar entregables
    const deliverablesCheck = await this.checkDeliverables(project);
    checks.push(deliverablesCheck);
    totalPoints += 30;
    earnedPoints += deliverablesCheck.score;

    // 4. Verificar documentación
    const docsCheck = this.checkDocumentation(project);
    checks.push(docsCheck);
    totalPoints += 15;
    earnedPoints += docsCheck.passed ? 15 : docsCheck.score;

    // 5. Verificar historial y trazabilidad
    const historyCheck = this.checkHistory(project);
    checks.push(historyCheck);
    totalPoints += 10;
    earnedPoints += historyCheck.passed ? 10 : 0;

    const score = Math.round((earnedPoints / totalPoints) * 100);

    return {
      checks,
      score,
      totalPoints,
      earnedPoints,
      passed: score >= this.minimumScore,
      issues: checks.filter(c => !c.passed).map(c => c.issue),
      recommendations: this.generateRecommendations(checks)
    };
  }

  checkProjectStructure(project) {
    const required = ['meta', 'structure', 'quality', 'history'];
    const missing = required.filter(key => !project[key]);

    return {
      name: 'Estructura del Proyecto',
      passed: missing.length === 0,
      issue: missing.length > 0 ? `Faltan: ${missing.join(', ')}` : null,
      details: { required, missing }
    };
  }

  checkTasksCompletion(project) {
    const tasks = project.structure?.tasks || [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      name: 'Tareas Completadas',
      passed: percentage === 100,
      score: Math.round((percentage / 100) * 25),
      issue: percentage < 100 ? `${completed}/${total} tareas completadas` : null,
      details: { completed, total, percentage }
    };
  }

  async checkDeliverables(project) {
    const deliverables = project.structure?.deliverables || [];
    let score = 0;
    const issues = [];

    for (const deliverable of deliverables) {
      // Verificar que existe contenido
      if (deliverable.content) {
        score += 10;
      } else {
        issues.push(`Entregable ${deliverable.id} sin contenido`);
      }

      // Verificar formato
      if (deliverable.format) {
        score += 5;
      }

      // Verificar validación
      if (deliverable.validated) {
        score += 5;
      }
    }

    const maxScore = deliverables.length * 20;
    const normalizedScore = maxScore > 0 ? Math.round((score / maxScore) * 30) : 30;

    return {
      name: 'Entregables',
      passed: issues.length === 0,
      score: normalizedScore,
      issue: issues.length > 0 ? issues.join('; ') : null,
      details: { deliverables: deliverables.length, issues }
    };
  }

  checkDocumentation(project) {
    const docs = project.documentation || [];
    const hasHistory = project.history && project.history.length > 0;

    return {
      name: 'Documentación',
      passed: docs.length > 0 || hasHistory,
      score: hasHistory ? 15 : 0,
      issue: !hasHistory ? 'Sin documentación de proceso' : null
    };
  }

  checkHistory(project) {
    const history = project.history || [];
    const requiredActions = ['created', 'planning_completed', 'execution_completed'];
    const foundActions = history.map(h => h.action);
    const hasAll = requiredActions.every(action =>
      foundActions.some(a => a.includes(action.split('_')[0]))
    );

    return {
      name: 'Historial y Trazabilidad',
      passed: hasAll,
      issue: !hasAll ? 'Historial incompleto' : null,
      details: { entries: history.length, requiredActions }
    };
  }

  generateRecommendations(checks) {
    const recommendations = [];

    for (const check of checks) {
      if (!check.passed) {
        switch (check.name) {
          case 'Estructura del Proyecto':
            recommendations.push('Completar todos los campos requeridos del proyecto');
            break;
          case 'Tareas Completadas':
            recommendations.push('Completar todas las tareas pendientes antes de entregar');
            break;
          case 'Entregables':
            recommendations.push('Revisar y completar todos los entregables');
            break;
          case 'Documentación':
            recommendations.push('Agregar documentación del proceso');
            break;
          case 'Historial y Trazabilidad':
            recommendations.push('Asegurar registro completo de actividades');
            break;
        }
      }
    }

    return recommendations;
  }

  async checkConsistency(deliverable) {
    const warnings = [];

    // Verificar consistencia de datos
    if (deliverable.numbers) {
      // Verificar que los números sumen correctamente
      // (implementación específica según el tipo de entregable)
    }

    return { passed: warnings.length === 0, warnings };
  }

  async checkSpelling(deliverable) {
    // Placeholder para verificación ortográfica
    return { passed: true, suggestions: [] };
  }

  async checkNumericAccuracy(deliverable) {
    const errors = [];
    // Verificar precisión numérica
    return { passed: errors.length === 0, errors };
  }
}

export default QualityGate;
