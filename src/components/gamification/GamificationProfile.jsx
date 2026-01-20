/**
 * GamificationProfile - Perfil gamificado del usuario
 * Vértice Gastronómico
 *
 * Muestra nivel, XP, badges, monedas y progreso
 */

import React, { useState } from 'react';
import { useGamification, LEVELS, BADGES } from '../../context/GamificationContext';

// Componente de barra de progreso XP
function XPProgressBar({ currentXP, currentLevel, nextLevel }) {
  const xpForCurrentLevel = currentLevel.minXP;
  const xpForNextLevel = nextLevel ? nextLevel.minXP : currentLevel.minXP + 1000;
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const percentage = Math.min((xpProgress / xpNeeded) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{xpProgress} XP</span>
        <span>{xpNeeded} XP para siguiente nivel</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Componente de badge individual
function BadgeItem({ badge, unlocked, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-xl flex items-center justify-center
        transition-all duration-300 relative group
        ${unlocked
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/50'
          : 'bg-gray-800/50 border border-gray-700 grayscale opacity-50'
        }
      `}
      title={unlocked ? badge.name : `${badge.name} - Bloqueado`}
    >
      <span className={unlocked ? '' : 'opacity-30'}>{badge.icon}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
        <p className="text-sm font-medium text-white">{badge.name}</p>
        <p className="text-xs text-gray-400">{badge.description}</p>
        {unlocked && (
          <p className="text-xs text-emerald-400 mt-1">+{badge.xpReward} XP</p>
        )}
      </div>
    </div>
  );
}

// Panel de misiones diarias
function DailyMissionsPanel({ missions, onComplete }) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-xl">📋</span>
          Misiones Diarias
        </h3>
        <span className="text-xs text-gray-400">Reinicia en 24h</span>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`
              p-3 rounded-lg border transition-all
              ${mission.completed
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'
              }
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{mission.icon}</span>
                <div>
                  <p className={`font-medium ${mission.completed ? 'text-emerald-400' : 'text-white'}`}>
                    {mission.title}
                  </p>
                  <p className="text-sm text-gray-400">{mission.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium text-amber-400">+{mission.xpReward} XP</span>
                {mission.coinsReward > 0 && (
                  <span className="text-xs text-yellow-500">+{mission.coinsReward} monedas</span>
                )}
              </div>
            </div>

            {/* Progress bar for missions with progress */}
            {mission.progress !== undefined && !mission.completed && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progreso</span>
                  <span>{mission.progress}/{mission.target}</span>
                </div>
                <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {mission.completed && (
              <div className="mt-2 flex items-center gap-1 text-emerald-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completada
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Panel de estadísticas
function StatsPanel({ stats }) {
  const statItems = [
    { label: 'Consultas IA', value: stats.totalConsultas, icon: '🤖', color: 'emerald' },
    { label: 'Reportes', value: stats.reportesGenerados, icon: '📊', color: 'blue' },
    { label: 'Días activo', value: stats.diasActivo, icon: '📅', color: 'purple' },
    { label: 'Racha actual', value: `${stats.rachaActual} días`, icon: '🔥', color: 'orange' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className={`
            p-3 rounded-lg border
            ${stat.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
            ${stat.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' : ''}
            ${stat.color === 'purple' ? 'bg-purple-500/10 border-purple-500/30' : ''}
            ${stat.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' : ''}
          `}
        >
          <div className="flex items-center gap-2 mb-1">
            <span>{stat.icon}</span>
            <span className="text-xs text-gray-400">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

// Componente principal de perfil
export function GamificationProfile({ compact = false }) {
  const {
    userType,
    level,
    xp,
    coins,
    badges,
    dailyMissions,
    stats,
    completeMission
  } = useGamification();

  const [activeTab, setActiveTab] = useState('overview');

  const currentLevelInfo = LEVELS.find(l => l.level === level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === level + 1);
  const unlockedBadges = badges.filter(b => b.unlocked);
  const allBadges = Object.values(BADGES);

  // Vista compacta para sidebar/header
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          bg-gradient-to-br ${currentLevelInfo.color}
        `}>
          {userType.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">{userType.name}</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
              Nv. {level}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-400">{xp} XP</span>
            <span className="text-sm text-yellow-500 flex items-center gap-1">
              <span>🪙</span> {coins}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header del perfil */}
      <div className={`p-6 bg-gradient-to-r ${currentLevelInfo.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-900/30 backdrop-blur flex items-center justify-center text-4xl border-2 border-white/20">
              {userType.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userType.name}</h2>
              <p className="text-white/80">{currentLevelInfo.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium">
                  Nivel {level}
                </span>
                <span className="text-white/90 flex items-center gap-1">
                  <span>🪙</span> {coins} monedas
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/80 text-sm">Experiencia total</p>
            <p className="text-3xl font-bold text-white">{xp.toLocaleString()} XP</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <XPProgressBar
            currentXP={xp}
            currentLevel={currentLevelInfo}
            nextLevel={nextLevelInfo}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex">
          {[
            { id: 'overview', label: 'Resumen', icon: '📊' },
            { id: 'badges', label: 'Insignias', icon: '🏆' },
            { id: 'missions', label: 'Misiones', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de tabs */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Estadísticas</h3>
              <StatsPanel stats={stats} />
            </div>

            {/* Badges recientes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Últimas Insignias</h3>
                <button
                  onClick={() => setActiveTab('badges')}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Ver todas →
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {unlockedBadges.slice(0, 5).map(badge => (
                  <BadgeItem key={badge.id} badge={badge} unlocked={true} />
                ))}
                {unlockedBadges.length === 0 && (
                  <p className="text-gray-400 text-sm">Aún no has desbloqueado insignias</p>
                )}
              </div>
            </div>

            {/* Bonus del tipo de usuario */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                Bonus de {userType.name}
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                Multiplicador de XP: <span className="text-amber-400 font-bold">x{userType.baseMultiplier}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {userType.focusAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full capitalize"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Badges desbloqueados */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Desbloqueadas ({unlockedBadges.length}/{allBadges.length})
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {allBadges.map(badge => {
                  const isUnlocked = badges.some(b => b.id === badge.id && b.unlocked);
                  return (
                    <BadgeItem
                      key={badge.id}
                      badge={badge}
                      unlocked={isUnlocked}
                      size="md"
                    />
                  );
                })}
              </div>
            </div>

            {/* Próximas a desbloquear */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Próximas a desbloquear</h3>
              <div className="space-y-2">
                {allBadges
                  .filter(b => !badges.some(ub => ub.id === b.id && ub.unlocked))
                  .slice(0, 3)
                  .map(badge => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                    >
                      <span className="text-2xl opacity-50">{badge.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{badge.name}</p>
                        <p className="text-sm text-gray-400">{badge.description}</p>
                      </div>
                      <span className="text-amber-400 text-sm">+{badge.xpReward} XP</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <DailyMissionsPanel
            missions={dailyMissions}
            onComplete={completeMission}
          />
        )}
      </div>
    </div>
  );
}

// Widget compacto para header
export function GamificationWidget() {
  const { level, xp, coins, userType, badges } = useGamification();
  const [showPopup, setShowPopup] = useState(false);

  const currentLevelInfo = LEVELS.find(l => l.level === level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === level + 1);
  const xpProgress = nextLevelInfo
    ? ((xp - currentLevelInfo.minXP) / (nextLevelInfo.minXP - currentLevelInfo.minXP)) * 100
    : 100;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
      >
        <div className="relative">
          <span className="text-xl">{userType.icon}</span>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {level}
          </span>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">{xp} XP</span>
            <span className="text-yellow-500 text-sm flex items-center gap-0.5">
              🪙 {coins}
            </span>
          </div>
          <div className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </button>

      {/* Popup */}
      {showPopup && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopup(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <GamificationProfile compact={false} />
          </div>
        </>
      )}
    </div>
  );
}

export default GamificationProfile;
