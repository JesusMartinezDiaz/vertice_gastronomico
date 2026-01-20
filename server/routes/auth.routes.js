/**
 * Rutas de Autenticación
 * Vértice Gastronómico
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import authService from '../services/auth.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { logger } from '../services/monitoring.service.js';
import emailService from '../services/email.service.js';

const router = express.Router();

// Validaciones
const registerValidation = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('phone')
    .optional()
    .isMobilePhone('es-MX').withMessage('Número de teléfono inválido')
];

const loginValidation = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
];

// Middleware de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: errors.array()
    });
  }
  next();
};

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', registerValidation, validate, async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const result = await authService.registerUser({
      email,
      password,
      name,
      phone
    });

    // Enviar email de bienvenida
    await emailService.sendWelcomeEmail(result.user);

    logger.info({ userId: result.user.id, email }, 'Usuario registrado');

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result
    });
  } catch (error) {
    logger.error({ error: error.message, email: req.body.email }, 'Error en registro');

    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({
        error: 'Conflicto',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Error interno',
      message: 'No se pudo completar el registro'
    });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    logger.info({ userId: result.user.id, email }, 'Usuario logueado');

    res.json({
      success: true,
      message: 'Sesión iniciada exitosamente',
      data: result
    });
  } catch (error) {
    logger.warn({ error: error.message, email: req.body.email }, 'Error en login');

    res.status(401).json({
      error: 'Autenticación fallida',
      message: 'Credenciales inválidas'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Renovar tokens
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Token requerido',
        message: 'Se requiere el refresh token'
      });
    }

    const tokens = await authService.refreshTokens(refreshToken);

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    logger.warn({ error: error.message }, 'Error renovando tokens');

    res.status(401).json({
      error: 'Token inválido',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    await authService.logoutUser(req.user.id, refreshToken);

    logger.info({ userId: req.user.id }, 'Usuario deslogueado');

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener usuario actual
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { prisma } = await import('../config/database.js');

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Usuario no encontrado'
      });
    }

    // Obtener suscripción
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    });

    res.json({
      success: true,
      data: {
        user,
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd
        } : {
          plan: 'FREE',
          status: 'ACTIVE'
        }
      }
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error obteniendo usuario');
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

/**
 * PUT /api/auth/me
 * Actualizar perfil
 */
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const { prisma } = await import('../config/database.js');

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error actualizando perfil');
    res.status(500).json({
      error: 'Error interno'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Cambiar contraseña
 */
router.post('/change-password', requireAuth, [
  body('currentPassword').notEmpty(),
  body('newPassword')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/)
], validate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, currentPassword, newPassword);

    logger.info({ userId: req.user.id }, 'Contraseña cambiada');

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    logger.warn({ error: error.message, userId: req.user.id }, 'Error cambiando contraseña');

    res.status(400).json({
      error: 'Error',
      message: error.message
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Solicitar reset de contraseña
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], validate, async (req, res) => {
  try {
    const { email } = req.body;
    const { prisma } = await import('../config/database.js');

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      const result = await authService.requestPasswordReset(email);

      // Enviar email
      await emailService.sendPasswordResetEmail(user, result.resetToken);
    }

    // Siempre responder igual (seguridad)
    res.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error en forgot-password');

    res.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Restablecer contraseña con token
 */
router.post('/reset-password', [
  body('token').notEmpty(),
  body('newPassword')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/)
], validate, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });
  } catch (error) {
    logger.warn({ error: error.message }, 'Error en reset-password');

    res.status(400).json({
      error: 'Token inválido',
      message: 'El enlace ha expirado o es inválido'
    });
  }
});

export default router;
