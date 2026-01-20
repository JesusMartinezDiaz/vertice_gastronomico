/**
 * ProjectManager - Gestión de Proyectos de Consultoría
 *
 * Vértice Gastronómico trabaja por proyectos con sus clientes.
 * Cada proyecto tiene objetivos, entregables, y un equipo asignado.
 */

// Estados de proyecto
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  PROPOSED: 'proposed',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Tipos de proyecto
export const PROJECT_TYPES = {
  // Diagnóstico
  DIAGNOSTIC: {
    name: 'Diagnóstico Integral',
    description: 'Evaluación completa del negocio',
    typicalDuration: 30, // días
    defaultAgents: [1, 2, 3, 7, 18, 26] // CFO, Controller, Auditor, Gerente Op, Chef Ejec
  },

  // Financiero
  FINANCIAL_RESTRUCTURE: {
    name: 'Reestructuración Financiera',
    description: 'Optimización de costos y flujo de caja',
    typicalDuration: 60,
    defaultAgents: [1, 2, 3, 4, 5, 6]
  },

  // Operaciones
  OPERATIONS_OPTIMIZATION: {
    name: 'Optimización Operativa',
    description: 'Mejora de procesos y eficiencia',
    typicalDuration: 45,
    defaultAgents: [18, 19, 20, 21, 22, 23, 24, 25]
  },

  // Cocina
  MENU_ENGINEERING: {
    name: 'Ingeniería de Menú',
    description: 'Diseño y costeo de menú optimizado',
    typicalDuration: 30,
    defaultAgents: [26, 27, 28, 29, 30, 31, 32, 33]
  },

  // Apertura
  NEW_OPENING: {
    name: 'Apertura de Restaurante',
    description: 'Acompañamiento integral para nueva apertura',
    typicalDuration: 90,
    defaultAgents: 'all' // Todos los agentes
  },

  // Capacitación
  TRAINING_PROGRAM: {
    name: 'Programa de Capacitación',
    description: 'Desarrollo de competencias del equipo',
    typicalDuration: 30,
    defaultAgents: [19, 22, 26, 27]
  },

  // Legal/Compliance
  LEGAL_COMPLIANCE: {
    name: 'Cumplimiento Legal',
    description: 'Regularización y compliance',
    typicalDuration: 45,
    defaultAgents: [34, 35, 36, 37, 38, 39]
  },

  // Custom
  CUSTOM: {
    name: 'Proyecto Personalizado',
    description: 'Proyecto a medida',
    typicalDuration: null,
    defaultAgents: []
  }
};

// Prioridades de tareas
export const TASK_PRIORITY = {
  CRITICAL: { level: 1, name: 'Crítica', color: '#dc2626' },
  HIGH: { level: 2, name: 'Alta', color: '#ea580c' },
  MEDIUM: { level: 3, name: 'Media', color: '#ca8a04' },
  LOW: { level: 4, name: 'Baja', color: '#16a34a' }
};

/**
 * Clase Milestone - Hitos del proyecto
 */
export class Milestone {
  constructor(config = {}) {
    this.id = config.id || this.generateId();
    this.name = config.name || '';
    this.description = config.description || '';
    this.dueDate = config.dueDate || null;
    this.completedDate = config.completedDate || null;
    this.isCompleted = config.isCompleted || false;
    this.deliverables = config.deliverables || [];
    this.order = config.order || 0;
  }

  generateId() {
    return `MIL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  complete() {
    this.isCompleted = true;
    this.completedDate = new Date();
  }
}

/**
 * Clase ProjectTask - Tarea del proyecto
 */
export class ProjectTask {
  constructor(config = {}) {
    this.id = config.id || this.generateId();
    this.title = config.title || '';
    this.description = config.description || '';
    this.assignedTo = config.assignedTo || null; // Consultor ID
    this.agentId = config.agentId || null; // Agente IA asignado
    this.milestoneId = config.milestoneId || null;
    this.priority = config.priority || 'MEDIUM';
    this.status = config.status || 'pending'; // pending, in_progress, review, completed
    this.dueDate = config.dueDate || null;
    this.estimatedHours = config.estimatedHours || 0;
    this.actualHours = config.actualHours || 0;
    this.createdAt = config.createdAt || new Date();
    this.completedAt = config.completedAt || null;
    this.notes = config.notes || [];
    this.attachments = config.attachments || [];
  }

  generateId() {
    return `TSK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  addNote(note, author) {
    this.notes.push({
      id: `NOTE-${Date.now()}`,
      content: note,
      author,
      createdAt: new Date()
    });
  }

  complete() {
    this.status = 'completed';
    this.completedAt = new Date();
  }
}

/**
 * Clase Deliverable - Entregable del proyecto
 */
export class Deliverable {
  constructor(config = {}) {
    this.id = config.id || this.generateId();
    this.name = config.name || '';
    this.description = config.description || '';
    this.type = config.type || 'document'; // document, report, presentation, spreadsheet, other
    this.format = config.format || 'pdf';
    this.status = config.status || 'pending'; // pending, in_progress, review, approved, delivered
    this.milestoneId = config.milestoneId || null;
    this.assignedAgents = config.assignedAgents || [];
    this.dueDate = config.dueDate || null;
    this.deliveredDate = config.deliveredDate || null;
    this.versions = config.versions || [];
    this.currentVersion = config.currentVersion || null;
    this.approvedBy = config.approvedBy || null;
    this.approvedAt = config.approvedAt || null;
  }

  generateId() {
    return `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  addVersion(file, uploadedBy) {
    const version = {
      number: this.versions.length + 1,
      file,
      uploadedBy,
      uploadedAt: new Date()
    };
    this.versions.push(version);
    this.currentVersion = version.number;
    return version;
  }

  approve(approvedBy) {
    this.status = 'approved';
    this.approvedBy = approvedBy;
    this.approvedAt = new Date();
  }

  deliver() {
    this.status = 'delivered';
    this.deliveredDate = new Date();
  }
}

/**
 * Clase Project - Proyecto de consultoría
 */
export class Project {
  constructor(config = {}) {
    // Identificación
    this.id = config.id || this.generateProjectId();
    this.code = config.code || this.generateProjectCode();
    this.name = config.name || '';
    this.description = config.description || '';

    // Cliente
    this.clientId = config.clientId || null;
    this.clientName = config.clientName || '';

    // Tipo y estado
    this.type = config.type || 'CUSTOM';
    this.status = config.status || PROJECT_STATUS.DRAFT;

    // Equipo
    this.projectLead = config.projectLead || null; // Consultor líder
    this.team = config.team || []; // IDs de consultores
    this.assignedAgents = config.assignedAgents || []; // IDs de agentes IA

    // Fechas
    this.createdAt = config.createdAt || new Date();
    this.startDate = config.startDate || null;
    this.targetEndDate = config.targetEndDate || null;
    this.actualEndDate = config.actualEndDate || null;

    // Componentes del proyecto
    this.milestones = new Map();
    this.tasks = new Map();
    this.deliverables = new Map();

    // Inicializar desde config
    if (config.milestones) {
      config.milestones.forEach(m => this.addMilestone(m));
    }
    if (config.tasks) {
      config.tasks.forEach(t => this.addTask(t));
    }
    if (config.deliverables) {
      config.deliverables.forEach(d => this.addDeliverable(d));
    }

    // Presupuesto
    this.budget = {
      estimated: config.estimatedBudget || 0,
      actual: config.actualBudget || 0,
      currency: config.currency || 'MXN'
    };

    // Horas
    this.hours = {
      estimated: config.estimatedHours || 0,
      actual: 0
    };

    // Notas y comunicación
    this.notes = config.notes || [];
    this.updates = [];
  }

  generateProjectId() {
    return `PRJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateProjectCode() {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `VG${year}-${random}`;
  }

  // ============ MILESTONES ============

  addMilestone(milestoneData) {
    const milestone = milestoneData instanceof Milestone
      ? milestoneData
      : new Milestone(milestoneData);
    this.milestones.set(milestone.id, milestone);
    return milestone;
  }

  getMilestone(milestoneId) {
    return this.milestones.get(milestoneId);
  }

  getMilestones() {
    return Array.from(this.milestones.values())
      .sort((a, b) => a.order - b.order);
  }

  completeMilestone(milestoneId) {
    const milestone = this.milestones.get(milestoneId);
    if (milestone) {
      milestone.complete();
      this.addUpdate('milestone_completed', { milestoneId, name: milestone.name });
    }
    return milestone;
  }

  // ============ TASKS ============

  addTask(taskData) {
    const task = taskData instanceof ProjectTask
      ? taskData
      : new ProjectTask(taskData);
    this.tasks.set(task.id, task);
    return task;
  }

  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  getTasks(filters = {}) {
    let tasks = Array.from(this.tasks.values());

    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters.milestoneId) {
      tasks = tasks.filter(t => t.milestoneId === filters.milestoneId);
    }
    if (filters.assignedTo) {
      tasks = tasks.filter(t => t.assignedTo === filters.assignedTo);
    }
    if (filters.agentId) {
      tasks = tasks.filter(t => t.agentId === filters.agentId);
    }

    return tasks.sort((a, b) => {
      const priorityA = TASK_PRIORITY[a.priority]?.level || 3;
      const priorityB = TASK_PRIORITY[b.priority]?.level || 3;
      return priorityA - priorityB;
    });
  }

  updateTaskStatus(taskId, status) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
        this.hours.actual += task.actualHours || task.estimatedHours || 0;
      }
      this.addUpdate('task_status_changed', { taskId, title: task.title, status });
    }
    return task;
  }

  // ============ DELIVERABLES ============

  addDeliverable(deliverableData) {
    const deliverable = deliverableData instanceof Deliverable
      ? deliverableData
      : new Deliverable(deliverableData);
    this.deliverables.set(deliverable.id, deliverable);
    return deliverable;
  }

  getDeliverable(deliverableId) {
    return this.deliverables.get(deliverableId);
  }

  getDeliverables(filters = {}) {
    let deliverables = Array.from(this.deliverables.values());

    if (filters.status) {
      deliverables = deliverables.filter(d => d.status === filters.status);
    }
    if (filters.milestoneId) {
      deliverables = deliverables.filter(d => d.milestoneId === filters.milestoneId);
    }

    return deliverables;
  }

  // ============ ESTADO DEL PROYECTO ============

  start() {
    if (this.status !== PROJECT_STATUS.APPROVED) {
      throw new Error('El proyecto debe estar aprobado para iniciarse');
    }
    this.status = PROJECT_STATUS.IN_PROGRESS;
    this.startDate = new Date();
    this.addUpdate('project_started', {});
  }

  complete() {
    this.status = PROJECT_STATUS.COMPLETED;
    this.actualEndDate = new Date();
    this.addUpdate('project_completed', {});
  }

  hold(reason) {
    this.status = PROJECT_STATUS.ON_HOLD;
    this.addUpdate('project_on_hold', { reason });
  }

  resume() {
    this.status = PROJECT_STATUS.IN_PROGRESS;
    this.addUpdate('project_resumed', {});
  }

  cancel(reason) {
    this.status = PROJECT_STATUS.CANCELLED;
    this.addUpdate('project_cancelled', { reason });
  }

  // ============ PROGRESO ============

  getProgress() {
    const tasks = Array.from(this.tasks.values());
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    const deliverables = Array.from(this.deliverables.values());
    const totalDeliverables = deliverables.length;
    const deliveredDeliverables = deliverables.filter(d =>
      d.status === 'delivered' || d.status === 'approved'
    ).length;

    const milestones = Array.from(this.milestones.values());
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.isCompleted).length;

    return {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      deliverables: {
        total: totalDeliverables,
        delivered: deliveredDeliverables,
        percentage: totalDeliverables > 0 ? Math.round((deliveredDeliverables / totalDeliverables) * 100) : 0
      },
      milestones: {
        total: totalMilestones,
        completed: completedMilestones,
        percentage: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
      },
      overall: this.calculateOverallProgress(tasks, deliverables, milestones),
      hours: {
        estimated: this.hours.estimated,
        actual: this.hours.actual,
        percentage: this.hours.estimated > 0 ? Math.round((this.hours.actual / this.hours.estimated) * 100) : 0
      },
      budget: {
        estimated: this.budget.estimated,
        actual: this.budget.actual,
        percentage: this.budget.estimated > 0 ? Math.round((this.budget.actual / this.budget.estimated) * 100) : 0
      }
    };
  }

  calculateOverallProgress(tasks, deliverables, milestones) {
    // Pesos: tareas 40%, entregables 40%, hitos 20%
    const taskProgress = tasks.length > 0
      ? (tasks.filter(t => t.status === 'completed').length / tasks.length)
      : 0;

    const deliverableProgress = deliverables.length > 0
      ? (deliverables.filter(d => d.status === 'delivered' || d.status === 'approved').length / deliverables.length)
      : 0;

    const milestoneProgress = milestones.length > 0
      ? (milestones.filter(m => m.isCompleted).length / milestones.length)
      : 0;

    return Math.round((taskProgress * 0.4 + deliverableProgress * 0.4 + milestoneProgress * 0.2) * 100);
  }

  // ============ ACTUALIZACIONES ============

  addUpdate(type, data) {
    this.updates.push({
      id: `UPD-${Date.now()}`,
      type,
      data,
      timestamp: new Date()
    });
  }

  addNote(note, author) {
    this.notes.push({
      id: `NOTE-${Date.now()}`,
      content: note,
      author,
      createdAt: new Date()
    });
  }

  // ============ RESUMEN ============

  getSummary() {
    const progress = this.getProgress();

    return {
      id: this.id,
      code: this.code,
      name: this.name,
      clientId: this.clientId,
      clientName: this.clientName,
      type: this.type,
      status: this.status,
      projectLead: this.projectLead,
      teamSize: this.team.length,
      agentsCount: this.assignedAgents.length,
      startDate: this.startDate,
      targetEndDate: this.targetEndDate,
      progress: progress.overall,
      taskProgress: progress.tasks.percentage,
      deliverableProgress: progress.deliverables.percentage,
      budgetUsage: progress.budget.percentage,
      hoursUsage: progress.hours.percentage
    };
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      clientId: this.clientId,
      clientName: this.clientName,
      type: this.type,
      status: this.status,
      projectLead: this.projectLead,
      team: this.team,
      assignedAgents: this.assignedAgents,
      startDate: this.startDate,
      targetEndDate: this.targetEndDate,
      actualEndDate: this.actualEndDate,
      milestones: Array.from(this.milestones.values()),
      tasks: Array.from(this.tasks.values()),
      deliverables: Array.from(this.deliverables.values()),
      budget: this.budget,
      hours: this.hours,
      notes: this.notes,
      updates: this.updates,
      progress: this.getProgress()
    };
  }
}

/**
 * ProjectManager - Gestor de proyectos
 */
export class ProjectManager {
  constructor() {
    this.projects = new Map();
    this.listeners = new Map();
  }

  // ============ CRUD DE PROYECTOS ============

  createProject(projectData) {
    const project = new Project(projectData);
    this.projects.set(project.id, project);
    this.emit('project:created', { project: project.getSummary() });
    return project;
  }

  createFromTemplate(type, clientId, clientName, customizations = {}) {
    const template = PROJECT_TYPES[type];
    if (!template) {
      throw new Error(`Tipo de proyecto no válido: ${type}`);
    }

    const projectData = {
      clientId,
      clientName,
      type,
      name: customizations.name || `${template.name} - ${clientName}`,
      description: customizations.description || template.description,
      assignedAgents: template.defaultAgents === 'all'
        ? Array.from({ length: 72 }, (_, i) => i + 1)
        : template.defaultAgents,
      ...customizations
    };

    // Calcular fecha objetivo si no se especifica
    if (!projectData.targetEndDate && template.typicalDuration) {
      const target = new Date();
      target.setDate(target.getDate() + template.typicalDuration);
      projectData.targetEndDate = target;
    }

    return this.createProject(projectData);
  }

  getProject(projectId) {
    return this.projects.get(projectId);
  }

  getProjectByCode(code) {
    for (const project of this.projects.values()) {
      if (project.code === code) {
        return project;
      }
    }
    return null;
  }

  listProjects(filters = {}) {
    let projects = Array.from(this.projects.values());

    if (filters.clientId) {
      projects = projects.filter(p => p.clientId === filters.clientId);
    }
    if (filters.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    if (filters.type) {
      projects = projects.filter(p => p.type === filters.type);
    }
    if (filters.projectLead) {
      projects = projects.filter(p => p.projectLead === filters.projectLead);
    }

    return projects.map(p => p.getSummary());
  }

  deleteProject(projectId) {
    const project = this.projects.get(projectId);
    if (project) {
      this.projects.delete(projectId);
      this.emit('project:deleted', { projectId, code: project.code });
    }
  }

  // ============ REPORTES ============

  getProjectsOverview() {
    const projects = Array.from(this.projects.values());

    const overview = {
      generatedAt: new Date(),
      total: projects.length,
      byStatus: {},
      byType: {},
      activeProjects: [],
      atRisk: [],
      upcoming: []
    };

    // Por estado
    Object.values(PROJECT_STATUS).forEach(status => {
      overview.byStatus[status] = projects.filter(p => p.status === status).length;
    });

    // Por tipo
    Object.keys(PROJECT_TYPES).forEach(type => {
      overview.byType[type] = projects.filter(p => p.type === type).length;
    });

    // Proyectos activos
    overview.activeProjects = projects
      .filter(p => p.status === PROJECT_STATUS.IN_PROGRESS)
      .map(p => p.getSummary());

    // Proyectos en riesgo (retrasados o sobre presupuesto)
    overview.atRisk = projects
      .filter(p => {
        if (p.status !== PROJECT_STATUS.IN_PROGRESS) return false;

        const progress = p.getProgress();

        // Retrasado: menos del 50% completado y pasó más del 75% del tiempo
        if (p.startDate && p.targetEndDate) {
          const totalDays = (p.targetEndDate - p.startDate) / (1000 * 60 * 60 * 24);
          const elapsedDays = (new Date() - p.startDate) / (1000 * 60 * 60 * 24);
          const timePercentage = (elapsedDays / totalDays) * 100;

          if (timePercentage > 75 && progress.overall < 50) {
            return true;
          }
        }

        // Sobre presupuesto
        if (progress.budget.percentage > 90) {
          return true;
        }

        return false;
      })
      .map(p => p.getSummary());

    // Próximos a vencer (en los próximos 7 días)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    overview.upcoming = projects
      .filter(p =>
        p.status === PROJECT_STATUS.IN_PROGRESS &&
        p.targetEndDate &&
        new Date(p.targetEndDate) <= nextWeek
      )
      .map(p => p.getSummary());

    return overview;
  }

  // ============ EVENTOS ============

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (error) {
        console.error(`Error en listener de ${event}:`, error);
      }
    });
  }
}

// Singleton
let projectManagerInstance = null;

export function getProjectManager() {
  if (!projectManagerInstance) {
    projectManagerInstance = new ProjectManager();
  }
  return projectManagerInstance;
}

export default ProjectManager;
