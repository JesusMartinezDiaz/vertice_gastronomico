/**
 * Servicio de API - Vértice Gastronómico
 * Cliente HTTP para comunicación con el backend
 */

import { API_URL } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // PUT request
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // PATCH request
  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivo');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

export const api = new ApiService();

// Auth API
export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  refreshToken: () => api.post('/api/auth/refresh'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password })
};

// Restaurants API
export const restaurantsApi = {
  list: () => api.get('/api/restaurants'),
  get: (id) => api.get(`/api/restaurants/${id}`),
  create: (data) => api.post('/api/restaurants', data),
  update: (id, data) => api.put(`/api/restaurants/${id}`, data),
  delete: (id) => api.delete(`/api/restaurants/${id}`),
  getStats: (id) => api.get(`/api/restaurants/${id}/stats`)
};

// Menu API
export const menuApi = {
  getCategories: (restaurantId) => api.get(`/api/menu/categories/${restaurantId}`),
  createCategory: (restaurantId, data) => api.post(`/api/menu/categories/${restaurantId}`, data),
  updateCategory: (categoryId, data) => api.put(`/api/menu/categories/${categoryId}`, data),
  deleteCategory: (categoryId) => api.delete(`/api/menu/categories/${categoryId}`),
  getItems: (restaurantId) => api.get(`/api/menu/items/${restaurantId}`),
  createItem: (restaurantId, data) => api.post(`/api/menu/items/${restaurantId}`, data),
  updateItem: (itemId, data) => api.put(`/api/menu/items/${itemId}`, data),
  deleteItem: (itemId) => api.delete(`/api/menu/items/${itemId}`),
  toggleAvailability: (itemId) => api.patch(`/api/menu/items/${itemId}/availability`),
  getAnalysis: (restaurantId) => api.get(`/api/menu/analysis/${restaurantId}`)
};

// Orders API
export const ordersApi = {
  list: (restaurantId, params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/orders/${restaurantId}?${query}`);
  },
  get: (orderId) => api.get(`/api/orders/detail/${orderId}`),
  create: (restaurantId, data) => api.post(`/api/orders/${restaurantId}`, data),
  updateStatus: (orderId, status) => api.patch(`/api/orders/${orderId}/status`, { status }),
  addPayment: (orderId, payment) => api.post(`/api/orders/${orderId}/payment`, payment),
  cancel: (orderId, reason) => api.post(`/api/orders/${orderId}/cancel`, { reason }),
  getStats: (restaurantId) => api.get(`/api/orders/${restaurantId}/stats`)
};

// Inventory API
export const inventoryApi = {
  list: (restaurantId) => api.get(`/api/inventory/${restaurantId}`),
  get: (itemId) => api.get(`/api/inventory/item/${itemId}`),
  create: (restaurantId, data) => api.post(`/api/inventory/${restaurantId}`, data),
  update: (itemId, data) => api.put(`/api/inventory/item/${itemId}`, data),
  delete: (itemId) => api.delete(`/api/inventory/item/${itemId}`),
  adjust: (itemId, adjustment) => api.post(`/api/inventory/item/${itemId}/adjust`, adjustment),
  getAlerts: (restaurantId) => api.get(`/api/inventory/${restaurantId}/alerts/list`),
  getSuppliers: (restaurantId) => api.get(`/api/inventory/${restaurantId}/suppliers`),
  createSupplier: (restaurantId, data) => api.post(`/api/inventory/${restaurantId}/suppliers`, data)
};

// Reports API
export const reportsApi = {
  getSales: (restaurantId, params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/reports/${restaurantId}/sales?${query}`);
  },
  getInventory: (restaurantId) => api.get(`/api/reports/${restaurantId}/inventory`),
  getCosts: (restaurantId, params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/reports/${restaurantId}/costs?${query}`);
  },
  getPerformance: (restaurantId, params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/reports/${restaurantId}/performance?${query}`);
  },
  list: (restaurantId) => api.get(`/api/reports/${restaurantId}/list`),
  getReport: (reportId) => api.get(`/api/reports/detail/${reportId}`)
};

// Upload API
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload('/api/upload/image', formData);
  },
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.upload('/api/upload/document', formData);
  },
  uploadMenuImage: (restaurantId, itemId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload(`/api/upload/menu-image/${restaurantId}/${itemId}`, formData);
  },
  uploadLogo: (restaurantId, file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.upload(`/api/upload/restaurant-logo/${restaurantId}`, formData);
  },
  deleteFile: (type, filename) => api.delete(`/api/upload/${type}/${filename}`),
  listFiles: (restaurantId) => api.get(`/api/upload/list/${restaurantId}`)
};

export default api;
