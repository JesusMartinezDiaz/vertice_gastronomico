/**
 * Rutas de Menú - Vértice Gastronómico
 * CRUD para categorías e items del menú
 */

import express from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// ============================================
// CATEGORÍAS DEL MENÚ
// ============================================

/**
 * GET /api/menu/categories/:restaurantId
 * Obtener categorías de un restaurante
 */
router.get('/categories/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Verificar acceso al restaurante
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { name: 'asc' }
        },
        _count: { select: { items: true } }
      },
      orderBy: { displayOrder: 'asc' }
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/menu/categories
 * Crear nueva categoría
 */
router.post('/categories', async (req, res) => {
  try {
    const { restaurantId, name, description, displayOrder = 0 } = req.body;

    // Verificar acceso
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const category = await prisma.menuCategory.create({
      data: { name, description, displayOrder, restaurantId }
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/menu/categories/:id
 * Actualizar categoría
 */
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.menuCategory.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true }
    });

    if (!category || category.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }

    const { name, description, displayOrder, isActive } = req.body;

    const updated = await prisma.menuCategory.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/menu/categories/:id
 */
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.menuCategory.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true }
    });

    if (!category || category.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }

    await prisma.menuCategory.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ITEMS DEL MENÚ
// ============================================

/**
 * GET /api/menu/items/:restaurantId
 * Obtener items del menú
 */
router.get('/items/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { categoryId, isActive, search } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const where = {
      restaurantId,
      ...(categoryId && { categoryId }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const items = await prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: [{ category: { displayOrder: 'asc' } }, { name: 'asc' }]
    });

    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    console.error('Error obteniendo items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/menu/items/:restaurantId/:id
 * Obtener un item específico
 */
router.get('/items/:restaurantId/:id', async (req, res) => {
  try {
    const item = await prisma.menuItem.findFirst({
      where: {
        id: req.params.id,
        restaurantId: req.params.restaurantId
      },
      include: {
        category: true,
        recipes: {
          include: {
            ingredients: {
              include: { inventory: true }
            }
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error obteniendo item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/menu/items
 * Crear nuevo item del menú
 */
router.post('/items', async (req, res) => {
  try {
    const {
      restaurantId,
      categoryId,
      name,
      description,
      price,
      cost,
      image,
      preparationTime,
      calories,
      allergens = [],
      tags = []
    } = req.body;

    // Validaciones
    if (!restaurantId || !categoryId || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: restaurantId, categoryId, name, price'
      });
    }

    // Verificar acceso
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Verificar categoría
    const category = await prisma.menuCategory.findFirst({
      where: { id: categoryId, restaurantId }
    });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        image,
        preparationTime,
        calories,
        allergens,
        tags,
        categoryId,
        restaurantId
      },
      include: { category: true }
    });

    // Calcular margen si hay costo
    const margin = item.cost ? ((item.price - item.cost) / item.price * 100).toFixed(1) : null;

    res.status(201).json({
      success: true,
      data: { ...item, margin },
      message: 'Item creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/menu/items/:id
 * Actualizar item del menú
 */
router.put('/items/:id', async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true }
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    const {
      name,
      description,
      price,
      cost,
      image,
      isActive,
      isAvailable,
      preparationTime,
      calories,
      allergens,
      tags,
      categoryId
    } = req.body;

    const updated = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(cost !== undefined && { cost: cost ? parseFloat(cost) : null }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(preparationTime !== undefined && { preparationTime }),
        ...(calories !== undefined && { calories }),
        ...(allergens && { allergens }),
        ...(tags && { tags }),
        ...(categoryId && { categoryId })
      },
      include: { category: true }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/menu/items/:id
 */
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true }
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    await prisma.menuItem.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'Item eliminado' });
  } catch (error) {
    console.error('Error eliminando item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/menu/items/:id/toggle-availability
 * Cambiar disponibilidad rápida
 */
router.post('/items/:id/toggle-availability', async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true }
    });

    if (!item || item.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    const updated = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: { isAvailable: !item.isAvailable }
    });

    res.json({
      success: true,
      data: updated,
      message: `${updated.name} ahora está ${updated.isAvailable ? 'disponible' : 'no disponible'}`
    });
  } catch (error) {
    console.error('Error cambiando disponibilidad:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/menu/analysis/:restaurantId
 * Análisis del menú (food cost, márgenes, popularidad)
 */
router.get('/analysis/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const items = await prisma.menuItem.findMany({
      where: { restaurantId, isActive: true },
      include: {
        category: true,
        orderItems: {
          select: { quantity: true, subtotal: true }
        }
      }
    });

    const analysis = items.map(item => {
      const totalSold = item.orderItems.reduce((sum, oi) => sum + oi.quantity, 0);
      const totalRevenue = item.orderItems.reduce((sum, oi) => sum + oi.subtotal, 0);
      const margin = item.cost ? ((item.price - item.cost) / item.price * 100) : null;
      const foodCost = item.cost ? (item.cost / item.price * 100) : null;

      return {
        id: item.id,
        name: item.name,
        category: item.category.name,
        price: item.price,
        cost: item.cost,
        margin: margin?.toFixed(1),
        foodCost: foodCost?.toFixed(1),
        totalSold,
        totalRevenue,
        isAvailable: item.isAvailable
      };
    });

    // Ordenar por ventas
    analysis.sort((a, b) => b.totalSold - a.totalSold);

    // Estadísticas generales
    const stats = {
      totalItems: items.length,
      itemsWithCost: items.filter(i => i.cost).length,
      avgMargin: analysis.filter(a => a.margin).reduce((sum, a) => sum + parseFloat(a.margin), 0) / analysis.filter(a => a.margin).length || 0,
      avgFoodCost: analysis.filter(a => a.foodCost).reduce((sum, a) => sum + parseFloat(a.foodCost), 0) / analysis.filter(a => a.foodCost).length || 0,
      topSellers: analysis.slice(0, 5),
      lowMargin: analysis.filter(a => a.margin && parseFloat(a.margin) < 50).slice(0, 5),
      unavailable: items.filter(i => !i.isAvailable).length
    };

    res.json({ success: true, data: { items: analysis, stats } });
  } catch (error) {
    console.error('Error en análisis de menú:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
