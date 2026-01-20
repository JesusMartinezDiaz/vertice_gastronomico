/**
 * Middleware de Autenticación
 * Vértice Gastronómico
 */

import passport from 'passport';
import { verifyToken } from '../services/auth.service.js';
import { cache } from '../config/redis.js';
import { logger } from '../services/monitoring.service.js';

// Autenticación JWT requerida
export const requireAuth = passport.authenticate('jwt', { session: false });

// Alias para compatibilidad con rutas existentes
export const authenticateToken = requireAuth;

// Autenticación JWT opcional (no falla si no hay token)
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (decoded) {
    req.user = decoded;
  }

  next();
}

// Verificar rol específico
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn({
        userId: req.user.id,
        role: req.user.role,
        required: allowedRoles,
        path: req.path
      }, 'Acceso denegado por rol insuficiente');

      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
}

// Verificar que sea admin
export const requireAdmin = requireRole('ADMIN');

// Verificar que sea manager o superior
export const requireManager = requireRole('ADMIN', 'MANAGER');

// Verificar propiedad del recurso
export function requireOwnership(getResourceOwnerId) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autorizado'
      });
    }

    // Los admins pueden acceder a todo
    if (req.user.role === 'ADMIN') {
      return next();
    }

    try {
      const ownerId = await getResourceOwnerId(req);

      if (ownerId !== req.user.id) {
        logger.warn({
          userId: req.user.id,
          ownerId,
          path: req.path
        }, 'Intento de acceso a recurso de otro usuario');

        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permisos para acceder a este recurso'
        });
      }

      next();
    } catch (error) {
      logger.error({ error: error.message }, 'Error verificando ownership');
      return res.status(500).json({
        error: 'Error interno'
      });
    }
  };
}

// Rate limiting por usuario
export function userRateLimit(maxRequests = 100, windowMs = 60000) {
  return async (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const key = `ratelimit:user:${userId}`;

    try {
      const current = await cache.incr(key);

      // Establecer TTL si es el primer request
      if (current === 1) {
        await cache.set(key, 1, Math.ceil(windowMs / 1000));
      }

      // Agregar headers de rate limit
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

      if (current > maxRequests) {
        logger.warn({
          userId,
          current,
          limit: maxRequests
        }, 'Rate limit excedido');

        return res.status(429).json({
          error: 'Demasiadas solicitudes',
          message: 'Has excedido el límite de solicitudes. Intenta de nuevo en un momento.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      next();
    } catch (error) {
      // Si Redis falla, permitir el request
      next();
    }
  };
}

// Verificar suscripción activa
export function requireSubscription(...allowedPlans) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autorizado'
      });
    }

    try {
      // Verificar cache primero
      const cachedSub = await cache.get(`subscription:${req.user.id}`);

      let subscription;
      if (cachedSub) {
        subscription = cachedSub;
      } else {
        // Importar dinámicamente para evitar dependencia circular
        const { prisma } = await import('../config/database.js');
        subscription = await prisma.subscription.findFirst({
          where: { userId: req.user.id }
        });

        // Cachear por 5 minutos
        if (subscription) {
          await cache.set(`subscription:${req.user.id}`, subscription, 300);
        }
      }

      // Plan gratuito por defecto
      const currentPlan = subscription?.plan || 'FREE';
      const isActive = !subscription || subscription.status === 'ACTIVE';

      if (!isActive) {
        return res.status(403).json({
          error: 'Suscripción inactiva',
          message: 'Tu suscripción ha expirado o está inactiva',
          code: 'SUBSCRIPTION_INACTIVE'
        });
      }

      if (allowedPlans.length > 0 && !allowedPlans.includes(currentPlan)) {
        return res.status(403).json({
          error: 'Plan insuficiente',
          message: `Esta funcionalidad requiere un plan: ${allowedPlans.join(' o ')}`,
          code: 'PLAN_REQUIRED',
          currentPlan,
          requiredPlans: allowedPlans
        });
      }

      // Agregar info de suscripción al request
      req.subscription = {
        plan: currentPlan,
        status: subscription?.status || 'ACTIVE'
      };

      next();
    } catch (error) {
      logger.error({ error: error.message }, 'Error verificando suscripción');
      // En caso de error, permitir acceso básico
      req.subscription = { plan: 'FREE', status: 'ACTIVE' };
      next();
    }
  };
}

// Verificar límites del plan
export function checkPlanLimits(limitType) {
  return async (req, res, next) => {
    const plan = req.subscription?.plan || 'FREE';

    const limits = {
      FREE: {
        restaurants: 1,
        agents: 3,
        queriesPerMonth: 100,
        reports: 0
      },
      STARTER: {
        restaurants: 3,
        agents: 20,
        queriesPerMonth: 1000,
        reports: 10
      },
      PROFESSIONAL: {
        restaurants: 10,
        agents: 50,
        queriesPerMonth: 10000,
        reports: 100
      },
      ENTERPRISE: {
        restaurants: Infinity,
        agents: 72,
        queriesPerMonth: Infinity,
        reports: Infinity
      }
    };

    const planLimits = limits[plan] || limits.FREE;
    const limit = planLimits[limitType];

    if (limit === undefined) {
      return next();
    }

    // Verificar uso actual
    try {
      const usageKey = `usage:${req.user.id}:${limitType}`;
      const currentUsage = await cache.get(usageKey) || 0;

      if (currentUsage >= limit) {
        return res.status(403).json({
          error: 'Límite alcanzado',
          message: `Has alcanzado el límite de ${limitType} para tu plan (${limit})`,
          code: 'LIMIT_REACHED',
          limit,
          current: currentUsage,
          plan
        });
      }

      // Incrementar uso
      await cache.set(usageKey, currentUsage + 1, 30 * 24 * 60 * 60); // 30 días

      next();
    } catch (error) {
      next();
    }
  };
}

// API Key authentication
export function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      error: 'API Key requerida',
      message: 'Incluye tu API Key en el header X-Api-Key'
    });
  }

  // Validar API Key
  // En producción, esto consultaría la base de datos
  if (apiKey !== process.env.API_KEY) {
    logger.warn({ apiKey: apiKey.substring(0, 8) + '...' }, 'API Key inválida');

    return res.status(401).json({
      error: 'API Key inválida'
    });
  }

  next();
}

export default {
  requireAuth,
  authenticateToken,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireManager,
  requireOwnership,
  userRateLimit,
  requireSubscription,
  checkPlanLimits,
  requireApiKey
};
