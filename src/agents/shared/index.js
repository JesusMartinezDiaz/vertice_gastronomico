/**
 * Shared Module - Capacidades compartidas por todos los agentes
 *
 * Este módulo contiene:
 * - UniversalCapabilities: Clase base con capacidades universales
 * - TripleReviewSystem: Sistema de triple revisión de calidad
 * - Helpers y utilidades compartidas
 */

// Capacidades Universales
export {
  UniversalAgent,
  DocumentGenerator,
  QualitySystem,
  AIProcessor,
  WebSocketHandler,
  QueueProcessor,
  StorageHandler
} from './UniversalCapabilities.js';

// Sistema de Triple Revisión de Calidad
export {
  TripleReviewSystem,
  TechnicalValidator,
  ConsistencyValidator,
  FinalQualityControl,
  ERROR_SEVERITY,
  ERROR_CATEGORIES,
  defaultTripleReview
} from './TripleReviewSystem.js';

// Re-exportar UniversalAgent como default
export { default } from './UniversalCapabilities.js';
