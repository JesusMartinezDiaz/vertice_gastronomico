/**
 * Agent 72 - Abogado Familiar (PRIVADO del CEO)
 *
 * Este agente es exclusivo para asuntos legales familiares del CEO.
 * Solo puede ser invocado por el Agente 1 (CEO/Director General IA).
 */

import {
  FamilyLawyerAgent as FLA,
  LEGAL_DOCUMENT_TYPES as LDT,
  CASE_STATUS as CS,
  getFamilyLawyerAgent as getFLA
} from './FamilyLawyerAgent.js';

export const FamilyLawyerAgent = FLA;
export const LEGAL_DOCUMENT_TYPES = LDT;
export const CASE_STATUS = CS;
export const getFamilyLawyerAgent = getFLA;

export default {
  FamilyLawyerAgent,
  LEGAL_DOCUMENT_TYPES,
  CASE_STATUS,
  getFamilyLawyerAgent
};
