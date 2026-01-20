/**
 * Índice de Servicios - Vértice Gastronómico
 * Exporta todos los servicios para fácil importación
 */

// Configuraciones
export { prisma, connectDatabase, disconnectDatabase, checkDatabaseHealth } from '../config/database.js';
export { redis, cache, connectRedis, checkRedisHealth, getCacheStats } from '../config/redis.js';

// Autenticación
export {
  default as authService,
  configurePassport,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  changePassword,
  requestPasswordReset,
  resetPassword
} from './auth.service.js';

// Pagos
export {
  default as stripeService,
  getOrCreateCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  handleWebhook as handleStripeWebhook,
  cancelSubscription,
  getSubscriptionStatus,
  getAvailablePlans,
  createPaymentIntent,
  SUBSCRIPTION_PLANS
} from './stripe.service.js';

// Email
export {
  default as emailService,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionEmail,
  sendAlertEmail,
  sendReportReadyEmail,
  verifyConnection as verifyEmailConnection
} from './email.service.js';

// SMS y WhatsApp
export {
  default as twilioService,
  sendSMS,
  sendWhatsApp,
  sendTemplateMessage,
  sendCriticalAlert,
  sendOrderReadyNotification,
  sendReservationConfirmation,
  sendReservationReminder,
  sendVerificationCode,
  sendPromotionalOffer,
  sendWelcomeMessage,
  sendDailyReport,
  sendBulkMessages,
  handleIncomingMessage,
  checkTwilioStatus
} from './twilio.service.js';

// Monitoreo y Logging
export {
  default as monitoringService,
  initSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  sentryErrorHandler,
  logger,
  httpLogger,
  aiLogger,
  dbLogger,
  paymentLogger,
  requestLogger,
  metrics,
  metricsMiddleware,
  getMetrics,
  getHealthStatus
} from './monitoring.service.js';

// Colas de trabajo
export {
  default as queueService,
  aiQueue,
  emailQueue,
  notificationQueue,
  reportQueue,
  webhookQueue,
  scheduledQueue,
  auditQueue,
  queueAIProcessing,
  queueEmail,
  queueNotification,
  queueReportGeneration,
  queueWebhook,
  scheduleTask,
  queueAuditLog,
  createEmailWorker,
  createNotificationWorker,
  createReportWorker,
  createWebhookWorker,
  createAuditWorker,
  getQueueStats,
  cleanQueues,
  pauseQueue,
  resumeQueue
} from './queue.service.js';

/**
 * Inicializar todos los servicios
 * En modo desarrollo, continúa aunque algunos servicios no estén disponibles
 */
export async function initializeServices(app) {
  const isDev = process.env.NODE_ENV === 'development';
  const results = {
    database: false,
    redis: false,
    sentry: false,
    email: false,
    twilio: false
  };

  console.log('\n🔧 Inicializando servicios...\n');

  // Inicializar base de datos (opcional en desarrollo)
  try {
    results.database = await connectDatabase();
  } catch (error) {
    console.error('⚠️  Base de datos no disponible:', error.message);
    if (isDev) {
      console.log('   📝 Continuando en modo desarrollo sin PostgreSQL');
      console.log('   💡 Para activar: docker-compose up -d postgres\n');
    }
  }

  // Inicializar Redis (opcional en desarrollo)
  try {
    await connectRedis();
    results.redis = true;
  } catch (error) {
    console.error('⚠️  Redis no disponible:', error.message);
    if (isDev) {
      console.log('   📝 Continuando en modo desarrollo sin Redis');
      console.log('   💡 Para activar: docker-compose up -d redis\n');
    }
  }

  // Inicializar Sentry (siempre opcional)
  try {
    if (process.env.SENTRY_DSN) {
      initSentry(app);
      results.sentry = true;
    } else if (isDev) {
      console.log('ℹ️  Sentry no configurado (opcional en desarrollo)');
    }
  } catch (error) {
    console.error('⚠️  Error inicializando Sentry:', error.message);
  }

  // Verificar email (opcional)
  try {
    const emailStatus = await verifyEmailConnection();
    results.email = emailStatus.connected;
  } catch (error) {
    if (isDev) {
      console.log('ℹ️  Email no configurado (opcional en desarrollo)');
    }
  }

  // Verificar Twilio (opcional)
  try {
    const twilioStatus = await checkTwilioStatus();
    results.twilio = twilioStatus.status === 'connected';
  } catch (error) {
    if (isDev) {
      console.log('ℹ️  Twilio no configurado (opcional en desarrollo)');
    }
  }

  // Configurar Passport (siempre)
  try {
    configurePassport();
    console.log('✅ Passport JWT configurado');
  } catch (error) {
    console.error('❌ Error configurando Passport:', error.message);
  }

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║       ESTADO DE SERVICIOS                ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  PostgreSQL: ${results.database ? '✅ Conectado         ' : '⚠️  No disponible    '} ║`);
  console.log(`║  Redis:      ${results.redis ? '✅ Conectado         ' : '⚠️  No disponible    '} ║`);
  console.log(`║  Sentry:     ${results.sentry ? '✅ Activo            ' : '⚪ No configurado    '} ║`);
  console.log(`║  Email:      ${results.email ? '✅ Verificado        ' : '⚪ No configurado    '} ║`);
  console.log(`║  Twilio:     ${results.twilio ? '✅ Conectado         ' : '⚪ No configurado    '} ║`);
  console.log('╚══════════════════════════════════════════╝\n');

  if (isDev && (!results.database || !results.redis)) {
    console.log('💡 Para activar todos los servicios:');
    console.log('   1. Instalar Docker: https://docker.com');
    console.log('   2. Ejecutar: docker-compose up -d');
    console.log('   3. Reiniciar el servidor\n');
  }

  return results;
}

/**
 * Cerrar todos los servicios
 */
export async function shutdownServices() {
  console.log('\n🔄 Cerrando servicios...');

  await disconnectDatabase();
  await redis.quit();

  console.log('✅ Servicios cerrados correctamente\n');
}

export default {
  initializeServices,
  shutdownServices
};
