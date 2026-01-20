/**
 * Layout Principal - Vértice Gastronómico
 * Mejorado con Command Palette, Toast y UX optimizada
 */

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FloatingWorkflowPanel } from './FloatingWorkflowPanel';
import { CommandPalette, useCommandPalette } from '../common/CommandPalette';
import { Breadcrumb } from '../common/Breadcrumb';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  orders: 'Gestión de Órdenes',
  menu: 'Menú',
  inventory: 'Inventario',
  reports: 'Reportes',
  'ai-agents': 'Agentes IA',
  settings: 'Configuración'
};

const PAGE_BREADCRUMBS = {
  dashboard: [],
  orders: [{ id: 'orders', label: 'Órdenes' }],
  menu: [{ id: 'menu', label: 'Menú' }],
  inventory: [{ id: 'inventory', label: 'Inventario' }],
  reports: [{ id: 'reports', label: 'Reportes' }],
  'ai-agents': [{ id: 'ai-agents', label: 'Agentes IA' }],
  settings: [{ id: 'settings', label: 'Configuración' }]
};

export function MainLayout({
  children,
  currentPage,
  onNavigate,
  workflows = [],
  onWorkflowClick,
  showWorkflowPanel = true
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const commandPalette = useCommandPalette();

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-900 flex flex-col">
      {/* Sidebar - Fixed position with internal scroll */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content wrapper - Takes remaining space */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        {/* Header - Sticky at top */}
        <Header
          title={PAGE_TITLES[currentPage] || 'Vértice'}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onCommandPaletteOpen={commandPalette.open}
        />

        {/* Main content area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb navigation */}
          {currentPage !== 'dashboard' && (
            <Breadcrumb
              items={PAGE_BREADCRUMBS[currentPage] || []}
              onNavigate={handleNavigate}
            />
          )}

          {/* Page content with fade transition */}
          <div className="animate-in fade-in duration-200">
            {children}
          </div>
        </main>

        {/* Keyboard shortcut hint - bottom left */}
        <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
          <button
            onClick={commandPalette.open}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Buscar</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-700 rounded">⌘K</kbd>
          </button>
        </div>
      </div>

      {/* Panel flotante de Workflows - Separado del menú */}
      {showWorkflowPanel && (
        <FloatingWorkflowPanel
          workflows={workflows}
          onWorkflowClick={onWorkflowClick}
        />
      )}

      {/* Command Palette - Global search */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default MainLayout;
