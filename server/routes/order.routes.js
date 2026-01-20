/**
 * Rutas de Órdenes - Vértice Gastronómico
 * CRUD para gestión de órdenes y pagos
 */

import express from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * Generar número de orden único
 */
function generateOrderNumber() {
  const date = new Date();
  const prefix = `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * GET /api/orders/:restaurantId
 * Listar órdenes con filtros
 */
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, type, date, page = 1, limit = 20 } = req.query;

    // Verificar acceso
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const where = {
      restaurantId,
      ...(status && { status }),
      ...(type && { type }),
      ...(date && {
        createdAt: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        }
      })
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { menuItem: true }
          },
          payments: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/orders/:restaurantId/:id
 * Obtener una orden específica
 */
router.get('/:restaurantId/:id', async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        restaurantId: req.params.restaurantId
      },
      include: {
        items: {
          include: { menuItem: true }
        },
        payments: true
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/orders
 * Crear nueva orden
 */
router.post('/', async (req, res) => {
  try {
    const {
      restaurantId,
      type = 'DINE_IN',
      tableNumber,
      customerName,
      customerPhone,
      notes,
      items
    } = req.body;

    // Validaciones
    if (!restaurantId || !items || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: restaurantId, items'
      });
    }

    // Verificar acceso
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id },
      include: { settings: true }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    // Obtener items del menú y calcular totales
    const menuItemIds = items.map(i => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, restaurantId }
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(400).json({
        success: false,
        error: 'Algunos items no existen o no pertenecen al restaurante'
      });
    }

    // Calcular subtotal
    let subtotal = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        subtotal: itemSubtotal,
        notes: item.notes,
        modifiers: item.modifiers
      };
    });

    // Calcular impuesto
    const taxRate = restaurant.settings?.taxRate || 16;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Crear orden
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        restaurantId,
        type,
        tableNumber,
        customerName,
        customerPhone,
        notes,
        subtotal,
        tax,
        total,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: { menuItem: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Orden creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status
 * Cambiar estado de orden
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Estado inválido. Válidos: ${validStatuses.join(', ')}`
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true }
    });

    if (!order || order.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    const updateData = { status };
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: { include: { menuItem: true } },
        payments: true
      }
    });

    res.json({
      success: true,
      data: updated,
      message: `Orden actualizada a ${status}`
    });
  } catch (error) {
    console.error('Error actualizando orden:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/orders/:id/payment
 * Registrar pago
 */
router.post('/:id/payment', async (req, res) => {
  try {
    const { method, amount, reference } = req.body;
    const validMethods = ['CASH', 'CARD', 'TRANSFER', 'STRIPE'];

    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        error: `Método inválido. Válidos: ${validMethods.join(', ')}`
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true, payments: true }
    });

    if (!order || order.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    // Calcular total pagado
    const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
    const paymentAmount = amount || (order.total - totalPaid);

    if (paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'La orden ya está pagada'
      });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: req.params.id,
        amount: paymentAmount,
        method,
        status: 'COMPLETED',
        reference
      }
    });

    // Si está completamente pagada, actualizar estado
    const newTotalPaid = totalPaid + paymentAmount;
    if (newTotalPaid >= order.total) {
      await prisma.order.update({
        where: { id: req.params.id },
        data: { status: 'COMPLETED', completedAt: new Date() }
      });
    }

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Pago registrado exitosamente',
      balance: order.total - newTotalPaid
    });
  } catch (error) {
    console.error('Error registrando pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/orders/:id
 * Actualizar orden (agregar items, propina, descuento)
 */
router.put('/:id', async (req, res) => {
  try {
    const { tip, discount, notes, addItems, removeItems } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { restaurant: { include: { settings: true } }, items: true }
    });

    if (!order || order.restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    if (['COMPLETED', 'CANCELLED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'No se puede modificar una orden completada o cancelada'
      });
    }

    // Agregar items
    if (addItems && addItems.length > 0) {
      const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: addItems.map(i => i.menuItemId) } }
      });

      for (const item of addItems) {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
        if (menuItem) {
          await prisma.orderItem.create({
            data: {
              orderId: req.params.id,
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: menuItem.price,
              subtotal: menuItem.price * item.quantity,
              notes: item.notes
            }
          });
        }
      }
    }

    // Eliminar items
    if (removeItems && removeItems.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { id: { in: removeItems }, orderId: req.params.id }
      });
    }

    // Recalcular totales
    const updatedItems = await prisma.orderItem.findMany({
      where: { orderId: req.params.id }
    });

    const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0);
    const taxRate = order.restaurant.settings?.taxRate || 16;
    const tax = subtotal * (taxRate / 100);
    const newDiscount = discount !== undefined ? discount : order.discount;
    const newTip = tip !== undefined ? tip : order.tip;
    const total = subtotal + tax - newDiscount + newTip;

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        subtotal,
        tax,
        discount: newDiscount,
        tip: newTip,
        total,
        ...(notes !== undefined && { notes })
      },
      include: {
        items: { include: { menuItem: true } },
        payments: true
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error actualizando orden:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/orders/:restaurantId/stats/today
 * Estadísticas del día
 */
router.get('/:restaurantId/stats/today', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const [orders, completedOrders, revenue, byStatus, byType] = await Promise.all([
      prisma.order.count({
        where: { restaurantId, createdAt: { gte: today } }
      }),
      prisma.order.count({
        where: { restaurantId, createdAt: { gte: today }, status: 'COMPLETED' }
      }),
      prisma.order.aggregate({
        where: { restaurantId, createdAt: { gte: today }, status: 'COMPLETED' },
        _sum: { total: true, tip: true }
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { restaurantId, createdAt: { gte: today } },
        _count: true
      }),
      prisma.order.groupBy({
        by: ['type'],
        where: { restaurantId, createdAt: { gte: today } },
        _count: true
      })
    ]);

    res.json({
      success: true,
      data: {
        totalOrders: orders,
        completedOrders,
        revenue: revenue._sum.total || 0,
        tips: revenue._sum.tip || 0,
        averageTicket: completedOrders > 0 ? (revenue._sum.total || 0) / completedOrders : 0,
        byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {}),
        byType: byType.reduce((acc, t) => ({ ...acc, [t.type]: t._count }), {})
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
