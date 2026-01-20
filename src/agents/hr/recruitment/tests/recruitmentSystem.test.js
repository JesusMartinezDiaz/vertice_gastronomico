/**
 * PRUEBAS DEL SISTEMA DE RECLUTAMIENTO
 * Simulación de escenarios reales para detectar errores
 */

import { recruitmentSystem } from '../index.js';
import { cvParser } from '../CVParser.js';
import { candidateProfiler } from '../CandidateProfiler.js';
import { psychometricTestManager } from '../PsychometricTests.js';
import { candidateEvaluator } from '../EvaluationTemplates.js';
import { atsIntegrationManager } from '../ATSIntegration.js';
import { gamifiedTestManager } from '../GamifiedTests.js';
import { interviewManager } from '../InterviewTemplates.js';

// ═══════════════════════════════════════════════════════════════════
// DATOS DE PRUEBA - CANDIDATOS SIMULADOS
// ═══════════════════════════════════════════════════════════════════

const MOCK_CANDIDATES = {
  chefExperimentado: {
    name: 'Carlos Mendoza García',
    email: 'carlos.mendoza@email.com',
    phone: '+52 55 1234 5678',
    cvContent: `
      CARLOS MENDOZA GARCÍA
      Chef Ejecutivo con 15 años de experiencia

      EXPERIENCIA LABORAL:
      - Chef Ejecutivo en Restaurante Pujol (2018-2024)
        Dirigí equipo de 25 cocineros, implementé nuevo menú de temporada
      - Sous Chef en Quintonil (2014-2018)
        Supervisión de línea caliente, control de costos
      - Chef de Partida en Biko (2010-2014)
        Estación de carnes y salsas

      EDUCACIÓN:
      - Licenciatura en Gastronomía - Universidad del Claustro de Sor Juana
      - Diplomado en Cocina Francesa - Le Cordon Bleu

      CERTIFICACIONES:
      - HACCP Certificado
      - ServSafe Manager
      - Sommelier Nivel 2

      HABILIDADES:
      - Cocina mexicana contemporánea
      - Cocina francesa clásica
      - Gestión de equipos
      - Control de food cost
      - Diseño de menús

      IDIOMAS:
      - Español (nativo)
      - Inglés (avanzado)
      - Francés (intermedio)
    `,
    competencies: {
      liderazgo: 5,
      comunicacion: 4,
      trabajo_equipo: 5,
      resolucion_problemas: 5,
      orientacion_cliente: 4,
      adaptabilidad: 4,
      conocimiento_tecnico: 5,
      gestion_tiempo: 4
    }
  },

  meseroNuevo: {
    name: 'Ana Sofía López',
    email: 'ana.lopez@email.com',
    phone: '+52 55 8765 4321',
    cvContent: `
      ANA SOFÍA LÓPEZ
      Estudiante de Hospitalidad

      EXPERIENCIA:
      - Mesera en Café La Habana (2023-2024)
        Atención a clientes, manejo de caja
      - Hostess en IHOP (2022-2023)
        Recepción de clientes, manejo de lista de espera

      EDUCACIÓN:
      - Estudiante de Administración Hotelera - UNITEC (en curso)
      - Preparatoria - Colegio Madrid

      HABILIDADES:
      - Atención al cliente
      - Manejo de POS
      - Trabajo en equipo

      IDIOMAS:
      - Español (nativo)
      - Inglés (básico)
    `,
    competencies: {
      liderazgo: 2,
      comunicacion: 4,
      trabajo_equipo: 4,
      resolucion_problemas: 3,
      orientacion_cliente: 5,
      adaptabilidad: 4,
      conocimiento_tecnico: 2,
      gestion_tiempo: 3
    }
  },

  gerenteRestaurante: {
    name: 'Roberto Fernández Díaz',
    email: 'roberto.fernandez@email.com',
    phone: '+52 55 9999 8888',
    cvContent: `
      ROBERTO FERNÁNDEZ DÍAZ
      Gerente de Restaurante | MBA

      EXPERIENCIA:
      - Gerente General en Grupo Carolo (2019-2024)
        3 sucursales, 80 empleados, $15M ventas anuales
      - Gerente de Operaciones en CMR (2015-2019)
        Supervisión de 5 unidades
      - Asistente de Gerencia en Sanborns (2012-2015)

      EDUCACIÓN:
      - MBA - IPADE Business School
      - Lic. en Administración - ITAM

      CERTIFICACIONES:
      - PMP Certified
      - Six Sigma Green Belt

      LOGROS:
      - Incremento de ventas 35% en 2 años
      - Reducción de rotación de personal 40%
      - Implementación de sistema ERP
    `,
    competencies: {
      liderazgo: 5,
      comunicacion: 5,
      trabajo_equipo: 4,
      resolucion_problemas: 5,
      orientacion_cliente: 4,
      adaptabilidad: 4,
      conocimiento_tecnico: 4,
      gestion_tiempo: 5
    }
  }
};

// Datos ATS simulados
const MOCK_ATS_DATA = {
  json: JSON.stringify({
    candidates: [
      {
        id: 'ATS-001',
        first_name: 'María',
        last_name: 'González',
        email: 'maria.gonzalez@email.com',
        phone: '+52 55 1111 2222',
        position: 'Sous Chef',
        status: 'interview',
        date: '2024-01-15'
      },
      {
        id: 'ATS-002',
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@email.com',
        phone: '+52 55 3333 4444',
        position: 'Cocinero',
        status: 'new',
        date: '2024-01-16'
      }
    ]
  }),
  csv: `id,first_name,last_name,email,phone,position,status,date
ATS-003,Pedro,Ramírez,pedro.ramirez@email.com,+52 55 5555 6666,Mesero,screening,2024-01-17
ATS-004,Laura,Martínez,laura.martinez@email.com,+52 55 7777 8888,Bartender,new,2024-01-18`
};

// ═══════════════════════════════════════════════════════════════════
// CLASE DE PRUEBAS
// ═══════════════════════════════════════════════════════════════════

class RecruitmentSystemTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      tests: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪'
    };
    console.log(`${prefix[type] || '•'} ${message}`);
  }

  async runTest(name, testFn) {
    this.log(`Ejecutando: ${name}`, 'test');
    const startTime = Date.now();

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;

      this.results.passed++;
      this.results.tests.push({
        name,
        status: 'passed',
        duration,
        result
      });
      this.log(`${name} - PASÓ (${duration}ms)`, 'success');
      return { success: true, result };
    } catch (error) {
      const duration = Date.now() - startTime;

      this.results.failed++;
      this.results.errors.push({
        test: name,
        error: error.message,
        stack: error.stack
      });
      this.results.tests.push({
        name,
        status: 'failed',
        duration,
        error: error.message
      });
      this.log(`${name} - FALLÓ: ${error.message}`, 'error');
      return { success: false, error };
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DE CV PARSER
  // ─────────────────────────────────────────────────────────────────

  async testCVParser() {
    return this.runTest('CV Parser - Parseo de CV completo', async () => {
      const result = await cvParser.parseCV(MOCK_CANDIDATES.chefExperimentado.cvContent);

      this.assert(result.success, 'El parseo debe ser exitoso');
      this.assert(result.data.name, 'Debe extraer el nombre');
      this.assert(result.data.experience?.length > 0, 'Debe extraer experiencia');
      this.assert(result.data.education?.length > 0, 'Debe extraer educación');
      this.assert(result.data.skills?.length > 0, 'Debe extraer habilidades');

      return result;
    });
  }

  async testCVParserBatch() {
    return this.runTest('CV Parser - Procesamiento batch de CVs', async () => {
      const cvs = [
        MOCK_CANDIDATES.chefExperimentado.cvContent,
        MOCK_CANDIDATES.meseroNuevo.cvContent,
        MOCK_CANDIDATES.gerenteRestaurante.cvContent
      ];

      const result = await cvParser.parseBatch(cvs);

      this.assert(result.total === 3, 'Debe procesar 3 CVs');
      this.assert(result.successful >= 2, 'Al menos 2 deben ser exitosos');

      return result;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DE PERFILAMIENTO
  // ─────────────────────────────────────────────────────────────────

  async testCandidateProfiler() {
    return this.runTest('Candidate Profiler - Generación de perfil', async () => {
      const result = await candidateProfiler.generateProfile(MOCK_CANDIDATES.chefExperimentado);

      this.assert(result.profileId, 'Debe generar ID de perfil');
      this.assert(result.overallAssessment, 'Debe incluir evaluación general');
      this.assert(result.positionMatches?.length > 0, 'Debe calcular matches de posición');

      return result;
    });
  }

  async testPositionMatching() {
    return this.runTest('Candidate Profiler - Match con puesto', async () => {
      const match = candidateProfiler.calculatePositionMatch(
        MOCK_CANDIDATES.chefExperimentado,
        'chef_ejecutivo'
      );

      this.assert(match.matchPercentage >= 0, 'Debe calcular porcentaje de match');
      this.assert(match.strengths?.length >= 0, 'Debe identificar fortalezas');

      return match;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DE EVALUACIÓN
  // ─────────────────────────────────────────────────────────────────

  async testExperienceEvaluation() {
    return this.runTest('Evaluator - Evaluación por experiencia', () => {
      const result = candidateEvaluator.evaluateExperience(
        MOCK_CANDIDATES.chefExperimentado,
        'chef_ejecutivo'
      );

      this.assert(result.finalScore >= 0, 'Debe calcular score final');
      this.assert(result.experienceScore >= 0, 'Debe calcular score de experiencia');

      return result;
    });
  }

  async testCompetencyEvaluation() {
    return this.runTest('Evaluator - Evaluación por competencias', () => {
      const result = candidateEvaluator.evaluateCompetencies(
        MOCK_CANDIDATES.chefExperimentado.competencies,
        'chef_ejecutivo'
      );

      this.assert(typeof result.overallFit === 'number', 'Debe calcular ajuste general');
      this.assert(result.competencyScores, 'Debe incluir scores por competencia');

      return result;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS PSICOMÉTRICAS
  // ─────────────────────────────────────────────────────────────────

  async testPsychometricTests() {
    return this.runTest('Psychometric Tests - Obtener batería recomendada', () => {
      const battery = psychometricTestManager.getRecommendedBattery('chef_ejecutivo');

      this.assert(Array.isArray(battery), 'Debe retornar array de pruebas');
      this.assert(battery.length > 0, 'Debe incluir al menos una prueba');

      return battery;
    });
  }

  async testPsychometricScoring() {
    return this.runTest('Psychometric Tests - Calificación de prueba', () => {
      // Simular respuestas al test de personalidad
      const mockResponses = {};
      for (let i = 1; i <= 25; i++) {
        mockResponses[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const result = psychometricTestManager.scoreTest('personality', mockResponses);

      this.assert(result.testId === 'personality', 'Debe identificar la prueba');
      this.assert(result.dimensions, 'Debe incluir dimensiones evaluadas');

      return result;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DE INTEGRACIÓN ATS
  // ─────────────────────────────────────────────────────────────────

  async testATSImportJSON() {
    return this.runTest('ATS Integration - Importación JSON', async () => {
      const result = await atsIntegrationManager.importCandidates(
        MOCK_ATS_DATA.json,
        'GENERIC',
        { format: 'json' }
      );

      this.assert(result.success, 'La importación debe ser exitosa');
      this.assert(result.stats.imported === 2, 'Debe importar 2 candidatos');
      this.assert(result.candidates.length === 2, 'Debe tener 2 candidatos');

      return result;
    });
  }

  async testATSImportCSV() {
    return this.runTest('ATS Integration - Importación CSV', async () => {
      const result = await atsIntegrationManager.importCandidates(
        MOCK_ATS_DATA.csv,
        'GENERIC',
        { format: 'csv' }
      );

      this.assert(result.success, 'La importación debe ser exitosa');
      this.assert(result.stats.imported === 2, 'Debe importar 2 candidatos');

      return result;
    });
  }

  async testATSExport() {
    return this.runTest('ATS Integration - Exportación de candidatos', () => {
      const candidates = [
        { id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com' }
      ];

      const result = atsIntegrationManager.exportCandidates(candidates, 'GENERIC', 'json');

      this.assert(result.success, 'La exportación debe ser exitosa');
      this.assert(result.data, 'Debe incluir datos exportados');

      return result;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS GAMIFICADAS
  // ─────────────────────────────────────────────────────────────────

  async testGamifiedGames() {
    return this.runTest('Gamified Tests - Obtener juegos disponibles', () => {
      const games = gamifiedTestManager.getAvailableGames();

      this.assert(Array.isArray(games), 'Debe retornar array de juegos');
      this.assert(games.length === 5, 'Debe tener 5 juegos disponibles');

      const gameIds = games.map(g => g.id);
      this.assert(gameIds.includes('kitchen_rush'), 'Debe incluir Kitchen Rush');
      this.assert(gameIds.includes('service_master'), 'Debe incluir Service Master');

      return games;
    });
  }

  async testGamifiedSession() {
    return this.runTest('Gamified Tests - Iniciar sesión de juego', () => {
      const session = gamifiedTestManager.startGameSession('CAND-001', 'kitchen_rush');

      this.assert(session.sessionId, 'Debe generar ID de sesión');
      this.assert(session.game, 'Debe incluir info del juego');
      this.assert(session.firstScenario, 'Debe incluir primer escenario');

      return session;
    });
  }

  async testGamifiedResponse() {
    return this.runTest('Gamified Tests - Procesar respuesta', () => {
      // Iniciar sesión
      const session = gamifiedTestManager.startGameSession('CAND-002', 'kitchen_rush');

      // Simular respuesta
      const result = gamifiedTestManager.submitResponse(
        session.sessionId,
        'kr_01',
        'b',
        10
      );

      this.assert(result.response, 'Debe incluir respuesta procesada');
      this.assert(result.response.points >= 0, 'Debe calcular puntos');
      this.assert(result.progress, 'Debe incluir progreso');

      return result;
    });
  }

  async testGamifiedComplete() {
    return this.runTest('Gamified Tests - Completar juego completo', () => {
      const session = gamifiedTestManager.startGameSession('CAND-003', 'kitchen_rush');

      // Responder todos los escenarios
      const scenarios = ['kr_01', 'kr_02', 'kr_03', 'kr_04', 'kr_05'];
      let lastResult;

      for (const scenarioId of scenarios) {
        lastResult = gamifiedTestManager.submitResponse(
          session.sessionId,
          scenarioId,
          'b',
          15
        );
      }

      this.assert(lastResult.sessionId, 'Debe retornar resultado final');
      this.assert(lastResult.score, 'Debe incluir puntuación');
      this.assert(lastResult.recommendation, 'Debe incluir recomendación');

      return lastResult;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DE ENTREVISTAS
  // ─────────────────────────────────────────────────────────────────

  async testInterviewGuide() {
    return this.runTest('Interview Manager - Generar guía de entrevista', () => {
      const guide = interviewManager.generateInterviewGuide('chef_ejecutivo');

      this.assert(guide.position, 'Debe incluir posición');
      this.assert(guide.sections?.length > 0, 'Debe incluir secciones');
      this.assert(guide.estimatedDuration, 'Debe incluir duración estimada');

      return guide;
    });
  }

  async testInterviewSession() {
    return this.runTest('Interview Manager - Iniciar sesión de entrevista', () => {
      const session = interviewManager.startInterviewSession(
        'CAND-004',
        'sous_chef',
        'HR Manager'
      );

      this.assert(session.sessionId, 'Debe generar ID de sesión');
      this.assert(session.guide, 'Debe incluir guía');

      return session;
    });
  }

  async testInterviewComplete() {
    return this.runTest('Interview Manager - Completar entrevista', () => {
      const session = interviewManager.startInterviewSession(
        'CAND-005',
        'mesero',
        'HR Manager'
      );

      // Registrar algunas respuestas
      interviewManager.recordResponse(session.sessionId, 'q1', 'Buena respuesta', 4, 'Notas');
      interviewManager.recordResponse(session.sessionId, 'q2', 'Respuesta regular', 3, '');

      // Completar entrevista
      const result = interviewManager.completeInterview(session.sessionId, 'Buen candidato en general');

      this.assert(result.sessionId, 'Debe incluir ID de sesión');
      this.assert(result.scores, 'Debe incluir puntuaciones');
      this.assert(result.recommendation, 'Debe incluir recomendación');

      return result;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DEL SISTEMA INTEGRADO
  // ─────────────────────────────────────────────────────────────────

  async testFullCandidateProcess() {
    return this.runTest('Sistema Integrado - Proceso completo de candidato', async () => {
      const result = await recruitmentSystem.processCandidate(
        MOCK_CANDIDATES.chefExperimentado,
        'chef_ejecutivo'
      );

      this.assert(result.processId, 'Debe generar ID de proceso');
      this.assert(result.candidateName, 'Debe incluir nombre del candidato');
      this.assert(result.profile, 'Debe generar perfil');
      this.assert(result.evaluations, 'Debe incluir evaluaciones');
      this.assert(result.recommendation, 'Debe incluir recomendación');

      return result;
    });
  }

  async testBatchProcessing() {
    return this.runTest('Sistema Integrado - Procesamiento batch', async () => {
      const candidates = [
        MOCK_CANDIDATES.chefExperimentado,
        MOCK_CANDIDATES.meseroNuevo
      ];

      const result = await recruitmentSystem.processBatch(candidates, 'sous_chef');

      this.assert(result.batchId, 'Debe generar ID de batch');
      this.assert(result.total === 2, 'Debe procesar 2 candidatos');
      this.assert(result.ranking, 'Debe generar ranking');

      return result;
    });
  }

  async testRecruitmentReport() {
    return this.runTest('Sistema Integrado - Generar reporte', async () => {
      const candidates = [MOCK_CANDIDATES.chefExperimentado];
      const batchResult = await recruitmentSystem.processBatch(candidates, 'chef_ejecutivo');

      const report = recruitmentSystem.generateRecruitmentReport(batchResult);

      this.assert(report.reportId, 'Debe generar ID de reporte');
      this.assert(report.summary, 'Debe incluir resumen');
      this.assert(report.recommendations, 'Debe incluir recomendaciones');

      return report;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRUEBAS DE EDGE CASES
  // ─────────────────────────────────────────────────────────────────

  async testEmptyCV() {
    return this.runTest('Edge Case - CV vacío', async () => {
      const result = await cvParser.parseCV('');

      // Debe manejar CV vacío sin crashear
      this.assert(result !== undefined, 'Debe retornar algo');

      return result;
    });
  }

  async testInvalidEmail() {
    return this.runTest('Edge Case - Email inválido en ATS', async () => {
      const invalidData = JSON.stringify({
        candidates: [{
          id: '1',
          first_name: 'Test',
          email: 'invalid-email',
          position: 'Test'
        }]
      });

      const result = await atsIntegrationManager.importCandidates(invalidData, 'GENERIC');

      // Debe detectar email inválido
      this.assert(result.stats.skipped > 0 || result.errors.length > 0,
        'Debe rechazar email inválido');

      return result;
    });
  }

  async testUnknownPosition() {
    return this.runTest('Edge Case - Posición desconocida', () => {
      const guide = interviewManager.generateInterviewGuide('puesto_inventado');

      // Debe manejar posición desconocida
      this.assert(guide, 'Debe retornar guía aunque sea básica');

      return guide;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // EJECUTAR TODAS LAS PRUEBAS
  // ─────────────────────────────────────────────────────────────────

  async runAll() {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('    PRUEBAS DEL SISTEMA DE RECLUTAMIENTO - VÉRTICE GASTRONÓMICO    ');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('\n');

    const startTime = Date.now();

    // CV Parser
    console.log('\n📂 CV PARSER\n' + '─'.repeat(50));
    await this.testCVParser();
    await this.testCVParserBatch();

    // Profiler
    console.log('\n👤 CANDIDATE PROFILER\n' + '─'.repeat(50));
    await this.testCandidateProfiler();
    await this.testPositionMatching();

    // Evaluator
    console.log('\n📊 EVALUACIONES\n' + '─'.repeat(50));
    await this.testExperienceEvaluation();
    await this.testCompetencyEvaluation();

    // Psychometric
    console.log('\n🧠 PRUEBAS PSICOMÉTRICAS\n' + '─'.repeat(50));
    await this.testPsychometricTests();
    await this.testPsychometricScoring();

    // ATS
    console.log('\n🔗 INTEGRACIÓN ATS\n' + '─'.repeat(50));
    await this.testATSImportJSON();
    await this.testATSImportCSV();
    await this.testATSExport();

    // Gamified
    console.log('\n🎮 PRUEBAS GAMIFICADAS\n' + '─'.repeat(50));
    await this.testGamifiedGames();
    await this.testGamifiedSession();
    await this.testGamifiedResponse();
    await this.testGamifiedComplete();

    // Interviews
    console.log('\n🎤 ENTREVISTAS\n' + '─'.repeat(50));
    await this.testInterviewGuide();
    await this.testInterviewSession();
    await this.testInterviewComplete();

    // Integration
    console.log('\n⚡ SISTEMA INTEGRADO\n' + '─'.repeat(50));
    await this.testFullCandidateProcess();
    await this.testBatchProcessing();
    await this.testRecruitmentReport();

    // Edge Cases
    console.log('\n🔍 EDGE CASES\n' + '─'.repeat(50));
    await this.testEmptyCV();
    await this.testInvalidEmail();
    await this.testUnknownPosition();

    const totalTime = Date.now() - startTime;

    // Resumen
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                         RESUMEN DE PRUEBAS                         ');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`\n  Total de pruebas:    ${this.results.passed + this.results.failed}`);
    console.log(`  ✅ Pasaron:          ${this.results.passed}`);
    console.log(`  ❌ Fallaron:         ${this.results.failed}`);
    console.log(`  ⏱️  Tiempo total:     ${totalTime}ms`);
    console.log(`  📊 Tasa de éxito:    ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);

    if (this.results.errors.length > 0) {
      console.log('\n\n❌ ERRORES DETECTADOS:\n' + '─'.repeat(50));
      this.results.errors.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.test}`);
        console.log(`   Error: ${err.error}`);
        if (err.stack) {
          console.log(`   Stack: ${err.stack.split('\n')[1]?.trim()}`);
        }
      });
    }

    console.log('\n');

    return this.results;
  }
}

// ═══════════════════════════════════════════════════════════════════
// EJECUTAR PRUEBAS CON VITEST
// ═══════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';

describe('Recruitment System', () => {
  it('debe pasar todas las pruebas del sistema de reclutamiento', async () => {
    const tester = new RecruitmentSystemTester();
    const results = await tester.runAll();

    expect(results.failed).toBe(0);
    expect(results.passed).toBeGreaterThan(0);
  });
});
