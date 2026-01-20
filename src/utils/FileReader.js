/**
 * MÓDULO COMPARTIDO DE LECTURA DE ARCHIVOS
 * Vértice Gastronómico - Utilidad para todos los agentes
 *
 * Soporta: PDF, Word (.docx), Excel (.xlsx), CSV, ZIP
 *
 * @version 1.0.0
 */

import fs from 'fs/promises';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════
// CARGADORES DINÁMICOS DE DEPENDENCIAS
// ═══════════════════════════════════════════════════════════════════

let pdfParse = null;
let XLSX = null;
let AdmZip = null;
let mammoth = null;

/**
 * Carga pdf-parse dinámicamente
 */
const loadPdfParse = async () => {
  if (!pdfParse) {
    try {
      const module = await import('pdf-parse');
      pdfParse = module.default;
    } catch (e) {
      console.warn('[FileReader] pdf-parse no disponible');
    }
  }
  return pdfParse;
};

/**
 * Carga xlsx dinámicamente
 */
const loadXLSX = async () => {
  if (!XLSX) {
    try {
      const module = await import('xlsx');
      XLSX = module.default || module;
    } catch (e) {
      console.warn('[FileReader] xlsx no disponible');
    }
  }
  return XLSX;
};

/**
 * Carga adm-zip dinámicamente
 */
const loadAdmZip = async () => {
  if (!AdmZip) {
    try {
      const module = await import('adm-zip');
      AdmZip = module.default;
    } catch (e) {
      console.warn('[FileReader] adm-zip no disponible');
    }
  }
  return AdmZip;
};

/**
 * Carga mammoth dinámicamente (para Word)
 */
const loadMammoth = async () => {
  if (!mammoth) {
    try {
      const module = await import('mammoth');
      mammoth = module.default || module;
    } catch (e) {
      console.warn('[FileReader] mammoth no disponible');
    }
  }
  return mammoth;
};

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

/**
 * Lector universal de archivos
 */
export class FileReader {
  constructor() {
    this.supportedFormats = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv', '.zip', '.txt', '.md', '.json'];
    this.version = '1.0.0';
  }

  /**
   * Lee un archivo y extrae su contenido
   * @param {string|Object} fileOrPath - Ruta del archivo o objeto con path/buffer
   * @returns {Promise<Object>} Contenido extraído
   */
  async read(fileOrPath) {
    const file = typeof fileOrPath === 'string'
      ? { path: fileOrPath }
      : fileOrPath;

    const filePath = file.path;
    const ext = path.extname(filePath || file.name || '').toLowerCase();

    if (!this.isSupported(ext)) {
      return {
        success: false,
        error: `Formato no soportado: ${ext}`,
        supportedFormats: this.supportedFormats
      };
    }

    try {
      let content;
      let metadata = {
        fileName: path.basename(filePath || file.name || 'unknown'),
        extension: ext,
        readAt: new Date().toISOString()
      };

      switch (ext) {
        case '.pdf':
          content = await this.readPdf(file);
          break;
        case '.docx':
        case '.doc':
          content = await this.readWord(file);
          break;
        case '.xlsx':
        case '.xls':
          content = await this.readExcel(file);
          break;
        case '.csv':
          content = await this.readCsv(file);
          break;
        case '.zip':
          content = await this.readZip(file);
          break;
        case '.txt':
        case '.md':
          content = await this.readText(file);
          break;
        case '.json':
          content = await this.readJson(file);
          break;
        default:
          content = await this.readText(file);
      }

      return {
        success: true,
        content,
        metadata,
        type: ext.replace('.', '').toUpperCase()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fileName: filePath || file.name
      };
    }
  }

  /**
   * Verifica si el formato está soportado
   */
  isSupported(ext) {
    return this.supportedFormats.includes(ext.toLowerCase());
  }

  // ═══════════════════════════════════════════════════════════════════
  // LECTORES ESPECÍFICOS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Lee archivo PDF
   */
  async readPdf(file) {
    const parser = await loadPdfParse();
    if (!parser) {
      throw new Error('pdf-parse no está instalado. Ejecute: npm install pdf-parse');
    }

    let buffer;
    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = await fs.readFile(file.path);
    } else {
      throw new Error('Se requiere path o buffer para leer PDF');
    }

    const data = await parser(buffer);
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };
  }

  /**
   * Lee archivo Word (.docx)
   */
  async readWord(file) {
    const mammothLib = await loadMammoth();
    if (!mammothLib) {
      // Fallback: intentar leer como texto si mammoth no está disponible
      return await this.readText(file);
    }

    let buffer;
    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = await fs.readFile(file.path);
    } else {
      throw new Error('Se requiere path o buffer para leer Word');
    }

    const result = await mammothLib.extractRawText({ buffer });
    return {
      text: result.value,
      messages: result.messages
    };
  }

  /**
   * Lee archivo Excel
   */
  async readExcel(file) {
    const xlsxLib = await loadXLSX();
    if (!xlsxLib) {
      throw new Error('xlsx no está instalado. Ejecute: npm install xlsx');
    }

    let buffer;
    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = await fs.readFile(file.path);
    } else {
      throw new Error('Se requiere path o buffer para leer Excel');
    }

    const workbook = xlsxLib.read(buffer, { type: 'buffer' });
    const sheets = {};

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      sheets[sheetName] = {
        json: xlsxLib.utils.sheet_to_json(worksheet),
        csv: xlsxLib.utils.sheet_to_csv(worksheet),
        html: xlsxLib.utils.sheet_to_html(worksheet)
      };
    }

    return {
      sheetNames: workbook.SheetNames,
      sheets,
      totalSheets: workbook.SheetNames.length
    };
  }

  /**
   * Lee archivo CSV
   */
  async readCsv(file) {
    const text = await this.readText(file);
    const lines = text.text.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return { headers: [], rows: [], text: text.text };
    }

    // Detectar delimitador
    const firstLine = lines[0];
    const delimiter = firstLine.includes(';') ? ';' :
                     firstLine.includes('\t') ? '\t' : ',';

    const headers = this.parseCsvLine(firstLine, delimiter);
    const rows = lines.slice(1).map(line => {
      const values = this.parseCsvLine(line, delimiter);
      const row = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });

    return {
      headers,
      rows,
      totalRows: rows.length,
      delimiter,
      text: text.text
    };
  }

  /**
   * Parsea una línea CSV respetando comillas
   */
  parseCsvLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Lee archivo ZIP y extrae contenido
   */
  async readZip(file) {
    const AdmZipLib = await loadAdmZip();
    if (!AdmZipLib) {
      throw new Error('adm-zip no está instalado. Ejecute: npm install adm-zip');
    }

    let zip;
    if (file.buffer) {
      zip = new AdmZipLib(file.buffer);
    } else if (file.path) {
      zip = new AdmZipLib(file.path);
    } else {
      throw new Error('Se requiere path o buffer para leer ZIP');
    }

    const entries = zip.getEntries();
    const files = [];
    const extractedContents = {};

    for (const entry of entries) {
      const entryInfo = {
        name: entry.entryName,
        isDirectory: entry.isDirectory,
        size: entry.header.size,
        compressedSize: entry.header.compressedSize
      };
      files.push(entryInfo);

      // Extraer contenido de archivos soportados
      if (!entry.isDirectory) {
        const ext = path.extname(entry.entryName).toLowerCase();
        if (this.isSupported(ext) && ext !== '.zip') {
          try {
            const buffer = entry.getData();
            const content = await this.read({
              buffer,
              path: entry.entryName,
              name: entry.entryName
            });
            if (content.success) {
              extractedContents[entry.entryName] = content;
            }
          } catch (e) {
            extractedContents[entry.entryName] = {
              success: false,
              error: e.message
            };
          }
        }
      }
    }

    return {
      files,
      totalFiles: files.length,
      directories: files.filter(f => f.isDirectory).length,
      extractedContents,
      extractedCount: Object.keys(extractedContents).length
    };
  }

  /**
   * Lee archivo de texto plano
   */
  async readText(file) {
    let text;
    if (file.buffer) {
      text = file.buffer.toString('utf-8');
    } else if (file.path) {
      text = await fs.readFile(file.path, 'utf-8');
    } else if (file.content) {
      text = file.content;
    } else {
      throw new Error('Se requiere path, buffer o content para leer texto');
    }

    return {
      text,
      lines: text.split('\n').length,
      characters: text.length,
      words: text.split(/\s+/).filter(w => w).length
    };
  }

  /**
   * Lee archivo JSON
   */
  async readJson(file) {
    const text = await this.readText(file);
    try {
      const parsed = JSON.parse(text.text);
      return {
        data: parsed,
        text: text.text,
        isArray: Array.isArray(parsed),
        keys: Array.isArray(parsed) ? null : Object.keys(parsed)
      };
    } catch (e) {
      return {
        data: null,
        text: text.text,
        parseError: e.message
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MÉTODOS DE UTILIDAD
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Lee múltiples archivos
   */
  async readMultiple(files) {
    const results = [];
    for (const file of files) {
      const result = await this.read(file);
      results.push({
        file: typeof file === 'string' ? file : (file.path || file.name),
        ...result
      });
    }
    return {
      total: files.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * Extrae texto de cualquier archivo soportado
   */
  async extractText(fileOrPath) {
    const result = await this.read(fileOrPath);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    let text = '';
    const content = result.content;

    switch (result.type) {
      case 'PDF':
        text = content.text || '';
        break;
      case 'DOCX':
      case 'DOC':
        text = content.text || '';
        break;
      case 'XLSX':
      case 'XLS':
        // Concatenar texto de todas las hojas
        for (const sheetName of content.sheetNames) {
          text += `\n--- ${sheetName} ---\n`;
          text += content.sheets[sheetName].csv;
        }
        break;
      case 'CSV':
        text = content.text || '';
        break;
      case 'ZIP':
        // Concatenar texto de archivos extraídos
        for (const [fileName, fileContent] of Object.entries(content.extractedContents)) {
          if (fileContent.success && fileContent.content) {
            text += `\n--- ${fileName} ---\n`;
            const extracted = await this.extractText({
              content: fileContent.content,
              path: fileName
            });
            if (extracted.success) {
              text += extracted.text;
            }
          }
        }
        break;
      case 'TXT':
      case 'MD':
      case 'JSON':
        text = content.text || '';
        break;
      default:
        text = JSON.stringify(content, null, 2);
    }

    return {
      success: true,
      text: text.trim(),
      type: result.type,
      metadata: result.metadata
    };
  }

  /**
   * Obtiene información del archivo sin leer contenido completo
   */
  async getInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase();

      return {
        success: true,
        info: {
          name: path.basename(filePath),
          extension: ext,
          size: stats.size,
          sizeFormatted: this.formatBytes(stats.size),
          isSupported: this.isSupported(ext),
          created: stats.birthtime,
          modified: stats.mtime,
          isDirectory: stats.isDirectory()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Formatea bytes a unidad legible
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Detecta el tipo de archivo por su contenido (magic bytes)
   */
  async detectType(file) {
    let buffer;
    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      const handle = await fs.open(file.path, 'r');
      buffer = Buffer.alloc(8);
      await handle.read(buffer, 0, 8, 0);
      await handle.close();
    } else {
      return { detected: false };
    }

    // Magic bytes comunes
    const signatures = {
      PDF: [0x25, 0x50, 0x44, 0x46], // %PDF
      ZIP: [0x50, 0x4B, 0x03, 0x04], // PK..
      XLSX: [0x50, 0x4B, 0x03, 0x04], // También ZIP
      PNG: [0x89, 0x50, 0x4E, 0x47],
      JPEG: [0xFF, 0xD8, 0xFF]
    };

    for (const [type, sig] of Object.entries(signatures)) {
      if (sig.every((byte, i) => buffer[i] === byte)) {
        return { detected: true, type };
      }
    }

    return { detected: false };
  }
}

// ═══════════════════════════════════════════════════════════════════
// INSTANCIA EXPORTADA
// ═══════════════════════════════════════════════════════════════════

export const fileReader = new FileReader();

export default {
  FileReader,
  fileReader
};
