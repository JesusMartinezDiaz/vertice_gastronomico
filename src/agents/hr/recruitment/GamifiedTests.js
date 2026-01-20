/**
 * SISTEMA DE PRUEBAS GAMIFICADAS
 * Vértice Gastronómico - Evaluaciones Interactivas y Gamificadas
 *
 * Pruebas diseñadas como juegos y simulaciones para evaluar
 * competencias de manera más natural y menos estresante.
 *
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE GAMIFICACIÓN
// ═══════════════════════════════════════════════════════════════════

export const GAMIFICATION_CONFIG = {
  pointsSystem: {
    correct_answer: 100,
    speed_bonus: 50,
    streak_bonus: 25,
    perfect_round: 200,
    completion_bonus: 150
  },
  levels: [
    { level: 1, name: 'Aprendiz', minPoints: 0 },
    { level: 2, name: 'Asistente', minPoints: 500 },
    { level: 3, name: 'Cocinero', minPoints: 1500 },
    { level: 4, name: 'Chef de Partida', minPoints: 3000 },
    { level: 5, name: 'Sous Chef', minPoints: 5000 },
    { level: 6, name: 'Chef Ejecutivo', minPoints: 8000 },
    { level: 7, name: 'Chef Maestro', minPoints: 12000 }
  ],
  badges: {
    quick_thinker: { name: 'Pensador Veloz', description: 'Responder 10 preguntas en menos de 5 segundos cada una' },
    perfectionist: { name: 'Perfeccionista', description: 'Completar una ronda sin errores' },
    problem_solver: { name: 'Solucionador', description: 'Resolver 5 escenarios difíciles correctamente' },
    team_player: { name: 'Jugador de Equipo', description: 'Excelente puntuación en trabajo colaborativo' },
    crisis_manager: { name: 'Gestor de Crisis', description: 'Manejar exitosamente 3 escenarios de crisis' },
    service_star: { name: 'Estrella del Servicio', description: 'Puntuación perfecta en atención al cliente' }
  }
};

// ═══════════════════════════════════════════════════════════════════
// JUEGO 1: SIMULADOR DE COCINA (Kitchen Rush)
// ═══════════════════════════════════════════════════════════════════

export const KITCHEN_RUSH_GAME = {
  id: 'kitchen_rush',
  name: 'Kitchen Rush - Simulador de Cocina',
  description: 'Gestiona una cocina durante el servicio. Toma decisiones rápidas bajo presión.',
  duration: '15-20 minutos',
  evaluates: ['toma_decisiones', 'trabajo_bajo_presion', 'priorización', 'organización'],

  scenarios: [
    {
      id: 'kr_01',
      title: 'Servicio de Mediodía',
      situation: 'Son las 13:00 y tienes 15 comandas pendientes. El horno principal acaba de fallar.',
      time_limit: 30, // segundos
      options: [
        {
          id: 'a',
          text: 'Informar inmediatamente al chef ejecutivo y detener nuevas comandas',
          points: 80,
          feedback: 'Buena comunicación pero puede causar pánico innecesario',
          competencies: { comunicación: 4, liderazgo: 3 }
        },
        {
          id: 'b',
          text: 'Redistribuir los platillos entre otros equipos y usar el horno de respaldo',
          points: 100,
          feedback: 'Excelente resolución de problemas manteniendo el servicio',
          competencies: { resolución_problemas: 5, adaptabilidad: 5 }
        },
        {
          id: 'c',
          text: 'Priorizar las comandas más antiguas y avisar a sala sobre demoras',
          points: 85,
          feedback: 'Buena priorización pero falta resolver el problema de fondo',
          competencies: { organización: 4, comunicación: 4 }
        },
        {
          id: 'd',
          text: 'Intentar reparar el horno mientras el equipo continúa',
          points: 40,
          feedback: 'Riesgo de seguridad y pérdida de supervisión del equipo',
          competencies: { resolución_problemas: 2, liderazgo: 1 }
        }
      ]
    },
    {
      id: 'kr_02',
      title: 'Ingrediente Agotado',
      situation: 'El platillo estrella requiere salmón fresco y acaba de terminarse. Hay 8 pedidos pendientes.',
      time_limit: 25,
      options: [
        {
          id: 'a',
          text: 'Ofrecer sustitución con otro pescado similar sin cargo extra',
          points: 95,
          feedback: 'Excelente manejo del cliente y flexibilidad',
          competencies: { servicio_cliente: 5, creatividad: 4 }
        },
        {
          id: 'b',
          text: 'Informar que el platillo no está disponible y ofrecer alternativas',
          points: 85,
          feedback: 'Honesto pero puede decepcionar clientes',
          competencies: { comunicación: 4, integridad: 5 }
        },
        {
          id: 'c',
          text: 'Enviar a alguien a comprar más salmón urgentemente',
          points: 60,
          feedback: 'Solución a largo plazo pero no resuelve pedidos inmediatos',
          competencies: { planificación: 3, iniciativa: 4 }
        },
        {
          id: 'd',
          text: 'Usar el salmón de la cena de mañana',
          points: 70,
          feedback: 'Resuelve el problema pero crea otro para mañana',
          competencies: { resolución_problemas: 3, planificación: 2 }
        }
      ]
    },
    {
      id: 'kr_03',
      title: 'Conflicto en Cocina',
      situation: 'Dos cocineros discuten acaloradamente sobre quién olvidó salar la pasta. El servicio está en curso.',
      time_limit: 20,
      options: [
        {
          id: 'a',
          text: 'Intervenir inmediatamente, separarlos y resolver después del servicio',
          points: 100,
          feedback: 'Prioriza correctamente el servicio y el ambiente laboral',
          competencies: { liderazgo: 5, manejo_conflictos: 5 }
        },
        {
          id: 'b',
          text: 'Ignorar el conflicto y enfocarse en la comida',
          points: 40,
          feedback: 'El conflicto puede escalar y afectar la calidad',
          competencies: { liderazgo: 1, manejo_conflictos: 1 }
        },
        {
          id: 'c',
          text: 'Determinar quién tuvo la culpa y reprenderlo públicamente',
          points: 30,
          feedback: 'Daña la moral del equipo y no resuelve el problema de fondo',
          competencies: { liderazgo: 1, inteligencia_emocional: 1 }
        },
        {
          id: 'd',
          text: 'Pedir a ambos que se disculpen mutuamente ahora mismo',
          points: 55,
          feedback: 'Intento de resolución pero puede parecer forzado',
          competencies: { liderazgo: 3, manejo_conflictos: 2 }
        }
      ]
    },
    {
      id: 'kr_04',
      title: 'Cliente VIP',
      situation: 'Un crítico gastronómico reconocido acaba de llegar sin reservación. El restaurante está lleno.',
      time_limit: 25,
      options: [
        {
          id: 'a',
          text: 'Preparar una mesa improvisada y alertar a cocina para servicio impecable',
          points: 100,
          feedback: 'Excelente manejo de la situación y oportunidad',
          competencies: { servicio_cliente: 5, iniciativa: 5 }
        },
        {
          id: 'b',
          text: 'Tratarlo como cualquier otro cliente sin reservación',
          points: 60,
          feedback: 'Justo pero puede ser una oportunidad perdida',
          competencies: { integridad: 4, servicio_cliente: 2 }
        },
        {
          id: 'c',
          text: 'Ofrecer bebida en el bar mientras espera una mesa',
          points: 85,
          feedback: 'Buena opción intermedia con atención especial',
          competencies: { servicio_cliente: 4, creatividad: 4 }
        },
        {
          id: 'd',
          text: 'Mover a otros clientes para acomodarlo inmediatamente',
          points: 35,
          feedback: 'Injusto con otros clientes y puede crear mala imagen',
          competencies: { integridad: 1, servicio_cliente: 2 }
        }
      ]
    },
    {
      id: 'kr_05',
      title: 'Emergencia Sanitaria',
      situation: 'Un cocinero se cortó profundamente. Hay sangre cerca de área de preparación.',
      time_limit: 15,
      options: [
        {
          id: 'a',
          text: 'Atender la herida, descartar alimentos contaminados, desinfectar área',
          points: 100,
          feedback: 'Respuesta perfecta: seguridad primero, después higiene',
          competencies: { seguridad: 5, protocolo: 5 }
        },
        {
          id: 'b',
          text: 'Llamar a emergencias inmediatamente',
          points: 70,
          feedback: 'Puede ser excesivo para un corte, pero prioriza seguridad',
          competencies: { seguridad: 4, calma: 2 }
        },
        {
          id: 'c',
          text: 'Enviar al cocinero a limpiarse y continuar el servicio',
          points: 20,
          feedback: 'Peligroso: ignora contaminación y bienestar del empleado',
          competencies: { seguridad: 1, protocolo: 1 }
        },
        {
          id: 'd',
          text: 'Detener todo el servicio hasta desinfectar completamente',
          points: 65,
          feedback: 'Exagerado pero demuestra compromiso con higiene',
          competencies: { seguridad: 4, criterio: 2 }
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// JUEGO 2: SERVICE MASTER (Simulador de Servicio)
// ═══════════════════════════════════════════════════════════════════

export const SERVICE_MASTER_GAME = {
  id: 'service_master',
  name: 'Service Master - Excelencia en Atención',
  description: 'Maneja diversas situaciones de servicio al cliente en un restaurante de alta categoría.',
  duration: '12-15 minutos',
  evaluates: ['servicio_cliente', 'comunicación', 'resolución_conflictos', 'etiqueta'],

  scenarios: [
    {
      id: 'sm_01',
      title: 'Queja por Temperatura',
      situation: 'Un cliente dice que su filete está frío, pero acaba de salir de cocina hace 2 minutos.',
      time_limit: 20,
      options: [
        {
          id: 'a',
          text: 'Disculparse sinceramente y ofrecer calentarlo o preparar uno nuevo',
          points: 100,
          feedback: 'El cliente siempre tiene razón en su percepción',
          competencies: { servicio_cliente: 5, humildad: 5 }
        },
        {
          id: 'b',
          text: 'Explicar educadamente que acaba de salir de cocina',
          points: 45,
          feedback: 'Defensivo y no resuelve la insatisfacción del cliente',
          competencies: { servicio_cliente: 2, comunicación: 3 }
        },
        {
          id: 'c',
          text: 'Ofrecer cambiar el platillo por otro que le guste más',
          points: 85,
          feedback: 'Buena alternativa aunque no resuelve el problema original',
          competencies: { servicio_cliente: 4, flexibilidad: 4 }
        },
        {
          id: 'd',
          text: 'Traer al chef para explicar la temperatura correcta',
          points: 30,
          feedback: 'Puede humillar al cliente y escalar el conflicto',
          competencies: { servicio_cliente: 1, criterio: 1 }
        }
      ]
    },
    {
      id: 'sm_02',
      title: 'Alergia Alimentaria',
      situation: 'Un cliente menciona después de ordenar que es alérgico al maní. Su platillo lleva aceite de maní.',
      time_limit: 15,
      options: [
        {
          id: 'a',
          text: 'Informar inmediatamente y ofrecer alternativas seguras sin cargo',
          points: 100,
          feedback: 'Prioridad a la seguridad con excelente servicio',
          competencies: { seguridad: 5, servicio_cliente: 5 }
        },
        {
          id: 'b',
          text: 'Preguntar qué tan severa es la alergia',
          points: 50,
          feedback: 'Cualquier alergia debe tomarse en serio',
          competencies: { seguridad: 2, criterio: 2 }
        },
        {
          id: 'c',
          text: 'Decir que el aceite de maní procesado no causa reacción',
          points: 10,
          feedback: 'Peligroso y potencialmente falso',
          competencies: { seguridad: 0, integridad: 0 }
        },
        {
          id: 'd',
          text: 'Verificar con cocina y ofrecer modificar o cambiar el platillo',
          points: 90,
          feedback: 'Buen proceso aunque debería ser más proactivo',
          competencies: { seguridad: 4, protocolo: 4 }
        }
      ]
    },
    {
      id: 'sm_03',
      title: 'Mesa Ruidosa',
      situation: 'Una mesa celebra un cumpleaños muy ruidosamente. Otras mesas se quejan.',
      time_limit: 25,
      options: [
        {
          id: 'a',
          text: 'Acercarse amablemente y pedir bajar el volumen, ofreciendo área privada',
          points: 100,
          feedback: 'Equilibra las necesidades de todos los clientes',
          competencies: { servicio_cliente: 5, diplomacia: 5 }
        },
        {
          id: 'b',
          text: 'Ignorar las quejas, es una celebración especial',
          points: 30,
          feedback: 'Descuida a los otros clientes',
          competencies: { servicio_cliente: 2, criterio: 1 }
        },
        {
          id: 'c',
          text: 'Pedir firmemente que se comporten o tendrán que irse',
          points: 40,
          feedback: 'Demasiado agresivo, puede crear conflicto',
          competencies: { servicio_cliente: 2, diplomacia: 1 }
        },
        {
          id: 'd',
          text: 'Ofrecer cortesía (postre gratis) para distraer y calmar el ánimo',
          points: 75,
          feedback: 'Creativo pero no resuelve el problema de ruido',
          competencies: { creatividad: 4, servicio_cliente: 3 }
        }
      ]
    },
    {
      id: 'sm_04',
      title: 'Propina Insuficiente',
      situation: 'Después de un servicio excelente, una mesa grande deja solo 5% de propina.',
      time_limit: 20,
      options: [
        {
          id: 'a',
          text: 'Agradecer y despedir cordialmente como siempre',
          points: 100,
          feedback: 'Profesionalismo ejemplar, la propina es voluntaria',
          competencies: { profesionalismo: 5, integridad: 5 }
        },
        {
          id: 'b',
          text: 'Preguntar educadamente si hubo algún problema con el servicio',
          points: 70,
          feedback: 'Puede ser incómodo pero busca retroalimentación',
          competencies: { profesionalismo: 3, iniciativa: 4 }
        },
        {
          id: 'c',
          text: 'Mencionar que la propina sugerida es 15-20%',
          points: 25,
          feedback: 'Inapropiado y puede parecer codicioso',
          competencies: { profesionalismo: 1, integridad: 1 }
        },
        {
          id: 'd',
          text: 'Comentarlo con colegas en voz baja',
          points: 35,
          feedback: 'Poco profesional y puede afectar el ambiente',
          competencies: { profesionalismo: 1, trabajo_equipo: 2 }
        }
      ]
    },
    {
      id: 'sm_05',
      title: 'Cita Romántica',
      situation: 'Un cliente nervioso te pide ayuda para proponer matrimonio durante la cena.',
      time_limit: 25,
      options: [
        {
          id: 'a',
          text: 'Coordinar con cocina, música y servicio para crear momento perfecto',
          points: 100,
          feedback: 'Servicio excepcional que crea experiencia memorable',
          competencies: { servicio_cliente: 5, creatividad: 5 }
        },
        {
          id: 'b',
          text: 'Ofrecer ayuda básica con el anillo en el postre',
          points: 75,
          feedback: 'Ayuda pero pierde oportunidad de crear magia',
          competencies: { servicio_cliente: 3, iniciativa: 3 }
        },
        {
          id: 'c',
          text: 'Sugerir que contrate un servicio especializado',
          points: 40,
          feedback: 'Rechaza una oportunidad de brindar servicio especial',
          competencies: { servicio_cliente: 2, iniciativa: 1 }
        },
        {
          id: 'd',
          text: 'Declinar para no interferir en momento personal',
          points: 50,
          feedback: 'Respetuoso pero pierde la oportunidad de servir',
          competencies: { servicio_cliente: 2, criterio: 3 }
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// JUEGO 3: INVENTORY QUEST (Gestión de Inventario)
// ═══════════════════════════════════════════════════════════════════

export const INVENTORY_QUEST_GAME = {
  id: 'inventory_quest',
  name: 'Inventory Quest - Maestro de Almacén',
  description: 'Gestiona el inventario de un restaurante optimizando costos y evitando desperdicios.',
  duration: '10-12 minutos',
  evaluates: ['organización', 'matemáticas', 'análisis', 'planificación'],

  challenges: [
    {
      id: 'iq_01',
      type: 'calculation',
      title: 'Cálculo de Food Cost',
      question: 'Un platillo usa: carne ($80), verduras ($15), especias ($5). Se vende en $350. ¿Cuál es el food cost?',
      options: [
        { id: 'a', text: '28.57%', correct: true, points: 100 },
        { id: 'b', text: '35%', correct: false, points: 0 },
        { id: 'c', text: '25%', correct: false, points: 0 },
        { id: 'd', text: '30%', correct: false, points: 0 }
      ],
      explanation: 'Food cost = (80+15+5)/350 × 100 = 28.57%'
    },
    {
      id: 'iq_02',
      type: 'decision',
      title: 'Producto por Vencer',
      question: 'Tienes 10kg de camarón que vence mañana. Normalmente vendes 3kg diarios.',
      options: [
        {
          id: 'a',
          text: 'Crear especial del día con camarón para mover inventario',
          correct: true,
          points: 100,
          feedback: 'Excelente: minimiza pérdida y puede generar ventas extra'
        },
        {
          id: 'b',
          text: 'Congelar todo para usarlo después',
          correct: false,
          points: 40,
          feedback: 'El camarón fresco pierde calidad al congelarse'
        },
        {
          id: 'c',
          text: 'Descartar lo que sobre mañana',
          correct: false,
          points: 20,
          feedback: 'Desperdicio innecesario de dinero'
        },
        {
          id: 'd',
          text: 'Venderlo a otro restaurante con descuento',
          correct: false,
          points: 60,
          feedback: 'Opción válida pero pierde oportunidad de venta propia'
        }
      ]
    },
    {
      id: 'iq_03',
      type: 'ordering',
      title: 'Orden de Rotación FIFO',
      question: 'Llegaron productos nuevos. ¿Cómo deben organizarse en el almacén?',
      correct_order: ['Productos nuevos atrás', 'Productos existentes adelante', 'Revisar fechas de vencimiento', 'Actualizar inventario'],
      points_per_correct: 25,
      max_points: 100
    },
    {
      id: 'iq_04',
      type: 'calculation',
      title: 'Punto de Reorden',
      question: 'Usas 5kg de harina diario. El proveedor tarda 3 días. Stock de seguridad: 5kg. ¿Cuándo reordenar?',
      options: [
        { id: 'a', text: 'Cuando queden 20kg', correct: true, points: 100 },
        { id: 'b', text: 'Cuando queden 15kg', correct: false, points: 50 },
        { id: 'c', text: 'Cuando queden 10kg', correct: false, points: 25 },
        { id: 'd', text: 'Cuando queden 5kg', correct: false, points: 0 }
      ],
      explanation: 'Punto de reorden = (Consumo diario × Días entrega) + Stock seguridad = (5×3)+5 = 20kg'
    },
    {
      id: 'iq_05',
      type: 'analysis',
      title: 'Análisis de Merma',
      question: 'La merma de verduras subió del 5% al 15% este mes. ¿Qué investigar primero?',
      options: [
        {
          id: 'a',
          text: 'Calidad del producto del proveedor',
          points: 80,
          feedback: 'Importante pero no el único factor'
        },
        {
          id: 'b',
          text: 'Proceso de almacenamiento y temperaturas',
          points: 100,
          feedback: 'Correcto: el almacenamiento incorrecto es la causa más común'
        },
        {
          id: 'c',
          text: 'Posible robo del personal',
          points: 30,
          feedback: 'Poco probable como primera causa'
        },
        {
          id: 'd',
          text: 'Errores en el conteo de inventario',
          points: 60,
          feedback: 'Posible pero la merma física es más probable'
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// JUEGO 4: TEAM BUILDER (Trabajo en Equipo)
// ═══════════════════════════════════════════════════════════════════

export const TEAM_BUILDER_GAME = {
  id: 'team_builder',
  name: 'Team Builder - Dinámica de Equipo',
  description: 'Evalúa tu capacidad de trabajar en equipo y liderar grupos diversos.',
  duration: '15 minutos',
  evaluates: ['trabajo_equipo', 'liderazgo', 'comunicación', 'empatía'],

  scenarios: [
    {
      id: 'tb_01',
      title: 'Nuevo Integrante',
      situation: 'Un nuevo cocinero de 18 años, sin experiencia, se une a tu equipo durante un servicio ocupado.',
      options: [
        {
          id: 'a',
          text: 'Asignarle tareas simples y supervisarlo de cerca',
          points: 100,
          feedback: 'Equilibra productividad con aprendizaje seguro',
          traits: { mentorship: 5, pragmatismo: 5 }
        },
        {
          id: 'b',
          text: 'Pedirle que observe hoy y empiece mañana',
          points: 60,
          feedback: 'Seguro pero pierde oportunidad de integración',
          traits: { mentorship: 3, pragmatismo: 3 }
        },
        {
          id: 'c',
          text: 'Tratarlo igual que al resto del equipo',
          points: 40,
          feedback: 'Puede abrumarlo y causar errores',
          traits: { mentorship: 2, pragmatismo: 1 }
        },
        {
          id: 'd',
          text: 'Asignarle tareas de limpieza para que no estorbe',
          points: 25,
          feedback: 'Desperdicia talento y desmotiva',
          traits: { mentorship: 1, pragmatismo: 2 }
        }
      ]
    },
    {
      id: 'tb_02',
      title: 'Compañero con Problemas',
      situation: 'Notas que un colega experimentado está cometiendo errores inusuales. Parece distraído y triste.',
      options: [
        {
          id: 'a',
          text: 'Acercarte en privado para preguntar si está bien',
          points: 100,
          feedback: 'Muestra empatía y compañerismo genuino',
          traits: { empatia: 5, comunicación: 5 }
        },
        {
          id: 'b',
          text: 'Reportarlo al supervisor por los errores',
          points: 30,
          feedback: 'Puede empeorar su situación sin ayudar',
          traits: { empatia: 1, comunicación: 2 }
        },
        {
          id: 'c',
          text: 'Ayudarlo silenciosamente cubriendo sus errores',
          points: 65,
          feedback: 'Bien intencionado pero no resuelve el problema',
          traits: { empatia: 4, comunicación: 2 }
        },
        {
          id: 'd',
          text: 'Enfocarte en tu trabajo y no meterte',
          points: 20,
          feedback: 'Individualista, falta de compañerismo',
          traits: { empatia: 1, comunicación: 1 }
        }
      ]
    },
    {
      id: 'tb_03',
      title: 'Distribución de Crédito',
      situation: 'Tu equipo creó un platillo exitoso. El chef ejecutivo pregunta quién tuvo la idea.',
      options: [
        {
          id: 'a',
          text: 'Explicar que fue un esfuerzo de equipo, mencionando contribuciones específicas',
          points: 100,
          feedback: 'Líder que reconoce y eleva a su equipo',
          traits: { liderazgo: 5, integridad: 5 }
        },
        {
          id: 'b',
          text: 'Dar el crédito a quien tuvo la idea original',
          points: 75,
          feedback: 'Honesto pero ignora otras contribuciones',
          traits: { liderazgo: 3, integridad: 4 }
        },
        {
          id: 'c',
          text: 'Tomar el crédito si fuiste el líder del proyecto',
          points: 35,
          feedback: 'Egoísta, daña la moral del equipo',
          traits: { liderazgo: 1, integridad: 1 }
        },
        {
          id: 'd',
          text: 'Decir que no recuerdas quién empezó',
          points: 45,
          feedback: 'Evasivo, pierde oportunidad de reconocer al equipo',
          traits: { liderazgo: 2, integridad: 2 }
        }
      ]
    },
    {
      id: 'tb_04',
      title: 'Conflicto de Estilos',
      situation: 'Un compañero insiste en hacer las cosas diferente a como te enseñaron. Su método también funciona.',
      options: [
        {
          id: 'a',
          text: 'Observar su método y considerar incorporar lo mejor de ambos',
          points: 100,
          feedback: 'Mente abierta y mejora continua',
          traits: { adaptabilidad: 5, aprendizaje: 5 }
        },
        {
          id: 'b',
          text: 'Seguir con tu método probado',
          points: 50,
          feedback: 'Seguro pero cerrado a nuevas ideas',
          traits: { adaptabilidad: 2, aprendizaje: 2 }
        },
        {
          id: 'c',
          text: 'Preguntar al chef cuál es el método correcto',
          points: 60,
          feedback: 'Busca autoridad pero evita el diálogo',
          traits: { adaptabilidad: 3, aprendizaje: 3 }
        },
        {
          id: 'd',
          text: 'Insistir en que tu método es el correcto',
          points: 25,
          feedback: 'Inflexible y genera conflicto',
          traits: { adaptabilidad: 1, aprendizaje: 1 }
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// JUEGO 5: CRISIS COMMANDER (Manejo de Crisis)
// ═══════════════════════════════════════════════════════════════════

export const CRISIS_COMMANDER_GAME = {
  id: 'crisis_commander',
  name: 'Crisis Commander - Decisiones Bajo Presión',
  description: 'Enfrenta situaciones de crisis que requieren decisiones rápidas y efectivas.',
  duration: '12-15 minutos',
  evaluates: ['manejo_crisis', 'toma_decisiones', 'calma', 'liderazgo'],

  scenarios: [
    {
      id: 'cc_01',
      title: 'Intoxicación Reportada',
      situation: 'Un cliente llama diciendo que se enfermó después de comer aquí ayer.',
      time_limit: 30,
      severity: 'high',
      options: [
        {
          id: 'a',
          text: 'Tomar datos, revisar lote de ingredientes, informar al gerente',
          points: 100,
          feedback: 'Protocolo correcto: documentar, investigar, escalar',
          competencies: { protocolo: 5, calma: 5 }
        },
        {
          id: 'b',
          text: 'Ofrecer disculpas y compensación inmediata',
          points: 50,
          feedback: 'Puede admitir culpa prematuramente',
          competencies: { servicio: 3, criterio: 2 }
        },
        {
          id: 'c',
          text: 'Pedir prueba médica de que fue nuestra comida',
          points: 20,
          feedback: 'Defensivo y daña la relación con el cliente',
          competencies: { servicio: 1, protocolo: 1 }
        },
        {
          id: 'd',
          text: 'Cerrar la cocina hasta investigar',
          points: 70,
          feedback: 'Excesivo pero demuestra seriedad',
          competencies: { seguridad: 4, criterio: 3 }
        }
      ]
    },
    {
      id: 'cc_02',
      title: 'Falla de Electricidad',
      situation: 'Se va la luz en pleno servicio de cena. 50 clientes comiendo, cocina a oscuras.',
      time_limit: 20,
      severity: 'high',
      options: [
        {
          id: 'a',
          text: 'Activar generador de emergencia, calmar clientes, continuar con velas',
          points: 100,
          feedback: 'Control total de la situación',
          competencies: { liderazgo: 5, calma: 5 }
        },
        {
          id: 'b',
          text: 'Evacuar el restaurante por seguridad',
          points: 40,
          feedback: 'Exagerado y causa pérdida de servicio',
          competencies: { seguridad: 3, criterio: 2 }
        },
        {
          id: 'c',
          text: 'Esperar a que vuelva la luz',
          points: 25,
          feedback: 'Pasivo, no resuelve la situación',
          competencies: { liderazgo: 1, iniciativa: 1 }
        },
        {
          id: 'd',
          text: 'Ofrecer la cena gratis a todos los clientes',
          points: 60,
          feedback: 'Generoso pero costoso y no resuelve el servicio',
          competencies: { servicio: 4, criterio: 2 }
        }
      ]
    },
    {
      id: 'cc_03',
      title: 'Empleado No Llega',
      situation: '15 minutos antes de abrir, el chef de turno no contesta. Es sábado noche.',
      time_limit: 25,
      severity: 'medium',
      options: [
        {
          id: 'a',
          text: 'Llamar a suplentes de la lista de emergencia mientras reorganizas roles',
          points: 100,
          feedback: 'Plan A y B simultáneos, excelente gestión',
          competencies: { planificación: 5, liderazgo: 5 }
        },
        {
          id: 'b',
          text: 'Asumir el rol tú mismo si tienes capacidad',
          points: 80,
          feedback: 'Buena iniciativa pero puede faltar supervisión',
          competencies: { iniciativa: 5, liderazgo: 3 }
        },
        {
          id: 'c',
          text: 'Reducir el menú a lo que el equipo puede manejar',
          points: 70,
          feedback: 'Solución práctica pero afecta la experiencia',
          competencies: { pragmatismo: 4, adaptabilidad: 4 }
        },
        {
          id: 'd',
          text: 'Esperar 30 minutos más antes de actuar',
          points: 20,
          feedback: 'Pasivo, puede causar caos al abrir',
          competencies: { planificación: 1, liderazgo: 1 }
        }
      ]
    },
    {
      id: 'cc_04',
      title: 'Inspección Sorpresa',
      situation: 'Llegan inspectores de sanidad sin previo aviso durante el servicio.',
      time_limit: 15,
      severity: 'high',
      options: [
        {
          id: 'a',
          text: 'Recibirlos profesionalmente, designar guía, continuar operación normal',
          points: 100,
          feedback: 'Confianza en los procesos establecidos',
          competencies: { profesionalismo: 5, calma: 5 }
        },
        {
          id: 'b',
          text: 'Pedir que vuelvan otro día con cita',
          points: 10,
          feedback: 'Ilegal y sospechoso',
          competencies: { profesionalismo: 0, integridad: 0 }
        },
        {
          id: 'c',
          text: 'Mandar a limpiar rápidamente mientras los distraes',
          points: 20,
          feedback: 'Deshonesto y probablemente inefectivo',
          competencies: { integridad: 1, profesionalismo: 1 }
        },
        {
          id: 'd',
          text: 'Llamar al dueño antes de dejarlos pasar',
          points: 50,
          feedback: 'Puede parecer que ocultas algo',
          competencies: { profesionalismo: 2, criterio: 2 }
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════
// GESTOR DE PRUEBAS GAMIFICADAS
// ═══════════════════════════════════════════════════════════════════

export class GamifiedTestManager {
  constructor() {
    this.games = {
      kitchen_rush: KITCHEN_RUSH_GAME,
      service_master: SERVICE_MASTER_GAME,
      inventory_quest: INVENTORY_QUEST_GAME,
      team_builder: TEAM_BUILDER_GAME,
      crisis_commander: CRISIS_COMMANDER_GAME
    };
    this.config = GAMIFICATION_CONFIG;
    this.sessions = new Map();
  }

  /**
   * Inicia sesión de juego
   */
  startGameSession(candidateId, gameId) {
    const game = this.games[gameId];
    if (!game) {
      throw new Error(`Juego no encontrado: ${gameId}`);
    }

    const session = {
      sessionId: `GS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      gameId,
      gameName: game.name,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      currentScenario: 0,
      totalScenarios: game.scenarios?.length || game.challenges?.length || 0,
      points: 0,
      streak: 0,
      responses: [],
      badges: [],
      completedAt: null
    };

    this.sessions.set(session.sessionId, session);
    return {
      sessionId: session.sessionId,
      game: {
        id: game.id,
        name: game.name,
        description: game.description,
        duration: game.duration,
        evaluates: game.evaluates
      },
      firstScenario: this.getScenario(gameId, 0)
    };
  }

  /**
   * Obtiene escenario específico
   */
  getScenario(gameId, index) {
    const game = this.games[gameId];
    const scenarios = game.scenarios || game.challenges;

    if (index >= scenarios.length) {
      return null;
    }

    const scenario = scenarios[index];
    return {
      index,
      total: scenarios.length,
      ...scenario,
      options: scenario.options.map(opt => ({
        id: opt.id,
        text: opt.text
      }))
    };
  }

  /**
   * Procesa respuesta del candidato
   */
  submitResponse(sessionId, scenarioId, optionId, responseTime) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    const game = this.games[session.gameId];
    const scenarios = game.scenarios || game.challenges;
    const scenario = scenarios.find(s => s.id === scenarioId);

    if (!scenario) {
      throw new Error('Escenario no encontrado');
    }

    const selectedOption = scenario.options.find(o => o.id === optionId);
    if (!selectedOption) {
      throw new Error('Opción no válida');
    }

    // Calcular puntos
    let points = selectedOption.points || 0;
    let bonuses = [];

    // Bonus por velocidad
    const timeLimit = scenario.time_limit || 30;
    if (responseTime < timeLimit / 2) {
      points += this.config.pointsSystem.speed_bonus;
      bonuses.push({ type: 'speed', points: this.config.pointsSystem.speed_bonus });
    }

    // Bonus por racha
    if (points >= 80) {
      session.streak++;
      if (session.streak >= 3) {
        points += this.config.pointsSystem.streak_bonus;
        bonuses.push({ type: 'streak', points: this.config.pointsSystem.streak_bonus });
      }
    } else {
      session.streak = 0;
    }

    // Guardar respuesta
    const response = {
      scenarioId,
      optionId,
      points,
      bonuses,
      responseTime,
      feedback: selectedOption.feedback,
      competencies: selectedOption.competencies || selectedOption.traits || {},
      timestamp: new Date().toISOString()
    };

    session.responses.push(response);
    session.points += points;
    session.currentScenario++;

    // Verificar si completó el juego
    if (session.currentScenario >= scenarios.length) {
      return this.completeGame(sessionId);
    }

    // Obtener siguiente escenario
    const nextScenario = this.getScenario(session.gameId, session.currentScenario);

    return {
      response,
      nextScenario,
      progress: {
        current: session.currentScenario,
        total: scenarios.length,
        points: session.points,
        streak: session.streak
      }
    };
  }

  /**
   * Completa el juego y genera resultados
   */
  completeGame(sessionId) {
    const session = this.sessions.get(sessionId);
    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    // Bonus de completar
    session.points += this.config.pointsSystem.completion_bonus;

    // Calcular nivel alcanzado
    const level = this.calculateLevel(session.points);

    // Evaluar badges
    const badges = this.evaluateBadges(session);
    session.badges = badges;

    // Calcular competencias agregadas
    const competencies = this.aggregateCompetencies(session.responses);

    // Generar resultado final
    const result = {
      sessionId: session.sessionId,
      candidateId: session.candidateId,
      gameId: session.gameId,
      gameName: session.gameName,
      status: 'completed',
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      duration: this.calculateDuration(session.startedAt, session.completedAt),
      score: {
        points: session.points,
        level: level,
        percentage: Math.min(100, Math.round((session.points / 1000) * 100))
      },
      performance: {
        totalScenarios: session.totalScenarios,
        averageResponseTime: this.calculateAverageTime(session.responses),
        longestStreak: this.calculateMaxStreak(session.responses),
        perfectAnswers: session.responses.filter(r => r.points >= 100).length
      },
      competencies,
      badges,
      recommendation: this.generateRecommendation(session)
    };

    return result;
  }

  /**
   * Calcula nivel según puntos
   */
  calculateLevel(points) {
    for (let i = this.config.levels.length - 1; i >= 0; i--) {
      if (points >= this.config.levels[i].minPoints) {
        return this.config.levels[i];
      }
    }
    return this.config.levels[0];
  }

  /**
   * Evalúa badges ganados
   */
  evaluateBadges(session) {
    const badges = [];

    // Quick thinker: respuestas rápidas
    const fastResponses = session.responses.filter(r => r.responseTime < 5).length;
    if (fastResponses >= 10) {
      badges.push(this.config.badges.quick_thinker);
    }

    // Perfectionist: ronda perfecta
    const perfectResponses = session.responses.filter(r => r.points >= 100).length;
    if (perfectResponses === session.totalScenarios) {
      badges.push(this.config.badges.perfectionist);
    }

    // Problem solver
    const hardScenarios = session.responses.filter(r => r.points >= 90).length;
    if (hardScenarios >= 5) {
      badges.push(this.config.badges.problem_solver);
    }

    return badges;
  }

  /**
   * Agrega competencias de todas las respuestas
   */
  aggregateCompetencies(responses) {
    const totals = {};
    const counts = {};

    for (const response of responses) {
      for (const [comp, score] of Object.entries(response.competencies)) {
        if (!totals[comp]) {
          totals[comp] = 0;
          counts[comp] = 0;
        }
        totals[comp] += score;
        counts[comp]++;
      }
    }

    const averages = {};
    for (const comp of Object.keys(totals)) {
      averages[comp] = Math.round((totals[comp] / counts[comp]) * 20); // Escala 0-100
    }

    return averages;
  }

  /**
   * Calcula duración
   */
  calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.round((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Calcula tiempo promedio de respuesta
   */
  calculateAverageTime(responses) {
    if (responses.length === 0) return 0;
    const total = responses.reduce((sum, r) => sum + r.responseTime, 0);
    return Math.round(total / responses.length);
  }

  /**
   * Calcula racha máxima
   */
  calculateMaxStreak(responses) {
    let maxStreak = 0;
    let currentStreak = 0;

    for (const r of responses) {
      if (r.points >= 80) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  /**
   * Genera recomendación basada en resultados
   */
  generateRecommendation(session) {
    const percentage = Math.min(100, Math.round((session.points / 1000) * 100));

    if (percentage >= 85) {
      return {
        level: 'EXCELENTE',
        message: 'Demuestra excelentes habilidades para el puesto. Candidato destacado.',
        proceed: true
      };
    } else if (percentage >= 70) {
      return {
        level: 'BUENO',
        message: 'Buen desempeño general. Cumple con los requisitos del puesto.',
        proceed: true
      };
    } else if (percentage >= 55) {
      return {
        level: 'ACEPTABLE',
        message: 'Desempeño aceptable. Puede requerir capacitación adicional.',
        proceed: true,
        notes: 'Considerar plan de desarrollo'
      };
    } else {
      return {
        level: 'INSUFICIENTE',
        message: 'No alcanza el nivel esperado para el puesto.',
        proceed: false
      };
    }
  }

  /**
   * Obtiene lista de juegos disponibles
   */
  getAvailableGames() {
    return Object.values(this.games).map(g => ({
      id: g.id,
      name: g.name,
      description: g.description,
      duration: g.duration,
      evaluates: g.evaluates
    }));
  }

  /**
   * Obtiene batería recomendada por puesto
   */
  getRecommendedGames(position) {
    const recommendations = {
      chef_ejecutivo: ['kitchen_rush', 'crisis_commander', 'team_builder'],
      sous_chef: ['kitchen_rush', 'team_builder', 'inventory_quest'],
      cocinero: ['kitchen_rush', 'inventory_quest'],
      gerente_restaurante: ['crisis_commander', 'team_builder', 'service_master'],
      mesero: ['service_master', 'team_builder'],
      bartender: ['service_master', 'inventory_quest'],
      hostess: ['service_master', 'crisis_commander'],
      default: ['service_master', 'team_builder']
    };

    const gameIds = recommendations[position.toLowerCase()] || recommendations.default;
    return gameIds.map(id => this.games[id]);
  }
}

// Instancia exportada
export const gamifiedTestManager = new GamifiedTestManager();

// Export default
export default {
  GamifiedTestManager,
  gamifiedTestManager,
  GAMIFICATION_CONFIG,
  KITCHEN_RUSH_GAME,
  SERVICE_MASTER_GAME,
  INVENTORY_QUEST_GAME,
  TEAM_BUILDER_GAME,
  CRISIS_COMMANDER_GAME
};
