/**
 * TEST SUITE: Agente 72 - Abogado Familiar (Privado del CEO)
 *
 * Verifica el flujo completo:
 * 1. Sistema de permisos (solo CEO puede acceder)
 * 2. Análisis de expedientes/archivos
 * 3. Generación de documentos legales
 * 4. Flujo completo CEO → Agente 72
 */

import {
  FamilyLawyerAgent,
  LEGAL_DOCUMENT_TYPES,
  CASE_STATUS,
  getFamilyLawyerAgent
} from '../FamilyLawyerAgent.js';

describe('FamilyLawyerAgent - Agente 72', () => {
  let agent;

  beforeEach(() => {
    // Crear nueva instancia para cada test
    agent = new FamilyLawyerAgent();
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 1: CONFIGURACIÓN BÁSICA DEL AGENTE
  // ═══════════════════════════════════════════════════════════════════

  describe('Configuración del Agente', () => {
    test('debe tener ID 72', () => {
      expect(agent.id).toBe(72);
    });

    test('debe llamarse "Abogado Familiar"', () => {
      expect(agent.name).toBe('Abogado Familiar');
    });

    test('debe ser un agente privado', () => {
      expect(agent.isPrivate).toBe(true);
    });

    test('debe ser solo para el CEO', () => {
      expect(agent.ceoOnly).toBe(true);
    });

    test('debe tener categoría PRIVATE', () => {
      expect(agent.category).toBe('PRIVATE');
    });

    test('debe extender EventEmitter', () => {
      expect(typeof agent.on).toBe('function');
      expect(typeof agent.emit).toBe('function');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 2: SISTEMA DE PERMISOS
  // ═══════════════════════════════════════════════════════════════════

  describe('Sistema de Permisos', () => {
    test('CEO (Agente 1) debe tener acceso permitido', () => {
      expect(() => agent.checkPermission(1)).not.toThrow();
      expect(agent.checkPermission(1)).toBe(true);
    });

    test('Agente 2 debe ser denegado', () => {
      expect(() => agent.checkPermission(2)).toThrow('Acceso denegado: Solo el CEO puede acceder al Abogado Familiar');
    });

    test('Agente 5 (CFO) debe ser denegado', () => {
      expect(() => agent.checkPermission(5)).toThrow('Acceso denegado');
    });

    test('Agente 10 debe ser denegado', () => {
      expect(() => agent.checkPermission(10)).toThrow('Acceso denegado');
    });

    test('Agente 34 (CLO) debe ser denegado', () => {
      expect(() => agent.checkPermission(34)).toThrow('Acceso denegado');
    });

    test('Agente 50 debe ser denegado', () => {
      expect(() => agent.checkPermission(50)).toThrow('Acceso denegado');
    });

    test('requesterId undefined debe ser denegado', () => {
      expect(() => agent.checkPermission(undefined)).toThrow('Acceso denegado');
    });

    test('requesterId null debe ser denegado', () => {
      expect(() => agent.checkPermission(null)).toThrow('Acceso denegado');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 3: ANÁLISIS DE EXPEDIENTES
  // ═══════════════════════════════════════════════════════════════════

  describe('Análisis de Expedientes', () => {
    test('debe analizar múltiples archivos', async () => {
      const files = [
        { name: 'demanda_custodia.pdf', type: 'application/pdf' },
        { name: 'acta_nacimiento.pdf', type: 'application/pdf' }
      ];

      const analysis = await agent.analyzeExpediente(files);

      expect(analysis).toHaveProperty('timestamp');
      expect(analysis.filesAnalyzed).toBe(2);
      expect(analysis).toHaveProperty('findings');
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis).toHaveProperty('urgentActions');
      expect(analysis).toHaveProperty('documentsNeeded');
      expect(Array.isArray(analysis.findings)).toBe(true);
    });

    test('debe emitir eventos de análisis', async () => {
      const files = [{ name: 'documento.pdf', type: 'application/pdf' }];
      const events = [];

      agent.on('analysis:started', (data) => events.push({ type: 'started', data }));
      agent.on('analysis:completed', (data) => events.push({ type: 'completed', data }));

      await agent.analyzeExpediente(files);

      expect(events.length).toBe(2);
      expect(events[0].type).toBe('started');
      expect(events[1].type).toBe('completed');
    });

    test('debe identificar documentos necesarios para custodia', async () => {
      const files = [
        {
          name: 'caso_custodia_menor.pdf',
          type: 'application/pdf',
          content: 'Se solicita custodia del menor'
        }
      ];

      const analysis = await agent.analyzeExpediente(files);

      // Verificar que detecta la necesidad de convenio de custodia
      const custodiaDoc = analysis.documentsNeeded.find(
        d => d.type === LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA
      );
      expect(custodiaDoc).toBeDefined();
      expect(custodiaDoc.priority).toBe('alta');
    });

    test('debe identificar documentos para visitas', async () => {
      const files = [
        {
          name: 'solicitud_visitas.pdf',
          type: 'application/pdf',
          content: 'Se solicita régimen de visitas y convivencia'
        }
      ];

      const analysis = await agent.analyzeExpediente(files);

      const visitasDoc = analysis.documentsNeeded.find(
        d => d.type === LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS
      );
      expect(visitasDoc).toBeDefined();
    });

    test('debe identificar documentos para pensión alimenticia', async () => {
      const files = [
        {
          name: 'pension_alimentos.pdf',
          type: 'application/pdf',
          content: 'Solicitud de pensión alimenticia'
        }
      ];

      const analysis = await agent.analyzeExpediente(files);

      const pensionDoc = analysis.documentsNeeded.find(
        d => d.type === LEGAL_DOCUMENT_TYPES.SOLICITUD_PENSION
      );
      expect(pensionDoc).toBeDefined();
    });

    test('debe identificar escritos para audiencia', async () => {
      const files = [
        {
          name: 'citatorio_audiencia.pdf',
          type: 'application/pdf',
          content: 'Citatorio para audiencia en juicio familiar'
        }
      ];

      const analysis = await agent.analyzeExpediente(files);

      const escritoDoc = analysis.documentsNeeded.find(
        d => d.type === LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION
      );
      expect(escritoDoc).toBeDefined();
      expect(escritoDoc.priority).toBe('urgente');
    });

    test('debe manejar archivos vacíos', async () => {
      const files = [];
      const analysis = await agent.analyzeExpediente(files);

      expect(analysis.filesAnalyzed).toBe(0);
      expect(analysis.findings).toEqual([]);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 4: GENERACIÓN DE DOCUMENTOS LEGALES
  // ═══════════════════════════════════════════════════════════════════

  describe('Generación de Documentos Legales', () => {

    describe('Escrito de Promoción', () => {
      test('debe generar escrito de promoción completo', async () => {
        const data = {
          expediente: '123/2024',
          juzgado: 'Juzgado Segundo Familiar',
          promovente: 'Juan Pérez García',
          contraparte: 'María López Sánchez',
          asunto: 'Guarda y Custodia',
          hechos: [
            'Que soy padre del menor de iniciales J.P.L.',
            'Que vengo a solicitar la guarda y custodia provisional',
            'Que cuento con los medios económicos necesarios'
          ],
          peticiones: [
            'Se me conceda la guarda y custodia provisional del menor',
            'Se fije régimen de visitas para la contraparte',
            'Se determine pensión alimenticia a cargo de la contraparte'
          ]
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION, data);

        expect(doc).toHaveProperty('id');
        expect(doc.id).toMatch(/^DOC-\d+$/);
        expect(doc.type).toBe(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION);
        expect(doc).toHaveProperty('content');
        expect(doc.content).toContain('ESCRITO DE PROMOCIÓN');
        expect(doc.content).toContain('123/2024');
        expect(doc.content).toContain('JUZGADO SEGUNDO FAMILIAR');
        expect(doc.content).toContain('JUAN PÉREZ GARCÍA');
        expect(doc.content).toContain('Guarda y Custodia');
        expect(doc.content).toContain('HECHOS');
        expect(doc.content).toContain('PETICIONES');
        expect(doc.content).toContain('PROTESTO LO NECESARIO');
        expect(doc.metadata.classification).toContain('CONFIDENCIAL');
      });

      test('debe incluir todos los hechos numerados', async () => {
        const data = {
          hechos: ['Hecho uno', 'Hecho dos', 'Hecho tres']
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION, data);

        expect(doc.content).toContain('1. Hecho uno');
        expect(doc.content).toContain('2. Hecho dos');
        expect(doc.content).toContain('3. Hecho tres');
      });
    });

    describe('Convenio de Custodia', () => {
      test('debe generar convenio de custodia completo', async () => {
        const data = {
          nombreMenor: 'Juanito Pérez López',
          edadMenor: '8 años',
          padreA: 'Juan Pérez García',
          padreB: 'María López Sánchez',
          tipoCustodia: 'compartida',
          condiciones: [
            'El menor residirá alternativamente con cada progenitor por períodos de una semana',
            'Las vacaciones escolares se dividirán por mitad',
            'Los días festivos se alternarán cada año'
          ]
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA, data);

        expect(doc.type).toBe(LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA);
        expect(doc.content).toContain('CONVENIO DE CUSTODIA');
        expect(doc.content).toContain('Juanito Pérez López');
        expect(doc.content).toContain('8 años');
        expect(doc.content).toContain('JUAN PÉREZ GARCÍA');
        expect(doc.content).toContain('MARÍA LÓPEZ SÁNCHEZ');
        expect(doc.content).toContain('COMPARTIDA');
        expect(doc.content).toContain('ACUERDOS GENERALES');
      });

      test('debe incluir todas las condiciones', async () => {
        const data = {
          condiciones: ['Condición A', 'Condición B']
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA, data);

        expect(doc.content).toContain('1. Condición A');
        expect(doc.content).toContain('2. Condición B');
      });
    });

    describe('Acuerdo de Visitas', () => {
      test('debe generar acuerdo de visitas completo', async () => {
        const data = {
          nombreMenor: 'Juanito Pérez López',
          padreVisitante: 'Juan Pérez García',
          diasVisita: ['Sábados', 'Domingos', 'Miércoles por la tarde'],
          horarios: {
            recogida: '10:00 hrs',
            entrega: '18:00 hrs',
            lugar: 'Domicilio del menor'
          },
          condicionesEspeciales: [
            'Las visitas en días escolares no afectarán el horario de clases',
            'El padre visitante podrá asistir a eventos escolares'
          ]
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS, data);

        expect(doc.type).toBe(LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS);
        expect(doc.content).toContain('RÉGIMEN DE VISITAS Y CONVIVENCIA');
        expect(doc.content).toContain('Juanito Pérez López');
        expect(doc.content).toContain('Juan Pérez García');
        expect(doc.content).toContain('Sábados');
        expect(doc.content).toContain('10:00 hrs');
        expect(doc.content).toContain('18:00 hrs');
        expect(doc.content).toContain('CONDICIONES ESPECIALES');
      });

      test('debe manejar días de visita vacíos', async () => {
        const data = {
          nombreMenor: 'Test',
          diasVisita: []
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS, data);

        expect(doc.content).toContain('Por determinar');
      });
    });

    describe('Escrito de Desahogo', () => {
      test('debe generar escrito de desahogo', async () => {
        const data = {
          expediente: '456/2024',
          juzgado: 'Juzgado Tercero Familiar',
          promovente: 'Juan Pérez García',
          requerimiento: 'Exhiba comprobantes de ingresos de los últimos 3 meses',
          respuesta: 'Se anexan los comprobantes de nómina solicitados correspondientes a los meses de enero, febrero y marzo de 2024.'
        };

        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_DESAHOGO, data);

        expect(doc.type).toBe(LEGAL_DOCUMENT_TYPES.ESCRITO_DESAHOGO);
        expect(doc.content).toContain('ESCRITO DE DESAHOGO');
        expect(doc.content).toContain('456/2024');
        expect(doc.content).toContain('Exhiba comprobantes de ingresos');
        expect(doc.content).toContain('Se anexan los comprobantes');
        expect(doc.content).toContain('DESAHOGO');
      });
    });

    describe('Documento Genérico', () => {
      test('debe generar documento genérico para tipos no especificados', async () => {
        const data = { campo1: 'valor1', campo2: 'valor2' };

        const doc = await agent.generateDocument('tipo_desconocido', data);

        expect(doc.content).toContain('DOCUMENTO LEGAL');
        expect(doc.content).toContain('tipo_desconocido');
        expect(doc.content).toContain('valor1');
      });
    });

    describe('Eventos de Generación', () => {
      test('debe emitir eventos durante la generación', async () => {
        const events = [];

        agent.on('document:generating', (data) => events.push({ type: 'generating', data }));
        agent.on('document:generated', (data) => events.push({ type: 'generated', data }));

        await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION, {});

        expect(events.length).toBe(2);
        expect(events[0].type).toBe('generating');
        expect(events[1].type).toBe('generated');
      });
    });

    describe('Almacenamiento de Documentos', () => {
      test('debe almacenar documento generado en el mapa interno', async () => {
        const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION, {});

        expect(agent.documents.has(doc.id)).toBe(true);
        expect(agent.documents.get(doc.id)).toBe(doc);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 5: PROCESAMIENTO DE TAREAS (CEO → Agente 72)
  // ═══════════════════════════════════════════════════════════════════

  describe('Procesamiento de Tareas del CEO', () => {

    test('debe procesar tarea del CEO correctamente', async () => {
      const task = {
        id: 'TASK-001',
        fromAgentId: 1, // CEO
        attachments: [
          { name: 'expediente_custodia.pdf', type: 'pdf', content: 'Caso de custodia del menor' }
        ],
        context: {
          expediente: '789/2024',
          juzgado: 'Juzgado Primero Familiar'
        }
      };

      const result = await agent.processTask(task);

      expect(result.agentId).toBe(72);
      expect(result.agentName).toBe('Abogado Familiar');
      expect(result.taskId).toBe('TASK-001');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('documents');
      expect(result).toHaveProperty('recommendations');
    });

    test('debe rechazar tarea de agente no autorizado', async () => {
      const task = {
        id: 'TASK-002',
        fromAgentId: 5, // CFO - no autorizado
        attachments: []
      };

      await expect(agent.processTask(task)).rejects.toThrow('Acceso denegado');
    });

    test('debe rechazar tarea de CLO (Agente 34)', async () => {
      const task = {
        id: 'TASK-003',
        fromAgentId: 34, // CLO - no autorizado
        attachments: []
      };

      await expect(agent.processTask(task)).rejects.toThrow('Acceso denegado');
    });

    test('debe generar documentos necesarios basado en análisis', async () => {
      const task = {
        id: 'TASK-004',
        fromAgentId: 1,
        attachments: [
          { name: 'caso.pdf', content: 'Solicitud de custodia del menor y régimen de visitas' }
        ],
        context: { expediente: '111/2024' }
      };

      const result = await agent.processTask(task);

      // Debería haber analizado y generado documentos si los hallazgos lo requieren
      expect(result.analysis).not.toBeNull();
      expect(Array.isArray(result.documents)).toBe(true);
    });

    test('debe emitir eventos de procesamiento', async () => {
      const events = [];
      const task = {
        id: 'TASK-005',
        fromAgentId: 1,
        attachments: []
      };

      agent.on('task:processing', (data) => events.push({ type: 'processing', data }));
      agent.on('task:completed', (data) => events.push({ type: 'completed', data }));

      await agent.processTask(task);

      expect(events.length).toBe(2);
      expect(events[0].type).toBe('processing');
      expect(events[0].data.taskId).toBe('TASK-005');
      expect(events[1].type).toBe('completed');
    });

    test('debe generar recomendaciones sin análisis', async () => {
      const task = {
        id: 'TASK-006',
        fromAgentId: 1,
        attachments: [] // Sin archivos
      };

      const result = await agent.processTask(task);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0].action).toContain('expediente');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 6: GENERACIÓN DE RECOMENDACIONES
  // ═══════════════════════════════════════════════════════════════════

  describe('Generación de Recomendaciones', () => {
    test('debe generar recomendación cuando no hay análisis', () => {
      const recommendations = agent.generateRecommendations(null);

      expect(recommendations.length).toBe(1);
      expect(recommendations[0].priority).toBe('alta');
      expect(recommendations[0].action).toContain('expediente');
    });

    test('debe recomendar atender acciones urgentes', () => {
      const analysis = {
        urgentActions: [{ file: 'citatorio.pdf', action: 'Responder' }],
        documentsNeeded: []
      };

      const recommendations = agent.generateRecommendations(analysis);

      const urgentRec = recommendations.find(r => r.priority === 'urgente');
      expect(urgentRec).toBeDefined();
      expect(urgentRec.action).toContain('urgentes');
    });

    test('debe recomendar preparar documentos cuando son necesarios', () => {
      const analysis = {
        urgentActions: [],
        documentsNeeded: [
          { type: LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA },
          { type: LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS }
        ]
      };

      const recommendations = agent.generateRecommendations(analysis);

      const docRec = recommendations.find(r => r.action.includes('documentos'));
      expect(docRec).toBeDefined();
      expect(docRec.description).toContain('2 documento(s)');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 7: RESUMEN DEL AGENTE
  // ═══════════════════════════════════════════════════════════════════

  describe('Resumen del Agente', () => {
    test('debe retornar resumen completo', () => {
      const summary = agent.getSummary();

      expect(summary.id).toBe(72);
      expect(summary.name).toBe('Abogado Familiar');
      expect(summary.shortName).toBe('FAMILY_LAWYER');
      expect(summary.category).toBe('PRIVATE');
      expect(summary.isPrivate).toBe(true);
      expect(summary.ceoOnly).toBe(true);
      expect(Array.isArray(summary.capabilities)).toBe(true);
      expect(summary.capabilities.length).toBeGreaterThan(0);
      expect(Array.isArray(summary.documentTypes)).toBe(true);
    });

    test('debe incluir capacidades específicas', () => {
      const summary = agent.getSummary();

      expect(summary.capabilities).toContain('Análisis de expedientes familiares');
      expect(summary.capabilities).toContain('Generación de escritos legales');
      expect(summary.capabilities).toContain('Convenios de custodia');
    });

    test('debe incluir todos los tipos de documentos', () => {
      const summary = agent.getSummary();

      expect(summary.documentTypes).toContain('escrito_demanda');
      expect(summary.documentTypes).toContain('convenio_custodia');
      expect(summary.documentTypes).toContain('acuerdo_visitas');
    });

    test('debe reflejar documentos generados', async () => {
      // Generar documentos con pequeño delay para evitar colisiones de ID
      await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION, {});
      await new Promise(resolve => setTimeout(resolve, 5));
      await agent.generateDocument(LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA, {});

      const summary = agent.getSummary();

      expect(summary.documentsGenerated).toBeGreaterThanOrEqual(2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 8: CONSTANTES EXPORTADAS
  // ═══════════════════════════════════════════════════════════════════

  describe('Constantes Exportadas', () => {
    test('LEGAL_DOCUMENT_TYPES debe tener todos los tipos', () => {
      expect(LEGAL_DOCUMENT_TYPES.ESCRITO_DEMANDA).toBe('escrito_demanda');
      expect(LEGAL_DOCUMENT_TYPES.ESCRITO_CONTESTACION).toBe('escrito_contestacion');
      expect(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION).toBe('escrito_promocion');
      expect(LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA).toBe('convenio_custodia');
      expect(LEGAL_DOCUMENT_TYPES.SOLICITUD_PENSION).toBe('solicitud_pension');
      expect(LEGAL_DOCUMENT_TYPES.RECURSO_APELACION).toBe('recurso_apelacion');
      expect(LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS).toBe('acuerdo_visitas');
      expect(LEGAL_DOCUMENT_TYPES.ESCRITO_DESAHOGO).toBe('escrito_desahogo');
      expect(LEGAL_DOCUMENT_TYPES.ALEGATOS).toBe('alegatos');
      expect(LEGAL_DOCUMENT_TYPES.INCIDENTE).toBe('incidente');
    });

    test('CASE_STATUS debe tener todos los estados', () => {
      expect(CASE_STATUS.NUEVO).toBe('nuevo');
      expect(CASE_STATUS.EN_REVISION).toBe('en_revision');
      expect(CASE_STATUS.DOCUMENTOS_PENDIENTES).toBe('documentos_pendientes');
      expect(CASE_STATUS.EN_PROCESO).toBe('en_proceso');
      expect(CASE_STATUS.AUDIENCIA_PROGRAMADA).toBe('audiencia_programada');
      expect(CASE_STATUS.RESOLUCION_PENDIENTE).toBe('resolucion_pendiente');
      expect(CASE_STATUS.CERRADO).toBe('cerrado');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 9: SINGLETON FACTORY
  // ═══════════════════════════════════════════════════════════════════

  describe('Singleton Factory', () => {
    test('getFamilyLawyerAgent debe retornar instancia', () => {
      const instance = getFamilyLawyerAgent();

      expect(instance).toBeInstanceOf(FamilyLawyerAgent);
      expect(instance.id).toBe(72);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN 10: FLUJO COMPLETO CEO → AGENTE 72
  // ═══════════════════════════════════════════════════════════════════

  describe('Flujo Completo: CEO instruye a Abogado Familiar', () => {

    test('Flujo completo: CEO envía expediente, analiza y genera documentos', async () => {
      // 1. El CEO tiene acceso
      expect(agent.checkPermission(1)).toBe(true);

      // 2. CEO envía tarea con expediente
      const ceoTask = {
        id: 'CEO-TASK-001',
        fromAgentId: 1,
        description: 'Revisar expediente de custodia y preparar documentos',
        attachments: [
          {
            name: 'expediente_custodia.pdf',
            type: 'application/pdf',
            content: 'Solicitud de custodia del menor Juan Pérez. Se requiere régimen de visitas y pensión alimenticia.'
          },
          {
            name: 'acta_matrimonio.pdf',
            type: 'application/pdf'
          }
        ],
        context: {
          expediente: '2024/FAM/001',
          juzgado: 'Juzgado Primero de lo Familiar',
          urgente: true
        }
      };

      // 3. Procesar la tarea
      const result = await agent.processTask(ceoTask);

      // 4. Verificar resultado completo
      expect(result.agentId).toBe(72);
      expect(result.taskId).toBe('CEO-TASK-001');
      expect(result.analysis).not.toBeNull();
      expect(result.analysis.filesAnalyzed).toBe(2);

      // 5. Debe haber identificado documentos necesarios
      expect(result.analysis.documentsNeeded.length).toBeGreaterThan(0);

      // 6. Debe haber generado documentos
      // (basado en los hallazgos del contenido)
      expect(Array.isArray(result.documents)).toBe(true);

      // 7. Debe haber recomendaciones
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    test('Flujo completo: Generar escrito de promoción para audiencia', async () => {
      // CEO solicita directamente un escrito
      const doc = await agent.generateDocument(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION, {
        expediente: '2024/FAM/002',
        juzgado: 'Juzgado Segundo de lo Familiar de la Ciudad de México',
        promovente: 'CEO del Sistema',
        contraparte: 'Contraparte Legal',
        asunto: 'Incidente de Modificación de Custodia',
        hechos: [
          'Que existe sentencia firme que otorgó la custodia',
          'Que han cambiado las circunstancias del caso',
          'Que es en beneficio del menor la modificación'
        ],
        peticiones: [
          'Se admita el presente incidente',
          'Se dé vista a la contraparte',
          'Se señale fecha para audiencia',
          'Se dicte resolución favorable'
        ]
      });

      // Verificar documento generado
      expect(doc.id).toBeDefined();
      expect(doc.type).toBe(LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION);
      expect(doc.content).toContain('ESCRITO DE PROMOCIÓN');
      expect(doc.content).toContain('2024/FAM/002');
      expect(doc.content).toContain('Incidente de Modificación');
      expect(doc.metadata.author).toBe('Agente 72 - Abogado Familiar');
      expect(doc.metadata.classification).toContain('CONFIDENCIAL');
    });

    test('Flujo completo: Análisis de expediente y recomendaciones', async () => {
      const files = [
        {
          name: 'citatorio_audiencia.pdf',
          content: 'Se cita a las partes para audiencia de juicio el día...'
        },
        {
          name: 'convenio_anterior.pdf',
          content: 'Convenio de custodia compartida del menor...'
        }
      ];

      // Analizar expediente
      const analysis = await agent.analyzeExpediente(files, {
        expediente: '2024/FAM/003'
      });

      // Verificar análisis
      expect(analysis.filesAnalyzed).toBe(2);
      expect(analysis.documentsNeeded.length).toBeGreaterThan(0);

      // Debe detectar la urgencia de la audiencia
      const escritoUrgente = analysis.documentsNeeded.find(
        d => d.priority === 'urgente'
      );
      expect(escritoUrgente).toBeDefined();

      // Generar recomendaciones
      const recommendations = agent.generateRecommendations(analysis);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});
