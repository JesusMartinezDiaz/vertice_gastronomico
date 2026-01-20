#!/usr/bin/env node
/**
 * Test Runner para los 83 Workflows de Vértice Gastronómico
 *
 * Este script verifica que todos los 83 workflows estén correctamente definidos
 * y que los 72 agentes referenciados existan.
 *
 * Ejecutar: node test-83-workflows.js
 */

// ============================================================================
// DEFINICIÓN COMPLETA DE LOS 72 AGENTES
// ============================================================================
const AGENTS = {
  1: { id: 1, name: "Director General IA", shortName: "CEO", category: "LEADERSHIP" },
  2: { id: 2, name: "Director de Finanzas", shortName: "CFO", category: "FINANCE" },
  3: { id: 3, name: "Controller Financiero", shortName: "Controller", category: "FINANCE" },
  4: { id: 4, name: "Analista de Food Cost", shortName: "Food Cost", category: "FINANCE" },
  5: { id: 5, name: "Especialista en Pricing", shortName: "Pricing", category: "FINANCE" },
  6: { id: 6, name: "Tesorero", shortName: "Tesorero", category: "FINANCE" },
  7: { id: 7, name: "Analista de Inversiones", shortName: "Inversiones", category: "FINANCE" },
  8: { id: 8, name: "Auditor Interno", shortName: "Auditor", category: "FINANCE" },
  9: { id: 9, name: "Director de Marketing", shortName: "CMO", category: "MARKETING" },
  10: { id: 10, name: "Community Manager", shortName: "CM", category: "MARKETING" },
  11: { id: 11, name: "Especialista en Ads", shortName: "Ads", category: "MARKETING" },
  12: { id: 12, name: "Analista de CRM", shortName: "CRM", category: "MARKETING" },
  13: { id: 13, name: "Diseñador Gráfico", shortName: "Diseñador", category: "MARKETING" },
  14: { id: 14, name: "Especialista en Delivery", shortName: "Delivery", category: "MARKETING" },
  15: { id: 15, name: "Gerente de Compras", shortName: "Compras", category: "OPERATIONS" },
  16: { id: 16, name: "Jefe de Almacén", shortName: "Almacén", category: "OPERATIONS" },
  17: { id: 17, name: "Chef Ejecutivo", shortName: "Chef", category: "OPERATIONS" },
  18: { id: 18, name: "Gerente de Operaciones", shortName: "Ops", category: "OPERATIONS" },
  19: { id: 19, name: "Director de RRHH", shortName: "RRHH", category: "HR" },
  20: { id: 20, name: "Capacitador", shortName: "Training", category: "HR" },
  21: { id: 21, name: "Especialista en Nómina", shortName: "Nómina", category: "HR" },
  22: { id: 22, name: "Supervisor de Turno", shortName: "Supervisor", category: "OPERATIONS" },
  23: { id: 23, name: "Analista de Datos", shortName: "Data", category: "TECH" },
  24: { id: 24, name: "Analista de Reportes", shortName: "Reportes", category: "TECH" },
  25: { id: 25, name: "Estratega de Negocios", shortName: "Estrategia", category: "LEADERSHIP" },
  26: { id: 26, name: "Gerente de Ventas", shortName: "Ventas", category: "MARKETING" },
  27: { id: 27, name: "Especialista en Franquicias", shortName: "Franquicias", category: "LEADERSHIP" },
  28: { id: 28, name: "Scout de Ubicaciones", shortName: "Scout", category: "LEADERSHIP" },
  29: { id: 29, name: "Ingeniero de Menú", shortName: "Menu Eng", category: "OPERATIONS" },
  30: { id: 30, name: "Coordinador de Eventos", shortName: "Eventos", category: "OPERATIONS" },
  31: { id: 31, name: "Especialista en Compliance", shortName: "Compliance", category: "LEGAL" },
  32: { id: 32, name: "Gerente de IT", shortName: "IT", category: "TECH" },
  33: { id: 33, name: "Desarrollador de Software", shortName: "Dev", category: "TECH" },
  34: { id: 34, name: "Asesor Legal", shortName: "Legal", category: "LEGAL" },
  35: { id: 35, name: "Mystery Shopper Lead", shortName: "Mystery", category: "QUALITY" },
  36: { id: 36, name: "Especialista en SEO", shortName: "SEO", category: "MARKETING" },
  37: { id: 37, name: "Lead de LinkedIn B2B", shortName: "LinkedIn", category: "MARKETING" },
  38: { id: 38, name: "UX/UI Designer", shortName: "UX", category: "TECH" },
  39: { id: 39, name: "Scaling Up Coach", shortName: "Scaling Up", category: "LEADERSHIP" },
  40: { id: 40, name: "FP&A Lead", shortName: "FP&A", category: "FINANCE" },
  41: { id: 41, name: "Growth Marketing Manager", shortName: "Growth", category: "MARKETING" },
  42: { id: 42, name: "Supply Chain Director", shortName: "Supply Chain", category: "OPERATIONS" },
  43: { id: 43, name: "Multi-Unit Operations Manager", shortName: "Multi-Unit", category: "OPERATIONS" },
  44: { id: 44, name: "Culture & Engagement Manager", shortName: "Culture", category: "HR" },
  45: { id: 45, name: "Data & Analytics Lead", shortName: "Analytics", category: "TECH" },
  46: { id: 46, name: "Digital Product Manager", shortName: "Digital PM", category: "TECH" },
  47: { id: 47, name: "IT Infrastructure Manager", shortName: "IT Infra", category: "TECH" },
  48: { id: 48, name: "Chief Strategy Officer", shortName: "CSO", category: "LEADERSHIP" },
  49: { id: 49, name: "New Business Development Lead", shortName: "Nuevos Negocios", category: "LEADERSHIP" },
  50: { id: 50, name: "Investor Relations Manager", shortName: "IR", category: "FINANCE" },
  51: { id: 51, name: "Organizational Designer", shortName: "Org Design", category: "HR" },
  52: { id: 52, name: "Service Architect", shortName: "Service Arch", category: "OPERATIONS" },
  53: { id: 53, name: "Brand Architect", shortName: "Brand", category: "MARKETING" },
  54: { id: 54, name: "Leadership Coach", shortName: "Coach", category: "HR" },
  55: { id: 55, name: "Executive Assistant IA", shortName: "EA", category: "LEADERSHIP" },
  56: { id: 56, name: "Project Manager", shortName: "PM", category: "LEADERSHIP" },
  57: { id: 57, name: "Sales & Quotation Manager", shortName: "Cotizador", category: "MARKETING" },
  58: { id: 58, name: "Social Listening Analyst", shortName: "Social Listen", category: "MARKETING" },
  59: { id: 59, name: "Influencer Marketing Lead", shortName: "Influencer", category: "MARKETING" },
  60: { id: 60, name: "PR & Communications Manager", shortName: "PR", category: "MARKETING" },
  61: { id: 61, name: "Revenue Manager", shortName: "Revenue", category: "FINANCE" },
  62: { id: 62, name: "Guest Experience Manager", shortName: "Guest Exp", category: "OPERATIONS" },
  63: { id: 63, name: "Sustainability Manager", shortName: "Sustain", category: "OPERATIONS" },
  64: { id: 64, name: "Food Safety Manager", shortName: "Food Safety", category: "QUALITY" },
  65: { id: 65, name: "Recipe Developer", shortName: "Recipe Dev", category: "OPERATIONS" },
  66: { id: 66, name: "Sommelier", shortName: "Sommelier", category: "OPERATIONS" },
  67: { id: 67, name: "Mixólogo", shortName: "Mixólogo", category: "OPERATIONS" },
  68: { id: 68, name: "Pastelero Ejecutivo", shortName: "Pastelero", category: "OPERATIONS" },
  69: { id: 69, name: "Especialista en Catering", shortName: "Catering", category: "OPERATIONS" },
  70: { id: 70, name: "Nutriólogo", shortName: "Nutriólogo", category: "OPERATIONS" },
  71: { id: 71, name: "Arquitecto de Sistemas", shortName: "Architect", category: "TECH" },
  72: { id: 72, name: "Abogado Familiar", shortName: "Fam Lawyer", category: "PRIVATE", isPrivate: true, ceoOnly: true }
};

// ============================================================================
// DEFINICIÓN COMPLETA DE LOS 83 WORKFLOWS
// ============================================================================
const WORKFLOWS = [
  // WORKFLOWS EXISTENTES (1-16)
  { id: 1, name: "Análisis Mensual Completo", icon: "📊", steps: [56,2,4,19,24,12,23,1], description: "Análisis financiero, operativo y de clientes coordinado por PM" },
  { id: 2, name: "Optimizar Costos", icon: "💰", steps: [56,4,15,16,3,19,18], description: "Reducción de food cost, compras y operaciones con seguimiento PM" },
  { id: 3, name: "Mejorar Reputación", icon: "⭐", steps: [56,12,35,30,13,9,10], description: "Gestión de reseñas y experiencia del cliente con tracking PM" },
  { id: 4, name: "Evaluar Expansión", icon: "🏪", steps: [56,28,25,7,27,26,1], description: "Análisis de ubicación, mercado e inversión con PM" },
  { id: 5, name: "Mystery Shopper Completo", icon: "🕵️", steps: [56,35,22,17,30,18,20], description: "Evaluación encubierta integral con seguimiento PM" },
  { id: 6, name: "Auditoría Financiera", icon: "💵", steps: [56,2,3,6,8,7,24], description: "Revisión completa de finanzas coordinada por PM" },
  { id: 7, name: "Campaña Marketing 360", icon: "📣", steps: [56,36,9,10,11,13,14,25], description: "Estrategia omnicanal con SEO y marketing digital - PM coordina" },
  { id: 8, name: "Optimización Menú", icon: "🍽️", steps: [56,4,17,29,5,24,30], description: "Ingeniería de menú y pricing con gestión PM" },
  { id: 9, name: "Mejora Operativa", icon: "⚙️", steps: [56,18,16,17,21,22,32], description: "Eficiencia y procesos operativos con seguimiento PM" },
  { id: 10, name: "Desarrollo de Personal", icon: "👥", steps: [56,19,20,21,22,18,30], description: "Capacitación y gestión de equipo coordinado por PM" },
  { id: 11, name: "Transformación Digital", icon: "💻", steps: [56,32,33,23,14,10,11], description: "Tecnología y análisis de datos - proyecto gestionado por PM" },
  { id: 12, name: "Lanzamiento Delivery", icon: "🛵", steps: [56,14,17,5,9,32,12], description: "Estrategia de canales de delivery con PM" },
  { id: 13, name: "Performance Marketing Digital", icon: "🚀", steps: [56,36,11,10,9,12,23], description: "SEO, SEM, redes sociales y análisis - PM coordina" },
  { id: 14, name: "Auditoría Digital Completa", icon: "🔍", steps: [56,36,32,10,11,12,25], description: "SEO, presencia web, redes sociales - PM gestiona" },
  { id: 15, name: "Campaña LinkedIn B2B", icon: "💼", steps: [56,37,25,9,23,11,10], description: "Prospección B2B con PM coordinando" },
  { id: 16, name: "Lead Generation Completo", icon: "🎯", steps: [56,37,36,11,10,9,25,23], description: "Generación de leads multicanal con gestión PM" },

  // WORKFLOWS DE PROJECT MANAGEMENT (17-32)
  { id: 17, name: "Consultoría Diagnóstico Integral", icon: "📋", steps: [56,1,2,18,19,12,35,32], description: "Diagnóstico completo de restaurante: financiero, operativo, RRHH, cliente y digital - PM lidera" },
  { id: 18, name: "Proyecto Apertura Nueva Unidad", icon: "🏗️", steps: [56,28,25,7,27,2,18,19,9,32,1], description: "Apertura completa: ubicación, inversión, operaciones, equipo, marketing - PM coordina todo" },
  { id: 19, name: "Turnaround Restaurante en Crisis", icon: "🚨", steps: [56,2,4,18,19,12,35,9,1], description: "Rescate de restaurante: diagnóstico rápido, quick wins, plan de acción - PM urgente" },
  { id: 20, name: "Implementación Sistema de Franquicias", icon: "🔄", steps: [56,27,1,34,2,18,19,9,32], description: "Desarrollo de modelo de franquicia completo - PM gestiona proyecto" },
  { id: 21, name: "Proyecto Reducción Food Cost", icon: "🥗", steps: [56,4,15,16,17,29,3], description: "Proyecto estructurado para reducir food cost 3-5% - PM con RACI definido" },
  { id: 22, name: "Proyecto Mejora Experiencia Cliente", icon: "💎", steps: [56,12,30,35,22,9,10], description: "Mejora integral de CX con métricas y seguimiento - PM con milestones" },
  { id: 23, name: "Proyecto Eficiencia Operativa", icon: "⚡", steps: [56,18,17,21,22,32,19], description: "Optimización de procesos y productividad - PM con KPIs claros" },
  { id: 24, name: "Proyecto Desarrollo Equipo Gerencial", icon: "👔", steps: [56,19,20,21,22,54,1], description: "Desarrollo de líderes y cultura - PM con plan de capacitación" },
  { id: 25, name: "Plan Estratégico Anual", icon: "🎯", steps: [56,1,25,2,9,18,19,23], description: "Planificación estratégica completa del año - PM facilita y da seguimiento" },
  { id: 26, name: "Proyecto Reposicionamiento de Marca", icon: "🎨", steps: [56,9,10,11,13,25,30,1], description: "Cambio de posicionamiento de marca - PM gestiona timeline" },
  { id: 27, name: "Due Diligence para Adquisición", icon: "🔍", steps: [56,2,3,34,18,19,25,1], description: "Evaluación completa para compra de restaurante - PM coordina análisis" },
  { id: 28, name: "Proyecto Sostenibilidad y ESG", icon: "🌱", steps: [56,42,43,31,18,9,1], description: "Implementación de prácticas sostenibles - PM con métricas ESG" },
  { id: 29, name: "Revisión Trimestral de Proyectos", icon: "📈", steps: [56,1,2,23,45,55], description: "QBR de todos los proyectos activos - PM presenta status consolidado" },
  { id: 30, name: "Auditoría de Cumplimiento de Proyectos", icon: "✅", steps: [56,34,31,52,38,39,1], description: "Verificación de compliance en proyectos - PM valida entregables" },
  { id: 31, name: "Cierre de Proyecto y Lecciones Aprendidas", icon: "🏁", steps: [56,1,23,45,55], description: "Cierre formal con documentación y transferencia - PM facilita" },
  { id: 32, name: "Escalación y Gestión de Crisis en Proyecto", icon: "🆘", steps: [56,1,55,48,2,18], description: "Manejo de desviaciones críticas - PM activa protocolo de crisis" },

  // WORKFLOWS FINANCIEROS Y ESTRATÉGICOS (33-38)
  { id: 33, name: "FP&A y Presupuestación Anual", icon: "📊", steps: [56,40,2,3,24,48,1], description: "Planificación financiera y presupuesto anual - FP&A Lead coordina" },
  { id: 34, name: "Evaluación de Adquisiciones", icon: "🏢", steps: [56,49,2,34,28,25,48,1], description: "Due diligence para M&A - Lead de Nuevos Negocios coordina" },
  { id: 35, name: "Preparación para Inversionistas", icon: "💼", steps: [56,50,2,40,48,23,1], description: "Preparación de pitch y documentación para inversionistas" },
  { id: 36, name: "Estrategia Corporativa Integral", icon: "🎯", steps: [56,48,1,25,2,40,49,50], description: "Definición estratégica de alto nivel - CSO lidera" },
  { id: 37, name: "Análisis de Nuevos Mercados", icon: "🌎", steps: [56,49,25,28,40,48,1], description: "Evaluación de expansión a nuevos mercados o segmentos" },
  { id: 38, name: "Reestructuración Financiera", icon: "💰", steps: [56,2,40,3,6,7,48,1], description: "Optimización de estructura financiera y capital de trabajo" },

  // WORKFLOWS DE GROWTH Y MARKETING AVANZADO (39-43)
  { id: 39, name: "Growth Marketing Integral", icon: "🚀", steps: [56,41,9,11,10,36,37,23], description: "Estrategia de crecimiento acelerado - Growth Manager lidera" },
  { id: 40, name: "Lanzamiento de Producto Digital", icon: "📱", steps: [56,46,32,38,41,9,10,11], description: "Desarrollo y lanzamiento de producto digital - Digital PM lidera" },
  { id: 41, name: "Optimización de Funnel de Conversión", icon: "📈", steps: [56,41,11,36,23,45,9], description: "Mejora del embudo de ventas digital - Growth Marketing" },
  { id: 42, name: "Estrategia de Contenido y SEO", icon: "✍️", steps: [56,41,36,10,38,9,23], description: "Plan de contenido y posicionamiento orgánico" },
  { id: 43, name: "Ecosistema Digital Completo", icon: "🌐", steps: [56,46,32,38,36,41,11,10], description: "Diseño e implementación de ecosistema digital" },

  // WORKFLOWS DE DATOS Y ANALYTICS (44-47)
  { id: 44, name: "Data Analytics y Business Intelligence", icon: "📊", steps: [56,45,23,33,24,32,1], description: "Implementación de analytics avanzado - Data Lead coordina" },
  { id: 45, name: "Infraestructura IT para Restaurantes", icon: "🖥️", steps: [56,47,32,46,45,18,1], description: "Modernización de infraestructura tecnológica" },
  { id: 46, name: "Dashboard Ejecutivo y KPIs", icon: "📉", steps: [56,45,23,24,2,40,1], description: "Diseño de dashboards y sistema de métricas" },
  { id: 47, name: "Migración y Seguridad de Datos", icon: "🔐", steps: [56,47,32,45,34,1], description: "Proyecto de migración con seguridad - IT Manager lidera" },

  // WORKFLOWS DE CULTURA Y ORGANIZACIÓN (48-52)
  { id: 48, name: "Transformación Cultural", icon: "🌟", steps: [56,44,54,19,20,51,1], description: "Cambio cultural y engagement - Culture Manager lidera" },
  { id: 49, name: "Rediseño Organizacional", icon: "🏗️", steps: [56,51,19,44,48,1], description: "Estructura organizacional óptima - Org Designer lidera" },
  { id: 50, name: "Employee Experience Integral", icon: "💚", steps: [56,44,19,20,21,30,54], description: "Mejora de experiencia del colaborador" },
  { id: 51, name: "Diseño de Puestos y Competencias", icon: "📋", steps: [56,51,19,20,44,1], description: "Job architecture y perfiles de competencia" },
  { id: 52, name: "Programa de Cultura de Servicio", icon: "🤝", steps: [56,54,44,20,30,35,52], description: "Cultura centrada en servicio al cliente" },

  // WORKFLOWS DE OPERACIONES Y MANUALES (53-56)
  { id: 53, name: "Documentación de Operaciones", icon: "📖", steps: [56,52,18,17,22,32,1], description: "Manuales operativos completos - Service Architect lidera" },
  { id: 54, name: "Estandarización Multi-Unidad", icon: "🔄", steps: [56,43,52,18,22,27,1], description: "Estándares para múltiples sucursales - Multi-Unit Ops Manager" },
  { id: 55, name: "Optimización de Supply Chain", icon: "📦", steps: [56,42,15,16,43,4,2], description: "Cadena de suministro eficiente - Supply Chain Director" },
  { id: 56, name: "Excelencia Operativa Integral", icon: "⚡", steps: [56,43,18,52,22,17,21], description: "Proyecto de mejora operativa integral" },

  // WORKFLOWS DE MARCA E IDENTIDAD (57-59)
  { id: 57, name: "Desarrollo de Identidad de Marca", icon: "🎨", steps: [56,53,9,10,30,25,1], description: "Brandbook y sistema de identidad - Brand Architect lidera" },
  { id: 58, name: "Rebranding Completo", icon: "✨", steps: [56,53,9,10,11,38,30,1], description: "Proceso de rebranding integral" },
  { id: 59, name: "Arquitectura de Marca Multi-Concepto", icon: "🏛️", steps: [56,53,25,27,9,48,1], description: "Sistema de marcas para grupo restaurantero" },

  // WORKFLOWS INTEGRALES Y METODOLOGÍAS (60-63)
  { id: 60, name: "Implementación Scaling Up", icon: "📈", steps: [56,39,1,48,19,2,23], description: "Metodología Rockefeller Habits - Scaling Up Coach" },
  { id: 61, name: "Ritmo de Reuniones Ejecutivas", icon: "🗓️", steps: [56,39,1,55,48,40], description: "Implementación de meeting rhythm - Scaling Up" },
  { id: 62, name: "Planificación Estratégica One Page", icon: "📄", steps: [56,39,48,1,25,2,40], description: "OPSP y prioridades trimestrales - Scaling Up Coach" },
  { id: 63, name: "Cash Acceleration Strategies", icon: "💵", steps: [56,39,2,40,6,3,1], description: "Estrategias de aceleración de efectivo - Scaling Up" },

  // WORKFLOWS DE CONSULTORÍA ESPECIALIZADA (64-68)
  { id: 64, name: "Diagnóstico 360 de Restaurante", icon: "🔍", steps: [56,1,2,18,19,9,12,32,45,35], description: "Evaluación completa de todas las áreas del negocio" },
  { id: 65, name: "Quick Wins y Resultados Rápidos", icon: "⚡", steps: [56,4,15,12,21,41,1], description: "Identificación e implementación de mejoras inmediatas" },
  { id: 66, name: "Benchmark Competitivo Integral", icon: "📊", steps: [56,25,24,35,45,9,1], description: "Análisis comparativo vs competencia" },
  { id: 67, name: "Road Map de Transformación", icon: "🗺️", steps: [56,48,1,32,46,51,40,2], description: "Plan de transformación a largo plazo" },
  { id: 68, name: "Proyecto de Innovación Gastronómica", icon: "🍽️", steps: [56,17,4,29,30,25,9,1], description: "Desarrollo de nuevos conceptos y experiencias" },

  // WORKFLOWS DE COTIZACIÓN Y PROPUESTAS (69-78)
  { id: 69, name: "Cotización de Proyecto de Consultoría", icon: "💵", steps: [57,56,2,7,40,1], description: "Generación de propuesta comercial para proyecto de consultoría" },
  { id: 70, name: "Cotización de Evento Gastronómico", icon: "🎉", steps: [57,30,17,18,56,2], description: "Propuesta para evento con diseño de menú y supervisión" },
  { id: 71, name: "Propuesta de Diagnóstico Integral", icon: "🔍", steps: [57,1,2,18,19,56,45], description: "Cotización para diagnóstico completo de restaurante" },
  { id: 72, name: "Cotización de Apertura de Restaurante", icon: "🏗️", steps: [57,28,25,56,7,27,2,9], description: "Propuesta comercial para proyecto de apertura" },
  { id: 73, name: "Propuesta de Optimización de Costos", icon: "📉", steps: [57,4,15,2,56,7], description: "Cotización para proyecto de reducción de food cost" },
  { id: 74, name: "Cotización de Desarrollo de Franquicia", icon: "🔄", steps: [57,27,34,52,56,7,2], description: "Propuesta para desarrollo de modelo de franquicia" },
  { id: 75, name: "Propuesta de Capacitación y Desarrollo", icon: "👨‍🏫", steps: [57,20,19,44,56,2], description: "Cotización de programas de capacitación y desarrollo" },
  { id: 76, name: "Cotización de Mystery Shopper", icon: "🕵️", steps: [57,35,22,30,56,12], description: "Propuesta de programa de evaluación encubierta" },
  { id: 77, name: "Propuesta de Retainer Mensual", icon: "📅", steps: [57,56,1,2,40,48], description: "Cotización de asesoría mensual continua" },
  { id: 78, name: "Cotización de Festival Gastronómico", icon: "🎪", steps: [57,30,17,18,42,9,56], description: "Propuesta para dirección culinaria de festival" },

  // WORKFLOWS PRIVADOS CEO - AGENTE 72 (79-83)
  { id: 79, name: "Generación de Escrito Jurídico", icon: "⚖️", steps: [72], description: "PRIVADO CEO: Genera demandas, contestaciones, recursos y promociones para casos de custodia en Querétaro", category: "private" },
  { id: 80, name: "Análisis de Expediente Judicial", icon: "📋", steps: [72], description: "PRIVADO CEO: Analiza expediente judicial y genera estrategia legal para caso de custodia", category: "private" },
  { id: 81, name: "Elaboración de Demanda de Custodia", icon: "📜", steps: [72], description: "PRIVADO CEO: Redacta demanda completa de guarda y custodia para Juzgados Familiares de Querétaro", category: "private" },
  { id: 82, name: "Recurso de Apelación Familiar", icon: "🔄", steps: [72], description: "PRIVADO CEO: Elabora recurso de apelación contra resoluciones desfavorables en materia familiar", category: "private" },
  { id: 83, name: "Amparo Indirecto Familiar", icon: "🛡️", steps: [72], description: "PRIVADO CEO: Genera demanda de amparo indirecto para protección de derechos en materia familiar", category: "private" }
];

// ============================================================================
// FUNCIONES DE PRUEBA
// ============================================================================

/**
 * Verifica que todos los agentes referenciados en los workflows existan
 */
function validateWorkflowAgents() {
  const errors = [];
  const warnings = [];

  for (const workflow of WORKFLOWS) {
    for (const agentId of workflow.steps) {
      if (!AGENTS[agentId]) {
        errors.push(`Workflow ${workflow.id} (${workflow.name}): Agente ${agentId} no existe`);
      }
    }

    // Verificar que el workflow tiene al menos un paso
    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push(`Workflow ${workflow.id} (${workflow.name}): No tiene pasos definidos`);
    }
  }

  return { errors, warnings };
}

/**
 * Verifica la estructura de cada workflow
 */
function validateWorkflowStructure() {
  const errors = [];

  for (const workflow of WORKFLOWS) {
    if (!workflow.id) errors.push(`Workflow sin ID: ${workflow.name}`);
    if (!workflow.name) errors.push(`Workflow ${workflow.id}: Sin nombre`);
    if (!workflow.icon) errors.push(`Workflow ${workflow.id}: Sin icono`);
    if (!workflow.steps) errors.push(`Workflow ${workflow.id}: Sin steps`);
    if (!workflow.description) errors.push(`Workflow ${workflow.id}: Sin descripción`);
  }

  return errors;
}

/**
 * Verifica que los IDs de workflows sean únicos y secuenciales
 */
function validateWorkflowIds() {
  const errors = [];
  const ids = WORKFLOWS.map(w => w.id);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    errors.push('Existen IDs de workflow duplicados');
  }

  // Verificar secuencia 1-83
  for (let i = 1; i <= 83; i++) {
    if (!uniqueIds.has(i)) {
      errors.push(`Falta workflow con ID ${i}`);
    }
  }

  return errors;
}

/**
 * Genera estadísticas de los workflows
 */
function generateStats() {
  const stats = {
    totalWorkflows: WORKFLOWS.length,
    totalAgents: Object.keys(AGENTS).length,
    agentUsage: {},
    privateWorkflows: WORKFLOWS.filter(w => w.category === 'private').length,
    avgStepsPerWorkflow: 0,
    maxSteps: 0,
    minSteps: Infinity,
    workflowsByCategory: {
      existentes: 0,
      projectManagement: 0,
      financieros: 0,
      growth: 0,
      datos: 0,
      cultura: 0,
      operaciones: 0,
      marca: 0,
      metodologias: 0,
      consultoria: 0,
      cotizacion: 0,
      privados: 0
    }
  };

  let totalSteps = 0;

  for (const workflow of WORKFLOWS) {
    const stepCount = workflow.steps.length;
    totalSteps += stepCount;
    stats.maxSteps = Math.max(stats.maxSteps, stepCount);
    stats.minSteps = Math.min(stats.minSteps, stepCount);

    // Contar uso de cada agente
    for (const agentId of workflow.steps) {
      stats.agentUsage[agentId] = (stats.agentUsage[agentId] || 0) + 1;
    }

    // Categorizar workflows
    if (workflow.id <= 16) stats.workflowsByCategory.existentes++;
    else if (workflow.id <= 32) stats.workflowsByCategory.projectManagement++;
    else if (workflow.id <= 38) stats.workflowsByCategory.financieros++;
    else if (workflow.id <= 43) stats.workflowsByCategory.growth++;
    else if (workflow.id <= 47) stats.workflowsByCategory.datos++;
    else if (workflow.id <= 52) stats.workflowsByCategory.cultura++;
    else if (workflow.id <= 56) stats.workflowsByCategory.operaciones++;
    else if (workflow.id <= 59) stats.workflowsByCategory.marca++;
    else if (workflow.id <= 63) stats.workflowsByCategory.metodologias++;
    else if (workflow.id <= 68) stats.workflowsByCategory.consultoria++;
    else if (workflow.id <= 78) stats.workflowsByCategory.cotizacion++;
    else stats.workflowsByCategory.privados++;
  }

  stats.avgStepsPerWorkflow = (totalSteps / WORKFLOWS.length).toFixed(2);

  // Top 10 agentes más usados
  stats.topAgents = Object.entries(stats.agentUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({
      id: parseInt(id),
      name: AGENTS[id]?.name || 'Unknown',
      usageCount: count
    }));

  return stats;
}

/**
 * Simula la ejecución de un workflow
 */
function simulateWorkflowExecution(workflowId) {
  const workflow = WORKFLOWS.find(w => w.id === workflowId);
  if (!workflow) {
    return { success: false, error: `Workflow ${workflowId} no encontrado` };
  }

  const result = {
    workflowId: workflow.id,
    workflowName: workflow.name,
    success: true,
    steps: [],
    errors: [],
    isPrivate: workflow.category === 'private'
  };

  for (let i = 0; i < workflow.steps.length; i++) {
    const agentId = workflow.steps[i];
    const agent = AGENTS[agentId];

    if (!agent) {
      result.errors.push(`Paso ${i + 1}: Agente ${agentId} no existe`);
      result.success = false;
    } else {
      result.steps.push({
        step: i + 1,
        agentId: agent.id,
        agentName: agent.name,
        category: agent.category,
        status: 'SIMULATED_OK'
      });
    }
  }

  return result;
}

/**
 * Ejecuta todas las pruebas
 */
function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('       PRUEBA DE 83 WORKFLOWS - VÉRTICE GASTRONÓMICO');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('');

  const results = {
    passed: 0,
    failed: 0,
    errors: [],
    workflowResults: []
  };

  // Test 1: Validar estructura
  console.log('📋 TEST 1: Validando estructura de workflows...');
  const structureErrors = validateWorkflowStructure();
  if (structureErrors.length === 0) {
    console.log('   ✅ Estructura de workflows correcta');
    results.passed++;
  } else {
    console.log('   ❌ Errores de estructura:', structureErrors.length);
    results.failed++;
    results.errors.push(...structureErrors);
  }

  // Test 2: Validar IDs
  console.log('📋 TEST 2: Validando IDs de workflows...');
  const idErrors = validateWorkflowIds();
  if (idErrors.length === 0) {
    console.log('   ✅ IDs de workflows correctos (1-83)');
    results.passed++;
  } else {
    console.log('   ❌ Errores de IDs:', idErrors.length);
    results.failed++;
    results.errors.push(...idErrors);
  }

  // Test 3: Validar agentes
  console.log('📋 TEST 3: Validando agentes referenciados...');
  const { errors: agentErrors } = validateWorkflowAgents();
  if (agentErrors.length === 0) {
    console.log('   ✅ Todos los agentes referenciados existen');
    results.passed++;
  } else {
    console.log('   ❌ Errores de agentes:', agentErrors.length);
    results.failed++;
    results.errors.push(...agentErrors);
  }

  // Test 4: Simular ejecución de todos los workflows
  console.log('📋 TEST 4: Simulando ejecución de 83 workflows...');
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const workflow of WORKFLOWS) {
    const execResult = simulateWorkflowExecution(workflow.id);
    results.workflowResults.push(execResult);

    if (execResult.success) {
      successCount++;
      const privateTag = execResult.isPrivate ? ' [PRIVADO]' : '';
      console.log(`   ✅ Workflow ${workflow.id}: ${workflow.name}${privateTag} - ${execResult.steps.length} pasos`);
    } else {
      failCount++;
      console.log(`   ❌ Workflow ${workflow.id}: ${workflow.name} - FALLÓ`);
      execResult.errors.forEach(err => console.log(`      → ${err}`));
    }
  }

  if (failCount === 0) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Generar estadísticas
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('                         ESTADÍSTICAS');
  console.log('═══════════════════════════════════════════════════════════════════════');

  const stats = generateStats();
  console.log(`   Total Workflows: ${stats.totalWorkflows}`);
  console.log(`   Total Agentes: ${stats.totalAgents}`);
  console.log(`   Workflows Privados (CEO): ${stats.privateWorkflows}`);
  console.log(`   Promedio de pasos por workflow: ${stats.avgStepsPerWorkflow}`);
  console.log(`   Máximo de pasos: ${stats.maxSteps}`);
  console.log(`   Mínimo de pasos: ${stats.minSteps}`);
  console.log('');
  console.log('   Workflows por categoría:');
  Object.entries(stats.workflowsByCategory).forEach(([cat, count]) => {
    console.log(`     - ${cat}: ${count}`);
  });
  console.log('');
  console.log('   Top 10 agentes más utilizados:');
  stats.topAgents.forEach((agent, i) => {
    console.log(`     ${i + 1}. Agente ${agent.id} (${agent.name}): ${agent.usageCount} veces`);
  });

  // Resumen final
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('                         RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`   Tests pasados: ${results.passed}/4`);
  console.log(`   Workflows exitosos: ${successCount}/${WORKFLOWS.length}`);
  console.log(`   Workflows fallidos: ${failCount}/${WORKFLOWS.length}`);
  console.log(`   Tasa de éxito: ${((successCount / WORKFLOWS.length) * 100).toFixed(1)}%`);

  if (results.errors.length > 0) {
    console.log('');
    console.log('   Errores encontrados:');
    results.errors.forEach(err => console.log(`     → ${err}`));
  }

  console.log('═══════════════════════════════════════════════════════════════════════');

  if (successCount === WORKFLOWS.length && results.failed === 0) {
    console.log('   🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE');
  } else {
    console.log('   ⚠️  ALGUNAS PRUEBAS FALLARON - REVISAR ERRORES');
  }

  console.log('═══════════════════════════════════════════════════════════════════════');

  return results;
}

// Ejecutar las pruebas
runAllTests();
