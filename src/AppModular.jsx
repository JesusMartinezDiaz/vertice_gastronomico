/**
 * App Modular - Vértice Gastronómico
 * Versión modularizada de la aplicación
 * Con UX optimizada: Onboarding, Toast, Command Palette, Gamificación
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { GamificationProvider } from './context/GamificationContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoadingScreen } from './components/common/LoadingSpinner';
import { ToastProvider } from './components/common/Toast';
import { Onboarding, useOnboarding } from './components/common/Onboarding';
import { AchievementProvider } from './components/gamification/AchievementPopup';
import { GamificationProfile } from './components/gamification/GamificationProfile';
import { Leaderboard } from './components/gamification/Leaderboard';
import wsService from './services/websocket';

// Placeholder pages para módulos pendientes
function OrdersPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Gestión de Órdenes</h2>
      <p className="text-gray-400">Módulo de órdenes - próximamente</p>
    </div>
  );
}

function MenuPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Menú</h2>
      <p className="text-gray-400">Módulo de menú - próximamente</p>
    </div>
  );
}

function InventoryPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Inventario</h2>
      <p className="text-gray-400">Módulo de inventario - próximamente</p>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Reportes</h2>
      <p className="text-gray-400">Módulo de reportes - próximamente</p>
    </div>
  );
}

function AIAgentsPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Agentes IA</h2>
      <p className="text-gray-400">
        Los 72 agentes de IA están disponibles en la versión completa (App.jsx original)
      </p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-2">Configuración</h2>
      <p className="text-gray-400">Módulo de configuración - próximamente</p>
    </div>
  );
}

// Página de Gamificación
function GamificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Progreso</h1>
          <p className="text-gray-400">Nivel, logros, misiones y rankings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil y progreso */}
        <div className="lg:col-span-2">
          <GamificationProfile />
        </div>

        {/* Leaderboard compacto */}
        <div>
          <Leaderboard compact />
        </div>
      </div>

      {/* Leaderboard completo */}
      <div>
        <Leaderboard />
      </div>
    </div>
  );
}

// Router simple con Onboarding
function AppRouter() {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { showOnboarding, completeOnboarding, isLoading: onboardingLoading } = useOnboarding();

  // Conectar WebSocket cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      if (token) {
        wsService.connect(token);
      }
    } else {
      wsService.disconnect();
    }

    return () => {
      wsService.disconnect();
    };
  }, [isAuthenticated, user]);

  if (loading || onboardingLoading) {
    return <LoadingScreen message="Cargando Vértice..." />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'orders':
        return <OrdersPage />;
      case 'menu':
        return <MenuPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'reports':
        return <ReportsPage />;
      case 'ai-agents':
        return <AIAgentsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'gamification':
        return <GamificationPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <GamificationProvider>
      <AchievementProvider>
        <RestaurantProvider>
          <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
            {renderPage()}
          </MainLayout>

          {/* Onboarding para nuevos usuarios */}
          {showOnboarding && (
            <Onboarding
              onComplete={completeOnboarding}
              onNavigate={setCurrentPage}
            />
          )}
        </RestaurantProvider>
      </AchievementProvider>
    </GamificationProvider>
  );
}

// App principal con ToastProvider
export default function AppModular() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  );
}
