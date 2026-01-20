/**
 * Project Templates - Plantillas de Proyectos Gastronómicos
 * Estructuras predefinidas para diferentes tipos de proyectos
 */

export const PROJECT_TEMPLATES = {
  // Plantilla para Análisis de Menú
  menuAnalysis: {
    id: 'template-menu-analysis',
    name: 'Análisis de Menú',
    description: 'Análisis completo de rentabilidad y optimización de menú',
    category: 'analysis',
    phases: ['preparation', 'analysis', 'development', 'review', 'delivery'],
    tasks: [
      {
        phase: 'preparation',
        name: 'Recopilación de datos del menú actual',
        checklist: [
          'Lista completa de platillos',
          'Precios de venta actuales',
          'Costos de ingredientes',
          'Ventas históricas (mínimo 3 meses)'
        ],
        estimatedHours: 2
      },
      {
        phase: 'analysis',
        name: 'Análisis de rentabilidad por platillo',
        checklist: [
          'Cálculo de food cost por platillo',
          'Cálculo de margen de contribución',
          'Análisis de popularidad',
          'Matriz de ingeniería de menú'
        ],
        estimatedHours: 4
      },
      {
        phase: 'development',
        name: 'Desarrollo de recomendaciones',
        checklist: [
          'Identificar platillos estrella',
          'Identificar platillos problema',
          'Propuestas de ajuste de precios',
          'Sugerencias de eliminación/adición'
        ],
        estimatedHours: 3
      },
      {
        phase: 'review',
        name: 'Revisión y validación',
        checklist: [
          'Verificar cálculos',
          'Validar recomendaciones',
          'Revisar formato del reporte'
        ],
        estimatedHours: 2
      },
      {
        phase: 'delivery',
        name: 'Preparación de entregables',
        checklist: [
          'Reporte ejecutivo',
          'Matriz de ingeniería',
          'Plan de acción'
        ],
        estimatedHours: 1
      }
    ],
    deliverables: [
      {
        type: 'report',
        name: 'Reporte de Análisis de Menú',
        format: 'PDF',
        required: true
      },
      {
        type: 'spreadsheet',
        name: 'Matriz de Ingeniería de Menú',
        format: 'XLSX',
        required: true
      },
      {
        type: 'presentation',
        name: 'Resumen Ejecutivo',
        format: 'PDF',
        required: false
      }
    ],
    validationRules: {
      foodCostMax: 35,
      marginMin: 65,
      dataMinMonths: 3
    }
  },

  // Plantilla para Receta Estándar
  recipeStandard: {
    id: 'template-recipe-standard',
    name: 'Receta Estándar',
    description: 'Documentación profesional de receta con costeo',
    category: 'documentation',
    phases: ['preparation', 'development', 'review', 'delivery'],
    tasks: [
      {
        phase: 'preparation',
        name: 'Recopilación de información',
        checklist: [
          'Ingredientes con cantidades exactas',
          'Procedimiento paso a paso',
          'Tiempos de preparación',
          'Equipamiento necesario'
        ],
        estimatedHours: 1
      },
      {
        phase: 'development',
        name: 'Elaboración de receta estándar',
        checklist: [
          'Formato profesional aplicado',
          'Fotografía del platillo',
          'Costeo de ingredientes',
          'Cálculo de rendimiento'
        ],
        estimatedHours: 2
      },
      {
        phase: 'review',
        name: 'Validación',
        checklist: [
          'Verificar cantidades',
          'Validar costos actualizados',
          'Revisar procedimiento'
        ],
        estimatedHours: 1
      },
      {
        phase: 'delivery',
        name: 'Entrega',
        checklist: [
          'Receta en formato final',
          'Ficha técnica',
          'Hoja de costeo'
        ],
        estimatedHours: 0.5
      }
    ],
    deliverables: [
      {
        type: 'recipe',
        name: 'Receta Estándar',
        format: 'PDF',
        required: true
      },
      {
        type: 'costSheet',
        name: 'Hoja de Costeo',
        format: 'XLSX',
        required: true
      }
    ],
    validationRules: {
      foodCostMax: 35,
      portionVarianceMax: 5
    }
  },

  // Plantilla para Consultoría de Apertura
  openingConsulting: {
    id: 'template-opening',
    name: 'Consultoría de Apertura',
    description: 'Asesoría completa para apertura de establecimiento',
    category: 'consulting',
    phases: ['preparation', 'analysis', 'development', 'review', 'delivery'],
    tasks: [
      {
        phase: 'preparation',
        name: 'Análisis de concepto',
        checklist: [
          'Definición del concepto',
          'Público objetivo',
          'Ubicación y zona',
          'Presupuesto disponible'
        ],
        estimatedHours: 4
      },
      {
        phase: 'analysis',
        name: 'Estudio de mercado',
        checklist: [
          'Análisis de competencia',
          'Análisis de demanda',
          'Precios de referencia',
          'Tendencias del mercado'
        ],
        estimatedHours: 8
      },
      {
        phase: 'development',
        name: 'Desarrollo del plan',
        checklist: [
          'Plan de menú',
          'Plan operativo',
          'Proyección financiera',
          'Plan de marketing inicial'
        ],
        estimatedHours: 16
      },
      {
        phase: 'review',
        name: 'Revisión integral',
        checklist: [
          'Validar viabilidad financiera',
          'Revisar plan operativo',
          'Verificar consistencia'
        ],
        estimatedHours: 4
      },
      {
        phase: 'delivery',
        name: 'Entrega de documentación',
        checklist: [
          'Plan de negocios completo',
          'Manual operativo',
          'Proyecciones financieras',
          'Presentación ejecutiva'
        ],
        estimatedHours: 2
      }
    ],
    deliverables: [
      {
        type: 'businessPlan',
        name: 'Plan de Negocios',
        format: 'PDF',
        required: true
      },
      {
        type: 'financialProjection',
        name: 'Proyección Financiera',
        format: 'XLSX',
        required: true
      },
      {
        type: 'operationalManual',
        name: 'Manual Operativo',
        format: 'PDF',
        required: true
      },
      {
        type: 'presentation',
        name: 'Presentación Ejecutiva',
        format: 'PPTX',
        required: true
      }
    ],
    validationRules: {
      roiMinMonths: 24,
      breakEvenMaxMonths: 18
    }
  },

  // Plantilla para Auditoría de Costos
  costAudit: {
    id: 'template-cost-audit',
    name: 'Auditoría de Costos',
    description: 'Análisis completo de estructura de costos',
    category: 'audit',
    phases: ['preparation', 'analysis', 'development', 'review', 'delivery'],
    tasks: [
      {
        phase: 'preparation',
        name: 'Recopilación de información financiera',
        checklist: [
          'Estados financieros (6 meses mínimo)',
          'Facturas de proveedores',
          'Inventarios',
          'Nómina y gastos operativos'
        ],
        estimatedHours: 4
      },
      {
        phase: 'analysis',
        name: 'Análisis de costos',
        checklist: [
          'Análisis de food cost real',
          'Análisis de labor cost',
          'Análisis de gastos operativos',
          'Identificación de fugas'
        ],
        estimatedHours: 8
      },
      {
        phase: 'development',
        name: 'Desarrollo de hallazgos',
        checklist: [
          'Documentar hallazgos',
          'Calcular impacto económico',
          'Desarrollar recomendaciones',
          'Plan de acción correctivo'
        ],
        estimatedHours: 6
      },
      {
        phase: 'review',
        name: 'Revisión',
        checklist: [
          'Validar cálculos',
          'Verificar recomendaciones',
          'Revisar plan de acción'
        ],
        estimatedHours: 2
      },
      {
        phase: 'delivery',
        name: 'Entrega',
        checklist: [
          'Informe de auditoría',
          'Plan de mejora',
          'Presentación de resultados'
        ],
        estimatedHours: 2
      }
    ],
    deliverables: [
      {
        type: 'auditReport',
        name: 'Informe de Auditoría',
        format: 'PDF',
        required: true
      },
      {
        type: 'analysis',
        name: 'Análisis Detallado',
        format: 'XLSX',
        required: true
      },
      {
        type: 'actionPlan',
        name: 'Plan de Mejora',
        format: 'PDF',
        required: true
      }
    ],
    validationRules: {
      foodCostVarianceMax: 3,
      laborCostMax: 35
    }
  },

  // Plantilla para Capacitación
  training: {
    id: 'template-training',
    name: 'Programa de Capacitación',
    description: 'Diseño y desarrollo de programa de capacitación',
    category: 'training',
    phases: ['preparation', 'development', 'review', 'delivery'],
    tasks: [
      {
        phase: 'preparation',
        name: 'Diagnóstico de necesidades',
        checklist: [
          'Evaluación de personal',
          'Identificación de brechas',
          'Definición de objetivos',
          'Recursos disponibles'
        ],
        estimatedHours: 3
      },
      {
        phase: 'development',
        name: 'Desarrollo del programa',
        checklist: [
          'Diseño curricular',
          'Desarrollo de contenidos',
          'Material didáctico',
          'Evaluaciones'
        ],
        estimatedHours: 12
      },
      {
        phase: 'review',
        name: 'Validación',
        checklist: [
          'Revisar contenidos',
          'Validar metodología',
          'Verificar materiales'
        ],
        estimatedHours: 2
      },
      {
        phase: 'delivery',
        name: 'Entrega',
        checklist: [
          'Manual del instructor',
          'Material del participante',
          'Evaluaciones',
          'Cronograma'
        ],
        estimatedHours: 1
      }
    ],
    deliverables: [
      {
        type: 'curriculum',
        name: 'Programa de Capacitación',
        format: 'PDF',
        required: true
      },
      {
        type: 'materials',
        name: 'Material Didáctico',
        format: 'PDF',
        required: true
      },
      {
        type: 'evaluations',
        name: 'Evaluaciones',
        format: 'PDF',
        required: true
      }
    ],
    validationRules: {
      minContentHours: 4,
      evaluationRequired: true
    }
  }
};

// Plantilla base para proyectos personalizados
export const BASE_PROJECT_STRUCTURE = {
  meta: {
    id: null,
    name: '',
    description: '',
    client: '',
    createdAt: null,
    updatedAt: null,
    status: 'draft',
    priority: 'normal',
    deadline: null
  },
  structure: {
    phases: [],
    tasks: [],
    deliverables: [],
    milestones: []
  },
  quality: {
    score: 0,
    checkpoints: [],
    validations: [],
    approvals: []
  },
  history: [],
  documentation: []
};

export class ProjectTemplates {
  constructor() {
    this.templates = PROJECT_TEMPLATES;
  }

  getTemplate(templateId) {
    return this.templates[templateId] || null;
  }

  getAllTemplates() {
    return Object.values(this.templates);
  }

  getTemplatesByCategory(category) {
    return Object.values(this.templates).filter(t => t.category === category);
  }

  createProjectFromTemplate(templateId, projectData) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const project = JSON.parse(JSON.stringify(BASE_PROJECT_STRUCTURE));

    // Asignar metadata
    project.meta = {
      ...project.meta,
      id: `proj-${Date.now()}`,
      name: projectData.name || template.name,
      description: projectData.description || template.description,
      client: projectData.client || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateUsed: templateId,
      deadline: projectData.deadline || null
    };

    // Asignar estructura
    project.structure = {
      phases: template.phases,
      tasks: template.tasks.map((task, index) => ({
        id: `task-${index + 1}`,
        ...task,
        status: 'pending',
        assignedTo: null,
        startedAt: null,
        completedAt: null
      })),
      deliverables: template.deliverables.map((del, index) => ({
        id: `del-${index + 1}`,
        ...del,
        status: 'pending',
        content: null,
        validated: false
      })),
      milestones: this.generateMilestones(template)
    };

    // Inicializar quality gates
    project.quality = {
      score: 0,
      checkpoints: this.generateCheckpoints(template),
      validations: [],
      approvals: [],
      rules: template.validationRules
    };

    // Registro inicial en historial
    project.history.push({
      action: 'created',
      timestamp: new Date().toISOString(),
      details: `Proyecto creado desde plantilla: ${template.name}`,
      user: 'system'
    });

    return project;
  }

  generateMilestones(template) {
    const milestones = [];
    let taskCount = 0;

    for (const phase of template.phases) {
      const phaseTasks = template.tasks.filter(t => t.phase === phase);
      taskCount += phaseTasks.length;

      milestones.push({
        id: `milestone-${phase}`,
        phase,
        name: `Completar fase: ${this.getPhaseName(phase)}`,
        tasksToComplete: phaseTasks.length,
        status: 'pending'
      });
    }

    return milestones;
  }

  generateCheckpoints(template) {
    return template.phases.map((phase, index) => ({
      id: `checkpoint-${index + 1}`,
      phase,
      name: `Checkpoint: ${this.getPhaseName(phase)}`,
      criteria: this.getCheckpointCriteria(phase),
      passed: false,
      checkedAt: null
    }));
  }

  getPhaseName(phase) {
    const names = {
      preparation: 'Preparación',
      analysis: 'Análisis',
      development: 'Desarrollo',
      review: 'Revisión',
      delivery: 'Entrega'
    };
    return names[phase] || phase;
  }

  getCheckpointCriteria(phase) {
    const criteria = {
      preparation: [
        'Datos completos recopilados',
        'Información validada',
        'Recursos identificados'
      ],
      analysis: [
        'Análisis completado',
        'Resultados verificados',
        'Metodología documentada'
      ],
      development: [
        'Entregables en desarrollo',
        'Formato correcto aplicado',
        'Contenido revisado'
      ],
      review: [
        'Revisión interna completada',
        'Errores corregidos',
        'Aprobación interna obtenida'
      ],
      delivery: [
        'Entregables finalizados',
        'Calidad verificada (>95%)',
        'Documentación completa'
      ]
    };
    return criteria[phase] || [];
  }

  // Validar que un proyecto cumple con los requisitos de la plantilla
  validateProjectAgainstTemplate(project) {
    const template = this.getTemplate(project.meta.templateUsed);
    if (!template) {
      return { valid: false, errors: ['Template not found'] };
    }

    const errors = [];
    const warnings = [];

    // Verificar tareas completadas
    const completedTasks = project.structure.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = template.tasks.length;
    if (completedTasks < totalTasks) {
      errors.push(`Faltan ${totalTasks - completedTasks} tareas por completar`);
    }

    // Verificar entregables
    const requiredDeliverables = template.deliverables.filter(d => d.required);
    for (const required of requiredDeliverables) {
      const deliverable = project.structure.deliverables.find(d => d.type === required.type);
      if (!deliverable || !deliverable.content) {
        errors.push(`Falta entregable requerido: ${required.name}`);
      }
    }

    // Verificar reglas de validación
    if (template.validationRules) {
      // Aquí se aplicarían las reglas específicas de cada plantilla
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      completionRate: (completedTasks / totalTasks) * 100
    };
  }
}

export default ProjectTemplates;
