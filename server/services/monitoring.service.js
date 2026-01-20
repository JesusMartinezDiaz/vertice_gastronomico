/**
 * Servicio de Monitoreo - Sentry + Pino + Prometheus
 * Vértice Gastronómico
 */

import * as Sentry from '@sentry/node';
import pino from 'pino';
import promClient from 'prom-client';

// ============================================
// SENTRY - Error Tracking
// ============================================

export function initSentry(app) {
  if (!process.env.SENTRY_DSN) {
    console.log('⚠️ Sentry DSN no configurado - monitoreo de errores desactivado');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.APP_VERSION || '1.0.0',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 0.1,
    integrations: [
      // Habilitar profiling
      Sentry.nodeProfilingIntegration(),
    ],
    // Filtrar datos sensibles
    beforeSend(event) {
      // Remover datos sensibles
      if (event.request?.data) {
        const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
        sensitiveFields.forEach(field => {
          if (event.request.data[field]) {
            event.request.data[field] = '[FILTERED]';
          }
        });
      }
      return event;
    },
    // Ignorar ciertos errores
    ignoreErrors: [
      'NetworkError',
      'AbortError',
      /^Request aborted/,
    ]
  });

  // Middleware para capturar requests
  app.use(Sentry.expressIntegration());

  console.log('✅ Sentry inicializado');
}

// Capturar excepción manualmente
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    extra: context
  });
}

// Capturar mensaje
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, {
    level,
    extra: context
  });
}

// Agregar breadcrumb
export function addBreadcrumb(category, message, data = {}) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info'
  });
}

// Middleware de error para Sentry
export function sentryErrorHandler() {
  return Sentry.expressErrorHandler();
}

// ============================================
// PINO - Structured Logging
// ============================================

const pinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      host: bindings.hostname,
      service: 'vertice-gastronomico'
    })
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Redactar campos sensibles
  redact: {
    paths: ['password', 'token', 'secret', 'apiKey', 'authorization', 'cookie'],
    censor: '[REDACTED]'
  }
};

// Pretty print en desarrollo
const transport = process.env.NODE_ENV === 'development'
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  : undefined;

export const logger = pino({
  ...pinoConfig,
  transport
});

// Logger específico para requests HTTP
export const httpLogger = logger.child({ component: 'http' });

// Logger específico para agentes AI
export const aiLogger = logger.child({ component: 'ai-agents' });

// Logger específico para base de datos
export const dbLogger = logger.child({ component: 'database' });

// Logger específico para pagos
export const paymentLogger = logger.child({ component: 'payments' });

// Middleware de logging para Express
export function requestLogger(req, res, next) {
  const startTime = process.hrtime();

  // Log al inicio del request
  httpLogger.info({
    method: req.method,
    url: req.url,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  }, `➡️ ${req.method} ${req.url}`);

  // Log al finalizar
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${durationMs}ms`,
      contentLength: res.get('Content-Length')
    };

    if (res.statusCode >= 500) {
      httpLogger.error(logData, `❌ ${req.method} ${req.url} - ${res.statusCode}`);
    } else if (res.statusCode >= 400) {
      httpLogger.warn(logData, `⚠️ ${req.method} ${req.url} - ${res.statusCode}`);
    } else {
      httpLogger.info(logData, `✅ ${req.method} ${req.url} - ${res.statusCode}`);
    }
  });

  next();
}

// ============================================
// PROMETHEUS - Metrics
// ============================================

// Habilitar métricas por defecto
promClient.collectDefaultMetrics({
  prefix: 'vertice_',
  labels: { app: 'vertice-gastronomico' }
});

// Métricas personalizadas
export const metrics = {
  // Contador de requests HTTP
  httpRequestsTotal: new promClient.Counter({
    name: 'vertice_http_requests_total',
    help: 'Total de requests HTTP',
    labelNames: ['method', 'path', 'status']
  }),

  // Histograma de duración de requests
  httpRequestDuration: new promClient.Histogram({
    name: 'vertice_http_request_duration_seconds',
    help: 'Duración de requests HTTP en segundos',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
  }),

  // Contador de requests a AI
  aiRequestsTotal: new promClient.Counter({
    name: 'vertice_ai_requests_total',
    help: 'Total de requests a modelos AI',
    labelNames: ['provider', 'model', 'agent']
  }),

  // Histograma de duración de requests AI
  aiRequestDuration: new promClient.Histogram({
    name: 'vertice_ai_request_duration_seconds',
    help: 'Duración de requests AI en segundos',
    labelNames: ['provider', 'model'],
    buckets: [0.5, 1, 2, 5, 10, 30, 60]
  }),

  // Contador de tokens usados
  aiTokensUsed: new promClient.Counter({
    name: 'vertice_ai_tokens_total',
    help: 'Total de tokens usados',
    labelNames: ['provider', 'type'] // type: input, output
  }),

  // Gauge de usuarios activos
  activeUsers: new promClient.Gauge({
    name: 'vertice_active_users',
    help: 'Número de usuarios activos'
  }),

  // Gauge de conexiones de base de datos
  dbConnections: new promClient.Gauge({
    name: 'vertice_db_connections',
    help: 'Conexiones activas a la base de datos'
  }),

  // Contador de errores
  errorsTotal: new promClient.Counter({
    name: 'vertice_errors_total',
    help: 'Total de errores',
    labelNames: ['type', 'component']
  }),

  // Gauge de cache hits/misses
  cacheHits: new promClient.Counter({
    name: 'vertice_cache_hits_total',
    help: 'Total de cache hits'
  }),

  cacheMisses: new promClient.Counter({
    name: 'vertice_cache_misses_total',
    help: 'Total de cache misses'
  }),

  // Contador de pagos
  paymentsTotal: new promClient.Counter({
    name: 'vertice_payments_total',
    help: 'Total de pagos procesados',
    labelNames: ['status', 'method']
  }),

  // Gauge de valor de pagos
  paymentsValue: new promClient.Gauge({
    name: 'vertice_payments_value_mxn',
    help: 'Valor total de pagos en MXN'
  })
};

// Middleware para métricas de Prometheus
export function metricsMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;

    const path = req.route?.path || req.path;
    const labels = {
      method: req.method,
      path,
      status: res.statusCode
    };

    metrics.httpRequestsTotal.inc(labels);
    metrics.httpRequestDuration.observe(labels, duration);
  });

  next();
}

// Endpoint para exponer métricas
export async function getMetrics() {
  return {
    contentType: promClient.register.contentType,
    metrics: await promClient.register.metrics()
  };
}

// ============================================
// HEALTH CHECKS
// ============================================

export async function getHealthStatus() {
  const checks = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    services: {}
  };

  // Verificar servicios
  try {
    // Aquí se agregarían checks de DB, Redis, etc.
    checks.services.api = 'healthy';
  } catch (error) {
    checks.services.api = 'unhealthy';
  }

  return checks;
}

// ============================================
// EXPORTAR TODO
// ============================================

export default {
  // Sentry
  initSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  sentryErrorHandler,

  // Pino
  logger,
  httpLogger,
  aiLogger,
  dbLogger,
  paymentLogger,
  requestLogger,

  // Prometheus
  metrics,
  metricsMiddleware,
  getMetrics,

  // Health
  getHealthStatus
};
