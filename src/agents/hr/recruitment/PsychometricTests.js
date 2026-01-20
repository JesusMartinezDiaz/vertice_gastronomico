/**
 * BATERÍA DE PRUEBAS PSICOMÉTRICAS COMPLETA
 * Vértice Gastronómico - Sistema de Evaluación Psicológica
 *
 * Incluye:
 * - Test de Personalidad (Big Five adaptado)
 * - Test de Inteligencia Emocional
 * - Test de Aptitudes Cognitivas
 * - Test de Valores Laborales
 * - Test de Estrés y Afrontamiento
 * - Test de Orientación al Servicio
 * - Test de Trabajo en Equipo
 * - Test de Integridad
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN GENERAL
// ═══════════════════════════════════════════════════════════════════

export const PSYCHOMETRIC_CONFIG = {
  version: '2.0',
  minimumCompletionRate: 0.8, // 80% para considerar válido
  timeoutMinutes: 45,
  antiCheating: {
    minTimePerQuestion: 3, // segundos
    maxTimePerQuestion: 120,
    consistencyCheck: true
  },
  scoring: {
    likertScale: { min: 1, max: 5 },
    standardScale: { mean: 50, sd: 10 }
  }
};

// ═══════════════════════════════════════════════════════════════════
// TEST 1: PERSONALIDAD (BIG FIVE ADAPTADO PARA RESTAURANTES)
// ═══════════════════════════════════════════════════════════════════

export const PERSONALITY_TEST = {
  id: 'PSY-PERS-001',
  name: 'Evaluación de Personalidad Gastronómica',
  description: 'Evalúa los 5 grandes factores de personalidad contextualizados a la industria gastronómica',
  duration: '10-15 minutos',
  questionCount: 50,

  factors: {
    openness: {
      name: 'Apertura a la Experiencia',
      restaurantContext: 'Creatividad culinaria, innovación, adaptación a nuevos conceptos',
      idealFor: ['Chef', 'Bartender', 'Gerente'],
      lowIdealFor: ['Línea de producción', 'Almacén']
    },
    conscientiousness: {
      name: 'Responsabilidad',
      restaurantContext: 'Disciplina, organización, cumplimiento de estándares',
      idealFor: ['Todos los puestos'],
      lowIdealFor: []
    },
    extraversion: {
      name: 'Extroversión',
      restaurantContext: 'Energía en servicio, comunicación con clientes, trabajo en equipo',
      idealFor: ['Mesero', 'Host', 'Bartender', 'Gerente'],
      lowIdealFor: ['Cocina de producción']
    },
    agreeableness: {
      name: 'Amabilidad',
      restaurantContext: 'Orientación al servicio, cooperación, manejo de conflictos',
      idealFor: ['Servicio', 'Host', 'RRHH'],
      lowIdealFor: []
    },
    neuroticism: {
      name: 'Estabilidad Emocional',
      restaurantContext: 'Manejo del estrés, control bajo presión, resiliencia',
      idealFor: ['Todos - se mide inverso: alta estabilidad es mejor'],
      lowIdealFor: []
    }
  },

  questions: [
    // APERTURA (10 preguntas)
    { id: 1, factor: 'openness', text: 'Disfruto experimentar con ingredientes y técnicas nuevas', direction: 'positive' },
    { id: 2, factor: 'openness', text: 'Prefiero seguir recetas al pie de la letra sin modificaciones', direction: 'negative' },
    { id: 3, factor: 'openness', text: 'Me entusiasma probar cocinas de diferentes culturas', direction: 'positive' },
    { id: 4, factor: 'openness', text: 'Los cambios en el menú me generan estrés', direction: 'negative' },
    { id: 5, factor: 'openness', text: 'Frecuentemente pienso en formas de mejorar los platillos', direction: 'positive' },
    { id: 6, factor: 'openness', text: 'Me siento más cómodo con rutinas establecidas', direction: 'negative' },
    { id: 7, factor: 'openness', text: 'Me gusta aprender nuevas técnicas culinarias', direction: 'positive' },
    { id: 8, factor: 'openness', text: 'Las tendencias gastronómicas me resultan interesantes', direction: 'positive' },
    { id: 9, factor: 'openness', text: 'Prefiero trabajar con métodos que ya conozco', direction: 'negative' },
    { id: 10, factor: 'openness', text: 'Disfruto crear presentaciones únicas de platillos', direction: 'positive' },

    // RESPONSABILIDAD (10 preguntas)
    { id: 11, factor: 'conscientiousness', text: 'Siempre llego puntual a mis turnos', direction: 'positive' },
    { id: 12, factor: 'conscientiousness', text: 'A veces dejo tareas para después durante el servicio', direction: 'negative' },
    { id: 13, factor: 'conscientiousness', text: 'Mantengo mi estación de trabajo organizada', direction: 'positive' },
    { id: 14, factor: 'conscientiousness', text: 'Cumplo estrictamente con los estándares de higiene', direction: 'positive' },
    { id: 15, factor: 'conscientiousness', text: 'A veces olvido revisar fechas de caducidad', direction: 'negative' },
    { id: 16, factor: 'conscientiousness', text: 'Sigo los procedimientos aunque nadie me supervise', direction: 'positive' },
    { id: 17, factor: 'conscientiousness', text: 'Termino mis tareas antes de irme aunque sea tarde', direction: 'positive' },
    { id: 18, factor: 'conscientiousness', text: 'Me cuesta seguir listas de verificación detalladas', direction: 'negative' },
    { id: 19, factor: 'conscientiousness', text: 'Documento adecuadamente inventarios y mermas', direction: 'positive' },
    { id: 20, factor: 'conscientiousness', text: 'A veces descuido pequeños detalles de presentación', direction: 'negative' },

    // EXTROVERSIÓN (10 preguntas)
    { id: 21, factor: 'extraversion', text: 'Disfruto interactuar con los clientes', direction: 'positive' },
    { id: 22, factor: 'extraversion', text: 'Prefiero trabajar en áreas sin contacto con público', direction: 'negative' },
    { id: 23, factor: 'extraversion', text: 'Me energiza el ambiente de un servicio lleno', direction: 'positive' },
    { id: 24, factor: 'extraversion', text: 'Me siento agotado después de hablar con mucha gente', direction: 'negative' },
    { id: 25, factor: 'extraversion', text: 'Tomo la iniciativa para conversar con nuevos compañeros', direction: 'positive' },
    { id: 26, factor: 'extraversion', text: 'Prefiero trabajar solo que en equipo', direction: 'negative' },
    { id: 27, factor: 'extraversion', text: 'Me resulta fácil animar el ambiente cuando hay tensión', direction: 'positive' },
    { id: 28, factor: 'extraversion', text: 'Evito ser el centro de atención', direction: 'negative' },
    { id: 29, factor: 'extraversion', text: 'Disfruto recomendar platillos y bebidas a los clientes', direction: 'positive' },
    { id: 30, factor: 'extraversion', text: 'Las juntas de equipo me resultan cansadas', direction: 'negative' },

    // AMABILIDAD (10 preguntas)
    { id: 31, factor: 'agreeableness', text: 'Ayudo a mis compañeros aunque no me lo pidan', direction: 'positive' },
    { id: 32, factor: 'agreeableness', text: 'A veces me frustro con compañeros lentos', direction: 'negative' },
    { id: 33, factor: 'agreeableness', text: 'Mantengo la calma con clientes difíciles', direction: 'positive' },
    { id: 34, factor: 'agreeableness', text: 'Defiendo mi posición aunque cause conflicto', direction: 'negative' },
    { id: 35, factor: 'agreeableness', text: 'Me preocupo genuinamente por el bienestar del equipo', direction: 'positive' },
    { id: 36, factor: 'agreeableness', text: 'Si alguien comete un error, se lo hago notar directamente', direction: 'negative' },
    { id: 37, factor: 'agreeableness', text: 'Cedo ante las necesidades del grupo', direction: 'positive' },
    { id: 38, factor: 'agreeableness', text: 'Me cuesta perdonar errores de compañeros', direction: 'negative' },
    { id: 39, factor: 'agreeableness', text: 'Trato de entender el punto de vista del cliente molesto', direction: 'positive' },
    { id: 40, factor: 'agreeableness', text: 'Soy competitivo con mis compañeros por las propinas', direction: 'negative' },

    // ESTABILIDAD EMOCIONAL (10 preguntas - inverso de neuroticismo)
    { id: 41, factor: 'neuroticism', text: 'Me pongo muy ansioso cuando hay mucha presión', direction: 'negative' },
    { id: 42, factor: 'neuroticism', text: 'Mantengo la calma aunque el servicio sea caótico', direction: 'positive' },
    { id: 43, factor: 'neuroticism', text: 'Un error pequeño arruina mi estado de ánimo', direction: 'negative' },
    { id: 44, factor: 'neuroticism', text: 'Recupero rápido mi compostura tras un problema', direction: 'positive' },
    { id: 45, factor: 'neuroticism', text: 'Me preocupo excesivamente antes de servicios grandes', direction: 'negative' },
    { id: 46, factor: 'neuroticism', text: 'Duermo bien aunque tenga eventos importantes al día siguiente', direction: 'positive' },
    { id: 47, factor: 'neuroticism', text: 'Las críticas de los clientes me afectan profundamente', direction: 'negative' },
    { id: 48, factor: 'neuroticism', text: 'Puedo separar los problemas personales del trabajo', direction: 'positive' },
    { id: 49, factor: 'neuroticism', text: 'Me siento abrumado cuando hay muchas tareas pendientes', direction: 'negative' },
    { id: 50, factor: 'neuroticism', text: 'Enfrento los problemas con optimismo', direction: 'positive' }
  ],

  responseOptions: [
    { value: 1, label: 'Totalmente en desacuerdo' },
    { value: 2, label: 'En desacuerdo' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'De acuerdo' },
    { value: 5, label: 'Totalmente de acuerdo' }
  ],

  scoring: {
    method: 'sumByFactor',
    interpretation: {
      veryLow: { range: [10, 20], label: 'Muy bajo', percentile: '1-10%' },
      low: { range: [21, 30], label: 'Bajo', percentile: '11-30%' },
      average: { range: [31, 39], label: 'Promedio', percentile: '31-70%' },
      high: { range: [40, 45], label: 'Alto', percentile: '71-90%' },
      veryHigh: { range: [46, 50], label: 'Muy alto', percentile: '91-99%' }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// TEST 2: INTELIGENCIA EMOCIONAL
// ═══════════════════════════════════════════════════════════════════

export const EMOTIONAL_INTELLIGENCE_TEST = {
  id: 'PSY-EI-001',
  name: 'Evaluación de Inteligencia Emocional',
  description: 'Evalúa la capacidad de percibir, usar, entender y manejar emociones',
  duration: '10-12 minutos',
  questionCount: 40,

  dimensions: {
    selfAwareness: {
      name: 'Autoconciencia',
      description: 'Reconocer las propias emociones y su impacto',
      restaurantContext: 'Identificar cuándo el estrés afecta el desempeño'
    },
    selfRegulation: {
      name: 'Autorregulación',
      description: 'Manejar las emociones propias efectivamente',
      restaurantContext: 'Mantener profesionalismo bajo presión'
    },
    motivation: {
      name: 'Motivación',
      description: 'Impulso interno para lograr objetivos',
      restaurantContext: 'Persistencia en servicios difíciles'
    },
    empathy: {
      name: 'Empatía',
      description: 'Percibir y entender las emociones de otros',
      restaurantContext: 'Entender necesidades de clientes y compañeros'
    },
    socialSkills: {
      name: 'Habilidades Sociales',
      description: 'Manejar relaciones efectivamente',
      restaurantContext: 'Trabajo en equipo, manejo de conflictos'
    }
  },

  questions: [
    // AUTOCONCIENCIA (8 preguntas)
    { id: 1, dimension: 'selfAwareness', text: 'Puedo identificar exactamente qué emoción estoy sintiendo', direction: 'positive' },
    { id: 2, dimension: 'selfAwareness', text: 'Reconozco cuando mi humor afecta mi trabajo', direction: 'positive' },
    { id: 3, dimension: 'selfAwareness', text: 'Sé qué situaciones me generan estrés', direction: 'positive' },
    { id: 4, dimension: 'selfAwareness', text: 'A veces mis reacciones me sorprenden', direction: 'negative' },
    { id: 5, dimension: 'selfAwareness', text: 'Conozco mis fortalezas y debilidades emocionales', direction: 'positive' },
    { id: 6, dimension: 'selfAwareness', text: 'Noto cambios sutiles en mi estado emocional', direction: 'positive' },
    { id: 7, dimension: 'selfAwareness', text: 'Entiendo cómo mis emociones afectan mis decisiones', direction: 'positive' },
    { id: 8, dimension: 'selfAwareness', text: 'Me cuesta explicar cómo me siento', direction: 'negative' },

    // AUTORREGULACIÓN (8 preguntas)
    { id: 9, dimension: 'selfRegulation', text: 'Puedo calmarme rápidamente cuando me enojo', direction: 'positive' },
    { id: 10, dimension: 'selfRegulation', text: 'Controlo mis impulsos aunque esté estresado', direction: 'positive' },
    { id: 11, dimension: 'selfRegulation', text: 'A veces digo cosas de las que me arrepiento', direction: 'negative' },
    { id: 12, dimension: 'selfRegulation', text: 'Mantengo la compostura ante clientes difíciles', direction: 'positive' },
    { id: 13, dimension: 'selfRegulation', text: 'Pienso antes de actuar en situaciones tensas', direction: 'positive' },
    { id: 14, dimension: 'selfRegulation', text: 'Me cuesta ocultar mi frustración', direction: 'negative' },
    { id: 15, dimension: 'selfRegulation', text: 'Adapto mi comportamiento según la situación', direction: 'positive' },
    { id: 16, dimension: 'selfRegulation', text: 'Puedo trabajar bien aunque esté de mal humor', direction: 'positive' },

    // MOTIVACIÓN (8 preguntas)
    { id: 17, dimension: 'motivation', text: 'Busco siempre mejorar mi desempeño', direction: 'positive' },
    { id: 18, dimension: 'motivation', text: 'Me recupero rápido de los fracasos', direction: 'positive' },
    { id: 19, dimension: 'motivation', text: 'Me desanimo fácilmente con las críticas', direction: 'negative' },
    { id: 20, dimension: 'motivation', text: 'Persisto aunque las cosas se pongan difíciles', direction: 'positive' },
    { id: 21, dimension: 'motivation', text: 'Encuentro motivación incluso en tareas rutinarias', direction: 'positive' },
    { id: 22, dimension: 'motivation', text: 'Tengo metas claras para mi carrera', direction: 'positive' },
    { id: 23, dimension: 'motivation', text: 'Me cuesta mantener el entusiasmo en servicios lentos', direction: 'negative' },
    { id: 24, dimension: 'motivation', text: 'Veo los problemas como oportunidades de mejora', direction: 'positive' },

    // EMPATÍA (8 preguntas)
    { id: 25, dimension: 'empathy', text: 'Percibo fácilmente el estado de ánimo de los clientes', direction: 'positive' },
    { id: 26, dimension: 'empathy', text: 'Noto cuando un compañero está pasando un mal momento', direction: 'positive' },
    { id: 27, dimension: 'empathy', text: 'Me cuesta entender por qué la gente reacciona como lo hace', direction: 'negative' },
    { id: 28, dimension: 'empathy', text: 'Puedo ponerme en el lugar del cliente insatisfecho', direction: 'positive' },
    { id: 29, dimension: 'empathy', text: 'Escucho activamente sin interrumpir', direction: 'positive' },
    { id: 30, dimension: 'empathy', text: 'Identifico las necesidades no expresadas de los clientes', direction: 'positive' },
    { id: 31, dimension: 'empathy', text: 'A veces ignoro las señales emocionales de otros', direction: 'negative' },
    { id: 32, dimension: 'empathy', text: 'Me preocupo genuinamente por el bienestar de los clientes', direction: 'positive' },

    // HABILIDADES SOCIALES (8 preguntas)
    { id: 33, dimension: 'socialSkills', text: 'Resuelvo conflictos de manera constructiva', direction: 'positive' },
    { id: 34, dimension: 'socialSkills', text: 'Me comunico claramente con personas de diferentes personalidades', direction: 'positive' },
    { id: 35, dimension: 'socialSkills', text: 'Me cuesta trabajar con personas difíciles', direction: 'negative' },
    { id: 36, dimension: 'socialSkills', text: 'Puedo influir positivamente en el ánimo del equipo', direction: 'positive' },
    { id: 37, dimension: 'socialSkills', text: 'Construyo relaciones de confianza rápidamente', direction: 'positive' },
    { id: 38, dimension: 'socialSkills', text: 'Colaboro bien en equipos diversos', direction: 'positive' },
    { id: 39, dimension: 'socialSkills', text: 'Evito las confrontaciones aunque sean necesarias', direction: 'negative' },
    { id: 40, dimension: 'socialSkills', text: 'Doy retroalimentación de manera constructiva', direction: 'positive' }
  ],

  responseOptions: [
    { value: 1, label: 'Nunca' },
    { value: 2, label: 'Raramente' },
    { value: 3, label: 'A veces' },
    { value: 4, label: 'Frecuentemente' },
    { value: 5, label: 'Siempre' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// TEST 3: APTITUDES COGNITIVAS
// ═══════════════════════════════════════════════════════════════════

export const COGNITIVE_APTITUDE_TEST = {
  id: 'PSY-COG-001',
  name: 'Evaluación de Aptitudes Cognitivas',
  description: 'Evalúa capacidades mentales relevantes para el trabajo en restaurantes',
  duration: '15-20 minutos',
  questionCount: 30,
  timeLimit: true,

  aptitudes: {
    numericalReasoning: {
      name: 'Razonamiento Numérico',
      restaurantContext: 'Cálculos de costos, propinas, inventarios, recetas'
    },
    verbalComprehension: {
      name: 'Comprensión Verbal',
      restaurantContext: 'Entender órdenes, comunicar con claridad, leer recetas'
    },
    spatialReasoning: {
      name: 'Razonamiento Espacial',
      restaurantContext: 'Organización de cocina, emplatado, distribución de mesas'
    },
    workingMemory: {
      name: 'Memoria de Trabajo',
      restaurantContext: 'Recordar órdenes, pedidos múltiples, recetas'
    },
    processingSpeed: {
      name: 'Velocidad de Procesamiento',
      restaurantContext: 'Rapidez en servicios, multitasking'
    }
  },

  sections: [
    {
      aptitude: 'numericalReasoning',
      timeMinutes: 5,
      questions: [
        {
          id: 'NUM-1',
          type: 'calculation',
          text: 'Si el food cost de un platillo es del 28% y el precio de venta es $280, ¿cuál es el costo de los ingredientes?',
          options: ['$68.40', '$78.40', '$88.40', '$98.40'],
          correct: 1 // $78.40
        },
        {
          id: 'NUM-2',
          type: 'calculation',
          text: 'Una receta rinde 8 porciones con 500g de harina. ¿Cuánta harina necesitas para 20 porciones?',
          options: ['1,000g', '1,250g', '1,500g', '2,000g'],
          correct: 1 // 1,250g
        },
        {
          id: 'NUM-3',
          type: 'percentage',
          text: 'Las ventas aumentaron de $45,000 a $54,000. ¿Cuál fue el porcentaje de aumento?',
          options: ['15%', '18%', '20%', '25%'],
          correct: 2 // 20%
        },
        {
          id: 'NUM-4',
          type: 'calculation',
          text: 'Si la propina es 15% sobre una cuenta de $1,850 y se divide entre 3 meseros, ¿cuánto recibe cada uno?',
          options: ['$92.50', '$102.50', '$112.50', '$122.50'],
          correct: 0 // $92.50
        },
        {
          id: 'NUM-5',
          type: 'inventory',
          text: 'Tienes 45 kg de papa. Usas 3.5 kg por día. ¿Para cuántos días alcanza?',
          options: ['11 días', '12 días', '13 días', '14 días'],
          correct: 1 // 12.86, redondeado 12 días completos
        },
        {
          id: 'NUM-6',
          type: 'conversion',
          text: 'Una receta pide 2.5 libras de carne. ¿Cuántos gramos son aproximadamente? (1 lb = 454g)',
          options: ['1,000g', '1,135g', '1,250g', '1,362g'],
          correct: 1 // 1,135g
        }
      ]
    },
    {
      aptitude: 'verbalComprehension',
      timeMinutes: 4,
      questions: [
        {
          id: 'VER-1',
          type: 'comprehension',
          text: 'Lee: "El cliente solicitó su filete término medio, sin guarnición de vegetales y con salsa aparte." ¿Qué servicio requiere?',
          options: [
            'Filete bien cocido con vegetales',
            'Filete término medio sin vegetales, salsa en plato separado',
            'Filete término medio con vegetales y salsa',
            'Filete crudo sin salsa'
          ],
          correct: 1
        },
        {
          id: 'VER-2',
          type: 'inference',
          text: '"El comensal preguntó si el platillo contenía mariscos porque es alérgico." La mejor respuesta es:',
          options: [
            'Decirle que probablemente no tiene',
            'Verificar con cocina y confirmar ingredientes exactos',
            'Sugerir otro platillo sin preguntar',
            'Decirle que no sabe'
          ],
          correct: 1
        },
        {
          id: 'VER-3',
          type: 'vocabulary',
          text: '¿Qué significa "mise en place"?',
          options: [
            'Montaje de mesas',
            'Preparación y organización previa de ingredientes',
            'Lista de compras',
            'Menú del día'
          ],
          correct: 1
        },
        {
          id: 'VER-4',
          type: 'comprehension',
          text: '"86 el salmón" en jerga de cocina significa:',
          options: [
            'Preparar salmón para la mesa 86',
            'El salmón está agotado/no disponible',
            'El salmón cuesta $86',
            'Cocinar el salmón a 86 grados'
          ],
          correct: 1
        }
      ]
    },
    {
      aptitude: 'spatialReasoning',
      timeMinutes: 4,
      questions: [
        {
          id: 'SPA-1',
          type: 'arrangement',
          text: 'Tienes 8 mesas para 4 personas en un espacio de 6x8 metros. La mejor distribución para máximo flujo es:',
          options: [
            'Todas en línea recta',
            'En forma de U dejando pasillo central',
            'Agrupadas en una esquina',
            'Distribuidas uniformemente con pasillos de 80cm'
          ],
          correct: 3
        },
        {
          id: 'SPA-2',
          type: 'plating',
          text: 'Para un emplatado profesional, el elemento principal (proteína) generalmente va:',
          options: [
            'En el centro exacto del plato',
            'En la parte inferior del plato (más cercana al comensal)',
            'En la parte superior del plato',
            'En cualquier lugar con buena presentación'
          ],
          correct: 1
        },
        {
          id: 'SPA-3',
          type: 'kitchen_layout',
          text: 'En una cocina bien diseñada, la secuencia de estaciones es:',
          options: [
            'Servicio → Cocción → Preparación → Almacén',
            'Almacén → Preparación → Cocción → Servicio',
            'Cocción → Almacén → Servicio → Preparación',
            'Preparación → Servicio → Almacén → Cocción'
          ],
          correct: 1
        }
      ]
    },
    {
      aptitude: 'workingMemory',
      timeMinutes: 4,
      questions: [
        {
          id: 'MEM-1',
          type: 'order_recall',
          text: 'Mesa 5 ordenó: 2 tacos pastor sin cebolla, 1 enchiladas verdes extra picante, 3 aguas de jamaica. ¿Cuál es correcta?',
          options: [
            '2 tacos pastor con cebolla, 1 enchiladas rojas, 3 aguas',
            '2 tacos pastor sin cebolla, 1 enchiladas verdes picante, 3 jamaicas',
            '3 tacos pastor sin cebolla, 1 enchiladas verdes, 2 aguas',
            '2 tacos pastor, 2 enchiladas verdes, 3 aguas'
          ],
          correct: 1
        },
        {
          id: 'MEM-2',
          type: 'sequence',
          text: 'Memoriza: Mesa 3-postre, Mesa 7-cuenta, Mesa 12-bebidas, Mesa 5-pan. ¿Qué necesita Mesa 12?',
          options: ['Postre', 'Cuenta', 'Bebidas', 'Pan'],
          correct: 2
        },
        {
          id: 'MEM-3',
          type: 'ingredient_list',
          text: 'Una salsa lleva: jitomate, cebolla, ajo, cilantro, chile serrano, sal, limón. ¿Cuál NO está en la lista?',
          options: ['Cilantro', 'Comino', 'Limón', 'Chile serrano'],
          correct: 1
        }
      ]
    },
    {
      aptitude: 'processingSpeed',
      timeMinutes: 3,
      questions: [
        {
          id: 'SPD-1',
          type: 'quick_calc',
          timeSeconds: 20,
          text: 'Rápido: $340 + $215 + $89 = ?',
          options: ['$634', '$644', '$654', '$624'],
          correct: 1 // $644
        },
        {
          id: 'SPD-2',
          type: 'pattern',
          timeSeconds: 15,
          text: '¿Qué sigue? 2, 4, 8, 16, __',
          options: ['24', '28', '32', '36'],
          correct: 2 // 32
        },
        {
          id: 'SPD-3',
          type: 'comparison',
          timeSeconds: 20,
          text: 'Ordena de menor a mayor: 1/4, 0.3, 2/5, 0.15',
          options: [
            '0.15, 1/4, 0.3, 2/5',
            '1/4, 0.15, 0.3, 2/5',
            '0.15, 0.3, 1/4, 2/5',
            '2/5, 0.3, 1/4, 0.15'
          ],
          correct: 0 // 0.15, 0.25, 0.3, 0.4
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// TEST 4: VALORES LABORALES
// ═══════════════════════════════════════════════════════════════════

export const WORK_VALUES_TEST = {
  id: 'PSY-VAL-001',
  name: 'Evaluación de Valores Laborales',
  description: 'Identifica qué aspectos del trabajo son más importantes para el candidato',
  duration: '8-10 minutos',
  questionCount: 30,

  values: {
    achievement: { name: 'Logro', description: 'Deseo de alcanzar metas y superar retos' },
    independence: { name: 'Independencia', description: 'Preferencia por autonomía en el trabajo' },
    recognition: { name: 'Reconocimiento', description: 'Importancia de ser valorado y apreciado' },
    relationships: { name: 'Relaciones', description: 'Valor de las conexiones interpersonales' },
    support: { name: 'Apoyo', description: 'Necesidad de supervisión y guía' },
    workConditions: { name: 'Condiciones', description: 'Importancia del ambiente físico y horarios' },
    security: { name: 'Seguridad', description: 'Estabilidad laboral y económica' },
    variety: { name: 'Variedad', description: 'Preferencia por tareas diversas' }
  },

  questions: [
    // Ranking y preferencias
    { id: 1, type: 'ranking', text: 'Ordena de más a menos importante para ti:',
      options: ['Salario competitivo', 'Ambiente de trabajo agradable', 'Oportunidades de crecimiento', 'Horario flexible'] },
    { id: 2, type: 'choice', value: 'achievement', text: 'Prefiero un trabajo donde pueda ver resultados claros de mi esfuerzo' },
    { id: 3, type: 'choice', value: 'independence', text: 'Me gusta tomar mis propias decisiones sin consultar constantemente' },
    { id: 4, type: 'choice', value: 'recognition', text: 'Es importante para mí recibir reconocimiento público por mi trabajo' },
    { id: 5, type: 'choice', value: 'relationships', text: 'Valoro más las buenas relaciones con compañeros que un salario más alto' },
    { id: 6, type: 'choice', value: 'support', text: 'Prefiero tener un jefe que me guíe constantemente' },
    { id: 7, type: 'choice', value: 'workConditions', text: 'El ambiente físico del trabajo es muy importante para mí' },
    { id: 8, type: 'choice', value: 'security', text: 'Prefiero estabilidad aunque signifique menos oportunidades de crecimiento' },
    { id: 9, type: 'choice', value: 'variety', text: 'Me aburro si hago las mismas tareas todos los días' },
    // ... más preguntas por valor
    { id: 10, type: 'scenario', text: 'Si pudieras elegir, preferirías:',
      options: [
        { label: 'Trabajo estable con salario fijo', values: { security: 2, variety: -1 } },
        { label: 'Trabajo variable con bonos por desempeño', values: { achievement: 2, security: -1 } },
        { label: 'Trabajo flexible con proyectos diversos', values: { variety: 2, independence: 1 } },
        { label: 'Trabajo en equipo con metas grupales', values: { relationships: 2, independence: -1 } }
      ]
    }
  ],

  responseOptions: [
    { value: 1, label: 'Nada importante' },
    { value: 2, label: 'Poco importante' },
    { value: 3, label: 'Moderadamente importante' },
    { value: 4, label: 'Importante' },
    { value: 5, label: 'Muy importante' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// TEST 5: MANEJO DEL ESTRÉS Y AFRONTAMIENTO
// ═══════════════════════════════════════════════════════════════════

export const STRESS_COPING_TEST = {
  id: 'PSY-STR-001',
  name: 'Evaluación de Manejo del Estrés',
  description: 'Evalúa estrategias de afrontamiento y tolerancia al estrés',
  duration: '10-12 minutos',
  questionCount: 35,

  scales: {
    stressTolerance: {
      name: 'Tolerancia al Estrés',
      description: 'Capacidad para funcionar bajo presión'
    },
    copingStrategies: {
      name: 'Estrategias de Afrontamiento',
      subscales: {
        problemFocused: 'Enfocado en el problema',
        emotionFocused: 'Enfocado en la emoción',
        avoidance: 'Evitación'
      }
    },
    recovery: {
      name: 'Recuperación',
      description: 'Velocidad para recuperarse del estrés'
    }
  },

  scenarios: [
    {
      id: 'SCN-1',
      situation: 'Es hora pico del servicio y se acumulan 15 comandas pendientes mientras un cliente se queja de que su platillo está frío.',
      responses: [
        { text: 'Priorizo resolver la queja y delego las comandas', strategy: 'problemFocused', score: 4 },
        { text: 'Me siento abrumado pero trato de hacer todo a la vez', strategy: 'emotionFocused', score: 2 },
        { text: 'Ignoro al cliente y me enfoco en las comandas', strategy: 'avoidance', score: 1 },
        { text: 'Pido ayuda a un compañero y manejo la queja', strategy: 'problemFocused', score: 5 }
      ]
    },
    {
      id: 'SCN-2',
      situation: 'Tu jefe te critica duramente frente a tus compañeros por un error en una orden.',
      responses: [
        { text: 'Acepto la crítica y después hablo en privado con él', strategy: 'problemFocused', score: 5 },
        { text: 'Me defiendo inmediatamente frente a todos', strategy: 'emotionFocused', score: 2 },
        { text: 'Me quedo callado y guardo resentimiento', strategy: 'avoidance', score: 1 },
        { text: 'Reconozco el error y propongo una solución', strategy: 'problemFocused', score: 4 }
      ]
    },
    {
      id: 'SCN-3',
      situation: 'Un compañero renunció sin aviso y debes cubrir sus responsabilidades además de las tuyas.',
      responses: [
        { text: 'Organizo mis tareas y priorizo lo urgente', strategy: 'problemFocused', score: 5 },
        { text: 'Me quejo con los demás sobre la situación', strategy: 'emotionFocused', score: 2 },
        { text: 'Hago lo mínimo necesario para sobrevivir el día', strategy: 'avoidance', score: 1 },
        { text: 'Pido apoyo y negocio plazos realistas', strategy: 'problemFocused', score: 4 }
      ]
    },
    {
      id: 'SCN-4',
      situation: 'Un cliente VIP está insatisfecho y amenaza con escribir una mala reseña.',
      responses: [
        { text: 'Escucho su queja y ofrezco soluciones concretas', strategy: 'problemFocused', score: 5 },
        { text: 'Me pongo nervioso y no sé qué decir', strategy: 'emotionFocused', score: 1 },
        { text: 'Le paso el problema a mi supervisor', strategy: 'avoidance', score: 2 },
        { text: 'Mantengo la calma y busco compensar su experiencia', strategy: 'problemFocused', score: 4 }
      ]
    },
    {
      id: 'SCN-5',
      situation: 'Llevas 10 horas trabajando, estás agotado y aún falta 1 hora para cerrar.',
      responses: [
        { text: 'Me enfoco en lo esencial y mantengo el ritmo', strategy: 'problemFocused', score: 4 },
        { text: 'Mi rendimiento baja notablemente', strategy: 'emotionFocused', score: 2 },
        { text: 'Busco esconderme para descansar un momento', strategy: 'avoidance', score: 1 },
        { text: 'Tomo un respiro breve y retomo con energía', strategy: 'problemFocused', score: 5 }
      ]
    }
  ],

  selfReport: [
    { id: 'SR-1', text: 'Después de un día muy estresante, me cuesta relajarme', direction: 'negative', scale: 'recovery' },
    { id: 'SR-2', text: 'Busco soluciones activas cuando tengo un problema', direction: 'positive', scale: 'copingStrategies' },
    { id: 'SR-3', text: 'Trabajo mejor bajo presión que en calma', direction: 'positive', scale: 'stressTolerance' },
    { id: 'SR-4', text: 'Tiendo a postergar las situaciones difíciles', direction: 'negative', scale: 'copingStrategies' },
    { id: 'SR-5', text: 'Me recupero rápido de las situaciones estresantes', direction: 'positive', scale: 'recovery' },
    { id: 'SR-6', text: 'Pierdo la concentración cuando hay mucho ruido', direction: 'negative', scale: 'stressTolerance' },
    { id: 'SR-7', text: 'Hablo de mis problemas con personas de confianza', direction: 'positive', scale: 'copingStrategies' },
    { id: 'SR-8', text: 'Los días ocupados me energizan', direction: 'positive', scale: 'stressTolerance' },
    { id: 'SR-9', text: 'El estrés del trabajo afecta mi vida personal', direction: 'negative', scale: 'recovery' },
    { id: 'SR-10', text: 'Ante un problema, analizo las opciones antes de actuar', direction: 'positive', scale: 'copingStrategies' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// TEST 6: ORIENTACIÓN AL SERVICIO
// ═══════════════════════════════════════════════════════════════════

export const SERVICE_ORIENTATION_TEST = {
  id: 'PSY-SRV-001',
  name: 'Evaluación de Orientación al Servicio',
  description: 'Mide la disposición natural para servir y satisfacer a los clientes',
  duration: '8-10 minutos',
  questionCount: 25,

  dimensions: {
    customerFocus: 'Enfoque en el cliente',
    helpingOrientation: 'Orientación a ayudar',
    serviceResilience: 'Resiliencia en servicio',
    anticipation: 'Anticipación de necesidades',
    recovery: 'Recuperación de servicio'
  },

  questions: [
    { id: 1, dimension: 'customerFocus', text: 'Disfruto genuinamente hacer felices a los clientes', direction: 'positive' },
    { id: 2, dimension: 'customerFocus', text: 'Veo al cliente como una interrupción de mi trabajo', direction: 'negative' },
    { id: 3, dimension: 'helpingOrientation', text: 'Me ofrezco a ayudar incluso cuando no es mi responsabilidad', direction: 'positive' },
    { id: 4, dimension: 'helpingOrientation', text: 'Solo hago exactamente lo que me piden', direction: 'negative' },
    { id: 5, dimension: 'serviceResilience', text: 'Un cliente grosero no afecta mi trato con el siguiente', direction: 'positive' },
    { id: 6, dimension: 'serviceResilience', text: 'Me cuesta sonreír después de una mala experiencia', direction: 'negative' },
    { id: 7, dimension: 'anticipation', text: 'Noto cuando un cliente necesita algo antes de que lo pida', direction: 'positive' },
    { id: 8, dimension: 'anticipation', text: 'Espero a que los clientes me llamen para atenderlos', direction: 'negative' },
    { id: 9, dimension: 'recovery', text: 'Veo las quejas como oportunidades para mejorar', direction: 'positive' },
    { id: 10, dimension: 'recovery', text: 'Me pongo a la defensiva cuando hay una queja', direction: 'negative' },
    { id: 11, dimension: 'customerFocus', text: 'Recuerdo las preferencias de clientes frecuentes', direction: 'positive' },
    { id: 12, dimension: 'helpingOrientation', text: 'Busco formas de superar las expectativas', direction: 'positive' },
    { id: 13, dimension: 'serviceResilience', text: 'Mantengo mi actitud positiva todo el turno', direction: 'positive' },
    { id: 14, dimension: 'anticipation', text: 'Preparo lo que probablemente necesitarán los clientes', direction: 'positive' },
    { id: 15, dimension: 'recovery', text: 'Cuando algo sale mal, me enfoco en la solución', direction: 'positive' }
  ],

  situationalJudgment: [
    {
      id: 'SJ-1',
      situation: 'Un cliente te pide una recomendación pero parece indeciso.',
      options: [
        { text: 'Le digo cuál es el más popular y lo dejo decidir', score: 2 },
        { text: 'Le hago preguntas sobre sus preferencias para guiarlo mejor', score: 5 },
        { text: 'Le doy la carta y le doy tiempo', score: 1 },
        { text: 'Le sugiero 2-3 opciones explicando cada una', score: 4 }
      ]
    },
    {
      id: 'SJ-2',
      situation: 'Notas que la comida de un cliente se está enfriando mientras espera a su acompañante.',
      options: [
        { text: 'No digo nada, no es mi problema', score: 1 },
        { text: 'Le pregunto si desea que la mantenga caliente en cocina', score: 5 },
        { text: 'Le sugiero que empiece a comer', score: 3 },
        { text: 'Espero a que él me diga algo', score: 2 }
      ]
    },
    {
      id: 'SJ-3',
      situation: 'Un niño derrama su bebida sobre la mesa.',
      options: [
        { text: 'Limpio inmediatamente con una sonrisa tranquilizadora', score: 5 },
        { text: 'Traigo servilletas y dejo que los padres limpien', score: 2 },
        { text: 'Muestro disgusto pero limpio', score: 1 },
        { text: 'Limpio y ofrezco otra bebida sin costo', score: 4 }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// TEST 7: TRABAJO EN EQUIPO
// ═══════════════════════════════════════════════════════════════════

export const TEAMWORK_TEST = {
  id: 'PSY-TW-001',
  name: 'Evaluación de Trabajo en Equipo',
  description: 'Evalúa la capacidad y disposición para trabajar colaborativamente',
  duration: '8-10 minutos',
  questionCount: 25,

  dimensions: {
    collaboration: 'Colaboración',
    communication: 'Comunicación en equipo',
    reliability: 'Confiabilidad',
    flexibility: 'Flexibilidad',
    conflictHandling: 'Manejo de conflictos'
  },

  questions: [
    { id: 1, dimension: 'collaboration', text: 'Prefiero lograr metas como equipo que individualmente', direction: 'positive' },
    { id: 2, dimension: 'collaboration', text: 'Comparto mis conocimientos libremente con compañeros', direction: 'positive' },
    { id: 3, dimension: 'communication', text: 'Informo proactivamente sobre el estado de mis tareas', direction: 'positive' },
    { id: 4, dimension: 'communication', text: 'Me cuesta pedir ayuda cuando la necesito', direction: 'negative' },
    { id: 5, dimension: 'reliability', text: 'Mis compañeros saben que pueden contar conmigo', direction: 'positive' },
    { id: 6, dimension: 'reliability', text: 'A veces dejo tareas para que otros las terminen', direction: 'negative' },
    { id: 7, dimension: 'flexibility', text: 'Me adapto fácilmente a diferentes roles en el equipo', direction: 'positive' },
    { id: 8, dimension: 'flexibility', text: 'Me molesta cuando me piden hacer algo fuera de mis funciones', direction: 'negative' },
    { id: 9, dimension: 'conflictHandling', text: 'Abordo los desacuerdos directamente pero con respeto', direction: 'positive' },
    { id: 10, dimension: 'conflictHandling', text: 'Evito expresar opiniones diferentes para no causar problemas', direction: 'negative' },
    { id: 11, dimension: 'collaboration', text: 'Celebro los éxitos de mis compañeros', direction: 'positive' },
    { id: 12, dimension: 'communication', text: 'Escucho las ideas de todos antes de dar mi opinión', direction: 'positive' },
    { id: 13, dimension: 'reliability', text: 'Cumplo mis compromisos aunque me cueste esfuerzo extra', direction: 'positive' },
    { id: 14, dimension: 'flexibility', text: 'Acepto feedback constructivo sin ponerme a la defensiva', direction: 'positive' },
    { id: 15, dimension: 'conflictHandling', text: 'Busco soluciones donde todos ganen', direction: 'positive' }
  ],

  teamRolePreference: {
    description: 'Identifica el rol natural del candidato en equipos',
    roles: {
      coordinator: 'Coordinador - Organiza y delega',
      creator: 'Creador - Genera ideas nuevas',
      implementer: 'Implementador - Ejecuta con eficiencia',
      finisher: 'Finalizador - Asegura calidad y detalles',
      teamworker: 'Colaborador - Mantiene armonía',
      specialist: 'Especialista - Aporta conocimiento técnico'
    },
    questions: [
      {
        id: 'TR-1',
        text: 'En un proyecto nuevo, mi contribución natural es:',
        options: [
          { role: 'coordinator', text: 'Organizar al equipo y asignar tareas' },
          { role: 'creator', text: 'Proponer ideas innovadoras' },
          { role: 'implementer', text: 'Comenzar a trabajar de inmediato' },
          { role: 'finisher', text: 'Identificar posibles problemas' },
          { role: 'teamworker', text: 'Asegurar que todos estén cómodos' },
          { role: 'specialist', text: 'Aportar mi experiencia técnica' }
        ]
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// TEST 8: INTEGRIDAD
// ═══════════════════════════════════════════════════════════════════

export const INTEGRITY_TEST = {
  id: 'PSY-INT-001',
  name: 'Evaluación de Integridad',
  description: 'Evalúa honestidad, ética y confiabilidad',
  duration: '10-12 minutos',
  questionCount: 30,

  scales: {
    honesty: 'Honestidad',
    reliability: 'Confiabilidad',
    ruleAdherence: 'Adhesión a reglas',
    ethicalBehavior: 'Comportamiento ético'
  },

  questions: [
    // Honestidad
    { id: 1, scale: 'honesty', text: 'He tomado cosas pequeñas del trabajo sin permiso', direction: 'negative', sensitive: true },
    { id: 2, scale: 'honesty', text: 'Siempre digo la verdad aunque me perjudique', direction: 'positive' },
    { id: 3, scale: 'honesty', text: 'He mentido para evitar problemas en el trabajo', direction: 'negative', sensitive: true },
    { id: 4, scale: 'honesty', text: 'Devuelvo dinero si me dan cambio de más', direction: 'positive' },

    // Confiabilidad
    { id: 5, scale: 'reliability', text: 'Cumplo mis compromisos sin importar las circunstancias', direction: 'positive' },
    { id: 6, scale: 'reliability', text: 'He faltado al trabajo inventando excusas', direction: 'negative', sensitive: true },
    { id: 7, scale: 'reliability', text: 'Mis supervisores pueden confiar en que haré lo correcto', direction: 'positive' },
    { id: 8, scale: 'reliability', text: 'A veces llego tarde sin avisar', direction: 'negative' },

    // Adhesión a reglas
    { id: 9, scale: 'ruleAdherence', text: 'Las reglas deben seguirse aunque no haya supervisión', direction: 'positive' },
    { id: 10, scale: 'ruleAdherence', text: 'Algunas reglas son innecesarias y está bien ignorarlas', direction: 'negative' },
    { id: 11, scale: 'ruleAdherence', text: 'Sigo los procedimientos de seguridad alimentaria al pie de la letra', direction: 'positive' },
    { id: 12, scale: 'ruleAdherence', text: 'Si nadie se entera, no hay problema en saltarse una regla', direction: 'negative' },

    // Comportamiento ético
    { id: 13, scale: 'ethicalBehavior', text: 'Reportaría a un compañero que roba', direction: 'positive' },
    { id: 14, scale: 'ethicalBehavior', text: 'Es aceptable llevarse comida sobrante sin permiso', direction: 'negative' },
    { id: 15, scale: 'ethicalBehavior', text: 'Trato a todos los clientes con el mismo respeto', direction: 'positive' },
    { id: 16, scale: 'ethicalBehavior', text: 'He aceptado propinas que no me correspondían', direction: 'negative', sensitive: true }
  ],

  scenarios: [
    {
      id: 'INT-SCN-1',
      situation: 'Ves a un compañero tomar dinero de la caja sin registrarlo.',
      options: [
        { text: 'No digo nada, no es mi asunto', score: 1 },
        { text: 'Lo confronto directamente primero', score: 3 },
        { text: 'Lo reporto a mi supervisor', score: 5 },
        { text: 'Le pido parte del dinero para no decir nada', score: 0 }
      ]
    },
    {
      id: 'INT-SCN-2',
      situation: 'Un cliente deja una cartera olvidada con mucho efectivo.',
      options: [
        { text: 'La guardo esperando que regrese', score: 3 },
        { text: 'La entrego inmediatamente al gerente', score: 5 },
        { text: 'Reviso si hay identificación para contactarlo', score: 4 },
        { text: 'Tomo algo de efectivo antes de entregarla', score: 0 }
      ]
    },
    {
      id: 'INT-SCN-3',
      situation: 'Tu jefe te pide que mientas a un cliente sobre el tiempo de espera.',
      options: [
        { text: 'Hago lo que me pide sin cuestionar', score: 1 },
        { text: 'Le digo al cliente un tiempo realista', score: 4 },
        { text: 'Miento pero me siento incómodo', score: 2 },
        { text: 'Explico a mi jefe por qué prefiero ser honesto', score: 5 }
      ]
    }
  ],

  responseOptions: [
    { value: 1, label: 'Totalmente en desacuerdo' },
    { value: 2, label: 'En desacuerdo' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'De acuerdo' },
    { value: 5, label: 'Totalmente de acuerdo' }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// CLASE ADMINISTRADOR DE PRUEBAS
// ═══════════════════════════════════════════════════════════════════

export class PsychometricTestManager {
  constructor() {
    this.tests = {
      personality: PERSONALITY_TEST,
      emotionalIntelligence: EMOTIONAL_INTELLIGENCE_TEST,
      cognitiveAptitude: COGNITIVE_APTITUDE_TEST,
      workValues: WORK_VALUES_TEST,
      stressCoping: STRESS_COPING_TEST,
      serviceOrientation: SERVICE_ORIENTATION_TEST,
      teamwork: TEAMWORK_TEST,
      integrity: INTEGRITY_TEST
    };

    this.config = PSYCHOMETRIC_CONFIG;
  }

  /**
   * Obtiene una batería de pruebas recomendada por puesto
   */
  getRecommendedBattery(position) {
    const batteries = {
      // Puestos de servicio
      mesero: ['personality', 'emotionalIntelligence', 'serviceOrientation', 'teamwork', 'stressCoping'],
      hostess: ['personality', 'emotionalIntelligence', 'serviceOrientation', 'stressCoping'],
      capitan_meseros: ['personality', 'emotionalIntelligence', 'serviceOrientation', 'teamwork', 'stressCoping', 'integrity'],

      // Puestos de cocina
      cocinero: ['personality', 'cognitiveAptitude', 'teamwork', 'stressCoping'],
      sous_chef: ['personality', 'emotionalIntelligence', 'cognitiveAptitude', 'teamwork', 'stressCoping'],
      chef_ejecutivo: ['personality', 'emotionalIntelligence', 'cognitiveAptitude', 'teamwork', 'stressCoping', 'workValues'],

      // Bar
      bartender: ['personality', 'serviceOrientation', 'stressCoping', 'cognitiveAptitude'],

      // Gerencia
      gerente_restaurante: ['personality', 'emotionalIntelligence', 'cognitiveAptitude', 'workValues', 'stressCoping', 'integrity', 'teamwork'],

      // Administrativos
      administrativo: ['personality', 'cognitiveAptitude', 'workValues', 'integrity']
    };

    return batteries[position] || ['personality', 'emotionalIntelligence', 'stressCoping'];
  }

  /**
   * Inicia una sesión de evaluación
   */
  startSession(candidateId, testIds) {
    return {
      sessionId: `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      tests: testIds.map(id => ({
        testId: id,
        test: this.tests[id],
        status: 'pending',
        startTime: null,
        endTime: null,
        responses: [],
        score: null
      })),
      startTime: new Date().toISOString(),
      status: 'active'
    };
  }

  /**
   * Calcula puntajes de una prueba
   */
  scoreTest(testId, responses) {
    const test = this.tests[testId];
    if (!test) return { error: 'Test no encontrado' };

    switch(testId) {
      case 'personality':
        return this.scorePersonality(test, responses);
      case 'emotionalIntelligence':
        return this.scoreEmotionalIntelligence(test, responses);
      case 'cognitiveAptitude':
        return this.scoreCognitiveAptitude(test, responses);
      case 'stressCoping':
        return this.scoreStressCoping(test, responses);
      case 'serviceOrientation':
        return this.scoreServiceOrientation(test, responses);
      case 'teamwork':
        return this.scoreTeamwork(test, responses);
      case 'integrity':
        return this.scoreIntegrity(test, responses);
      default:
        return this.scoreGeneric(test, responses);
    }
  }

  scorePersonality(test, responses) {
    const factorScores = {};

    for (const factor of Object.keys(test.factors)) {
      const questions = test.questions.filter(q => q.factor === factor);
      let score = 0;

      for (const question of questions) {
        const response = responses[question.id] || 3;
        if (question.direction === 'positive') {
          score += response;
        } else {
          score += (6 - response); // Invertir para preguntas negativas
        }
      }

      factorScores[factor] = {
        raw: score,
        normalized: Math.round((score / (questions.length * 5)) * 100),
        interpretation: this.interpretPersonalityScore(score, questions.length)
      };
    }

    return {
      testId: 'personality',
      factorScores,
      dimensions: factorScores, // Alias para compatibilidad con tests
      profile: this.generatePersonalityProfile(factorScores),
      timestamp: new Date().toISOString()
    };
  }

  interpretPersonalityScore(score, questionCount) {
    const maxScore = questionCount * 5;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 85) return 'Muy alto';
    if (percentage >= 70) return 'Alto';
    if (percentage >= 50) return 'Promedio';
    if (percentage >= 30) return 'Bajo';
    return 'Muy bajo';
  }

  generatePersonalityProfile(factorScores) {
    const profile = [];

    for (const [factor, data] of Object.entries(factorScores)) {
      profile.push({
        factor,
        score: data.normalized,
        interpretation: data.interpretation,
        implications: this.getPersonalityImplications(factor, data.normalized)
      });
    }

    return profile;
  }

  getPersonalityImplications(factor, score) {
    const implications = {
      openness: {
        high: 'Excelente para roles creativos y desarrollo de menús',
        low: 'Mejor para roles con procedimientos establecidos'
      },
      conscientiousness: {
        high: 'Confiable y organizado, ideal para cualquier puesto',
        low: 'Puede necesitar supervisión adicional'
      },
      extraversion: {
        high: 'Excelente para servicio al cliente y liderazgo',
        low: 'Mejor para roles de back-of-house'
      },
      agreeableness: {
        high: 'Trabaja bien en equipo, buena atención al cliente',
        low: 'Puede tener dificultades con clientes difíciles'
      },
      neuroticism: {
        high: 'Puede necesitar apoyo en manejo del estrés',
        low: 'Excelente estabilidad emocional bajo presión'
      }
    };

    return score >= 60 ? implications[factor]?.high : implications[factor]?.low;
  }

  scoreEmotionalIntelligence(test, responses) {
    const dimensionScores = {};

    for (const dimension of Object.keys(test.dimensions)) {
      const questions = test.questions.filter(q => q.dimension === dimension);
      let score = 0;

      for (const question of questions) {
        const response = responses[question.id] || 3;
        if (question.direction === 'positive') {
          score += response;
        } else {
          score += (6 - response);
        }
      }

      dimensionScores[dimension] = {
        raw: score,
        normalized: Math.round((score / (questions.length * 5)) * 100),
        label: test.dimensions[dimension].name
      };
    }

    const totalEI = Object.values(dimensionScores).reduce((sum, d) => sum + d.normalized, 0) / 5;

    return {
      testId: 'emotionalIntelligence',
      dimensionScores,
      totalEI: Math.round(totalEI),
      interpretation: this.interpretEIScore(totalEI),
      timestamp: new Date().toISOString()
    };
  }

  interpretEIScore(score) {
    if (score >= 85) return { level: 'Superior', recommendation: 'Excelente para roles de liderazgo y servicio' };
    if (score >= 70) return { level: 'Alto', recommendation: 'Buena capacidad de manejo emocional' };
    if (score >= 55) return { level: 'Promedio', recommendation: 'Competencia emocional adecuada' };
    if (score >= 40) return { level: 'Bajo', recommendation: 'Puede beneficiarse de desarrollo emocional' };
    return { level: 'Muy bajo', recommendation: 'Se recomienda evaluación adicional' };
  }

  scoreCognitiveAptitude(test, responses) {
    const aptitudeScores = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const section of test.sections) {
      let correct = 0;
      for (const question of section.questions) {
        if (responses[question.id] === question.correct) {
          correct++;
          totalCorrect++;
        }
        totalQuestions++;
      }

      aptitudeScores[section.aptitude] = {
        correct,
        total: section.questions.length,
        percentage: Math.round((correct / section.questions.length) * 100),
        label: test.aptitudes[section.aptitude].name
      };
    }

    return {
      testId: 'cognitiveAptitude',
      aptitudeScores,
      overallScore: Math.round((totalCorrect / totalQuestions) * 100),
      interpretation: this.interpretCognitiveScore(totalCorrect, totalQuestions),
      timestamp: new Date().toISOString()
    };
  }

  interpretCognitiveScore(correct, total) {
    const percentage = (correct / total) * 100;
    if (percentage >= 85) return 'Superior - Excelente capacidad cognitiva';
    if (percentage >= 70) return 'Alto - Buena capacidad de aprendizaje';
    if (percentage >= 55) return 'Promedio - Capacidad adecuada';
    if (percentage >= 40) return 'Bajo promedio - Puede requerir capacitación adicional';
    return 'Bajo - Se recomienda evaluación adicional';
  }

  scoreStressCoping(test, responses) {
    // Escenarios
    let scenarioScore = 0;
    const strategies = { problemFocused: 0, emotionFocused: 0, avoidance: 0 };

    for (const scenario of test.scenarios) {
      const responseIndex = responses[scenario.id];
      if (responseIndex !== undefined && scenario.responses[responseIndex]) {
        const response = scenario.responses[responseIndex];
        scenarioScore += response.score;
        strategies[response.strategy]++;
      }
    }

    // Self-report
    const scaleScores = { stressTolerance: 0, recovery: 0, copingStrategies: 0 };
    let scaleQuestionCount = { stressTolerance: 0, recovery: 0, copingStrategies: 0 };

    for (const item of test.selfReport) {
      const response = responses[item.id] || 3;
      let score = item.direction === 'positive' ? response : (6 - response);
      scaleScores[item.scale] += score;
      scaleQuestionCount[item.scale]++;
    }

    // Normalizar
    for (const scale of Object.keys(scaleScores)) {
      scaleScores[scale] = Math.round((scaleScores[scale] / (scaleQuestionCount[scale] * 5)) * 100);
    }

    return {
      testId: 'stressCoping',
      scenarioScore: Math.round((scenarioScore / (test.scenarios.length * 5)) * 100),
      dominantStrategy: Object.entries(strategies).sort((a, b) => b[1] - a[1])[0][0],
      strategies,
      scaleScores,
      overallCoping: Math.round((scaleScores.stressTolerance + scaleScores.recovery + scaleScores.copingStrategies) / 3),
      timestamp: new Date().toISOString()
    };
  }

  scoreServiceOrientation(test, responses) {
    const dimensionScores = {};

    for (const dimension of Object.keys(test.dimensions)) {
      const questions = test.questions.filter(q => q.dimension === dimension);
      let score = 0;

      for (const question of questions) {
        const response = responses[question.id] || 3;
        if (question.direction === 'positive') {
          score += response;
        } else {
          score += (6 - response);
        }
      }

      dimensionScores[dimension] = {
        raw: score,
        normalized: Math.round((score / (questions.length * 5)) * 100)
      };
    }

    // Situational Judgment
    let sjScore = 0;
    for (const sj of test.situationalJudgment) {
      const responseIndex = responses[sj.id];
      if (responseIndex !== undefined && sj.options[responseIndex]) {
        sjScore += sj.options[responseIndex].score;
      }
    }

    const totalScore = Object.values(dimensionScores).reduce((sum, d) => sum + d.normalized, 0) / Object.keys(dimensionScores).length;

    return {
      testId: 'serviceOrientation',
      dimensionScores,
      situationalJudgmentScore: Math.round((sjScore / (test.situationalJudgment.length * 5)) * 100),
      overallServiceOrientation: Math.round((totalScore * 0.7) + (sjScore / (test.situationalJudgment.length * 5)) * 30),
      recommendation: this.getServiceRecommendation(totalScore),
      timestamp: new Date().toISOString()
    };
  }

  getServiceRecommendation(score) {
    if (score >= 85) return 'Excelente orientación al servicio - Ideal para posiciones de contacto directo con cliente';
    if (score >= 70) return 'Buena orientación al servicio - Apto para la mayoría de roles de servicio';
    if (score >= 55) return 'Orientación al servicio promedio - Considerar capacitación adicional';
    return 'Baja orientación al servicio - Mejor para roles sin contacto directo con clientes';
  }

  scoreTeamwork(test, responses) {
    const dimensionScores = {};

    for (const dimension of Object.keys(test.dimensions)) {
      const questions = test.questions.filter(q => q.dimension === dimension);
      let score = 0;

      for (const question of questions) {
        const response = responses[question.id] || 3;
        if (question.direction === 'positive') {
          score += response;
        } else {
          score += (6 - response);
        }
      }

      dimensionScores[dimension] = {
        raw: score,
        normalized: Math.round((score / (questions.length * 5)) * 100),
        label: test.dimensions[dimension]
      };
    }

    const totalScore = Object.values(dimensionScores).reduce((sum, d) => sum + d.normalized, 0) / Object.keys(dimensionScores).length;

    return {
      testId: 'teamwork',
      dimensionScores,
      overallTeamwork: Math.round(totalScore),
      teamRole: this.determineTeamRole(responses, test),
      timestamp: new Date().toISOString()
    };
  }

  determineTeamRole(responses, test) {
    // Simplified team role determination
    const roles = test.teamRolePreference?.roles || {};
    return Object.keys(roles)[0] || 'collaborator';
  }

  scoreIntegrity(test, responses) {
    const scaleScores = {};

    for (const scale of Object.keys(test.scales)) {
      const questions = test.questions.filter(q => q.scale === scale);
      let score = 0;

      for (const question of questions) {
        const response = responses[question.id] || 3;
        if (question.direction === 'positive') {
          score += response;
        } else {
          score += (6 - response);
        }
      }

      scaleScores[scale] = {
        raw: score,
        normalized: Math.round((score / (questions.length * 5)) * 100),
        label: test.scales[scale]
      };
    }

    // Escenarios
    let scenarioScore = 0;
    for (const scenario of test.scenarios) {
      const responseIndex = responses[scenario.id];
      if (responseIndex !== undefined && scenario.options[responseIndex]) {
        scenarioScore += scenario.options[responseIndex].score;
      }
    }

    const totalScore = Object.values(scaleScores).reduce((sum, s) => sum + s.normalized, 0) / Object.keys(scaleScores).length;

    return {
      testId: 'integrity',
      scaleScores,
      scenarioScore: Math.round((scenarioScore / (test.scenarios.length * 5)) * 100),
      overallIntegrity: Math.round((totalScore * 0.6) + (scenarioScore / (test.scenarios.length * 5)) * 40),
      riskLevel: this.assessIntegrityRisk(totalScore, scenarioScore, test.scenarios.length),
      timestamp: new Date().toISOString()
    };
  }

  assessIntegrityRisk(score, scenarioScore, scenarioCount) {
    const combined = (score * 0.6) + ((scenarioScore / (scenarioCount * 5)) * 40);

    if (combined >= 80) return { level: 'Bajo', description: 'Alta integridad, bajo riesgo' };
    if (combined >= 60) return { level: 'Moderado', description: 'Integridad aceptable, monitorear' };
    if (combined >= 40) return { level: 'Elevado', description: 'Riesgo moderado, requiere verificación adicional' };
    return { level: 'Alto', description: 'Riesgo significativo, se recomienda no contratar sin verificación exhaustiva' };
  }

  scoreGeneric(test, responses) {
    let totalScore = 0;
    let maxScore = 0;

    for (const question of test.questions || []) {
      const response = responses[question.id] || 3;
      totalScore += question.direction === 'positive' ? response : (6 - response);
      maxScore += 5;
    }

    return {
      testId: test.id,
      rawScore: totalScore,
      normalizedScore: Math.round((totalScore / maxScore) * 100),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Genera reporte completo de batería
   */
  generateBatteryReport(candidateId, testResults) {
    const report = {
      reportId: `RPT-${Date.now()}`,
      candidateId,
      generatedAt: new Date().toISOString(),
      tests: [],
      summary: {
        testsCompleted: testResults.length,
        overallProfile: {},
        strengths: [],
        developmentAreas: [],
        recommendations: []
      }
    };

    for (const result of testResults) {
      report.tests.push({
        testName: this.tests[result.testId]?.name || result.testId,
        scores: result
      });

      // Agregar al perfil general
      this.addToOverallProfile(report.summary, result);
    }

    // Identificar fortalezas y áreas de desarrollo
    this.identifyStrengthsAndGaps(report.summary);

    return report;
  }

  addToOverallProfile(summary, result) {
    switch(result.testId) {
      case 'personality':
        summary.overallProfile.personality = result.factorScores;
        break;
      case 'emotionalIntelligence':
        summary.overallProfile.emotionalIntelligence = result.totalEI;
        break;
      case 'cognitiveAptitude':
        summary.overallProfile.cognitiveAptitude = result.overallScore;
        break;
      case 'stressCoping':
        summary.overallProfile.stressCoping = result.overallCoping;
        break;
      case 'serviceOrientation':
        summary.overallProfile.serviceOrientation = result.overallServiceOrientation;
        break;
      case 'teamwork':
        summary.overallProfile.teamwork = result.overallTeamwork;
        break;
      case 'integrity':
        summary.overallProfile.integrity = result.overallIntegrity;
        break;
    }
  }

  identifyStrengthsAndGaps(summary) {
    const profile = summary.overallProfile;

    for (const [area, score] of Object.entries(profile)) {
      if (typeof score === 'number') {
        if (score >= 75) {
          summary.strengths.push({ area, score, description: `Alto desempeño en ${area}` });
        } else if (score < 50) {
          summary.developmentAreas.push({ area, score, description: `Área de mejora: ${area}` });
        }
      }
    }

    // Generar recomendaciones
    if (summary.developmentAreas.length === 0) {
      summary.recommendations.push('Perfil sólido, candidato recomendado para avanzar en el proceso');
    } else {
      for (const area of summary.developmentAreas) {
        summary.recommendations.push(`Considerar capacitación en ${area.area} si se contrata`);
      }
    }
  }
}

// Instancia exportada
export const psychometricTestManager = new PsychometricTestManager();

export default {
  PERSONALITY_TEST,
  EMOTIONAL_INTELLIGENCE_TEST,
  COGNITIVE_APTITUDE_TEST,
  WORK_VALUES_TEST,
  STRESS_COPING_TEST,
  SERVICE_ORIENTATION_TEST,
  TEAMWORK_TEST,
  INTEGRITY_TEST,
  PsychometricTestManager,
  psychometricTestManager
};
