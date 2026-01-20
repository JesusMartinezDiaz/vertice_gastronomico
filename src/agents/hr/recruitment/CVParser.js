/**
 * SISTEMA DE LECTURA Y PARSING DE CVs
 * Vértice Gastronómico - Procesamiento Masivo de Currículums
 *
 * Incluye:
 * - Parser de CVs (PDF, DOC, TXT)
 * - Extracción inteligente de información
 * - Procesamiento masivo/batch
 * - Normalización de datos
 * - Detección de habilidades gastronómicas
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════

export const CV_PARSER_CONFIG = {
  supportedFormats: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  maxFileSizeMB: 10,
  maxBatchSize: 100,
  processingTimeout: 30000, // 30 segundos por CV
  minConfidenceScore: 0.6,
  language: 'es'
};

// ═══════════════════════════════════════════════════════════════════
// PATRONES DE EXTRACCIÓN
// ═══════════════════════════════════════════════════════════════════

export const EXTRACTION_PATTERNS = {
  // Información personal
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?52)?[\s.-]?(?:\(?\d{2,3}\)?[\s.-]?)?\d{4}[\s.-]?\d{4}/g,
  linkedIn: /linkedin\.com\/in\/[\w-]+/gi,

  // Educación
  education: {
    degrees: [
      'licenciatura', 'licenciado', 'ingeniero', 'ingeniería',
      'maestría', 'master', 'doctorado', 'phd',
      'técnico', 'diplomado', 'certificación', 'certificado',
      'bachillerato', 'preparatoria'
    ],
    institutions: [
      'universidad', 'instituto', 'escuela', 'colegio',
      'centro', 'academia'
    ]
  },

  // Fechas
  dates: {
    range: /(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[\s.,/]*)?(?:19|20)\d{2}\s*[-–a]\s*(?:(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[\s.,/]*)?(?:(?:19|20)\d{2}|actual|presente)/gi,
    year: /(?:19|20)\d{2}/g,
    monthYear: /(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[\s.,/]*(?:19|20)\d{2}/gi
  }
};

// ═══════════════════════════════════════════════════════════════════
// DICCIONARIO GASTRONÓMICO
// ═══════════════════════════════════════════════════════════════════

export const GASTRONOMY_DICTIONARY = {
  // Puestos/roles
  positions: {
    executive: [
      'chef ejecutivo', 'executive chef', 'director de cocina',
      'director culinario', 'culinary director'
    ],
    souschef: [
      'sous chef', 'subchef', 'segundo de cocina', 'jefe de cocina'
    ],
    lineCook: [
      'cocinero', 'cocinera', 'cook', 'line cook', 'cocinero de línea',
      'chef de partida', 'station chef'
    ],
    prep: [
      'ayudante de cocina', 'prep cook', 'auxiliar de cocina',
      'steward', 'lavaplatos'
    ],
    pastry: [
      'pastelero', 'repostero', 'pastry chef', 'panadero',
      'chocolatero', 'confitero'
    ],
    service: [
      'mesero', 'mesera', 'waiter', 'waitress', 'camarero',
      'garrotero', 'busboy', 'runner', 'food runner'
    ],
    captain: [
      'capitán de meseros', 'captain', 'head waiter',
      'maître', 'maitre d'
    ],
    host: [
      'hostess', 'host', 'recepcionista', 'anfitrión'
    ],
    bar: [
      'bartender', 'barman', 'barista', 'sommelier',
      'mixólogo', 'mixologist', 'cantinero'
    ],
    management: [
      'gerente', 'manager', 'administrador', 'director',
      'supervisor', 'encargado', 'coordinador'
    ]
  },

  // Habilidades técnicas
  skills: {
    culinary: [
      'mise en place', 'técnicas de cocción', 'cortes',
      'emplatado', 'plating', 'salsas madre',
      'cocina molecular', 'sous vide', 'ahumado',
      'fermentación', 'parrilla', 'horno',
      'fritura', 'salteado', 'braseado',
      'pochado', 'confitado', 'marinado'
    ],
    cuisines: [
      'cocina mexicana', 'cocina italiana', 'cocina francesa',
      'cocina japonesa', 'cocina asiática', 'cocina mediterránea',
      'cocina española', 'cocina fusión', 'cocina internacional',
      'cocina peruana', 'cocina americana', 'tex-mex',
      'mariscos', 'carnes', 'vegetariano', 'vegano'
    ],
    beverage: [
      'vinos', 'cócteles', 'cocktails', 'destilados',
      'cerveza artesanal', 'café', 'latte art',
      'maridaje', 'pairing', 'cata', 'sommelier'
    ],
    management: [
      'inventarios', 'costos', 'food cost', 'presupuesto',
      'nómina', 'compras', 'proveedores', 'negociación',
      'scheduling', 'turnos', 'personal'
    ],
    safety: [
      'HACCP', 'higiene', 'sanidad', 'inocuidad',
      'distintivo H', 'manejo de alimentos', 'BPM',
      'trazabilidad', 'temperaturas', 'almacenamiento'
    ],
    service: [
      'atención al cliente', 'servicio al cliente',
      'manejo de quejas', 'upselling', 'venta sugestiva',
      'POS', 'comandas', 'reservaciones', 'OpenTable'
    ],
    software: [
      'Excel', 'Word', 'POS', 'punto de venta',
      'ERP', 'SAP', 'inventario digital', 'Aloha',
      'Toast', 'Square', 'Lightspeed', 'Micros'
    ]
  },

  // Certificaciones
  certifications: [
    'distintivo H', 'HACCP', 'ServSafe', 'manipulación de alimentos',
    'sommelier certificado', 'WSET', 'barista certificado',
    'food handler', 'alcohol server', 'tips certification',
    'NOM', 'ISO 22000', 'curso de higiene'
  ],

  // Establecimientos
  establishments: [
    'restaurante', 'hotel', 'resort', 'catering',
    'bar', 'cafetería', 'comedor industrial', 'banquetes',
    'food truck', 'dark kitchen', 'ghost kitchen',
    'casino', 'crucero', 'club', 'cantina'
  ]
};

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL CV PARSER
// ═══════════════════════════════════════════════════════════════════

export class CVParser {
  constructor(config = {}) {
    this.config = { ...CV_PARSER_CONFIG, ...config };
    this.patterns = EXTRACTION_PATTERNS;
    this.dictionary = GASTRONOMY_DICTIONARY;
  }

  /**
   * Procesa un solo CV
   */
  async parseCV(content, metadata = {}) {
    const startTime = Date.now();

    try {
      // Normalizar contenido
      const normalizedContent = this.normalizeText(content);

      // Extraer información
      const personal = this.extractPersonalInfo(normalizedContent);
      const contact = this.extractContactInfo(normalizedContent);
      const experience = this.extractExperience(normalizedContent);
      const education = this.extractEducation(normalizedContent);
      const skills = this.extractSkills(normalizedContent);
      const certifications = this.extractCertifications(normalizedContent);
      const languages = this.extractLanguages(normalizedContent);
      const summary = this.extractSummary(normalizedContent);

      const extracted = {
        id: `CV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          ...metadata,
          processedAt: new Date().toISOString(),
          processingTime: 0
        },
        // Propiedades directas para facilitar tests
        name: personal.name,
        personal,
        contact,
        experience: experience.positions, // Array directo para tests
        experienceData: experience, // Datos completos
        education: education.all, // Array directo para tests
        educationData: education, // Datos completos
        skills: Object.values(skills.byCategory).flat(), // Array plano de skills
        skillsData: skills, // Datos completos
        certifications: certifications.certifications,
        certificationsData: certifications,
        languages: languages.languages,
        languagesData: languages,
        summary,
        raw: {
          wordCount: normalizedContent.split(/\s+/).length,
          characterCount: normalizedContent.length
        }
      };

      // Calcular scores
      extracted.scores = this.calculateScores({
        personal,
        contact,
        experience,
        education,
        skills,
        certifications
      });

      // Tiempo de procesamiento
      extracted.metadata.processingTime = Date.now() - startTime;

      return {
        success: true,
        data: extracted
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          ...metadata,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Procesa múltiples CVs en batch
   * @param {Array} cvList - Array de strings (contenido CV) o objetos {content, filename}
   */
  async parseBatch(cvList, options = {}) {
    const {
      parallel = true,
      maxConcurrent = 5,
      onProgress = null
    } = options;

    const results = {
      batchId: `BATCH-${Date.now()}`,
      startTime: new Date().toISOString(),
      total: cvList.length,
      processed: 0,
      successful: 0,
      failed: 0,
      results: [],
      summary: null
    };

    // Normalizar entradas: acepta strings o objetos {content, filename}
    const normalizedCvList = cvList.map((cv, idx) => {
      if (typeof cv === 'string') {
        return { content: cv, filename: `cv_${idx + 1}.txt` };
      }
      return cv;
    });

    if (parallel) {
      // Procesamiento paralelo con límite
      const chunks = this.chunkArray(normalizedCvList, maxConcurrent);

      for (const chunk of chunks) {
        const chunkResults = await Promise.all(
          chunk.map(async (cv, index) => {
            const result = await this.parseCV(cv.content, {
              filename: cv.filename,
              index: results.processed + index
            });
            return result;
          })
        );

        for (const result of chunkResults) {
          results.results.push(result);
          results.processed++;
          if (result.success) {
            results.successful++;
          } else {
            results.failed++;
          }
        }

        if (onProgress) {
          onProgress({
            processed: results.processed,
            total: results.total,
            percentage: Math.round((results.processed / results.total) * 100)
          });
        }
      }
    } else {
      // Procesamiento secuencial
      for (let i = 0; i < normalizedCvList.length; i++) {
        const cv = normalizedCvList[i];
        const result = await this.parseCV(cv.content, {
          filename: cv.filename,
          index: i
        });

        results.results.push(result);
        results.processed++;
        if (result.success) {
          results.successful++;
        } else {
          results.failed++;
        }

        if (onProgress) {
          onProgress({
            processed: results.processed,
            total: results.total,
            percentage: Math.round((results.processed / results.total) * 100)
          });
        }
      }
    }

    results.endTime = new Date().toISOString();
    results.summary = this.generateBatchSummary(results);

    return results;
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DE EXTRACCIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Normaliza el texto del CV
   */
  normalizeText(content) {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .trim();
  }

  /**
   * Extrae información personal
   * NOTA: Recibe contenido ya normalizado (espacios convertidos)
   */
  extractPersonalInfo(content) {
    // El contenido ya está normalizado (espacios colapsados)
    // Dividir por espacios de 2+ que representan separaciones originales
    // o buscar patrones de nombre directamente en el texto

    // Estrategia 1: Buscar patrones de nombre directamente con regex
    const namePatterns = [
      // TODO MAYÚSCULAS: CARLOS MENDOZA GARCÍA
      /^[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,}){1,4}/m,
      // Capitalizado: Carlos Mendoza García
      /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,4}/m
    ];

    let foundName = null;

    for (const pattern of namePatterns) {
      const match = content.match(pattern);
      if (match) {
        const candidate = match[0].trim();
        const words = candidate.split(/\s+/);

        // Validar: 2-5 palabras, sin números, sin caracteres especiales raros
        if (words.length >= 2 && words.length <= 5) {
          // Verificar que no sea una sección
          const lower = candidate.toLowerCase();
          const sectionKeywords = ['experiencia', 'educación', 'habilidades', 'certificaciones', 'idiomas', 'objetivo', 'resumen', 'laboral', 'profesional', 'chef ejecutivo', 'gerente'];
          if (!sectionKeywords.some(kw => lower.includes(kw))) {
            foundName = candidate;
            break;
          }
        }
      }
    }

    // Estrategia 2: Si no encontró, intentar con líneas implícitas
    if (!foundName) {
      // Dividir por posibles separadores de línea en texto normalizado
      const segments = content.split(/\s{2,}/).map(s => s.trim()).filter(s => s);

      for (const segment of segments.slice(0, 10)) {
        const words = segment.split(/\s+/);
        if (words.length >= 2 && words.length <= 5) {
          // Verificar patrón de nombre
          const isUpperName = /^[A-ZÁÉÍÓÚÑ]+(\s+[A-ZÁÉÍÓÚÑ]+)+$/.test(segment);
          const isMixedName = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+$/.test(segment);

          if (isUpperName || isMixedName) {
            const lower = segment.toLowerCase();
            const sectionKeywords = ['experiencia', 'educación', 'habilidades', 'chef', 'gerente', 'mesero'];
            if (!sectionKeywords.some(kw => lower.includes(kw))) {
              foundName = segment;
              break;
            }
          }
        }
      }
    }

    return {
      name: foundName,
      extractedFrom: 'pattern_match',
      confidence: foundName ? 0.8 : 0.3
    };
  }

  /**
   * Extrae información de contacto
   */
  extractContactInfo(content) {
    const emails = content.match(this.patterns.email) || [];
    const phones = content.match(this.patterns.phone) || [];
    const linkedIn = content.match(this.patterns.linkedIn) || [];

    return {
      email: emails[0] || null,
      phone: this.normalizePhone(phones[0]) || null,
      linkedIn: linkedIn[0] || null,
      additionalEmails: emails.slice(1),
      additionalPhones: phones.slice(1).map(p => this.normalizePhone(p))
    };
  }

  /**
   * Extrae experiencia laboral
   * NOTA: Funciona con contenido normalizado (espacios colapsados)
   */
  extractExperience(content) {
    const experiences = [];
    const lowerContent = content.toLowerCase();

    // Estrategia: Buscar directamente posiciones gastronómicas en el texto
    // ya que el contenido está normalizado y no tiene líneas separadas

    // Buscar todas las posiciones gastronómicas mencionadas
    for (const [category, positions] of Object.entries(this.dictionary.positions)) {
      for (const position of positions) {
        const posLower = position.toLowerCase();
        let searchStart = 0;

        while (true) {
          const posIndex = lowerContent.indexOf(posLower, searchStart);
          if (posIndex === -1) break;

          // Verificar que no sea parte de otra palabra
          const charBefore = posIndex > 0 ? lowerContent[posIndex - 1] : ' ';
          const charAfter = posIndex + posLower.length < lowerContent.length
            ? lowerContent[posIndex + posLower.length]
            : ' ';

          const isWordBoundary = /[\s,.-]/.test(charBefore) && /[\s,.-]/.test(charAfter);

          if (isWordBoundary || posIndex === 0) {
            // Extraer contexto alrededor de la posición
            const contextStart = Math.max(0, posIndex - 100);
            const contextEnd = Math.min(content.length, posIndex + posLower.length + 150);
            const context = content.substring(contextStart, contextEnd);

            // Buscar fechas en el contexto
            const dateMatch = context.match(this.patterns.dates.range);
            const yearMatch = context.match(/\(?(20\d{2}|19\d{2})\s*[-–a]\s*(20\d{2}|19\d{2}|actual|presente)\)?/i);

            // Buscar empresa/establecimiento en el contexto
            let company = null;
            for (const est of this.dictionary.establishments) {
              if (context.toLowerCase().includes(est)) {
                // Extraer nombre del establecimiento del contexto
                const estIndex = context.toLowerCase().indexOf(est);
                const beforeEst = context.substring(0, estIndex + est.length + 20);
                const words = beforeEst.split(/\s+/).slice(-5);
                company = words.join(' ').replace(/[()]/g, '').trim();
                break;
              }
            }

            // También buscar patrones como "en NOMBRE" después de la posición
            if (!company) {
              const afterPos = content.substring(posIndex + posLower.length, posIndex + posLower.length + 100);
              const enMatch = afterPos.match(/\s+en\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]{2,30})/i);
              if (enMatch) {
                company = enMatch[1].trim();
              }
            }

            // Crear entrada de experiencia
            const exp = {
              position: this.capitalizeFirst(position),
              category,
              company,
              dates: dateMatch ? this.parseDateRange(dateMatch[0]) :
                     yearMatch ? this.parseDateRange(yearMatch[0]) : null,
              duration: null,
              responsibilities: [],
              rawText: context.trim()
            };

            // Evitar duplicados por posición similar
            const isDuplicate = experiences.some(e =>
              e.position.toLowerCase() === exp.position.toLowerCase() &&
              e.company === exp.company
            );

            if (!isDuplicate) {
              experiences.push(exp);
            }
          }

          searchStart = posIndex + posLower.length;
        }
      }
    }

    // Calcular experiencia total
    const totalExperience = this.calculateTotalExperience(experiences);

    return {
      positions: experiences,
      totalYears: totalExperience.years,
      totalMonths: totalExperience.months,
      mostRecentPosition: experiences[0] || null,
      categories: [...new Set(experiences.map(e => e.category).filter(Boolean))]
    };
  }

  /**
   * Detecta posición gastronómica en texto
   */
  detectGastronomicPosition(text) {
    const lowerText = text.toLowerCase();

    for (const [category, positions] of Object.entries(this.dictionary.positions)) {
      for (const position of positions) {
        if (lowerText.includes(position.toLowerCase())) {
          return {
            position: this.capitalizeFirst(position),
            category,
            match: position
          };
        }
      }
    }

    return null;
  }

  /**
   * Detecta establecimiento gastronómico
   */
  detectEstablishment(text) {
    const lowerText = text.toLowerCase();

    for (const est of this.dictionary.establishments) {
      if (lowerText.includes(est)) {
        // Extraer nombre del establecimiento
        const words = text.split(/\s+/);
        const estIndex = words.findIndex(w => w.toLowerCase().includes(est));
        if (estIndex > 0) {
          return words.slice(0, estIndex + 1).join(' ');
        }
        return text.trim();
      }
    }

    return null;
  }

  /**
   * Extrae educación
   * NOTA: Funciona con contenido normalizado (espacios colapsados)
   */
  extractEducation(content) {
    const education = [];
    const lowerContent = content.toLowerCase();

    // Niveles educativos y sus palabras clave
    const degreeLevels = {
      'doctorado': 5, 'phd': 5,
      'maestría': 4, 'master': 4, 'mba': 4,
      'licenciatura': 3, 'licenciado': 3, 'ingeniero': 3, 'ingeniería': 3,
      'técnico': 2, 'diplomado': 2, 'certificado': 2, 'certificación': 2,
      'bachillerato': 1, 'preparatoria': 1
    };

    // Buscar directamente grados académicos en el texto normalizado
    for (const [degree, level] of Object.entries(degreeLevels)) {
      let searchStart = 0;

      while (true) {
        const degreeIndex = lowerContent.indexOf(degree, searchStart);
        if (degreeIndex === -1) break;

        // Verificar que no sea parte de otra palabra
        const charBefore = degreeIndex > 0 ? lowerContent[degreeIndex - 1] : ' ';
        const charAfter = degreeIndex + degree.length < lowerContent.length
          ? lowerContent[degreeIndex + degree.length]
          : ' ';

        const isWordBoundary = /[\s,.-]/.test(charBefore) && /[\s,.-:]/.test(charAfter);

        if (isWordBoundary || degreeIndex === 0) {
          // Extraer contexto alrededor del grado
          const contextStart = Math.max(0, degreeIndex - 50);
          const contextEnd = Math.min(content.length, degreeIndex + degree.length + 150);
          const context = content.substring(contextStart, contextEnd);

          // Buscar año en el contexto
          const yearMatch = context.match(/(19|20)\d{2}/);

          // Buscar institución en el contexto
          let institution = null;
          const institutionKeywords = ['universidad', 'instituto', 'escuela', 'colegio', 'academia', 'centro'];
          for (const instKw of institutionKeywords) {
            if (context.toLowerCase().includes(instKw)) {
              // Extraer nombre de institución
              const instMatch = context.match(new RegExp(`(${instKw}[^-]*?)(?:\\s*[-–]|$)`, 'i'));
              if (instMatch) {
                institution = instMatch[1].trim();
              }
              break;
            }
          }

          // Detectar campo de estudio (gastronómico)
          const field = context.toLowerCase().includes('gastronom') ? 'Gastronomía' :
                        context.toLowerCase().includes('culinar') ? 'Culinaria' :
                        context.toLowerCase().includes('hotel') ? 'Hotelería' : null;

          // Crear entrada educativa
          const edu = {
            degree: this.capitalizeFirst(degree),
            level,
            institution,
            year: yearMatch ? yearMatch[0] : null,
            field
          };

          // Evitar duplicados
          const isDuplicate = education.some(e =>
            e.degree.toLowerCase() === edu.degree.toLowerCase() &&
            e.institution === edu.institution
          );

          if (!isDuplicate) {
            education.push(edu);
          }
        }

        searchStart = degreeIndex + degree.length;
      }
    }

    // Detectar educación gastronómica específica
    const gastronomicEducation = education.filter(e =>
      e.degree?.toLowerCase().includes('gastronom') ||
      e.degree?.toLowerCase().includes('culinar') ||
      e.field?.toLowerCase().includes('gastronom')
    );

    return {
      all: education,
      gastronomicEducation,
      highestLevel: this.getHighestEducationLevel(education),
      hasGastronomicDegree: gastronomicEducation.length > 0
    };
  }

  /**
   * Detecta grado académico
   */
  detectDegree(text) {
    const lowerText = text.toLowerCase();
    const levels = {
      'doctorado': 5, 'phd': 5,
      'maestría': 4, 'master': 4,
      'licenciatura': 3, 'licenciado': 3, 'ingeniero': 3, 'ingeniería': 3,
      'técnico': 2, 'diplomado': 2, 'certificado': 2,
      'bachillerato': 1, 'preparatoria': 1
    };

    for (const [degree, level] of Object.entries(levels)) {
      if (lowerText.includes(degree)) {
        return {
          degree: this.capitalizeFirst(degree),
          level
        };
      }
    }

    return null;
  }

  /**
   * Detecta institución educativa
   */
  detectInstitution(text) {
    const lowerText = text.toLowerCase();
    const keywords = ['universidad', 'instituto', 'escuela', 'colegio', 'academia', 'centro'];

    for (const kw of keywords) {
      if (lowerText.includes(kw)) {
        return text.trim();
      }
    }

    return null;
  }

  /**
   * Extrae habilidades
   */
  extractSkills(content) {
    const lowerContent = content.toLowerCase();
    const foundSkills = {
      culinary: [],
      cuisines: [],
      beverage: [],
      management: [],
      safety: [],
      service: [],
      software: []
    };

    for (const [category, skills] of Object.entries(this.dictionary.skills)) {
      for (const skill of skills) {
        if (lowerContent.includes(skill.toLowerCase())) {
          foundSkills[category].push(skill);
        }
      }
    }

    // Calcular fortalezas principales
    const strengths = Object.entries(foundSkills)
      .filter(([_, skills]) => skills.length > 0)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([category, skills]) => ({
        category,
        count: skills.length,
        skills
      }));

    return {
      byCategory: foundSkills,
      total: Object.values(foundSkills).flat().length,
      strengths,
      hasManagementSkills: foundSkills.management.length >= 2,
      hasSafetySkills: foundSkills.safety.length >= 1,
      hasBeverageSkills: foundSkills.beverage.length >= 2
    };
  }

  /**
   * Extrae certificaciones
   */
  extractCertifications(content) {
    const lowerContent = content.toLowerCase();
    const found = [];

    for (const cert of this.dictionary.certifications) {
      if (lowerContent.includes(cert.toLowerCase())) {
        found.push({
          name: cert,
          found: true
        });
      }
    }

    return {
      certifications: found,
      count: found.length,
      hasHACCP: found.some(c => c.name.toLowerCase().includes('haccp')),
      hasFoodSafety: found.some(c =>
        c.name.toLowerCase().includes('higiene') ||
        c.name.toLowerCase().includes('manipulación') ||
        c.name.toLowerCase().includes('distintivo h')
      ),
      hasBeverageCert: found.some(c =>
        c.name.toLowerCase().includes('sommelier') ||
        c.name.toLowerCase().includes('barista') ||
        c.name.toLowerCase().includes('wset')
      )
    };
  }

  /**
   * Extrae idiomas
   */
  extractLanguages(content) {
    const lowerContent = content.toLowerCase();
    const languages = {
      español: { keywords: ['español', 'spanish', 'nativo', 'lengua materna'], level: null },
      inglés: { keywords: ['inglés', 'english', 'ingles'], level: null },
      francés: { keywords: ['francés', 'french', 'frances'], level: null },
      italiano: { keywords: ['italiano', 'italian'], level: null },
      portugués: { keywords: ['portugués', 'portuguese', 'portugues'], level: null },
      alemán: { keywords: ['alemán', 'german', 'aleman'], level: null },
      japonés: { keywords: ['japonés', 'japanese', 'japones'], level: null },
      chino: { keywords: ['chino', 'chinese', 'mandarín', 'mandarin'], level: null }
    };

    const levels = ['básico', 'intermedio', 'avanzado', 'fluido', 'nativo', 'bilingüe', 'basic', 'intermediate', 'advanced', 'fluent', 'native'];

    const found = [];

    for (const [lang, config] of Object.entries(languages)) {
      for (const kw of config.keywords) {
        if (lowerContent.includes(kw)) {
          // Buscar nivel cercano
          const langIndex = lowerContent.indexOf(kw);
          const context = lowerContent.substring(Math.max(0, langIndex - 50), langIndex + 50);

          let detectedLevel = 'no especificado';
          for (const level of levels) {
            if (context.includes(level)) {
              detectedLevel = level;
              break;
            }
          }

          found.push({
            language: lang,
            level: detectedLevel
          });
          break;
        }
      }
    }

    return {
      languages: found,
      count: found.length,
      hasEnglish: found.some(l => l.language === 'inglés'),
      englishLevel: found.find(l => l.language === 'inglés')?.level || null
    };
  }

  /**
   * Extrae resumen/objetivo
   */
  extractSummary(content) {
    const lines = content.split('\n');
    const summaryKeywords = ['objetivo', 'resumen', 'perfil', 'about', 'summary', 'profile'];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (summaryKeywords.some(kw => line.includes(kw))) {
        // Tomar siguientes líneas como resumen
        const summaryLines = [];
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !this.isNewSection(nextLine.toLowerCase())) {
            summaryLines.push(nextLine);
          } else {
            break;
          }
        }
        return summaryLines.join(' ').substring(0, 500);
      }
    }

    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS HELPER
  // ═══════════════════════════════════════════════════════════════

  isNewSection(line) {
    const sectionKeywords = [
      'experiencia', 'educación', 'habilidades', 'certificaciones',
      'idiomas', 'referencias', 'logros', 'formación',
      'experience', 'education', 'skills', 'languages', 'references'
    ];
    return sectionKeywords.some(kw => line.includes(kw));
  }

  normalizePhone(phone) {
    if (!phone) return null;
    return phone.replace(/[\s.-]/g, '').replace(/^\+?52/, '');
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  parseDateRange(dateStr) {
    const parts = dateStr.split(/[-–a]/);
    return {
      start: parts[0]?.trim() || null,
      end: parts[1]?.trim() || 'actual',
      raw: dateStr
    };
  }

  calculateTotalExperience(experiences) {
    let totalMonths = 0;

    for (const exp of experiences) {
      if (exp.dates) {
        // Estimación simple: asumir 12 meses si solo hay año
        const startYear = parseInt(exp.dates.start?.match(/\d{4}/)?.[0] || 0);
        const endYear = exp.dates.end === 'actual' || exp.dates.end === 'presente'
          ? new Date().getFullYear()
          : parseInt(exp.dates.end?.match(/\d{4}/)?.[0] || 0);

        if (startYear && endYear) {
          totalMonths += (endYear - startYear) * 12;
        }
      }
    }

    return {
      months: totalMonths,
      years: Math.round(totalMonths / 12 * 10) / 10
    };
  }

  getHighestEducationLevel(education) {
    if (education.length === 0) return null;

    const sorted = education
      .filter(e => e.level)
      .sort((a, b) => b.level - a.level);

    return sorted[0]?.degree || null;
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Calcula scores del CV
   */
  calculateScores(extracted) {
    const scores = {
      completeness: 0,
      relevance: 0,
      experience: 0,
      overall: 0
    };

    // Completitud (qué tan completo está el CV)
    let completenessPoints = 0;
    if (extracted.personal.name) completenessPoints += 15;
    if (extracted.contact.email) completenessPoints += 15;
    if (extracted.contact.phone) completenessPoints += 10;
    if (extracted.experience.positions.length > 0) completenessPoints += 20;
    if (extracted.education.all.length > 0) completenessPoints += 15;
    if (extracted.skills.total > 0) completenessPoints += 15;
    if (extracted.certifications.count > 0) completenessPoints += 10;
    scores.completeness = Math.min(completenessPoints, 100);

    // Relevancia gastronómica
    let relevancePoints = 0;
    if (extracted.experience.categories.length > 0) relevancePoints += 30;
    if (extracted.skills.byCategory.culinary.length > 0) relevancePoints += 20;
    if (extracted.skills.byCategory.cuisines.length > 0) relevancePoints += 15;
    if (extracted.certifications.hasFoodSafety) relevancePoints += 15;
    if (extracted.education.hasGastronomicDegree) relevancePoints += 20;
    scores.relevance = Math.min(relevancePoints, 100);

    // Experiencia
    const yearsExp = extracted.experience.totalYears;
    if (yearsExp >= 10) scores.experience = 100;
    else if (yearsExp >= 5) scores.experience = 80;
    else if (yearsExp >= 3) scores.experience = 60;
    else if (yearsExp >= 1) scores.experience = 40;
    else if (yearsExp > 0) scores.experience = 20;
    else scores.experience = 0;

    // Overall
    scores.overall = Math.round(
      (scores.completeness * 0.25) +
      (scores.relevance * 0.35) +
      (scores.experience * 0.40)
    );

    return scores;
  }

  /**
   * Genera resumen del batch
   */
  generateBatchSummary(results) {
    const successful = results.results.filter(r => r.success);

    if (successful.length === 0) {
      return { message: 'No se procesaron CVs exitosamente' };
    }

    const avgScores = {
      completeness: 0,
      relevance: 0,
      experience: 0,
      overall: 0
    };

    for (const result of successful) {
      avgScores.completeness += result.data.scores.completeness;
      avgScores.relevance += result.data.scores.relevance;
      avgScores.experience += result.data.scores.experience;
      avgScores.overall += result.data.scores.overall;
    }

    const count = successful.length;
    Object.keys(avgScores).forEach(key => {
      avgScores[key] = Math.round(avgScores[key] / count);
    });

    // Categorías más comunes
    const allCategories = successful.flatMap(r => r.data.experience?.categories || []);
    const categoryCount = {};
    allCategories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    return {
      successRate: Math.round((results.successful / results.total) * 100),
      averageScores: avgScores,
      topCategories: Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, count]) => ({ category: cat, count })),
      experienceDistribution: {
        entry: successful.filter(r => r.data.experience?.totalYears < 1).length,
        junior: successful.filter(r => r.data.experience?.totalYears >= 1 && r.data.experience?.totalYears < 3).length,
        mid: successful.filter(r => r.data.experience?.totalYears >= 3 && r.data.experience?.totalYears < 5).length,
        senior: successful.filter(r => r.data.experience?.totalYears >= 5).length
      }
    };
  }
}

// Instancia exportada
export const cvParser = new CVParser();

export default {
  CV_PARSER_CONFIG,
  EXTRACTION_PATTERNS,
  GASTRONOMY_DICTIONARY,
  CVParser,
  cvParser
};
