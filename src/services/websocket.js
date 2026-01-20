/**
 * Servicio de WebSocket - Vértice Gastronómico
 * Cliente Socket.IO para comunicación en tiempo real
 */

import { io } from 'socket.io-client';
import { WS_URL } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.socket.on('connect', () => {
      console.log('WebSocket conectado');
      this.reconnectAttempts = 0;
      this.emit('connection:status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket desconectado:', reason);
      this.emit('connection:status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error.message);
      this.reconnectAttempts++;
    });

    // Eventos de órdenes
    this.socket.on('order:new', (data) => this.emit('order:new', data));
    this.socket.on('order:updated', (data) => this.emit('order:updated', data));

    // Eventos de inventario
    this.socket.on('inventory:alert', (data) => this.emit('inventory:alert', data));
    this.socket.on('inventory:changed', (data) => this.emit('inventory:changed', data));

    // Notificaciones
    this.socket.on('notification', (data) => this.emit('notification', data));

    // Chat
    this.socket.on('chat:message', (data) => this.emit('chat:message', data));

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Unirse a sala de restaurante
  joinRestaurant(restaurantId) {
    if (this.socket?.connected) {
      this.socket.emit('join:restaurant', restaurantId);
    }
  }

  // Salir de sala de restaurante
  leaveRestaurant(restaurantId) {
    if (this.socket?.connected) {
      this.socket.emit('leave:restaurant', restaurantId);
    }
  }

  // Emitir eventos
  send(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Sistema de listeners internos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  off(event, callback) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
    } else {
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error en listener de ${event}:`, error);
      }
    });
  }

  // Verificar conexión
  isConnected() {
    return this.socket?.connected || false;
  }

  // Ping para mantener conexión
  ping() {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }
}

export const wsService = new WebSocketService();
export default wsService;
