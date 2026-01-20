/**
 * Panel Flotante de Workflows Activos
 * Vértice Gastronómico
 *
 * Panel separado del menú principal para mostrar workflows
 * activos sin causar scroll excesivo
 */

import React, { useState } from 'react';

const WorkflowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const MinimizeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const STATUS_COLORS = {
  running: 'bg-emerald-500',
  pending: 'bg-yellow-500',
  completed: 'bg-blue-500',
  error: 'bg-red-500',
  paused: 'bg-gray-500'
};

const STATUS_LABELS = {
  running: 'Ejecutando',
  pending: 'Pendiente',
  completed: 'Completado',
  error: 'Error',
  paused: 'Pausado'
};

export function FloatingWorkflowPanel({
  workflows = [],
  onWorkflowClick,
  onClose,
  defaultExpanded = false
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(false);

  const activeWorkflows = workflows.filter(w => w.status === 'running' || w.status === 'pending');
  const hasActiveWorkflows = activeWorkflows.length > 0;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300 hover:scale-110
          ${hasActiveWorkflows ? 'bg-emerald-600 animate-pulse' : 'bg-gray-700'}
        `}
        title={`${activeWorkflows.length} workflows activos`}
      >
        <WorkflowIcon />
        {hasActiveWorkflows && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
            {activeWorkflows.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`
        fixed z-[60] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl
        transition-all duration-300
        ${isExpanded
          ? 'bottom-6 right-6 w-96 max-h-[70vh]'
          : 'bottom-6 right-6 w-80 max-h-[50vh]'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/90 rounded-t-lg sticky top-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${hasActiveWorkflows ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
          <h3 className="text-white font-semibold text-sm">
            Workflows Activos
            {hasActiveWorkflows && (
              <span className="ml-2 text-emerald-400">({activeWorkflows.length})</span>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
            title={isExpanded ? 'Contraer' : 'Expandir'}
          >
            <ExpandIcon />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
            title="Minimizar"
          >
            <MinimizeIcon />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-700 transition-colors"
              title="Cerrar"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="overflow-y-auto" style={{ maxHeight: isExpanded ? 'calc(70vh - 60px)' : 'calc(50vh - 60px)' }}>
        {workflows.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <WorkflowIcon />
            <p className="mt-2 text-sm">No hay workflows activos</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {workflows.map((workflow, index) => (
              <WorkflowItem
                key={workflow.id || index}
                workflow={workflow}
                onClick={() => onWorkflowClick?.(workflow)}
                isExpanded={isExpanded}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer con resumen */}
      {workflows.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-700 bg-gray-800/90 rounded-b-lg">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{workflows.filter(w => w.status === 'running').length} ejecutando</span>
            <span>{workflows.filter(w => w.status === 'completed').length} completados</span>
            <span>{workflows.filter(w => w.status === 'error').length} errores</span>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowItem({ workflow, onClick, isExpanded }) {
  const statusColor = STATUS_COLORS[workflow.status] || STATUS_COLORS.pending;
  const statusLabel = STATUS_LABELS[workflow.status] || 'Desconocido';

  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left group"
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 mt-1.5 rounded-full ${statusColor} ${workflow.status === 'running' ? 'animate-pulse' : ''}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white text-sm font-medium truncate">
              {workflow.name || 'Workflow sin nombre'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${statusColor}/20 text-${statusColor.replace('bg-', '')}`}>
              {statusLabel}
            </span>
          </div>

          {isExpanded && workflow.description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
              {workflow.description}
            </p>
          )}

          {/* Progress bar para workflows en ejecucion */}
          {workflow.status === 'running' && workflow.progress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progreso</span>
                <span>{workflow.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Tiempo estimado */}
          {workflow.estimatedTime && (
            <p className="text-gray-500 text-xs mt-1">
              Tiempo estimado: {workflow.estimatedTime}
            </p>
          )}

          {/* Agente asociado */}
          {workflow.agent && (
            <p className="text-emerald-400/70 text-xs mt-1">
              Agente: {workflow.agent}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default FloatingWorkflowPanel;
