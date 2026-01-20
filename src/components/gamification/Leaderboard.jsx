/**
 * Leaderboard - Rankings y clasificación
 * Vértice Gastronómico
 *
 * Muestra rankings de usuarios por XP, nivel y logros
 */

import React, { useState, useEffect } from 'react';
import { useGamification, LEVELS } from '../../context/GamificationContext';

// Datos simulados de otros usuarios para el leaderboard
const MOCK_LEADERBOARD = [
  { id: 1, name: 'María García', role: 'Propietario', icon: '👑', xp: 4850, level: 9, badges: 18 },
  { id: 2, name: 'Carlos López', role: 'Gerente', icon: '🎯', xp: 3920, level: 8, badges: 15 },
  { id: 3, name: 'Ana Martínez', role: 'Chef', icon: '👨‍🍳', xp: 3450, level: 7, badges: 14 },
  { id: 4, name: 'Roberto Sánchez', role: 'Admin', icon: '📊', xp: 2890, level: 6, badges: 12 },
  { id: 5, name: 'Laura Torres', role: 'Propietario', icon: '👑', xp: 2340, level: 5, badges: 10 },
  { id: 6, name: 'Diego Ramírez', role: 'Chef', icon: '👨‍🍳', xp: 1980, level: 5, badges: 9 },
  { id: 7, name: 'Sofia Hernández', role: 'Mesero', icon: '🍽️', xp: 1650, level: 4, badges: 7 },
  { id: 8, name: 'Miguel Castro', role: 'Barista', icon: '🍸', xp: 1420, level: 4, badges: 6 },
  { id: 9, name: 'Elena Ruiz', role: 'Admin', icon: '📊', xp: 1180, level: 3, badges: 5 },
  { id: 10, name: 'Jorge Morales', role: 'Gerente', icon: '🎯', xp: 980, level: 3, badges: 4 }
];

function LeaderboardEntry({ rank, user, isCurrentUser = false }) {
  const levelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-600/50';
      default:
        return 'bg-gray-800/50 border-gray-700';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl border transition-all
        ${getRankStyle(rank)}
        ${isCurrentUser ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-900' : ''}
      `}
    >
      {/* Rank */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold
        ${rank <= 3 ? 'text-2xl' : 'bg-gray-700 text-gray-300'}
      `}>
        {getRankIcon(rank)}
      </div>

      {/* Avatar y nombre */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          bg-gradient-to-br ${levelInfo.color}
        `}>
          {user.icon}
        </div>
        <div className="min-w-0">
          <p className={`font-medium truncate ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
            {user.name} {isCurrentUser && '(Tú)'}
          </p>
          <p className="text-sm text-gray-400">{user.role}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-right">
        <div>
          <p className="text-xs text-gray-400">Nivel</p>
          <p className="text-lg font-bold text-white">{user.level}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">XP</p>
          <p className="text-lg font-bold text-emerald-400">{user.xp.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Insignias</p>
          <p className="text-lg font-bold text-amber-400">{user.badges}</p>
        </div>
      </div>
    </div>
  );
}

function TimeFilter({ value, onChange }) {
  const options = [
    { id: 'weekly', label: 'Esta semana' },
    { id: 'monthly', label: 'Este mes' },
    { id: 'alltime', label: 'Todos los tiempos' }
  ];

  return (
    <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg">
      {options.map(option => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all
            ${value === option.id
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function CategoryFilter({ value, onChange }) {
  const categories = [
    { id: 'xp', label: 'XP Total', icon: '⭐' },
    { id: 'level', label: 'Nivel', icon: '📊' },
    { id: 'badges', label: 'Insignias', icon: '🏆' }
  ];

  return (
    <div className="flex gap-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${value === cat.id
              ? 'bg-gray-700 text-white border border-gray-600'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }
          `}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export function Leaderboard({ compact = false }) {
  const { xp, level, badges, userType } = useGamification();
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [categoryFilter, setCategoryFilter] = useState('xp');
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Simular usuario actual en el leaderboard
  const currentUser = {
    id: 'current',
    name: 'Tú',
    role: userType.name,
    icon: userType.icon,
    xp: xp,
    level: level,
    badges: badges.filter(b => b.unlocked).length
  };

  useEffect(() => {
    // Combinar datos mock con usuario actual y ordenar
    const allUsers = [...MOCK_LEADERBOARD, currentUser];

    let sorted;
    switch (categoryFilter) {
      case 'level':
        sorted = allUsers.sort((a, b) => b.level - a.level || b.xp - a.xp);
        break;
      case 'badges':
        sorted = allUsers.sort((a, b) => b.badges - a.badges || b.xp - a.xp);
        break;
      default:
        sorted = allUsers.sort((a, b) => b.xp - a.xp);
    }

    setLeaderboardData(sorted);
  }, [xp, level, badges, categoryFilter, userType]);

  // Encontrar posición del usuario actual
  const currentUserRank = leaderboardData.findIndex(u => u.id === 'current') + 1;

  // Vista compacta (top 5)
  if (compact) {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🏆</span> Ranking
          </h3>
          <span className="text-sm text-gray-400">Tu posición: #{currentUserRank}</span>
        </div>

        <div className="space-y-2">
          {leaderboardData.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className={`
                flex items-center gap-3 p-2 rounded-lg
                ${user.id === 'current' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-gray-700/30'}
              `}
            >
              <span className="w-6 text-center font-bold text-gray-400">
                {index + 1 <= 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
              </span>
              <span className="text-xl">{user.icon}</span>
              <span className={`flex-1 truncate ${user.id === 'current' ? 'text-emerald-400' : 'text-white'}`}>
                {user.name}
              </span>
              <span className="text-emerald-400 font-medium">{user.xp.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              Leaderboard
            </h2>
            <p className="text-gray-400 mt-1">
              Tu posición actual: <span className="text-emerald-400 font-bold">#{currentUserRank}</span> de {leaderboardData.length}
            </p>
          </div>
          <TimeFilter value={timeFilter} onChange={setTimeFilter} />
        </div>

        <div className="mt-4">
          <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        </div>
      </div>

      {/* Podium (top 3) */}
      <div className="p-6 bg-gradient-to-b from-gray-800/50 to-transparent">
        <div className="flex justify-center items-end gap-4">
          {/* 2do lugar */}
          {leaderboardData[1] && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-400/30 to-gray-300/30 border-2 border-gray-400 flex items-center justify-center text-4xl mb-2">
                {leaderboardData[1].icon}
              </div>
              <div className="text-3xl mb-1">🥈</div>
              <p className={`font-medium truncate max-w-[100px] ${leaderboardData[1].id === 'current' ? 'text-emerald-400' : 'text-white'}`}>
                {leaderboardData[1].name}
              </p>
              <p className="text-sm text-gray-400">{leaderboardData[1].xp.toLocaleString()} XP</p>
            </div>
          )}

          {/* 1er lugar */}
          {leaderboardData[0] && (
            <div className="text-center -mt-4">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border-2 border-amber-500 flex items-center justify-center text-5xl mb-2 shadow-lg shadow-amber-500/20">
                {leaderboardData[0].icon}
              </div>
              <div className="text-4xl mb-1">🥇</div>
              <p className={`font-bold truncate max-w-[120px] ${leaderboardData[0].id === 'current' ? 'text-emerald-400' : 'text-white'}`}>
                {leaderboardData[0].name}
              </p>
              <p className="text-sm text-amber-400">{leaderboardData[0].xp.toLocaleString()} XP</p>
            </div>
          )}

          {/* 3er lugar */}
          {leaderboardData[2] && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-600/30 to-orange-500/30 border-2 border-orange-600 flex items-center justify-center text-4xl mb-2">
                {leaderboardData[2].icon}
              </div>
              <div className="text-3xl mb-1">🥉</div>
              <p className={`font-medium truncate max-w-[100px] ${leaderboardData[2].id === 'current' ? 'text-emerald-400' : 'text-white'}`}>
                {leaderboardData[2].name}
              </p>
              <p className="text-sm text-gray-400">{leaderboardData[2].xp.toLocaleString()} XP</p>
            </div>
          )}
        </div>
      </div>

      {/* Lista completa */}
      <div className="p-6 space-y-3">
        {leaderboardData.slice(3).map((user, index) => (
          <LeaderboardEntry
            key={user.id}
            rank={index + 4}
            user={user}
            isCurrentUser={user.id === 'current'}
          />
        ))}
      </div>

      {/* Tu resumen */}
      {currentUserRank > 3 && (
        <div className="p-6 border-t border-gray-700 bg-emerald-500/5">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Tu posición</h3>
          <LeaderboardEntry
            rank={currentUserRank}
            user={currentUser}
            isCurrentUser={true}
          />
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
