/**
 * Rutas de Reportes - Vértice Gastronómico
 * Generación de reportes de ventas, inventario, costos y rendimiento
 */

import express from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /api/reports/:restaurantId/sales
 * Reporte de ventas por período
 */
router.get('/:restaurantId/sales', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        status: 'COMPLETED',
        createdAt: { gte: start, lte: end }
      },
      include: {
        items: { include: { MenuItem: true } },
        payments: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Agrupar por período
    const salesByPeriod = {};
    orders.forEach(order => {
      let key;
      const date = new Date(order.createdAt);

      switch (groupBy) {
        case 'hour':
          key = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:00`;
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!salesByPeriod[key]) {
        salesByPeriod[key] = { period: key, orders: 0, revenue: 0, items: 0, tips: 0 };
      }
      salesByPeriod[key].orders++;
      salesByPeriod[key].revenue += order.total;
      salesByPeriod[key].tips += order.tip || 0;
      salesByPeriod[key].items += order.items.reduce((sum, i) => sum + i.quantity, 0);
    });

    // Ventas por tipo de orden
    const salesByType = {};
    orders.forEach(order => {
      if (!salesByType[order.type]) {
        salesByType[order.type] = { count: 0, revenue: 0 };
      }
      salesByType[order.type].count++;
      salesByType[order.type].revenue += order.total;
    });

    // Ventas por método de pago
    const salesByPayment = {};
    orders.forEach(order => {
      order.payments.forEach(payment => {
        if (!salesByPayment[payment.method]) {
          salesByPayment[payment.method] = { count: 0, amount: 0 };
        }
        salesByPayment[payment.method].count++;
        salesByPayment[payment.method].amount += payment.amount;
      });
    });

    // Top productos
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.menuItemId;
        if (!productSales[id]) {
          productSales[id] = {
            id,
            name: item.MenuItem?.name || 'Desconocido',
            quantity: 0,
            revenue: 0
          };
        }
        productSales[id].quantity += item.quantity;
        productSales[id].revenue += item.subtotal;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Totales
    const totals = {
      orders: orders.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      subtotal: orders.reduce((sum, o) => sum + o.subtotal, 0),
      tax: orders.reduce((sum, o) => sum + o.tax, 0),
      tips: orders.reduce((sum, o) => sum + (o.tip || 0), 0),
      discounts: orders.reduce((sum, o) => sum + (o.discount || 0), 0),
      averageTicket: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0
    };

    // Guardar reporte
    const report = await prisma.report.create({
      data: {
        type: 'SALES',
        title: `Reporte de Ventas ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        data: {
          period: { start, end, groupBy },
          totals,
          byPeriod: Object.values(salesByPeriod),
          byType: salesByType,
          byPayment: salesByPayment,
          topProducts
        },
        period: `${start.toISOString()}_${end.toISOString()}`,
        restaurantId
      }
    });

    res.json({
      success: true,
      data: {
        id: report.id,
        period: { start, end, groupBy },
        totals,
        timeline: Object.values(salesByPeriod),
        byType: salesByType,
        byPayment: salesByPayment,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:restaurantId/inventory
 * Reporte de inventario
 */
router.get('/:restaurantId/inventory', async (req, res) => {
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
      include: {
        Supplier: true,
        RecipeIngredient: {
          include: {
            Recipe: { include: { MenuItem: true } }
          }
        }
      }
    });

    // Calcular valores
    const inventory = items.map(item => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      quantity: item.quantity,
      minStock: item.minStock,
      maxStock: item.maxStock,
      costPerUnit: item.costPerUnit,
      totalValue: item.quantity * item.costPerUnit,
      supplier: item.Supplier?.name,
      status: item.quantity <= 0 ? 'OUT_OF_STOCK'
             : item.quantity <= item.minStock ? 'LOW_STOCK'
             : item.maxStock && item.quantity > item.maxStock ? 'OVER_STOCK'
             : 'OK',
      expiresAt: item.expiresAt,
      usedIn: item.RecipeIngredient.map(ri => ri.Recipe.MenuItem?.name).filter(Boolean)
    }));

    // Estadísticas
    const stats = {
      totalItems: items.length,
      totalValue: inventory.reduce((sum, i) => sum + i.totalValue, 0),
      outOfStock: inventory.filter(i => i.status === 'OUT_OF_STOCK').length,
      lowStock: inventory.filter(i => i.status === 'LOW_STOCK').length,
      overStock: inventory.filter(i => i.status === 'OVER_STOCK').length,
      expiringSoon: items.filter(i => {
        if (!i.expiresAt) return false;
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return new Date(i.expiresAt) <= weekFromNow;
      }).length
    };

    // Por categoría de estado
    const byStatus = {
      OK: inventory.filter(i => i.status === 'OK'),
      LOW_STOCK: inventory.filter(i => i.status === 'LOW_STOCK'),
      OUT_OF_STOCK: inventory.filter(i => i.status === 'OUT_OF_STOCK'),
      OVER_STOCK: inventory.filter(i => i.status === 'OVER_STOCK')
    };

    // Top items por valor
    const topByValue = [...inventory]
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    // Guardar reporte
    const report = await prisma.report.create({
      data: {
        type: 'INVENTORY',
        title: `Reporte de Inventario ${new Date().toLocaleDateString()}`,
        data: { stats, inventory, byStatus, topByValue },
        restaurantId
      }
    });

    res.json({
      success: true,
      data: {
        id: report.id,
        generatedAt: report.createdAt,
        stats,
        items: inventory,
        byStatus,
        topByValue
      }
    });
  } catch (error) {
    console.error('Error generando reporte de inventario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:restaurantId/cost-analysis
 * Análisis de costos y márgenes
 */
router.get('/:restaurantId/cost-analysis', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // Obtener items del menú con costos
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId, isActive: true },
      include: {
        category: true,
        OrderItem: {
          where: {
            Order: {
              status: 'COMPLETED',
              createdAt: { gte: start, lte: end }
            }
          }
        }
      }
    });

    // Análisis por item
    const itemAnalysis = menuItems.map(item => {
      const sold = item.OrderItem.reduce((sum, oi) => sum + oi.quantity, 0);
      const revenue = item.OrderItem.reduce((sum, oi) => sum + oi.subtotal, 0);
      const cost = item.cost || 0;
      const totalCost = sold * cost;
      const grossProfit = revenue - totalCost;
      const margin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
      const foodCost = revenue > 0 ? (totalCost / revenue) * 100 : 0;

      return {
        id: item.id,
        name: item.name,
        category: item.category.name,
        price: item.price,
        cost,
        sold,
        revenue,
        totalCost,
        grossProfit,
        margin: margin.toFixed(1),
        foodCost: foodCost.toFixed(1),
        contribution: grossProfit // Contribución al margen total
      };
    });

    // Ordenar por margen (peores primero para atención)
    const byMargin = [...itemAnalysis]
      .filter(i => i.sold > 0)
      .sort((a, b) => parseFloat(a.margin) - parseFloat(b.margin));

    // Top contribuidores
    const topContributors = [...itemAnalysis]
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 10);

    // Totales
    const totals = {
      totalRevenue: itemAnalysis.reduce((sum, i) => sum + i.revenue, 0),
      totalCost: itemAnalysis.reduce((sum, i) => sum + i.totalCost, 0),
      grossProfit: itemAnalysis.reduce((sum, i) => sum + i.grossProfit, 0),
      itemsWithCost: menuItems.filter(i => i.cost).length,
      itemsWithoutCost: menuItems.filter(i => !i.cost).length
    };

    totals.overallMargin = totals.totalRevenue > 0
      ? ((totals.grossProfit / totals.totalRevenue) * 100).toFixed(1)
      : 0;
    totals.overallFoodCost = totals.totalRevenue > 0
      ? ((totals.totalCost / totals.totalRevenue) * 100).toFixed(1)
      : 0;

    // Por categoría
    const byCategory = {};
    itemAnalysis.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = { revenue: 0, cost: 0, profit: 0, items: 0 };
      }
      byCategory[item.category].revenue += item.revenue;
      byCategory[item.category].cost += item.totalCost;
      byCategory[item.category].profit += item.grossProfit;
      byCategory[item.category].items++;
    });

    Object.keys(byCategory).forEach(cat => {
      const c = byCategory[cat];
      c.margin = c.revenue > 0 ? ((c.profit / c.revenue) * 100).toFixed(1) : 0;
    });

    // Guardar reporte
    const report = await prisma.report.create({
      data: {
        type: 'COST_ANALYSIS',
        title: `Análisis de Costos ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        data: {
          period: { start, end },
          totals,
          items: itemAnalysis,
          byMargin,
          topContributors,
          byCategory
        },
        period: `${start.toISOString()}_${end.toISOString()}`,
        restaurantId
      }
    });

    res.json({
      success: true,
      data: {
        id: report.id,
        period: { start, end },
        totals,
        items: itemAnalysis,
        lowMarginItems: byMargin.slice(0, 10),
        topContributors,
        byCategory
      }
    });
  } catch (error) {
    console.error('Error en análisis de costos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:restaurantId/performance
 * Reporte de rendimiento operativo
 */
router.get('/:restaurantId/performance', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: { gte: start, lte: end }
      },
      include: { items: true }
    });

    // Por estado
    const byStatus = {};
    orders.forEach(order => {
      if (!byStatus[order.status]) {
        byStatus[order.status] = { count: 0, value: 0 };
      }
      byStatus[order.status].count++;
      byStatus[order.status].value += order.total;
    });

    // Tiempos de servicio (órdenes completadas)
    const completedOrders = orders.filter(o => o.status === 'COMPLETED' && o.completedAt);
    const serviceTimes = completedOrders.map(o => {
      const created = new Date(o.createdAt);
      const completed = new Date(o.completedAt);
      return (completed - created) / (1000 * 60); // minutos
    });

    const avgServiceTime = serviceTimes.length > 0
      ? serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length
      : 0;

    // Horas pico
    const ordersByHour = {};
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      if (!ordersByHour[hour]) {
        ordersByHour[hour] = { count: 0, revenue: 0 };
      }
      ordersByHour[hour].count++;
      ordersByHour[hour].revenue += order.total;
    });

    // Días de la semana
    const ordersByDay = {};
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    orders.forEach(order => {
      const day = days[new Date(order.createdAt).getDay()];
      if (!ordersByDay[day]) {
        ordersByDay[day] = { count: 0, revenue: 0 };
      }
      ordersByDay[day].count++;
      ordersByDay[day].revenue += order.total;
    });

    // KPIs
    const daysInPeriod = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const kpis = {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
      completionRate: orders.length > 0
        ? ((completedOrders.length / orders.length) * 100).toFixed(1)
        : 0,
      cancellationRate: orders.length > 0
        ? ((orders.filter(o => o.status === 'CANCELLED').length / orders.length) * 100).toFixed(1)
        : 0,
      avgOrdersPerDay: (orders.length / daysInPeriod).toFixed(1),
      avgServiceTime: avgServiceTime.toFixed(1),
      peakHour: Object.entries(ordersByHour)
        .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A',
      peakDay: Object.entries(ordersByDay)
        .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'
    };

    // Guardar reporte
    const report = await prisma.report.create({
      data: {
        type: 'PERFORMANCE',
        title: `Reporte de Rendimiento ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        data: {
          period: { start, end },
          kpis,
          byStatus,
          byHour: ordersByHour,
          byDay: ordersByDay
        },
        period: `${start.toISOString()}_${end.toISOString()}`,
        restaurantId
      }
    });

    res.json({
      success: true,
      data: {
        id: report.id,
        period: { start, end, daysInPeriod },
        kpis,
        byStatus,
        byHour: ordersByHour,
        byDay: ordersByDay
      }
    });
  } catch (error) {
    console.error('Error en reporte de rendimiento:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:restaurantId/history
 * Historial de reportes generados
 */
router.get('/:restaurantId/history', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { type, limit = 20 } = req.query;

    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId, ownerId: req.user.id }
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const reports = await prisma.report.findMany({
      where: {
        restaurantId,
        ...(type && { type })
      },
      select: {
        id: true,
        type: true,
        title: true,
        period: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports/:restaurantId/:id
 * Obtener un reporte específico
 */
router.get('/:restaurantId/:id', async (req, res) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        restaurantId: req.params.restaurantId
      }
    });

    if (!report) {
      return res.status(404).json({ success: false, error: 'Reporte no encontrado' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/reports/:restaurantId/:id
 */
router.delete('/:restaurantId/:id', async (req, res) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        id: req.params.id,
        restaurantId: req.params.restaurantId
      },
      include: { Restaurant: true }
    });

    if (!report || report.Restaurant.ownerId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Reporte no encontrado' });
    }

    await prisma.report.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Reporte eliminado' });
  } catch (error) {
    console.error('Error eliminando reporte:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
