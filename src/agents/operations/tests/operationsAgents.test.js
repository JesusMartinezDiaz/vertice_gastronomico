/**
 * PRUEBAS UNITARIAS - AGENTES DE OPERACIONES
 * Vértice Gastronómico - Test Suite Completa
 *
 * Cobertura:
 * - COOAgent: Planes operativos, KPIs, delegación
 * - InventoryAgent: Control de inventarios, par levels, mermas
 * - SafetyAgent: Auditorías, HACCP, procedimientos de emergencia
 * - Módulo completo: Factory functions, constantes
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTACIONES
// ═══════════════════════════════════════════════════════════════════════════

import {
  COOAgent,
  RestaurantManagerAgent,
  FloorManagerAgent,
  PurchasingAgent,
  InventoryAgent,
  MaintenanceAgent,
  SafetyAgent,
  SanitationAgent,
  getOperationsAgent,
  getAllOperationsAgents,
  OPERATIONS_AGENTS,
  OPERATION_AREAS,
  SHIFT_TYPES,
  INVENTORY_STATUS,
  MAINTENANCE_PRIORITY
} from '../index.js';

// ═══════════════════════════════════════════════════════════════════════════
// COOAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('COOAgent', () => {
  let cooAgent;

  beforeEach(() => {
    cooAgent = new COOAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID 18', () => {
      expect(cooAgent.id).toBe(18);
    });

    it('debe tener nombre correcto', () => {
      expect(cooAgent.name).toBe('Director de Operaciones (COO)');
    });

    it('debe tener subordinados definidos', () => {
      expect(cooAgent.subordinates).toEqual([19, 20, 21, 22, 23, 24, 25]);
    });

    it('debe tener capabilities definidas', () => {
      expect(cooAgent.capabilities).toContain('operations_strategy');
      expect(cooAgent.capabilities).toContain('process_optimization');
    });
  });

  describe('Análisis de Operaciones', () => {
    it('debe realizar análisis operativo', async () => {
      const analysis = await cooAgent.analyzeOperations({});

      expect(analysis.currentState).toBeDefined();
      expect(analysis.areas).toBeDefined();
      expect(analysis.areas.frontOfHouse).toBeDefined();
      expect(analysis.areas.backOfHouse).toBeDefined();
    });
  });

  describe('Plan de Optimización', () => {
    it('debe desarrollar plan de optimización', () => {
      const plan = cooAgent.developOptimizationPlan({});

      expect(plan.objectives).toBeDefined();
      expect(plan.objectives.length).toBeGreaterThan(0);
      expect(plan.initiatives).toBeDefined();
      expect(plan.initiatives.length).toBeGreaterThan(0);
    });

    it('debe incluir propietarios de iniciativas', () => {
      const plan = cooAgent.developOptimizationPlan({});

      plan.initiatives.forEach(initiative => {
        expect(initiative.owner).toBeDefined();
        expect(cooAgent.subordinates).toContain(initiative.owner);
      });
    });
  });

  describe('Recomendaciones', () => {
    it('debe generar recomendaciones', () => {
      const recommendations = cooAgent.generateRecommendations({});

      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('debe incluir prioridad en cada recomendación', () => {
      const recommendations = cooAgent.generateRecommendations({});

      recommendations.forEach(rec => {
        expect(rec.priority).toBeDefined();
        expect(rec.area).toBeDefined();
        expect(rec.action).toBeDefined();
      });
    });
  });

  describe('Delegación', () => {
    it('debe planificar delegación a subordinados', () => {
      const delegation = cooAgent.planDelegation({});

      expect(delegation.delegateTo).toEqual(cooAgent.subordinates);
      expect(delegation.assignments).toBeDefined();
      expect(delegation.assignments.length).toBeGreaterThan(0);
    });

    it('debe asignar tareas con prioridad', () => {
      const delegation = cooAgent.planDelegation({});

      delegation.assignments.forEach(assignment => {
        expect(assignment.agentId).toBeDefined();
        expect(assignment.task).toBeDefined();
        expect(assignment.priority).toBeDefined();
      });
    });
  });

  describe('Plan Operacional', () => {
    it('debe crear plan operacional completo', async () => {
      const data = {
        clientId: 'client_123',
        restaurantName: 'Test Restaurant',
        scope: 'full_operations',
        duration: '12 weeks'
      };

      const plan = await cooAgent.createOperationalPlan(data);

      expect(plan.planId).toMatch(/^opsplan_/);
      expect(plan.clientId).toBe('client_123');
      expect(plan.restaurantName).toBe('Test Restaurant');
      expect(plan.phases).toBeDefined();
      expect(plan.kpis).toBeDefined();
      expect(plan.resources).toBeDefined();
      expect(plan.risks).toBeDefined();
    });

    it('debe definir fases del proyecto', () => {
      const phases = cooAgent.definePhases({});

      expect(phases.length).toBe(4);
      expect(phases[0].name).toBe('Diagnóstico');
      expect(phases[1].name).toBe('Diseño');
      expect(phases[2].name).toBe('Implementación');
      expect(phases[3].name).toBe('Estabilización');
    });

    it('debe definir KPIs operativos', () => {
      const kpis = cooAgent.defineKPIs();

      expect(kpis.length).toBeGreaterThan(0);
      expect(kpis.some(kpi => kpi.name === 'Food Cost')).toBe(true);
      expect(kpis.some(kpi => kpi.name === 'Labor Cost')).toBe(true);
    });

    it('debe identificar riesgos', () => {
      const risks = cooAgent.identifyRisks({});

      expect(risks.length).toBeGreaterThan(0);
      risks.forEach(risk => {
        expect(risk.risk).toBeDefined();
        expect(risk.probability).toBeDefined();
        expect(risk.mitigation).toBeDefined();
      });
    });
  });

  describe('Procesamiento de Tareas', () => {
    it('debe procesar request correctamente', async () => {
      await cooAgent.initialize();
      const result = await cooAgent.processRequest('Optimizar operaciones', {});

      expect(result.agentId).toBe(18);
      expect(result.taskType).toBe('operations_leadership');
      expect(result.operationsAnalysis).toBeDefined();
      expect(result.optimization).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// InventoryAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('InventoryAgent', () => {
  let inventoryAgent;

  beforeEach(() => {
    inventoryAgent = new InventoryAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID 22', () => {
      expect(inventoryAgent.id).toBe(22);
    });

    it('debe tener nombre correcto', () => {
      expect(inventoryAgent.name).toBe('Gerente de Inventarios');
    });

    it('debe tener capabilities de inventario', () => {
      expect(inventoryAgent.capabilities).toContain('inventory_control');
      expect(inventoryAgent.capabilities).toContain('waste_reduction');
      expect(inventoryAgent.capabilities).toContain('fifo_implementation');
    });
  });

  describe('Análisis de Inventario', () => {
    it('debe analizar inventario', async () => {
      const analysis = await inventoryAgent.analyzeInventory({});

      expect(analysis.currentValue).toBeDefined();
      expect(analysis.turnoverRate).toBeDefined();
      expect(analysis.wastePercentage).toBeDefined();
      expect(analysis.categories).toBeDefined();
    });

    it('debe incluir categorías principales', async () => {
      const analysis = await inventoryAgent.analyzeInventory({});

      expect(analysis.categories.proteins).toBeDefined();
      expect(analysis.categories.produce).toBeDefined();
      expect(analysis.categories.dairy).toBeDefined();
      expect(analysis.categories.dryGoods).toBeDefined();
      expect(analysis.categories.beverages).toBeDefined();
    });
  });

  describe('Sistema de Control', () => {
    it('debe diseñar sistema de control', () => {
      const system = inventoryAgent.designControlSystem({});

      expect(system.receiving).toBeDefined();
      expect(system.storage).toBeDefined();
      expect(system.counting).toBeDefined();
      expect(system.parLevels).toBeDefined();
    });

    it('debe incluir protocolos de recepción', () => {
      const system = inventoryAgent.designControlSystem({});

      expect(system.receiving.inspection).toBeDefined();
      expect(system.receiving.documentation).toBeDefined();
      expect(system.receiving.storage).toBeDefined();
    });

    it('debe incluir reglas de almacenamiento', () => {
      const system = inventoryAgent.designControlSystem({});

      expect(system.storage.fifo).toBeDefined();
      expect(system.storage.organization).toBeDefined();
      expect(system.storage.temperature).toBeDefined();
    });
  });

  describe('Conteo de Inventario', () => {
    it('debe iniciar conteo de inventario', async () => {
      const count = await inventoryAgent.conductInventoryCount({
        type: 'full'
      });

      expect(count.countId).toMatch(/^count_/);
      expect(count.type).toBe('full');
      expect(count.status).toBe('in_progress');
      expect(count.variance).toBeDefined();
    });
  });

  describe('Par Levels', () => {
    it('debe calcular par levels', async () => {
      const data = {
        item: 'Pollo',
        averageDaily: 10,
        leadTime: 2,
        safetyStock: 5
      };

      const result = await inventoryAgent.calculateParLevels(data);

      expect(result.parLevelId).toMatch(/^par_/);
      expect(result.calculation.parLevel).toBe(25); // (10*2) + 5
      expect(result.calculation.reorderPoint).toBe(20); // 10*2
    });
  });

  describe('Tracking de Mermas', () => {
    it('debe trackear mermas', async () => {
      const data = {
        items: [
          { name: 'Tomate', value: 50, category: 'produce' }
        ]
      };

      const wasteLog = await inventoryAgent.trackWaste(data);

      expect(wasteLog.wasteLogId).toMatch(/^waste_/);
      expect(wasteLog.items).toBeDefined();
      expect(wasteLog.categories).toBeDefined();
      expect(wasteLog.categories.spoilage).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SafetyAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('SafetyAgent', () => {
  let safetyAgent;

  beforeEach(() => {
    safetyAgent = new SafetyAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID 24', () => {
      expect(safetyAgent.id).toBe(24);
    });

    it('debe tener capabilities de seguridad', () => {
      expect(safetyAgent.capabilities).toContain('food_safety');
      expect(safetyAgent.capabilities).toContain('haccp_implementation');
      expect(safetyAgent.capabilities).toContain('audit_preparation');
    });
  });

  describe('Evaluación de Seguridad', () => {
    it('debe evaluar seguridad alimentaria', async () => {
      const assessment = await safetyAgent.assessSafety({});

      expect(assessment.foodSafety).toBeDefined();
      expect(assessment.foodSafety.haccp).toBeDefined();
      expect(assessment.foodSafety.temperatureControl).toBeDefined();
      expect(assessment.foodSafety.crossContamination).toBeDefined();
    });

    it('debe evaluar seguridad física', async () => {
      const assessment = await safetyAgent.assessSafety({});

      expect(assessment.physicalSafety).toBeDefined();
      expect(assessment.physicalSafety.fireSafety).toBeDefined();
      expect(assessment.physicalSafety.slipHazards).toBeDefined();
    });

    it('debe evaluar cumplimiento', async () => {
      const assessment = await safetyAgent.assessSafety({});

      expect(assessment.compliance).toBeDefined();
      expect(assessment.compliance.healthPermit).toBeDefined();
    });
  });

  describe('Plan de Cumplimiento', () => {
    it('debe desarrollar plan de cumplimiento', () => {
      const plan = safetyAgent.developCompliancePlan({});

      expect(plan.haccp).toBeDefined();
      expect(plan.dailyChecks).toBeDefined();
      expect(plan.training).toBeDefined();
      expect(plan.documentation).toBeDefined();
    });

    it('debe incluir componentes HACCP', () => {
      const plan = safetyAgent.developCompliancePlan({});

      expect(plan.haccp.hazardAnalysis).toBeDefined();
      expect(plan.haccp.criticalControlPoints).toBeDefined();
      expect(plan.haccp.monitoring).toBeDefined();
    });
  });

  describe('Auditoría de Seguridad', () => {
    it('debe conducir auditoría de seguridad', async () => {
      const audit = await safetyAgent.conductSafetyAudit({ type: 'comprehensive' });

      expect(audit.auditId).toMatch(/^safety_audit_/);
      expect(audit.type).toBe('comprehensive');
      expect(audit.areas).toBeDefined();
      expect(audit.areas.receiving).toBeDefined();
      expect(audit.areas.storage).toBeDefined();
      expect(audit.areas.cooking).toBeDefined();
    });

    it('debe incrementar contador de auditorías', async () => {
      const initialCount = safetyAgent.metrics.auditsCompleted;
      await safetyAgent.conductSafetyAudit({});

      expect(safetyAgent.metrics.auditsCompleted).toBe(initialCount + 1);
    });
  });

  describe('Procedimientos de Emergencia', () => {
    it('debe crear procedimiento de emergencia', async () => {
      const procedure = await safetyAgent.createEmergencyProcedure({ type: 'fire' });

      expect(procedure.procedureId).toMatch(/^emergency_/);
      expect(procedure.type).toBe('fire');
      expect(procedure.steps).toBeDefined();
      expect(procedure.contacts).toBeDefined();
    });

    it('debe definir pasos para incendio', () => {
      const steps = safetyAgent.defineEmergencySteps('fire');

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toContain('911');
    });

    it('debe definir pasos para emergencia médica', () => {
      const steps = safetyAgent.defineEmergencySteps('medical');

      expect(steps.length).toBeGreaterThan(0);
    });

    it('debe definir pasos para corte de energía', () => {
      const steps = safetyAgent.defineEmergencySteps('power_outage');

      expect(steps.length).toBeGreaterThan(0);
    });

    it('debe definir contactos de emergencia', () => {
      const contacts = safetyAgent.defineEmergencyContacts();

      expect(contacts.emergency).toBe('911');
      expect(contacts.fire).toBeDefined();
      expect(contacts.poison).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RestaurantManagerAgent Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('RestaurantManagerAgent', () => {
  let managerAgent;

  beforeEach(() => {
    managerAgent = new RestaurantManagerAgent();
  });

  describe('Inicialización', () => {
    it('debe inicializar con ID 19', () => {
      expect(managerAgent.id).toBe(19);
    });

    it('debe tener capabilities de gestión', () => {
      expect(managerAgent.capabilities).toContain('daily_operations');
      expect(managerAgent.capabilities).toContain('staff_management');
      expect(managerAgent.capabilities).toContain('scheduling');
    });
  });

  describe('Rutinas Diarias', () => {
    it('debe definir rutinas diarias', () => {
      const routines = managerAgent.defineDailyRoutines();

      expect(routines.opening).toBeDefined();
      expect(routines.service).toBeDefined();
      expect(routines.closing).toBeDefined();
    });
  });

  describe('Estándares de Servicio', () => {
    it('debe definir estándares de servicio', () => {
      const standards = managerAgent.defineServiceStandards();

      expect(standards.greeting).toBeDefined();
      expect(standards.drinks).toBeDefined();
      expect(standards.appetizers).toBeDefined();
      expect(standards.entrees).toBeDefined();
    });
  });

  describe('Programación', () => {
    it('debe crear schedule', async () => {
      const schedule = await managerAgent.createSchedule({
        weekOf: '2024-01-15',
        laborBudget: 10000
      });

      expect(schedule.scheduleId).toMatch(/^schedule_/);
      expect(schedule.shifts).toBeDefined();
      expect(schedule.coverage).toBeDefined();
    });

    it('debe generar turnos para todos los días', () => {
      const shifts = managerAgent.generateShifts({});
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      days.forEach(day => {
        expect(shifts[day]).toBeDefined();
        expect(shifts[day].morning).toBeDefined();
        expect(shifts[day].evening).toBeDefined();
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Module Integration Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('Operations Module Integration', () => {
  describe('Factory Functions', () => {
    it('debe obtener COO con getOperationsAgent(18)', () => {
      const agent = getOperationsAgent(18);
      expect(agent).toBeInstanceOf(COOAgent);
    });

    it('debe obtener Inventory con getOperationsAgent(22)', () => {
      const agent = getOperationsAgent(22);
      expect(agent).toBeInstanceOf(InventoryAgent);
    });

    it('debe obtener Safety con getOperationsAgent(24)', () => {
      const agent = getOperationsAgent(24);
      expect(agent).toBeInstanceOf(SafetyAgent);
    });

    it('debe retornar singleton (misma instancia)', () => {
      const agent1 = getOperationsAgent(18);
      const agent2 = getOperationsAgent(18);
      expect(agent1).toBe(agent2);
    });

    it('debe lanzar error para agente no válido', () => {
      expect(() => getOperationsAgent(99)).toThrow('Agente de operaciones 99 no existe');
    });

    it('debe obtener todos los agentes de operaciones', () => {
      const agents = getAllOperationsAgents();

      expect(agents[18]).toBeDefined();
      expect(agents[19]).toBeDefined();
      expect(agents[20]).toBeDefined();
      expect(agents[21]).toBeDefined();
      expect(agents[22]).toBeDefined();
      expect(agents[23]).toBeDefined();
      expect(agents[24]).toBeDefined();
      expect(agents[25]).toBeDefined();
    });
  });

  describe('OPERATIONS_AGENTS Registry', () => {
    it('debe contener todos los agentes', () => {
      expect(Object.keys(OPERATIONS_AGENTS).length).toBe(8);
    });

    it('debe tener clases correctas', () => {
      expect(OPERATIONS_AGENTS[18].class).toBe(COOAgent);
      expect(OPERATIONS_AGENTS[22].class).toBe(InventoryAgent);
      expect(OPERATIONS_AGENTS[24].class).toBe(SafetyAgent);
    });
  });

  describe('Constantes de Operaciones', () => {
    it('debe tener OPERATION_AREAS definidas', () => {
      expect(OPERATION_AREAS.FRONT_OF_HOUSE).toBe('front_of_house');
      expect(OPERATION_AREAS.BACK_OF_HOUSE).toBe('back_of_house');
      expect(OPERATION_AREAS.INVENTORY).toBe('inventory');
    });

    it('debe tener SHIFT_TYPES definidos', () => {
      expect(SHIFT_TYPES.MORNING).toBe('morning');
      expect(SHIFT_TYPES.AFTERNOON).toBe('afternoon');
      expect(SHIFT_TYPES.EVENING).toBe('evening');
    });

    it('debe tener INVENTORY_STATUS definidos', () => {
      expect(INVENTORY_STATUS.IN_STOCK).toBe('in_stock');
      expect(INVENTORY_STATUS.LOW_STOCK).toBe('low_stock');
      expect(INVENTORY_STATUS.OUT_OF_STOCK).toBe('out_of_stock');
    });

    it('debe tener MAINTENANCE_PRIORITY definidos', () => {
      expect(MAINTENANCE_PRIORITY.CRITICAL).toBe('critical');
      expect(MAINTENANCE_PRIORITY.HIGH).toBe('high');
      expect(MAINTENANCE_PRIORITY.MEDIUM).toBe('medium');
      expect(MAINTENANCE_PRIORITY.LOW).toBe('low');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Additional Agent Tests (Quick Coverage)
// ═══════════════════════════════════════════════════════════════════════════

describe('FloorManagerAgent', () => {
  let floorAgent;

  beforeEach(() => {
    floorAgent = new FloorManagerAgent();
  });

  it('debe inicializar con ID 20', () => {
    expect(floorAgent.id).toBe(20);
  });

  it('debe diseñar secciones', () => {
    const sections = floorAgent.designSections({});
    expect(sections.length).toBeGreaterThan(0);
    expect(sections[0].name).toBeDefined();
  });

  it('debe proponer optimizaciones', () => {
    const opts = floorAgent.proposeOptimizations({});
    expect(opts.layout).toBeDefined();
    expect(opts.service).toBeDefined();
  });
});

describe('PurchasingAgent', () => {
  let purchasingAgent;

  beforeEach(() => {
    purchasingAgent = new PurchasingAgent();
  });

  it('debe inicializar con ID 21', () => {
    expect(purchasingAgent.id).toBe(21);
  });

  it('debe desarrollar estrategia de proveedores', () => {
    const strategy = purchasingAgent.developVendorStrategy({});
    expect(strategy.categories).toBeDefined();
    expect(strategy.categories.proteins).toBeDefined();
    expect(strategy.negotiationTargets).toBeDefined();
  });

  it('debe crear orden de compra', async () => {
    const po = await purchasingAgent.createPurchaseOrder({
      vendor: 'Test Vendor',
      items: []
    });

    expect(po.poNumber).toMatch(/^PO_/);
    expect(po.status).toBe('pending');
  });
});

describe('MaintenanceAgent', () => {
  let maintenanceAgent;

  beforeEach(() => {
    maintenanceAgent = new MaintenanceAgent();
  });

  it('debe inicializar con ID 23', () => {
    expect(maintenanceAgent.id).toBe(23);
  });

  it('debe desarrollar plan de mantenimiento', () => {
    const plan = maintenanceAgent.developMaintenancePlan({});
    expect(plan.preventive).toBeDefined();
    expect(plan.preventive.daily).toBeDefined();
    expect(plan.preventive.weekly).toBeDefined();
    expect(plan.preventive.monthly).toBeDefined();
  });

  it('debe crear orden de trabajo', async () => {
    const wo = await maintenanceAgent.createWorkOrder({
      type: 'repair',
      equipment: 'Refrigerator',
      description: 'Not cooling',
      priority: MAINTENANCE_PRIORITY.HIGH
    });

    expect(wo.workOrderId).toMatch(/^wo_/);
    expect(wo.status).toBe('open');
  });
});

describe('SanitationAgent', () => {
  let sanitationAgent;

  beforeEach(() => {
    sanitationAgent = new SanitationAgent();
  });

  it('debe inicializar con ID 25', () => {
    expect(sanitationAgent.id).toBe(25);
  });

  it('debe desarrollar programa de limpieza', () => {
    const program = sanitationAgent.developCleaningProgram({});
    expect(program.schedules).toBeDefined();
    expect(program.schedules.daily).toBeDefined();
    expect(program.chemicals).toBeDefined();
  });

  it('debe crear checklist de limpieza', async () => {
    const checklist = await sanitationAgent.createCleaningChecklist({
      area: 'kitchen',
      frequency: 'daily'
    });

    expect(checklist.checklistId).toMatch(/^cleaning_/);
    expect(checklist.tasks).toBeDefined();
  });

  it('debe obtener tareas por área', () => {
    const kitchenTasks = sanitationAgent.getTasksForArea('kitchen');
    expect(kitchenTasks.length).toBeGreaterThan(0);

    const diningTasks = sanitationAgent.getTasksForArea('dining');
    expect(diningTasks.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Edge Cases
// ═══════════════════════════════════════════════════════════════════════════

describe('Edge Cases', () => {
  it('debe manejar área de limpieza desconocida', () => {
    const sanitationAgent = new SanitationAgent();
    const tasks = sanitationAgent.getTasksForArea('unknown_area');
    expect(tasks).toEqual([]);
  });

  it('debe manejar tipo de emergencia desconocido', () => {
    const safetyAgent = new SafetyAgent();
    const steps = safetyAgent.defineEmergencySteps('unknown');
    expect(steps).toEqual([]);
  });

  it('debe validar cobertura correctamente', () => {
    const managerAgent = new RestaurantManagerAgent();
    const coverage = managerAgent.validateCoverage({});

    expect(coverage.minimumMet).toBe(true);
    expect(coverage.issues).toEqual([]);
  });
});
