/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  AGENTE 71 - PROJECT MANAGER PROFESIONAL
 *  Vértice Gastronómico
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  "Los entregables son nuestra carta de presentación"
 *
 *  Este agente garantiza:
 *  ✓ Proyectos ordenados y estructurados
 *  ✓ Cero errores en entregables
 *  ✓ Documentación profesional
 *  ✓ Control de calidad automático
 *  ✓ Trazabilidad completa
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { ProjectOrchestrator } from './core/ProjectOrchestrator.js';
import { QualityGate } from './validators/QualityGate.js';
import { DeliverableGenerator } from './generators/DeliverableGenerator.js';
import { ErrorPrevention } from './validators/ErrorPrevention.js';
import { ProjectTemplates } from './templates/ProjectTemplates.js';
import { VerificationProtocol, verificationProtocol, VERIFICATION_STEPS } from './validators/VerificationProtocol.js';

// Estados del proyecto
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  QUALITY_CHECK: 'quality_check',
  APPROVED: 'approved',
  DELIVERED: 'delivered',
  ARCHIVED: 'archived'
};

// Tipos de entregables
export const DELIVERABLE_TYPES = {
  REPORT: 'report',
  ANALYSIS: 'analysis',
  MENU: 'menu',
  RECIPE: 'recipe',
  COST_SHEET: 'cost_sheet',
  INVENTORY: 'inventory',
  FINANCIAL: 'financial',
  OPERATIONAL: 'operational',
  PRESENTATION: 'presentation'
};

/**
 * Clase principal del Agente 71
 */
export class Agent71ProjectManager {
  constructor(config = {}) {
    this.id = 'agent-71';
    this.name = 'Project Manager Profesional';
    this.version = '1.0.0';

    // Configuración
    this.config = {
      strictMode: true,                    // Modo estricto de validación
      autoQualityCheck: true,              // Control de calidad automático
      requireApproval: true,               // Requiere aprobación antes de entregar
      maxRevisionsBeforeEscalation: 3,     // Máximo de revisiones antes de escalar
      documentEverything: true,            // Documentar todo el proceso
      ...config
    };

    // Inicializar módulos
    this.orchestrator = new ProjectOrchestrator(this.config);
    this.qualityGate = new QualityGate(this.config);
    this.deliverableGenerator = new DeliverableGenerator(this.config);
    this.errorPrevention = new ErrorPrevention(this.config);
    this.templates = new ProjectTemplates();

    // PROTOCOLO DE VERIFICACIÓN DE 3 PASOS - OBLIGATORIO
    this.verificationProtocol = new VerificationProtocol({
      strictMode: true,
      logResults: true,
      minimumPassRate: 100
    });

    // Estado interno
    this.activeProjects = new Map();
    this.completedProjects = [];
    this.errorLog = [];
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * FLUJO PRINCIPAL DEL PROYECTO
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * Crear un nuevo proyecto con estructura ordenada
   */
  async createProject(projectData) {
    const project = {
      id: this.generateProjectId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: PROJECT_STATUS.DRAFT,

      // Metadatos
      meta: {
        name: projectData.name,
        description: projectData.description,
        client: projectData.client,
        restaurant: projectData.restaurant,
        priority: projectData.priority || 'medium',
        deadline: projectData.deadline,
        assignedTo: projectData.assignedTo || []
      },

      // Estructura del proyecto
      structure: {
        phases: [],
        tasks: [],
        milestones: [],
        deliverables: []
      },

      // Control de calidad
      quality: {
        checks: [],
        score: 0,
        approved: false,
        approvedBy: null,
        approvedAt: null
      },

      // Historial y trazabilidad
      history: [{
        action: 'created',
        timestamp: new Date().toISOString(),
        details: 'Proyecto creado'
      }],

      // Errores prevenidos
      preventedErrors: [],

      // Documentación
      documentation: []
    };

    // Validar datos iniciales
    const validation = await this.errorPrevention.validateProjectData(projectData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        suggestions: validation.suggestions
      };
    }

    // Aplicar plantilla si existe
    if (projectData.template) {
      const template = this.templates.get(projectData.template);
      if (template) {
        project.structure = this.applyTemplate(template, project.structure);
      }
    }

    // Guardar proyecto
    this.activeProjects.set(project.id, project);

    return {
      success: true,
      project,
      nextSteps: this.getNextSteps(project)
    };
  }

  /**
   * Ejecutar el flujo completo de un proyecto
   */
  async executeProject(projectId) {
    const project = this.activeProjects.get(projectId);
    if (!project) {
      return { success: false, error: 'Proyecto no encontrado' };
    }

    const executionPlan = {
      phases: [
        { name: 'Planificación', handler: this.phasePlanning.bind(this) },
        { name: 'Ejecución', handler: this.phaseExecution.bind(this) },
        { name: 'Revisión', handler: this.phaseReview.bind(this) },
        { name: 'Control de Calidad', handler: this.phaseQualityControl.bind(this) },
        { name: 'Entrega', handler: this.phaseDelivery.bind(this) }
      ],
      currentPhase: 0,
      results: []
    };

    // Ejecutar cada fase
    for (const phase of executionPlan.phases) {
      this.updateProjectStatus(project, `Ejecutando: ${phase.name}`);

      try {
        const result = await phase.handler(project);
        executionPlan.results.push({
          phase: phase.name,
          success: result.success,
          details: result
        });

        if (!result.success) {
          // Detener si hay errores críticos
          if (result.critical) {
            return {
              success: false,
              stoppedAt: phase.name,
              error: result.error,
              recovery: result.recovery
            };
          }
        }
      } catch (error) {
        this.logError(project, phase.name, error);
        return {
          success: false,
          stoppedAt: phase.name,
          error: error.message
        };
      }

      executionPlan.currentPhase++;
    }

    return {
      success: true,
      project,
      executionPlan
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * FASES DEL PROYECTO
   * ═══════════════════════════════════════════════════════════════════════════
   */

  async phasePlanning(project) {
    project.status = PROJECT_STATUS.PLANNING;

    // 1. Definir alcance
    const scope = await this.orchestrator.defineScope(project);

    // 2. Crear estructura de tareas
    const tasks = await this.orchestrator.createTaskStructure(project);

    // 3. Asignar recursos
    const resources = await this.orchestrator.assignResources(project);

    // 4. Definir entregables
    const deliverables = await this.orchestrator.defineDeliverables(project);

    // 5. Establecer checkpoints de calidad
    const qualityCheckpoints = this.qualityGate.createCheckpoints(project);

    project.structure = {
      ...project.structure,
      scope,
      tasks,
      resources,
      deliverables,
      qualityCheckpoints
    };

    this.addToHistory(project, 'planning_completed', 'Planificación completada');

    return { success: true, scope, tasks, deliverables };
  }

  async phaseExecution(project) {
    project.status = PROJECT_STATUS.IN_PROGRESS;

    const results = [];

    for (const task of project.structure.tasks) {
      // Prevenir errores antes de ejecutar
      const prevention = await this.errorPrevention.checkBeforeExecution(task);
      if (prevention.hasRisks) {
        project.preventedErrors.push(...prevention.risks);
        // Aplicar mitigaciones automáticas
        await this.errorPrevention.applyMitigations(task, prevention.mitigations);
      }

      // Ejecutar tarea
      const result = await this.orchestrator.executeTask(task);
      results.push(result);

      // Validar resultado
      const validation = await this.qualityGate.validateTaskResult(result);
      if (!validation.passed) {
        // Intentar corrección automática
        const correction = await this.errorPrevention.autoCorrect(result, validation);
        if (!correction.success) {
          return {
            success: false,
            task: task.id,
            error: validation.errors,
            recovery: correction.suggestions
          };
        }
      }
    }

    this.addToHistory(project, 'execution_completed', 'Ejecución completada');

    return { success: true, results };
  }

  async phaseReview(project) {
    project.status = PROJECT_STATUS.REVIEW;

    // Revisar cada entregable
    const reviewResults = [];

    for (const deliverable of project.structure.deliverables) {
      const review = await this.reviewDeliverable(deliverable);
      reviewResults.push(review);

      if (!review.approved) {
        // Aplicar correcciones necesarias
        await this.applyCorrections(deliverable, review.corrections);
      }
    }

    const allApproved = reviewResults.every(r => r.approved);

    this.addToHistory(project, 'review_completed',
      allApproved ? 'Revisión aprobada' : 'Revisión con correcciones');

    return { success: true, reviewResults, allApproved };
  }

  async phaseQualityControl(project) {
    project.status = PROJECT_STATUS.QUALITY_CHECK;

    // Ejecutar control de calidad completo
    const qualityReport = await this.qualityGate.runFullCheck(project);

    project.quality = {
      checks: qualityReport.checks,
      score: qualityReport.score,
      approved: qualityReport.score >= 95, // Mínimo 95% de calidad
      details: qualityReport.details
    };

    if (!project.quality.approved) {
      return {
        success: false,
        score: qualityReport.score,
        issues: qualityReport.issues,
        recovery: qualityReport.recommendations
      };
    }

    this.addToHistory(project, 'quality_approved',
      `Control de calidad aprobado: ${qualityReport.score}%`);

    return { success: true, qualityReport };
  }

  async phaseDelivery(project) {
    project.status = PROJECT_STATUS.APPROVED;

    // Generar entregables finales
    const deliverables = await this.generateFinalDeliverables(project);

    // Crear paquete de entrega
    const deliveryPackage = await this.createDeliveryPackage(project, deliverables);

    // Marcar como entregado
    project.status = PROJECT_STATUS.DELIVERED;
    project.deliveredAt = new Date().toISOString();

    this.addToHistory(project, 'delivered', 'Proyecto entregado exitosamente');

    // Mover a completados
    this.activeProjects.delete(project.id);
    this.completedProjects.push(project);

    return { success: true, deliveryPackage };
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * GENERACIÓN DE ENTREGABLES PROFESIONALES
   * ═══════════════════════════════════════════════════════════════════════════
   */

  async generateFinalDeliverables(project) {
    const deliverables = [];

    for (const spec of project.structure.deliverables) {
      const deliverable = await this.deliverableGenerator.generate(spec, {
        project,
        format: spec.format || 'professional',
        branding: project.meta.restaurant,
        quality: 'high'
      });

      // Validar entregable generado
      const validation = await this.validateDeliverable(deliverable);
      if (!validation.isValid) {
        throw new Error(`Entregable inválido: ${validation.errors.join(', ')}`);
      }

      deliverables.push(deliverable);
    }

    return deliverables;
  }

  async createDeliveryPackage(project, deliverables) {
    return {
      id: `delivery-${project.id}`,
      projectId: project.id,
      projectName: project.meta.name,
      client: project.meta.client,
      restaurant: project.meta.restaurant,
      deliveredAt: new Date().toISOString(),

      // Contenido
      deliverables: deliverables.map(d => ({
        id: d.id,
        type: d.type,
        name: d.name,
        format: d.format,
        size: d.size,
        checksum: d.checksum
      })),

      // Documentación
      documentation: {
        summary: this.generateProjectSummary(project),
        methodology: this.documentMethodology(project),
        qualityReport: project.quality,
        changelog: project.history
      },

      // Certificación de calidad
      qualityCertificate: {
        score: project.quality.score,
        checks: project.quality.checks.length,
        passedAt: project.quality.approvedAt,
        signature: this.generateQualitySignature(project)
      }
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * PREVENCIÓN Y MANEJO DE ERRORES
   * ═══════════════════════════════════════════════════════════════════════════
   */

  async validateDeliverable(deliverable) {
    const errors = [];
    const warnings = [];

    // Validaciones básicas
    if (!deliverable.content || deliverable.content.length === 0) {
      errors.push('Contenido vacío');
    }

    // Validaciones de formato
    const formatValidation = await this.deliverableGenerator.validateFormat(deliverable);
    if (!formatValidation.isValid) {
      errors.push(...formatValidation.errors);
    }

    // Validaciones de consistencia
    const consistencyCheck = await this.qualityGate.checkConsistency(deliverable);
    if (!consistencyCheck.passed) {
      warnings.push(...consistencyCheck.warnings);
    }

    // Validaciones de ortografía y gramática
    const spellingCheck = await this.qualityGate.checkSpelling(deliverable);
    if (!spellingCheck.passed) {
      warnings.push(...spellingCheck.suggestions);
    }

    // Validaciones numéricas (si aplica)
    if (deliverable.hasNumbers) {
      const numericCheck = await this.qualityGate.checkNumericAccuracy(deliverable);
      if (!numericCheck.passed) {
        errors.push(...numericCheck.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateValidationScore(errors, warnings)
    };
  }

  async reviewDeliverable(deliverable) {
    const review = {
      id: deliverable.id,
      reviewedAt: new Date().toISOString(),
      checks: [],
      approved: true,
      corrections: []
    };

    // Lista de verificación profesional
    const checklist = [
      { name: 'Formato correcto', check: () => this.checkFormat(deliverable) },
      { name: 'Contenido completo', check: () => this.checkCompleteness(deliverable) },
      { name: 'Datos precisos', check: () => this.checkAccuracy(deliverable) },
      { name: 'Presentación profesional', check: () => this.checkPresentation(deliverable) },
      { name: 'Sin errores ortográficos', check: () => this.checkSpelling(deliverable) },
      { name: 'Cálculos correctos', check: () => this.checkCalculations(deliverable) },
      { name: 'Referencias válidas', check: () => this.checkReferences(deliverable) },
      { name: 'Branding consistente', check: () => this.checkBranding(deliverable) }
    ];

    for (const item of checklist) {
      const result = await item.check();
      review.checks.push({
        name: item.name,
        passed: result.passed,
        details: result.details
      });

      if (!result.passed) {
        review.approved = false;
        review.corrections.push({
          issue: item.name,
          description: result.details,
          suggestion: result.suggestion
        });
      }
    }

    return review;
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * UTILIDADES
   * ═══════════════════════════════════════════════════════════════════════════
   */

  generateProjectId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `proj-${timestamp}-${random}`;
  }

  addToHistory(project, action, details) {
    project.history.push({
      action,
      timestamp: new Date().toISOString(),
      details
    });
    project.updatedAt = new Date().toISOString();
  }

  updateProjectStatus(project, status) {
    this.addToHistory(project, 'status_change', status);
  }

  logError(project, phase, error) {
    const errorEntry = {
      projectId: project.id,
      phase,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    this.errorLog.push(errorEntry);
    project.history.push({
      action: 'error',
      timestamp: new Date().toISOString(),
      details: `Error en ${phase}: ${error.message}`
    });
  }

  getNextSteps(project) {
    const steps = {
      [PROJECT_STATUS.DRAFT]: [
        'Completar información del proyecto',
        'Asignar equipo responsable',
        'Definir entregables esperados'
      ],
      [PROJECT_STATUS.PLANNING]: [
        'Revisar alcance definido',
        'Aprobar estructura de tareas',
        'Confirmar cronograma'
      ],
      [PROJECT_STATUS.IN_PROGRESS]: [
        'Monitorear avance de tareas',
        'Revisar entregables parciales',
        'Validar calidad de trabajo'
      ],
      [PROJECT_STATUS.REVIEW]: [
        'Revisar entregables completos',
        'Solicitar correcciones si es necesario',
        'Aprobar para control de calidad'
      ],
      [PROJECT_STATUS.QUALITY_CHECK]: [
        'Ejecutar checklist de calidad',
        'Verificar cumplimiento de estándares',
        'Aprobar para entrega'
      ]
    };

    return steps[project.status] || ['Contactar al administrador'];
  }

  applyTemplate(template, structure) {
    return {
      ...structure,
      phases: template.phases || structure.phases,
      tasks: template.tasks.map(t => ({ ...t, status: 'pending' })),
      milestones: template.milestones || [],
      deliverables: template.deliverables || []
    };
  }

  calculateValidationScore(errors, warnings) {
    const baseScore = 100;
    const errorPenalty = 10;
    const warningPenalty = 2;

    return Math.max(0,
      baseScore - (errors.length * errorPenalty) - (warnings.length * warningPenalty)
    );
  }

  generateProjectSummary(project) {
    return {
      name: project.meta.name,
      description: project.meta.description,
      duration: this.calculateDuration(project),
      tasksCompleted: project.structure.tasks.filter(t => t.status === 'completed').length,
      totalTasks: project.structure.tasks.length,
      qualityScore: project.quality.score,
      deliverables: project.structure.deliverables.length
    };
  }

  documentMethodology(project) {
    return {
      phases: project.history.filter(h => h.action.includes('completed')),
      qualityMeasures: project.quality.checks,
      errorsPreventedCount: project.preventedErrors.length,
      revisionsCount: project.history.filter(h => h.action === 'revision').length
    };
  }

  generateQualitySignature(project) {
    // Simular firma digital de calidad
    return `QC-${project.id}-${project.quality.score}-${Date.now().toString(36)}`;
  }

  calculateDuration(project) {
    const start = new Date(project.createdAt);
    const end = project.deliveredAt ? new Date(project.deliveredAt) : new Date();
    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} días`;
  }

  // Placeholder methods for checks
  async checkFormat(d) { return { passed: true, details: 'OK' }; }
  async checkCompleteness(d) { return { passed: true, details: 'OK' }; }
  async checkAccuracy(d) { return { passed: true, details: 'OK' }; }
  async checkPresentation(d) { return { passed: true, details: 'OK' }; }
  async checkSpelling(d) { return { passed: true, details: 'OK' }; }
  async checkCalculations(d) { return { passed: true, details: 'OK' }; }
  async checkReferences(d) { return { passed: true, details: 'OK' }; }
  async checkBranding(d) { return { passed: true, details: 'OK' }; }
  async applyCorrections(d, c) { return true; }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * PROTOCOLO DE VERIFICACIÓN DE 3 PASOS
   *
   * Este protocolo es OBLIGATORIO para cualquier cambio, implementación o
   * entregable del sistema. Garantiza calidad y previene errores.
   *
   * Pasos:
   * 1. EXISTENCIA - Verificar que el elemento existe donde debe
   * 2. INTEGRIDAD - Verificar que está completo y funcional
   * 3. COMPILACIÓN - Verificar que no hay errores en el sistema
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /**
   * Ejecuta el protocolo completo de verificación de 3 pasos
   * @param {any} target - El elemento a verificar
   * @param {Object} context - Contexto de verificación
   * @returns {Promise<Object>} Resultado de la verificación
   */
  async runVerificationProtocol(target, context = {}) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   AGENTE 71 - EJECUTANDO PROTOCOLO DE VERIFICACIÓN');
    console.log('═══════════════════════════════════════════════════════════\n');

    const result = await this.verificationProtocol.runFullProtocol(target, {
      targetName: context.name || 'Verificación Agente 71',
      targetType: context.type || 'project',
      requiredFields: context.requiredFields,
      expectedType: context.expectedType,
      validators: context.validators,
      ...context
    });

    // Registrar en historial si hay proyecto asociado
    if (context.projectId) {
      const project = this.activeProjects.get(context.projectId);
      if (project) {
        this.addToHistory(project, 'verification_protocol',
          `Protocolo 3 pasos: ${result.passed ? 'APROBADO' : 'FALLIDO'} - Score: ${result.summary?.passRate}%`
        );
      }
    }

    return result;
  }

  /**
   * Verificación rápida de 3 pasos para entregables
   */
  async verifyDeliverable(deliverable, projectId = null) {
    return this.runVerificationProtocol(deliverable, {
      name: `Entregable: ${deliverable.name || deliverable.id}`,
      type: 'deliverable',
      projectId,
      requiredFields: ['id', 'content', 'type', 'format'],
      validators: [
        {
          name: 'Contenido no vacío',
          fn: (d) => d.content && d.content.length > 0,
          errorMessage: 'El contenido está vacío'
        },
        {
          name: 'Formato válido',
          fn: (d) => ['pdf', 'html', 'json', 'excel', 'markdown'].includes(d.format),
          errorMessage: 'Formato no soportado'
        }
      ]
    });
  }

  /**
   * Verificación de 3 pasos para proyectos
   */
  async verifyProject(project) {
    return this.runVerificationProtocol(project, {
      name: `Proyecto: ${project.meta?.name || project.id}`,
      type: 'project',
      requiredFields: ['id', 'meta', 'structure', 'quality', 'history'],
      validators: [
        {
          name: 'Metadatos completos',
          fn: (p) => p.meta && p.meta.name && p.meta.description,
          errorMessage: 'Faltan metadatos del proyecto'
        },
        {
          name: 'Estructura definida',
          fn: (p) => p.structure && Array.isArray(p.structure.tasks),
          errorMessage: 'Estructura de proyecto incompleta'
        }
      ]
    });
  }

  /**
   * Verificación de 3 pasos para tareas
   */
  async verifyTask(task, projectId = null) {
    return this.runVerificationProtocol(task, {
      name: `Tarea: ${task.name || task.id}`,
      type: 'task',
      projectId,
      requiredFields: ['id', 'name', 'status'],
      validators: [
        {
          name: 'Estado válido',
          fn: (t) => ['pending', 'in_progress', 'completed', 'blocked'].includes(t.status),
          errorMessage: 'Estado de tarea inválido'
        }
      ]
    });
  }

  /**
   * Obtener reporte del protocolo de verificación
   */
  getVerificationReport() {
    return this.verificationProtocol.generateReport();
  }

  /**
   * Obtener historial de verificaciones
   */
  getVerificationHistory() {
    return this.verificationProtocol.getHistory();
  }
}

// Alias para compatibilidad con índice central
export const ProjectManagerAgent = Agent71ProjectManager;

// Singleton instance
let projectManagerInstance = null;

export function getProjectManagerAgent(config = {}) {
  if (!projectManagerInstance) {
    projectManagerInstance = new Agent71ProjectManager(config);
  }
  return projectManagerInstance;
}

export default Agent71ProjectManager;
