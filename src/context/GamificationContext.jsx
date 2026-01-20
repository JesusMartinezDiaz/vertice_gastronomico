/**
 * Sistema de Gamificación - Vértice Gastronómico
 * Contexto y lógica para diferentes tipos de usuarios
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GamificationContext = createContext(null);

// ============================================
// TIPOS DE USUARIO Y SUS CARACTERÍSTICAS
// ============================================
export const USER_TYPES = {
  PROPIETARIO: {
    id: 'propietario',
    name: 'Propietario',
    icon: '👑',
    color: 'amber',
    description: 'Dueño del restaurante con acceso total',
    baseMultiplier: 1.5,
    focusAreas: ['finanzas', 'estrategia', 'expansión']
  },
  GERENTE: {
    id: 'gerente',
    name: 'Gerente General',
    icon: '🎯',
    color: 'blue',
    description: 'Gestión operativa del restaurante',
    baseMultiplier: 1.3,
    focusAreas: ['operaciones', 'personal', 'servicio']
  },
  CHEF: {
    id: 'chef',
    name: 'Chef Ejecutivo',
    icon: '👨‍🍳',
    color: 'orange',
    description: 'Líder de cocina y creatividad culinaria',
    baseMultiplier: 1.2,
    focusAreas: ['menu', 'recetas', 'costos']
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrador',
    icon: '📊',
    color: 'purple',
    description: 'Control financiero y administrativo',
    baseMultiplier: 1.2,
    focusAreas: ['finanzas', 'inventario', 'reportes']
  },
  MESERO: {
    id: 'mesero',
    name: 'Capitán de Meseros',
    icon: '🍽️',
    color: 'emerald',
    description: 'Líder del servicio al cliente',
    baseMultiplier: 1.0,
    focusAreas: ['servicio', 'ordenes', 'clientes']
  },
  BARISTA: {
    id: 'barista',
    name: 'Barista/Bartender',
    icon: '🍸',
    color: 'cyan',
    description: 'Especialista en bebidas',
    baseMultiplier: 1.0,
    focusAreas: ['bebidas', 'inventario', 'recetas']
  }
};

// ============================================
// NIVELES Y PROGRESIÓN
// ============================================
export const LEVELS = [
  { level: 1, name: 'Novato', minXP: 0, maxXP: 100, icon: '🌱', color: 'gray' },
  { level: 2, name: 'Aprendiz', minXP: 100, maxXP: 300, icon: '📚', color: 'green' },
  { level: 3, name: 'Practicante', minXP: 300, maxXP: 600, icon: '⚡', color: 'blue' },
  { level: 4, name: 'Competente', minXP: 600, maxXP: 1000, icon: '🎯', color: 'purple' },
  { level: 5, name: 'Experto', minXP: 1000, maxXP: 1500, icon: '💎', color: 'indigo' },
  { level: 6, name: 'Maestro', minXP: 1500, maxXP: 2200, icon: '🏆', color: 'amber' },
  { level: 7, name: 'Gran Maestro', minXP: 2200, maxXP: 3000, icon: '👑', color: 'orange' },
  { level: 8, name: 'Leyenda', minXP: 3000, maxXP: 4000, icon: '⭐', color: 'red' },
  { level: 9, name: 'Vértice Elite', minXP: 4000, maxXP: 5500, icon: '🔥', color: 'rose' },
  { level: 10, name: 'Gurú Gastronómico', minXP: 5500, maxXP: Infinity, icon: '🌟', color: 'yellow' }
];

// ============================================
// INSIGNIAS/BADGES
// ============================================
export const BADGES = {
  // Badges de inicio
  FIRST_LOGIN: {
    id: 'first_login',
    name: 'Primer Paso',
    description: 'Iniciaste sesión por primera vez',
    icon: '🚀',
    category: 'inicio',
    xpReward: 10,
    rarity: 'common'
  },
  PROFILE_COMPLETE: {
    id: 'profile_complete',
    name: 'Perfil Completo',
    description: 'Completaste tu perfil al 100%',
    icon: '✅',
    category: 'inicio',
    xpReward: 25,
    rarity: 'common'
  },

  // Badges de consultas IA
  FIRST_QUERY: {
    id: 'first_query',
    name: 'Primera Consulta',
    description: 'Realizaste tu primera consulta a un agente IA',
    icon: '💬',
    category: 'ia',
    xpReward: 15,
    rarity: 'common'
  },
  QUERY_STREAK_7: {
    id: 'query_streak_7',
    name: 'Curioso',
    description: '7 días seguidos consultando agentes',
    icon: '🔍',
    category: 'ia',
    xpReward: 50,
    rarity: 'uncommon'
  },
  QUERY_STREAK_30: {
    id: 'query_streak_30',
    name: 'Investigador',
    description: '30 días seguidos consultando agentes',
    icon: '🔬',
    category: 'ia',
    xpReward: 150,
    rarity: 'rare'
  },
  AGENT_EXPLORER: {
    id: 'agent_explorer',
    name: 'Explorador de Agentes',
    description: 'Usaste 10 agentes diferentes',
    icon: '🗺️',
    category: 'ia',
    xpReward: 75,
    rarity: 'uncommon'
  },
  AGENT_MASTER: {
    id: 'agent_master',
    name: 'Maestro de Agentes',
    description: 'Usaste los 72 agentes al menos una vez',
    icon: '🎓',
    category: 'ia',
    xpReward: 500,
    rarity: 'legendary'
  },

  // Badges de finanzas
  FIRST_REPORT: {
    id: 'first_report',
    name: 'Primer Reporte',
    description: 'Generaste tu primer reporte financiero',
    icon: '📄',
    category: 'finanzas',
    xpReward: 20,
    rarity: 'common'
  },
  COST_OPTIMIZER: {
    id: 'cost_optimizer',
    name: 'Optimizador de Costos',
    description: 'Redujiste el food cost en un 5%',
    icon: '📉',
    category: 'finanzas',
    xpReward: 100,
    rarity: 'rare'
  },
  PROFIT_MASTER: {
    id: 'profit_master',
    name: 'Maestro del Profit',
    description: 'Alcanzaste 20% de margen de ganancia',
    icon: '💰',
    category: 'finanzas',
    xpReward: 200,
    rarity: 'epic'
  },

  // Badges de operaciones
  ORDER_CHAMPION: {
    id: 'order_champion',
    name: 'Campeón de Órdenes',
    description: 'Procesaste 1000 órdenes',
    icon: '🏅',
    category: 'operaciones',
    xpReward: 100,
    rarity: 'rare'
  },
  ZERO_WASTE: {
    id: 'zero_waste',
    name: 'Cero Desperdicio',
    description: 'Una semana sin desperdicios significativos',
    icon: '♻️',
    category: 'operaciones',
    xpReward: 150,
    rarity: 'epic'
  },

  // Badges de menú
  RECIPE_CREATOR: {
    id: 'recipe_creator',
    name: 'Creador de Recetas',
    description: 'Creaste 10 recetas nuevas',
    icon: '📝',
    category: 'menu',
    xpReward: 75,
    rarity: 'uncommon'
  },
  MENU_ENGINEER: {
    id: 'menu_engineer',
    name: 'Ingeniero del Menú',
    description: 'Optimizaste el menú con análisis de rentabilidad',
    icon: '🔧',
    category: 'menu',
    xpReward: 125,
    rarity: 'rare'
  },

  // Badges de equipo
  TEAM_BUILDER: {
    id: 'team_builder',
    name: 'Constructor de Equipos',
    description: 'Tu equipo tiene 100% de capacitación',
    icon: '👥',
    category: 'equipo',
    xpReward: 100,
    rarity: 'rare'
  },
  MENTOR: {
    id: 'mentor',
    name: 'Mentor',
    description: 'Ayudaste a 5 colegas a subir de nivel',
    icon: '🎖️',
    category: 'equipo',
    xpReward: 200,
    rarity: 'epic'
  },

  // Badges especiales
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Iniciaste sesión antes de las 6am por 7 días',
    icon: '🌅',
    category: 'especial',
    xpReward: 50,
    rarity: 'uncommon'
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Trabajaste después de medianoche por 7 días',
    icon: '🦉',
    category: 'especial',
    xpReward: 50,
    rarity: 'uncommon'
  },
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior',
    name: 'Guerrero de Fin de Semana',
    description: 'Activo todos los fines de semana del mes',
    icon: '⚔️',
    category: 'especial',
    xpReward: 75,
    rarity: 'uncommon'
  },
  CONSISTENCY_KING: {
    id: 'consistency_king',
    name: 'Rey de la Consistencia',
    description: '90 días seguidos de actividad',
    icon: '👑',
    category: 'especial',
    xpReward: 300,
    rarity: 'legendary'
  }
};

// ============================================
// MISIONES DIARIAS
// ============================================
export const DAILY_MISSIONS = {
  PROPIETARIO: [
    { id: 'review_finances', name: 'Revisar finanzas', description: 'Consulta el reporte diario', xp: 15, icon: '💵' },
    { id: 'check_performance', name: 'Verificar rendimiento', description: 'Revisa las métricas del día', xp: 10, icon: '📊' },
    { id: 'strategic_query', name: 'Consulta estratégica', description: 'Pregunta a un agente de estrategia', xp: 20, icon: '🎯' }
  ],
  GERENTE: [
    { id: 'team_check', name: 'Revisión de equipo', description: 'Verifica asistencia del personal', xp: 10, icon: '👥' },
    { id: 'operations_review', name: 'Revisión operativa', description: 'Revisa el flujo de operaciones', xp: 15, icon: '⚙️' },
    { id: 'resolve_issue', name: 'Resolver incidencia', description: 'Atiende un problema del día', xp: 20, icon: '🔧' }
  ],
  CHEF: [
    { id: 'menu_check', name: 'Revisión del menú', description: 'Verifica disponibilidad de platillos', xp: 10, icon: '📋' },
    { id: 'cost_review', name: 'Control de costos', description: 'Revisa el food cost del día', xp: 15, icon: '💰' },
    { id: 'recipe_update', name: 'Actualizar receta', description: 'Mejora o actualiza una receta', xp: 25, icon: '📝' }
  ],
  ADMIN: [
    { id: 'inventory_check', name: 'Revisión de inventario', description: 'Verifica niveles de stock', xp: 10, icon: '📦' },
    { id: 'reports_review', name: 'Revisar reportes', description: 'Analiza los reportes del día', xp: 15, icon: '📄' },
    { id: 'reconciliation', name: 'Conciliación', description: 'Realiza cierre de caja', xp: 20, icon: '✓' }
  ],
  MESERO: [
    { id: 'service_excellence', name: 'Servicio excelente', description: 'Atiende 10 mesas sin quejas', xp: 15, icon: '⭐' },
    { id: 'upsell', name: 'Venta adicional', description: 'Realiza 3 ventas sugeridas', xp: 20, icon: '📈' },
    { id: 'customer_feedback', name: 'Feedback positivo', description: 'Obtén una reseña positiva', xp: 25, icon: '💬' }
  ],
  BARISTA: [
    { id: 'signature_drink', name: 'Bebida insignia', description: 'Prepara 20 bebidas del día', xp: 15, icon: '🍹' },
    { id: 'stock_check', name: 'Control de barra', description: 'Verifica inventario de barra', xp: 10, icon: '📊' },
    { id: 'new_creation', name: 'Nueva creación', description: 'Propón una bebida nueva', xp: 30, icon: '✨' }
  ]
};

// ============================================
// RETOS SEMANALES
// ============================================
export const WEEKLY_CHALLENGES = [
  {
    id: 'sales_boost',
    name: 'Impulso de Ventas',
    description: 'Incrementa las ventas en 10% vs semana anterior',
    xp: 100,
    icon: '📈',
    difficulty: 'medium'
  },
  {
    id: 'cost_reduction',
    name: 'Reducción de Costos',
    description: 'Reduce costos operativos en 5%',
    xp: 150,
    icon: '💰',
    difficulty: 'hard'
  },
  {
    id: 'perfect_service',
    name: 'Servicio Perfecto',
    description: 'Cero quejas durante la semana',
    xp: 120,
    icon: '🌟',
    difficulty: 'hard'
  },
  {
    id: 'team_training',
    name: 'Entrenamiento del Equipo',
    description: 'Completa 3 sesiones de capacitación',
    xp: 80,
    icon: '📚',
    difficulty: 'easy'
  },
  {
    id: 'inventory_master',
    name: 'Maestro del Inventario',
    description: 'Mantén stock óptimo sin faltantes',
    xp: 100,
    icon: '📦',
    difficulty: 'medium'
  }
];

// ============================================
// RECOMPENSAS
// ============================================
export const REWARDS = [
  { id: 'theme_gold', name: 'Tema Dorado', type: 'cosmetic', cost: 500, icon: '🎨', description: 'Desbloquea el tema dorado premium' },
  { id: 'avatar_chef', name: 'Avatar Chef Elite', type: 'cosmetic', cost: 300, icon: '👨‍🍳', description: 'Avatar exclusivo de chef' },
  { id: 'badge_display', name: 'Mostrador de Badges', type: 'feature', cost: 400, icon: '🏆', description: 'Muestra 5 badges en tu perfil' },
  { id: 'priority_support', name: 'Soporte Prioritario', type: 'benefit', cost: 1000, icon: '⚡', description: 'Acceso prioritario a soporte' },
  { id: 'analytics_pro', name: 'Analytics Pro', type: 'feature', cost: 800, icon: '📊', description: 'Desbloquea análisis avanzados' },
  { id: 'custom_reports', name: 'Reportes Personalizados', type: 'feature', cost: 600, icon: '📄', description: 'Crea reportes a tu medida' }
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const getLevelInfo = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return {
        ...LEVELS[i],
        currentXP: xp,
        xpToNextLevel: LEVELS[i].maxXP === Infinity ? 0 : LEVELS[i].maxXP - xp,
        progress: LEVELS[i].maxXP === Infinity ? 100 : ((xp - LEVELS[i].minXP) / (LEVELS[i].maxXP - LEVELS[i].minXP)) * 100
      };
    }
  }
  return { ...LEVELS[0], currentXP: xp, xpToNextLevel: LEVELS[0].maxXP - xp, progress: (xp / LEVELS[0].maxXP) * 100 };
};

const STORAGE_KEY = 'vertice_gamification';

// ============================================
// PROVIDER
// ============================================
export function GamificationProvider({ children }) {
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      userType: 'PROPIETARIO',
      xp: 0,
      totalXPEarned: 0,
      coins: 0,
      badges: [],
      completedMissions: [],
      completedChallenges: [],
      unlockedRewards: [],
      streak: 0,
      lastActiveDate: null,
      stats: {
        queriesCount: 0,
        reportsGenerated: 0,
        agentsUsed: [],
        loginDays: 0,
        earlyLogins: 0,
        lateLogins: 0
      }
    };
  });

  const [notifications, setNotifications] = useState([]);

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
  }, [userStats]);

  // Añadir XP
  const addXP = useCallback((amount, reason = '') => {
    const userType = USER_TYPES[userStats.userType];
    const multiplier = userType?.baseMultiplier || 1;
    const finalXP = Math.round(amount * multiplier);

    setUserStats(prev => {
      const newXP = prev.xp + finalXP;
      const oldLevel = getLevelInfo(prev.xp);
      const newLevel = getLevelInfo(newXP);

      // Verificar si subió de nivel
      if (newLevel.level > oldLevel.level) {
        setNotifications(n => [...n, {
          id: Date.now(),
          type: 'level_up',
          title: '¡Subiste de Nivel!',
          message: `Ahora eres ${newLevel.name} (Nivel ${newLevel.level})`,
          icon: newLevel.icon
        }]);
      }

      return {
        ...prev,
        xp: newXP,
        totalXPEarned: prev.totalXPEarned + finalXP
      };
    });

    if (reason) {
      setNotifications(n => [...n, {
        id: Date.now() + 1,
        type: 'xp',
        title: `+${finalXP} XP`,
        message: reason,
        icon: '⚡'
      }]);
    }

    return finalXP;
  }, [userStats.userType]);

  // Añadir monedas
  const addCoins = useCallback((amount, reason = '') => {
    setUserStats(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));

    if (reason) {
      setNotifications(n => [...n, {
        id: Date.now(),
        type: 'coins',
        title: `+${amount} Monedas`,
        message: reason,
        icon: '🪙'
      }]);
    }
  }, []);

  // Desbloquear badge
  const unlockBadge = useCallback((badgeId) => {
    const badge = BADGES[badgeId];
    if (!badge || userStats.badges.includes(badgeId)) return false;

    setUserStats(prev => ({
      ...prev,
      badges: [...prev.badges, badgeId]
    }));

    addXP(badge.xpReward, `Badge: ${badge.name}`);
    addCoins(badge.xpReward * 2);

    setNotifications(n => [...n, {
      id: Date.now(),
      type: 'badge',
      title: '¡Nueva Insignia!',
      message: badge.name,
      icon: badge.icon,
      rarity: badge.rarity
    }]);

    return true;
  }, [userStats.badges, addXP, addCoins]);

  // Completar misión diaria
  const completeMission = useCallback((missionId) => {
    const today = new Date().toDateString();
    const completedToday = userStats.completedMissions.filter(m => m.date === today);

    if (completedToday.some(m => m.id === missionId)) return false;

    const userMissions = DAILY_MISSIONS[userStats.userType] || [];
    const mission = userMissions.find(m => m.id === missionId);

    if (!mission) return false;

    setUserStats(prev => ({
      ...prev,
      completedMissions: [...prev.completedMissions, { id: missionId, date: today }]
    }));

    addXP(mission.xp, `Misión: ${mission.name}`);
    addCoins(mission.xp);

    return true;
  }, [userStats.completedMissions, userStats.userType, addXP, addCoins]);

  // Cambiar tipo de usuario
  const setUserType = useCallback((type) => {
    if (USER_TYPES[type]) {
      setUserStats(prev => ({ ...prev, userType: type }));
    }
  }, []);

  // Canjear recompensa
  const redeemReward = useCallback((rewardId) => {
    const reward = REWARDS.find(r => r.id === rewardId);
    if (!reward || userStats.coins < reward.cost) return false;
    if (userStats.unlockedRewards.includes(rewardId)) return false;

    setUserStats(prev => ({
      ...prev,
      coins: prev.coins - reward.cost,
      unlockedRewards: [...prev.unlockedRewards, rewardId]
    }));

    setNotifications(n => [...n, {
      id: Date.now(),
      type: 'reward',
      title: '¡Recompensa Desbloqueada!',
      message: reward.name,
      icon: reward.icon
    }]);

    return true;
  }, [userStats.coins, userStats.unlockedRewards]);

  // Limpiar notificación
  const clearNotification = useCallback((id) => {
    setNotifications(n => n.filter(notif => notif.id !== id));
  }, []);

  // Obtener misiones del día
  const getDailyMissions = useCallback(() => {
    const today = new Date().toDateString();
    const userMissions = DAILY_MISSIONS[userStats.userType] || [];
    const completedToday = userStats.completedMissions.filter(m => m.date === today);

    return userMissions.map(mission => ({
      ...mission,
      completed: completedToday.some(m => m.id === mission.id)
    }));
  }, [userStats.userType, userStats.completedMissions]);

  const value = {
    // Estado
    userStats,
    userType: USER_TYPES[userStats.userType],
    level: getLevelInfo(userStats.xp),
    notifications,

    // Acciones
    addXP,
    addCoins,
    unlockBadge,
    completeMission,
    setUserType,
    redeemReward,
    clearNotification,
    getDailyMissions,

    // Datos
    USER_TYPES,
    LEVELS,
    BADGES,
    DAILY_MISSIONS,
    WEEKLY_CHALLENGES,
    REWARDS
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification debe usarse dentro de GamificationProvider');
  }
  return context;
}

export default GamificationContext;
