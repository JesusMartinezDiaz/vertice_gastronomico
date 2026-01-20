/**
 * Servicio de Colas de Trabajo - BullMQ
 * Vértice Gastronómico
 */

import { Queue, Worker, QueueScheduler } from 'bullmq';
import Redis from 'ioredis';
import { logger } from './monitoring.service.js';

// Conexión Redis para BullMQ
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null
});

// Configuración común de colas
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  },
  removeOnComplete: {
    count: 1000,
    age: 24 * 60 * 60 // 24 horas
  },
  removeOnFail: {
    count: 5000
  }
};

// ============================================
// DEFINICIÓN DE COLAS
// ============================================

// Cola para procesamiento de AI
export const aiQueue = new Queue('ai-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    timeout: 120000 // 2 minutos para AI
  }
});

// Cola para envío de emails
export const emailQueue = new Queue('email-sending', {
  connection: redisConnection,
  defaultJobOptions
});

// Cola para notificaciones SMS/WhatsApp
export const notificationQueue = new Queue('notifications', {
  connection: redisConnection,
  defaultJobOptions
});

// Cola para generación de reportes
export const reportQueue = new Queue('report-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    timeout: 300000 // 5 minutos para reportes
  }
});

// Cola para webhooks
export const webhookQueue = new Queue('webhooks', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 5
  }
});

// Cola para tareas programadas
export const scheduledQueue = new Queue('scheduled-tasks', {
  connection: redisConnection,
  defaultJobOptions
});

// Cola para auditoría
export const auditQueue = new Queue('audit-logs', {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 1 // No reintentar auditoría
  }
});

// ============================================
// FUNCIONES PARA AGREGAR TRABAJOS
// ============================================

// Procesar instrucción de AI
export async function queueAIProcessing(data) {
  return aiQueue.add('process-instruction', data, {
    priority: data.priority || 2
  });
}

// Enviar email
export async function queueEmail(type, data) {
  return emailQueue.add(`email-${type}`, data);
}

// Enviar notificación
export async function queueNotification(channel, data) {
  return notificationQueue.add(`notify-${channel}`, data);
}

// Generar reporte
export async function queueReportGeneration(reportType, data) {
  return reportQueue.add(`generate-${reportType}`, data);
}

// Enviar webhook
export async function queueWebhook(url, payload, options = {}) {
  return webhookQueue.add('send-webhook', {
    url,
    payload,
    ...options
  });
}

// Programar tarea
export async function scheduleTask(taskName, data, cronExpression) {
  return scheduledQueue.add(taskName, data, {
    repeat: { cron: cronExpression }
  });
}

// Registrar auditoría
export async function queueAuditLog(action, entity, data) {
  return auditQueue.add('log-audit', {
    action,
    entity,
    data,
    timestamp: new Date().toISOString()
  });
}

// ============================================
// WORKERS
// ============================================

// Worker para emails
export function createEmailWorker(emailService) {
  return new Worker('email-sending', async (job) => {
    const { type, to, subject, data } = job.data;
    logger.info({ jobId: job.id, type, to }, 'Procesando email');

    switch (type) {
      case 'welcome':
        return emailService.sendWelcomeEmail(data.user);
      case 'password-reset':
        return emailService.sendPasswordResetEmail(data.user, data.token);
      case 'subscription':
        return emailService.sendSubscriptionEmail(data.user, data.plan, data.nextBillingDate);
      case 'alert':
        return emailService.sendAlertEmail(data.user, data.alert);
      case 'report':
        return emailService.sendReportReadyEmail(data.user, data.report);
      default:
        return emailService.sendEmail(to, subject, data.html);
    }
  }, {
    connection: redisConnection,
    concurrency: 5
  });
}

// Worker para notificaciones
export function createNotificationWorker(twilioService) {
  return new Worker('notifications', async (job) => {
    const { channel, to, template, data } = job.data;
    logger.info({ jobId: job.id, channel, to }, 'Procesando notificación');

    return twilioService.sendTemplateMessage(channel, template, to, data);
  }, {
    connection: redisConnection,
    concurrency: 10
  });
}

// Worker para reportes
export function createReportWorker(reportGenerator) {
  return new Worker('report-generation', async (job) => {
    const { type, restaurantId, userId, period, options } = job.data;
    logger.info({ jobId: job.id, type, restaurantId }, 'Generando reporte');

    const report = await reportGenerator.generate(type, {
      restaurantId,
      userId,
      period,
      options
    });

    // Notificar que el reporte está listo
    await queueEmail('report', {
      userId,
      report
    });

    return report;
  }, {
    connection: redisConnection,
    concurrency: 2
  });
}

// Worker para webhooks
export function createWebhookWorker() {
  return new Worker('webhooks', async (job) => {
    const { url, payload, headers = {} } = job.data;
    logger.info({ jobId: job.id, url }, 'Enviando webhook');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vertice-Webhook': 'true',
        ...headers
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return { status: response.status };
  }, {
    connection: redisConnection,
    concurrency: 5
  });
}

// Worker para auditoría
export function createAuditWorker(prisma) {
  return new Worker('audit-logs', async (job) => {
    const { action, entity, data, timestamp } = job.data;

    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId: data.entityId,
        userId: data.userId,
        metadata: data.metadata,
        ipAddress: data.ipAddress,
        createdAt: new Date(timestamp)
      }
    });
  }, {
    connection: redisConnection,
    concurrency: 10
  });
}

// ============================================
// MONITOREO DE COLAS
// ============================================

export async function getQueueStats() {
  const queues = [
    { name: 'ai-processing', queue: aiQueue },
    { name: 'email-sending', queue: emailQueue },
    { name: 'notifications', queue: notificationQueue },
    { name: 'report-generation', queue: reportQueue },
    { name: 'webhooks', queue: webhookQueue },
    { name: 'scheduled-tasks', queue: scheduledQueue },
    { name: 'audit-logs', queue: auditQueue }
  ];

  const stats = {};

  for (const { name, queue } of queues) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount()
    ]);

    stats[name] = { waiting, active, completed, failed, delayed };
  }

  return stats;
}

// Limpiar trabajos completados/fallidos
export async function cleanQueues(olderThan = 24 * 60 * 60 * 1000) {
  const queues = [aiQueue, emailQueue, notificationQueue, reportQueue, webhookQueue, auditQueue];

  for (const queue of queues) {
    await queue.clean(olderThan, 'completed');
    await queue.clean(olderThan, 'failed');
  }
}

// Pausar/reanudar cola
export async function pauseQueue(queueName) {
  const queueMap = {
    'ai-processing': aiQueue,
    'email-sending': emailQueue,
    'notifications': notificationQueue,
    'report-generation': reportQueue,
    'webhooks': webhookQueue,
    'scheduled-tasks': scheduledQueue,
    'audit-logs': auditQueue
  };

  const queue = queueMap[queueName];
  if (queue) {
    await queue.pause();
    return true;
  }
  return false;
}

export async function resumeQueue(queueName) {
  const queueMap = {
    'ai-processing': aiQueue,
    'email-sending': emailQueue,
    'notifications': notificationQueue,
    'report-generation': reportQueue,
    'webhooks': webhookQueue,
    'scheduled-tasks': scheduledQueue,
    'audit-logs': auditQueue
  };

  const queue = queueMap[queueName];
  if (queue) {
    await queue.resume();
    return true;
  }
  return false;
}

export default {
  // Colas
  aiQueue,
  emailQueue,
  notificationQueue,
  reportQueue,
  webhookQueue,
  scheduledQueue,
  auditQueue,

  // Funciones para agregar trabajos
  queueAIProcessing,
  queueEmail,
  queueNotification,
  queueReportGeneration,
  queueWebhook,
  scheduleTask,
  queueAuditLog,

  // Workers
  createEmailWorker,
  createNotificationWorker,
  createReportWorker,
  createWebhookWorker,
  createAuditWorker,

  // Monitoreo
  getQueueStats,
  cleanQueues,
  pauseQueue,
  resumeQueue
};
