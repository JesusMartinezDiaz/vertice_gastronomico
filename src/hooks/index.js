/**
 * Hooks Index - Vértice Gastronómico
 *
 * Exporta todos los hooks personalizados del sistema.
 */

// Hook para ejecución de workflows (NUEVO - Soluciona el problema del workflow que no ejecutaba)
export {
  useWorkflowExecution,
  useWorkflowEvents,
  useAgentAvailability
} from './useWorkflowExecution';

// Exportar el hook de onboarding si existe
export { useOnboarding } from '../components/common/Onboarding';
