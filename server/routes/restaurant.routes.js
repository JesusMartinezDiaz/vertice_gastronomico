/**
 * Rutas de Restaurantes - Vértice Gastronómico
 * CRUD completo para gestión de restaurantes
 */

import express from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

/**
 * GET /api/restaurants
 * Obtener todos los restaurantes del usuario
 */
router.get('/', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: req.user.id },
      include: {
        settings: true,
        _count: {
          select: {
            menuItems: true,
            orders: true,
            inventory: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('Error obteniendo restaurantes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener restaurantes',
      message: error.message
    });
  }
});

/**
 * GET /api/restaurants/:id
 * Obtener un restaurante específico
 */
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      },
      include: {
        settings: true,
        categories: {
          include: {
            items: true
          }
        },
        _count: {
          select: {
            menuItems: true,
            orders: true,
            inventory: true,
            suppliers: true
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error obteniendo restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener restaurante',
      message: error.message
    });
  }
});

/**
 * POST /api/restaurants
 * Crear un nuevo restaurante
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      country = 'México',
      zipCode,
      phone,
      email,
      website,
      timezone = 'America/Mexico_City',
      currency = 'MXN'
    } = req.body;

    // Validaciones
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'El nombre del restaurante es requerido (mínimo 2 caracteres)'
      });
    }

    // Generar slug único
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Verificar si el slug existe
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.restaurant.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear restaurante con configuración por defecto
    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        slug,
        description,
        address,
        city,
        state,
        country,
        zipCode,
        phone,
        email,
        website,
        timezone,
        currency,
        ownerId: req.user.id,
        settings: {
          create: {
            taxRate: 16.0,
            deliveryEnabled: false,
            pickupEnabled: true,
            reservations: true,
            tipSuggestions: [10, 15, 20],
            openingHours: {
              monday: { open: '09:00', close: '22:00', closed: false },
              tuesday: { open: '09:00', close: '22:00', closed: false },
              wednesday: { open: '09:00', close: '22:00', closed: false },
              thursday: { open: '09:00', close: '22:00', closed: false },
              friday: { open: '09:00', close: '23:00', closed: false },
              saturday: { open: '09:00', close: '23:00', closed: false },
              sunday: { open: '10:00', close: '21:00', closed: false }
            }
          }
        }
      },
      include: {
        settings: true
      }
    });

    res.status(201).json({
      success: true,
      data: restaurant,
      message: 'Restaurante creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear restaurante',
      message: error.message
    });
  }
});

/**
 * PUT /api/restaurants/:id
 * Actualizar un restaurante
 */
router.put('/:id', async (req, res) => {
  try {
    // Verificar propiedad
    const existing = await prisma.restaurant.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }

    const {
      name,
      description,
      address,
      city,
      state,
      country,
      zipCode,
      phone,
      email,
      website,
      logo,
      coverImage,
      timezone,
      currency,
      isActive,
      settings
    } = req.body;

    // Actualizar restaurante
    const restaurant = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(country && { country }),
        ...(zipCode !== undefined && { zipCode }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(logo !== undefined && { logo }),
        ...(coverImage !== undefined && { coverImage }),
        ...(timezone && { timezone }),
        ...(currency && { currency }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        settings: true
      }
    });

    // Actualizar settings si se proporcionan
    if (settings) {
      await prisma.restaurantSettings.update({
        where: { restaurantId: req.params.id },
        data: settings
      });
    }

    res.json({
      success: true,
      data: restaurant,
      message: 'Restaurante actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar restaurante',
      message: error.message
    });
  }
});

/**
 * DELETE /api/restaurants/:id
 * Eliminar un restaurante (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    // Verificar propiedad
    const existing = await prisma.restaurant.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }

    // Soft delete - solo desactivar
    await prisma.restaurant.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Restaurante eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar restaurante',
      message: error.message
    });
  }
});

/**
 * GET /api/restaurants/:id/stats
 * Obtener estadísticas del restaurante
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Verificar propiedad
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: req.user.id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }

    // Obtener estadísticas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      menuItemsCount,
      inventoryCount,
      lowStockItems
    ] = await Promise.all([
      prisma.order.count({ where: { restaurantId } }),
      prisma.order.count({
        where: {
          restaurantId,
          createdAt: { gte: today }
        }
      }),
      prisma.order.aggregate({
        where: { restaurantId, status: 'COMPLETED' },
        _sum: { total: true }
      }),
      prisma.menuItem.count({ where: { restaurantId, isActive: true } }),
      prisma.inventoryItem.count({ where: { restaurantId } }),
      prisma.inventoryItem.count({
        where: {
          restaurantId,
          quantity: { lte: prisma.inventoryItem.fields.minStock }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        orders: {
          total: totalOrders,
          today: todayOrders
        },
        revenue: {
          total: totalRevenue._sum.total || 0
        },
        menu: {
          activeItems: menuItemsCount
        },
        inventory: {
          totalItems: inventoryCount,
          lowStock: lowStockItems
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
});

export default router;
