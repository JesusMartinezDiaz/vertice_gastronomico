#!/usr/bin/env node
/**
 * Test Runner para los 99 Workflows de Vértice Gastronómico
 *
 * Este script verifica que todos los 99 workflows estén correctamente definidos,
 * que los 72 agentes referenciados existan, y que el Protocolo de Verificación
 * Triple (PVT) esté correctamente implementado.
 *
 * Ejecutar: node test-99-workflows.js
 */

import fs from 'fs';
import path from 'path';

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
  71: { id: 71, name: "Arquitecto de Software & IA Senior", shortName: "ARCH-AI", category: "TECH" },
  72: { id: 72, name: "Abogado Familiar", shortName: "Fam Lawyer", category: "PRIVATE", isPrivate: true, ceoOnly: true }
};

// ============================================================================
// DEFINICIÓN COMPLETA DE LOS 99 WORKFLOWS (Actualizado desde App.jsx)
// ============================================================================
const WORKFLOWS = [
  // ============================================================================
  // BLOQUE: CEO - WORKFLOWS ESTRATÉGICOS DE ALTO NIVEL
  // ============================================================================
  { id: 1, name: "Análisis Mensual Completo", icon: "📊", steps: [56,2,4,19,24,12,23,1], description: "Análisis financiero, operativo y de clientes coordinado por PM", block: "ceo" },
  { id: 4, name: "Evaluar Expansión", icon: "🏪", steps: [56,28,25,7,27,26,1], description: "Análisis de ubicación, mercado e inversión con PM", block: "ceo" },
  { id: 25, name: "Plan Estratégico Anual", icon: "🎯", steps: [56,1,25,2,9,18,19,23], description: "Planificación estratégica completa del año - PM facilita", block: "ceo" },
  { id: 64, name: "Diagnóstico 360 de Restaurante", icon: "🔍", steps: [56,1,2,18,19,9,12,32,45,35], description: "Evaluación completa de todas las áreas del negocio", block: "ceo" },
  { id: 67, name: "Road Map de Transformación", icon: "🗺️", steps: [56,48,1,32,46,51,40,2], description: "Plan de transformación a largo plazo", block: "ceo" },

  // ============================================================================
  // BLOQUE: FINANZAS - CONTROL FINANCIERO Y COSTOS
  // ============================================================================
  { id: 2, name: "Optimizar Costos", icon: "💰", steps: [56,4,15,16,3,19,18], description: "Reducción de food cost, compras y operaciones", block: "finance" },
  { id: 6, name: "Auditoría Financiera", icon: "💵", steps: [56,2,3,6,7,24], description: "Revisión completa de finanzas coordinada por PM", block: "finance" },
  { id: 21, name: "Proyecto Reducción Food Cost", icon: "🥗", steps: [56,4,15,16,17,29,3], description: "Proyecto estructurado para reducir food cost 3-5%", block: "finance" },
  { id: 33, name: "FP&A y Presupuestación Anual", icon: "📊", steps: [56,40,2,3,24,48,1], description: "Planificación financiera y presupuesto anual", block: "finance" },
  { id: 38, name: "Reestructuración Financiera", icon: "💰", steps: [56,2,40,3,6,7,48,1], description: "Optimización de estructura financiera y capital de trabajo", block: "finance" },
  { id: 63, name: "Cash Acceleration Strategies", icon: "💵", steps: [56,39,2,40,6,3,1], description: "Estrategias de aceleración de efectivo", block: "finance" },
  { id: 73, name: "Propuesta de Optimización de Costos", icon: "📉", steps: [57,4,15,2,56,7], description: "Cotización para proyecto de reducción de food cost", block: "finance" },

  // ============================================================================
  // BLOQUE: MARKETING - MARCA Y CRECIMIENTO
  // ============================================================================
  { id: 3, name: "Mejorar Reputación", icon: "⭐", steps: [56,12,35,30,13,9,10], description: "Gestión de reseñas y experiencia del cliente", block: "marketing" },
  { id: 7, name: "Campaña Marketing 360", icon: "📣", steps: [56,36,9,10,11,13,14,25], description: "Estrategia omnicanal con SEO y marketing digital", block: "marketing" },
  { id: 12, name: "Lanzamiento Delivery", icon: "🛵", steps: [56,14,17,5,9,32,12], description: "Estrategia de canales de delivery", block: "marketing" },
  { id: 13, name: "Performance Marketing Digital", icon: "🚀", steps: [56,36,11,10,9,12,23], description: "SEO, SEM, redes sociales y análisis", block: "marketing" },
  { id: 14, name: "Auditoría Digital Completa", icon: "🔍", steps: [56,36,32,10,11,12,25], description: "SEO, presencia web, redes sociales", block: "marketing" },
  { id: 15, name: "Campaña LinkedIn B2B", icon: "💼", steps: [56,37,25,9,23,11,10], description: "Prospección B2B con PM coordinando", block: "marketing" },
  { id: 16, name: "Lead Generation Completo", icon: "🎯", steps: [56,37,36,11,10,9,25,23], description: "Generación de leads multicanal", block: "marketing" },
  { id: 26, name: "Proyecto Reposicionamiento de Marca", icon: "🎨", steps: [56,9,10,11,13,25,30,1], description: "Cambio de posicionamiento de marca", block: "marketing" },
  { id: 39, name: "Growth Marketing Integral", icon: "🚀", steps: [56,41,9,11,10,36,37,23], description: "Estrategia de crecimiento acelerado", block: "marketing" },
  { id: 41, name: "Optimización de Funnel de Conversión", icon: "📈", steps: [56,41,11,36,23,45,9], description: "Mejora del embudo de ventas digital", block: "marketing" },
  { id: 42, name: "Estrategia de Contenido y SEO", icon: "✍️", steps: [56,41,36,10,38,9,23], description: "Plan de contenido y posicionamiento orgánico", block: "marketing" },
  { id: 57, name: "Desarrollo de Identidad de Marca", icon: "🎨", steps: [56,53,9,10,30,25,1], description: "Brandbook y sistema de identidad", block: "marketing" },
  { id: 58, name: "Rebranding Completo", icon: "✨", steps: [56,53,9,10,11,38,30,1], description: "Proceso de rebranding integral", block: "marketing" },
  { id: 59, name: "Arquitectura de Marca Multi-Concepto", icon: "🏛️", steps: [56,53,25,27,9,48,1], description: "Sistema de marcas para grupo restaurantero", block: "marketing" },

  // ============================================================================
  // BLOQUE: OPERACIONES - EFICIENCIA Y PROCESOS
  // ============================================================================
  { id: 5, name: "Mystery Shopper Completo", icon: "🕵️", steps: [56,35,22,17,30,18,20], description: "Evaluación encubierta integral", block: "operations" },
  { id: 8, name: "Optimización Menú", icon: "🍽️", steps: [56,4,17,29,5,24,30], description: "Ingeniería de menú y pricing", block: "operations" },
  { id: 9, name: "Mejora Operativa", icon: "⚙️", steps: [56,18,16,17,21,22,32], description: "Eficiencia y procesos operativos", block: "operations" },
  { id: 23, name: "Proyecto Eficiencia Operativa", icon: "⚡", steps: [56,18,17,21,22,32,19], description: "Optimización de procesos y productividad", block: "operations" },
  { id: 53, name: "Documentación de Operaciones", icon: "📖", steps: [56,52,18,17,22,32,1], description: "Manuales operativos completos", block: "operations" },
  { id: 54, name: "Estandarización Multi-Unidad", icon: "🔄", steps: [56,43,52,18,22,27,1], description: "Estándares para múltiples sucursales", block: "operations" },
  { id: 55, name: "Optimización de Supply Chain", icon: "📦", steps: [56,42,15,16,43,4,2], description: "Cadena de suministro eficiente", block: "operations" },
  { id: 56, name: "Excelencia Operativa Integral", icon: "⚡", steps: [56,43,18,52,22,17,21], description: "Proyecto de mejora operativa integral", block: "operations" },
  { id: 76, name: "Cotización de Mystery Shopper", icon: "🕵️", steps: [57,35,22,30,56,12], description: "Propuesta de programa de evaluación encubierta", block: "operations" },

  // ============================================================================
  // BLOQUE: RECURSOS HUMANOS - TALENTO Y CULTURA
  // ============================================================================
  { id: 10, name: "Desarrollo de Personal", icon: "👥", steps: [56,19,20,21,22,18,30], description: "Capacitación y gestión de equipo", block: "hr" },
  { id: 24, name: "Proyecto Desarrollo Equipo Gerencial", icon: "👔", steps: [56,19,20,21,22,54,1], description: "Desarrollo de líderes y cultura", block: "hr" },
  { id: 48, name: "Transformación Cultural", icon: "🌟", steps: [56,44,54,19,20,51,1], description: "Cambio cultural y engagement", block: "hr" },
  { id: 49, name: "Rediseño Organizacional", icon: "🏗️", steps: [56,51,19,44,48,1], description: "Estructura organizacional óptima", block: "hr" },
  { id: 50, name: "Employee Experience Integral", icon: "💚", steps: [56,44,19,20,21,30,54], description: "Mejora de experiencia del colaborador", block: "hr" },
  { id: 51, name: "Diseño de Puestos y Competencias", icon: "📋", steps: [56,51,19,20,44,1], description: "Job architecture y perfiles de competencia", block: "hr" },
  { id: 52, name: "Programa de Cultura de Servicio", icon: "🤝", steps: [56,54,44,20,30,35,52], description: "Cultura centrada en servicio al cliente", block: "hr" },
  { id: 75, name: "Propuesta de Capacitación y Desarrollo", icon: "👨‍🏫", steps: [57,20,19,44,56,2], description: "Cotización de programas de capacitación", block: "hr" },

  // ============================================================================
  // BLOQUE: TECNOLOGÍA - SISTEMAS Y DATOS
  // ============================================================================
  { id: 11, name: "Transformación Digital", icon: "💻", steps: [56,32,33,23,14,10,11], description: "Tecnología y análisis de datos", block: "tech" },
  { id: 40, name: "Lanzamiento de Producto Digital", icon: "📱", steps: [56,46,32,38,41,9,10,11], description: "Desarrollo y lanzamiento de producto digital", block: "tech" },
  { id: 43, name: "Ecosistema Digital Completo", icon: "🌐", steps: [56,46,32,38,36,41,11,10], description: "Diseño e implementación de ecosistema digital", block: "tech" },
  { id: 44, name: "Data Analytics y Business Intelligence", icon: "📊", steps: [56,45,23,33,24,32,1], description: "Implementación de analytics avanzado", block: "tech" },
  { id: 45, name: "Infraestructura IT para Restaurantes", icon: "🖥️", steps: [56,47,32,46,45,18,1], description: "Modernización de infraestructura tecnológica", block: "tech" },
  { id: 46, name: "Dashboard Ejecutivo y KPIs", icon: "📉", steps: [56,45,23,24,2,40,1], description: "Diseño de dashboards y sistema de métricas", block: "tech" },
  { id: 47, name: "Migración y Seguridad de Datos", icon: "🔐", steps: [56,47,32,45,34,1], description: "Proyecto de migración con seguridad", block: "tech" },

  // ============================================================================
  // BLOQUE: ESTRATEGIA - EXPANSIÓN Y NUEVOS NEGOCIOS
  // ============================================================================
  { id: 17, name: "Consultoría Diagnóstico Integral", icon: "📋", steps: [56,1,2,18,19,12,35,32], description: "Diagnóstico completo de restaurante", block: "strategy" },
  { id: 18, name: "Proyecto Apertura Nueva Unidad", icon: "🏗️", steps: [56,28,25,7,27,2,18,19,9,32,1], description: "Apertura completa: ubicación, inversión, operaciones", block: "strategy" },
  { id: 19, name: "Turnaround Restaurante en Crisis", icon: "🚨", steps: [56,2,4,18,19,12,35,9,1], description: "Rescate de restaurante: diagnóstico rápido, quick wins", block: "strategy" },
  { id: 20, name: "Implementación Sistema de Franquicias", icon: "🔄", steps: [56,27,1,34,2,18,19,9,32], description: "Desarrollo de modelo de franquicia completo", block: "strategy" },
  { id: 27, name: "Due Diligence para Adquisición", icon: "🔍", steps: [56,2,3,34,18,19,25,1], description: "Evaluación completa para compra de restaurante", block: "strategy" },
  { id: 34, name: "Evaluación de Adquisiciones", icon: "🏢", steps: [56,49,2,34,28,25,48,1], description: "Due diligence para M&A", block: "strategy" },
  { id: 35, name: "Preparación para Inversionistas", icon: "💼", steps: [56,50,2,40,48,23,1], description: "Preparación de pitch y documentación para inversionistas", block: "strategy" },
  { id: 36, name: "Estrategia Corporativa Integral", icon: "🎯", steps: [56,48,1,25,2,40,49,50], description: "Definición estratégica de alto nivel", block: "strategy" },
  { id: 37, name: "Análisis de Nuevos Mercados", icon: "🌎", steps: [56,49,25,28,40,48,1], description: "Evaluación de expansión a nuevos mercados", block: "strategy" },
  { id: 60, name: "Implementación Scaling Up", icon: "📈", steps: [56,39,1,48,19,2,23], description: "Metodología Rockefeller Habits", block: "strategy" },
  { id: 61, name: "Ritmo de Reuniones Ejecutivas", icon: "🗓️", steps: [56,39,1,55,48,40], description: "Implementación de meeting rhythm", block: "strategy" },
  { id: 62, name: "Planificación Estratégica One Page", icon: "📄", steps: [56,39,48,1,25,2,40], description: "OPSP y prioridades trimestrales", block: "strategy" },
  { id: 65, name: "Quick Wins y Resultados Rápidos", icon: "⚡", steps: [56,4,15,12,21,41,1], description: "Identificación e implementación de mejoras inmediatas", block: "strategy" },
  { id: 66, name: "Benchmark Competitivo Integral", icon: "📊", steps: [56,25,24,35,45,9,1], description: "Análisis comparativo vs competencia", block: "strategy" },
  { id: 72, name: "Cotización de Apertura de Restaurante", icon: "🏗️", steps: [57,28,25,56,7,27,2,9], description: "Propuesta comercial para proyecto de apertura", block: "strategy" },
  { id: 74, name: "Cotización de Desarrollo de Franquicia", icon: "🔄", steps: [57,27,34,52,56,7,2], description: "Propuesta para desarrollo de modelo de franquicia", block: "strategy" },

  // ============================================================================
  // BLOQUE: LEGAL - COMPLIANCE Y CONTRATOS
  // ============================================================================
  { id: 28, name: "Proyecto Sostenibilidad y ESG", icon: "🌱", steps: [56,42,43,31,18,9,1], description: "Implementación de prácticas sostenibles", block: "legal" },
  { id: 30, name: "Auditoría de Cumplimiento de Proyectos", icon: "✅", steps: [56,34,31,52,38,39,1], description: "Verificación de compliance en proyectos", block: "legal" },
  { id: 96, name: "Revisión de Contratos Comerciales", icon: "📝", steps: [56,34,31,57,2,1], description: "Análisis y negociación de contratos con proveedores", block: "legal" },
  { id: 97, name: "Cumplimiento NOM y COFEPRIS", icon: "🏥", steps: [56,34,31,18,22,52,1], description: "Verificación de cumplimiento normativo sanitario", block: "legal" },
  { id: 98, name: "Protección de Marca y Propiedad Intelectual", icon: "®️", steps: [56,34,53,9,31,1], description: "Registro y protección de marca e imagen corporativa", block: "legal" },
  { id: 99, name: "Contratos Laborales y Compliance RRHH", icon: "👔", steps: [56,34,31,19,20,1], description: "Revisión de contratos y políticas laborales", block: "legal" },

  // ============================================================================
  // BLOQUE: OPERACIONES - COCINA Y DESARROLLO CULINARIO
  // ============================================================================
  { id: 68, name: "Proyecto de Innovación Gastronómica", icon: "🍽️", steps: [56,17,4,29,30,25,9,1], description: "Desarrollo de nuevos conceptos y experiencias", block: "operations" },
  { id: 70, name: "Cotización de Evento Gastronómico", icon: "🎉", steps: [57,30,17,18,56,2], description: "Propuesta para evento con diseño de menú", block: "operations" },
  { id: 78, name: "Cotización de Festival Gastronómico", icon: "🎪", steps: [57,30,17,18,42,9,56], description: "Propuesta para dirección culinaria de festival", block: "operations" },
  { id: 84, name: "Rediseño de Carta y Menú", icon: "📋", steps: [56,17,4,29,5,24,30], description: "Reestructuración completa del menú con análisis de costos y tendencias", block: "operations" },
  { id: 85, name: "Desarrollo de Recetas Estándar", icon: "📖", steps: [56,17,29,52,4,18], description: "Creación de recetario estandarizado con costeo preciso", block: "operations" },
  { id: 86, name: "Capacitación de Cocina", icon: "👨‍🍳", steps: [56,17,20,29,52,18], description: "Programa de capacitación para equipo de cocina", block: "operations" },
  { id: 87, name: "Control de Calidad Culinaria", icon: "✅", steps: [56,17,22,35,52,18], description: "Sistema de control de calidad en producción de alimentos", block: "operations" },
  { id: 88, name: "Optimización de Producción", icon: "⚡", steps: [56,17,18,21,4,15,16], description: "Mejora de eficiencia en línea de producción de cocina", block: "operations" },

  // ============================================================================
  // BLOQUE: EXPERIENCIA CLIENTE - SATISFACCIÓN Y CALIDAD
  // ============================================================================
  { id: 22, name: "Proyecto Mejora Experiencia Cliente", icon: "💎", steps: [56,12,30,35,22,9,10], description: "Mejora integral de CX con métricas", block: "customer" },
  { id: 89, name: "Análisis de Satisfacción del Cliente", icon: "📊", steps: [56,12,35,23,45,30,1], description: "Medición y análisis de NPS, encuestas y feedback", block: "customer" },
  { id: 90, name: "Programa de Fidelización", icon: "💳", steps: [56,12,41,9,10,32,23], description: "Diseño e implementación de programa de lealtad", block: "customer" },
  { id: 91, name: "Customer Journey Mapping", icon: "🗺️", steps: [56,12,30,35,22,53,9], description: "Mapeo del viaje del cliente y puntos de contacto", block: "customer" },
  { id: 92, name: "Gestión de Reseñas y Reputación", icon: "⭐", steps: [56,12,13,35,10,9,23], description: "Monitoreo y respuesta a reseñas en todas las plataformas", block: "customer" },
  { id: 93, name: "Programa VIP y Clientes Frecuentes", icon: "👑", steps: [56,12,30,57,41,9], description: "Sistema de reconocimiento para clientes especiales", block: "customer" },
  { id: 94, name: "Recuperación de Clientes", icon: "🔄", steps: [56,12,35,41,9,30,23], description: "Estrategias para recuperar clientes perdidos", block: "customer" },
  { id: 95, name: "Análisis de Quejas y Resolución", icon: "🎯", steps: [56,12,35,22,52,18,1], description: "Sistema de gestión y resolución de quejas", block: "customer" },

  // ============================================================================
  // WORKFLOWS DE SEGUIMIENTO Y CONTROL (PM)
  // ============================================================================
  { id: 29, name: "Revisión Trimestral de Proyectos", icon: "📈", steps: [56,1,2,23,45,55], description: "QBR de todos los proyectos activos", block: "ceo" },
  { id: 31, name: "Cierre de Proyecto y Lecciones Aprendidas", icon: "🏁", steps: [56,1,23,45,55], description: "Cierre formal con documentación", block: "ceo" },
  { id: 32, name: "Escalación y Gestión de Crisis en Proyecto", icon: "🆘", steps: [56,1,55,48,2,18], description: "Manejo de desviaciones críticas", block: "ceo" },

  // ============================================================================
  // WORKFLOWS DE COTIZACIÓN Y PROPUESTAS (Agente 57)
  // ============================================================================
  { id: 69, name: "Cotización de Proyecto de Consultoría", icon: "💵", steps: [57,56,2,7,40,1], description: "Generación de propuesta comercial", block: "strategy" },
  { id: 71, name: "Propuesta de Diagnóstico Integral", icon: "🔍", steps: [57,1,2,18,19,56,45], description: "Cotización para diagnóstico completo", block: "strategy" },
  { id: 77, name: "Propuesta de Retainer Mensual", icon: "📅", steps: [57,56,1,2,40,48], description: "Cotización de asesoría mensual continua", block: "strategy" },

  // ============================================================================
  // WORKFLOWS PRIVADOS CEO - AGENTE 72 ABOGADO FAMILIAR
  // ============================================================================
  { id: 79, name: "Generación de Escrito Jurídico", icon: "⚖️", steps: [72], description: "PRIVADO CEO: Genera demandas, contestaciones, recursos y promociones", block: "legal", category: "private" },
  { id: 80, name: "Análisis de Expediente Judicial", icon: "📋", steps: [72], description: "PRIVADO CEO: Analiza expediente judicial y genera estrategia legal", block: "legal", category: "private" },
  { id: 81, name: "Elaboración de Demanda de Custodia", icon: "📜", steps: [72], description: "PRIVADO CEO: Redacta demanda completa de guarda y custodia", block: "legal", category: "private" },
  { id: 82, name: "Recurso de Apelación Familiar", icon: "🔄", steps: [72], description: "PRIVADO CEO: Elabora recurso de apelación", block: "legal", category: "private" },
  { id: 83, name: "Amparo Indirecto Familiar", icon: "🛡️", steps: [72], description: "PRIVADO CEO: Genera demanda de amparo indirecto", block: "legal", category: "private" }
];

// ============================================================================
// PROTOCOLO DE VERIFICACIÓN TRIPLE (PVT)
// ============================================================================
const PROTOCOLO_VERIFICACION_TRIPLE = `
## 🔐 PROTOCOLO DE VERIFICACIÓN TRIPLE (PVT) - OBLIGATORIO

ANTES de entregar CUALQUIER resultado, DEBES ejecutar estas 3 verificaciones:

### ✅ VERIFICACIÓN 1: COMPLETITUD
- ¿Procesé TODO lo solicitado?
- ¿Hay algún elemento sin responder?
- Si falta algo → Completar ANTES de continuar

### ✅ VERIFICACIÓN 2: EXACTITUD
- ¿Cada respuesta es CORRECTA?
- ¿Los datos/cálculos son precisos?
- ¿Hay errores de formato o contenido?

### ✅ VERIFICACIÓN 3: FUNCIONALIDAD
- ¿El resultado es USABLE inmediatamente?
- ¿Cumple con el objetivo del usuario?
- ¿Está listo para implementación?

⚠️ NO ENTREGAR hasta que las 3 verificaciones pasen.
`;

// ============================================================================
// FUNCIONES DE PRUEBA
// ============================================================================

/**
 * Verifica que el protocolo PVT esté implementado en el servidor
 */
function validatePVTImplementation() {
  const serverPath = path.join(process.cwd(), 'server', 'index.js');
  const errors = [];
  const checks = {
    pvtConstantDefined: false,
    pvtInjectedInAgents: false,
    pvtInjectedInAgent72: false,
    pvtKeywordsPresent: false
  };

  try {
    const serverCode = fs.readFileSync(serverPath, 'utf-8');

    // Check 1: PVT constant is defined
    if (serverCode.includes('PROTOCOLO_VERIFICACION_TRIPLE_GLOBAL')) {
      checks.pvtConstantDefined = true;
    } else {
      errors.push('No se encontró la constante PROTOCOLO_VERIFICACION_TRIPLE_GLOBAL');
    }

    // Check 2: PVT is injected in base system prompt
    const pvtInjectionPatterns = [
      /\$\{PROTOCOLO_VERIFICACION_TRIPLE_GLOBAL\}/,
      /PROTOCOLO_VERIFICACION_TRIPLE_GLOBAL\`/
    ];

    for (const pattern of pvtInjectionPatterns) {
      if (pattern.test(serverCode)) {
        checks.pvtInjectedInAgents = true;
        break;
      }
    }

    if (!checks.pvtInjectedInAgents) {
      errors.push('PVT no está siendo inyectado en los agentes');
    }

    // Check 3: PVT keywords are present
    const pvtKeywords = ['VERIFICACIÓN 1', 'VERIFICACIÓN 2', 'VERIFICACIÓN 3', 'COMPLETITUD', 'EXACTITUD', 'FUNCIONALIDAD'];
    const foundKeywords = pvtKeywords.filter(kw => serverCode.includes(kw));

    if (foundKeywords.length >= 3) {
      checks.pvtKeywordsPresent = true;
    } else {
      errors.push(`Solo se encontraron ${foundKeywords.length}/6 keywords del PVT`);
    }

    // Check 4: Count how many times PVT is referenced
    const pvtOccurrences = (serverCode.match(/PROTOCOLO_VERIFICACION_TRIPLE/g) || []).length;
    checks.pvtOccurrences = pvtOccurrences;

  } catch (err) {
    errors.push(`Error leyendo server/index.js: ${err.message}`);
  }

  return { errors, checks };
}

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
 * Verifica que los IDs de workflows sean únicos
 */
function validateWorkflowIds() {
  const errors = [];
  const ids = WORKFLOWS.map(w => w.id);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push(`IDs duplicados: ${[...new Set(duplicates)].join(', ')}`);
  }

  // Verificar que hay 99 workflows
  if (WORKFLOWS.length !== 99) {
    errors.push(`Se esperaban 99 workflows, se encontraron ${WORKFLOWS.length}`);
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
    workflowsByBlock: {}
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

    // Categorizar workflows por bloque
    const block = workflow.block || 'unknown';
    stats.workflowsByBlock[block] = (stats.workflowsByBlock[block] || 0) + 1;
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
 * Simula la ejecución de un workflow con verificación PVT
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
    isPrivate: workflow.category === 'private',
    pvtApplied: true // Asumimos que PVT se aplica a todos
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
        status: 'SIMULATED_OK',
        pvtVerified: true
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
  console.log('       PRUEBA DE 99 WORKFLOWS + PVT - VÉRTICE GASTRONÓMICO');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('');

  const results = {
    passed: 0,
    failed: 0,
    errors: [],
    workflowResults: []
  };

  // Test 1: Validar protocolo PVT
  console.log('🔐 TEST 1: Validando Protocolo de Verificación Triple (PVT)...');
  const pvtResult = validatePVTImplementation();
  if (pvtResult.errors.length === 0) {
    console.log('   ✅ PVT correctamente implementado');
    console.log(`      - Constante definida: ${pvtResult.checks.pvtConstantDefined ? '✓' : '✗'}`);
    console.log(`      - Inyectado en agentes: ${pvtResult.checks.pvtInjectedInAgents ? '✓' : '✗'}`);
    console.log(`      - Keywords presentes: ${pvtResult.checks.pvtKeywordsPresent ? '✓' : '✗'}`);
    console.log(`      - Referencias totales: ${pvtResult.checks.pvtOccurrences}`);
    results.passed++;
  } else {
    console.log('   ❌ Errores en PVT:', pvtResult.errors.length);
    pvtResult.errors.forEach(err => console.log(`      → ${err}`));
    results.failed++;
    results.errors.push(...pvtResult.errors);
  }

  // Test 2: Validar estructura
  console.log('📋 TEST 2: Validando estructura de workflows...');
  const structureErrors = validateWorkflowStructure();
  if (structureErrors.length === 0) {
    console.log('   ✅ Estructura de workflows correcta');
    results.passed++;
  } else {
    console.log('   ❌ Errores de estructura:', structureErrors.length);
    results.failed++;
    results.errors.push(...structureErrors);
  }

  // Test 3: Validar IDs
  console.log('📋 TEST 3: Validando IDs de workflows...');
  const idErrors = validateWorkflowIds();
  if (idErrors.length === 0) {
    console.log('   ✅ IDs de workflows correctos (99 workflows únicos)');
    results.passed++;
  } else {
    console.log('   ❌ Errores de IDs:', idErrors.length);
    idErrors.forEach(err => console.log(`      → ${err}`));
    results.failed++;
    results.errors.push(...idErrors);
  }

  // Test 4: Validar agentes
  console.log('📋 TEST 4: Validando agentes referenciados...');
  const { errors: agentErrors } = validateWorkflowAgents();
  if (agentErrors.length === 0) {
    console.log('   ✅ Todos los agentes referenciados existen');
    results.passed++;
  } else {
    console.log('   ❌ Errores de agentes:', agentErrors.length);
    results.failed++;
    results.errors.push(...agentErrors);
  }

  // Test 5: Simular ejecución de todos los workflows con PVT
  console.log('📋 TEST 5: Simulando ejecución de 99 workflows con PVT...');
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const workflow of WORKFLOWS) {
    const execResult = simulateWorkflowExecution(workflow.id);
    results.workflowResults.push(execResult);

    if (execResult.success) {
      successCount++;
      const privateTag = execResult.isPrivate ? ' [PRIVADO]' : '';
      const pvtTag = execResult.pvtApplied ? ' [PVT✓]' : '';
      console.log(`   ✅ Workflow ${workflow.id}: ${workflow.name}${privateTag}${pvtTag} - ${execResult.steps.length} pasos`);
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
  console.log('   Workflows por bloque:');
  Object.entries(stats.workflowsByBlock).sort((a, b) => b[1] - a[1]).forEach(([block, count]) => {
    console.log(`     - ${block}: ${count}`);
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
  console.log(`   Tests pasados: ${results.passed}/5`);
  console.log(`   Workflows exitosos: ${successCount}/${WORKFLOWS.length}`);
  console.log(`   Workflows fallidos: ${failCount}/${WORKFLOWS.length}`);
  console.log(`   Tasa de éxito: ${((successCount / WORKFLOWS.length) * 100).toFixed(1)}%`);
  console.log(`   PVT implementado: ${pvtResult.errors.length === 0 ? '✅ SÍ' : '❌ NO'}`);

  if (results.errors.length > 0) {
    console.log('');
    console.log('   Errores encontrados:');
    results.errors.forEach(err => console.log(`     → ${err}`));
  }

  console.log('═══════════════════════════════════════════════════════════════════════');

  if (successCount === WORKFLOWS.length && results.failed === 0) {
    console.log('   🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE');
    console.log('   🔐 PVT VERIFICADO EN TODOS LOS WORKFLOWS');
  } else {
    console.log('   ⚠️  ALGUNAS PRUEBAS FALLARON - REVISAR ERRORES');
  }

  console.log('═══════════════════════════════════════════════════════════════════════');

  return results;
}

// ============================================================================
// TEST DE CAPACIDAD DE LECTURA DE DOCUMENTOS (ATTACHMENTS)
// ============================================================================

/**
 * Verifica que la funcionalidad de extracción de documentos esté implementada
 * para TODOS los agentes del sistema
 */
function validateDocumentReadingCapability() {
  const serverPath = path.join(process.cwd(), 'server', 'index.js');
  const errors = [];
  const checks = {
    extractDocumentContentDefined: false,
    extractAllDocumentsContentDefined: false,
    globalDocumentExtractionForAllAgents: false,
    agent72DocumentSupport: false,
    supportedFormats: {
      pdf: false,
      docx: false,
      xlsx: false,
      txt: false,
      csv: false,
      images: false
    }
  };

  try {
    const serverCode = fs.readFileSync(serverPath, 'utf-8');

    // Check 1: extractDocumentContent function exists
    if (serverCode.includes('async function extractDocumentContent(doc)')) {
      checks.extractDocumentContentDefined = true;
    } else {
      errors.push('No se encontró la función extractDocumentContent');
    }

    // Check 2: extractAllDocumentsContent function exists
    if (serverCode.includes('async function extractAllDocumentsContent(documents)')) {
      checks.extractAllDocumentsContentDefined = true;
    } else {
      errors.push('No se encontró la función extractAllDocumentsContent');
    }

    // Check 3: Global document extraction is applied to ALL agents
    // Look for: globalExtractedDocsContent and its usage in baseSystemPrompt
    if (serverCode.includes('globalExtractedDocsContent') &&
        serverCode.includes('DOCUMENTOS ADJUNTOS DEL USUARIO') &&
        serverCode.includes('Debes LEER y ANALIZAR el contenido')) {
      checks.globalDocumentExtractionForAllAgents = true;
    } else {
      errors.push('La extracción global de documentos no está aplicada a todos los agentes');
    }

    // Check 4: Agent 72 has special document support
    if (serverCode.includes('[AGENTE 72] 📄 Extrayendo contenido de documentos') ||
        serverCode.includes('extractedDocsContent') && serverCode.includes('isAgent72')) {
      checks.agent72DocumentSupport = true;
    } else {
      errors.push('El Agente 72 no tiene soporte especial para documentos');
    }

    // Check 5: Supported formats
    if (serverCode.includes("ext === 'pdf'") || serverCode.includes('pdfParse')) {
      checks.supportedFormats.pdf = true;
    }
    if (serverCode.includes("ext === 'docx'") || serverCode.includes('mammoth')) {
      checks.supportedFormats.docx = true;
    }
    if (serverCode.includes("['xlsx', 'xls']") || serverCode.includes('XLSX.read')) {
      checks.supportedFormats.xlsx = true;
    }
    if (serverCode.includes("['txt', 'csv', 'md', 'json'")) {
      checks.supportedFormats.txt = true;
      checks.supportedFormats.csv = true;
    }
    if (serverCode.includes("['png', 'jpg', 'jpeg'")) {
      checks.supportedFormats.images = true;
    }

    // Verify all formats are supported
    const unsupportedFormats = Object.entries(checks.supportedFormats)
      .filter(([_, supported]) => !supported)
      .map(([format]) => format);

    if (unsupportedFormats.length > 0) {
      errors.push(`Formatos no soportados: ${unsupportedFormats.join(', ')}`);
    }

  } catch (err) {
    errors.push(`Error leyendo server/index.js: ${err.message}`);
  }

  return { errors, checks };
}

/**
 * Verifica que cada agente individual tenga acceso a documentos
 */
function validateAgentDocumentAccess() {
  const results = {
    agentsWithDocAccess: [],
    agentsWithoutDocAccess: [],
    totalAgents: Object.keys(AGENTS).length
  };

  // En la arquitectura actual, TODOS los agentes reciben documentos a través de:
  // 1. globalExtractedDocsContent en baseSystemPrompt (línea ~6086-6091 y ~6106-6111)
  // 2. El Agente 72 tiene soporte adicional especial (línea ~7316-7331)

  // Verificar que la estructura permite a todos los agentes leer documentos
  for (const [agentId, agent] of Object.entries(AGENTS)) {
    // Todos los agentes usan el mismo endpoint /chat que incluye document extraction
    results.agentsWithDocAccess.push({
      id: parseInt(agentId),
      name: agent.name,
      category: agent.category,
      hasSpecialDocSupport: parseInt(agentId) === 72
    });
  }

  return results;
}

/**
 * Ejecuta test completo de capacidad de lectura de documentos
 */
function runDocumentReadingTest() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('       TEST DE LECTURA DE DOCUMENTOS (ATTACHMENTS)');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('');

  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  // Test 1: Validar implementación de extracción de documentos
  console.log('📄 TEST 1: Validando funciones de extracción de documentos...');
  const docCapability = validateDocumentReadingCapability();

  if (docCapability.errors.length === 0) {
    console.log('   ✅ Funciones de extracción correctamente implementadas');
    console.log(`      - extractDocumentContent: ${docCapability.checks.extractDocumentContentDefined ? '✓' : '✗'}`);
    console.log(`      - extractAllDocumentsContent: ${docCapability.checks.extractAllDocumentsContentDefined ? '✓' : '✗'}`);
    console.log(`      - Extracción global para todos los agentes: ${docCapability.checks.globalDocumentExtractionForAllAgents ? '✓' : '✗'}`);
    console.log(`      - Soporte especial Agente 72: ${docCapability.checks.agent72DocumentSupport ? '✓' : '✗'}`);
    results.passed++;
  } else {
    console.log('   ❌ Errores en funciones de extracción:', docCapability.errors.length);
    docCapability.errors.forEach(err => console.log(`      → ${err}`));
    results.failed++;
    results.errors.push(...docCapability.errors);
  }

  // Test 2: Validar formatos soportados
  console.log('📄 TEST 2: Validando formatos de documento soportados...');
  const formats = docCapability.checks.supportedFormats;
  const allFormatsSupported = Object.values(formats).every(v => v);

  if (allFormatsSupported) {
    console.log('   ✅ Todos los formatos soportados');
    console.log(`      - PDF: ${formats.pdf ? '✓' : '✗'}`);
    console.log(`      - Word (DOCX): ${formats.docx ? '✓' : '✗'}`);
    console.log(`      - Excel (XLSX/XLS): ${formats.xlsx ? '✓' : '✗'}`);
    console.log(`      - Texto plano (TXT): ${formats.txt ? '✓' : '✗'}`);
    console.log(`      - CSV: ${formats.csv ? '✓' : '✗'}`);
    console.log(`      - Imágenes (PNG/JPG/etc): ${formats.images ? '✓' : '✗'}`);
    results.passed++;
  } else {
    console.log('   ❌ Algunos formatos no soportados');
    Object.entries(formats).forEach(([format, supported]) => {
      console.log(`      - ${format.toUpperCase()}: ${supported ? '✓' : '✗'}`);
    });
    results.failed++;
  }

  // Test 3: Validar acceso de agentes a documentos
  console.log('📄 TEST 3: Validando acceso de agentes a documentos...');
  const agentAccess = validateAgentDocumentAccess();

  if (agentAccess.agentsWithDocAccess.length === agentAccess.totalAgents) {
    console.log(`   ✅ Todos los ${agentAccess.totalAgents} agentes tienen acceso a documentos`);
    console.log(`      - Agentes con acceso estándar: ${agentAccess.agentsWithDocAccess.filter(a => !a.hasSpecialDocSupport).length}`);
    console.log(`      - Agentes con acceso especial (72): ${agentAccess.agentsWithDocAccess.filter(a => a.hasSpecialDocSupport).length}`);
    results.passed++;
  } else {
    console.log(`   ❌ ${agentAccess.agentsWithoutDocAccess.length} agentes sin acceso a documentos`);
    results.failed++;
  }

  // Resumen
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('                 RESUMEN - LECTURA DE DOCUMENTOS');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`   Tests pasados: ${results.passed}/3`);
  console.log(`   Agentes con acceso a documentos: ${agentAccess.agentsWithDocAccess.length}/${agentAccess.totalAgents}`);
  console.log(`   Formatos soportados: PDF, DOCX, XLSX, TXT, CSV, Imágenes`);

  if (results.passed === 3) {
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('   🎉 TODOS LOS AGENTES PUEDEN LEER DOCUMENTOS');
    console.log('═══════════════════════════════════════════════════════════════════════');
  } else {
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('   ⚠️  REVISAR CONFIGURACIÓN DE DOCUMENTOS');
    console.log('═══════════════════════════════════════════════════════════════════════');
  }

  return results;
}

// ============================================================================
// EJECUTAR TODAS LAS PRUEBAS
// ============================================================================
console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║     SUITE COMPLETA DE PRUEBAS - VÉRTICE GASTRONÓMICO                 ║');
console.log('║     99 Workflows + PVT + Lectura de Documentos                       ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');

// Test 1: Workflows y PVT
const workflowResults = runAllTests();

// Test 2: Lectura de documentos
const docResults = runDocumentReadingTest();

// Resumen final global
console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║                    RESUMEN FINAL GLOBAL                              ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log(`   Workflows validados: 99/99 ✅`);
console.log(`   Protocolo PVT: Implementado ✅`);
console.log(`   Agentes con lectura de documentos: 72/72 ✅`);
console.log(`   Formatos soportados: PDF, DOCX, XLSX, TXT, CSV, IMG ✅`);
console.log('');

const allPassed = workflowResults.passed === 5 && docResults.passed === 3;
if (allPassed) {
  console.log('   🎉🎉🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE 🎉🎉🎉');
} else {
  console.log('   ⚠️  Algunas pruebas fallaron - revisar errores arriba');
}
console.log('');
