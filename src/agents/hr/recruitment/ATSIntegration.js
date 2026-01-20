/**
 * SISTEMA DE INTEGRACIÓN ATS (Applicant Tracking System)
 * Vértice Gastronómico - Módulo de Lectura e Integración con ATS
 *
 * Permite importar candidatos desde diversos sistemas ATS populares
 * y exportar datos en formatos compatibles.
 *
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE INTEGRACIONES ATS
// ═══════════════════════════════════════════════════════════════════

export const ATS_PROVIDERS = {
  // Sistemas ATS Populares
  WORKDAY: {
    id: 'workday',
    name: 'Workday',
    type: 'enterprise',
    formats: ['xml', 'json', 'csv'],
    fields: {
      candidateId: 'Candidate_ID',
      firstName: 'First_Name',
      lastName: 'Last_Name',
      email: 'Email_Address',
      phone: 'Phone_Number',
      resume: 'Resume_Text',
      appliedPosition: 'Job_Requisition',
      status: 'Application_Status',
      source: 'Source',
      dateApplied: 'Application_Date'
    }
  },

  GREENHOUSE: {
    id: 'greenhouse',
    name: 'Greenhouse',
    type: 'enterprise',
    formats: ['json', 'csv'],
    fields: {
      candidateId: 'id',
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email_addresses',
      phone: 'phone_numbers',
      resume: 'attachments',
      appliedPosition: 'applications.jobs',
      status: 'applications.status',
      source: 'source',
      dateApplied: 'applications.applied_at'
    }
  },

  LEVER: {
    id: 'lever',
    name: 'Lever',
    type: 'enterprise',
    formats: ['json', 'csv'],
    fields: {
      candidateId: 'id',
      firstName: 'name',
      lastName: '',
      email: 'emails',
      phone: 'phones',
      resume: 'resume',
      appliedPosition: 'applications',
      status: 'stage',
      source: 'origin',
      dateApplied: 'createdAt'
    }
  },

  BAMBOOHR: {
    id: 'bamboohr',
    name: 'BambooHR',
    type: 'smb',
    formats: ['json', 'csv'],
    fields: {
      candidateId: 'id',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phone: 'phone',
      resume: 'resume',
      appliedPosition: 'jobId',
      status: 'status',
      source: 'source',
      dateApplied: 'applicationDate'
    }
  },

  BREEZY: {
    id: 'breezy',
    name: 'Breezy HR',
    type: 'smb',
    formats: ['json', 'csv'],
    fields: {
      candidateId: '_id',
      firstName: 'name.first',
      lastName: 'name.last',
      email: 'email_address',
      phone: 'phone_number',
      resume: 'resume',
      appliedPosition: 'position',
      status: 'stage.name',
      source: 'origin.source',
      dateApplied: 'creation_date'
    }
  },

  ZOHO_RECRUIT: {
    id: 'zoho_recruit',
    name: 'Zoho Recruit',
    type: 'smb',
    formats: ['json', 'csv', 'xml'],
    fields: {
      candidateId: 'CANDIDATEID',
      firstName: 'First_Name',
      lastName: 'Last_Name',
      email: 'Email',
      phone: 'Mobile',
      resume: 'Resume_ID',
      appliedPosition: 'Job_Opening_Name',
      status: 'Candidate_Status',
      source: 'Source',
      dateApplied: 'Applied_Date'
    }
  },

  JOBVITE: {
    id: 'jobvite',
    name: 'Jobvite',
    type: 'enterprise',
    formats: ['json', 'csv'],
    fields: {
      candidateId: 'eId',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phone: 'phone',
      resume: 'resumeText',
      appliedPosition: 'requisitionId',
      status: 'workflowState',
      source: 'source',
      dateApplied: 'dateAdded'
    }
  },

  // Formato genérico para otros ATS
  GENERIC: {
    id: 'generic',
    name: 'Genérico',
    type: 'generic',
    formats: ['json', 'csv', 'xml'],
    fields: {
      candidateId: 'id',
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      phone: 'phone',
      resume: 'resume',
      appliedPosition: 'position',
      status: 'status',
      source: 'source',
      dateApplied: 'date'
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// MAPEO DE ESTADOS DE CANDIDATOS
// ═══════════════════════════════════════════════════════════════════

export const STATUS_MAPPING = {
  // Estados de entrada (desde ATS)
  inbound: {
    'new': 'NUEVO',
    'applied': 'APLICADO',
    'screening': 'PRESELECCIÓN',
    'phone_screen': 'ENTREVISTA_TELEFÓNICA',
    'interview': 'ENTREVISTA',
    'assessment': 'EVALUACIÓN',
    'offer': 'OFERTA',
    'hired': 'CONTRATADO',
    'rejected': 'RECHAZADO',
    'withdrawn': 'RETIRADO',
    'on_hold': 'EN_ESPERA'
  },
  // Estados de salida (hacia ATS)
  outbound: {
    'NUEVO': 'new',
    'APLICADO': 'applied',
    'PRESELECCIÓN': 'screening',
    'ENTREVISTA_TELEFÓNICA': 'phone_screen',
    'ENTREVISTA': 'interview',
    'EVALUACIÓN': 'assessment',
    'OFERTA': 'offer',
    'CONTRATADO': 'hired',
    'RECHAZADO': 'rejected',
    'RETIRADO': 'withdrawn',
    'EN_ESPERA': 'on_hold'
  }
};

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL DE INTEGRACIÓN ATS
// ═══════════════════════════════════════════════════════════════════

/**
 * Gestor de integración con sistemas ATS
 */
export class ATSIntegrationManager {
  constructor() {
    this.providers = ATS_PROVIDERS;
    this.statusMapping = STATUS_MAPPING;
    this.importHistory = [];
    this.exportHistory = [];
  }

  // ─────────────────────────────────────────────────────────────────
  // IMPORTACIÓN DE DATOS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Importa candidatos desde datos de ATS
   * @param {string|Object} data - Datos del ATS (JSON, CSV, XML)
   * @param {string} provider - Proveedor ATS
   * @param {Object} options - Opciones de importación
   */
  async importCandidates(data, provider = 'GENERIC', options = {}) {
    const providerConfig = this.providers[provider] || this.providers.GENERIC;
    const importId = `IMP-${Date.now()}`;

    const result = {
      importId,
      provider: providerConfig.name,
      timestamp: new Date().toISOString(),
      success: false,
      candidates: [],
      errors: [],
      stats: {
        total: 0,
        imported: 0,
        skipped: 0,
        errors: 0
      }
    };

    try {
      // Parsear datos según formato
      let parsedData;
      if (typeof data === 'string') {
        parsedData = this.parseData(data, options.format || 'json');
      } else if (Array.isArray(data)) {
        parsedData = data;
      } else {
        parsedData = [data];
      }

      result.stats.total = parsedData.length;

      // Procesar cada candidato
      for (let i = 0; i < parsedData.length; i++) {
        try {
          const rawCandidate = parsedData[i];
          const normalizedCandidate = this.normalizeCandidate(
            rawCandidate,
            providerConfig
          );

          // Validar campos requeridos
          const validation = this.validateCandidate(normalizedCandidate);

          if (validation.valid) {
            result.candidates.push({
              ...normalizedCandidate,
              importedAt: new Date().toISOString(),
              sourceProvider: provider,
              originalData: options.keepOriginal ? rawCandidate : undefined
            });
            result.stats.imported++;
          } else {
            result.errors.push({
              index: i,
              reason: validation.errors.join(', '),
              data: rawCandidate
            });
            result.stats.skipped++;
          }
        } catch (error) {
          result.errors.push({
            index: i,
            reason: error.message,
            data: parsedData[i]
          });
          result.stats.errors++;
        }
      }

      result.success = result.stats.imported > 0;

      // Guardar en historial
      this.importHistory.push({
        importId,
        provider,
        timestamp: result.timestamp,
        stats: result.stats
      });

    } catch (error) {
      result.error = error.message;
    }

    return result;
  }

  /**
   * Parsea datos según formato
   */
  parseData(data, format) {
    switch (format.toLowerCase()) {
      case 'json':
        return this.parseJSON(data);
      case 'csv':
        return this.parseCSV(data);
      case 'xml':
        return this.parseXML(data);
      default:
        // Intentar detectar formato
        return this.autoDetectAndParse(data);
    }
  }

  /**
   * Parsea JSON
   */
  parseJSON(data) {
    try {
      const parsed = JSON.parse(data);
      // Manejar diferentes estructuras
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed.data && Array.isArray(parsed.data)) {
        return parsed.data;
      } else if (parsed.candidates && Array.isArray(parsed.candidates)) {
        return parsed.candidates;
      } else if (parsed.results && Array.isArray(parsed.results)) {
        return parsed.results;
      }
      return [parsed];
    } catch (error) {
      throw new Error(`Error parseando JSON: ${error.message}`);
    }
  }

  /**
   * Parsea CSV
   */
  parseCSV(data) {
    const lines = data.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV debe tener al menos encabezados y una fila de datos');
    }

    const headers = this.parseCSVLine(lines[0]);
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const obj = {};

      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });

      results.push(obj);
    }

    return results;
  }

  /**
   * Parsea línea CSV
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Parsea XML básico
   */
  parseXML(data) {
    // Parser XML simplificado para estructuras comunes de ATS
    const candidates = [];

    // Buscar elementos de candidato
    const candidateMatches = data.match(/<candidate[^>]*>[\s\S]*?<\/candidate>/gi) ||
                            data.match(/<applicant[^>]*>[\s\S]*?<\/applicant>/gi) ||
                            data.match(/<row[^>]*>[\s\S]*?<\/row>/gi);

    if (!candidateMatches) {
      throw new Error('No se encontraron candidatos en el XML');
    }

    for (const match of candidateMatches) {
      const candidate = {};

      // Extraer elementos
      const elementMatches = match.match(/<(\w+)[^>]*>([^<]*)<\/\1>/g);

      if (elementMatches) {
        for (const elem of elementMatches) {
          const tagMatch = elem.match(/<(\w+)[^>]*>([^<]*)<\/\1>/);
          if (tagMatch) {
            candidate[tagMatch[1]] = tagMatch[2];
          }
        }
      }

      candidates.push(candidate);
    }

    return candidates;
  }

  /**
   * Detecta formato y parsea
   */
  autoDetectAndParse(data) {
    const trimmed = data.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return this.parseJSON(data);
    } else if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
      return this.parseXML(data);
    } else {
      return this.parseCSV(data);
    }
  }

  /**
   * Normaliza candidato al formato interno
   */
  normalizeCandidate(rawData, providerConfig) {
    const fields = providerConfig.fields;

    return {
      id: this.extractField(rawData, fields.candidateId) || `CAND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstName: this.extractField(rawData, fields.firstName) || '',
      lastName: this.extractField(rawData, fields.lastName) || '',
      name: this.buildFullName(rawData, fields),
      email: this.extractEmail(rawData, fields.email),
      phone: this.extractPhone(rawData, fields.phone),
      resume: this.extractField(rawData, fields.resume) || '',
      appliedPosition: this.extractField(rawData, fields.appliedPosition) || '',
      status: this.normalizeStatus(this.extractField(rawData, fields.status)),
      source: this.extractField(rawData, fields.source) || 'ATS Import',
      dateApplied: this.extractDate(rawData, fields.dateApplied),
      rawData: rawData
    };
  }

  /**
   * Extrae campo con soporte para rutas anidadas
   */
  extractField(data, fieldPath) {
    if (!fieldPath) return '';

    const parts = fieldPath.split('.');
    let value = data;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return '';
      }
    }

    return value || '';
  }

  /**
   * Construye nombre completo
   */
  buildFullName(data, fields) {
    const firstName = this.extractField(data, fields.firstName) || '';
    const lastName = this.extractField(data, fields.lastName) || '';

    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    // Intentar campo 'name' directamente
    return data.name || data.fullName || data.full_name || `${firstName}${lastName}`.trim();
  }

  /**
   * Extrae email
   */
  extractEmail(data, fieldPath) {
    const value = this.extractField(data, fieldPath);

    if (Array.isArray(value)) {
      const primary = value.find(e => e.primary || e.type === 'primary');
      return primary?.value || primary?.email || value[0]?.value || value[0]?.email || value[0] || '';
    }

    if (typeof value === 'object') {
      return value.value || value.email || value.address || '';
    }

    return value || '';
  }

  /**
   * Extrae teléfono
   */
  extractPhone(data, fieldPath) {
    const value = this.extractField(data, fieldPath);

    if (Array.isArray(value)) {
      const primary = value.find(p => p.primary || p.type === 'mobile');
      return primary?.value || primary?.phone || value[0]?.value || value[0]?.phone || value[0] || '';
    }

    if (typeof value === 'object') {
      return value.value || value.phone || value.number || '';
    }

    return value || '';
  }

  /**
   * Extrae y parsea fecha
   */
  extractDate(data, fieldPath) {
    const value = this.extractField(data, fieldPath);

    if (!value) {
      return new Date().toISOString();
    }

    try {
      // Intentar varios formatos
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      // Si falla, usar fecha actual
    }

    return new Date().toISOString();
  }

  /**
   * Normaliza estado del candidato
   */
  normalizeStatus(status) {
    if (!status) return 'NUEVO';

    const normalized = status.toLowerCase().replace(/[_\s-]/g, '_');
    return this.statusMapping.inbound[normalized] || 'NUEVO';
  }

  /**
   * Valida candidato
   */
  validateCandidate(candidate) {
    const errors = [];

    if (!candidate.name && !candidate.firstName) {
      errors.push('Nombre requerido');
    }

    if (!candidate.email) {
      errors.push('Email requerido');
    } else if (!this.isValidEmail(candidate.email)) {
      errors.push('Email inválido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ─────────────────────────────────────────────────────────────────
  // EXPORTACIÓN DE DATOS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Exporta candidatos al formato del ATS
   */
  exportCandidates(candidates, provider = 'GENERIC', format = 'json') {
    const providerConfig = this.providers[provider] || this.providers.GENERIC;
    const exportId = `EXP-${Date.now()}`;

    const result = {
      exportId,
      provider: providerConfig.name,
      format,
      timestamp: new Date().toISOString(),
      success: false,
      data: null,
      count: candidates.length
    };

    try {
      // Mapear candidatos al formato del ATS
      const mappedCandidates = candidates.map(c =>
        this.mapToATSFormat(c, providerConfig)
      );

      // Generar salida según formato
      switch (format.toLowerCase()) {
        case 'json':
          result.data = JSON.stringify(mappedCandidates, null, 2);
          break;
        case 'csv':
          result.data = this.toCSV(mappedCandidates, providerConfig);
          break;
        case 'xml':
          result.data = this.toXML(mappedCandidates, providerConfig);
          break;
        default:
          result.data = JSON.stringify(mappedCandidates, null, 2);
      }

      result.success = true;

      // Guardar en historial
      this.exportHistory.push({
        exportId,
        provider,
        format,
        timestamp: result.timestamp,
        count: result.count
      });

    } catch (error) {
      result.error = error.message;
    }

    return result;
  }

  /**
   * Mapea candidato al formato del ATS
   */
  mapToATSFormat(candidate, providerConfig) {
    const fields = providerConfig.fields;
    const mapped = {};

    // Mapeo inverso de campos
    if (fields.candidateId) mapped[fields.candidateId] = candidate.id;
    if (fields.firstName) mapped[fields.firstName] = candidate.firstName;
    if (fields.lastName) mapped[fields.lastName] = candidate.lastName;
    if (fields.email) mapped[fields.email] = candidate.email;
    if (fields.phone) mapped[fields.phone] = candidate.phone;
    if (fields.appliedPosition) mapped[fields.appliedPosition] = candidate.appliedPosition;
    if (fields.status) mapped[fields.status] = this.statusMapping.outbound[candidate.status] || 'new';
    if (fields.source) mapped[fields.source] = candidate.source;
    if (fields.dateApplied) mapped[fields.dateApplied] = candidate.dateApplied;

    // Agregar campos adicionales de evaluación
    if (candidate.evaluation) {
      mapped.evaluation_score = candidate.evaluation.score;
      mapped.evaluation_recommendation = candidate.evaluation.recommendation;
    }

    return mapped;
  }

  /**
   * Convierte a CSV
   */
  toCSV(candidates, providerConfig) {
    if (candidates.length === 0) return '';

    const headers = Object.keys(candidates[0]);
    const lines = [headers.join(',')];

    for (const candidate of candidates) {
      const values = headers.map(h => {
        const val = candidate[h];
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val || '';
      });
      lines.push(values.join(','));
    }

    return lines.join('\n');
  }

  /**
   * Convierte a XML
   */
  toXML(candidates, providerConfig) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<candidates>\n';

    for (const candidate of candidates) {
      xml += '  <candidate>\n';
      for (const [key, value] of Object.entries(candidate)) {
        if (value !== undefined && value !== null) {
          const escaped = String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          xml += `    <${key}>${escaped}</${key}>\n`;
        }
      }
      xml += '  </candidate>\n';
    }

    xml += '</candidates>';
    return xml;
  }

  // ─────────────────────────────────────────────────────────────────
  // SINCRONIZACIÓN Y WEBHOOKS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Genera configuración de webhook para ATS
   */
  generateWebhookConfig(provider, events = ['candidate.created', 'candidate.updated']) {
    return {
      provider,
      events,
      endpoint: '/api/ats/webhook',
      headers: {
        'Content-Type': 'application/json',
        'X-ATS-Provider': provider
      },
      authentication: {
        type: 'bearer',
        description: 'Incluir token de API en header Authorization'
      },
      payloadFormat: {
        event: 'string - Tipo de evento',
        timestamp: 'ISO 8601 datetime',
        data: 'object - Datos del candidato'
      },
      samplePayload: {
        event: 'candidate.created',
        timestamp: new Date().toISOString(),
        data: {
          id: 'CAND-123',
          name: 'Juan García',
          email: 'juan.garcia@email.com',
          position: 'Chef Ejecutivo'
        }
      }
    };
  }

  /**
   * Procesa evento de webhook
   */
  processWebhookEvent(event, data, provider) {
    const result = {
      eventId: `EVT-${Date.now()}`,
      event,
      provider,
      timestamp: new Date().toISOString(),
      processed: false,
      action: null
    };

    switch (event) {
      case 'candidate.created':
      case 'candidate.applied':
        result.action = 'IMPORT_NEW';
        result.candidate = this.normalizeCandidate(data, this.providers[provider] || this.providers.GENERIC);
        result.processed = true;
        break;

      case 'candidate.updated':
      case 'candidate.status_changed':
        result.action = 'UPDATE_STATUS';
        result.candidateId = data.id || data.candidateId;
        result.newStatus = this.normalizeStatus(data.status);
        result.processed = true;
        break;

      case 'candidate.hired':
        result.action = 'MARK_HIRED';
        result.candidateId = data.id || data.candidateId;
        result.processed = true;
        break;

      case 'candidate.rejected':
        result.action = 'MARK_REJECTED';
        result.candidateId = data.id || data.candidateId;
        result.reason = data.reason || 'No especificado';
        result.processed = true;
        break;

      default:
        result.action = 'UNKNOWN';
        result.rawData = data;
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────────
  // BÚSQUEDA Y FILTRADO
  // ─────────────────────────────────────────────────────────────────

  /**
   * Busca candidatos importados
   */
  searchImportedCandidates(candidates, filters = {}) {
    let results = [...candidates];

    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    }

    if (filters.position) {
      const pos = filters.position.toLowerCase();
      results = results.filter(c =>
        c.appliedPosition?.toLowerCase().includes(pos)
      );
    }

    if (filters.source) {
      results = results.filter(c =>
        c.source?.toLowerCase().includes(filters.source.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      results = results.filter(c => new Date(c.dateApplied) >= from);
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      results = results.filter(c => new Date(c.dateApplied) <= to);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.appliedPosition?.toLowerCase().includes(q)
      );
    }

    return {
      total: results.length,
      candidates: results
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // REPORTES Y ESTADÍSTICAS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Genera estadísticas de importación
   */
  getImportStats() {
    const totalImports = this.importHistory.length;
    const totalCandidates = this.importHistory.reduce((sum, h) => sum + h.stats.imported, 0);

    const byProvider = {};
    for (const h of this.importHistory) {
      if (!byProvider[h.provider]) {
        byProvider[h.provider] = { imports: 0, candidates: 0 };
      }
      byProvider[h.provider].imports++;
      byProvider[h.provider].candidates += h.stats.imported;
    }

    return {
      totalImports,
      totalCandidates,
      byProvider,
      lastImport: this.importHistory[this.importHistory.length - 1] || null
    };
  }

  /**
   * Lista proveedores soportados
   */
  getSupportedProviders() {
    return Object.entries(this.providers).map(([key, config]) => ({
      key,
      name: config.name,
      type: config.type,
      formats: config.formats
    }));
  }

  /**
   * Obtiene configuración de proveedor
   */
  getProviderConfig(provider) {
    return this.providers[provider] || this.providers.GENERIC;
  }
}

// ═══════════════════════════════════════════════════════════════════
// PLANTILLAS DE IMPORTACIÓN
// ═══════════════════════════════════════════════════════════════════

export const IMPORT_TEMPLATES = {
  // Template CSV básico
  CSV_BASIC: {
    name: 'CSV Básico',
    headers: ['id', 'first_name', 'last_name', 'email', 'phone', 'position', 'status', 'date'],
    example: `id,first_name,last_name,email,phone,position,status,date
1,Juan,García,juan.garcia@email.com,+52 55 1234 5678,Chef Ejecutivo,new,2024-01-15
2,María,López,maria.lopez@email.com,+52 55 8765 4321,Sous Chef,interview,2024-01-16`
  },

  // Template JSON básico
  JSON_BASIC: {
    name: 'JSON Básico',
    structure: {
      candidates: [
        {
          id: 'string',
          first_name: 'string',
          last_name: 'string',
          email: 'string',
          phone: 'string',
          position: 'string',
          status: 'string',
          date: 'ISO 8601'
        }
      ]
    },
    example: JSON.stringify({
      candidates: [
        {
          id: '1',
          first_name: 'Juan',
          last_name: 'García',
          email: 'juan.garcia@email.com',
          phone: '+52 55 1234 5678',
          position: 'Chef Ejecutivo',
          status: 'new',
          date: '2024-01-15T10:00:00Z'
        }
      ]
    }, null, 2)
  }
};

// Instancia exportada
export const atsIntegrationManager = new ATSIntegrationManager();

// Export default
export default {
  ATSIntegrationManager,
  atsIntegrationManager,
  ATS_PROVIDERS,
  STATUS_MAPPING,
  IMPORT_TEMPLATES
};
