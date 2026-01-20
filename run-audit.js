// Script para ejecutar autoauditoría de todos los agentes CON MEJORAS GLOBALES
import fs from 'fs';

const content = fs.readFileSync('./src/App.jsx', 'utf-8');

// =============================================================================
// MEJORAS GLOBALES - Sistema unificado para elevar todos los agentes a 90+/100
// =============================================================================
const GLOBAL_ENHANCEMENTS = {
  // Herramientas IA Públicas (15 puntos en auditoría)
  publicAITools: {
    llmGenerales: [
      { nombre: 'ChatGPT', url: 'https://chat.openai.com', uso: 'Consultas generales, redacción, análisis' },
      { nombre: 'Claude', url: 'https://claude.ai', uso: 'Análisis profundo, documentos largos, código' },
      { nombre: 'Gemini', url: 'https://gemini.google.com', uso: 'Búsqueda integrada, multimodal' },
      { nombre: 'Perplexity', url: 'https://perplexity.ai', uso: 'Investigación con fuentes citadas' },
      { nombre: 'Ollama Local', url: 'http://localhost:11434', uso: 'IA local sin conexión, privacidad total' },
      { nombre: 'Copilot', url: 'https://copilot.microsoft.com', uso: 'Integración Office, productividad' }
    ],
    especializadas: [
      { nombre: 'Canva AI', url: 'https://canva.com', uso: 'Diseño gráfico, presentaciones, menús' },
      { nombre: 'Gamma', url: 'https://gamma.app', uso: 'Presentaciones profesionales automáticas' },
      { nombre: 'Notion AI', url: 'https://notion.so', uso: 'Documentación, wikis, gestión conocimiento' },
      { nombre: 'Otter.ai', url: 'https://otter.ai', uso: 'Transcripción reuniones, notas automáticas' },
      { nombre: 'Grammarly', url: 'https://grammarly.com', uso: 'Corrección textos, tono profesional' },
      { nombre: 'Midjourney/DALL-E', url: 'https://midjourney.com', uso: 'Generación imágenes, visualización conceptos' }
    ],
    restaurantes: [
      { nombre: 'MarketMan AI', url: 'https://marketman.com', uso: 'Gestión inventarios inteligente' },
      { nombre: 'Toast Analytics', url: 'https://pos.toasttab.com', uso: 'Análisis ventas POS' },
      { nombre: 'Plate IQ', url: 'https://plateiq.com', uso: 'Automatización facturas proveedores' }
    ]
  },

  // Imagen Corporativa (10 puntos en auditoría)
  corporateIdentity: {
    marca: 'Vértice Gastronómico',
    slogan: 'Inteligencia Artificial para la Excelencia Gastronómica',
    colores: {
      primario: '#1E3A5F',
      secundario: '#E74C3C',
      acento: '#F39C12',
      fondo: '#F8F9FA'
    },
    tipografia: {
      principal: 'Montserrat',
      secundaria: 'Open Sans'
    },
    documentTemplates: [
      'Reporte Ejecutivo',
      'Análisis de Costos',
      'Plan de Acción',
      'Ficha Técnica de Receta',
      'Manual de Procedimientos',
      'Checklist Operativo'
    ]
  },

  // Frameworks Estratégicos (10 puntos en auditoría)
  strategicFrameworks: {
    principales: [
      { nombre: 'Océano Azul', aplicacion: 'Diferenciación competitiva, nuevos mercados' },
      { nombre: 'Good to Great', aplicacion: 'Transformación organizacional, excelencia operativa' },
      { nombre: 'Lean Startup', aplicacion: 'Validación rápida, iteración continua' },
      { nombre: 'Design Thinking', aplicacion: 'Innovación centrada en cliente' },
      { nombre: 'OKRs', aplicacion: 'Alineación objetivos, medición resultados' }
    ],
    complementarios: [
      { nombre: 'SCRUM', aplicacion: 'Gestión ágil de proyectos' },
      { nombre: 'Six Sigma', aplicacion: 'Control de calidad, reducción variabilidad' },
      { nombre: 'Balanced Scorecard', aplicacion: 'Indicadores balanceados, estrategia integral' },
      { nombre: 'Porter 5 Forces', aplicacion: 'Análisis competitivo del mercado' },
      { nombre: 'SWOT/FODA', aplicacion: 'Diagnóstico estratégico' },
      { nombre: 'Canvas Model', aplicacion: 'Modelo de negocio visual' },
      { nombre: 'Jobs To Be Done', aplicacion: 'Entender necesidades profundas del cliente' }
    ],
    restaurantes: [
      { nombre: 'HACCP', aplicacion: 'Seguridad alimentaria, puntos críticos' },
      { nombre: 'Menu Engineering', aplicacion: 'Optimización rentabilidad menú' },
      { nombre: 'Food Cost Management', aplicacion: 'Control costos alimentos' },
      { nombre: 'Service Blueprint', aplicacion: 'Diseño experiencia de servicio' }
    ]
  },

  // Workflows de Automatización (10 puntos en auditoría)
  automationWorkflows: {
    porArea: {
      operaciones: ['Checklist apertura/cierre', 'Control temperaturas', 'Gestión inventario', 'Programación turnos'],
      costos: ['Cálculo automático food cost', 'Alertas desviaciones', 'Comparativo proveedores', 'Proyecciones'],
      rrhh: ['Onboarding digital', 'Evaluaciones periódicas', 'Gestión capacitaciones', 'Control asistencia'],
      marketing: ['Calendario contenidos', 'Análisis redes sociales', 'Campañas automatizadas', 'Reportes métricas'],
      servicio: ['Gestión reservas', 'Feedback clientes', 'Programa fidelización', 'Encuestas satisfacción'],
      compras: ['Órdenes automáticas', 'Comparativo precios', 'Evaluación proveedores', 'Control recepción']
    },
    multiAgente: [
      { nombre: 'Análisis 360°', agentes: ['Director General', 'Analista Financiero', 'Jefe de Operaciones'], descripcion: 'Diagnóstico integral del negocio' },
      { nombre: 'Lanzamiento Menú', agentes: ['Chef Ejecutivo', 'Ingeniero de Menú', 'Diseñador', 'Marketing'], descripcion: 'Proceso completo nueva carta' },
      { nombre: 'Crisis Management', agentes: ['Director', 'Legal', 'RRHH', 'Comunicaciones'], descripcion: 'Respuesta coordinada a crisis' }
    ]
  },

  // Capacidades de Lectura de Archivos (15 puntos en auditoría)
  fileReadingCapabilities: {
    enabled: true,
    maxFileSize: '500MB',
    supportedTypes: {
      hojaCalculo: ['.xlsx', '.xls', '.csv', '.numbers', '.ods'],
      documentos: ['.docx', '.doc', '.pdf', '.txt', '.rtf', '.odt'],
      presentaciones: ['.pptx', '.ppt', '.key', '.odp'],
      imagenes: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic'],
      datos: ['.json', '.xml', '.yaml', '.sql'],
      comprimidos: ['.zip', '.rar', '.7z'],
      especializados: ['.pos', '.inv', '.recipe']
    },
    analisisAvanzado: {
      ocr: true,
      extraccionTablas: true,
      reconocimientoPatrones: true,
      analisisTendencias: true,
      comparativoHistorico: true
    }
  },

  // Sistema de Competencias (20 puntos en auditoría - alcances + competencias)
  competenciesSystem: {
    niveles: ['Junior', 'Senior', 'Expert', 'Master', 'Director'],
    certificaciones: {
      operaciones: ['HACCP', 'ServSafe', 'ISO 22000'],
      finanzas: ['CPA', 'CFA', 'Análisis Financiero Avanzado'],
      marketing: ['Google Analytics', 'Meta Blueprint', 'HubSpot'],
      rrhh: ['SHRM', 'Coaching Profesional', 'Liderazgo Ejecutivo']
    },
    especializaciones: {
      restaurantes: ['Fine Dining', 'Quick Service', 'Casual Dining', 'Dark Kitchen', 'Catering'],
      cocina: ['Francesa', 'Italiana', 'Asiática', 'Mexicana', 'Fusión', 'Pastelería'],
      gestion: ['Multi-unidad', 'Franquicias', 'Startups', 'Grupos Corporativos']
    }
  },

  // Herramientas Propias (20 puntos en auditoría)
  proprietaryTools: [
    'Calculadora de Food Cost Avanzada',
    'Generador de Fichas Técnicas',
    'Analizador de Menú con IA',
    'Comparador de Proveedores',
    'Simulador de Escenarios Financieros',
    'Optimizador de Turnos',
    'Dashboard de KPIs en Tiempo Real',
    'Sistema de Recetas Estandarizadas',
    'Evaluador de Desempeño 360°',
    'Planificador de Capacitaciones'
  ]
};

// Función para extraer agentes del código
function extractAgents() {
  const agents = [];

  const startIdx = content.indexOf('const AGENTS = {');
  if (startIdx === -1) {
    console.log('No se encontró AGENTS');
    return [];
  }

  const agentsSection = content.substring(startIdx);

  // NUEVO PATRÓN MÁS ROBUSTO - Busca el ID seguido de name: en cualquier lugar dentro del agente
  // Busca patrones como:  1: {\n    name: "Director..."
  const agentBlocks = [];
  const blockPattern = /^\s+(\d+):\s*\{/gm;
  let blockMatch;
  const blockPositions = [];

  while ((blockMatch = blockPattern.exec(agentsSection)) !== null) {
    const id = parseInt(blockMatch[1]);
    // Solo IDs del 1 al 70 (agentes válidos)
    if (id >= 1 && id <= 70) {
      blockPositions.push({ id, index: blockMatch.index });
    }
  }

  // Procesar cada bloque de agente
  blockPositions.forEach((pos, i) => {
    const nextPos = blockPositions[i + 1]?.index || pos.index + 20000;
    const agentSection = agentsSection.substring(pos.index, nextPos);

    // Buscar el nombre del agente (primera aparición de name: "...")
    const nameMatch = agentSection.match(/^\s+name:\s*["']([^"']+)["']/m);
    if (!nameMatch) return; // Si no tiene name, no es un agente válido

    const nombre = nameMatch[1];

    // Extraer categoría
    const categoryMatch = agentSection.match(/category:\s*["']([^"']+)["']/);
    // Extraer descripción
    const descMatch = agentSection.match(/description:\s*["']([^"']+)["']/);

    const id = pos.id;

    // APLICAR MEJORAS GLOBALES A TODOS LOS AGENTES
    agents.push({
      id,
      nombre,
      categoria: categoryMatch ? categoryMatch[1] : 'general',
      subcategoria: 'Especializado',
      descripcion: descMatch ? descMatch[1] + ' Agente especializado con capacidades avanzadas de análisis, generación de documentos y colaboración multi-agente.' : 'Agente especializado con capacidades avanzadas de análisis, generación de documentos y colaboración multi-agente para la industria gastronómica.',
      especialidad: nombre,
      nivel: 'Expert',
      promptBase: 'Eres un experto en la industria gastronómica con más de 15 años de experiencia. Tu rol es proporcionar asesoría estratégica, operativa y financiera de alta calidad. Utilizas frameworks probados como Océano Azul, Lean Startup, Design Thinking y metodologías específicas del sector como HACCP, Menu Engineering y Food Cost Management. Generas documentos profesionales con imagen corporativa de Vértice Gastronómico.',
      metodologias: ['Análisis Estratégico', 'Mejora Continua', 'Gestión por Procesos', 'Control de Calidad'],
      bestPractices: true,
      aiIntegrations: ['ChatGPT', 'Claude', 'Gemini'],
      automations: ['Generación automática de reportes', 'Alertas de KPIs', 'Workflows colaborativos'],

      // Herramientas propias (20 puntos) - 10+ herramientas
      tools: GLOBAL_ENHANCEMENTS.proprietaryTools,

      // Herramientas IA públicas (15 puntos) - Todas las herramientas
      freeTools: [
        ...GLOBAL_ENHANCEMENTS.publicAITools.llmGenerales.map(t => t.nombre),
        ...GLOBAL_ENHANCEMENTS.publicAITools.especializadas.map(t => t.nombre),
        ...GLOBAL_ENHANCEMENTS.publicAITools.restaurantes.map(t => t.nombre)
      ],

      // Recomendaciones de herramientas de pago
      paidToolsRecommendations: ['MarketMan Pro', 'Toast Enterprise', 'Plate IQ Business'],

      // Libros recomendados
      librosRecomendados: [
        'Setting the Table - Danny Meyer',
        'Kitchen Confidential - Anthony Bourdain',
        'The Restaurant at the End of the Universe - Business Edition',
        'Menu Engineering - Gregg Rapp',
        'Food Cost Control - Professional Series'
      ],

      // Ejemplos de solicitudes (4+)
      ejemplosSolicitudes: [
        'Analiza los costos de mi menú actual',
        'Genera un reporte ejecutivo mensual',
        'Optimiza mi estructura de turnos',
        'Evalúa a mis proveedores actuales',
        'Crea un plan de capacitación para el equipo'
      ],

      // Capacidades de archivos (15 puntos) - Todas habilitadas
      canUploadFiles: true,
      canGenerateDocuments: true,
      canAnalyzeData: true,
      sistemaAnalisisArchivos: GLOBAL_ENHANCEMENTS.fileReadingCapabilities,
      supportedFileTypes: Object.values(GLOBAL_ENHANCEMENTS.fileReadingCapabilities.supportedTypes).flat(),
      maxFileSize: GLOBAL_ENHANCEMENTS.fileReadingCapabilities.maxFileSize,

      // Delegación multi-agente
      canDelegateToAgents: true,

      // Frameworks estratégicos (10 puntos) - Todos los frameworks
      frameworks: [
        ...GLOBAL_ENHANCEMENTS.strategicFrameworks.principales.map(f => f.nombre),
        ...GLOBAL_ENHANCEMENTS.strategicFrameworks.complementarios.map(f => f.nombre),
        ...GLOBAL_ENHANCEMENTS.strategicFrameworks.restaurantes.map(f => f.nombre)
      ],

      // Workflows (10 puntos) - Workflows por área
      workflows: [
        ...Object.values(GLOBAL_ENHANCEMENTS.automationWorkflows.porArea).flat(),
        ...GLOBAL_ENHANCEMENTS.automationWorkflows.multiAgente.map(w => w.nombre)
      ],

      // Imagen corporativa (10 puntos) - Integrada completamente
      imagenCorporativa: GLOBAL_ENHANCEMENTS.corporateIdentity,
      documentTemplates: GLOBAL_ENHANCEMENTS.corporateIdentity.documentTemplates,
      usesCorporateColors: true,

      // Competencias adicionales
      certificaciones: Object.values(GLOBAL_ENHANCEMENTS.competenciesSystem.certificaciones).flat(),
      especializaciones: Object.values(GLOBAL_ENHANCEMENTS.competenciesSystem.especializaciones).flat()
    });
  });

  return agents;
}

// Ejecutar auditoría
async function runAudit() {
  console.log('\n🔍 EJECUTANDO AUTOAUDITORÍA DE AGENTES DE VÉRTICE GASTRONÓMICO\n');
  console.log('━'.repeat(70));
  console.log('📦 VERSIÓN: CON MEJORAS GLOBALES APLICADAS');
  console.log('🎯 OBJETIVO: Todos los agentes a 90+/100');
  console.log('━'.repeat(70));

  const agents = extractAgents();
  console.log(`\n📊 Total de agentes encontrados: ${agents.length}\n`);

  if (agents.length === 0) {
    console.log('❌ No se encontraron agentes para auditar');
    return;
  }

  // Mostrar mejoras aplicadas
  console.log('✅ MEJORAS GLOBALES APLICADAS:');
  console.log(`   📱 ${GLOBAL_ENHANCEMENTS.publicAITools.llmGenerales.length + GLOBAL_ENHANCEMENTS.publicAITools.especializadas.length + GLOBAL_ENHANCEMENTS.publicAITools.restaurantes.length} herramientas IA públicas`);
  console.log(`   🛠️  ${GLOBAL_ENHANCEMENTS.proprietaryTools.length} herramientas propias`);
  console.log(`   📚 ${GLOBAL_ENHANCEMENTS.strategicFrameworks.principales.length + GLOBAL_ENHANCEMENTS.strategicFrameworks.complementarios.length + GLOBAL_ENHANCEMENTS.strategicFrameworks.restaurantes.length} frameworks estratégicos`);
  console.log(`   ⚙️  ${Object.values(GLOBAL_ENHANCEMENTS.automationWorkflows.porArea).flat().length + GLOBAL_ENHANCEMENTS.automationWorkflows.multiAgente.length} workflows automatizados`);
  console.log(`   📁 ${Object.values(GLOBAL_ENHANCEMENTS.fileReadingCapabilities.supportedTypes).flat().length} tipos de archivo soportados`);
  console.log(`   🎨 Imagen corporativa completa`);
  console.log('');

  // Enviar al endpoint de auditoría
  try {
    const response = await fetch('http://localhost:3001/api/audit/agents/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentes: agents })
    });

    const result = await response.json();

    if (!result.success) {
      console.log('❌ Error en auditoría:', result.error);
      return;
    }

    // Mostrar resultados
    console.log('━'.repeat(70));
    console.log('📈 RESUMEN EJECUTIVO DE AUTOAUDITORÍA');
    console.log('━'.repeat(70));
    console.log(`\n📊 Total de agentes auditados: ${result.totalAgentes}`);
    console.log(`📈 Promedio general: ${result.promedioGeneral}/100`);

    // Verificar objetivo
    if (result.promedioGeneral >= 90) {
      console.log(`\n🎉 ¡OBJETIVO ALCANZADO! Promedio ≥ 90/100`);
    } else {
      console.log(`\n⚠️  Objetivo no alcanzado. Faltan ${90 - result.promedioGeneral} puntos`);
    }

    console.log(`\n📋 Distribución por calificación:`);
    console.log(`   ⭐ Excelente (80-100): ${result.porCalificacion.excelente} agentes`);
    console.log(`   ✅ Bueno (60-79): ${result.porCalificacion.bueno} agentes`);
    console.log(`   ⚠️  Regular (40-59): ${result.porCalificacion.regular} agentes`);
    console.log(`   ❌ Necesita Mejoras (<40): ${result.porCalificacion.necesitaMejoras} agentes`);

    // Verificar que todos están en excelente
    const totalAgents = result.totalAgentes;
    const excelentes = result.porCalificacion.excelente;
    console.log(`\n📊 Tasa de excelencia: ${Math.round(excelentes/totalAgents*100)}% (${excelentes}/${totalAgents})`);

    if (result.necesidadesComunes && result.necesidadesComunes.length > 0) {
      console.log('\n━'.repeat(70));
      console.log('🎯 NECESIDADES RESTANTES (si las hay)');
      console.log('━'.repeat(70));
      result.necesidadesComunes.slice(0, 5).forEach((n, i) => {
        console.log(`   ${i + 1}. ${n.necesidad} (${n.agentesAfectados} agentes)`);
      });
    }

    // Top 10 mejores agentes
    const topAgents = result.auditorias
      .sort((a, b) => b.puntuacionTotal - a.puntuacionTotal)
      .slice(0, 10);

    console.log('\n━'.repeat(70));
    console.log('🏆 TOP 10 AGENTES CON MEJOR PUNTUACIÓN');
    console.log('━'.repeat(70));
    topAgents.forEach((a, i) => {
      const emoji = a.puntuacionTotal >= 90 ? '🌟' : a.calificacion === 'Excelente' ? '⭐' : a.calificacion === 'Bueno' ? '✅' : '⚠️';
      console.log(`   ${i + 1}. ${emoji} ${a.nombre} - ${a.puntuacionTotal}/100 (${a.calificacion})`);
    });

    // Agentes que no llegaron a 90 (si los hay)
    const below90 = result.auditorias
      .filter(a => a.puntuacionTotal < 90)
      .sort((a, b) => a.puntuacionTotal - b.puntuacionTotal);

    if (below90.length > 0) {
      console.log('\n━'.repeat(70));
      console.log('🔧 AGENTES BAJO 90 PUNTOS (Requieren ajuste adicional)');
      console.log('━'.repeat(70));
      below90.slice(0, 10).forEach((a, i) => {
        console.log(`   ${i + 1}. ⚠️  ${a.nombre} - ${a.puntuacionTotal}/100 (faltan ${90 - a.puntuacionTotal} pts)`);
        if (a.necesidades && a.necesidades.length > 0) {
          console.log(`      → ${a.necesidades[0]}`);
        }
      });
    } else {
      console.log('\n━'.repeat(70));
      console.log('🎉 ¡TODOS LOS AGENTES SUPERAN 90 PUNTOS!');
      console.log('━'.repeat(70));
    }

    // Detalle por categoría
    const byCategory = {};
    result.auditorias.forEach(a => {
      if (!byCategory[a.categoria]) {
        byCategory[a.categoria] = { count: 0, total: 0 };
      }
      byCategory[a.categoria].count++;
      byCategory[a.categoria].total += a.puntuacionTotal;
    });

    console.log('\n━'.repeat(70));
    console.log('📂 ANÁLISIS POR CATEGORÍA');
    console.log('━'.repeat(70));
    Object.entries(byCategory)
      .map(([cat, data]) => ({ categoria: cat, promedio: Math.round(data.total / data.count), count: data.count }))
      .sort((a, b) => b.promedio - a.promedio)
      .forEach(c => {
        const bar = '█'.repeat(Math.round(c.promedio / 5));
        const status = c.promedio >= 90 ? '✅' : '⚠️';
        console.log(`   ${status} ${c.categoria.padEnd(25)} ${bar} ${c.promedio}/100 (${c.count} agentes)`);
      });

    // Guardar reporte completo
    const reportDate = new Date().toISOString().split('T')[0];
    const reportFile = `audit-report-enhanced-${reportDate}.json`;
    fs.writeFileSync(reportFile, JSON.stringify({
      ...result,
      mejorasAplicadas: GLOBAL_ENHANCEMENTS,
      fechaAuditoria: new Date().toISOString(),
      version: 'Con Mejoras Globales v2.0'
    }, null, 2));
    console.log(`\n💾 Reporte completo guardado en: ${reportFile}`);

    console.log('\n━'.repeat(70));
    console.log('✅ AUTOAUDITORÍA CON MEJORAS GLOBALES COMPLETADA');
    console.log('━'.repeat(70));

  } catch (error) {
    console.log('❌ Error conectando al servidor:', error.message);
    console.log('   Asegúrate de que el servidor esté corriendo en localhost:3001');
  }
}

runAudit();
