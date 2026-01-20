/**
 * Servicio de Autenticación - JWT + Passport
 * Vértice Gastronómico
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';

// Configuración JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'vertice-gastronomico-secret-key-2024',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  issuer: 'vertice-gastronomico',
  audience: 'vertice-users'
};

const SALT_ROUNDS = 12;

// Configurar estrategias de Passport
export function configurePassport() {
  // Estrategia Local (email/password)
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        });

        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        if (!user.isActive) {
          return done(null, false, { message: 'Cuenta desactivada' });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Actualizar último login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Estrategia JWT
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONFIG.secret,
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    },
    async (payload, done) => {
      try {
        // Verificar en cache primero
        const cachedUser = await cache.get(`user:${payload.sub}`);
        if (cachedUser) {
          return done(null, cachedUser);
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            avatar: true
          }
        });

        if (!user || !user.isActive) {
          return done(null, false);
        }

        // Guardar en cache por 5 minutos
        await cache.set(`user:${user.id}`, user, 300);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialización para sesiones
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Generar Access Token
export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access'
    },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.accessTokenExpiry,
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    }
  );
}

// Generar Refresh Token
export function generateRefreshToken(user) {
  const token = jwt.sign(
    {
      sub: user.id,
      type: 'refresh'
    },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.refreshTokenExpiry,
      issuer: JWT_CONFIG.issuer
    }
  );

  // Guardar en Redis para invalidación
  cache.set(`refresh:${user.id}:${token}`, true, 7 * 24 * 60 * 60);

  return token;
}

// Verificar token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    });
  } catch (error) {
    return null;
  }
}

// Registrar usuario
export async function registerUser(data) {
  const { email, password, name, phone } = data;

  // Verificar si ya existe
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existing) {
    throw new Error('El email ya está registrado');
  }

  // Hash de contraseña
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone,
      role: 'USER'
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  // Generar tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutos
    }
  };
}

// Login
export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  if (!user.isActive) {
    throw new Error('Cuenta desactivada');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Credenciales inválidas');
  }

  // Actualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 900
    }
  };
}

// Refresh tokens
export async function refreshTokens(refreshToken) {
  const decoded = verifyToken(refreshToken);

  if (!decoded || decoded.type !== 'refresh') {
    throw new Error('Token de refresco inválido');
  }

  // Verificar que el token existe en Redis
  const exists = await cache.exists(`refresh:${decoded.sub}:${refreshToken}`);
  if (!exists) {
    throw new Error('Token de refresco revocado');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub }
  });

  if (!user || !user.isActive) {
    throw new Error('Usuario no encontrado o inactivo');
  }

  // Invalidar token anterior
  await cache.del(`refresh:${decoded.sub}:${refreshToken}`);

  // Generar nuevos tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: 900
  };
}

// Logout (invalidar tokens)
export async function logoutUser(userId, refreshToken) {
  // Invalidar refresh token específico
  if (refreshToken) {
    await cache.del(`refresh:${userId}:${refreshToken}`);
  }

  // Limpiar cache del usuario
  await cache.del(`user:${userId}`);

  return true;
}

// Cambiar contraseña
export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error('Contraseña actual incorrecta');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash }
  });

  // Invalidar todos los refresh tokens
  await cache.delPattern(`refresh:${userId}:*`);

  return true;
}

// Solicitar reset de contraseña
export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    // No revelar si el usuario existe
    return true;
  }

  // Generar token de reset
  const resetToken = jwt.sign(
    { sub: user.id, type: 'reset' },
    JWT_CONFIG.secret,
    { expiresIn: '1h' }
  );

  // Guardar en Redis
  await cache.set(`reset:${resetToken}`, user.id, 3600);

  // Aquí se enviaría el email con el token
  // emailService.sendPasswordReset(user.email, resetToken);

  return { resetToken }; // En producción no retornar el token
}

// Reset de contraseña
export async function resetPassword(resetToken, newPassword) {
  const userId = await cache.get(`reset:${resetToken}`);

  if (!userId) {
    throw new Error('Token de reset inválido o expirado');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash }
  });

  // Invalidar token y sesiones
  await cache.del(`reset:${resetToken}`);
  await cache.delPattern(`refresh:${userId}:*`);

  return true;
}

export default {
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
};
