/**
 * Configuración de Redis - Cache y Sesiones
 * Vértice Gastronómico
 */

import Redis from 'ioredis';

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  connectTimeout: 10000,
};

// Cliente principal
export const redis = new Redis(REDIS_CONFIG);

// Cliente para suscripciones
export const redisSub = new Redis(REDIS_CONFIG);

// Manejo de eventos
redis.on('connect', () => {
  console.log('✅ Redis conectado');
});

redis.on('error', (error) => {
  console.error('❌ Redis error:', error.message);
});

redis.on('ready', () => {
  console.log('🚀 Redis listo para recibir comandos');
});

// Funciones de utilidad para cache
export const cache = {
  // Obtener valor con parse automático
  async get(key) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  // Guardar valor con stringify automático
  async set(key, value, ttlSeconds = 3600) {
    try {
      const stringValue = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  // Eliminar clave
  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch {
      return false;
    }
  },

  // Eliminar por patrón
  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return keys.length;
    } catch {
      return 0;
    }
  },

  // Incrementar contador
  async incr(key) {
    return redis.incr(key);
  },

  // Obtener TTL
  async ttl(key) {
    return redis.ttl(key);
  },

  // Verificar existencia
  async exists(key) {
    const result = await redis.exists(key);
    return result === 1;
  },

  // Hash operations
  async hset(key, field, value) {
    return redis.hset(key, field, JSON.stringify(value));
  },

  async hget(key, field) {
    const value = await redis.hget(key, field);
    return value ? JSON.parse(value) : null;
  },

  async hgetall(key) {
    const data = await redis.hgetall(key);
    const result = {};
    for (const [k, v] of Object.entries(data)) {
      try {
        result[k] = JSON.parse(v);
      } catch {
        result[k] = v;
      }
    }
    return result;
  },

  // Listas para colas
  async lpush(key, value) {
    return redis.lpush(key, JSON.stringify(value));
  },

  async rpop(key) {
    const value = await redis.rpop(key);
    return value ? JSON.parse(value) : null;
  },

  // Sets para datos únicos
  async sadd(key, ...values) {
    return redis.sadd(key, ...values.map(v => JSON.stringify(v)));
  },

  async smembers(key) {
    const members = await redis.smembers(key);
    return members.map(m => {
      try {
        return JSON.parse(m);
      } catch {
        return m;
      }
    });
  }
};

// Función para conectar
export async function connectRedis() {
  try {
    await redis.connect();
    return true;
  } catch (error) {
    console.error('Error conectando a Redis:', error.message);
    return false;
  }
}

// Health check
export async function checkRedisHealth() {
  try {
    const pong = await redis.ping();
    return { status: 'healthy', message: pong };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

// Estadísticas de cache
export async function getCacheStats() {
  try {
    const info = await redis.info('stats');
    const memory = await redis.info('memory');
    const keyspace = await redis.info('keyspace');

    return {
      stats: info,
      memory,
      keyspace,
      connected: redis.status === 'ready'
    };
  } catch (error) {
    return { error: error.message };
  }
}

export default redis;
