/**
 * Delegation Module - Sistema de Delegación entre Agentes
 *
 * Permite que el CEO (Agente 1) y otros agentes deleguen tareas
 * a agentes especializados y ejecuten workflows automáticamente.
 */

export {
  DelegationEngine,
  DelegationTask,
  Workflow,
  DELEGATION_STATUS,
  DELEGATION_TYPE,
  AGENT_REGISTRY,
  getDelegationEngine
} from './DelegationEngine.js';

export default {
  getDelegationEngine
};
