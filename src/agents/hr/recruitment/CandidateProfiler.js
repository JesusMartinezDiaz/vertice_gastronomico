/**
 * SISTEMA DE PERFILAMIENTO DE CANDIDATOS
 * Vértice Gastronómico - Análisis Integral de Candidatos
 *
 * Incluye:
 * - Generación de perfiles completos
 * - Matching con puestos
 * - Ranking de candidatos
 * - Análisis comparativo
 * - Recomendaciones de contratación
 */

import { cvParser } from './CVParser.js';
import { candidateEvaluator, EXPERIENCE_EVALUATION, COMPETENCY_EVALUATION } from './EvaluationTemplates.js';
import { psychometricTestManager } from './PsychometricTests.js';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════

export const PROFILER_CONFIG = {
  weights: {
    experience: 0.30,
    competencies: 0.25,
    psychometric: 0.20,
    cvQuality: 0.15,
    culturalFit: 0.10
  },
  thresholds: {
    excellent: 85,
    good: 70,
    acceptable: 55,
    risky: 40
  }
};

// ═══════════════════════════════════════════════════════════════════
// PERFILES DE PUESTO IDEALES
// ═══════════════════════════════════════════════════════════════════

export const POSITION_PROFILES = {
  chef_ejecutivo: {
    id: 'PROF-CHEF-001',
    title: 'Chef Ejecutivo',
    category: 'executive',
    requirements: {
      experience: {
        minYears: 5,
        preferredYears: 8,
        requiredPositions: ['chef', 'sous_chef'],
        preferredPositions: ['chef ejecutivo', 'director de cocina']
      },
      skills: {
        required: ['mise en place', 'técnicas de cocción', 'costos', 'liderazgo'],
        preferred: ['cocina molecular', 'sous vide', 'desarrollo de menús']
      },
      certifications: {
        required: ['HACCP', 'distintivo H'],
        preferred: ['certificación culinaria internacional']
      },
      languages: {
        required: ['español'],
        preferred: ['inglés']
      }
    },
    personality: {
      openness: { min: 60, ideal: 80 },
      conscientiousness: { min: 70, ideal: 90 },
      extraversion: { min: 50, ideal: 70 },
      agreeableness: { min: 50, ideal: 70 },
      neuroticism: { max: 40, ideal: 20 }
    },
    psychometric: {
      emotionalIntelligence: { min: 65, ideal: 80 },
      stressCoping: { min: 70, ideal: 85 },
      teamwork: { min: 60, ideal: 75 }
    }
  },

  sous_chef: {
    id: 'PROF-SOUS-001',
    title: 'Sous Chef',
    category: 'kitchen',
    requirements: {
      experience: {
        minYears: 3,
        preferredYears: 5,
        requiredPositions: ['cocinero', 'chef de partida'],
        preferredPositions: ['sous chef']
      },
      skills: {
        required: ['mise en place', 'técnicas de cocción', 'trabajo en equipo'],
        preferred: ['liderazgo', 'costos', 'inventarios']
      },
      certifications: {
        required: ['manejo de alimentos'],
        preferred: ['HACCP']
      }
    },
    personality: {
      openness: { min: 50, ideal: 70 },
      conscientiousness: { min: 65, ideal: 85 },
      extraversion: { min: 45, ideal: 65 },
      agreeableness: { min: 55, ideal: 75 },
      neuroticism: { max: 45, ideal: 25 }
    }
  },

  cocinero: {
    id: 'PROF-COOK-001',
    title: 'Cocinero',
    category: 'kitchen',
    requirements: {
      experience: {
        minYears: 1,
        preferredYears: 3,
        requiredPositions: ['ayudante de cocina', 'cocinero'],
        preferredPositions: []
      },
      skills: {
        required: ['mise en place', 'técnicas básicas'],
        preferred: ['especialidad culinaria']
      },
      certifications: {
        required: [],
        preferred: ['manejo de alimentos']
      }
    },
    personality: {
      conscientiousness: { min: 60, ideal: 80 },
      agreeableness: { min: 55, ideal: 70 },
      neuroticism: { max: 50, ideal: 30 }
    }
  },

  gerente_restaurante: {
    id: 'PROF-MGR-001',
    title: 'Gerente de Restaurante',
    category: 'management',
    requirements: {
      experience: {
        minYears: 5,
        preferredYears: 8,
        requiredPositions: ['supervisor', 'subgerente', 'capitán'],
        preferredPositions: ['gerente']
      },
      skills: {
        required: ['liderazgo', 'costos', 'presupuesto', 'atención al cliente'],
        preferred: ['P&L', 'aperturas', 'capacitación']
      },
      certifications: {
        required: [],
        preferred: ['distintivo H', 'certificación gerencial']
      },
      languages: {
        required: ['español'],
        preferred: ['inglés']
      }
    },
    personality: {
      openness: { min: 55, ideal: 75 },
      conscientiousness: { min: 75, ideal: 90 },
      extraversion: { min: 65, ideal: 85 },
      agreeableness: { min: 55, ideal: 75 },
      neuroticism: { max: 35, ideal: 15 }
    },
    psychometric: {
      emotionalIntelligence: { min: 70, ideal: 85 },
      stressCoping: { min: 75, ideal: 90 },
      integrity: { min: 80, ideal: 95 }
    }
  },

  mesero: {
    id: 'PROF-SRV-001',
    title: 'Mesero',
    category: 'service',
    requirements: {
      experience: {
        minYears: 0.5,
        preferredYears: 2,
        requiredPositions: [],
        preferredPositions: ['mesero', 'garrotero']
      },
      skills: {
        required: ['atención al cliente', 'comunicación'],
        preferred: ['POS', 'venta sugestiva', 'vinos']
      }
    },
    personality: {
      extraversion: { min: 60, ideal: 80 },
      agreeableness: { min: 65, ideal: 85 },
      conscientiousness: { min: 55, ideal: 75 },
      neuroticism: { max: 45, ideal: 25 }
    },
    psychometric: {
      serviceOrientation: { min: 65, ideal: 85 },
      stressCoping: { min: 60, ideal: 80 }
    }
  },

  bartender: {
    id: 'PROF-BAR-001',
    title: 'Bartender',
    category: 'bar',
    requirements: {
      experience: {
        minYears: 1,
        preferredYears: 3,
        requiredPositions: ['bartender', 'barback'],
        preferredPositions: []
      },
      skills: {
        required: ['cócteles', 'destilados', 'atención al cliente'],
        preferred: ['mixología', 'vinos', 'café']
      },
      certifications: {
        required: [],
        preferred: ['certificación bartender', 'sommelier']
      }
    },
    personality: {
      extraversion: { min: 60, ideal: 80 },
      openness: { min: 55, ideal: 75 },
      conscientiousness: { min: 60, ideal: 80 },
      neuroticism: { max: 45, ideal: 25 }
    }
  },

  hostess: {
    id: 'PROF-HOST-001',
    title: 'Host/Hostess',
    category: 'service',
    requirements: {
      experience: {
        minYears: 0,
        preferredYears: 1,
        requiredPositions: [],
        preferredPositions: ['host', 'recepcionista']
      },
      skills: {
        required: ['comunicación', 'presentación personal'],
        preferred: ['reservaciones', 'OpenTable']
      }
    },
    personality: {
      extraversion: { min: 65, ideal: 85 },
      agreeableness: { min: 70, ideal: 90 },
      conscientiousness: { min: 55, ideal: 75 }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL CANDIDATE PROFILER
// ═══════════════════════════════════════════════════════════════════

export class CandidateProfiler {
  constructor(config = {}) {
    this.config = { ...PROFILER_CONFIG, ...config };
    this.positionProfiles = POSITION_PROFILES;
    this.cvParser = cvParser;
    this.evaluator = candidateEvaluator;
    this.testManager = psychometricTestManager;
  }

  /**
   * Genera perfil completo de un candidato
   */
  async generateProfile(candidateData) {
    const profileId = `PROFILE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const profile = {
      profileId: profileId, // Para compatibilidad con tests
      id: profileId,
      createdAt: new Date().toISOString(),
      candidate: {
        name: candidateData.name,
        contact: candidateData.contact || {},
        source: candidateData.source || 'direct'
      },
      cvAnalysis: null,
      experienceProfile: null,
      skillsProfile: null,
      psychometricProfile: null,
      overallAssessment: null,
      positionMatches: [],
      recommendations: []
    };

    // 1. Analizar CV si está disponible
    if (candidateData.cvContent) {
      const cvResult = await this.cvParser.parseCV(candidateData.cvContent, {
        candidateId: profileId
      });
      if (cvResult.success) {
        profile.cvAnalysis = cvResult.data;
        profile.candidate.name = cvResult.data.personal?.name || profile.candidate.name;
        profile.candidate.contact = {
          ...profile.candidate.contact,
          ...cvResult.data.contact
        };
      }
    }

    // 2. Analizar experiencia
    profile.experienceProfile = this.analyzeExperience(
      profile.cvAnalysis?.experience || candidateData.experience
    );

    // 3. Analizar habilidades
    profile.skillsProfile = this.analyzeSkills(
      profile.cvAnalysis?.skills || candidateData.skills
    );

    // 4. Incorporar resultados psicométricos si existen
    if (candidateData.psychometricResults) {
      profile.psychometricProfile = this.analyzePsychometric(candidateData.psychometricResults);
    }

    // 5. Generar evaluación general
    profile.overallAssessment = this.generateOverallAssessment(profile);

    // 6. Calcular matches con posiciones
    for (const [positionKey, positionProfile] of Object.entries(this.positionProfiles)) {
      const match = this.calculatePositionMatch(profile, positionProfile);
      profile.positionMatches.push({
        position: positionKey,
        title: positionProfile.title,
        ...match
      });
    }

    // Ordenar por score de match
    profile.positionMatches.sort((a, b) => b.matchScore - a.matchScore);

    // 7. Generar recomendaciones
    profile.recommendations = this.generateRecommendations(profile);

    return profile;
  }

  /**
   * Procesa múltiples candidatos y genera ranking
   */
  async processMultipleCandidates(candidates, targetPosition) {
    const results = {
      processId: `BATCH-${Date.now()}`,
      targetPosition,
      processedAt: new Date().toISOString(),
      total: candidates.length,
      profiles: [],
      ranking: [],
      statistics: null
    };

    // Generar perfiles
    for (const candidate of candidates) {
      try {
        const profile = await this.generateProfile(candidate);
        results.profiles.push(profile);
      } catch (error) {
        results.profiles.push({
          error: error.message,
          candidate: candidate.name || 'Unknown'
        });
      }
    }

    // Generar ranking para la posición objetivo
    results.ranking = this.generateRanking(results.profiles, targetPosition);

    // Calcular estadísticas
    results.statistics = this.calculateStatistics(results.profiles, targetPosition);

    return results;
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DE ANÁLISIS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Analiza la experiencia del candidato
   */
  analyzeExperience(experienceData) {
    if (!experienceData) {
      return {
        level: 'unknown',
        totalYears: 0,
        relevanceScore: 0,
        trajectory: 'unknown'
      };
    }

    // Manejar formato de array directo o objeto con positions
    let positions = [];
    let totalYears = 0;

    if (Array.isArray(experienceData)) {
      // Formato: [{ position, company, years }, ...]
      positions = experienceData.map(exp => ({
        title: exp.position || exp.title || exp.puesto,
        company: exp.company || exp.empresa,
        years: exp.years || exp.duration || exp.años || 1,
        category: this.inferPositionCategory(exp.position || exp.title || exp.puesto || '')
      }));
      totalYears = positions.reduce((sum, p) => sum + (p.years || 0), 0);
    } else {
      // Formato: { totalYears, positions: [...] }
      totalYears = experienceData.totalYears || 0;
      positions = experienceData.positions || [];
    }

    // Determinar nivel
    let level;
    if (totalYears >= 10) level = 'master';
    else if (totalYears >= 5) level = 'senior';
    else if (totalYears >= 3) level = 'mid-level';
    else if (totalYears >= 1) level = 'junior';
    else level = 'entry';

    // Calcular relevancia
    const relevantCategories = ['executive', 'souschef', 'lineCook', 'service', 'bar', 'management'];
    const relevantPositions = positions.filter(p =>
      relevantCategories.includes(p.category)
    );
    const relevanceScore = positions.length > 0
      ? Math.round((relevantPositions.length / positions.length) * 100)
      : 0;

    // Analizar trayectoria
    let trajectory = 'lateral';
    if (positions.length >= 2) {
      const categories = positions.map(p => p.category);
      if (categories[0] === 'executive' || categories[0] === 'management') {
        trajectory = 'established';
      } else if (this.isProgressiveCareer(categories)) {
        trajectory = 'ascending';
      }
    }

    // Identificar fortalezas de experiencia
    const experienceStrengths = [];
    if (positions.some(p => p.category === 'executive')) {
      experienceStrengths.push('Experiencia ejecutiva');
    }
    if (positions.some(p => p.category === 'management')) {
      experienceStrengths.push('Experiencia gerencial');
    }
    if (positions.length >= 3) {
      experienceStrengths.push('Trayectoria diversa');
    }
    if (totalYears >= 5) {
      experienceStrengths.push('Experiencia consolidada');
    }

    return {
      level,
      totalYears,
      relevanceScore,
      trajectory,
      positionCount: positions.length,
      mostRecentPosition: positions[0] || null,
      categories: [...new Set(positions.map(p => p.category))],
      strengths: experienceStrengths
    };
  }

  /**
   * Infiere la categoría de una posición a partir del título
   */
  inferPositionCategory(positionTitle) {
    const title = (positionTitle || '').toLowerCase();

    if (title.includes('chef ejecutivo') || title.includes('executive chef')) return 'executive';
    if (title.includes('sous chef') || title.includes('subchef')) return 'souschef';
    if (title.includes('chef de partida') || title.includes('line cook')) return 'lineCook';
    if (title.includes('cocinero') || title.includes('cook')) return 'lineCook';
    if (title.includes('ayudante') || title.includes('prep')) return 'prep';
    if (title.includes('gerente') || title.includes('manager') || title.includes('director')) return 'management';
    if (title.includes('capitán') || title.includes('captain')) return 'captain';
    if (title.includes('mesero') || title.includes('waiter') || title.includes('server')) return 'service';
    if (title.includes('bartender') || title.includes('barman')) return 'bar';
    if (title.includes('host')) return 'service';

    return 'other';
  }

  /**
   * Verifica si la carrera es progresiva
   */
  isProgressiveCareer(categories) {
    const hierarchy = {
      prep: 1,
      lineCook: 2,
      souschef: 3,
      executive: 4,
      service: 2,
      captain: 3,
      management: 4
    };

    let lastLevel = 0;
    let progressions = 0;

    for (const cat of categories.reverse()) { // De más antiguo a más reciente
      const level = hierarchy[cat] || 0;
      if (level > lastLevel) {
        progressions++;
      }
      lastLevel = level;
    }

    return progressions >= 2;
  }

  /**
   * Analiza las habilidades del candidato
   */
  analyzeSkills(skillsData) {
    if (!skillsData) {
      return {
        total: 0,
        byCategory: {},
        strengths: [],
        gaps: []
      };
    }

    const analysis = {
      total: skillsData.total || 0,
      byCategory: skillsData.byCategory || {},
      strengths: [],
      gaps: [],
      specializations: []
    };

    // Identificar fortalezas (categorías con múltiples habilidades)
    for (const [category, skills] of Object.entries(analysis.byCategory)) {
      if (skills.length >= 3) {
        analysis.strengths.push({
          category,
          count: skills.length,
          skills
        });
      }
      if (skills.length === 0) {
        analysis.gaps.push(category);
      }
    }

    // Identificar especializaciones
    if (analysis.byCategory.culinary?.length >= 5) {
      analysis.specializations.push('Técnicas culinarias avanzadas');
    }
    if (analysis.byCategory.cuisines?.length >= 3) {
      analysis.specializations.push('Cocina multicultural');
    }
    if (analysis.byCategory.beverage?.length >= 3) {
      analysis.specializations.push('Especialista en bebidas');
    }
    if (analysis.byCategory.management?.length >= 3) {
      analysis.specializations.push('Gestión operativa');
    }

    return analysis;
  }

  /**
   * Analiza resultados psicométricos
   */
  analyzePsychometric(psychometricData) {
    const analysis = {
      available: true,
      tests: {},
      overallProfile: {},
      strengths: [],
      developmentAreas: [],
      fitIndicators: {}
    };

    // Procesar cada test
    for (const [testId, result] of Object.entries(psychometricData)) {
      analysis.tests[testId] = {
        completed: true,
        score: result.overallScore || result.totalEI || result.overallIntegrity || 0,
        details: result
      };

      // Agregar al perfil general
      const score = analysis.tests[testId].score;
      if (score >= 75) {
        analysis.strengths.push(testId);
      } else if (score < 50) {
        analysis.developmentAreas.push(testId);
      }
    }

    // Indicadores de fit
    analysis.fitIndicators = {
      leadership: this.calculateLeadershipFit(analysis.tests),
      service: this.calculateServiceFit(analysis.tests),
      kitchen: this.calculateKitchenFit(analysis.tests),
      management: this.calculateManagementFit(analysis.tests)
    };

    return analysis;
  }

  calculateLeadershipFit(tests) {
    const factors = [
      tests.emotionalIntelligence?.score || 0,
      tests.stressCoping?.score || 0,
      tests.teamwork?.score || 0
    ];
    return Math.round(factors.reduce((a, b) => a + b, 0) / factors.length);
  }

  calculateServiceFit(tests) {
    const factors = [
      tests.serviceOrientation?.score || 0,
      tests.emotionalIntelligence?.score || 0,
      tests.stressCoping?.score || 0
    ];
    return Math.round(factors.reduce((a, b) => a + b, 0) / factors.length);
  }

  calculateKitchenFit(tests) {
    const factors = [
      tests.stressCoping?.score || 0,
      tests.teamwork?.score || 0,
      tests.cognitiveAptitude?.score || 0
    ];
    return Math.round(factors.reduce((a, b) => a + b, 0) / factors.length);
  }

  calculateManagementFit(tests) {
    const factors = [
      tests.emotionalIntelligence?.score || 0,
      tests.integrity?.score || 0,
      tests.stressCoping?.score || 0,
      tests.cognitiveAptitude?.score || 0
    ];
    return Math.round(factors.reduce((a, b) => a + b, 0) / factors.length);
  }

  /**
   * Genera evaluación general del candidato
   */
  generateOverallAssessment(profile) {
    const assessment = {
      score: 0,
      category: 'unknown',
      summary: '',
      strengths: [],
      concerns: [],
      potential: 'medium'
    };

    let totalScore = 0;
    let factors = 0;

    // Factor: Experiencia
    if (profile.experienceProfile) {
      const expScore = Math.min(profile.experienceProfile.totalYears * 10, 100);
      totalScore += expScore * this.config.weights.experience;
      factors++;

      if (profile.experienceProfile.trajectory === 'ascending') {
        assessment.strengths.push('Trayectoria profesional ascendente');
      }
      if (profile.experienceProfile.level === 'senior' || profile.experienceProfile.level === 'master') {
        assessment.strengths.push('Experiencia consolidada en la industria');
      }
    }

    // Factor: Habilidades
    if (profile.skillsProfile) {
      const skillScore = Math.min(profile.skillsProfile.total * 5, 100);
      totalScore += skillScore * this.config.weights.competencies;
      factors++;

      for (const strength of profile.skillsProfile.strengths) {
        assessment.strengths.push(`Fortaleza en ${strength.category}`);
      }
      for (const gap of profile.skillsProfile.gaps) {
        assessment.concerns.push(`Área de desarrollo: ${gap}`);
      }
    }

    // Factor: Psicométrico
    if (profile.psychometricProfile?.available) {
      const psyScores = Object.values(profile.psychometricProfile.tests)
        .map(t => t.score)
        .filter(s => s > 0);
      if (psyScores.length > 0) {
        const avgPsy = psyScores.reduce((a, b) => a + b, 0) / psyScores.length;
        totalScore += avgPsy * this.config.weights.psychometric;
        factors++;

        for (const strength of profile.psychometricProfile.strengths) {
          assessment.strengths.push(`Destaca en: ${strength}`);
        }
        for (const area of profile.psychometricProfile.developmentAreas) {
          assessment.concerns.push(`Fortalecer: ${area}`);
        }
      }
    }

    // Factor: CV
    if (profile.cvAnalysis?.scores) {
      const cvScore = profile.cvAnalysis.scores.overall;
      totalScore += cvScore * this.config.weights.cvQuality;
      factors++;
    }

    // Calcular score final
    assessment.score = factors > 0 ? Math.round(totalScore / factors) : 0;

    // Categorizar
    if (assessment.score >= this.config.thresholds.excellent) {
      assessment.category = 'excellent';
      assessment.potential = 'high';
      assessment.summary = 'Candidato excepcional con alto potencial';
    } else if (assessment.score >= this.config.thresholds.good) {
      assessment.category = 'good';
      assessment.potential = 'high';
      assessment.summary = 'Buen candidato con sólido perfil';
    } else if (assessment.score >= this.config.thresholds.acceptable) {
      assessment.category = 'acceptable';
      assessment.potential = 'medium';
      assessment.summary = 'Candidato aceptable con áreas de desarrollo';
    } else if (assessment.score >= this.config.thresholds.risky) {
      assessment.category = 'risky';
      assessment.potential = 'low';
      assessment.summary = 'Candidato con riesgos identificados';
    } else {
      assessment.category = 'not_recommended';
      assessment.potential = 'low';
      assessment.summary = 'No se recomienda para el proceso';
    }

    return assessment;
  }

  /**
   * Calcula match con una posición específica
   * Acepta tanto (profile, positionProfile) como (candidateData, positionKey)
   */
  calculatePositionMatch(profileOrCandidate, positionProfileOrKey) {
    // Detectar si se pasó un string de posición o un objeto de perfil
    let positionProfile;
    let profile;

    if (typeof positionProfileOrKey === 'string') {
      // Modo: (candidateData, positionKey) - para uso externo/tests
      positionProfile = POSITION_PROFILES[positionProfileOrKey];
      if (!positionProfile) {
        return {
          matchScore: 0,
          matchPercentage: 0,
          fitLevel: 'unknown',
          error: `Posición '${positionProfileOrKey}' no encontrada`,
          gaps: [],
          strengths: []
        };
      }
      // Crear perfil básico desde candidateData
      profile = this.createBasicProfile(profileOrCandidate);
    } else {
      // Modo: (profile, positionProfile) - para uso interno
      profile = profileOrCandidate;
      positionProfile = positionProfileOrKey;
    }

    const match = {
      matchScore: 0,
      matchPercentage: 0,
      fitLevel: 'unknown',
      matchDetails: {
        experience: { score: 0, met: [], unmet: [] },
        skills: { score: 0, met: [], unmet: [] },
        personality: { score: 0, analysis: null },
        overall: { score: 0 }
      },
      gaps: [],
      strengths: []
    };

    const requirements = positionProfile.requirements;

    // 1. Match de experiencia
    if (requirements.experience && profile.experienceProfile) {
      const expMatch = this.matchExperience(profile.experienceProfile, requirements.experience);
      match.matchDetails.experience = expMatch;
    }

    // 2. Match de habilidades
    if (requirements.skills && profile.skillsProfile) {
      const skillMatch = this.matchSkills(profile.skillsProfile, requirements.skills);
      match.matchDetails.skills = skillMatch;
    }

    // 3. Match de personalidad (si hay datos psicométricos)
    if (positionProfile.personality && profile.psychometricProfile?.tests?.personality) {
      const personalityMatch = this.matchPersonality(
        profile.psychometricProfile.tests.personality.details,
        positionProfile.personality
      );
      match.matchDetails.personality = personalityMatch;
    }

    // Calcular score total
    const scores = [
      match.matchDetails.experience.score * 0.35,
      match.matchDetails.skills.score * 0.35,
      match.matchDetails.personality.score * 0.30
    ];

    match.matchScore = Math.round(scores.reduce((a, b) => a + b, 0));
    match.matchPercentage = match.matchScore; // Alias para compatibilidad con tests

    // Determinar nivel de fit
    if (match.matchScore >= 85) {
      match.fitLevel = 'excellent';
    } else if (match.matchScore >= 70) {
      match.fitLevel = 'good';
    } else if (match.matchScore >= 55) {
      match.fitLevel = 'acceptable';
    } else {
      match.fitLevel = 'poor';
    }

    // Identificar gaps y fortalezas
    match.gaps = [
      ...match.matchDetails.experience.unmet,
      ...match.matchDetails.skills.unmet
    ];

    match.strengths = [
      ...match.matchDetails.experience.met,
      ...match.matchDetails.skills.met
    ].slice(0, 5);

    return match;
  }

  matchExperience(experienceProfile, requirements) {
    const result = { score: 0, met: [], unmet: [] };

    // Años de experiencia
    if (experienceProfile.totalYears >= requirements.minYears) {
      result.met.push(`${experienceProfile.totalYears} años de experiencia (mínimo: ${requirements.minYears})`);
      result.score += 50;

      if (experienceProfile.totalYears >= requirements.preferredYears) {
        result.score += 20;
      }
    } else {
      result.unmet.push(`Experiencia insuficiente: ${experienceProfile.totalYears} años (requerido: ${requirements.minYears})`);
    }

    // Posiciones relevantes
    const hasRequiredPositions = requirements.requiredPositions?.some(pos =>
      experienceProfile.categories?.includes(pos)
    );

    if (hasRequiredPositions || requirements.requiredPositions?.length === 0) {
      result.met.push('Experiencia en posiciones relevantes');
      result.score += 30;
    } else {
      result.unmet.push('Sin experiencia en posiciones requeridas');
    }

    return result;
  }

  matchSkills(skillsProfile, requirements) {
    const result = { score: 0, met: [], unmet: [] };

    // Habilidades requeridas
    const allSkills = Object.values(skillsProfile.byCategory).flat();
    const allSkillsLower = allSkills.map(s => s.toLowerCase());

    let requiredMet = 0;
    for (const skill of requirements.required || []) {
      if (allSkillsLower.some(s => s.includes(skill.toLowerCase()))) {
        result.met.push(`Habilidad: ${skill}`);
        requiredMet++;
      } else {
        result.unmet.push(`Falta habilidad: ${skill}`);
      }
    }

    const requiredCount = requirements.required?.length || 1;
    result.score = Math.round((requiredMet / requiredCount) * 70);

    // Habilidades preferidas (bonus)
    let preferredMet = 0;
    for (const skill of requirements.preferred || []) {
      if (allSkillsLower.some(s => s.includes(skill.toLowerCase()))) {
        result.met.push(`Habilidad plus: ${skill}`);
        preferredMet++;
      }
    }

    if (requirements.preferred?.length > 0) {
      result.score += Math.round((preferredMet / requirements.preferred.length) * 30);
    } else {
      result.score += 30;
    }

    return result;
  }

  /**
   * Crea un perfil básico desde candidateData para uso con calculatePositionMatch
   * cuando se llama con formato externo
   */
  createBasicProfile(candidateData) {
    // Calcular años de experiencia
    let totalYears = candidateData.yearsExperience || 0;
    if (candidateData.experience && Array.isArray(candidateData.experience)) {
      totalYears = candidateData.experience.reduce((sum, exp) => {
        return sum + (exp.duration || exp.years || 1);
      }, 0);
    }

    // Extraer categorías de puestos de la experiencia
    const categories = [];
    if (candidateData.experience && Array.isArray(candidateData.experience)) {
      candidateData.experience.forEach(exp => {
        const pos = (exp.position || exp.title || '').toLowerCase();
        if (pos.includes('chef')) categories.push('chef');
        if (pos.includes('sous')) categories.push('sous_chef');
        if (pos.includes('cocinero')) categories.push('cocinero');
        if (pos.includes('mesero')) categories.push('mesero');
        if (pos.includes('gerente')) categories.push('gerente');
        if (pos.includes('bartender')) categories.push('bartender');
      });
    }

    // Extraer habilidades
    const skills = candidateData.skills || [];
    const skillsByCategory = {
      technical: skills.filter(s => typeof s === 'string'),
      culinary: [],
      management: [],
      soft: []
    };

    return {
      experienceProfile: {
        totalYears,
        categories: [...new Set(categories)],
        positions: candidateData.experience || []
      },
      skillsProfile: {
        byCategory: skillsByCategory,
        allSkills: skills
      },
      psychometricProfile: candidateData.psychometric || null
    };
  }

  matchPersonality(personalityResult, requirements) {
    if (!personalityResult?.factorScores) {
      return { score: 50, analysis: 'Sin datos de personalidad' };
    }

    let totalMatch = 0;
    let factors = 0;
    const analysis = [];

    for (const [factor, criteria] of Object.entries(requirements)) {
      const candidateScore = personalityResult.factorScores[factor]?.normalized || 50;

      if (criteria.min && candidateScore >= criteria.min) {
        totalMatch += (candidateScore >= criteria.ideal) ? 100 : 70;
        analysis.push(`${factor}: Cumple (${candidateScore}%)`);
      } else if (criteria.max && candidateScore <= criteria.max) {
        totalMatch += (candidateScore <= criteria.ideal) ? 100 : 70;
        analysis.push(`${factor}: Cumple (${candidateScore}%)`);
      } else {
        totalMatch += 30;
        analysis.push(`${factor}: Brecha (${candidateScore}%)`);
      }
      factors++;
    }

    return {
      score: factors > 0 ? Math.round(totalMatch / factors) : 50,
      analysis: analysis.join(', ')
    };
  }

  /**
   * Genera ranking de candidatos para una posición
   */
  generateRanking(profiles, targetPosition) {
    const positionProfile = this.positionProfiles[targetPosition];
    if (!positionProfile) {
      return { error: 'Posición no encontrada' };
    }

    const ranking = profiles
      .filter(p => !p.error)
      .map(profile => {
        const match = profile.positionMatches?.find(m => m.position === targetPosition);
        return {
          candidateId: profile.id,
          candidateName: profile.candidate?.name || 'Unknown',
          matchScore: match?.matchScore || 0,
          fitLevel: match?.fitLevel || 'unknown',
          overallScore: profile.overallAssessment?.score || 0,
          category: profile.overallAssessment?.category || 'unknown',
          topStrengths: match?.strengths?.slice(0, 3) || [],
          keyGaps: match?.gaps?.slice(0, 3) || []
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    // Asignar rank
    ranking.forEach((candidate, index) => {
      candidate.rank = index + 1;
    });

    return {
      position: targetPosition,
      positionTitle: positionProfile.title,
      totalCandidates: ranking.length,
      ranking,
      topCandidates: ranking.slice(0, 5),
      summary: {
        excellent: ranking.filter(c => c.fitLevel === 'excellent').length,
        good: ranking.filter(c => c.fitLevel === 'good').length,
        acceptable: ranking.filter(c => c.fitLevel === 'acceptable').length,
        poor: ranking.filter(c => c.fitLevel === 'poor').length
      }
    };
  }

  /**
   * Calcula estadísticas del batch
   */
  calculateStatistics(profiles, targetPosition) {
    const validProfiles = profiles.filter(p => !p.error);

    if (validProfiles.length === 0) {
      return { message: 'No hay perfiles válidos para analizar' };
    }

    const scores = validProfiles.map(p =>
      p.positionMatches?.find(m => m.position === targetPosition)?.matchScore || 0
    );

    const experienceYears = validProfiles
      .map(p => p.experienceProfile?.totalYears || 0)
      .filter(y => y > 0);

    return {
      candidateCount: validProfiles.length,
      matchScores: {
        average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        max: Math.max(...scores),
        min: Math.min(...scores),
        median: this.median(scores)
      },
      experience: {
        averageYears: experienceYears.length > 0
          ? Math.round(experienceYears.reduce((a, b) => a + b, 0) / experienceYears.length * 10) / 10
          : 0,
        maxYears: Math.max(...experienceYears, 0),
        minYears: Math.min(...experienceYears, 0)
      },
      distribution: {
        excellent: validProfiles.filter(p =>
          p.positionMatches?.find(m => m.position === targetPosition)?.fitLevel === 'excellent'
        ).length,
        good: validProfiles.filter(p =>
          p.positionMatches?.find(m => m.position === targetPosition)?.fitLevel === 'good'
        ).length,
        acceptable: validProfiles.filter(p =>
          p.positionMatches?.find(m => m.position === targetPosition)?.fitLevel === 'acceptable'
        ).length,
        poor: validProfiles.filter(p =>
          p.positionMatches?.find(m => m.position === targetPosition)?.fitLevel === 'poor'
        ).length
      }
    };
  }

  median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Genera recomendaciones para el candidato
   */
  generateRecommendations(profile) {
    const recommendations = [];

    // Basado en el score general
    const assessment = profile.overallAssessment;

    if (assessment.category === 'excellent') {
      recommendations.push({
        type: 'action',
        priority: 'high',
        text: 'Candidato prioritario - Agendar entrevista final inmediatamente'
      });
      recommendations.push({
        type: 'action',
        priority: 'high',
        text: 'Preparar oferta competitiva para asegurar al candidato'
      });
    } else if (assessment.category === 'good') {
      recommendations.push({
        type: 'action',
        priority: 'medium',
        text: 'Avanzar a siguiente etapa del proceso'
      });
      if (assessment.concerns.length > 0) {
        recommendations.push({
          type: 'development',
          priority: 'medium',
          text: `Evaluar más profundamente: ${assessment.concerns[0]}`
        });
      }
    } else if (assessment.category === 'acceptable') {
      recommendations.push({
        type: 'action',
        priority: 'low',
        text: 'Considerar si no hay mejores candidatos disponibles'
      });
      recommendations.push({
        type: 'development',
        priority: 'medium',
        text: 'Requiere plan de desarrollo si se contrata'
      });
    } else {
      recommendations.push({
        type: 'action',
        priority: 'low',
        text: 'No se recomienda continuar con el proceso'
      });
    }

    // Basado en el mejor match de posición
    if (profile.positionMatches?.length > 0) {
      const bestMatch = profile.positionMatches[0];
      if (bestMatch.matchScore >= 70) {
        recommendations.push({
          type: 'position',
          priority: 'high',
          text: `Mejor fit para: ${bestMatch.title} (${bestMatch.matchScore}% match)`
        });
      }
    }

    // Basado en gaps identificados
    for (const gap of assessment.concerns.slice(0, 2)) {
      recommendations.push({
        type: 'development',
        priority: 'medium',
        text: gap
      });
    }

    return recommendations;
  }

  /**
   * Compara dos candidatos
   */
  compareCandidates(profile1, profile2, position) {
    const match1 = profile1.positionMatches?.find(m => m.position === position);
    const match2 = profile2.positionMatches?.find(m => m.position === position);

    return {
      comparison: {
        candidate1: {
          name: profile1.candidate?.name,
          matchScore: match1?.matchScore || 0,
          overallScore: profile1.overallAssessment?.score || 0,
          experienceYears: profile1.experienceProfile?.totalYears || 0,
          strengths: match1?.strengths || []
        },
        candidate2: {
          name: profile2.candidate?.name,
          matchScore: match2?.matchScore || 0,
          overallScore: profile2.overallAssessment?.score || 0,
          experienceYears: profile2.experienceProfile?.totalYears || 0,
          strengths: match2?.strengths || []
        }
      },
      recommendation: this.getComparisonRecommendation(profile1, profile2, match1, match2),
      differentiators: this.identifyDifferentiators(profile1, profile2)
    };
  }

  getComparisonRecommendation(profile1, profile2, match1, match2) {
    const score1 = match1?.matchScore || 0;
    const score2 = match2?.matchScore || 0;

    if (Math.abs(score1 - score2) < 5) {
      return 'Candidatos muy similares - considerar entrevista adicional para diferenciar';
    } else if (score1 > score2) {
      return `Se recomienda ${profile1.candidate?.name} con ${score1 - score2}% de ventaja`;
    } else {
      return `Se recomienda ${profile2.candidate?.name} con ${score2 - score1}% de ventaja`;
    }
  }

  identifyDifferentiators(profile1, profile2) {
    const differentiators = [];

    // Experiencia
    const exp1 = profile1.experienceProfile?.totalYears || 0;
    const exp2 = profile2.experienceProfile?.totalYears || 0;
    if (Math.abs(exp1 - exp2) >= 2) {
      differentiators.push({
        factor: 'Experiencia',
        advantage: exp1 > exp2 ? profile1.candidate?.name : profile2.candidate?.name,
        difference: `${Math.abs(exp1 - exp2)} años de diferencia`
      });
    }

    // Skills
    const skills1 = profile1.skillsProfile?.total || 0;
    const skills2 = profile2.skillsProfile?.total || 0;
    if (Math.abs(skills1 - skills2) >= 5) {
      differentiators.push({
        factor: 'Habilidades',
        advantage: skills1 > skills2 ? profile1.candidate?.name : profile2.candidate?.name,
        difference: `${Math.abs(skills1 - skills2)} habilidades de diferencia`
      });
    }

    return differentiators;
  }
}

// Instancia exportada
export const candidateProfiler = new CandidateProfiler();

export default {
  PROFILER_CONFIG,
  POSITION_PROFILES,
  CandidateProfiler,
  candidateProfiler
};
