/**
 * Configuración estandarizada de z-index
 * Vértice Gastronómico
 *
 * Este archivo centraliza todos los valores de z-index
 * para mantener consistencia en toda la aplicación
 */

export const Z_INDEX = {
  // Base layers (0-9)
  base: 0,
  content: 1,

  // Cards and elevated content (10-19)
  card: 10,
  cardHover: 11,

  // Fixed elements (20-29)
  sticky: 20,
  stickyHeader: 21,

  // Mobile overlay (30)
  mobileOverlay: 30,

  // Sidebar and navigation (40)
  sidebar: 40,
  header: 40,

  // Dropdowns and popovers (50-59)
  dropdown: 50,
  popover: 51,
  tooltip: 52,

  // Floating panels (60-69)
  floatingPanel: 60,
  workflowPanel: 60,

  // Modals and dialogs (70-79)
  modalBackdrop: 70,
  modal: 71,

  // Alerts and notifications (80-89)
  notification: 80,
  toast: 81,
  alert: 82,

  // Maximum priority (90-99)
  loadingOverlay: 90,
  critical: 99
};

/**
 * Clases de Tailwind correspondientes a cada z-index
 */
export const Z_INDEX_CLASSES = {
  base: 'z-0',
  content: 'z-[1]',
  card: 'z-10',
  cardHover: 'z-[11]',
  sticky: 'z-20',
  stickyHeader: 'z-[21]',
  mobileOverlay: 'z-30',
  sidebar: 'z-40',
  header: 'z-40',
  dropdown: 'z-50',
  popover: 'z-[51]',
  tooltip: 'z-[52]',
  floatingPanel: 'z-[60]',
  workflowPanel: 'z-[60]',
  modalBackdrop: 'z-[70]',
  modal: 'z-[71]',
  notification: 'z-[80]',
  toast: 'z-[81]',
  alert: 'z-[82]',
  loadingOverlay: 'z-[90]',
  critical: 'z-[99]'
};

/**
 * Documentación de uso:
 *
 * 1. Sidebar y Header: z-40
 *    - Ambos están al mismo nivel para evitar superposiciones
 *
 * 2. Mobile overlay: z-30
 *    - Por debajo del sidebar pero sobre el contenido
 *
 * 3. Dropdowns (menús de usuario, restaurantes): z-50
 *    - Por encima del header para mostrarse correctamente
 *
 * 4. Panel de Workflows Flotante: z-60
 *    - Por encima de dropdowns para siempre ser visible
 *
 * 5. Modales: z-70-71
 *    - Máxima prioridad visual excepto notificaciones
 *
 * 6. Notificaciones/Toasts: z-80+
 *    - Siempre visibles, incluso sobre modales
 */

export default Z_INDEX;
