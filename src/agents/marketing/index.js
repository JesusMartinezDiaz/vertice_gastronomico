/**
 * Marketing Agents - Agentes de Marketing y Comunicación (13-17)
 *
 * CONTEXTO: Vértice Gastronómico es una CONSULTORÍA que asesora restaurantes.
 * Estos agentes proveen servicios de marketing a los clientes de la consultoría.
 *
 * Agentes:
 * - 13: Director de Marketing (CMO)
 * - 14: Brand Manager
 * - 15: Digital Marketing Specialist
 * - 16: Content Creator
 * - 17: Community Manager
 */

import { EventEmitter } from 'events';

// Constantes de Marketing
export const MARKETING_CHANNELS = {
  SOCIAL_MEDIA: 'social_media',
  EMAIL: 'email',
  WEBSITE: 'website',
  LOCAL_SEO: 'local_seo',
  PAID_ADS: 'paid_ads',
  INFLUENCER: 'influencer',
  PR: 'public_relations',
  EVENTS: 'events',
  REFERRAL: 'referral',
  LOYALTY: 'loyalty'
};

export const CONTENT_TYPES = {
  BLOG_POST: 'blog_post',
  SOCIAL_POST: 'social_post',
  VIDEO: 'video',
  PHOTO: 'photo',
  STORY: 'story',
  REEL: 'reel',
  NEWSLETTER: 'newsletter',
  PRESS_RELEASE: 'press_release',
  CASE_STUDY: 'case_study',
  INFOGRAPHIC: 'infographic'
};

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BRAND_ELEMENTS = {
  LOGO: 'logo',
  COLORS: 'colors',
  TYPOGRAPHY: 'typography',
  VOICE: 'voice',
  MESSAGING: 'messaging',
  VISUAL_STYLE: 'visual_style',
  VALUES: 'values'
};

/**
 * Clase base para agentes de Marketing
 */
class BaseMarketingAgent extends EventEmitter {
  constructor(id, name, specialty) {
    super();
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.category = 'marketing';
    this.initialized = false;
    this.currentTasks = [];
    this.metrics = {
      campaignsManaged: 0,
      contentCreated: 0,
      analysesPerformed: 0
    };
  }

  async initialize() {
    if (this.initialized) return;
    console.log(`[Agent ${this.id}] Inicializando ${this.name}...`);
    this.initialized = true;
    this.emit('initialized', { agentId: this.id, name: this.name });
  }

  async processRequest(message, context = {}) {
    await this.initialize();

    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      context,
      startedAt: new Date().toISOString(),
      status: 'processing'
    };

    this.currentTasks.push(task);
    this.emit('task:started', { task });

    try {
      const result = await this.executeTask(task);
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = result;
      this.emit('task:completed', { task });
      return result;
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      this.emit('task:failed', { task, error });
      throw error;
    }
  }

  async executeTask(task) {
    throw new Error('executeTask debe ser implementado por subclases');
  }

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      specialty: this.specialty,
      category: this.category,
      initialized: this.initialized,
      activeTasks: this.currentTasks.filter(t => t.status === 'processing').length,
      metrics: this.metrics
    };
  }
}

/**
 * Agent 13 - Director de Marketing (CMO)
 * Responsable de la estrategia de marketing global
 */
export class CMOAgent extends BaseMarketingAgent {
  constructor() {
    super(13, 'Director de Marketing (CMO)', 'Estrategia de marketing y posicionamiento');
    this.capabilities = [
      'marketing_strategy',
      'brand_positioning',
      'budget_allocation',
      'campaign_planning',
      'market_analysis',
      'competitor_tracking',
      'roi_optimization',
      'team_coordination'
    ];
    this.subordinates = [14, 15, 16, 17]; // Brand Manager, Digital, Content, Community
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'marketing_leadership',
      analysis: await this.analyzeMarketingNeeds(message, context),
      strategy: await this.developStrategy(context),
      recommendations: this.generateRecommendations(context),
      delegation: this.planDelegation(context),
      timestamp: new Date().toISOString()
    };
  }

  async analyzeMarketingNeeds(message, context) {
    return {
      clientProfile: this.assessClientProfile(context.clientId),
      marketPosition: 'analysis_pending',
      competitorLandscape: [],
      targetAudience: this.defineTargetAudience(context),
      uniqueSellingPoints: [],
      challenges: [],
      opportunities: []
    };
  }

  assessClientProfile(clientId) {
    return {
      clientId,
      restaurantType: 'to_be_determined',
      currentMarketingMaturity: 'assessment_needed',
      budget: 'to_be_defined',
      goals: []
    };
  }

  defineTargetAudience(context) {
    return {
      demographics: {
        ageRange: '25-55',
        income: 'medio-alto',
        location: 'local/regional'
      },
      psychographics: {
        lifestyle: 'urban_professionals',
        values: ['quality', 'experience', 'convenience'],
        interests: ['gastronomy', 'social_dining']
      },
      behaviors: {
        diningFrequency: 'weekly',
        channels: ['instagram', 'google', 'word_of_mouth'],
        decisionFactors: ['reviews', 'recommendations', 'location']
      }
    };
  }

  async developStrategy(context) {
    return {
      objectives: [
        'Aumentar reconocimiento de marca',
        'Incrementar tráfico de clientes',
        'Mejorar retención y lealtad',
        'Optimizar presencia digital'
      ],
      pillars: [
        {
          name: 'Brand Building',
          owner: 14, // Brand Manager
          activities: ['identity_refresh', 'messaging', 'visual_consistency']
        },
        {
          name: 'Digital Presence',
          owner: 15, // Digital Marketing
          activities: ['seo', 'paid_media', 'social_ads']
        },
        {
          name: 'Content Strategy',
          owner: 16, // Content Creator
          activities: ['visual_content', 'storytelling', 'user_generated']
        },
        {
          name: 'Community Engagement',
          owner: 17, // Community Manager
          activities: ['social_management', 'reviews', 'loyalty']
        }
      ],
      timeline: {
        phase1: 'Foundation (Month 1-2)',
        phase2: 'Growth (Month 3-6)',
        phase3: 'Optimization (Month 7+)'
      },
      kpis: [
        { metric: 'Brand Awareness', target: '+30%', period: '6 months' },
        { metric: 'Social Following', target: '+50%', period: '6 months' },
        { metric: 'Customer Acquisition Cost', target: '-20%', period: '6 months' },
        { metric: 'Customer Lifetime Value', target: '+25%', period: '12 months' }
      ]
    };
  }

  generateRecommendations(context) {
    return [
      {
        priority: 'alta',
        area: 'Identidad de Marca',
        action: 'Auditoría completa de marca y propuesta de valor diferenciada',
        assignTo: 14
      },
      {
        priority: 'alta',
        area: 'Presencia Digital',
        action: 'Optimización de Google My Business y estrategia SEO local',
        assignTo: 15
      },
      {
        priority: 'media',
        area: 'Contenido',
        action: 'Calendario editorial y producción de contenido visual',
        assignTo: 16
      },
      {
        priority: 'media',
        area: 'Comunidad',
        action: 'Estrategia de gestión de reseñas y engagement',
        assignTo: 17
      }
    ];
  }

  planDelegation(context) {
    return {
      delegateTo: this.subordinates,
      assignments: [
        { agentId: 14, task: 'brand_audit', priority: 'high' },
        { agentId: 15, task: 'digital_audit', priority: 'high' },
        { agentId: 16, task: 'content_calendar', priority: 'medium' },
        { agentId: 17, task: 'community_strategy', priority: 'medium' }
      ]
    };
  }

  async createMarketingPlan(data, context = {}) {
    this.metrics.campaignsManaged++;

    return {
      planId: `mktplan_${Date.now()}`,
      clientId: data.clientId,
      restaurantName: data.restaurantName,
      duration: data.duration || '6 months',
      budget: data.budget,
      objectives: data.objectives || [],
      strategy: await this.developStrategy(context),
      tactics: this.defineTactics(data),
      budget_allocation: this.allocateBudget(data.budget),
      success_metrics: this.defineSuccessMetrics(),
      created: new Date().toISOString()
    };
  }

  defineTactics(data) {
    return {
      awareness: [
        'Social media advertising',
        'Influencer partnerships',
        'Local PR and events',
        'Google Ads campaigns'
      ],
      consideration: [
        'Content marketing',
        'Email nurturing',
        'Review management',
        'Website optimization'
      ],
      conversion: [
        'Promotional offers',
        'Reservation optimization',
        'Retargeting campaigns',
        'Partnership promotions'
      ],
      retention: [
        'Loyalty program',
        'Email marketing',
        'Exclusive events',
        'Personalized offers'
      ]
    };
  }

  allocateBudget(totalBudget) {
    const budget = totalBudget || 10000;
    return {
      digital_advertising: budget * 0.35,
      content_production: budget * 0.20,
      influencer_marketing: budget * 0.15,
      events_and_pr: budget * 0.15,
      tools_and_software: budget * 0.10,
      contingency: budget * 0.05
    };
  }

  defineSuccessMetrics() {
    return [
      { name: 'Reach', baseline: 0, target: 50000, unit: 'impressions/month' },
      { name: 'Engagement Rate', baseline: 2, target: 5, unit: 'percent' },
      { name: 'Website Traffic', baseline: 1000, target: 3000, unit: 'visits/month' },
      { name: 'Reservations', baseline: 100, target: 200, unit: 'bookings/month' },
      { name: 'Customer Reviews', baseline: 4.0, target: 4.5, unit: 'avg rating' }
    ];
  }
}

/**
 * Agent 14 - Brand Manager
 * Gestión de identidad y posicionamiento de marca
 */
export class BrandManagerAgent extends BaseMarketingAgent {
  constructor() {
    super(14, 'Brand Manager', 'Gestión de identidad y posicionamiento de marca');
    this.capabilities = [
      'brand_strategy',
      'identity_design',
      'brand_guidelines',
      'positioning',
      'messaging',
      'brand_audit',
      'rebranding',
      'brand_monitoring'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'brand_management',
      brandAnalysis: await this.analyzeBrand(context),
      recommendations: this.generateBrandRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async analyzeBrand(context) {
    return {
      currentState: {
        brandAwareness: 'low_to_medium',
        brandPerception: 'neutral',
        visualIdentity: 'needs_review',
        messageConsistency: 'inconsistent'
      },
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };
  }

  generateBrandRecommendations(context) {
    return [
      {
        element: 'Positioning',
        recommendation: 'Definir posicionamiento claro y diferenciado',
        priority: 'alta'
      },
      {
        element: 'Visual Identity',
        recommendation: 'Actualizar elementos visuales para consistencia',
        priority: 'media'
      },
      {
        element: 'Messaging',
        recommendation: 'Crear framework de mensajes clave',
        priority: 'alta'
      }
    ];
  }

  async conductBrandAudit(data, context = {}) {
    this.metrics.analysesPerformed++;

    return {
      auditId: `brand_audit_${Date.now()}`,
      clientId: data.clientId,
      restaurantName: data.restaurantName,
      auditDate: new Date().toISOString(),
      elements: {
        logo: this.evaluateLogo(data),
        colors: this.evaluateColors(data),
        typography: this.evaluateTypography(data),
        voice: this.evaluateVoice(data),
        messaging: this.evaluateMessaging(data),
        touchpoints: this.evaluateTouchpoints(data)
      },
      overallScore: 0, // Calculated
      recommendations: [],
      actionPlan: []
    };
  }

  evaluateLogo(data) {
    return {
      element: 'logo',
      score: 7,
      criteria: {
        memorability: 7,
        versatility: 6,
        relevance: 8,
        uniqueness: 6
      },
      notes: 'Logo funcional pero puede mejorarse diferenciación',
      recommendations: ['Consider refresh for digital applications']
    };
  }

  evaluateColors(data) {
    return {
      element: 'colors',
      score: 6,
      palette: [],
      criteria: {
        consistency: 5,
        appropriateness: 7,
        differentiation: 6
      },
      recommendations: ['Define color palette and usage guidelines']
    };
  }

  evaluateTypography(data) {
    return {
      element: 'typography',
      score: 6,
      fonts: [],
      criteria: {
        readability: 7,
        consistency: 5,
        brandFit: 6
      },
      recommendations: ['Standardize font family across all materials']
    };
  }

  evaluateVoice(data) {
    return {
      element: 'voice',
      score: 5,
      currentTone: 'inconsistent',
      criteria: {
        consistency: 4,
        authenticity: 6,
        differentiation: 5
      },
      recommendations: ['Develop brand voice guidelines']
    };
  }

  evaluateMessaging(data) {
    return {
      element: 'messaging',
      score: 5,
      criteria: {
        clarity: 5,
        consistency: 4,
        compelling: 6
      },
      recommendations: ['Create key messages framework']
    };
  }

  evaluateTouchpoints(data) {
    return {
      element: 'touchpoints',
      score: 6,
      touchpoints: [
        { name: 'Website', score: 6 },
        { name: 'Social Media', score: 5 },
        { name: 'Menu', score: 7 },
        { name: 'Signage', score: 6 },
        { name: 'Packaging', score: 5 }
      ],
      recommendations: ['Audit all customer touchpoints for consistency']
    };
  }

  async createBrandGuidelines(data, context = {}) {
    return {
      guidelineId: `brand_guide_${Date.now()}`,
      clientId: data.clientId,
      version: '1.0',
      sections: {
        brandStory: this.defineBrandStory(data),
        visualIdentity: this.defineVisualIdentity(data),
        voiceAndTone: this.defineVoiceAndTone(data),
        applications: this.defineApplications(data)
      },
      created: new Date().toISOString()
    };
  }

  defineBrandStory(data) {
    return {
      mission: '',
      vision: '',
      values: [],
      positioning: '',
      uniqueValue: '',
      brandPersonality: []
    };
  }

  defineVisualIdentity(data) {
    return {
      logo: {
        primary: '',
        secondary: '',
        favicon: '',
        clearSpace: '',
        minimumSize: ''
      },
      colors: {
        primary: [],
        secondary: [],
        accent: [],
        neutral: []
      },
      typography: {
        headings: '',
        body: '',
        accent: ''
      },
      imagery: {
        style: '',
        subjects: [],
        treatments: []
      }
    };
  }

  defineVoiceAndTone(data) {
    return {
      voiceAttributes: [],
      toneVariations: {
        formal: '',
        casual: '',
        promotional: ''
      },
      doAndDont: {
        do: [],
        dont: []
      },
      keyMessages: []
    };
  }

  defineApplications(data) {
    return {
      digital: ['website', 'social', 'email', 'app'],
      print: ['menu', 'business_cards', 'signage', 'packaging'],
      environmental: ['interior', 'exterior', 'uniforms']
    };
  }
}

/**
 * Agent 15 - Digital Marketing Specialist
 * Estrategia y ejecución de marketing digital
 */
export class DigitalMarketingAgent extends BaseMarketingAgent {
  constructor() {
    super(15, 'Especialista en Marketing Digital', 'Estrategia digital, SEO, SEM y analytics');
    this.capabilities = [
      'seo_optimization',
      'sem_campaigns',
      'social_advertising',
      'email_marketing',
      'analytics',
      'conversion_optimization',
      'marketing_automation',
      'performance_tracking'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'digital_marketing',
      digitalAudit: await this.conductDigitalAudit(context),
      strategy: this.developDigitalStrategy(context),
      recommendations: this.generateDigitalRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async conductDigitalAudit(context) {
    this.metrics.analysesPerformed++;

    return {
      website: {
        seoScore: 0,
        performance: 0,
        mobileOptimization: 0,
        userExperience: 0
      },
      socialMedia: {
        platforms: [],
        totalFollowers: 0,
        engagementRate: 0,
        postingFrequency: 0
      },
      localSEO: {
        googleMyBusiness: {
          claimed: false,
          optimized: false,
          reviews: 0,
          rating: 0
        }
      },
      paidMedia: {
        activeCampaigns: 0,
        totalSpend: 0,
        roas: 0
      },
      email: {
        listSize: 0,
        openRate: 0,
        clickRate: 0
      }
    };
  }

  developDigitalStrategy(context) {
    return {
      objectives: [
        'Mejorar visibilidad en búsquedas locales',
        'Aumentar tráfico web cualificado',
        'Generar leads y reservaciones',
        'Optimizar conversiones'
      ],
      channels: {
        organic: {
          seo: { priority: 'high', budget: 0 },
          social: { priority: 'high', budget: 0 },
          email: { priority: 'medium', budget: 0 }
        },
        paid: {
          googleAds: { priority: 'high', budget: 0 },
          socialAds: { priority: 'medium', budget: 0 },
          display: { priority: 'low', budget: 0 }
        }
      },
      tactics: this.defineTactics()
    };
  }

  defineTactics() {
    return {
      seo: [
        'Optimización on-page',
        'Local SEO y Google My Business',
        'Schema markup para restaurantes',
        'Link building local'
      ],
      sem: [
        'Campañas de búsqueda local',
        'Remarketing',
        'Campañas de reservaciones'
      ],
      social: [
        'Contenido orgánico',
        'Campañas de awareness',
        'Campañas de engagement',
        'Promociones especiales'
      ],
      email: [
        'Automatización de bienvenida',
        'Newsletter semanal',
        'Campañas de reactivación',
        'Ofertas personalizadas'
      ]
    };
  }

  generateDigitalRecommendations(context) {
    return [
      {
        channel: 'Local SEO',
        priority: 'crítica',
        action: 'Optimizar y verificar Google My Business',
        expectedImpact: 'Alto',
        effort: 'Bajo'
      },
      {
        channel: 'Website',
        priority: 'alta',
        action: 'Implementar schema markup de restaurante',
        expectedImpact: 'Medio',
        effort: 'Medio'
      },
      {
        channel: 'Paid Search',
        priority: 'alta',
        action: 'Lanzar campañas de búsqueda local',
        expectedImpact: 'Alto',
        effort: 'Medio'
      },
      {
        channel: 'Social Ads',
        priority: 'media',
        action: 'Configurar campañas de remarketing',
        expectedImpact: 'Medio',
        effort: 'Medio'
      }
    ];
  }

  async optimizeLocalSEO(data, context = {}) {
    return {
      optimizationId: `local_seo_${Date.now()}`,
      clientId: data.clientId,
      googleMyBusiness: {
        profile: this.optimizeGMBProfile(data),
        posts: this.planGMBPosts(data),
        photos: this.recommendPhotos(data),
        qa: this.planQA(data)
      },
      localListings: this.auditLocalListings(data),
      reviewStrategy: this.developReviewStrategy(data),
      localContent: this.planLocalContent(data)
    };
  }

  optimizeGMBProfile(data) {
    return {
      businessName: { status: 'optimize', action: 'Include location if relevant' },
      category: { status: 'review', action: 'Select most accurate categories' },
      description: { status: 'optimize', action: 'Include keywords and USP' },
      attributes: { status: 'complete', action: 'Add all relevant attributes' },
      hours: { status: 'verify', action: 'Ensure accuracy' },
      menu: { status: 'add', action: 'Upload current menu' },
      services: { status: 'list', action: 'Add reservations, delivery, etc.' }
    };
  }

  planGMBPosts(data) {
    return {
      frequency: 'weekly',
      types: ['offers', 'events', 'updates', 'photos'],
      schedule: []
    };
  }

  recommendPhotos(data) {
    return {
      required: [
        'Exterior - daytime',
        'Exterior - nighttime',
        'Interior - dining area',
        'Interior - bar/counter',
        'Signature dishes (5-10)',
        'Chef/Team'
      ],
      specifications: {
        format: 'JPEG',
        minResolution: '720x720',
        style: 'Professional, well-lit, appetizing'
      }
    };
  }

  planQA(data) {
    return {
      commonQuestions: [
        'Do you take reservations?',
        'Is parking available?',
        'Do you have vegetarian options?',
        'What are your hours?'
      ],
      strategy: 'Proactively seed Q&A with common questions'
    };
  }

  auditLocalListings(data) {
    return {
      platforms: [
        { name: 'Google My Business', status: 'check' },
        { name: 'Yelp', status: 'check' },
        { name: 'TripAdvisor', status: 'check' },
        { name: 'Facebook', status: 'check' },
        { name: 'Apple Maps', status: 'check' }
      ],
      action: 'Audit NAP consistency across all listings'
    };
  }

  developReviewStrategy(data) {
    return {
      goals: {
        quantity: 'Increase reviews by 50%',
        quality: 'Maintain 4.5+ average rating'
      },
      tactics: [
        'Train staff on review requests',
        'Create review request cards',
        'Follow-up email automation',
        'Respond to all reviews within 24h'
      ],
      responseTemplates: {
        positive: 'Thank and personalize',
        negative: 'Acknowledge, apologize, offer resolution',
        neutral: 'Thank and invite back'
      }
    };
  }

  planLocalContent(data) {
    return {
      topics: [
        'Neighborhood guides',
        'Local partnerships',
        'Community events',
        'Seasonal local ingredients'
      ],
      keywords: []
    };
  }

  async createCampaign(data, context = {}) {
    this.metrics.campaignsManaged++;

    return {
      campaignId: `campaign_${Date.now()}`,
      name: data.name,
      type: data.type,
      objective: data.objective,
      channels: data.channels,
      targeting: this.defineTargeting(data),
      creative: this.planCreative(data),
      budget: data.budget,
      schedule: data.schedule,
      tracking: this.setupTracking(data),
      status: CAMPAIGN_STATUS.DRAFT
    };
  }

  defineTargeting(data) {
    return {
      geographic: {
        type: 'radius',
        center: data.location,
        radius: '10km'
      },
      demographic: {
        age: '25-55',
        gender: 'all'
      },
      interests: ['restaurants', 'food', 'dining out'],
      behaviors: ['frequent diners', 'online reservations'],
      custom: []
    };
  }

  planCreative(data) {
    return {
      formats: ['image', 'carousel', 'video'],
      variations: 3,
      messaging: {
        headlines: [],
        descriptions: [],
        ctas: ['Reserve Now', 'View Menu', 'Get Directions']
      }
    };
  }

  setupTracking(data) {
    return {
      pixels: ['google_analytics', 'facebook_pixel'],
      conversions: ['reservation', 'menu_view', 'directions'],
      attribution: 'data_driven',
      reporting: 'weekly'
    };
  }
}

/**
 * Agent 16 - Content Creator
 * Creación de contenido visual y escrito
 */
export class ContentCreatorAgent extends BaseMarketingAgent {
  constructor() {
    super(16, 'Content Creator', 'Creación de contenido visual y storytelling');
    this.capabilities = [
      'content_strategy',
      'copywriting',
      'visual_content',
      'video_production',
      'photography_direction',
      'storytelling',
      'content_calendar',
      'ugc_management'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'content_creation',
      contentStrategy: await this.developContentStrategy(context),
      contentCalendar: this.createContentCalendar(context),
      recommendations: this.generateContentRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async developContentStrategy(context) {
    return {
      pillars: [
        {
          name: 'Behind the Scenes',
          description: 'Mostrar el equipo, procesos, historias',
          frequency: '2x/week',
          formats: ['story', 'reel', 'post']
        },
        {
          name: 'Food Showcase',
          description: 'Platos destacados, ingredientes, presentación',
          frequency: '3x/week',
          formats: ['post', 'reel', 'carousel']
        },
        {
          name: 'Community & Events',
          description: 'Clientes, eventos especiales, colaboraciones',
          frequency: '1x/week',
          formats: ['post', 'story', 'reel']
        },
        {
          name: 'Educational',
          description: 'Tips, recetas, técnicas',
          frequency: '1x/week',
          formats: ['carousel', 'reel', 'blog']
        }
      ],
      tone: {
        voice: 'Friendly, passionate, authentic',
        style: 'Visual-first, story-driven',
        language: 'Approachable but knowledgeable'
      },
      visualGuidelines: {
        photography: 'Bright, appetizing, lifestyle-oriented',
        video: 'Dynamic, behind-scenes feel',
        graphics: 'On-brand, clean, readable'
      }
    };
  }

  createContentCalendar(context, weeks = 4) {
    const calendar = {
      calendarId: `calendar_${Date.now()}`,
      duration: `${weeks} weeks`,
      weeks: []
    };

    for (let w = 0; w < weeks; w++) {
      calendar.weeks.push({
        weekNumber: w + 1,
        posts: this.generateWeekPosts(w)
      });
    }

    return calendar;
  }

  generateWeekPosts(weekNum) {
    return [
      {
        day: 'Monday',
        type: 'post',
        pillar: 'Food Showcase',
        concept: 'Weekly special highlight',
        platform: ['instagram', 'facebook'],
        status: 'planned'
      },
      {
        day: 'Tuesday',
        type: 'story',
        pillar: 'Behind the Scenes',
        concept: 'Kitchen prep/Chef at work',
        platform: ['instagram'],
        status: 'planned'
      },
      {
        day: 'Wednesday',
        type: 'reel',
        pillar: 'Food Showcase',
        concept: 'Dish preparation video',
        platform: ['instagram', 'tiktok'],
        status: 'planned'
      },
      {
        day: 'Thursday',
        type: 'carousel',
        pillar: 'Educational',
        concept: 'Tips or ingredient spotlight',
        platform: ['instagram'],
        status: 'planned'
      },
      {
        day: 'Friday',
        type: 'post',
        pillar: 'Community',
        concept: 'Weekend plans/Event promo',
        platform: ['instagram', 'facebook'],
        status: 'planned'
      },
      {
        day: 'Saturday',
        type: 'story',
        pillar: 'Food Showcase',
        concept: 'Live service highlights',
        platform: ['instagram'],
        status: 'planned'
      },
      {
        day: 'Sunday',
        type: 'reel',
        pillar: 'Behind the Scenes',
        concept: 'Week recap or team moment',
        platform: ['instagram', 'tiktok'],
        status: 'planned'
      }
    ];
  }

  generateContentRecommendations(context) {
    return [
      {
        type: 'Quick Win',
        recommendation: 'Create signature dish showcase reel',
        effort: 'low',
        impact: 'high'
      },
      {
        type: 'Engagement',
        recommendation: 'Launch user-generated content campaign',
        effort: 'medium',
        impact: 'high'
      },
      {
        type: 'Brand Building',
        recommendation: 'Develop chef story/interview series',
        effort: 'medium',
        impact: 'medium'
      },
      {
        type: 'SEO',
        recommendation: 'Start blog with recipes and local content',
        effort: 'high',
        impact: 'high'
      }
    ];
  }

  async createContent(data, context = {}) {
    this.metrics.contentCreated++;

    return {
      contentId: `content_${Date.now()}`,
      type: data.type,
      platform: data.platform,
      brief: {
        concept: data.concept,
        objective: data.objective,
        targetAudience: data.audience,
        keyMessage: data.message,
        callToAction: data.cta
      },
      creative: {
        copy: this.generateCopy(data),
        visual: this.defineVisualRequirements(data),
        hashtags: this.suggestHashtags(data)
      },
      scheduling: {
        suggestedDate: data.date,
        suggestedTime: this.suggestPostTime(data.platform),
        status: 'draft'
      }
    };
  }

  generateCopy(data) {
    return {
      headline: '',
      body: '',
      callToAction: data.cta || 'Link in bio',
      length: this.getOptimalLength(data.platform, data.type)
    };
  }

  defineVisualRequirements(data) {
    const specs = {
      instagram_post: { ratio: '1:1', minRes: '1080x1080' },
      instagram_story: { ratio: '9:16', minRes: '1080x1920' },
      instagram_reel: { ratio: '9:16', duration: '15-60s' },
      facebook_post: { ratio: '1.91:1', minRes: '1200x630' },
      tiktok: { ratio: '9:16', duration: '15-60s' }
    };

    const key = `${data.platform}_${data.type}`;
    return specs[key] || specs.instagram_post;
  }

  suggestHashtags(data) {
    return {
      branded: ['#restaurantname'],
      location: ['#cityname', '#neighborhood', '#localfood'],
      category: ['#restaurant', '#foodie', '#gastronomia'],
      trending: [],
      total: 15
    };
  }

  suggestPostTime(platform) {
    const bestTimes = {
      instagram: ['11:00', '13:00', '19:00'],
      facebook: ['13:00', '16:00', '20:00'],
      tiktok: ['12:00', '15:00', '21:00']
    };
    return bestTimes[platform] || ['12:00'];
  }

  getOptimalLength(platform, type) {
    const lengths = {
      instagram_post: { min: 125, max: 2200, optimal: 150 },
      instagram_story: { min: 0, max: 100, optimal: 50 },
      instagram_reel: { min: 50, max: 150, optimal: 100 },
      facebook_post: { min: 100, max: 500, optimal: 250 },
      tiktok: { min: 50, max: 150, optimal: 100 }
    };
    return lengths[`${platform}_${type}`] || lengths.instagram_post;
  }

  async planPhotoShoot(data, context = {}) {
    return {
      shootId: `shoot_${Date.now()}`,
      type: data.type,
      shotList: this.createShotList(data),
      requirements: {
        equipment: ['DSLR/Mirrorless', 'Lighting kit', 'Tripod', 'Backgrounds'],
        props: ['Plates', 'Cutlery', 'Napkins', 'Garnishes'],
        team: ['Photographer', 'Food stylist', 'Assistant']
      },
      timeline: this.createShootTimeline(data),
      deliverables: {
        photos: 20,
        formats: ['raw', 'edited', 'web'],
        usage: ['social', 'website', 'menu', 'advertising']
      }
    };
  }

  createShotList(data) {
    return [
      { category: 'Hero shots', count: 5, description: 'Signature dishes, beauty shots' },
      { category: 'Menu items', count: 10, description: 'Individual dish documentation' },
      { category: 'Lifestyle', count: 5, description: 'Dishes in context, hands, action' },
      { category: 'Ingredients', count: 3, description: 'Fresh produce, key ingredients' },
      { category: 'Ambiance', count: 5, description: 'Interior, details, atmosphere' }
    ];
  }

  createShootTimeline(data) {
    return {
      duration: '4-6 hours',
      phases: [
        { phase: 'Setup', duration: '30 min' },
        { phase: 'Hero shots', duration: '1 hour' },
        { phase: 'Menu items', duration: '2 hours' },
        { phase: 'Lifestyle/Ambiance', duration: '1.5 hours' },
        { phase: 'Wrap', duration: '30 min' }
      ]
    };
  }
}

/**
 * Agent 17 - Community Manager
 * Gestión de comunidades y engagement
 */
export class CommunityManagerAgent extends BaseMarketingAgent {
  constructor() {
    super(17, 'Community Manager', 'Gestión de comunidades y engagement en redes');
    this.capabilities = [
      'social_management',
      'community_engagement',
      'review_management',
      'crisis_management',
      'influencer_relations',
      'customer_service_social',
      'sentiment_analysis',
      'loyalty_programs'
    ];
  }

  async executeTask(task) {
    const { message, context } = task;

    return {
      agentId: this.id,
      agentName: this.name,
      taskType: 'community_management',
      communityAnalysis: await this.analyzeCommunity(context),
      engagementStrategy: this.developEngagementStrategy(context),
      recommendations: this.generateCommunityRecommendations(context),
      timestamp: new Date().toISOString()
    };
  }

  async analyzeCommunity(context) {
    return {
      socialPresence: {
        platforms: [],
        totalFollowers: 0,
        growthRate: 0,
        engagementRate: 0
      },
      audienceProfile: {
        demographics: {},
        interests: [],
        behaviors: []
      },
      sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0,
        overall: 'neutral'
      },
      reviews: {
        platforms: [],
        averageRating: 0,
        totalReviews: 0,
        responseRate: 0
      }
    };
  }

  developEngagementStrategy(context) {
    return {
      objectives: [
        'Aumentar engagement rate a 5%+',
        'Responder a todos los comentarios en 2 horas',
        'Gestionar reseñas en 24 horas',
        'Construir comunidad leal'
      ],
      tactics: {
        dailyEngagement: [
          'Respond to all comments and DMs',
          'Like and comment on tagged posts',
          'Engage with local accounts',
          'Share UGC in stories'
        ],
        communityBuilding: [
          'Run interactive stories (polls, questions)',
          'Feature customer highlights',
          'Create exclusive community content',
          'Host online events/lives'
        ],
        reviewManagement: [
          'Respond to all reviews',
          'Address negative feedback promptly',
          'Request reviews from satisfied customers',
          'Track sentiment trends'
        ]
      },
      responseGuidelines: this.createResponseGuidelines()
    };
  }

  createResponseGuidelines() {
    return {
      timeToRespond: {
        comments: '2 hours',
        dms: '4 hours',
        reviews: '24 hours',
        mentions: '4 hours'
      },
      toneOfVoice: {
        general: 'Friendly, helpful, personal',
        complaints: 'Empathetic, solution-oriented',
        compliments: 'Grateful, humble'
      },
      templates: {
        greeting: 'Personalize with name when possible',
        thanking: 'Be specific about what you\'re thanking for',
        addressing_issues: 'Acknowledge, apologize, offer solution',
        invitation: 'Welcome them back with specific offer'
      },
      escalation: {
        level1: 'Standard response',
        level2: 'Manager involvement',
        level3: 'Owner/CEO involvement'
      }
    };
  }

  generateCommunityRecommendations(context) {
    return [
      {
        area: 'Response Time',
        recommendation: 'Implement response time SLAs and tracking',
        priority: 'alta'
      },
      {
        area: 'UGC',
        recommendation: 'Launch branded hashtag and UGC campaign',
        priority: 'media'
      },
      {
        area: 'Reviews',
        recommendation: 'Create systematic review generation program',
        priority: 'alta'
      },
      {
        area: 'Loyalty',
        recommendation: 'Develop digital loyalty/VIP program',
        priority: 'media'
      }
    ];
  }

  async manageReviews(data, context = {}) {
    return {
      reviewManagementId: `reviews_${Date.now()}`,
      platforms: [
        { name: 'Google', reviews: 0, avgRating: 0, needsResponse: 0 },
        { name: 'Yelp', reviews: 0, avgRating: 0, needsResponse: 0 },
        { name: 'TripAdvisor', reviews: 0, avgRating: 0, needsResponse: 0 },
        { name: 'Facebook', reviews: 0, avgRating: 0, needsResponse: 0 }
      ],
      pendingResponses: [],
      responseTemplates: this.createReviewResponseTemplates(),
      generationStrategy: this.createReviewGenerationStrategy(),
      tracking: {
        weeklyGoal: 5,
        monthlyGoal: 20,
        current: 0
      }
    };
  }

  createReviewResponseTemplates() {
    return {
      '5star': {
        template: 'Thank you so much for this wonderful review, {name}! We\'re thrilled you enjoyed {specific_mention}. We can\'t wait to welcome you back!',
        personalization: ['name', 'specific_mention', 'dish']
      },
      '4star': {
        template: 'Thank you for your feedback, {name}! We\'re glad you enjoyed your visit. We\'d love to hear more about how we can make your next experience 5-star worthy!',
        personalization: ['name', 'improvement_area']
      },
      '3star': {
        template: 'Thank you for taking the time to share your feedback, {name}. We appreciate your honest review and would love the opportunity to provide a better experience. Please reach out to us at {contact}.',
        personalization: ['name', 'issue', 'contact']
      },
      '2star': {
        template: 'We\'re sorry to hear your experience didn\'t meet expectations, {name}. This isn\'t the standard we strive for. We\'d really appreciate the chance to make it right - please contact us at {contact}.',
        personalization: ['name', 'issue', 'contact', 'resolution']
      },
      '1star': {
        template: 'We sincerely apologize for your disappointing experience, {name}. This is not acceptable to us. We would like to personally address this and make things right. Please contact {manager} at {contact} at your earliest convenience.',
        personalization: ['name', 'issue', 'manager', 'contact']
      }
    };
  }

  createReviewGenerationStrategy() {
    return {
      touchpoints: [
        { moment: 'After positive feedback', method: 'verbal_request', script: 'If you have a moment, we\'d love if you could share your experience online!' },
        { moment: 'With receipt', method: 'card', message: 'Loved your meal? Tell the world! Review us on Google.' },
        { moment: 'Follow-up email', method: 'email', timing: '24 hours after visit' },
        { moment: 'Loyalty program', method: 'incentive', reward: 'Bonus points for reviews' }
      ],
      materials: {
        cards: 'Design review request cards with QR code',
        signage: 'Table tent or counter sign',
        email: 'Automated follow-up with review links',
        social: 'Periodic review requests in stories'
      }
    };
  }

  async developInfluencerStrategy(data, context = {}) {
    return {
      strategyId: `influencer_${Date.now()}`,
      objectives: [
        'Increase brand awareness',
        'Generate authentic content',
        'Drive new customer visits',
        'Build social proof'
      ],
      tiers: {
        nano: {
          followers: '1K-10K',
          approach: 'Complimentary experience',
          quantity: 'Many',
          relationship: 'One-time or ongoing'
        },
        micro: {
          followers: '10K-50K',
          approach: 'Comp + small fee',
          quantity: 'Several',
          relationship: 'Campaign-based'
        },
        mid: {
          followers: '50K-200K',
          approach: 'Fee + comp',
          quantity: 'Select few',
          relationship: 'Partnership'
        },
        macro: {
          followers: '200K+',
          approach: 'Paid partnership',
          quantity: 'Rare, strategic',
          relationship: 'Campaign'
        }
      },
      outreach: {
        criteria: [
          'Local audience',
          'Food/lifestyle focus',
          'Authentic engagement',
          'Brand alignment'
        ],
        process: [
          'Identify potential partners',
          'Vet engagement and audience',
          'Reach out with personalized message',
          'Negotiate terms',
          'Execute collaboration',
          'Track results'
        ]
      },
      metrics: [
        'Reach/Impressions',
        'Engagement',
        'Content quality',
        'Follower growth',
        'Reservations attributed'
      ]
    };
  }

  async createLoyaltyProgram(data, context = {}) {
    return {
      programId: `loyalty_${Date.now()}`,
      name: data.programName || 'VIP Club',
      type: data.type || 'points',
      structure: this.defineLoyaltyStructure(data),
      tiers: this.defineLoyaltyTiers(data),
      rewards: this.defineLoyaltyRewards(data),
      communication: this.planLoyaltyCommunication(data),
      technology: this.recommendLoyaltyTech(data)
    };
  }

  defineLoyaltyStructure(data) {
    return {
      earnRate: '1 point per $1 spent',
      redeemRate: '100 points = $10 reward',
      expiration: '12 months of inactivity',
      trackingMethod: 'phone_number',
      signupBonus: 50
    };
  }

  defineLoyaltyTiers(data) {
    return [
      {
        name: 'Member',
        requirement: '0 points',
        benefits: ['Birthday reward', 'Exclusive offers']
      },
      {
        name: 'Silver',
        requirement: '500 points',
        benefits: ['10% bonus points', 'Priority reservations']
      },
      {
        name: 'Gold',
        requirement: '1500 points',
        benefits: ['25% bonus points', 'Complimentary appetizer monthly', 'VIP events']
      },
      {
        name: 'Platinum',
        requirement: '5000 points',
        benefits: ['50% bonus points', 'Chef table access', 'Personal concierge']
      }
    ];
  }

  defineLoyaltyRewards(data) {
    return [
      { name: 'Free appetizer', points: 50, value: 10 },
      { name: 'Free dessert', points: 50, value: 10 },
      { name: '$10 off', points: 100, value: 10 },
      { name: 'Free entree', points: 200, value: 25 },
      { name: 'Bottle of wine', points: 300, value: 40 },
      { name: 'Chef dinner for 2', points: 1000, value: 150 }
    ];
  }

  planLoyaltyCommunication(data) {
    return {
      welcome: 'Email + SMS with program details',
      pointsUpdate: 'Monthly email statement',
      rewards: 'Push notification when reward earned',
      expiration: 'Email 30 days before points expire',
      birthday: 'Email + SMS 7 days before',
      tierChange: 'Congratulations email with new benefits'
    };
  }

  recommendLoyaltyTech(data) {
    return {
      options: [
        { name: 'Square Loyalty', cost: 'Included with Square', best_for: 'Simple programs' },
        { name: 'Toast Loyalty', cost: 'Included with Toast', best_for: 'Toast users' },
        { name: 'Fivestars', cost: '$99+/mo', best_for: 'Full-featured' },
        { name: 'Belly', cost: '$79+/mo', best_for: 'Engagement focus' }
      ],
      recommendation: 'Based on POS system and needs'
    };
  }
}

// ============================================
// Factory y Exports
// ============================================

// Singletons
let cmoAgentInstance = null;
let brandManagerInstance = null;
let digitalMarketingInstance = null;
let contentCreatorInstance = null;
let communityManagerInstance = null;

/**
 * Obtiene la instancia del agente de marketing especificado
 */
export function getMarketingAgent(agentId) {
  switch (agentId) {
    case 13:
      if (!cmoAgentInstance) {
        cmoAgentInstance = new CMOAgent();
      }
      return cmoAgentInstance;
    case 14:
      if (!brandManagerInstance) {
        brandManagerInstance = new BrandManagerAgent();
      }
      return brandManagerInstance;
    case 15:
      if (!digitalMarketingInstance) {
        digitalMarketingInstance = new DigitalMarketingAgent();
      }
      return digitalMarketingInstance;
    case 16:
      if (!contentCreatorInstance) {
        contentCreatorInstance = new ContentCreatorAgent();
      }
      return contentCreatorInstance;
    case 17:
      if (!communityManagerInstance) {
        communityManagerInstance = new CommunityManagerAgent();
      }
      return communityManagerInstance;
    default:
      throw new Error(`Agente de marketing ${agentId} no existe. Agentes válidos: 13-17`);
  }
}

/**
 * Obtiene todos los agentes de marketing
 */
export function getAllMarketingAgents() {
  return {
    13: getMarketingAgent(13),
    14: getMarketingAgent(14),
    15: getMarketingAgent(15),
    16: getMarketingAgent(16),
    17: getMarketingAgent(17)
  };
}

// Registro de agentes de marketing
export const MARKETING_AGENTS = {
  13: { name: 'CMO', class: CMOAgent },
  14: { name: 'BrandManager', class: BrandManagerAgent },
  15: { name: 'DigitalMarketing', class: DigitalMarketingAgent },
  16: { name: 'ContentCreator', class: ContentCreatorAgent },
  17: { name: 'CommunityManager', class: CommunityManagerAgent }
};

export default {
  getMarketingAgent,
  getAllMarketingAgents,
  MARKETING_AGENTS,
  MARKETING_CHANNELS,
  CONTENT_TYPES,
  CAMPAIGN_STATUS,
  BRAND_ELEMENTS
};
