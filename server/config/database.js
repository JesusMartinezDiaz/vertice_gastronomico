/**
 * Configuración de Base de Datos - Prisma Client
 * Vértice Gastronómico
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Conexión con retry
export async function connectDatabase(maxRetries = 5) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log('✅ Base de datos PostgreSQL conectada');
      return true;
    } catch (error) {
      retries++;
      console.error(`❌ Error conectando a DB (intento ${retries}/${maxRetries}):`, error.message);

      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * retries));
      }
    }
  }

  console.error('❌ No se pudo conectar a la base de datos después de múltiples intentos');
  return false;
}

// Desconexión limpia
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('📤 Base de datos desconectada');
}

// Health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection OK' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

export default prisma;
