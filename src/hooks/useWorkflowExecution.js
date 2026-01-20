/**
 * useWorkflowExecution - Hook para ejecutar workflows en componentes React
 *
 * Este hook conecta los componentes del chat con el sistema de ejecución
 * de workflows. Resuelve el problema de que el workflow no se ejecutaba.
 *
 * USO:
 * const { executeAfterCEOResponse, isExecuting, lastResult, workflowEvents } = useWorkflowExecution();
 *
 * // Después de que el CEO responde:
 * const result = await executeAfterCEOResponse(ceoResponse, originalMessage, { attachments });
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  processCEOResponseAndExecute,
  delegateToAgent,
  subscribeToWorkflowEvents,
  getActiveTasks,
  getActiveWorkflows,
  AGENT_REGISTRY
} from '../services/workflowExecutor';

export function useWorkflowExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);
  const [workflowEvents, setWorkflowEvents] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [activeWorkflows, setActiveWorkflows] = useState([]);

  // Ref para mantener callbacks estables
  const callbacksRef = useRef({});

  // Suscribirse a eventos del workflow
  useEffect(() => {
    const unsubscribe = subscribeToWorkflowEvents((event, data) => {
      console.log('[useWorkflowExecution] Evento recibido:', event, data);

      // Agregar evento a la lista
      setWorkflowEvents(prev => [
        ...prev,
        {
          type: event,
          data,
          timestamp: new Date().toISOString()
        }
      ].slice(-50)); // Mantener solo los últimos 50 eventos

      // Actualizar tareas y workflows activos
      setActiveTasks(getActiveTasks());
      setActiveWorkflows(getActiveWorkflows());

      // Llamar callbacks personalizados si existen
      if (callbacksRef.current[event]) {
        callbacksRef.current[event](data);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Ejecuta el procesamiento de workflows después de que el CEO responde
   */
  const executeAfterCEOResponse = useCallback(async (ceoResponse, originalMessage, context = {}) => {
    setIsExecuting(true);
    setError(null);

    try {
      console.log('[useWorkflowExecution] Ejecutando workflow para respuesta del CEO');

      const result = await processCEOResponseAndExecute(ceoResponse, originalMessage, context);

      setLastResult(result);
      setActiveTasks(getActiveTasks());
      setActiveWorkflows(getActiveWorkflows());

      return result;
    } catch (err) {
      console.error('[useWorkflowExecution] Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  /**
   * Delega directamente a un agente específico
   */
  const delegateTo = useCallback(async (agentId, task, context = {}) => {
    setIsExecuting(true);
    setError(null);

    try {
      const result = await delegateToAgent(agentId, task, context);
      setLastResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  /**
   * Delega al Agente 72 (Abogado Familiar) - Atajo conveniente
   */
  const delegateToFamilyLawyer = useCallback(async (task, attachments = []) => {
    return delegateTo(72, task, {
      requesterId: 1, // Solo el CEO puede delegar al Agente 72
      attachments,
      generateDocument: true
    });
  }, [delegateTo]);

  /**
   * Registra un callback para un evento específico
   */
  const onWorkflowEvent = useCallback((eventType, callback) => {
    callbacksRef.current[eventType] = callback;
    return () => {
      delete callbacksRef.current[eventType];
    };
  }, []);

  /**
   * Limpia los eventos del workflow
   */
  const clearEvents = useCallback(() => {
    setWorkflowEvents([]);
  }, []);

  /**
   * Obtiene información de un agente
   */
  const getAgentInfo = useCallback((agentId) => {
    return AGENT_REGISTRY[agentId] || null;
  }, []);

  return {
    // Estado
    isExecuting,
    lastResult,
    error,
    workflowEvents,
    activeTasks,
    activeWorkflows,

    // Acciones principales
    executeAfterCEOResponse,
    delegateTo,
    delegateToFamilyLawyer,

    // Utilidades
    onWorkflowEvent,
    clearEvents,
    getAgentInfo,
    AGENT_REGISTRY
  };
}

/**
 * Hook simplificado para solo escuchar eventos de workflow
 */
export function useWorkflowEvents(callback) {
  useEffect(() => {
    if (callback) {
      return subscribeToWorkflowEvents(callback);
    }
  }, [callback]);
}

/**
 * Hook para verificar si un agente específico está disponible
 */
export function useAgentAvailability(agentId) {
  const agent = AGENT_REGISTRY[agentId];

  return {
    exists: !!agent,
    agent,
    isPrivate: agent?.isPrivate || false,
    requiresCEO: agent?.ceoOnly || false,
    canDelegate: agent?.canDelegate || false
  };
}

export default useWorkflowExecution;
