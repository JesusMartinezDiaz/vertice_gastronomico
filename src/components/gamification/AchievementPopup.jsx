/**
 * AchievementPopup - Notificaciones de logros
 * Vértice Gastronómico
 *
 * Muestra popups animados cuando se desbloquean badges o se sube de nivel
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { LEVELS } from '../../context/GamificationContext';

const AchievementContext = createContext(null);

// Tipos de achievement
const ACHIEVEMENT_TYPES = {
  BADGE: 'badge',
  LEVEL_UP: 'level_up',
  XP: 'xp',
  MISSION: 'mission',
  STREAK: 'streak'
};

// Popup individual de achievement
function AchievementToast({ achievement, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animación de entrada
    requestAnimationFrame(() => setIsVisible(true));

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  const getTypeConfig = () => {
    switch (achievement.type) {
      case ACHIEVEMENT_TYPES.BADGE:
        return {
          title: 'Nueva Insignia',
          gradient: 'from-amber-500 to-yellow-500',
          bgGlow: 'shadow-amber-500/30'
        };
      case ACHIEVEMENT_TYPES.LEVEL_UP:
        return {
          title: 'Subiste de Nivel',
          gradient: 'from-emerald-500 to-cyan-500',
          bgGlow: 'shadow-emerald-500/30'
        };
      case ACHIEVEMENT_TYPES.XP:
        return {
          title: 'XP Ganado',
          gradient: 'from-purple-500 to-pink-500',
          bgGlow: 'shadow-purple-500/30'
        };
      case ACHIEVEMENT_TYPES.MISSION:
        return {
          title: 'Misión Completada',
          gradient: 'from-blue-500 to-indigo-500',
          bgGlow: 'shadow-blue-500/30'
        };
      case ACHIEVEMENT_TYPES.STREAK:
        return {
          title: 'Racha Activa',
          gradient: 'from-orange-500 to-red-500',
          bgGlow: 'shadow-orange-500/30'
        };
      default:
        return {
          title: 'Logro',
          gradient: 'from-gray-500 to-gray-600',
          bgGlow: 'shadow-gray-500/30'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700
        shadow-2xl ${config.bgGlow}
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {/* Barra de progreso de tiempo */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${config.gradient} animate-[shrink_5s_linear_forwards]`}
          style={{ animation: 'shrink 5s linear forwards' }}
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icono principal */}
          <div className={`
            w-16 h-16 rounded-xl flex items-center justify-center text-4xl
            bg-gradient-to-br ${config.gradient}
            animate-bounce-subtle
          `}>
            {achievement.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {config.title}
            </p>
            <h3 className="text-lg font-bold text-white truncate">
              {achievement.title}
            </h3>
            {achievement.description && (
              <p className="text-sm text-gray-400 mt-0.5">
                {achievement.description}
              </p>
            )}

            {/* Rewards */}
            <div className="flex items-center gap-3 mt-2">
              {achievement.xpReward > 0 && (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-400">
                  <span>⭐</span>
                  +{achievement.xpReward} XP
                </span>
              )}
              {achievement.coinsReward > 0 && (
                <span className="flex items-center gap-1 text-sm font-medium text-yellow-400">
                  <span>🪙</span>
                  +{achievement.coinsReward}
                </span>
              )}
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
}

// Modal grande para level up
function LevelUpModal({ level, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const levelInfo = LEVELS.find(l => l.level === level) || LEVELS[0];

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed inset-0 z-[300] flex items-center justify-center
        transition-all duration-300
        ${isVisible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative max-w-md w-full mx-4 p-8 rounded-2xl
          bg-gray-800 border border-gray-700
          transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-[confetti_3s_ease-out_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'][i % 4],
                animationDelay: `${Math.random() * 2}s`,
                top: '-10%'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ¡Subiste de Nivel!
          </h2>
          <div className={`
            w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-6xl my-6
            bg-gradient-to-br ${levelInfo.color}
            shadow-2xl
          `}>
            {level}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {levelInfo.name}
          </h3>
          <p className="text-gray-400 mb-6">
            {levelInfo.description || `Has alcanzado el nivel ${level}`}
          </p>

          <button
            onClick={handleClose}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all"
          >
            ¡Genial!
          </button>
        </div>
      </div>
    </div>
  );
}

// Provider de achievements
export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState([]);
  const [levelUpModal, setLevelUpModal] = useState(null);

  const showAchievement = (achievement) => {
    const id = Date.now();
    setAchievements(prev => [...prev, { ...achievement, id }]);
  };

  const showBadge = (badge) => {
    showAchievement({
      type: ACHIEVEMENT_TYPES.BADGE,
      icon: badge.icon,
      title: badge.name,
      description: badge.description,
      xpReward: badge.xpReward || 0,
      coinsReward: badge.coinsReward || 0
    });
  };

  const showLevelUp = (level) => {
    setLevelUpModal(level);
  };

  const showXP = (amount, reason) => {
    showAchievement({
      type: ACHIEVEMENT_TYPES.XP,
      icon: '⭐',
      title: `+${amount} XP`,
      description: reason,
      xpReward: amount,
      coinsReward: 0
    });
  };

  const showMission = (mission) => {
    showAchievement({
      type: ACHIEVEMENT_TYPES.MISSION,
      icon: mission.icon || '✅',
      title: mission.title,
      description: 'Misión completada',
      xpReward: mission.xpReward || 0,
      coinsReward: mission.coinsReward || 0
    });
  };

  const showStreak = (days) => {
    showAchievement({
      type: ACHIEVEMENT_TYPES.STREAK,
      icon: '🔥',
      title: `${days} días de racha`,
      description: '¡Sigue así!',
      xpReward: days * 10,
      coinsReward: days * 5
    });
  };

  const removeAchievement = (id) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AchievementContext.Provider value={{
      showAchievement,
      showBadge,
      showLevelUp,
      showXP,
      showMission,
      showStreak
    }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[250] space-y-3 w-96 max-w-[calc(100vw-2rem)]">
        {achievements.map(achievement => (
          <AchievementToast
            key={achievement.id}
            achievement={achievement}
            onClose={() => removeAchievement(achievement.id)}
          />
        ))}
      </div>

      {/* Level up modal */}
      {levelUpModal && (
        <LevelUpModal
          level={levelUpModal}
          onClose={() => setLevelUpModal(null)}
        />
      )}
    </AchievementContext.Provider>
  );
}

// Hook para usar achievements
export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
}

// Añadir animaciones CSS necesarias
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }

  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(200%); }
  }

  @keyframes bounce-subtle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}

export default AchievementProvider;
