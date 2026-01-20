/**
 * SISTEMA DE RECLUTAMIENTO INTEGRAL
 * Vértice Gastronómico - Módulo de Reclutamiento Mejorado
 *
 * Este módulo exporta todas las herramientas de reclutamiento:
 * - Plantillas de Evaluación (Experiencia y Competencias)
 * - Pruebas Psicométricas Completas
 * - Parser de CVs con procesamiento masivo
 * - Sistema de Perfilamiento de Candidatos
 *
 * @version 2.0.0
 * @author Vértice Gastronómico
 */

// ═══════════════════════════════════════════════════════════════════
// EXPORTACIONES
// ═══════════════════════════════════════════════════════════════════

// Plantillas de Evaluación
export {
  EXPERIENCE_EVALUATION,
  COMPETENCY_EVALUATION,
  CandidateEvaluator,
  candidateEvaluator
} from './EvaluationTemplates.js';

// Pruebas Psicométricas
export {
  PSYCHOMETRIC_CONFIG,
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
} from './PsychometricTests.js';

// Parser de CVs
export {
  CV_PARSER_CONFIG,
  EXTRACTION_PATTERNS,
  GASTRONOMY_DICTIONARY,
  CVParser,
  cvParser
} from './CVParser.js';

// Perfilamiento de Candidatos
export {
  PROFILER_CONFIG,
  POSITION_PROFILES,
  CandidateProfiler,
  candidateProfiler
} from './CandidateProfiler.js';

// Integración ATS
export {
  ATS_PROVIDERS,
  STATUS_MAPPING,
  IMPORT_TEMPLATES,
  ATSIntegrationManager,
  atsIntegrationManager
} from './ATSIntegration.js';

// Pruebas Gamificadas
export {
  GAMIFICATION_CONFIG,
  KITCHEN_RUSH_GAME,
  SERVICE_MASTER_GAME,
  INVENTORY_QUEST_GAME,
  TEAM_BUILDER_GAME,
  CRISIS_COMMANDER_GAME,
  GamifiedTestManager,
  gamifiedTestManager
} from './GamifiedTests.js';

// Plantillas de Entrevistas
export {
  INTERVIEW_CONFIG,
  SKILLS_INTERVIEWS,
  SITUATIONAL_INTERVIEWS,
  PROJECT_INTERVIEWS,
  BEHAVIORAL_QUESTIONS,
  InterviewManager,
  interviewManager
} from './InterviewTemplates.js';

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL DEL SISTEMA DE RECLUTAMIENTO
// ═══════════════════════════════════════════════════════════════════

import { candidateEvaluator } from './EvaluationTemplates.js';
import { psychometricTestManager } from './PsychometricTests.js';
import { cvParser } from './CVParser.js';
import { candidateProfiler } from './CandidateProfiler.js';
import { atsIntegrationManager } from './ATSIntegration.js';
import { gamifiedTestManager } from './GamifiedTests.js';
import { interviewManager } from './InterviewTemplates.js';

/**
 * Sistema integrado de reclutamiento
 * Coordina todas las herramientas de evaluación
 */
export class RecruitmentSystem {
  constructor() {
    this.evaluator = candidateEvaluator;
    this.testManager = psychometricTestManager;
    this.cvParser = cvParser;
    this.profiler = candidateProfiler;
    this.atsManager = atsIntegrationManager;
    this.gamifiedTests = gamifiedTestManager;
    this.interviewManager = interviewManager;

    this.version = '3.0.0';
  }

  /**
   * Procesa un candidato completo
   * @param {Object} candidateData - Datos del candidato
   * @param {string} targetPosition - Puesto objetivo
   * @returns {Object} Resultado completo del proceso
   */
  async processCandidate(candidateData, targetPosition) {
    const result = {
      processId: `PROC-${Date.now()}`,
      candidateName: candidateData.name,
      targetPosition,
      timestamp: new Date().toISOString(),
      steps: [],
      profile: null,
      evaluations: {},
      recommendation: null
    };

    try {
      let stepIndex = 0;

      // 1. Parsear CV si está disponible
      if (candidateData.cvContent) {
        result.steps.push({ step: stepIndex + 1, name: 'CV Parsing', status: 'in_progress' });
        const cvResult = await this.cvParser.parseCV(candidateData.cvContent);
        result.steps[stepIndex].status = cvResult.success ? 'completed' : 'failed';
        if (cvResult.success) {
          candidateData = { ...candidateData, ...cvResult.data };
        }
        stepIndex++;
      }

      // 2. Generar perfil completo
      result.steps.push({ step: stepIndex + 1, name: 'Profile Generation', status: 'in_progress' });
      result.profile = await this.profiler.generateProfile(candidateData);
      result.steps[stepIndex].status = 'completed';
      stepIndex++;

      // 3. Evaluación por experiencia
      result.steps.push({ step: stepIndex + 1, name: 'Experience Evaluation', status: 'in_progress' });
      result.evaluations.experience = this.evaluator.evaluateExperience(
        candidateData,
        targetPosition
      );
      result.steps[stepIndex].status = 'completed';
      stepIndex++;

      // 4. Evaluación por competencias (si hay datos)
      if (candidateData.competencies) {
        result.steps.push({ step: stepIndex + 1, name: 'Competency Evaluation', status: 'in_progress' });
        result.evaluations.competencies = this.evaluator.evaluateCompetencies(
          candidateData.competencies,
          targetPosition
        );
        result.steps[stepIndex].status = 'completed';
        stepIndex++;
      }

      // 5. Generar recomendación final
      result.recommendation = this.generateFinalRecommendation(result);

    } catch (error) {
      result.error = error.message;
    }

    return result;
  }

  /**
   * Procesa múltiples candidatos en batch
   */
  async processBatch(candidates, targetPosition, options = {}) {
    const batchResult = {
      batchId: `BATCH-${Date.now()}`,
      targetPosition,
      total: candidates.length,
      processed: 0,
      results: [],
      ranking: null,
      startTime: new Date().toISOString()
    };

    for (const candidate of candidates) {
      try {
        const result = await this.processCandidate(candidate, targetPosition);
        batchResult.results.push(result);
      } catch (error) {
        batchResult.results.push({
          candidateName: candidate.name || 'Unknown',
          error: error.message
        });
      }
      batchResult.processed++;

      if (options.onProgress) {
        options.onProgress({
          processed: batchResult.processed,
          total: batchResult.total,
          percentage: Math.round((batchResult.processed / batchResult.total) * 100)
        });
      }
    }

    // Generar ranking
    batchResult.ranking = this.generateBatchRanking(batchResult.results, targetPosition);
    batchResult.endTime = new Date().toISOString();

    return batchResult;
  }

  /**
   * Obtiene batería de pruebas recomendada
   */
  getRecommendedTests(position) {
    return this.testManager.getRecommendedBattery(position);
  }

  /**
   * Inicia sesión de pruebas psicométricas
   */
  startPsychometricSession(candidateId, position) {
    const testIds = this.getRecommendedTests(position);
    return this.testManager.startSession(candidateId, testIds);
  }

  /**
   * Califica prueba psicométrica
   */
  scoreTest(testId, responses) {
    return this.testManager.scoreTest(testId, responses);
  }

  /**
   * Obtiene preguntas de entrevista por competencias
   */
  getInterviewQuestions(position) {
    return this.evaluator.getInterviewQuestions(position);
  }

  /**
   * Genera recomendación final
   */
  generateFinalRecommendation(processResult) {
    const scores = [];

    // Score de perfil
    if (processResult.profile?.overallAssessment?.score) {
      scores.push(processResult.profile.overallAssessment.score);
    }

    // Score de experiencia
    if (processResult.evaluations?.experience?.finalScore) {
      scores.push(processResult.evaluations.experience.finalScore);
    }

    // Score de competencias
    if (processResult.evaluations?.competencies?.overallFit) {
      scores.push(processResult.evaluations.competencies.overallFit);
    }

    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Verificar requisitos mínimos de competencias
    const meetsCompetencies = processResult.evaluations?.competencies?.meetsRequirements !== false;

    let decision, reasoning;

    if (!meetsCompetencies) {
      decision = 'NO_CONTRATAR';
      reasoning = 'No cumple con las competencias mínimas requeridas';
    } else if (avgScore >= 85) {
      decision = 'CONTRATAR_PRIORITARIO';
      reasoning = 'Candidato excepcional que cumple y supera los requisitos';
    } else if (avgScore >= 70) {
      decision = 'CONTRATAR';
      reasoning = 'Candidato calificado con buen ajuste al puesto';
    } else if (avgScore >= 55) {
      decision = 'CONSIDERAR';
      reasoning = 'Candidato aceptable, considerar si no hay mejores opciones';
    } else {
      decision = 'NO_CONTRATAR';
      reasoning = 'El perfil no se ajusta a los requisitos del puesto';
    }

    return {
      decision,
      reasoning,
      overallScore: avgScore,
      nextSteps: this.getNextSteps(decision),
      generatedAt: new Date().toISOString()
    };
  }

  getNextSteps(decision) {
    const steps = {
      'CONTRATAR_PRIORITARIO': [
        'Agendar entrevista final con gerencia',
        'Preparar oferta económica competitiva',
        'Verificar referencias',
        'Iniciar proceso de contratación'
      ],
      'CONTRATAR': [
        'Agendar entrevista técnica',
        'Realizar prueba práctica',
        'Verificar referencias',
        'Preparar oferta estándar'
      ],
      'CONSIDERAR': [
        'Comparar con otros candidatos',
        'Realizar entrevista adicional',
        'Evaluar necesidades de capacitación',
        'Tomar decisión basada en disponibilidad'
      ],
      'NO_CONTRATAR': [
        'Agradecer participación',
        'Guardar en base de datos para futuras vacantes',
        'Continuar búsqueda'
      ]
    };

    return steps[decision] || [];
  }

  /**
   * Genera ranking de batch
   */
  generateBatchRanking(results, targetPosition) {
    const validResults = results.filter(r => !r.error && r.recommendation);

    const ranked = validResults
      .map(r => ({
        candidateName: r.candidateName,
        score: r.recommendation.overallScore,
        decision: r.recommendation.decision,
        profileScore: r.profile?.overallAssessment?.score || 0,
        match: r.profile?.positionMatches?.find(m => m.position === targetPosition)
      }))
      .sort((a, b) => b.score - a.score);

    ranked.forEach((r, i) => r.rank = i + 1);

    return {
      position: targetPosition,
      totalCandidates: ranked.length,
      ranking: ranked,
      topCandidates: ranked.slice(0, 5),
      distribution: {
        contratar_prioritario: ranked.filter(r => r.decision === 'CONTRATAR_PRIORITARIO').length,
        contratar: ranked.filter(r => r.decision === 'CONTRATAR').length,
        considerar: ranked.filter(r => r.decision === 'CONSIDERAR').length,
        no_contratar: ranked.filter(r => r.decision === 'NO_CONTRATAR').length
      }
    };
  }

  /**
   * Genera reporte completo de reclutamiento
   */
  generateRecruitmentReport(batchResult) {
    return {
      reportId: `RPT-${Date.now()}`,
      type: 'RECRUITMENT_BATCH_REPORT',
      generatedAt: new Date().toISOString(),
      summary: {
        position: batchResult.targetPosition,
        totalCandidates: batchResult.total,
        processed: batchResult.processed,
        duration: this.calculateDuration(batchResult.startTime, batchResult.endTime)
      },
      ranking: batchResult.ranking,
      recommendations: {
        topCandidate: batchResult.ranking?.topCandidates?.[0] || null,
        alternates: batchResult.ranking?.topCandidates?.slice(1, 3) || [],
        talentPool: batchResult.ranking?.ranking?.filter(r => r.decision === 'CONSIDERAR') || []
      },
      statistics: {
        avgScore: this.calculateAverage(batchResult.ranking?.ranking?.map(r => r.score) || []),
        distribution: batchResult.ranking?.distribution
      }
    };
  }

  calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate - startDate;
    return `${Math.round(diff / 1000)} segundos`;
  }

  calculateAverage(arr) {
    return arr.length > 0
      ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      : 0;
  }
}

// Instancia exportada del sistema completo
export const recruitmentSystem = new RecruitmentSystem();

// Export default
export default {
  RecruitmentSystem,
  recruitmentSystem,
  // Re-export de componentes principales
  candidateEvaluator,
  psychometricTestManager,
  cvParser,
  candidateProfiler,
  atsIntegrationManager,
  gamifiedTestManager,
  interviewManager
};
