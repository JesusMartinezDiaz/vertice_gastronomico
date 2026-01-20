/**
 * PLANTILLAS DE ENTREVISTAS ESTRUCTURADAS
 * Vértice Gastronómico - Entrevistas por Habilidades, Situaciones y Proyectos
 *
 * Sistema completo de preguntas estructuradas para entrevistas
 * basadas en competencias con rúbricas de evaluación.
 *
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN GENERAL DE ENTREVISTAS
// ═══════════════════════════════════════════════════════════════════

export const INTERVIEW_CONFIG = {
  types: {
    SKILLS: 'habilidades',
    SITUATIONAL: 'situacional',
    PROJECT: 'proyectos',
    BEHAVIORAL: 'conductual',
    TECHNICAL: 'técnica'
  },
  scoringScale: {
    1: { label: 'Insuficiente', description: 'No demuestra la competencia' },
    2: { label: 'Básico', description: 'Demuestra comprensión básica' },
    3: { label: 'Competente', description: 'Cumple con las expectativas' },
    4: { label: 'Avanzado', description: 'Supera las expectativas' },
    5: { label: 'Excepcional', description: 'Nivel experto/ejemplar' }
  },
  starMethod: {
    S: 'Situación - Contexto del escenario',
    T: 'Tarea - Responsabilidad específica',
    A: 'Acción - Pasos tomados',
    R: 'Resultado - Outcome y aprendizaje'
  }
};

// ═══════════════════════════════════════════════════════════════════
// ENTREVISTAS POR HABILIDADES (Skills-Based)
// ═══════════════════════════════════════════════════════════════════

export const SKILLS_INTERVIEWS = {
  // ─────────────────────────────────────────────────────────────────
  // HABILIDADES TÉCNICAS CULINARIAS
  // ─────────────────────────────────────────────────────────────────
  tecnicas_culinarias: {
    id: 'skills_culinary',
    name: 'Habilidades Técnicas Culinarias',
    duration: '30-45 minutos',
    targetPositions: ['chef_ejecutivo', 'sous_chef', 'cocinero', 'pastelero'],

    questions: [
      {
        id: 'sk_cul_01',
        question: 'Describe las cinco salsas madre de la cocina francesa y en qué platillos las aplicarías.',
        competency: 'conocimiento_técnico',
        weight: 2,
        rubric: {
          5: 'Nombra las 5 salsas correctamente, explica técnicas de preparación y da ejemplos creativos de aplicación',
          4: 'Nombra las 5 salsas y da buenos ejemplos de uso',
          3: 'Nombra al menos 4 salsas con ejemplos básicos',
          2: 'Conoce algunas salsas pero confunde técnicas',
          1: 'No puede nombrar las salsas madre'
        },
        followUp: '¿Cuál es tu salsa favorita para trabajar y por qué?'
      },
      {
        id: 'sk_cul_02',
        question: 'Explica los diferentes puntos de cocción de una carne y cómo los verificarías sin termómetro.',
        competency: 'técnica_cocción',
        weight: 2,
        rubric: {
          5: 'Describe todos los términos con técnicas táctiles, tiempos y señales visuales',
          4: 'Conoce los términos y al menos 2 métodos de verificación',
          3: 'Conoce términos básicos con un método de verificación',
          2: 'Confunde algunos términos o técnicas',
          1: 'No puede explicar los puntos de cocción'
        },
        followUp: '¿Cómo manejas cuando un cliente pide un término no estándar?'
      },
      {
        id: 'sk_cul_03',
        question: '¿Cómo organizarías tu mise en place para un servicio de 200 cubiertos con menú de 3 tiempos?',
        competency: 'organización',
        weight: 2,
        rubric: {
          5: 'Plan detallado con tiempos, orden de preparación, almacenamiento y contingencias',
          4: 'Plan completo con buena organización temporal',
          3: 'Plan básico con los elementos principales',
          2: 'Organización desordenada o incompleta',
          1: 'No tiene metodología de organización'
        },
        followUp: '¿Qué preparas el día anterior vs el mismo día?'
      },
      {
        id: 'sk_cul_04',
        question: 'Un platillo sale con la proteína perfecta pero la guarnición está demasiado salada. ¿Qué haces?',
        competency: 'resolución_problemas',
        weight: 2,
        rubric: {
          5: 'Solución inmediata, comunicación con equipo, análisis de causa raíz',
          4: 'Buena solución con comunicación al equipo',
          3: 'Resuelve el problema pero sin análisis',
          2: 'Solución parcial o tardía',
          1: 'No puede resolver el problema'
        },
        followUp: '¿Cómo evitarías que esto vuelva a pasar?'
      },
      {
        id: 'sk_cul_05',
        question: '¿Cuáles son las temperaturas críticas de seguridad alimentaria y cómo las monitoreas?',
        competency: 'seguridad_alimentaria',
        weight: 3,
        rubric: {
          5: 'Conoce todas las temperaturas, zonas de peligro, tiempos y sistemas de monitoreo',
          4: 'Conocimiento sólido con buenas prácticas de monitoreo',
          3: 'Conoce temperaturas básicas de cocción',
          2: 'Conocimiento parcial de seguridad',
          1: 'Desconoce normas de seguridad alimentaria'
        },
        followUp: '¿Qué harías si descubres que la cadena de frío se rompió?'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // HABILIDADES DE SERVICIO AL CLIENTE
  // ─────────────────────────────────────────────────────────────────
  servicio_cliente: {
    id: 'skills_service',
    name: 'Habilidades de Servicio al Cliente',
    duration: '25-35 minutos',
    targetPositions: ['mesero', 'hostess', 'bartender', 'gerente_restaurante'],

    questions: [
      {
        id: 'sk_srv_01',
        question: '¿Cómo describirías los platillos del menú a un cliente que no conoce la cocina del restaurante?',
        competency: 'comunicación',
        weight: 2,
        rubric: {
          5: 'Descripciones evocadoras, adapta el lenguaje al cliente, hace preguntas para personalizar',
          4: 'Buenas descripciones con adaptación al cliente',
          3: 'Descripciones correctas pero genéricas',
          2: 'Descripciones básicas o técnicas',
          1: 'No puede describir los platillos adecuadamente'
        },
        followUp: '¿Cómo modificarías tu descripción para un cliente vegetariano?'
      },
      {
        id: 'sk_srv_02',
        question: '¿Cuál es el proceso correcto de servicio de vino en mesa?',
        competency: 'protocolo_servicio',
        weight: 2,
        rubric: {
          5: 'Domina todo el protocolo: presentación, descorche, degustación, servicio, temperatura',
          4: 'Conoce el protocolo completo con buen desenvolvimiento',
          3: 'Conoce los pasos básicos correctamente',
          2: 'Conocimiento parcial del protocolo',
          1: 'No conoce el servicio de vinos'
        },
        followUp: '¿Qué haces si el cliente rechaza el vino?'
      },
      {
        id: 'sk_srv_03',
        question: '¿Cómo manejas múltiples mesas simultáneamente durante un servicio ocupado?',
        competency: 'multitarea',
        weight: 2,
        rubric: {
          5: 'Sistema de priorización claro, técnicas de eficiencia, comunicación con equipo',
          4: 'Buena organización con algunas técnicas específicas',
          3: 'Maneja la situación pero sin sistema claro',
          2: 'Se abruma con múltiples mesas',
          1: 'No puede manejar más de una mesa'
        },
        followUp: '¿Qué señales te indican que una mesa necesita atención?'
      },
      {
        id: 'sk_srv_04',
        question: 'Un cliente tiene una alergia alimentaria. ¿Cuál es tu proceso para atenderlo?',
        competency: 'seguridad_cliente',
        weight: 3,
        rubric: {
          5: 'Protocolo completo: documentar, verificar con cocina, confirmar, seguimiento',
          4: 'Buen proceso con comunicación a cocina y cliente',
          3: 'Proceso básico de verificación',
          2: 'Proceso incompleto o con riesgos',
          1: 'No tiene proceso para alergias'
        },
        followUp: '¿Qué haces si no estás seguro si un ingrediente contiene el alérgeno?'
      },
      {
        id: 'sk_srv_05',
        question: '¿Cómo calcularías la cuenta y manejarías diferentes métodos de pago para una mesa de 8 personas?',
        competency: 'manejo_cuentas',
        weight: 2,
        rubric: {
          5: 'Domina cálculos, divisiones complejas, múltiples pagos, propinas',
          4: 'Maneja bien las cuentas con pocos errores',
          3: 'Puede manejar pagos básicos correctamente',
          2: 'Comete errores frecuentes en cálculos',
          1: 'No puede manejar cuentas divididas'
        },
        followUp: '¿Cómo manejas cuando un cliente cuestiona la cuenta?'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // HABILIDADES DE GESTIÓN
  // ─────────────────────────────────────────────────────────────────
  gestion: {
    id: 'skills_management',
    name: 'Habilidades de Gestión',
    duration: '35-45 minutos',
    targetPositions: ['chef_ejecutivo', 'gerente_restaurante', 'gerente_alimentos_bebidas'],

    questions: [
      {
        id: 'sk_mgt_01',
        question: '¿Cómo elaborarías y controlarías el presupuesto de food cost para un mes?',
        competency: 'control_costos',
        weight: 3,
        rubric: {
          5: 'Sistema completo: proyección, monitoreo diario, ajustes, reportes, acciones correctivas',
          4: 'Buen sistema de control con análisis regular',
          3: 'Control básico con revisión semanal',
          2: 'Control parcial sin sistema definido',
          1: 'No sabe controlar costos'
        },
        followUp: '¿Qué harías si el food cost sube 5 puntos en una semana?'
      },
      {
        id: 'sk_mgt_02',
        question: '¿Cómo estructurarías los horarios del personal para una semana con un evento especial el sábado?',
        competency: 'gestión_personal',
        weight: 2,
        rubric: {
          5: 'Planificación detallada: necesidades, rotación, descansos, contingencias, comunicación',
          4: 'Buena planificación con cobertura adecuada',
          3: 'Horarios funcionales pero sin optimización',
          2: 'Horarios con posibles problemas de cobertura',
          1: 'No puede estructurar horarios efectivos'
        },
        followUp: '¿Cómo manejas cuando alguien no puede asistir a último momento?'
      },
      {
        id: 'sk_mgt_03',
        question: 'Describe cómo realizarías una evaluación de desempeño de un cocinero.',
        competency: 'desarrollo_equipo',
        weight: 2,
        rubric: {
          5: 'Proceso estructurado: criterios claros, ejemplos, feedback constructivo, plan de desarrollo',
          4: 'Buena evaluación con feedback útil',
          3: 'Evaluación básica pero completa',
          2: 'Evaluación superficial o subjetiva',
          1: 'No sabe evaluar desempeño'
        },
        followUp: '¿Cómo darías feedback negativo de manera constructiva?'
      },
      {
        id: 'sk_mgt_04',
        question: '¿Qué métricas usarías para medir el éxito del restaurante y cómo las analizarías?',
        competency: 'análisis_negocio',
        weight: 2,
        rubric: {
          5: 'Conoce KPIs clave (ticket promedio, rotación, NPS, etc.) con análisis y acciones',
          4: 'Conoce métricas importantes con buen análisis',
          3: 'Conoce métricas básicas de ventas',
          2: 'Solo conoce ventas totales',
          1: 'No conoce métricas del negocio'
        },
        followUp: '¿Qué harías si el ticket promedio baja consistentemente?'
      },
      {
        id: 'sk_mgt_05',
        question: '¿Cómo manejarías la negociación con proveedores para obtener mejores precios?',
        competency: 'negociación',
        weight: 2,
        rubric: {
          5: 'Estrategia completa: preparación, alternativas, relación a largo plazo, win-win',
          4: 'Buena técnica de negociación con preparación',
          3: 'Negociación básica pero efectiva',
          2: 'Negociación agresiva o pasiva',
          1: 'No sabe negociar con proveedores'
        },
        followUp: '¿Cómo balanceas precio vs calidad en la selección de proveedores?'
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// ENTREVISTAS SITUACIONALES (Situational)
// ═══════════════════════════════════════════════════════════════════

export const SITUATIONAL_INTERVIEWS = {
  // ─────────────────────────────────────────────────────────────────
  // SITUACIONES DE SERVICIO
  // ─────────────────────────────────────────────────────────────────
  servicio: {
    id: 'sit_service',
    name: 'Situaciones de Servicio',
    duration: '30-40 minutos',
    targetPositions: ['mesero', 'hostess', 'bartender', 'gerente_restaurante'],

    scenarios: [
      {
        id: 'sit_srv_01',
        situation: 'Un cliente se queja en voz alta de que esperó 45 minutos por su platillo. Otros clientes están escuchando.',
        question: '¿Cómo manejarías esta situación?',
        competencies: ['manejo_conflictos', 'comunicación', 'profesionalismo'],
        weight: 3,
        idealResponse: [
          'Acercarse inmediatamente con actitud calmada',
          'Disculparse sinceramente sin excusas',
          'Ofrecer solución concreta (descuento, cortesía)',
          'Verificar estado del pedido con cocina',
          'Hacer seguimiento para asegurar satisfacción'
        ],
        rubric: {
          5: 'Aborda todos los puntos con empatía y profesionalismo, convierte situación negativa en positiva',
          4: 'Maneja bien la situación con buenas soluciones',
          3: 'Resuelve el problema pero de forma básica',
          2: 'Resolución parcial o actitud defensiva',
          1: 'Empeora la situación o no actúa'
        }
      },
      {
        id: 'sit_srv_02',
        situation: 'Un grupo de 10 personas llega sin reservación en un viernes por la noche. El restaurante está lleno.',
        question: '¿Qué harías para atender a este grupo?',
        competencies: ['resolución_problemas', 'servicio_cliente', 'creatividad'],
        weight: 2,
        idealResponse: [
          'Recibir cordialmente sin mostrar estrés',
          'Verificar disponibilidad real y tiempos de espera',
          'Ofrecer alternativas (bar, lista de espera)',
          'Buscar opciones creativas (juntar mesas, terraza)',
          'Si no hay opción, agradecer y ofrecer reservación futura'
        ],
        rubric: {
          5: 'Encuentra solución creativa manteniendo excelente experiencia para todos',
          4: 'Ofrece buenas alternativas con profesionalismo',
          3: 'Maneja la situación correctamente',
          2: 'Rechaza al grupo sin explorar alternativas',
          1: 'Mal manejo que molesta al grupo'
        }
      },
      {
        id: 'sit_srv_03',
        situation: 'Un cliente regular importante está cenando. Notas que su mesero asignado está teniendo un mal día y da servicio mediocre.',
        question: 'Si eres el gerente, ¿cómo intervendrías?',
        competencies: ['liderazgo', 'servicio_cliente', 'manejo_equipo'],
        weight: 2,
        idealResponse: [
          'Intervenir discretamente sin humillar al mesero',
          'Apoyar personalmente el servicio de esa mesa',
          'Hablar con el mesero en privado sobre qué pasa',
          'Asegurar que el cliente VIP reciba atención especial',
          'Dar seguimiento con el empleado después del servicio'
        ],
        rubric: {
          5: 'Maneja ambos aspectos (cliente y empleado) con tacto y efectividad',
          4: 'Buena intervención que protege al cliente',
          3: 'Interviene pero de manera visible',
          2: 'Solo se enfoca en el cliente o el empleado',
          1: 'No interviene o lo hace de forma negativa'
        }
      },
      {
        id: 'sit_srv_04',
        situation: 'Un cliente intoxicado está molestando a otras mesas. Su acompañante parece avergonzado.',
        question: '¿Cómo manejarías esta situación delicada?',
        competencies: ['manejo_conflictos', 'diplomacia', 'seguridad'],
        weight: 3,
        idealResponse: [
          'Actuar con discreción y profesionalismo',
          'Hablar con el acompañante para buscar cooperación',
          'Ofrecer opciones (café, agua, cuenta)',
          'Si escala, pedir educadamente que se retiren',
          'Tener listo apoyo de seguridad si es necesario',
          'No servir más alcohol según la ley'
        ],
        rubric: {
          5: 'Maneja con tacto extremo protegiendo a todos y cumpliendo la ley',
          4: 'Buena resolución con diplomacia',
          3: 'Resuelve pero causa algo de incomodidad',
          2: 'Manejo torpe o confrontacional',
          1: 'No actúa o empeora la situación'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SITUACIONES DE COCINA
  // ─────────────────────────────────────────────────────────────────
  cocina: {
    id: 'sit_kitchen',
    name: 'Situaciones de Cocina',
    duration: '30-40 minutos',
    targetPositions: ['chef_ejecutivo', 'sous_chef', 'cocinero'],

    scenarios: [
      {
        id: 'sit_kit_01',
        situation: 'En medio del servicio, descubres que un lote de camarones llegó en mal estado pero ya se usaron en 3 platillos servidos.',
        question: '¿Cuáles son tus pasos inmediatos?',
        competencies: ['seguridad_alimentaria', 'manejo_crisis', 'comunicación'],
        weight: 3,
        idealResponse: [
          'Detener inmediatamente el uso del lote',
          'Identificar qué platillos fueron afectados',
          'Notificar al gerente/sala sobre los clientes',
          'Documentar el incidente completo',
          'Contactar al proveedor',
          'Preparar respuesta si clientes reportan síntomas'
        ],
        rubric: {
          5: 'Protocolo completo de crisis alimentaria con documentación y seguimiento',
          4: 'Buena respuesta con los pasos principales',
          3: 'Detiene el uso pero falta seguimiento',
          2: 'Respuesta parcial o tardía',
          1: 'Minimiza el problema o no actúa'
        }
      },
      {
        id: 'sit_kit_02',
        situation: 'Dos cocineros de tu equipo están en conflicto constante. La tensión está afectando al resto del equipo.',
        question: '¿Cómo resolverías este conflicto como líder de cocina?',
        competencies: ['liderazgo', 'manejo_conflictos', 'comunicación'],
        weight: 2,
        idealResponse: [
          'Hablar con cada uno por separado primero',
          'Entender la raíz del conflicto',
          'Mediar una conversación entre ambos',
          'Establecer expectativas claras de comportamiento',
          'Dar seguimiento y consecuencias si continúa'
        ],
        rubric: {
          5: 'Proceso de mediación completo con resolución duradera',
          4: 'Buena intervención que reduce el conflicto',
          3: 'Aborda el problema pero sin resolución profunda',
          2: 'Solo da advertencias sin resolver',
          1: 'Ignora o empeora el conflicto'
        }
      },
      {
        id: 'sit_kit_03',
        situation: 'El chef ejecutivo te pide preparar un menú para 50 personas con un presupuesto muy limitado. La calidad no puede bajar.',
        question: '¿Cómo abordarías este reto?',
        competencies: ['creatividad', 'control_costos', 'planificación'],
        weight: 2,
        idealResponse: [
          'Analizar ingredientes de temporada más económicos',
          'Diseñar menú que maximice proteínas con vegetales',
          'Usar cortes secundarios preparados expertamente',
          'Reducir variedad pero aumentar calidad',
          'Negociar con proveedores por volumen'
        ],
        rubric: {
          5: 'Propuestas creativas y prácticas que mantienen calidad en presupuesto',
          4: 'Buenas ideas con control de costos',
          3: 'Solución funcional pero básica',
          2: 'Sacrifica calidad por costo',
          1: 'No puede resolver el reto'
        }
      },
      {
        id: 'sit_kit_04',
        situation: 'Un cocinero joven comete un error grave que arruina la mise en place para el servicio de la noche.',
        question: '¿Cómo manejarías esta situación y a este empleado?',
        competencies: ['liderazgo', 'coaching', 'resolución_problemas'],
        weight: 2,
        idealResponse: [
          'Resolver primero el problema operativo',
          'No humillar al empleado frente a otros',
          'Organizar recuperación con el equipo',
          'Después del servicio, hablar en privado',
          'Convertirlo en momento de aprendizaje'
        ],
        rubric: {
          5: 'Resuelve operación y usa como oportunidad de coaching positivo',
          4: 'Buena gestión de crisis y feedback constructivo',
          3: 'Resuelve el problema pero feedback limitado',
          2: 'Reprende públicamente o solo castiga',
          1: 'Manejo destructivo que desmotiva'
        }
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// ENTREVISTAS BASADAS EN PROYECTOS (Project-Based)
// ═══════════════════════════════════════════════════════════════════

export const PROJECT_INTERVIEWS = {
  // ─────────────────────────────────────────────────────────────────
  // PROYECTOS PARA CHEFS
  // ─────────────────────────────────────────────────────────────────
  chef: {
    id: 'proj_chef',
    name: 'Proyectos de Chef',
    duration: '45-60 minutos',
    targetPositions: ['chef_ejecutivo', 'sous_chef'],

    projects: [
      {
        id: 'prj_chef_01',
        title: 'Diseño de Menú de Temporada',
        brief: 'Diseña un menú de otoño para un restaurante casual fine dining. Incluye 3 entradas, 4 platos fuertes y 2 postres.',
        timeToComplete: '20 minutos de preparación + presentación',
        deliverables: [
          'Lista de platillos con descripción',
          'Ingredientes principales de cada uno',
          'Food cost estimado por platillo',
          'Historia/concepto del menú'
        ],
        evaluation: {
          creatividad: { weight: 3, criteria: 'Originalidad y atractivo de los platillos' },
          viabilidad: { weight: 2, criteria: 'Factibilidad operativa y de costos' },
          conocimiento_técnico: { weight: 2, criteria: 'Técnicas apropiadas y ejecución' },
          storytelling: { weight: 2, criteria: 'Narrativa coherente del menú' },
          presentación: { weight: 1, criteria: 'Claridad y profesionalismo al presentar' }
        },
        rubric: {
          5: 'Menú excepcional, creativo, viable y con historia memorable',
          4: 'Buen menú con elementos creativos y viables',
          3: 'Menú correcto pero sin elementos destacados',
          2: 'Menú básico con problemas de viabilidad',
          1: 'Menú inadecuado o no completado'
        }
      },
      {
        id: 'prj_chef_02',
        title: 'Plan de Reducción de Merma',
        brief: 'El food cost del restaurante está 8 puntos arriba del objetivo. Crea un plan de 30 días para reducirlo.',
        timeToComplete: '15 minutos de preparación + presentación',
        deliverables: [
          'Diagnóstico de posibles causas',
          'Acciones específicas semanales',
          'Métricas de seguimiento',
          'Plan de comunicación al equipo'
        ],
        evaluation: {
          análisis: { weight: 3, criteria: 'Identificación de causas raíz' },
          planificación: { weight: 2, criteria: 'Plan estructurado y realista' },
          conocimiento_operativo: { weight: 2, criteria: 'Entendimiento del negocio' },
          liderazgo: { weight: 2, criteria: 'Capacidad de implementar con equipo' },
          seguimiento: { weight: 1, criteria: 'Sistema de monitoreo propuesto' }
        },
        rubric: {
          5: 'Plan completo con alto potencial de éxito',
          4: 'Buen plan con acciones efectivas',
          3: 'Plan básico que podría funcionar',
          2: 'Plan incompleto o poco realista',
          1: 'No presenta plan viable'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // PROYECTOS PARA GERENTES
  // ─────────────────────────────────────────────────────────────────
  gerente: {
    id: 'proj_manager',
    name: 'Proyectos de Gerencia',
    duration: '45-60 minutos',
    targetPositions: ['gerente_restaurante', 'gerente_alimentos_bebidas'],

    projects: [
      {
        id: 'prj_mgr_01',
        title: 'Plan de Lanzamiento de Nuevo Menú',
        brief: 'El restaurante lanzará un nuevo concepto de brunch. Diseña el plan de lanzamiento completo.',
        timeToComplete: '20 minutos de preparación + presentación',
        deliverables: [
          'Cronograma de 4 semanas pre-lanzamiento',
          'Plan de capacitación del personal',
          'Estrategia de marketing',
          'KPIs de éxito del lanzamiento'
        ],
        evaluation: {
          planificación: { weight: 3, criteria: 'Completitud y viabilidad del plan' },
          marketing: { weight: 2, criteria: 'Estrategia de promoción' },
          gestión_equipo: { weight: 2, criteria: 'Preparación del personal' },
          métricas: { weight: 2, criteria: 'Definición de éxito medible' },
          creatividad: { weight: 1, criteria: 'Ideas innovadoras' }
        },
        rubric: {
          5: 'Plan excepcional listo para implementar',
          4: 'Buen plan con todos los elementos necesarios',
          3: 'Plan funcional pero incompleto',
          2: 'Plan con gaps importantes',
          1: 'No presenta plan coherente'
        }
      },
      {
        id: 'prj_mgr_02',
        title: 'Resolución de Crisis de Personal',
        brief: '3 meseros renunciaron la semana antes de Navidad. Tienes 7 días para resolver la situación.',
        timeToComplete: '15 minutos de preparación + presentación',
        deliverables: [
          'Plan de contingencia inmediato',
          'Estrategia de reclutamiento urgente',
          'Plan de redistribución de horarios',
          'Comunicación al equipo existente'
        ],
        evaluation: {
          manejo_crisis: { weight: 3, criteria: 'Efectividad de la respuesta inmediata' },
          reclutamiento: { weight: 2, criteria: 'Viabilidad de encontrar reemplazos' },
          liderazgo: { weight: 2, criteria: 'Manejo del equipo durante la crisis' },
          prevención: { weight: 2, criteria: 'Ideas para evitar futuras crisis' },
          comunicación: { weight: 1, criteria: 'Claridad en la presentación' }
        },
        rubric: {
          5: 'Plan de crisis ejemplar con soluciones creativas',
          4: 'Buena respuesta con plan viable',
          3: 'Respuesta adecuada pero limitada',
          2: 'Plan reactivo sin visión completa',
          1: 'No puede manejar la crisis'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // PROYECTOS PARA SERVICIO
  // ─────────────────────────────────────────────────────────────────
  servicio: {
    id: 'proj_service',
    name: 'Proyectos de Servicio',
    duration: '30-45 minutos',
    targetPositions: ['mesero', 'hostess', 'bartender'],

    projects: [
      {
        id: 'prj_srv_01',
        title: 'Mejora de Experiencia del Cliente',
        brief: 'Las reseñas mencionan que el servicio es "correcto pero no memorable". Propón mejoras.',
        timeToComplete: '15 minutos de preparación + presentación',
        deliverables: [
          '3 mejoras concretas al servicio',
          'Cómo implementarías cada una',
          'Costo aproximado de implementación',
          'Impacto esperado en satisfacción'
        ],
        evaluation: {
          creatividad: { weight: 2, criteria: 'Originalidad de las propuestas' },
          viabilidad: { weight: 3, criteria: 'Factibilidad de implementación' },
          orientación_cliente: { weight: 2, criteria: 'Enfoque en experiencia del cliente' },
          costo_beneficio: { weight: 2, criteria: 'Relación inversión vs impacto' },
          comunicación: { weight: 1, criteria: 'Claridad en la presentación' }
        },
        rubric: {
          5: 'Ideas excelentes, viables y con alto impacto',
          4: 'Buenas propuestas implementables',
          3: 'Ideas correctas pero comunes',
          2: 'Propuestas poco viables o de bajo impacto',
          1: 'No presenta ideas útiles'
        }
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// PREGUNTAS CONDUCTUALES (STAR)
// ═══════════════════════════════════════════════════════════════════

export const BEHAVIORAL_QUESTIONS = {
  liderazgo: [
    {
      id: 'beh_lead_01',
      question: 'Cuéntame sobre una vez que tuviste que liderar un equipo en una situación difícil.',
      followUp: '¿Qué aprendiste de esa experiencia?',
      lookFor: ['Claridad en el rol', 'Acciones específicas', 'Resultado medible', 'Aprendizaje']
    },
    {
      id: 'beh_lead_02',
      question: 'Describe una situación donde tuviste que tomar una decisión impopular.',
      followUp: '¿Cómo la comunicaste al equipo?',
      lookFor: ['Razonamiento', 'Comunicación', 'Manejo de resistencia', 'Resultado']
    }
  ],
  servicio_cliente: [
    {
      id: 'beh_cust_01',
      question: 'Cuéntame sobre el cliente más difícil que hayas atendido.',
      followUp: '¿Qué harías diferente si volviera a pasar?',
      lookFor: ['Paciencia', 'Empatía', 'Resolución', 'Profesionalismo']
    },
    {
      id: 'beh_cust_02',
      question: 'Describe una vez que fuiste más allá para satisfacer a un cliente.',
      followUp: '¿Cómo supiste qué necesitaba el cliente?',
      lookFor: ['Iniciativa', 'Escucha activa', 'Creatividad', 'Impacto']
    }
  ],
  trabajo_equipo: [
    {
      id: 'beh_team_01',
      question: 'Cuéntame sobre un conflicto con un compañero de trabajo y cómo lo resolviste.',
      followUp: '¿Qué aprendiste sobre trabajar con personas diferentes?',
      lookFor: ['Comunicación', 'Empatía', 'Solución', 'Relación posterior']
    },
    {
      id: 'beh_team_02',
      question: 'Describe una situación donde ayudaste a un compañero que estaba teniendo dificultades.',
      followUp: '¿Cómo identificaste que necesitaba ayuda?',
      lookFor: ['Observación', 'Iniciativa', 'Apoyo', 'Resultado']
    }
  ],
  presión: [
    {
      id: 'beh_pres_01',
      question: 'Cuéntame sobre una vez que tuviste que trabajar bajo mucha presión.',
      followUp: '¿Qué técnicas usas para manejar el estrés?',
      lookFor: ['Manejo de estrés', 'Organización', 'Resultado bajo presión']
    },
    {
      id: 'beh_pres_02',
      question: 'Describe una situación donde cometiste un error importante en el trabajo.',
      followUp: '¿Qué sistemas implementaste para evitar que volviera a pasar?',
      lookFor: ['Responsabilidad', 'Acciones correctivas', 'Aprendizaje', 'Prevención']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// GESTOR DE ENTREVISTAS
// ═══════════════════════════════════════════════════════════════════

export class InterviewManager {
  constructor() {
    this.skillsInterviews = SKILLS_INTERVIEWS;
    this.situationalInterviews = SITUATIONAL_INTERVIEWS;
    this.projectInterviews = PROJECT_INTERVIEWS;
    this.behavioralQuestions = BEHAVIORAL_QUESTIONS;
    this.config = INTERVIEW_CONFIG;
    this.sessions = new Map();
  }

  /**
   * Genera guía de entrevista para un puesto
   */
  generateInterviewGuide(position, interviewTypes = ['skills', 'situational', 'behavioral']) {
    const guide = {
      position,
      generatedAt: new Date().toISOString(),
      estimatedDuration: 0,
      sections: []
    };

    if (interviewTypes.includes('skills')) {
      const skillsSection = this.getSkillsSection(position);
      if (skillsSection) {
        guide.sections.push(skillsSection);
        guide.estimatedDuration += 35;
      }
    }

    if (interviewTypes.includes('situational')) {
      const situationalSection = this.getSituationalSection(position);
      if (situationalSection) {
        guide.sections.push(situationalSection);
        guide.estimatedDuration += 35;
      }
    }

    if (interviewTypes.includes('behavioral')) {
      const behavioralSection = this.getBehavioralSection(position);
      guide.sections.push(behavioralSection);
      guide.estimatedDuration += 20;
    }

    if (interviewTypes.includes('project')) {
      const projectSection = this.getProjectSection(position);
      if (projectSection) {
        guide.sections.push(projectSection);
        guide.estimatedDuration += 45;
      }
    }

    guide.estimatedDuration = `${guide.estimatedDuration}-${guide.estimatedDuration + 15} minutos`;

    return guide;
  }

  /**
   * Obtiene sección de habilidades
   */
  getSkillsSection(position) {
    const positionLower = position.toLowerCase();

    for (const [key, interview] of Object.entries(this.skillsInterviews)) {
      if (interview.targetPositions.some(p => positionLower.includes(p) || p.includes(positionLower))) {
        return {
          type: 'skills',
          name: interview.name,
          duration: interview.duration,
          questions: interview.questions
        };
      }
    }

    return null;
  }

  /**
   * Obtiene sección situacional
   */
  getSituationalSection(position) {
    const positionLower = position.toLowerCase();

    for (const [key, interview] of Object.entries(this.situationalInterviews)) {
      if (interview.targetPositions.some(p => positionLower.includes(p) || p.includes(positionLower))) {
        return {
          type: 'situational',
          name: interview.name,
          duration: interview.duration,
          scenarios: interview.scenarios
        };
      }
    }

    return null;
  }

  /**
   * Obtiene sección conductual
   */
  getBehavioralSection(position) {
    const positionLower = position.toLowerCase();
    const questions = [];

    // Seleccionar preguntas relevantes según el puesto
    if (positionLower.includes('chef') || positionLower.includes('gerente')) {
      questions.push(...this.behavioralQuestions.liderazgo);
    }

    if (positionLower.includes('mesero') || positionLower.includes('host') || positionLower.includes('bar')) {
      questions.push(...this.behavioralQuestions.servicio_cliente);
    }

    questions.push(...this.behavioralQuestions.trabajo_equipo.slice(0, 1));
    questions.push(...this.behavioralQuestions.presión.slice(0, 1));

    return {
      type: 'behavioral',
      name: 'Preguntas Conductuales (STAR)',
      duration: '20-25 minutos',
      instructions: 'Pide al candidato que responda usando el método STAR: Situación, Tarea, Acción, Resultado',
      questions
    };
  }

  /**
   * Obtiene sección de proyectos
   */
  getProjectSection(position) {
    const positionLower = position.toLowerCase();

    for (const [key, interview] of Object.entries(this.projectInterviews)) {
      if (interview.targetPositions.some(p => positionLower.includes(p) || p.includes(positionLower))) {
        return {
          type: 'project',
          name: interview.name,
          duration: interview.duration,
          projects: interview.projects
        };
      }
    }

    return null;
  }

  /**
   * Inicia sesión de entrevista
   */
  startInterviewSession(candidateId, position, interviewer) {
    const guide = this.generateInterviewGuide(position);

    const session = {
      sessionId: `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      position,
      interviewer,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      guide,
      responses: [],
      scores: {},
      completedAt: null
    };

    this.sessions.set(session.sessionId, session);

    return {
      sessionId: session.sessionId,
      guide: session.guide
    };
  }

  /**
   * Registra respuesta de candidato
   */
  recordResponse(sessionId, questionId, response, score, notes = '') {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.responses.push({
      questionId,
      response,
      score,
      notes,
      recordedAt: new Date().toISOString()
    });

    session.scores[questionId] = score;

    return { success: true };
  }

  /**
   * Completa entrevista y genera resultados
   */
  completeInterview(sessionId, overallNotes = '') {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.status = 'completed';
    session.completedAt = new Date().toISOString();
    session.overallNotes = overallNotes;

    // Calcular puntuaciones por competencia
    const competencyScores = this.calculateCompetencyScores(session);

    // Generar resultado final
    const result = {
      sessionId: session.sessionId,
      candidateId: session.candidateId,
      position: session.position,
      interviewer: session.interviewer,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      duration: this.calculateDuration(session.startedAt, session.completedAt),
      questionsAnswered: session.responses.length,
      scores: {
        individual: session.scores,
        byCompetency: competencyScores,
        overall: this.calculateOverallScore(Object.values(session.scores))
      },
      recommendation: this.generateRecommendation(competencyScores),
      notes: overallNotes
    };

    return result;
  }

  /**
   * Calcula puntuaciones por competencia
   */
  calculateCompetencyScores(session) {
    // Implementación simplificada
    const scores = Object.values(session.scores);
    if (scores.length === 0) return {};

    return {
      promedio_general: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 20),
      respuestas_evaluadas: scores.length
    };
  }

  /**
   * Calcula puntuación general
   */
  calculateOverallScore(scores) {
    if (scores.length === 0) return 0;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg * 20); // Escala 0-100
  }

  /**
   * Calcula duración
   */
  calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes} minutos`;
  }

  /**
   * Genera recomendación
   */
  generateRecommendation(competencyScores) {
    const overall = competencyScores.promedio_general || 0;

    if (overall >= 85) {
      return {
        decision: 'CONTRATAR_PRIORITARIO',
        message: 'Candidato excepcional. Recomendación fuerte de contratación.'
      };
    } else if (overall >= 70) {
      return {
        decision: 'CONTRATAR',
        message: 'Buen candidato que cumple con los requisitos del puesto.'
      };
    } else if (overall >= 55) {
      return {
        decision: 'CONSIDERAR',
        message: 'Candidato aceptable. Evaluar contra otros candidatos.'
      };
    } else {
      return {
        decision: 'NO_CONTRATAR',
        message: 'No cumple con los requisitos mínimos del puesto.'
      };
    }
  }

  /**
   * Obtiene lista de tipos de entrevista disponibles
   */
  getAvailableInterviewTypes() {
    return Object.keys(this.config.types).map(key => ({
      key,
      name: this.config.types[key]
    }));
  }

  /**
   * Obtiene escala de puntuación
   */
  getScoringScale() {
    return this.config.scoringScale;
  }
}

// Instancia exportada
export const interviewManager = new InterviewManager();

// Export default
export default {
  InterviewManager,
  interviewManager,
  INTERVIEW_CONFIG,
  SKILLS_INTERVIEWS,
  SITUATIONAL_INTERVIEWS,
  PROJECT_INTERVIEWS,
  BEHAVIORAL_QUESTIONS
};
