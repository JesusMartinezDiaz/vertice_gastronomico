/**
 * Servicio de WebSockets - Vértice Gastronómico
 * Comunicación en tiempo real para órdenes, inventario y notificaciones
 */

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;
const connectedClients = new Map(); // userId -> Set of socket ids
const restaurantRooms = new Map(); // restaurantId -> Set of socket ids

/**
 * Inicializar Socket.IO
 */
export function initializeWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Middleware de autenticación
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Token no proporcionado'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id || decoded.userId;
      socket.user = decoded;
      next();
    } catch (error) {
      console.error('WebSocket auth error:', error.message);
      next(new Error('Token inválido'));
    }
  });

  // Manejar conexiones
  io.on('connection', (socket) => {
    console.log(`📡 Cliente conectado: ${socket.id} (User: ${socket.userId})`);

    // Registrar cliente
    if (!connectedClients.has(socket.userId)) {
      connectedClients.set(socket.userId, new Set());
    }
    connectedClients.get(socket.userId).add(socket.id);

    // Unirse a sala de usuario
    socket.join(`user:${socket.userId}`);

    // Evento: Unirse a sala de restaurante
    socket.on('join:restaurant', (restaurantId) => {
      if (!restaurantId) return;

      socket.join(`restaurant:${restaurantId}`);

      if (!restaurantRooms.has(restaurantId)) {
        restaurantRooms.set(restaurantId, new Set());
      }
      restaurantRooms.get(restaurantId).add(socket.id);

      console.log(`🏪 ${socket.userId} se unió al restaurante ${restaurantId}`);

      socket.emit('joined:restaurant', { restaurantId, success: true });
    });

    // Evento: Salir de sala de restaurante
    socket.on('leave:restaurant', (restaurantId) => {
      if (!restaurantId) return;

      socket.leave(`restaurant:${restaurantId}`);

      if (restaurantRooms.has(restaurantId)) {
        restaurantRooms.get(restaurantId).delete(socket.id);
      }

      console.log(`🚪 ${socket.userId} salió del restaurante ${restaurantId}`);
    });

    // Evento: Nueva orden (desde cocina/caja)
    socket.on('order:create', (data) => {
      const { restaurantId, order } = data;
      if (!restaurantId || !order) return;

      // Notificar a todos en el restaurante
      io.to(`restaurant:${restaurantId}`).emit('order:new', {
        order,
        timestamp: new Date().toISOString()
      });
    });

    // Evento: Actualizar estado de orden
    socket.on('order:status', (data) => {
      const { restaurantId, orderId, status, orderNumber } = data;
      if (!restaurantId || !orderId || !status) return;

      io.to(`restaurant:${restaurantId}`).emit('order:updated', {
        orderId,
        orderNumber,
        status,
        updatedBy: socket.userId,
        timestamp: new Date().toISOString()
      });
    });

    // Evento: Alerta de inventario bajo
    socket.on('inventory:alert', (data) => {
      const { restaurantId, item, type } = data;
      if (!restaurantId) return;

      io.to(`restaurant:${restaurantId}`).emit('inventory:alert', {
        item,
        type,
        timestamp: new Date().toISOString()
      });
    });

    // Evento: Actualización de inventario
    socket.on('inventory:update', (data) => {
      const { restaurantId, itemId, quantity, adjustment } = data;
      if (!restaurantId || !itemId) return;

      io.to(`restaurant:${restaurantId}`).emit('inventory:changed', {
        itemId,
        quantity,
        adjustment,
        updatedBy: socket.userId,
        timestamp: new Date().toISOString()
      });
    });

    // Evento: Notificación general
    socket.on('notification:send', (data) => {
      const { restaurantId, type, message, targetUsers } = data;

      if (targetUsers && targetUsers.length > 0) {
        // Enviar a usuarios específicos
        targetUsers.forEach(userId => {
          io.to(`user:${userId}`).emit('notification', {
            type,
            message,
            from: socket.userId,
            timestamp: new Date().toISOString()
          });
        });
      } else if (restaurantId) {
        // Enviar a todo el restaurante
        io.to(`restaurant:${restaurantId}`).emit('notification', {
          type,
          message,
          from: socket.userId,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Evento: Chat/mensaje interno
    socket.on('chat:message', (data) => {
      const { restaurantId, message, recipientId } = data;

      const chatMessage = {
        id: `msg_${Date.now()}`,
        senderId: socket.userId,
        senderName: socket.user.name || 'Usuario',
        message,
        timestamp: new Date().toISOString()
      };

      if (recipientId) {
        // Mensaje directo
        io.to(`user:${recipientId}`).emit('chat:message', chatMessage);
        socket.emit('chat:message', chatMessage); // Eco al remitente
      } else if (restaurantId) {
        // Mensaje grupal
        io.to(`restaurant:${restaurantId}`).emit('chat:message', chatMessage);
      }
    });

    // Evento: Ping/Pong para verificar conexión
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Manejar desconexión
    socket.on('disconnect', (reason) => {
      console.log(`📴 Cliente desconectado: ${socket.id} (Razón: ${reason})`);

      // Limpiar registros
      if (connectedClients.has(socket.userId)) {
        connectedClients.get(socket.userId).delete(socket.id);
        if (connectedClients.get(socket.userId).size === 0) {
          connectedClients.delete(socket.userId);
        }
      }

      // Limpiar de salas de restaurante
      restaurantRooms.forEach((sockets, restaurantId) => {
        sockets.delete(socket.id);
      });
    });

    // Manejar errores
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('✅ WebSocket Server inicializado');
  return io;
}

/**
 * Obtener instancia de Socket.IO
 */
export function getIO() {
  if (!io) {
    console.warn('WebSocket no inicializado');
  }
  return io;
}

/**
 * Emitir evento a un restaurante
 */
export function emitToRestaurant(restaurantId, event, data) {
  if (!io) return false;
  io.to(`restaurant:${restaurantId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
  return true;
}

/**
 * Emitir evento a un usuario específico
 */
export function emitToUser(userId, event, data) {
  if (!io) return false;
  io.to(`user:${userId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
  return true;
}

/**
 * Emitir nueva orden
 */
export function emitNewOrder(restaurantId, order) {
  return emitToRestaurant(restaurantId, 'order:new', { order });
}

/**
 * Emitir actualización de orden
 */
export function emitOrderUpdate(restaurantId, orderId, status, orderNumber) {
  return emitToRestaurant(restaurantId, 'order:updated', { orderId, status, orderNumber });
}

/**
 * Emitir alerta de inventario
 */
export function emitInventoryAlert(restaurantId, item, alertType) {
  return emitToRestaurant(restaurantId, 'inventory:alert', {
    item,
    type: alertType,
    severity: alertType === 'OUT_OF_STOCK' ? 'critical' : 'warning'
  });
}

/**
 * Emitir notificación
 */
export function emitNotification(restaurantId, notification) {
  return emitToRestaurant(restaurantId, 'notification', notification);
}

/**
 * Obtener estadísticas de conexiones
 */
export function getConnectionStats() {
  return {
    totalUsers: connectedClients.size,
    totalSockets: Array.from(connectedClients.values()).reduce((sum, set) => sum + set.size, 0),
    restaurantRooms: restaurantRooms.size,
    rooms: io ? Object.keys(io.sockets.adapter.rooms).length : 0
  };
}

/**
 * Verificar si un usuario está conectado
 */
export function isUserConnected(userId) {
  return connectedClients.has(userId) && connectedClients.get(userId).size > 0;
}

export default {
  initializeWebSocket,
  getIO,
  emitToRestaurant,
  emitToUser,
  emitNewOrder,
  emitOrderUpdate,
  emitInventoryAlert,
  emitNotification,
  getConnectionStats,
  isUserConnected
};
