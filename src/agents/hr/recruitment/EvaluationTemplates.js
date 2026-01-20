/**
 * PLANTILLAS DE EVALUACIÓN PARA RECLUTAMIENTO
 * Vértice Gastronómico - Sistema de Evaluación Integral
 *
 * Incluye:
 * - Evaluación por Experiencia
 * - Evaluación por Competencias
 * - Matrices de Puntuación
 * - Rúbricas de Evaluación
 */

// ═══════════════════════════════════════════════════════════════════
// EVALUACIÓN POR EXPERIENCIA
// ═══════════════════════════════════════════════════════════════════

export const EXPERIENCE_EVALUATION = {
  // Niveles de experiencia
  levels: {
    TRAINEE: { id: 1, name: 'Practicante', years: '0', weight: 0.5 },
    JUNIOR: { id: 2, name: 'Junior', years: '0-1', weight: 0.7 },
    SEMI_SENIOR: { id: 3, name: 'Semi-Senior', years: '1-3', weight: 0.85 },
    SENIOR: { id: 4, name: 'Senior', years: '3-5', weight: 1.0 },
    EXPERT: { id: 5, name: 'Experto', years: '5-10', weight: 1.15 },
    MASTER: { id: 6, name: 'Maestro', years: '10+', weight: 1.3 }
  },

  // Plantillas por puesto
  templates: {
    // ─────────────────────────────────────────────────────────────────
    // COCINA
    // ─────────────────────────────────────────────────────────────────
    chef_ejecutivo: {
      id: 'EXP-CHEF-001',
      position: 'Chef Ejecutivo',
      department: 'Cocina',
      minimumYears: 5,
      preferredYears: 8,
      categories: [
        {
          name: 'Experiencia en Cocina Profesional',
          weight: 25,
          criteria: [
            { item: 'Años en cocinas profesionales', min: 5, ideal: 8, points: 10 },
            { item: 'Experiencia en restaurantes de alta categoría', min: 2, ideal: 4, points: 8 },
            { item: 'Manejo de cocinas con alto volumen', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Experiencia Gerencial',
          weight: 25,
          criteria: [
            { item: 'Años liderando equipos de cocina', min: 3, ideal: 5, points: 10 },
            { item: 'Tamaño del equipo más grande manejado', min: 5, ideal: 15, points: 8 },
            { item: 'Experiencia en apertura de restaurantes', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Experiencia Especializada',
          weight: 20,
          criteria: [
            { item: 'Especialización culinaria (mexicana, internacional, etc.)', min: 1, ideal: 2, points: 10 },
            { item: 'Desarrollo de menús propios', min: 2, ideal: 5, points: 8 },
            { item: 'Participación en eventos/catering', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Gestión Administrativa',
          weight: 15,
          criteria: [
            { item: 'Manejo de presupuestos de cocina', min: 2, ideal: 4, points: 10 },
            { item: 'Control de food cost', min: 2, ideal: 4, points: 8 },
            { item: 'Negociación con proveedores', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Formación y Certificaciones',
          weight: 15,
          criteria: [
            { item: 'Título en Gastronomía', min: 1, ideal: 1, points: 10 },
            { item: 'Certificaciones adicionales (HACCP, ServSafe)', min: 1, ideal: 3, points: 8 },
            { item: 'Cursos de actualización (últimos 2 años)', min: 1, ideal: 3, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 90, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 75, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 60, label: 'Candidato con potencial', action: 'Evaluar según otras competencias' },
        insufficient: { min: 0, label: 'Experiencia insuficiente', action: 'No continuar proceso' }
      }
    },

    sous_chef: {
      id: 'EXP-SOUS-001',
      position: 'Sous Chef',
      department: 'Cocina',
      minimumYears: 3,
      preferredYears: 5,
      categories: [
        {
          name: 'Experiencia en Cocina',
          weight: 30,
          criteria: [
            { item: 'Años como cocinero profesional', min: 3, ideal: 5, points: 10 },
            { item: 'Experiencia como chef de partida', min: 1, ideal: 2, points: 8 },
            { item: 'Variedad de cocinas dominadas', min: 2, ideal: 4, points: 7 }
          ]
        },
        {
          name: 'Liderazgo de Equipo',
          weight: 25,
          criteria: [
            { item: 'Experiencia supervisando personal', min: 1, ideal: 3, points: 10 },
            { item: 'Capacitación de personal nuevo', min: 1, ideal: 2, points: 8 },
            { item: 'Resolución de conflictos en cocina', min: 1, ideal: 2, points: 7 }
          ]
        },
        {
          name: 'Habilidades Técnicas',
          weight: 25,
          criteria: [
            { item: 'Dominio de técnicas culinarias avanzadas', min: 2, ideal: 4, points: 10 },
            { item: 'Conocimiento de estándares de calidad', min: 2, ideal: 3, points: 8 },
            { item: 'Manejo de inventarios', min: 1, ideal: 2, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 20,
          criteria: [
            { item: 'Formación gastronómica formal', min: 1, ideal: 1, points: 10 },
            { item: 'Certificaciones de seguridad alimentaria', min: 1, ideal: 2, points: 8 },
            { item: 'Idiomas (inglés útil)', min: 0, ideal: 1, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 85, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 70, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 55, label: 'Candidato con potencial', action: 'Evaluar según otras competencias' },
        insufficient: { min: 0, label: 'Experiencia insuficiente', action: 'No continuar proceso' }
      }
    },

    cocinero: {
      id: 'EXP-COOK-001',
      position: 'Cocinero',
      department: 'Cocina',
      minimumYears: 1,
      preferredYears: 3,
      categories: [
        {
          name: 'Experiencia en Cocina',
          weight: 40,
          criteria: [
            { item: 'Meses/años en cocina profesional', min: 6, ideal: 24, points: 10 },
            { item: 'Tipo de establecimientos', min: 1, ideal: 2, points: 8 },
            { item: 'Volumen de servicio manejado', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Habilidades Técnicas',
          weight: 35,
          criteria: [
            { item: 'Técnicas básicas dominadas', min: 3, ideal: 6, points: 10 },
            { item: 'Conocimiento de mise en place', min: 1, ideal: 1, points: 8 },
            { item: 'Manejo de equipos de cocina', min: 2, ideal: 5, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 25,
          criteria: [
            { item: 'Estudios gastronómicos', min: 0, ideal: 1, points: 10 },
            { item: 'Certificación en higiene', min: 0, ideal: 1, points: 8 },
            { item: 'Cursos complementarios', min: 0, ideal: 2, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 80, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 65, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 50, label: 'Candidato con potencial', action: 'Considerar para capacitación' },
        insufficient: { min: 0, label: 'Experiencia insuficiente', action: 'No continuar proceso' }
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // SERVICIO
    // ─────────────────────────────────────────────────────────────────
    gerente_restaurante: {
      id: 'EXP-MGR-001',
      position: 'Gerente de Restaurante',
      department: 'Operaciones',
      minimumYears: 5,
      preferredYears: 8,
      categories: [
        {
          name: 'Experiencia Gerencial',
          weight: 30,
          criteria: [
            { item: 'Años como gerente de restaurante', min: 3, ideal: 5, points: 10 },
            { item: 'Tamaño de operación manejada (ventas mensuales)', min: 500000, ideal: 2000000, points: 8 },
            { item: 'Número de empleados supervisados', min: 15, ideal: 40, points: 7 }
          ]
        },
        {
          name: 'Experiencia Financiera',
          weight: 25,
          criteria: [
            { item: 'Manejo de P&L', min: 2, ideal: 4, points: 10 },
            { item: 'Control de costos operativos', min: 2, ideal: 4, points: 8 },
            { item: 'Elaboración de presupuestos', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Experiencia Operativa',
          weight: 25,
          criteria: [
            { item: 'Apertura de nuevas unidades', min: 0, ideal: 2, points: 10 },
            { item: 'Implementación de sistemas/procesos', min: 1, ideal: 3, points: 8 },
            { item: 'Manejo de crisis operativas', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 20,
          criteria: [
            { item: 'Licenciatura (Administración, Turismo, etc.)', min: 1, ideal: 1, points: 10 },
            { item: 'Posgrado o especialización', min: 0, ideal: 1, points: 8 },
            { item: 'Certificaciones de industria', min: 0, ideal: 2, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 90, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 75, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 60, label: 'Candidato con potencial', action: 'Evaluar según otras competencias' },
        insufficient: { min: 0, label: 'Experiencia insuficiente', action: 'No continuar proceso' }
      }
    },

    capitan_meseros: {
      id: 'EXP-CAP-001',
      position: 'Capitán de Meseros',
      department: 'Servicio',
      minimumYears: 3,
      preferredYears: 5,
      categories: [
        {
          name: 'Experiencia en Servicio',
          weight: 35,
          criteria: [
            { item: 'Años como mesero profesional', min: 3, ideal: 5, points: 10 },
            { item: 'Experiencia en restaurantes de categoría', min: 1, ideal: 3, points: 8 },
            { item: 'Manejo de eventos especiales', min: 1, ideal: 5, points: 7 }
          ]
        },
        {
          name: 'Experiencia de Supervisión',
          weight: 30,
          criteria: [
            { item: 'Años supervisando meseros', min: 1, ideal: 2, points: 10 },
            { item: 'Tamaño de equipo supervisado', min: 4, ideal: 10, points: 8 },
            { item: 'Capacitación de personal nuevo', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Conocimientos Especializados',
          weight: 20,
          criteria: [
            { item: 'Conocimiento de vinos y maridaje', min: 1, ideal: 2, points: 10 },
            { item: 'Manejo de POS/sistemas', min: 1, ideal: 2, points: 8 },
            { item: 'Técnicas de servicio avanzado', min: 1, ideal: 2, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 15,
          criteria: [
            { item: 'Cursos de servicio profesional', min: 0, ideal: 2, points: 10 },
            { item: 'Certificación en vinos/bar', min: 0, ideal: 1, points: 8 },
            { item: 'Idiomas (inglés)', min: 0, ideal: 1, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 85, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 70, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 55, label: 'Candidato con potencial', action: 'Evaluar según otras competencias' },
        insufficient: { min: 0, label: 'Experiencia insuficiente', action: 'No continuar proceso' }
      }
    },

    mesero: {
      id: 'EXP-SRV-001',
      position: 'Mesero',
      department: 'Servicio',
      minimumYears: 0.5,
      preferredYears: 2,
      categories: [
        {
          name: 'Experiencia en Servicio',
          weight: 45,
          criteria: [
            { item: 'Meses en restaurantes/bares', min: 6, ideal: 24, points: 10 },
            { item: 'Tipos de establecimientos', min: 1, ideal: 2, points: 8 },
            { item: 'Volumen de mesas atendidas por turno', min: 4, ideal: 10, points: 7 }
          ]
        },
        {
          name: 'Habilidades de Servicio',
          weight: 35,
          criteria: [
            { item: 'Manejo de POS/comandas', min: 0, ideal: 1, points: 10 },
            { item: 'Técnicas de venta sugestiva', min: 0, ideal: 1, points: 8 },
            { item: 'Resolución de quejas', min: 0, ideal: 1, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 20,
          criteria: [
            { item: 'Preparatoria completa', min: 1, ideal: 1, points: 10 },
            { item: 'Cursos de servicio', min: 0, ideal: 1, points: 8 },
            { item: 'Idiomas', min: 0, ideal: 1, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 80, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 60, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 40, label: 'Candidato con potencial', action: 'Considerar para capacitación' },
        insufficient: { min: 0, label: 'Sin experiencia mínima', action: 'No continuar proceso' }
      }
    },

    hostess: {
      id: 'EXP-HOST-001',
      position: 'Host/Hostess',
      department: 'Servicio',
      minimumYears: 0,
      preferredYears: 1,
      categories: [
        {
          name: 'Experiencia',
          weight: 40,
          criteria: [
            { item: 'Meses en atención al cliente', min: 0, ideal: 12, points: 10 },
            { item: 'Experiencia en restaurantes', min: 0, ideal: 6, points: 8 },
            { item: 'Manejo de reservaciones', min: 0, ideal: 1, points: 7 }
          ]
        },
        {
          name: 'Habilidades',
          weight: 40,
          criteria: [
            { item: 'Comunicación verbal', min: 1, ideal: 1, points: 10 },
            { item: 'Presencia y presentación personal', min: 1, ideal: 1, points: 8 },
            { item: 'Manejo de conflictos', min: 0, ideal: 1, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 20,
          criteria: [
            { item: 'Preparatoria completa', min: 1, ideal: 1, points: 10 },
            { item: 'Idiomas (inglés)', min: 0, ideal: 1, points: 8 },
            { item: 'Cursos de atención', min: 0, ideal: 1, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 80, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 60, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 40, label: 'Candidato con potencial', action: 'Considerar para capacitación' },
        insufficient: { min: 0, label: 'No cumple requisitos', action: 'No continuar proceso' }
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // BAR
    // ─────────────────────────────────────────────────────────────────
    bartender: {
      id: 'EXP-BAR-001',
      position: 'Bartender',
      department: 'Bar',
      minimumYears: 1,
      preferredYears: 3,
      categories: [
        {
          name: 'Experiencia en Bar',
          weight: 40,
          criteria: [
            { item: 'Años como bartender', min: 1, ideal: 3, points: 10 },
            { item: 'Tipos de establecimientos', min: 1, ideal: 3, points: 8 },
            { item: 'Volumen de servicio', min: 1, ideal: 3, points: 7 }
          ]
        },
        {
          name: 'Conocimientos Técnicos',
          weight: 35,
          criteria: [
            { item: 'Recetas clásicas dominadas', min: 20, ideal: 50, points: 10 },
            { item: 'Conocimiento de destilados', min: 1, ideal: 2, points: 8 },
            { item: 'Creación de cócteles propios', min: 0, ideal: 5, points: 7 }
          ]
        },
        {
          name: 'Formación',
          weight: 25,
          criteria: [
            { item: 'Certificación de bartender', min: 0, ideal: 1, points: 10 },
            { item: 'Cursos de mixología', min: 0, ideal: 2, points: 8 },
            { item: 'Competencias ganadas', min: 0, ideal: 1, points: 7 }
          ]
        }
      ],
      scoringGuide: {
        excellent: { min: 85, label: 'Candidato excepcional', action: 'Priorizar contratación' },
        good: { min: 70, label: 'Candidato calificado', action: 'Avanzar a siguiente fase' },
        acceptable: { min: 50, label: 'Candidato con potencial', action: 'Evaluar en prueba práctica' },
        insufficient: { min: 0, label: 'Experiencia insuficiente', action: 'No continuar proceso' }
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// EVALUACIÓN POR COMPETENCIAS
// ═══════════════════════════════════════════════════════════════════

export const COMPETENCY_EVALUATION = {
  // Definición de competencias
  competencies: {
    // ─────────────────────────────────────────────────────────────────
    // COMPETENCIAS TÉCNICAS
    // ─────────────────────────────────────────────────────────────────
    technical: {
      culinary_skills: {
        id: 'CT-001',
        name: 'Habilidades Culinarias',
        description: 'Dominio de técnicas y preparaciones gastronómicas',
        levels: {
          1: { name: 'Básico', description: 'Conoce técnicas fundamentales', indicators: ['Cortes básicos', 'Cocciones simples', 'Seguir recetas'] },
          2: { name: 'Intermedio', description: 'Ejecuta técnicas con supervisión mínima', indicators: ['Cortes avanzados', 'Múltiples cocciones', 'Adaptar recetas'] },
          3: { name: 'Avanzado', description: 'Domina técnicas complejas', indicators: ['Técnicas avanzadas', 'Creación de recetas', 'Menús completos'] },
          4: { name: 'Experto', description: 'Referente técnico', indicators: ['Innovación culinaria', 'Enseña a otros', 'Reconocimiento externo'] },
          5: { name: 'Maestro', description: 'Autoridad en el área', indicators: ['Creación de tendencias', 'Publicaciones', 'Premios/reconocimientos'] }
        },
        questions: [
          '¿Qué técnicas de cocción dominas y cuál consideras tu especialidad?',
          'Describe el proceso para preparar un fondo oscuro de res.',
          '¿Cómo manejas el punto de cocción de diferentes proteínas?',
          'Explica tu proceso de desarrollo de una nueva receta.'
        ]
      },

      service_excellence: {
        id: 'CT-002',
        name: 'Excelencia en Servicio',
        description: 'Capacidad para brindar servicio de alta calidad',
        levels: {
          1: { name: 'Básico', description: 'Servicio funcional', indicators: ['Toma órdenes', 'Sirve alimentos', 'Cortesía básica'] },
          2: { name: 'Intermedio', description: 'Servicio profesional', indicators: ['Anticipa necesidades', 'Manejo de quejas', 'Upselling básico'] },
          3: { name: 'Avanzado', description: 'Servicio excepcional', indicators: ['Experiencias memorables', 'Fidelización', 'Resolución creativa'] },
          4: { name: 'Experto', description: 'Referente de servicio', indicators: ['Capacita a otros', 'Estándares de marca', 'Clientes VIP'] },
          5: { name: 'Maestro', description: 'Autoridad en servicio', indicators: ['Diseño de experiencias', 'Consultoría', 'Reconocimiento industria'] }
        },
        questions: [
          '¿Cómo manejas a un cliente extremadamente difícil?',
          'Describe una situación donde superaste las expectativas de un cliente.',
          '¿Cuáles son tus técnicas de venta sugestiva?',
          '¿Cómo personalizas el servicio según el tipo de cliente?'
        ]
      },

      food_safety: {
        id: 'CT-003',
        name: 'Seguridad Alimentaria',
        description: 'Conocimiento y aplicación de normas de higiene y seguridad',
        levels: {
          1: { name: 'Básico', description: 'Conoce reglas básicas', indicators: ['Lavado de manos', 'Temperaturas básicas', 'Limpieza área'] },
          2: { name: 'Intermedio', description: 'Aplica consistentemente', indicators: ['PEPS', 'Control temperaturas', 'Prevención contaminación'] },
          3: { name: 'Avanzado', description: 'Supervisa cumplimiento', indicators: ['Auditorías internas', 'Capacitación', 'Documentación'] },
          4: { name: 'Experto', description: 'Diseña sistemas', indicators: ['Plan HACCP', 'Certificaciones', 'Mejora continua'] },
          5: { name: 'Maestro', description: 'Autoridad reconocida', indicators: ['Consultoría externa', 'Certificador', 'Publicaciones'] }
        },
        questions: [
          '¿Cuáles son las temperaturas críticas para almacenamiento de alimentos?',
          'Explica el sistema PEPS y su importancia.',
          '¿Cómo previenes la contaminación cruzada?',
          '¿Qué harías si detectas un posible brote de ETA?'
        ]
      },

      cost_control: {
        id: 'CT-004',
        name: 'Control de Costos',
        description: 'Capacidad para gestionar eficientemente los recursos',
        levels: {
          1: { name: 'Básico', description: 'Entiende conceptos', indicators: ['Registra consumos', 'Evita desperdicio', 'Porciones estándar'] },
          2: { name: 'Intermedio', description: 'Controla su área', indicators: ['Food cost básico', 'Inventarios', 'Reportes'] },
          3: { name: 'Avanzado', description: 'Optimiza costos', indicators: ['Análisis variaciones', 'Acciones correctivas', 'Negociación'] },
          4: { name: 'Experto', description: 'Gestiona P&L', indicators: ['Presupuestos', 'Proyecciones', 'Estrategias costo'] },
          5: { name: 'Maestro', description: 'Autoridad en costos', indicators: ['Benchmarking', 'Consultoría', 'Innovación procesos'] }
        },
        questions: [
          '¿Cómo calculas el food cost de un platillo?',
          '¿Qué estrategias usas para reducir mermas?',
          'Describe tu proceso de toma de inventarios.',
          '¿Cómo manejas variaciones significativas en costos?'
        ]
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // COMPETENCIAS DE LIDERAZGO
    // ─────────────────────────────────────────────────────────────────
    leadership: {
      team_leadership: {
        id: 'CL-001',
        name: 'Liderazgo de Equipos',
        description: 'Capacidad para dirigir, motivar y desarrollar equipos',
        levels: {
          1: { name: 'Básico', description: 'Coordina tareas', indicators: ['Asigna trabajo', 'Supervisa básico', 'Reporta problemas'] },
          2: { name: 'Intermedio', description: 'Lidera pequeños equipos', indicators: ['Motiva equipo', 'Resuelve conflictos', 'Da retroalimentación'] },
          3: { name: 'Avanzado', description: 'Lidera equipos medianos', indicators: ['Desarrolla talento', 'Cultura positiva', 'Logra resultados'] },
          4: { name: 'Experto', description: 'Lidera múltiples equipos', indicators: ['Liderazgo estratégico', 'Cambio cultural', 'Sucesión'] },
          5: { name: 'Maestro', description: 'Líder transformacional', indicators: ['Visión inspiradora', 'Legado', 'Mentoring ejecutivo'] }
        },
        questions: [
          '¿Cómo motivas a un equipo desmotivado?',
          'Describe tu estilo de liderazgo con un ejemplo.',
          '¿Cómo manejas a un empleado con bajo desempeño?',
          '¿Qué haces para desarrollar el potencial de tu equipo?'
        ]
      },

      decision_making: {
        id: 'CL-002',
        name: 'Toma de Decisiones',
        description: 'Capacidad para tomar decisiones efectivas bajo presión',
        levels: {
          1: { name: 'Básico', description: 'Decide en situaciones claras', indicators: ['Sigue procedimientos', 'Escala cuando necesita', 'Decisiones simples'] },
          2: { name: 'Intermedio', description: 'Decide con información parcial', indicators: ['Analiza opciones', 'Considera consecuencias', 'Decisiones operativas'] },
          3: { name: 'Avanzado', description: 'Decide bajo presión', indicators: ['Prioriza efectivamente', 'Manejo de crisis', 'Decisiones tácticas'] },
          4: { name: 'Experto', description: 'Decide estratégicamente', indicators: ['Visión largo plazo', 'Gestión de riesgos', 'Decisiones complejas'] },
          5: { name: 'Maestro', description: 'Decisiones transformacionales', indicators: ['Innovación estratégica', 'Impacto organizacional', 'Visión industria'] }
        },
        questions: [
          'Describe una decisión difícil que tomaste y su resultado.',
          '¿Cómo priorizas cuando todo parece urgente?',
          '¿Qué información necesitas para tomar una buena decisión?',
          'Cuéntame de una decisión que salió mal y qué aprendiste.'
        ]
      },

      conflict_resolution: {
        id: 'CL-003',
        name: 'Resolución de Conflictos',
        description: 'Capacidad para manejar y resolver conflictos efectivamente',
        levels: {
          1: { name: 'Básico', description: 'Evita escalar conflictos', indicators: ['Mantiene calma', 'Reporta a supervisor', 'No agrava situaciones'] },
          2: { name: 'Intermedio', description: 'Resuelve conflictos simples', indicators: ['Escucha activa', 'Busca soluciones', 'Media entre partes'] },
          3: { name: 'Avanzado', description: 'Resuelve conflictos complejos', indicators: ['Identifica raíces', 'Negocia efectivamente', 'Previene recurrencia'] },
          4: { name: 'Experto', description: 'Transforma conflictos', indicators: ['Convierte en oportunidades', 'Diseña sistemas', 'Cultura constructiva'] },
          5: { name: 'Maestro', description: 'Mediador referente', indicators: ['Conflictos organizacionales', 'Consultoría', 'Formación de mediadores'] }
        },
        questions: [
          '¿Cómo manejas un conflicto entre dos miembros de tu equipo?',
          'Describe el peor conflicto laboral que has manejado.',
          '¿Qué técnicas usas para calmar situaciones tensas?',
          '¿Cómo previenes que los conflictos escalen?'
        ]
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // COMPETENCIAS PERSONALES
    // ─────────────────────────────────────────────────────────────────
    personal: {
      stress_management: {
        id: 'CP-001',
        name: 'Manejo del Estrés',
        description: 'Capacidad para trabajar efectivamente bajo presión',
        levels: {
          1: { name: 'Básico', description: 'Funciona bajo estrés normal', indicators: ['Completa tareas', 'Pide ayuda', 'Se recupera'] },
          2: { name: 'Intermedio', description: 'Mantiene rendimiento', indicators: ['Organiza prioridades', 'Técnicas de manejo', 'Apoya a otros'] },
          3: { name: 'Avanzado', description: 'Prospera bajo presión', indicators: ['Mejor bajo presión', 'Lidera en crisis', 'Equilibrio trabajo-vida'] },
          4: { name: 'Experto', description: 'Maneja estrés organizacional', indicators: ['Previene burnout equipo', 'Diseña ambiente sano', 'Resiliencia organizacional'] },
          5: { name: 'Maestro', description: 'Referente en bienestar', indicators: ['Programas bienestar', 'Cultura de cuidado', 'Consultoría'] }
        },
        questions: [
          '¿Cómo manejas un servicio con 200% de capacidad?',
          'Describe tu peor día de trabajo y cómo lo superaste.',
          '¿Qué técnicas usas para manejar el estrés?',
          '¿Cómo ayudas a tu equipo en momentos de alta presión?'
        ]
      },

      adaptability: {
        id: 'CP-002',
        name: 'Adaptabilidad',
        description: 'Capacidad para ajustarse a cambios y nuevas situaciones',
        levels: {
          1: { name: 'Básico', description: 'Acepta cambios necesarios', indicators: ['Sigue nuevas instrucciones', 'No resiste cambios', 'Aprende lo requerido'] },
          2: { name: 'Intermedio', description: 'Se adapta proactivamente', indicators: ['Anticipa cambios', 'Aprende rápido', 'Flexible en roles'] },
          3: { name: 'Avanzado', description: 'Lidera cambios', indicators: ['Impulsa mejoras', 'Ayuda a otros a adaptarse', 'Innovación constante'] },
          4: { name: 'Experto', description: 'Gestiona cambio organizacional', indicators: ['Diseña transformaciones', 'Cultura de cambio', 'Gestión de resistencia'] },
          5: { name: 'Maestro', description: 'Agente de transformación', indicators: ['Visión de futuro', 'Transforma organizaciones', 'Consultoría en cambio'] }
        },
        questions: [
          '¿Cómo reaccionas ante cambios inesperados en tu trabajo?',
          'Describe una situación donde tuviste que aprender algo nuevo rápidamente.',
          '¿Cómo ayudas a otros a adaptarse a cambios?',
          'Cuéntame de un cambio difícil que lideraste.'
        ]
      },

      communication: {
        id: 'CP-003',
        name: 'Comunicación',
        description: 'Capacidad para comunicarse efectivamente',
        levels: {
          1: { name: 'Básico', description: 'Comunica información básica', indicators: ['Instrucciones claras', 'Reporta problemas', 'Escucha'] },
          2: { name: 'Intermedio', description: 'Comunica efectivamente', indicators: ['Adapta mensaje', 'Retroalimentación', 'Comunicación escrita'] },
          3: { name: 'Avanzado', description: 'Comunica complejidad', indicators: ['Presenta ideas', 'Influencia', 'Maneja audiencias difíciles'] },
          4: { name: 'Experto', description: 'Comunicación estratégica', indicators: ['Comunicación organizacional', 'Manejo de medios', 'Discursos'] },
          5: { name: 'Maestro', description: 'Comunicador inspirador', indicators: ['Oratoria profesional', 'Publicaciones', 'Portavoz de industria'] }
        },
        questions: [
          '¿Cómo comunicas malas noticias a tu equipo?',
          'Describe cómo adaptas tu comunicación según la audiencia.',
          '¿Cómo manejas malentendidos?',
          '¿Cuál ha sido tu presentación más desafiante?'
        ]
      },

      teamwork: {
        id: 'CP-004',
        name: 'Trabajo en Equipo',
        description: 'Capacidad para colaborar efectivamente con otros',
        levels: {
          1: { name: 'Básico', description: 'Trabaja con otros', indicators: ['Cumple su parte', 'Respeta a compañeros', 'Sigue instrucciones'] },
          2: { name: 'Intermedio', description: 'Colabora activamente', indicators: ['Apoya a otros', 'Comparte conocimiento', 'Comunicación efectiva'] },
          3: { name: 'Avanzado', description: 'Impulsa al equipo', indicators: ['Eleva rendimiento grupal', 'Resuelve conflictos', 'Integra nuevos miembros'] },
          4: { name: 'Experto', description: 'Construye equipos de alto rendimiento', indicators: ['Selecciona talento', 'Desarrolla dinámicas', 'Resultados excepcionales'] },
          5: { name: 'Maestro', description: 'Referente en equipos', indicators: ['Cultura de colaboración', 'Equipos autodirigidos', 'Consultoría en equipos'] }
        },
        questions: [
          '¿Cómo contribuyes al éxito de tu equipo?',
          'Describe tu mejor experiencia de trabajo en equipo.',
          '¿Cómo manejas a un compañero que no colabora?',
          '¿Qué rol sueles tomar en los equipos?'
        ]
      }
    }
  },

  // Plantillas de evaluación por puesto
  positionProfiles: {
    chef_ejecutivo: {
      required: [
        { competency: 'culinary_skills', minLevel: 4 },
        { competency: 'team_leadership', minLevel: 4 },
        { competency: 'cost_control', minLevel: 3 },
        { competency: 'food_safety', minLevel: 3 },
        { competency: 'decision_making', minLevel: 3 },
        { competency: 'stress_management', minLevel: 3 }
      ],
      preferred: [
        { competency: 'communication', minLevel: 3 },
        { competency: 'adaptability', minLevel: 3 }
      ]
    },
    sous_chef: {
      required: [
        { competency: 'culinary_skills', minLevel: 3 },
        { competency: 'team_leadership', minLevel: 2 },
        { competency: 'food_safety', minLevel: 3 },
        { competency: 'stress_management', minLevel: 3 }
      ],
      preferred: [
        { competency: 'cost_control', minLevel: 2 },
        { competency: 'communication', minLevel: 2 }
      ]
    },
    cocinero: {
      required: [
        { competency: 'culinary_skills', minLevel: 2 },
        { competency: 'food_safety', minLevel: 2 },
        { competency: 'teamwork', minLevel: 2 },
        { competency: 'stress_management', minLevel: 2 }
      ],
      preferred: [
        { competency: 'adaptability', minLevel: 2 }
      ]
    },
    gerente_restaurante: {
      required: [
        { competency: 'team_leadership', minLevel: 4 },
        { competency: 'cost_control', minLevel: 4 },
        { competency: 'decision_making', minLevel: 4 },
        { competency: 'service_excellence', minLevel: 3 },
        { competency: 'conflict_resolution', minLevel: 3 }
      ],
      preferred: [
        { competency: 'communication', minLevel: 4 },
        { competency: 'adaptability', minLevel: 3 }
      ]
    },
    capitan_meseros: {
      required: [
        { competency: 'service_excellence', minLevel: 3 },
        { competency: 'team_leadership', minLevel: 2 },
        { competency: 'communication', minLevel: 3 },
        { competency: 'stress_management', minLevel: 3 }
      ],
      preferred: [
        { competency: 'conflict_resolution', minLevel: 2 }
      ]
    },
    mesero: {
      required: [
        { competency: 'service_excellence', minLevel: 2 },
        { competency: 'communication', minLevel: 2 },
        { competency: 'teamwork', minLevel: 2 },
        { competency: 'stress_management', minLevel: 2 }
      ],
      preferred: [
        { competency: 'adaptability', minLevel: 2 }
      ]
    },
    bartender: {
      required: [
        { competency: 'service_excellence', minLevel: 2 },
        { competency: 'stress_management', minLevel: 3 },
        { competency: 'communication', minLevel: 2 }
      ],
      preferred: [
        { competency: 'adaptability', minLevel: 2 },
        { competency: 'teamwork', minLevel: 2 }
      ]
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// CLASE EVALUADOR
// ═══════════════════════════════════════════════════════════════════

export class CandidateEvaluator {
  constructor() {
    this.experienceTemplates = EXPERIENCE_EVALUATION.templates;
    this.competencyFramework = COMPETENCY_EVALUATION;
  }

  /**
   * Evalúa un candidato por experiencia
   */
  evaluateExperience(candidateData, position) {
    const template = this.experienceTemplates[position];
    if (!template) {
      return { error: `No existe plantilla para: ${position}` };
    }

    const evaluation = {
      evaluationId: `EXP-${Date.now()}`,
      candidateName: candidateData.name,
      position: template.position,
      template: template.id,
      date: new Date().toISOString(),
      categories: [],
      totalScore: 0,
      maxScore: 0,
      recommendation: null
    };

    // Evaluar cada categoría
    for (const category of template.categories) {
      const categoryResult = {
        name: category.name,
        weight: category.weight,
        criteria: [],
        categoryScore: 0,
        maxCategoryScore: 0
      };

      for (const criterion of category.criteria) {
        const candidateValue = this.getCandidateValue(candidateData, criterion.item);
        const score = this.calculateCriterionScore(candidateValue, criterion);

        categoryResult.criteria.push({
          item: criterion.item,
          candidateValue,
          minRequired: criterion.min,
          idealValue: criterion.ideal,
          maxPoints: criterion.points,
          scoreObtained: score
        });

        categoryResult.categoryScore += score;
        categoryResult.maxCategoryScore += criterion.points;
      }

      // Calcular puntaje ponderado
      const weightedScore = (categoryResult.categoryScore / categoryResult.maxCategoryScore) * category.weight;
      categoryResult.weightedScore = Math.round(weightedScore * 100) / 100;

      evaluation.categories.push(categoryResult);
      evaluation.totalScore += weightedScore;
      evaluation.maxScore += category.weight;
    }

    // Normalizar a 100
    evaluation.finalScore = Math.round((evaluation.totalScore / evaluation.maxScore) * 100);
    evaluation.experienceScore = evaluation.finalScore; // Alias para compatibilidad con tests

    // Determinar recomendación
    evaluation.recommendation = this.getExperienceRecommendation(evaluation.finalScore, template.scoringGuide);

    return evaluation;
  }

  /**
   * Evalúa competencias de un candidato
   */
  evaluateCompetencies(candidateAssessments, position) {
    const profile = this.competencyFramework.positionProfiles[position];
    if (!profile) {
      return { error: `No existe perfil de competencias para: ${position}` };
    }

    const evaluation = {
      evaluationId: `COMP-${Date.now()}`,
      position,
      date: new Date().toISOString(),
      requiredCompetencies: [],
      preferredCompetencies: [],
      meetsRequirements: true,
      overallFit: 0
    };

    // Evaluar competencias requeridas
    let requiredScore = 0;
    let requiredMax = 0;

    for (const req of profile.required) {
      const competency = this.findCompetency(req.competency);
      const candidateLevel = candidateAssessments[req.competency] || 0;
      const meetsMin = candidateLevel >= req.minLevel;

      evaluation.requiredCompetencies.push({
        competencyId: req.competency,
        competencyName: competency?.name || req.competency,
        requiredLevel: req.minLevel,
        candidateLevel,
        gap: req.minLevel - candidateLevel,
        meetsRequirement: meetsMin,
        levelDescription: competency?.levels[candidateLevel]?.description || 'No evaluado'
      });

      if (!meetsMin) {
        evaluation.meetsRequirements = false;
      }

      requiredScore += Math.min(candidateLevel, 5);
      requiredMax += 5;
    }

    // Evaluar competencias preferidas
    let preferredScore = 0;
    let preferredMax = 0;

    for (const pref of profile.preferred || []) {
      const competency = this.findCompetency(pref.competency);
      const candidateLevel = candidateAssessments[pref.competency] || 0;

      evaluation.preferredCompetencies.push({
        competencyId: pref.competency,
        competencyName: competency?.name || pref.competency,
        preferredLevel: pref.minLevel,
        candidateLevel,
        exceedsPreferred: candidateLevel >= pref.minLevel,
        levelDescription: competency?.levels[candidateLevel]?.description || 'No evaluado'
      });

      preferredScore += Math.min(candidateLevel, 5);
      preferredMax += 5;
    }

    // Calcular ajuste general (70% requeridas, 30% preferidas)
    const requiredFit = requiredMax > 0 ? (requiredScore / requiredMax) * 70 : 0;
    const preferredFit = preferredMax > 0 ? (preferredScore / preferredMax) * 30 : 30;
    evaluation.overallFit = Math.round(requiredFit + preferredFit);

    // Alias para compatibilidad con tests
    evaluation.competencyScores = evaluation.requiredCompetencies.map(c => ({
      competency: c.competencyId,
      score: c.candidateLevel,
      required: c.requiredLevel,
      meets: c.meetsRequirement
    }));

    // Recomendación
    if (!evaluation.meetsRequirements) {
      evaluation.recommendation = 'NO APTO - No cumple competencias requeridas';
    } else if (evaluation.overallFit >= 85) {
      evaluation.recommendation = 'ALTAMENTE RECOMENDADO - Excelente ajuste';
    } else if (evaluation.overallFit >= 70) {
      evaluation.recommendation = 'RECOMENDADO - Buen ajuste con áreas de desarrollo';
    } else {
      evaluation.recommendation = 'CONSIDERAR - Cumple mínimos pero con brechas significativas';
    }

    return evaluation;
  }

  /**
   * Evaluación integral (experiencia + competencias)
   */
  fullEvaluation(candidateData, position) {
    const experienceEval = this.evaluateExperience(candidateData, position);
    const competencyEval = this.evaluateCompetencies(candidateData.competencies || {}, position);

    return {
      evaluationId: `FULL-${Date.now()}`,
      candidateName: candidateData.name,
      position,
      date: new Date().toISOString(),
      experienceEvaluation: experienceEval,
      competencyEvaluation: competencyEval,
      overallScore: Math.round(
        (experienceEval.finalScore || 0) * 0.5 +
        (competencyEval.overallFit || 0) * 0.5
      ),
      finalRecommendation: this.getFinalRecommendation(experienceEval, competencyEval)
    };
  }

  // Helpers
  getCandidateValue(candidateData, criterion) {
    // Mapeo de criterios a datos del candidato
    const mapping = {
      'Años en cocinas profesionales': candidateData.yearsInKitchen,
      'Años como cocinero profesional': candidateData.yearsAsCook,
      'Meses/años en cocina profesional': candidateData.monthsInKitchen,
      'Años liderando equipos de cocina': candidateData.yearsLeadingTeams,
      'Años como gerente de restaurante': candidateData.yearsAsManager,
      'Años como mesero profesional': candidateData.yearsAsServer,
      'Años como bartender': candidateData.yearsAsBartender
    };
    return mapping[criterion] || 0;
  }

  calculateCriterionScore(candidateValue, criterion) {
    if (candidateValue >= criterion.ideal) {
      return criterion.points;
    } else if (candidateValue >= criterion.min) {
      const range = criterion.ideal - criterion.min;
      const progress = candidateValue - criterion.min;
      return Math.round((progress / range) * criterion.points * 0.7 + criterion.points * 0.3);
    }
    return 0;
  }

  findCompetency(competencyId) {
    for (const category of Object.values(this.competencyFramework.competencies)) {
      if (category[competencyId]) {
        return category[competencyId];
      }
    }
    return null;
  }

  getExperienceRecommendation(score, guide) {
    if (score >= guide.excellent.min) return guide.excellent;
    if (score >= guide.good.min) return guide.good;
    if (score >= guide.acceptable.min) return guide.acceptable;
    return guide.insufficient;
  }

  getFinalRecommendation(expEval, compEval) {
    const expScore = expEval.finalScore || 0;
    const compScore = compEval.overallFit || 0;
    const combined = (expScore + compScore) / 2;

    if (!compEval.meetsRequirements) {
      return {
        decision: 'NO CONTRATAR',
        reason: 'No cumple competencias mínimas requeridas',
        score: combined
      };
    }

    if (combined >= 85) {
      return {
        decision: 'CONTRATAR PRIORITARIO',
        reason: 'Candidato excepcional en experiencia y competencias',
        score: combined
      };
    }

    if (combined >= 70) {
      return {
        decision: 'CONTRATAR',
        reason: 'Buen candidato con potencial de desarrollo',
        score: combined
      };
    }

    if (combined >= 55) {
      return {
        decision: 'CONSIDERAR',
        reason: 'Candidato aceptable, evaluar alternativas',
        score: combined
      };
    }

    return {
      decision: 'NO CONTRATAR',
      reason: 'No alcanza el perfil requerido',
      score: combined
    };
  }

  /**
   * Obtener preguntas de entrevista por competencias
   */
  getInterviewQuestions(position) {
    const profile = this.competencyFramework.positionProfiles[position];
    if (!profile) return [];

    const questions = [];
    const allCompetencies = [...profile.required, ...(profile.preferred || [])];

    for (const comp of allCompetencies) {
      const competency = this.findCompetency(comp.competency);
      if (competency && competency.questions) {
        questions.push({
          competency: competency.name,
          competencyId: comp.competency,
          requiredLevel: comp.minLevel,
          questions: competency.questions
        });
      }
    }

    return questions;
  }

  /**
   * Genera reporte de evaluación
   */
  generateReport(evaluation) {
    return {
      title: 'REPORTE DE EVALUACIÓN DE CANDIDATO',
      generatedAt: new Date().toISOString(),
      candidate: evaluation.candidateName,
      position: evaluation.position,
      evaluationType: evaluation.evaluationId.split('-')[0],
      summary: {
        overallScore: evaluation.overallScore || evaluation.finalScore,
        recommendation: evaluation.finalRecommendation || evaluation.recommendation
      },
      details: evaluation
    };
  }
}

// Instancia exportada
export const candidateEvaluator = new CandidateEvaluator();

export default {
  EXPERIENCE_EVALUATION,
  COMPETENCY_EVALUATION,
  CandidateEvaluator,
  candidateEvaluator
};
