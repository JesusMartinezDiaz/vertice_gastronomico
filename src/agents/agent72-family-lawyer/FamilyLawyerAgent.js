/**
 * FamilyLawyerAgent - Agente 72: Abogado Familiar (Privado del CEO)
 *
 * Este agente maneja asuntos legales familiares privados del CEO,
 * como casos de custodia, divorcios y asuntos personales.
 *
 * IMPORTANTE: Este agente es PRIVADO y solo puede ser invocado por el CEO (Agente 1)
 */

import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';

// Importar pdf-parse dinámicamente para evitar errores si no está disponible
let pdfParse = null;
const loadPdfParse = async () => {
  if (!pdfParse) {
    try {
      const module = await import('pdf-parse');
      pdfParse = module.default;
    } catch (e) {
      console.warn('[FamilyLawyer] pdf-parse no disponible, lectura de PDFs limitada');
    }
  }
  return pdfParse;
};

/**
 * Tipos de documentos legales que puede generar
 */
export const LEGAL_DOCUMENT_TYPES = {
  ESCRITO_DEMANDA: 'escrito_demanda',
  ESCRITO_CONTESTACION: 'escrito_contestacion',
  ESCRITO_PROMOCION: 'escrito_promocion',
  CONVENIO_CUSTODIA: 'convenio_custodia',
  SOLICITUD_PENSION: 'solicitud_pension',
  RECURSO_APELACION: 'recurso_apelacion',
  ACUERDO_VISITAS: 'acuerdo_visitas',
  ESCRITO_DESAHOGO: 'escrito_desahogo',
  ALEGATOS: 'alegatos',
  INCIDENTE: 'incidente'
};

/**
 * Estados del caso
 */
export const CASE_STATUS = {
  NUEVO: 'nuevo',
  EN_REVISION: 'en_revision',
  DOCUMENTOS_PENDIENTES: 'documentos_pendientes',
  EN_PROCESO: 'en_proceso',
  AUDIENCIA_PROGRAMADA: 'audiencia_programada',
  RESOLUCION_PENDIENTE: 'resolucion_pendiente',
  CERRADO: 'cerrado'
};

/**
 * Clase FamilyLawyerAgent
 */
export class FamilyLawyerAgent extends EventEmitter {
  constructor(aiProvider = null) {
    super();
    this.id = 72;
    this.name = 'Abogado Familiar';
    this.shortName = 'FAMILY_LAWYER';
    this.category = 'PRIVATE';
    this.isPrivate = true;
    this.ceoOnly = true;
    this.aiProvider = aiProvider;
    this.cases = new Map();
    this.documents = new Map();
  }

  /**
   * Verifica si el solicitante tiene permiso
   */
  checkPermission(requesterId) {
    if (requesterId !== 1) {
      throw new Error('Acceso denegado: Solo el CEO puede acceder al Abogado Familiar');
    }
    return true;
  }

  /**
   * Procesa una solicitud de análisis de expediente
   */
  async analyzeExpediente(files, context = {}) {
    this.emit('analysis:started', { files: files.length, context });

    const analysis = {
      timestamp: new Date().toISOString(),
      filesAnalyzed: files.length,
      findings: [],
      recommendations: [],
      urgentActions: [],
      documentsNeeded: []
    };

    // Analizar cada archivo
    for (const file of files) {
      const fileAnalysis = await this.analyzeFile(file);
      analysis.findings.push(...fileAnalysis.findings);
      analysis.recommendations.push(...fileAnalysis.recommendations);

      if (fileAnalysis.isUrgent) {
        analysis.urgentActions.push({
          file: file.name,
          action: fileAnalysis.urgentAction
        });
      }
    }

    // Determinar documentos necesarios
    analysis.documentsNeeded = this.determineRequiredDocuments(analysis.findings);

    this.emit('analysis:completed', analysis);
    return analysis;
  }

  /**
   * Analiza un archivo individual
   */
  async analyzeFile(file) {
    // Primero, extraer el contenido del archivo si no viene incluido
    let fileContent = file.content;

    if (!fileContent && file.path) {
      fileContent = await this.extractFileContent(file);
    }

    // Crear objeto con contenido extraído
    const fileWithContent = {
      ...file,
      content: fileContent
    };

    // Si hay AI provider, usarlo para análisis profundo
    if (this.aiProvider && fileContent) {
      return await this.analyzeWithAI(fileWithContent);
    }

    // Análisis básico con extracción de palabras clave
    return this.performBasicAnalysis(fileWithContent);
  }

  /**
   * Extrae contenido de un archivo según su tipo
   */
  async extractFileContent(file) {
    try {
      const filePath = file.path;
      const ext = path.extname(filePath).toLowerCase();

      // Leer archivo según extensión
      if (ext === '.pdf') {
        return await this.extractPdfContent(filePath);
      } else if (['.txt', '.md', '.doc'].includes(ext)) {
        return await fs.readFile(filePath, 'utf-8');
      } else if (file.buffer) {
        // Si viene como buffer (upload)
        if (ext === '.pdf') {
          return await this.extractPdfFromBuffer(file.buffer);
        }
        return file.buffer.toString('utf-8');
      }

      return null;
    } catch (error) {
      console.error(`[FamilyLawyer] Error extrayendo contenido de ${file.name}:`, error.message);
      return null;
    }
  }

  /**
   * Extrae texto de un PDF desde ruta de archivo
   */
  async extractPdfContent(filePath) {
    try {
      const parser = await loadPdfParse();
      if (!parser) {
        return `[PDF: ${path.basename(filePath)} - Instalar pdf-parse para leer contenido]`;
      }

      const dataBuffer = await fs.readFile(filePath);
      const data = await parser(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('[FamilyLawyer] Error leyendo PDF:', error.message);
      return null;
    }
  }

  /**
   * Extrae texto de un PDF desde buffer
   */
  async extractPdfFromBuffer(buffer) {
    try {
      const parser = await loadPdfParse();
      if (!parser) {
        return '[PDF - Instalar pdf-parse para leer contenido]';
      }

      const data = await parser(buffer);
      return data.text;
    } catch (error) {
      console.error('[FamilyLawyer] Error leyendo PDF desde buffer:', error.message);
      return null;
    }
  }

  /**
   * Realiza análisis básico sin AI
   */
  performBasicAnalysis(file) {
    const content = (file.content || '').toLowerCase();
    const findings = [];
    const recommendations = [];
    let isUrgent = false;
    let urgentAction = '';

    // Detectar tipo de documento legal
    const legalKeywords = {
      custodia: ['custodia', 'guarda', 'patria potestad', 'menor', 'niño', 'hijos'],
      pension: ['pensión', 'alimentos', 'manutención', 'alimenticia'],
      divorcio: ['divorcio', 'separación', 'disolución', 'matrimonio'],
      visitas: ['visitas', 'convivencia', 'régimen'],
      audiencia: ['audiencia', 'citatorio', 'comparecencia', 'juicio'],
      demanda: ['demanda', 'demandante', 'demandado', 'emplazamiento'],
      notificacion: ['notificación', 'notificar', 'cédula', 'actuario']
    };

    // Analizar contenido por palabras clave
    for (const [category, keywords] of Object.entries(legalKeywords)) {
      const found = keywords.filter(kw => content.includes(kw));
      if (found.length > 0) {
        findings.push(`Documento relacionado con ${category}: detectadas palabras clave (${found.join(', ')})`);
      }
    }

    // Detectar fechas (formato común mexicano)
    const datePattern = /(\d{1,2})\s*(de)?\s*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s*(de|del)?\s*(\d{4})/gi;
    const dates = content.match(datePattern);
    if (dates) {
      findings.push(`Fechas encontradas: ${dates.slice(0, 3).join(', ')}${dates.length > 3 ? '...' : ''}`);
    }

    // Detectar expediente
    const expPattern = /expediente[:\s]*(\d+\/\d+|\d+-\d+|[\w\d-]+)/gi;
    const expedientes = content.match(expPattern);
    if (expedientes) {
      findings.push(`Número de expediente: ${expedientes[0]}`);
    }

    // Detectar urgencias
    const urgentKeywords = ['término', 'plazo', 'vence', 'urgente', 'inmediato', '3 días', '5 días', 'apercibimiento'];
    const foundUrgent = urgentKeywords.filter(kw => content.includes(kw));
    if (foundUrgent.length > 0) {
      isUrgent = true;
      urgentAction = `Revisar plazos procesales - Palabras detectadas: ${foundUrgent.join(', ')}`;
      findings.push(`⚠️ POSIBLE URGENCIA: ${foundUrgent.join(', ')}`);
    }

    // Generar recomendaciones basadas en hallazgos
    if (findings.length === 0) {
      findings.push(`Archivo recibido: ${file.name}`);
      recommendations.push('Revisar contenido manualmente - No se detectaron palabras clave legales');
    } else {
      if (content.includes('custodia') || content.includes('menor')) {
        recommendations.push('Preparar convenio de custodia o revisión del régimen actual');
      }
      if (content.includes('pensión') || content.includes('alimentos')) {
        recommendations.push('Calcular pensión alimenticia según ingresos y necesidades');
      }
      if (content.includes('audiencia') || content.includes('citatorio')) {
        recommendations.push('Preparar escrito de promoción para audiencia');
        recommendations.push('Verificar fecha y hora de comparecencia');
      }
      if (content.includes('demanda')) {
        recommendations.push('Preparar contestación de demanda dentro del término legal');
      }
    }

    return {
      fileName: file.name,
      type: file.type || 'unknown',
      contentExtracted: !!file.content,
      contentLength: (file.content || '').length,
      findings,
      recommendations,
      isUrgent,
      urgentAction
    };
  }

  /**
   * Analiza archivo con AI
   */
  async analyzeWithAI(file) {
    const prompt = `
Eres un abogado especializado en derecho familiar mexicano.
Analiza el siguiente documento y proporciona:

1. HALLAZGOS CLAVE: Puntos importantes del documento
2. FECHAS RELEVANTES: Cualquier fecha mencionada
3. OBLIGACIONES: Obligaciones de cada parte
4. RIESGOS: Posibles riesgos legales
5. RECOMENDACIONES: Acciones a tomar
6. URGENCIA: ¿Hay algo que requiera acción inmediata?

DOCUMENTO:
Nombre: ${file.name}
Tipo: ${file.type}
${file.content ? `Contenido: ${file.content}` : ''}
`;

    try {
      const response = await this.aiProvider.process(prompt, {
        agentId: this.id,
        agentName: this.name,
        documentType: 'legal_analysis'
      });

      return this.parseAIAnalysis(response);
    } catch (error) {
      console.error('[FamilyLawyer] Error en análisis AI:', error);
      return {
        fileName: file.name,
        findings: ['Error en análisis'],
        recommendations: ['Intentar análisis manual'],
        isUrgent: false
      };
    }
  }

  /**
   * Parsea la respuesta del AI
   */
  parseAIAnalysis(response) {
    const text = typeof response === 'string' ? response : (response?.content || response?.text || '');

    const findings = [];
    const recommendations = [];
    let isUrgent = false;
    let urgentAction = '';

    // Extraer secciones de la respuesta AI
    const sections = {
      hallazgos: /HALLAZGOS?\s*(?:CLAVE)?[:\s]*([^]*?)(?=FECHA|OBLIGACION|RIESGO|RECOMENDA|URGENCIA|$)/i,
      fechas: /FECHA[S]?\s*(?:RELEVANTES)?[:\s]*([^]*?)(?=OBLIGACION|RIESGO|RECOMENDA|URGENCIA|$)/i,
      obligaciones: /OBLIGACION[ES]?[:\s]*([^]*?)(?=RIESGO|RECOMENDA|URGENCIA|$)/i,
      riesgos: /RIESGO[S]?[:\s]*([^]*?)(?=RECOMENDA|URGENCIA|$)/i,
      recomendaciones: /RECOMENDACION[ES]?[:\s]*([^]*?)(?=URGENCIA|$)/i,
      urgencia: /URGENCIA[:\s]*([^]*?)$/i
    };

    // Procesar cada sección
    for (const [section, pattern] of Object.entries(sections)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const content = match[1].trim();
        const lines = content.split('\n').filter(l => l.trim().length > 0);

        if (section === 'hallazgos' || section === 'fechas' || section === 'obligaciones' || section === 'riesgos') {
          lines.forEach(line => {
            const cleaned = line.replace(/^[-•\d.)\s]+/, '').trim();
            if (cleaned) findings.push(`[${section.toUpperCase()}] ${cleaned}`);
          });
        } else if (section === 'recomendaciones') {
          lines.forEach(line => {
            const cleaned = line.replace(/^[-•\d.)\s]+/, '').trim();
            if (cleaned) recommendations.push(cleaned);
          });
        } else if (section === 'urgencia') {
          const urgentKeywords = ['sí', 'si', 'urgente', 'inmediato', 'plazo', 'vence'];
          if (urgentKeywords.some(kw => content.toLowerCase().includes(kw))) {
            isUrgent = true;
            urgentAction = content.split('\n')[0].trim();
          }
        }
      }
    }

    // Si no se encontraron secciones estructuradas, hacer parsing básico
    if (findings.length === 0 && text.length > 0) {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      lines.slice(0, 10).forEach(line => {
        findings.push(line.trim());
      });
      recommendations.push('Revisar análisis completo del documento');
    }

    return {
      findings,
      recommendations,
      isUrgent,
      urgentAction,
      rawResponse: text.substring(0, 500)
    };
  }

  /**
   * Determina documentos requeridos basado en hallazgos
   */
  determineRequiredDocuments(findings) {
    const documents = [];

    // Lógica para determinar documentos necesarios
    const findingsText = findings.join(' ').toLowerCase();

    if (findingsText.includes('custodia') || findingsText.includes('menor')) {
      documents.push({
        type: LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA,
        priority: 'alta',
        description: 'Convenio de custodia para el menor'
      });
    }

    if (findingsText.includes('visita') || findingsText.includes('convivencia')) {
      documents.push({
        type: LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS,
        priority: 'alta',
        description: 'Régimen de visitas y convivencia'
      });
    }

    if (findingsText.includes('pensión') || findingsText.includes('alimentos')) {
      documents.push({
        type: LEGAL_DOCUMENT_TYPES.SOLICITUD_PENSION,
        priority: 'alta',
        description: 'Solicitud o modificación de pensión alimenticia'
      });
    }

    if (findingsText.includes('audiencia') || findingsText.includes('juicio')) {
      documents.push({
        type: LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION,
        priority: 'urgente',
        description: 'Escrito de promoción para audiencia'
      });
    }

    return documents;
  }

  /**
   * Genera un documento legal
   */
  async generateDocument(type, data, context = {}) {
    this.emit('document:generating', { type, data });

    const document = {
      id: `DOC-${Date.now()}`,
      type,
      generatedAt: new Date().toISOString(),
      content: '',
      metadata: {
        author: 'Agente 72 - Abogado Familiar',
        classification: 'CONFIDENCIAL - USO EXCLUSIVO CEO',
        ...context
      }
    };

    // Generar contenido según el tipo
    switch (type) {
      case LEGAL_DOCUMENT_TYPES.ESCRITO_PROMOCION:
        document.content = await this.generateEscritoPromocion(data);
        break;
      case LEGAL_DOCUMENT_TYPES.CONVENIO_CUSTODIA:
        document.content = await this.generateConvenioCustodia(data);
        break;
      case LEGAL_DOCUMENT_TYPES.ACUERDO_VISITAS:
        document.content = await this.generateAcuerdoVisitas(data);
        break;
      case LEGAL_DOCUMENT_TYPES.ESCRITO_DESAHOGO:
        document.content = await this.generateEscritoDesahogo(data);
        break;
      default:
        document.content = await this.generateGenericDocument(type, data);
    }

    this.documents.set(document.id, document);
    this.emit('document:generated', document);

    return document;
  }

  /**
   * Genera escrito de promoción
   */
  async generateEscritoPromocion(data) {
    const {
      expediente = 'EXPEDIENTE',
      juzgado = 'JUZGADO FAMILIAR',
      promovente = 'PROMOVENTE',
      contraparte = 'CONTRAPARTE',
      asunto = 'ASUNTO',
      hechos = [],
      peticiones = []
    } = data;

    return `
═══════════════════════════════════════════════════════════════════
                    ESCRITO DE PROMOCIÓN
═══════════════════════════════════════════════════════════════════

C. JUEZ ${juzgado.toUpperCase()}
PRESENTE

EXPEDIENTE: ${expediente}

${promovente.toUpperCase()}, por mi propio derecho, en el juicio de ${asunto}
que promuevo en contra de ${contraparte}, atentamente comparezco para exponer:

═══════════════════════════════════════════════════════════════════
                         HECHOS
═══════════════════════════════════════════════════════════════════

${hechos.map((h, i) => `${i + 1}. ${h}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════
                       FUNDAMENTOS DE DERECHO
═══════════════════════════════════════════════════════════════════

Lo anterior encuentra su fundamento en los artículos aplicables del
Código Civil y Código de Procedimientos Civiles del Estado correspondiente,
así como en la Convención sobre los Derechos del Niño.

═══════════════════════════════════════════════════════════════════
                        PETICIONES
═══════════════════════════════════════════════════════════════════

Por lo anteriormente expuesto y fundado, a Usted C. Juez,
atentamente solicito:

${peticiones.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}

PROTESTO LO NECESARIO

_____________________________
${promovente.toUpperCase()}

Fecha: ${new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}

═══════════════════════════════════════════════════════════════════
DOCUMENTO GENERADO POR: AGENTE 72 - ABOGADO FAMILIAR
CLASIFICACIÓN: CONFIDENCIAL - USO EXCLUSIVO CEO
═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Genera convenio de custodia
   */
  async generateConvenioCustodia(data) {
    const {
      nombreMenor = 'MENOR',
      edadMenor = 'EDAD',
      padreA = 'PADRE A',
      padreB = 'PADRE B',
      tipoCustodia = 'compartida',
      condiciones = []
    } = data;

    return `
═══════════════════════════════════════════════════════════════════
                  CONVENIO DE CUSTODIA
═══════════════════════════════════════════════════════════════════

PARTES:
- ${padreA.toUpperCase()} (en adelante "Parte A")
- ${padreB.toUpperCase()} (en adelante "Parte B")

MENOR:
- Nombre: ${nombreMenor}
- Edad: ${edadMenor}

═══════════════════════════════════════════════════════════════════
              TIPO DE CUSTODIA: ${tipoCustodia.toUpperCase()}
═══════════════════════════════════════════════════════════════════

Las partes acuerdan establecer un régimen de custodia ${tipoCustodia}
del menor, bajo las siguientes condiciones:

${condiciones.map((c, i) => `${i + 1}. ${c}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════
                    ACUERDOS GENERALES
═══════════════════════════════════════════════════════════════════

1. Ambas partes se comprometen a mantener una comunicación respetuosa
   en beneficio del menor.

2. Las decisiones importantes sobre educación, salud y bienestar del
   menor serán tomadas de común acuerdo.

3. Cualquier modificación a este convenio deberá ser acordada por
   ambas partes y, en su caso, ratificada ante autoridad competente.

═══════════════════════════════════════════════════════════════════

_____________________________      _____________________________
${padreA.toUpperCase()}            ${padreB.toUpperCase()}

Fecha: ${new Date().toLocaleDateString('es-MX')}

═══════════════════════════════════════════════════════════════════
DOCUMENTO GENERADO POR: AGENTE 72 - ABOGADO FAMILIAR
CLASIFICACIÓN: CONFIDENCIAL - USO EXCLUSIVO CEO
═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Genera acuerdo de visitas
   */
  async generateAcuerdoVisitas(data) {
    const {
      nombreMenor = 'MENOR',
      padreVisitante = 'PADRE VISITANTE',
      diasVisita = [],
      horarios = {},
      condicionesEspeciales = []
    } = data;

    return `
═══════════════════════════════════════════════════════════════════
              RÉGIMEN DE VISITAS Y CONVIVENCIA
═══════════════════════════════════════════════════════════════════

MENOR: ${nombreMenor}
PADRE/MADRE VISITANTE: ${padreVisitante}

═══════════════════════════════════════════════════════════════════
                    DÍAS DE VISITA
═══════════════════════════════════════════════════════════════════

${diasVisita.length > 0 ? diasVisita.map(d => `- ${d}`).join('\n') : '- Por determinar'}

═══════════════════════════════════════════════════════════════════
                    HORARIOS
═══════════════════════════════════════════════════════════════════

- Hora de recogida: ${horarios.recogida || 'Por determinar'}
- Hora de entrega: ${horarios.entrega || 'Por determinar'}
- Lugar de intercambio: ${horarios.lugar || 'Por determinar'}

═══════════════════════════════════════════════════════════════════
              CONDICIONES ESPECIALES
═══════════════════════════════════════════════════════════════════

${condicionesEspeciales.length > 0
      ? condicionesEspeciales.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : 'Ninguna condición especial establecida.'}

═══════════════════════════════════════════════════════════════════

Fecha: ${new Date().toLocaleDateString('es-MX')}

═══════════════════════════════════════════════════════════════════
DOCUMENTO GENERADO POR: AGENTE 72 - ABOGADO FAMILIAR
CLASIFICACIÓN: CONFIDENCIAL - USO EXCLUSIVO CEO
═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Genera escrito de desahogo
   */
  async generateEscritoDesahogo(data) {
    const {
      expediente = 'EXPEDIENTE',
      juzgado = 'JUZGADO FAMILIAR',
      promovente = 'PROMOVENTE',
      requerimiento = 'REQUERIMIENTO',
      respuesta = ''
    } = data;

    return `
═══════════════════════════════════════════════════════════════════
                 ESCRITO DE DESAHOGO
═══════════════════════════════════════════════════════════════════

C. JUEZ ${juzgado.toUpperCase()}
PRESENTE

EXPEDIENTE: ${expediente}

${promovente.toUpperCase()}, en atención al requerimiento de fecha
reciente, mediante el cual se solicita: "${requerimiento}",
atentamente comparezco para desahogar lo siguiente:

═══════════════════════════════════════════════════════════════════
                       DESAHOGO
═══════════════════════════════════════════════════════════════════

${respuesta || 'Por medio del presente escrito, se da cumplimiento a lo requerido.'}

═══════════════════════════════════════════════════════════════════

Con lo anterior, se tiene por desahogada la vista o requerimiento
en los términos solicitados.

PROTESTO LO NECESARIO

_____________________________
${promovente.toUpperCase()}

Fecha: ${new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}

═══════════════════════════════════════════════════════════════════
DOCUMENTO GENERADO POR: AGENTE 72 - ABOGADO FAMILIAR
CLASIFICACIÓN: CONFIDENCIAL - USO EXCLUSIVO CEO
═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Genera documento genérico
   */
  async generateGenericDocument(type, data) {
    return `
═══════════════════════════════════════════════════════════════════
                    DOCUMENTO LEGAL
═══════════════════════════════════════════════════════════════════

TIPO: ${type}
FECHA: ${new Date().toLocaleDateString('es-MX')}

CONTENIDO:
${JSON.stringify(data, null, 2)}

═══════════════════════════════════════════════════════════════════
DOCUMENTO GENERADO POR: AGENTE 72 - ABOGADO FAMILIAR
CLASIFICACIÓN: CONFIDENCIAL - USO EXCLUSIVO CEO
═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Procesa una tarea delegada
   */
  async processTask(task) {
    this.checkPermission(task.fromAgentId);

    this.emit('task:processing', { taskId: task.id });

    const result = {
      agentId: this.id,
      agentName: this.name,
      taskId: task.id,
      timestamp: new Date().toISOString(),
      analysis: null,
      documents: [],
      recommendations: []
    };

    // Analizar archivos adjuntos si existen
    if (task.attachments && task.attachments.length > 0) {
      result.analysis = await this.analyzeExpediente(task.attachments, task.context);

      // Generar documentos necesarios
      for (const docNeeded of result.analysis.documentsNeeded) {
        const doc = await this.generateDocument(docNeeded.type, {
          ...task.context,
          fromAnalysis: true
        });
        result.documents.push(doc);
      }
    }

    // Generar recomendaciones
    result.recommendations = this.generateRecommendations(result.analysis);

    this.emit('task:completed', { taskId: task.id, result });

    return result;
  }

  /**
   * Genera recomendaciones basadas en el análisis
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (!analysis) {
      recommendations.push({
        priority: 'alta',
        action: 'Proporcionar expediente para análisis',
        description: 'Se requiere el expediente del caso para poder brindar asesoría legal adecuada'
      });
      return recommendations;
    }

    if (analysis.urgentActions && analysis.urgentActions.length > 0) {
      recommendations.push({
        priority: 'urgente',
        action: 'Atender acciones urgentes',
        description: `Hay ${analysis.urgentActions.length} acción(es) que requieren atención inmediata`
      });
    }

    if (analysis.documentsNeeded && analysis.documentsNeeded.length > 0) {
      recommendations.push({
        priority: 'alta',
        action: 'Preparar documentos legales',
        description: `Se identificaron ${analysis.documentsNeeded.length} documento(s) necesarios`
      });
    }

    return recommendations;
  }

  /**
   * Obtiene el resumen del agente
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      shortName: this.shortName,
      category: this.category,
      isPrivate: this.isPrivate,
      ceoOnly: this.ceoOnly,
      capabilities: [
        'Análisis de expedientes familiares',
        'Generación de escritos legales',
        'Convenios de custodia',
        'Acuerdos de visitas',
        'Asesoría en casos de divorcio',
        'Pensiones alimenticias'
      ],
      documentTypes: Object.values(LEGAL_DOCUMENT_TYPES),
      casesActive: this.cases.size,
      documentsGenerated: this.documents.size
    };
  }
}

// Singleton
let familyLawyerInstance = null;

export function getFamilyLawyerAgent(aiProvider = null) {
  if (!familyLawyerInstance) {
    familyLawyerInstance = new FamilyLawyerAgent(aiProvider);
  }
  return familyLawyerInstance;
}

export default FamilyLawyerAgent;
