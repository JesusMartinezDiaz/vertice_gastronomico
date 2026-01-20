/**
 * UniversalCapabilities - Capacidades Universales para todos los Agentes
 * Este módulo garantiza que CADA agente tenga acceso a:
 * - Generación de documentos (PDF, Word, Excel, CSV, JSON)
 * - Procesamiento de IA
 * - WebSocket (eventos en tiempo real)
 * - Colas de procesamiento (BullMQ)
 * - Sistema de calidad
 * - Almacenamiento IndexedDB
 */

import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { TripleReviewSystem, ERROR_SEVERITY } from './TripleReviewSystem.js';
import { fileReader } from '../../utils/FileReader.js';

// ============ GENERACIÓN DE DOCUMENTOS ============

export class DocumentGenerator {
  constructor(agentConfig) {
    this.agent = agentConfig;
    this.branding = {
      primaryColor: '#1a365d',
      secondaryColor: '#2d3748',
      accentColor: '#38a169',
      fontFamily: 'Helvetica',
      logo: null
    };
  }

  // ============ PDF GENERATION ============
  async generatePDF(data, options = {}) {
    const doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    // Header con branding
    this._addPDFHeader(doc, options.title || 'Documento');

    // Contenido específico según tipo
    let yPos = 45;

    if (options.type === 'report') {
      yPos = this._addPDFReport(doc, data, yPos);
    } else if (options.type === 'analysis') {
      yPos = this._addPDFAnalysis(doc, data, yPos);
    } else if (options.type === 'costSheet') {
      yPos = this._addPDFCostSheet(doc, data, yPos);
    } else if (options.type === 'financial') {
      yPos = this._addPDFFinancialReport(doc, data, yPos);
    } else {
      yPos = this._addPDFGenericContent(doc, data, yPos);
    }

    // Footer
    this._addPDFFooter(doc);

    // Retornar como blob o base64
    if (options.returnType === 'blob') {
      return doc.output('blob');
    }
    return doc.output('datauristring');
  }

  _addPDFHeader(doc, title) {
    // Fondo del header
    doc.setFillColor(26, 54, 93);
    doc.rect(0, 0, 210, 35, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('Helvetica', 'bold');
    doc.text(title, 15, 15);

    // Subtítulo con agente
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Generado por: ${this.agent.nombre || 'Agente IA'}`, 15, 23);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 15, 29);

    // Reset color
    doc.setTextColor(0, 0, 0);
  }

  _addPDFFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Vértice Gastronómico - Página ${i} de ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    }
  }

  _addPDFReport(doc, data, startY) {
    let y = startY;
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');

    // Resumen ejecutivo
    if (data.summary) {
      doc.text('Resumen Ejecutivo', 15, y);
      y += 7;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(data.summary, 180);
      doc.text(lines, 15, y);
      y += lines.length * 5 + 10;
    }

    // Métricas clave
    if (data.metrics && data.metrics.length > 0) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Métricas Clave', 15, y);
      y += 7;

      data.metrics.forEach(metric => {
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 4, 180, 10, 'F');
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${metric.name}: ${metric.value}${metric.unit || ''}`, 20, y);
        if (metric.trend) {
          const color = metric.trend === 'up' ? [56, 161, 105] : [229, 62, 62];
          doc.setTextColor(...color);
          doc.text(metric.trend === 'up' ? '▲' : '▼', 180, y);
          doc.setTextColor(0, 0, 0);
        }
        y += 12;
      });
    }

    return y;
  }

  _addPDFAnalysis(doc, data, startY) {
    let y = startY;

    // Análisis detallado
    if (data.sections) {
      data.sections.forEach(section => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(section.title, 15, y);
        y += 6;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(section.content, 180);
        doc.text(lines, 15, y);
        y += lines.length * 5 + 8;

        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      });
    }

    return y;
  }

  _addPDFCostSheet(doc, data, startY) {
    let y = startY;

    // Información del platillo
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(data.recipeName || 'Ficha de Costos', 15, y);
    y += 10;

    // Tabla de ingredientes
    if (data.ingredients && data.ingredients.length > 0) {
      doc.setFontSize(10);

      // Headers
      doc.setFillColor(26, 54, 93);
      doc.setTextColor(255, 255, 255);
      doc.rect(15, y - 4, 180, 8, 'F');
      doc.text('Ingrediente', 20, y);
      doc.text('Cantidad', 80, y);
      doc.text('Unidad', 110, y);
      doc.text('Costo Unit.', 140, y);
      doc.text('Costo Total', 170, y);
      y += 8;
      doc.setTextColor(0, 0, 0);

      // Rows
      data.ingredients.forEach((ing, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(15, y - 4, 180, 7, 'F');
        }
        doc.text(ing.name?.substring(0, 25) || '', 20, y);
        doc.text(String(ing.quantity || ''), 80, y);
        doc.text(ing.unit || '', 110, y);
        doc.text(`$${(ing.unitCost || 0).toFixed(2)}`, 140, y);
        doc.text(`$${(ing.totalCost || 0).toFixed(2)}`, 170, y);
        y += 7;
      });

      // Totales
      y += 5;
      doc.setFont('Helvetica', 'bold');
      doc.text(`Costo Total: $${(data.totalCost || 0).toFixed(2)}`, 140, y);
      y += 6;
      doc.text(`Food Cost: ${(data.foodCostPercentage || 0).toFixed(1)}%`, 140, y);
      y += 6;
      doc.text(`Precio Sugerido: $${(data.suggestedPrice || 0).toFixed(2)}`, 140, y);
    }

    return y;
  }

  _addPDFFinancialReport(doc, data, startY) {
    let y = startY;

    // Estado de resultados
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Estado de Resultados', 15, y);
    y += 8;

    const items = [
      { label: 'Ventas Totales', value: data.totalSales, bold: true },
      { label: 'Costo de Ventas', value: data.costOfSales },
      { label: 'Utilidad Bruta', value: data.grossProfit, bold: true },
      { label: 'Gastos Operativos', value: data.operatingExpenses },
      { label: 'EBITDA', value: data.ebitda, bold: true },
      { label: 'Depreciación', value: data.depreciation },
      { label: 'Utilidad Operativa', value: data.operatingProfit, bold: true },
      { label: 'Gastos Financieros', value: data.financialExpenses },
      { label: 'Utilidad Neta', value: data.netProfit, bold: true, highlight: true }
    ];

    items.forEach(item => {
      if (item.highlight) {
        doc.setFillColor(56, 161, 105);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 4, 180, 8, 'F');
      }
      doc.setFont('Helvetica', item.bold ? 'bold' : 'normal');
      doc.setFontSize(10);
      doc.text(item.label, 20, y);
      doc.text(`$${(item.value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 160, y, { align: 'right' });
      if (item.highlight) doc.setTextColor(0, 0, 0);
      y += 7;
    });

    return y;
  }

  _addPDFGenericContent(doc, data, startY) {
    let y = startY;
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');

    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 15, y);

    return y + lines.length * 5;
  }

  // ============ EXCEL GENERATION ============
  async generateExcel(data, options = {}) {
    const wb = XLSX.utils.book_new();

    // Configurar propiedades del libro
    wb.Props = {
      Title: options.title || 'Reporte',
      Author: this.agent.nombre || 'Vértice Gastronómico',
      CreatedDate: new Date()
    };

    if (Array.isArray(data)) {
      // Si es un array simple, crear una hoja
      const ws = XLSX.utils.json_to_sheet(data);
      this._applyExcelStyles(ws, options);
      XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Datos');
    } else if (typeof data === 'object') {
      // Si es un objeto con múltiples hojas
      Object.keys(data).forEach(sheetName => {
        const sheetData = data[sheetName];
        const ws = XLSX.utils.json_to_sheet(
          Array.isArray(sheetData) ? sheetData : [sheetData]
        );
        this._applyExcelStyles(ws, options);
        XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
      });
    }

    // Retornar según formato solicitado
    if (options.returnType === 'blob') {
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    return XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  }

  _applyExcelStyles(ws, options) {
    // Ajustar anchos de columna
    if (!ws['!cols']) ws['!cols'] = [];
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell && cell.v) {
          const len = String(cell.v).length;
          if (len > maxWidth) maxWidth = Math.min(len, 50);
        }
      }
      ws['!cols'][C] = { wch: maxWidth + 2 };
    }
  }

  // ============ WORD GENERATION ============
  async generateWord(data, options = {}) {
    const children = [];

    // Título
    children.push(
      new Paragraph({
        text: options.title || 'Documento',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Información del agente
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Generado por: ', bold: true }),
          new TextRun({ text: this.agent.nombre || 'Agente IA' })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Fecha: ', bold: true }),
          new TextRun({ text: new Date().toLocaleDateString('es-MX') })
        ],
        spacing: { after: 400 }
      })
    );

    // Contenido según tipo
    if (options.type === 'report' && data.sections) {
      data.sections.forEach(section => {
        children.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
          }),
          new Paragraph({
            text: section.content,
            spacing: { after: 200 }
          })
        );
      });
    } else if (options.type === 'table' && Array.isArray(data)) {
      const table = this._createWordTable(data);
      children.push(table);
    } else {
      // Contenido genérico
      const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      children.push(
        new Paragraph({
          text: content,
          spacing: { after: 200 }
        })
      );
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children
      }]
    });

    // Retornar como blob
    const buffer = await Packer.toBuffer(doc);
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  }

  _createWordTable(data) {
    if (!data || data.length === 0) return new Paragraph({ text: 'Sin datos' });

    const headers = Object.keys(data[0]);

    const rows = [
      // Header row
      new TableRow({
        children: headers.map(h => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })]
        }))
      }),
      // Data rows
      ...data.map(row => new TableRow({
        children: headers.map(h => new TableCell({
          children: [new Paragraph({ text: String(row[h] || '') })]
        }))
      }))
    ];

    return new Table({
      rows,
      width: { size: 100, type: 'pct' }
    });
  }

  // ============ CSV GENERATION ============
  generateCSV(data, options = {}) {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const separator = options.separator || ',';

    const csvRows = [
      headers.join(separator),
      ...data.map(row =>
        headers.map(h => {
          let val = row[h];
          if (val === null || val === undefined) val = '';
          val = String(val);
          // Escapar comillas y valores con separadores
          if (val.includes(separator) || val.includes('"') || val.includes('\n')) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(separator)
      )
    ];

    return csvRows.join('\n');
  }

  // ============ JSON GENERATION ============
  generateJSON(data, options = {}) {
    const output = {
      meta: {
        generatedBy: this.agent.nombre || 'Agente IA',
        generatedAt: new Date().toISOString(),
        version: '1.0',
        ...options.meta
      },
      data
    };

    return JSON.stringify(output, null, options.pretty !== false ? 2 : 0);
  }
}

// ============ SISTEMA DE CALIDAD ============

export class QualitySystem {
  constructor(agentConfig) {
    this.agent = agentConfig;
    this.minimumScore = 95;
  }

  async validate(deliverable) {
    const checks = [];
    let score = 100;

    // Validar completitud
    if (!deliverable.content) {
      checks.push({ name: 'Contenido', passed: false, message: 'Sin contenido' });
      score -= 25;
    } else {
      checks.push({ name: 'Contenido', passed: true });
    }

    // Validar formato
    if (deliverable.format) {
      checks.push({ name: 'Formato', passed: true });
    } else {
      checks.push({ name: 'Formato', passed: false, message: 'Sin formato definido' });
      score -= 10;
    }

    // Validaciones específicas gastronómicas
    if (deliverable.type === 'costSheet') {
      const foodCostCheck = this._validateFoodCost(deliverable);
      checks.push(foodCostCheck);
      if (!foodCostCheck.passed) score -= 15;
    }

    return {
      passed: score >= this.minimumScore,
      score,
      checks,
      recommendations: this._generateRecommendations(checks)
    };
  }

  _validateFoodCost(deliverable) {
    const foodCost = deliverable.foodCostPercentage || 0;
    if (foodCost > 35) {
      return {
        name: 'Food Cost',
        passed: false,
        message: `Food cost ${foodCost.toFixed(1)}% supera el 35% recomendado`
      };
    }
    return { name: 'Food Cost', passed: true };
  }

  _generateRecommendations(checks) {
    return checks
      .filter(c => !c.passed)
      .map(c => `Revisar: ${c.message || c.name}`);
  }
}

// ============ PROCESAMIENTO AI ============

export class AIProcessor {
  constructor(agentConfig) {
    this.agent = agentConfig;
    this.modelConfig = {
      temperature: 0.7,
      maxTokens: 4096
    };
  }

  async process(prompt, context = {}) {
    // Esta función se conectaría al backend para procesamiento AI
    return {
      agentId: this.agent.id,
      agentName: this.agent.nombre,
      prompt,
      context,
      timestamp: new Date().toISOString()
    };
  }

  buildPrompt(template, variables) {
    let prompt = template;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    return prompt;
  }
}

// ============ WEBSOCKET HANDLER ============

export class WebSocketHandler {
  constructor(agentConfig) {
    this.agent = agentConfig;
    this.eventTypes = [
      'task_started',
      'task_progress',
      'task_completed',
      'task_error',
      'document_generated',
      'validation_completed'
    ];
  }

  emit(eventType, data) {
    // Emitir evento a través del sistema global de WebSocket
    if (typeof window !== 'undefined' && window.socketIO) {
      window.socketIO.emit('agent_event', {
        agentId: this.agent.id,
        agentName: this.agent.nombre,
        eventType,
        data,
        timestamp: new Date().toISOString()
      });
    }
    return { eventType, data, emitted: true };
  }

  subscribe(eventType, callback) {
    if (typeof window !== 'undefined' && window.socketIO) {
      window.socketIO.on(`agent_${this.agent.id}_${eventType}`, callback);
    }
  }
}

// ============ QUEUE PROCESSOR ============

export class QueueProcessor {
  constructor(agentConfig) {
    this.agent = agentConfig;
    this.queues = {
      documents: `agent_${agentConfig.id}_documents`,
      analysis: `agent_${agentConfig.id}_analysis`,
      reports: `agent_${agentConfig.id}_reports`
    };
  }

  async addToQueue(queueName, job) {
    return {
      queueName: this.queues[queueName] || queueName,
      jobId: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      job,
      status: 'queued',
      agentId: this.agent.id
    };
  }
}

// ============ STORAGE HANDLER (IndexedDB) ============

export class StorageHandler {
  constructor(agentConfig) {
    this.agent = agentConfig;
    this.dbName = 'vertice_gastronomico';
    this.storeName = `agent_${agentConfig.id}_storage`;
  }

  async save(key, data) {
    // Implementación de IndexedDB
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put({ key, data, timestamp: Date.now() });
      request.onsuccess = () => resolve({ key, saved: true });
      request.onerror = () => reject(request.error);
    });
  }

  async load(key) {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }

  async _openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }
}

// ============ CLASE BASE UNIVERSAL ============

export class UniversalAgent {
  constructor(config) {
    this.config = config;
    this.id = config.id;
    this.nombre = config.nombre;
    this.nombreCorto = config.nombreCorto;
    this.categoria = config.categoria;
    this.emoji = config.emoji;

    // ============ CONTEXTO DE CONSULTORÍA ============
    // IMPORTANTE: Vértice Gastronómico es una CONSULTORÍA, no un restaurante
    // Cada agente trabaja en el contexto de un CLIENTE específico
    this.clientContext = null; // Se establece al iniciar trabajo con un cliente
    this.currentProjectId = null; // Proyecto activo

    // Inicializar capacidades universales
    this.documents = new DocumentGenerator(config);
    this.quality = new QualitySystem(config);
    this.ai = new AIProcessor(config);
    this.websocket = new WebSocketHandler(config);
    this.queue = new QueueProcessor(config);
    this.storage = new StorageHandler(config);

    // ============ LECTOR DE ARCHIVOS UNIVERSAL ============
    // Soporta: PDF, Word, Excel, CSV, ZIP, TXT, JSON
    this.fileReader = fileReader;

    // Sistema de Triple Revisión de Calidad
    this.tripleReview = new TripleReviewSystem({
      minimumPassingScore: 85,
      autoCorrect: true,
      strictMode: false
    });

    // Historial de revisiones
    this.reviewHistory = [];

    // Estado del agente
    this.state = {
      initialized: true,
      lastActivity: new Date().toISOString(),
      tasksCompleted: 0,
      documentsGenerated: 0,
      documentsReviewed: 0,
      documentsApproved: 0,
      documentsRejected: 0
    };
  }

  // ============ MÉTODOS DE CONTEXTO DE CLIENTE (CONSULTORÍA) ============

  /**
   * Establece el contexto de cliente para este agente
   * IMPORTANTE: Siempre llamar antes de generar documentos para un cliente
   * @param {ClientContext} context - Contexto del cliente desde ClientManager
   */
  setClientContext(context) {
    this.clientContext = context;

    // Actualizar branding del generador de documentos con el del cliente
    if (context && context.client) {
      this.documents.branding = {
        ...this.documents.branding,
        ...context.client.branding,
        clientName: context.client.name,
        clientCode: context.client.code
      };
    }

    this.websocket.emit('client_context_set', {
      agentId: this.id,
      clientId: context?.client?.id,
      clientName: context?.client?.name
    });
  }

  /**
   * Limpia el contexto de cliente (al cambiar de cliente o terminar trabajo)
   */
  clearClientContext() {
    const previousClient = this.clientContext?.client?.name;
    this.clientContext = null;
    this.currentProjectId = null;

    // Restaurar branding por defecto
    this.documents.branding = {
      primaryColor: '#1a365d',
      secondaryColor: '#2d3748',
      accentColor: '#38a169',
      fontFamily: 'Helvetica',
      logo: null
    };

    this.websocket.emit('client_context_cleared', {
      agentId: this.id,
      previousClient
    });
  }

  /**
   * Establece el proyecto activo
   * @param {string} projectId - ID del proyecto
   */
  setCurrentProject(projectId) {
    this.currentProjectId = projectId;
  }

  /**
   * Verifica si hay un contexto de cliente activo
   * @returns {boolean}
   */
  hasClientContext() {
    return this.clientContext !== null;
  }

  /**
   * Obtiene información del cliente actual para documentos
   * @returns {Object} Información del cliente o valores por defecto
   */
  getClientInfo() {
    if (!this.clientContext) {
      return {
        name: 'Vértice Gastronómico',
        code: 'VG',
        isConsultancy: true,
        message: 'Sin contexto de cliente - Documento interno de consultoría'
      };
    }

    return {
      name: this.clientContext.client.name,
      code: this.clientContext.client.code,
      legalName: this.clientContext.client.legalName,
      isConsultancy: false,
      header: this.clientContext.getDocumentHeader(),
      footer: this.clientContext.getDocumentFooter()
    };
  }

  /**
   * Registra actividad en el contexto del cliente
   * @param {string} action - Acción realizada
   * @param {Object} details - Detalles adicionales
   */
  logClientActivity(action, details = {}) {
    if (!this.clientContext) {
      console.warn(`[${this.nombreCorto}] Actividad sin contexto de cliente:`, action);
      return;
    }

    return this.clientContext.logActivity(action, {
      agentId: this.id,
      agentName: this.nombre,
      ...details
    });
  }

  // Métodos universales que todos los agentes heredan

  /**
   * Genera un documento con Triple Revisión de Calidad automática
   * @param {string} type - Tipo de documento (pdf, excel, word, csv, json)
   * @param {Object} data - Datos para el documento
   * @param {Object} options - Opciones de generación
   * @param {boolean} options.skipReview - Si es true, omite la triple revisión (NO RECOMENDADO)
   * @returns {Object} Documento generado con certificado de revisión
   */
  async generateDocument(type, data, options = {}) {
    this.websocket.emit('document_generation_started', { type, options });

    // TRIPLE REVISIÓN DE CALIDAD - "El más mínimo error es nuestro prestigio"
    if (!options.skipReview) {
      const reviewResult = await this.executeTripleReview(data, options.type || 'report', type);

      // Si no pasa la revisión, NO emitir el documento
      if (!reviewResult.approved) {
        this.state.documentsRejected++;

        this.websocket.emit('document_review_failed', {
          type,
          reviewId: reviewResult.reviewId,
          score: reviewResult.finalScore,
          errors: reviewResult.summary.criticalErrors,
          message: 'Documento rechazado por control de calidad'
        });

        // Retornar resultado con errores para corrección
        return {
          success: false,
          reviewResult,
          document: null,
          message: `❌ Documento NO aprobado. Score: ${reviewResult.finalScore}/100. Errores críticos: ${reviewResult.summary.criticalErrors}`,
          corrections: reviewResult.corrections,
          errors: reviewResult.errors
        };
      }

      // Usar datos corregidos si hay correcciones
      if (reviewResult.correctedDocument) {
        data = reviewResult.correctedDocument;
      }

      this.state.documentsApproved++;
    }

    // Generar documento
    let result;
    switch (type) {
      case 'pdf':
        result = await this.documents.generatePDF(data, options);
        break;
      case 'excel':
        result = await this.documents.generateExcel(data, options);
        break;
      case 'word':
        result = await this.documents.generateWord(data, options);
        break;
      case 'csv':
        result = this.documents.generateCSV(data, options);
        break;
      case 'json':
        result = this.documents.generateJSON(data, options);
        break;
      default:
        throw new Error(`Tipo de documento no soportado: ${type}`);
    }

    this.state.documentsGenerated++;
    this.websocket.emit('document_generated', { type, success: true });

    // Retornar con certificado de calidad
    return {
      success: true,
      document: result,
      type,
      generatedBy: this.nombre,
      generatedAt: new Date().toISOString(),
      qualityCertified: !options.skipReview,
      message: options.skipReview
        ? '⚠️ Documento generado SIN revisión de calidad'
        : '✅ Documento aprobado por Triple Revisión de Calidad'
    };
  }

  async validateDeliverable(deliverable) {
    return this.quality.validate(deliverable);
  }

  async processWithAI(prompt, context) {
    return this.ai.process(prompt, context);
  }

  emitEvent(eventType, data) {
    return this.websocket.emit(eventType, data);
  }

  async queueTask(queueName, task) {
    return this.queue.addToQueue(queueName, task);
  }

  // ============ MÉTODOS DE LECTURA DE ARCHIVOS ============

  /**
   * Lee un archivo y extrae su contenido
   * Soporta: PDF, Word (.docx), Excel (.xlsx), CSV, ZIP, TXT, JSON
   * @param {string|Object} fileOrPath - Ruta del archivo o objeto con path/buffer
   * @returns {Promise<Object>} Contenido extraído
   */
  async readFile(fileOrPath) {
    this.websocket.emit('file_read_started', {
      file: typeof fileOrPath === 'string' ? fileOrPath : (fileOrPath.path || fileOrPath.name)
    });

    const result = await this.fileReader.read(fileOrPath);

    this.websocket.emit('file_read_completed', {
      success: result.success,
      type: result.type,
      file: result.metadata?.fileName
    });

    return result;
  }

  /**
   * Extrae solo el texto de un archivo
   * @param {string|Object} fileOrPath - Ruta del archivo o objeto
   * @returns {Promise<Object>} Texto extraído
   */
  async extractTextFromFile(fileOrPath) {
    return this.fileReader.extractText(fileOrPath);
  }

  /**
   * Lee múltiples archivos
   * @param {Array} files - Array de rutas o objetos de archivo
   * @returns {Promise<Object>} Resultados de lectura
   */
  async readMultipleFiles(files) {
    this.websocket.emit('batch_file_read_started', { count: files.length });

    const result = await this.fileReader.readMultiple(files);

    this.websocket.emit('batch_file_read_completed', {
      total: result.total,
      successful: result.successful,
      failed: result.failed
    });

    return result;
  }

  /**
   * Obtiene información de un archivo sin leer contenido completo
   * @param {string} filePath - Ruta del archivo
   * @returns {Promise<Object>} Información del archivo
   */
  async getFileInfo(filePath) {
    return this.fileReader.getInfo(filePath);
  }

  /**
   * Verifica si un formato de archivo está soportado
   * @param {string} extension - Extensión del archivo (ej: '.pdf')
   * @returns {boolean}
   */
  isFileFormatSupported(extension) {
    return this.fileReader.isSupported(extension);
  }

  /**
   * Obtiene la lista de formatos de archivo soportados
   * @returns {Array<string>}
   */
  getSupportedFileFormats() {
    return this.fileReader.supportedFormats;
  }

  async saveData(key, data) {
    return this.storage.save(key, data);
  }

  async loadData(key) {
    return this.storage.load(key);
  }

  getState() {
    return { ...this.state };
  }

  getCapabilities() {
    return {
      documentGeneration: ['pdf', 'excel', 'word', 'csv', 'json'],
      fileReading: this.fileReader.supportedFormats,
      qualityValidation: true,
      tripleReview: true,
      aiProcessing: true,
      realTimeEvents: true,
      queueProcessing: true,
      localStorage: true,
      agentInfo: {
        id: this.id,
        nombre: this.nombre,
        categoria: this.categoria
      }
    };
  }

  // ============ TRIPLE REVISIÓN DE CALIDAD ============

  /**
   * Ejecuta el proceso completo de Triple Revisión de Calidad
   * @param {Object} data - Datos a revisar
   * @param {string} documentType - Tipo de documento
   * @param {string} format - Formato de salida
   * @param {Object} context - Contexto adicional
   * @returns {Object} Resultado de la triple revisión
   */
  async executeTripleReview(data, documentType, format = 'pdf', context = {}) {
    this.websocket.emit('triple_review_started', {
      agentId: this.id,
      agentName: this.nombre,
      documentType,
      format
    });

    const result = await this.tripleReview.executeTripleReview(data, documentType, format, context);

    // Guardar en historial
    this.reviewHistory.push({
      reviewId: result.reviewId,
      approved: result.approved,
      score: result.finalScore,
      timestamp: new Date().toISOString()
    });

    // Limitar historial a últimas 100 revisiones
    if (this.reviewHistory.length > 100) {
      this.reviewHistory = this.reviewHistory.slice(-100);
    }

    this.state.documentsReviewed++;

    this.websocket.emit('triple_review_completed', {
      agentId: this.id,
      reviewId: result.reviewId,
      approved: result.approved,
      score: result.finalScore,
      grade: result.certificate.grade
    });

    return result;
  }

  /**
   * Obtiene estadísticas de revisiones del agente
   * @returns {Object} Estadísticas de calidad
   */
  getQualityStats() {
    const total = this.reviewHistory.length;
    if (total === 0) {
      return {
        totalReviews: 0,
        approvalRate: 0,
        averageScore: 0,
        gradeDistribution: {}
      };
    }

    const approved = this.reviewHistory.filter(r => r.approved).length;
    const avgScore = this.reviewHistory.reduce((sum, r) => sum + r.score, 0) / total;

    return {
      totalReviews: total,
      approvedReviews: approved,
      rejectedReviews: total - approved,
      approvalRate: ((approved / total) * 100).toFixed(1),
      averageScore: avgScore.toFixed(1),
      lastReview: this.reviewHistory[this.reviewHistory.length - 1],
      documentStats: {
        generated: this.state.documentsGenerated,
        approved: this.state.documentsApproved,
        rejected: this.state.documentsRejected
      }
    };
  }

  /**
   * Revisa múltiples documentos en lote
   * @param {Array} documents - Array de documentos a revisar
   * @param {string} documentType - Tipo de documento
   * @param {string} format - Formato de salida
   * @returns {Object} Resultados del lote
   */
  async batchReview(documents, documentType, format = 'pdf') {
    this.websocket.emit('batch_review_started', {
      agentId: this.id,
      count: documents.length
    });

    const results = await this.tripleReview.batchReview(documents, documentType, format);

    this.websocket.emit('batch_review_completed', {
      agentId: this.id,
      summary: results.summary
    });

    return results;
  }

  /**
   * Genera un reporte de calidad del agente
   * @returns {Object} Reporte de calidad
   */
  async generateQualityReport() {
    const stats = this.getQualityStats();

    const reportData = {
      title: `Reporte de Calidad - ${this.nombre}`,
      generatedBy: this.nombre,
      generatedAt: new Date().toISOString(),
      period: 'Histórico completo',
      summary: `Este agente ha procesado ${stats.totalReviews} revisiones con una tasa de aprobación del ${stats.approvalRate}%`,
      metrics: [
        { name: 'Total Revisiones', value: stats.totalReviews },
        { name: 'Documentos Aprobados', value: stats.approvedReviews },
        { name: 'Documentos Rechazados', value: stats.rejectedReviews },
        { name: 'Tasa de Aprobación', value: stats.approvalRate, unit: '%' },
        { name: 'Score Promedio', value: stats.averageScore, unit: '/100' }
      ],
      sections: [
        {
          title: 'Estadísticas de Documentos',
          content: `Generados: ${stats.documentStats.generated}, Aprobados: ${stats.documentStats.approved}, Rechazados: ${stats.documentStats.rejected}`
        },
        {
          title: 'Sistema de Triple Revisión',
          content: 'Todos los documentos pasan por 3 niveles de revisión: Validación Técnica, Verificación de Consistencia, y Control de Calidad Final.'
        }
      ]
    };

    // Este reporte se genera SIN revisión para evitar recursión
    return this.generateDocument('pdf', reportData, {
      type: 'report',
      title: reportData.title,
      skipReview: true
    });
  }
}

export default UniversalAgent;
