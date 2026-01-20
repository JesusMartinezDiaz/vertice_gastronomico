/**
 * Rutas de Inventario - Vértice Gastronómico
 * CRUD para gestión de inventario y proveedores
 */

import express from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// ============================================
// ITEMS DE INVENTARIO
// ============================================

/**
 * GET /api/inventory/:restaurantId
 * Listar inventario con filtros
 */
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { lowStock, supplierId, search, expiring } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const where = {
      restaurantId,
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    let items = await prisma.inventoryItem.findMany({
      where,
      include: {
        Supplier: true,
        RecipeIngredient: {
          include: {
            Recipe: {
              include: { MenuItem: { select: { name: true } } }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Filtrar por stock bajo
    if (lowStock === 'true') {
      items = items.filter(item => item.quantity <= item.minStock);
    }

    // Filtrar por próximos a expirar (7 días)
    if (expiring === 'true') {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      items = items.filter(item => item.expiresAt && new Date(item.expiresAt) <= weekFromNow);
    }

    // Calcular valor total del inventario
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);

    res.json({
      success: true,
      data: items,
      stats: {
        totalItems: items.length,
        totalValue,
        lowStock: items.filter(i => i.quantity <= i.minStock).length,
        expiringSoon: items.filter(i => {
          if (!i.expiresAt) return false;
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return new Date(i.expiresAt) <= weekFromNow;
        }).length
      }
    });
  } catch (error) {
    console.error('Error obteniendo inventario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/inventory/:restaurantId/:id
 * Obtener item específico
 */
router.get('/:restaurantId/:id', async (req, res) => {
  try {
    const item = await prisma.inventoryItem.findFirst({
      where: {
        id: req.params.id,
        restaurantId: req.params.restaurantId
      },
      include: {
        Supplier: true,
        RecipeIngredient: {
          include: {
            Recipe: {
              include: { MenuItem: true }
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
 * POST /api/inventory
 * Crear nuevo item de inventario
 */
router.post('/', async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      sku,
      unit,
      quantity = 0,
      minStock = 0,
      maxStock,
      costPerUnit,
      supplierId,
      expiresAt
    } = req.body;

    if (!restaurantId || !name || !unit || costPerUnit === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: restaurantId, name, unit, costPerUnit'
      });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Verificar proveedor si se proporciona
    if (supplierId) {
      const supplier = await prisma.supplier.findFirst({
        where: { id: supplierId, restaurantId }
      });
      if (!supplier) {
        return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
      }
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        sku,
        unit,
        quantity: parseFloat(quantity),
        minStock: parseFloat(minStock),
        maxStock: maxStock ? parseFloat(maxStock) : null,
        costPerUnit: parseFloat(costPerUnit),
        supplierId,
        restaurantId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        lastRestocked: quantity > 0 ? new Date() : null
      },
      include: { Supplier: true }
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Item de inventario creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/inventory/:id
 * Actualizar item de inventario
 */
router.put('/:id', async (req, res) => {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
      include: { Restaurant: true }
    });

    if (!item || item.Restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    const {
      name,
      sku,
      unit,
      minStock,
      maxStock,
      costPerUnit,
      supplierId,
      expiresAt
    } = req.body;

    const updated = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(sku !== undefined && { sku }),
        ...(unit && { unit }),
        ...(minStock !== undefined && { minStock: parseFloat(minStock) }),
        ...(maxStock !== undefined && { maxStock: maxStock ? parseFloat(maxStock) : null }),
        ...(costPerUnit !== undefined && { costPerUnit: parseFloat(costPerUnit) }),
        ...(supplierId !== undefined && { supplierId }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null })
      },
      include: { Supplier: true }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/inventory/:id/adjust
 * Ajustar cantidad de inventario
 */
router.post('/:id/adjust', async (req, res) => {
  try {
    const { adjustment, reason } = req.body;

    if (adjustment === undefined || adjustment === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un ajuste válido (positivo o negativo)'
      });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
      include: { Restaurant: true }
    });

    if (!item || item.Restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    const newQuantity = item.quantity + parseFloat(adjustment);

    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'La cantidad resultante no puede ser negativa'
      });
    }

    const updated = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        quantity: newQuantity,
        ...(adjustment > 0 && { lastRestocked: new Date() })
      }
    });

    // Verificar si está bajo mínimo
    const isLowStock = updated.quantity <= updated.minStock;

    res.json({
      success: true,
      data: updated,
      message: `Inventario ajustado: ${adjustment > 0 ? '+' : ''}${adjustment} ${item.unit}`,
      warning: isLowStock ? `⚠️ Stock bajo: ${updated.quantity} ${updated.unit} (mínimo: ${updated.minStock})` : null
    });
  } catch (error) {
    console.error('Error ajustando inventario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/inventory/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
      include: { Restaurant: true, RecipeIngredient: true }
    });

    if (!item || item.Restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }

    // Verificar si está siendo usado en recetas
    if (item.RecipeIngredient.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Este item está siendo usado en ${item.RecipeIngredient.length} receta(s). Elimine primero las referencias.`
      });
    }

    await prisma.inventoryItem.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Item eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// PROVEEDORES
// ============================================

/**
 * GET /api/inventory/:restaurantId/suppliers
 * Listar proveedores
 */
router.get('/:restaurantId/suppliers/list', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const suppliers = await prisma.supplier.findMany({
      where: { restaurantId, isActive: true },
      include: {
        _count: { select: { InventoryItem: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/inventory/suppliers
 * Crear proveedor
 */
router.post('/suppliers', async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      contactName,
      email,
      phone,
      address,
      paymentTerms,
      notes
    } = req.body;

    if (!restaurantId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: restaurantId, name'
      });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactName,
        email,
        phone,
        address,
        paymentTerms,
        notes,
        restaurantId
      }
    });

    res.status(201).json({
      success: true,
      data: supplier,
      message: 'Proveedor creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando proveedor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/inventory/suppliers/:id
 * Actualizar proveedor
 */
router.put('/suppliers/:id', async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: { Restaurant: true }
    });

    if (!supplier || supplier.Restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
    }

    const { name, contactName, email, phone, address, paymentTerms, notes, isActive } = req.body;

    const updated = await prisma.supplier.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(contactName !== undefined && { contactName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(paymentTerms !== undefined && { paymentTerms }),
        ...(notes !== undefined && { notes }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/inventory/suppliers/:id
 */
router.delete('/suppliers/:id', async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: { Restaurant: true }
    });

    if (!supplier || supplier.Restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
    }

    // Soft delete
    await prisma.supplier.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (error) {
    console.error('Error eliminando proveedor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/inventory/:restaurantId/alerts
 * Obtener alertas de inventario
 */
router.get('/:restaurantId/alerts/list', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId },
      include: { Supplier: true }
    });

    const alerts = [];
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    items.forEach(item => {
      // Stock bajo
      if (item.quantity <= item.minStock) {
        alerts.push({
          type: 'LOW_STOCK',
          severity: item.quantity === 0 ? 'critical' : 'warning',
          item: { id: item.id, name: item.name },
          message: `${item.name}: ${item.quantity} ${item.unit} (mínimo: ${item.minStock})`,
          action: 'Reabastecer'
        });
      }

      // Próximo a expirar
      if (item.expiresAt && new Date(item.expiresAt) <= weekFromNow) {
        const daysLeft = Math.ceil((new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
        alerts.push({
          type: 'EXPIRING',
          severity: daysLeft <= 2 ? 'critical' : 'warning',
          item: { id: item.id, name: item.name },
          message: `${item.name}: expira en ${daysLeft} día(s)`,
          action: 'Usar o descartar'
        });
      }

      // Sobre stock máximo
      if (item.maxStock && item.quantity > item.maxStock) {
        alerts.push({
          type: 'OVER_STOCK',
          severity: 'info',
          item: { id: item.id, name: item.name },
          message: `${item.name}: ${item.quantity} ${item.unit} (máximo: ${item.maxStock})`,
          action: 'Revisar pedidos'
        });
      }
    });

    // Ordenar por severidad
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    res.json({
      success: true,
      data: alerts,
      summary: {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length
      }
    });
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
