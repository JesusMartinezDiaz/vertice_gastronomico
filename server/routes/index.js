/**
 * Índice de Rutas - Vértice Gastronómico
 * Centraliza todas las rutas de la API
 */

import express from 'express';
import authRoutes from './auth.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import restaurantRoutes from './restaurant.routes.js';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';
import inventoryRoutes from './inventory.routes.js';
import reportRoutes from './report.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});

// Montar rutas
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);
router.use('/upload', uploadRoutes);

// Info de la API
router.get('/', (req, res) => {
  res.json({
    name: 'Vértice Gastronómico API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      subscriptions: '/api/subscriptions',
      restaurants: '/api/restaurants',
      menu: '/api/menu',
      orders: '/api/orders',
      inventory: '/api/inventory',
      reports: '/api/reports',
      upload: '/api/upload',
      health: '/api/health'
    }
  });
});

export default router;
