/**
 * Context de Autenticación - Vértice Gastronómico
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.me();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      api.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        api.setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.error || 'Error al iniciar sesión');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      if (response.success) {
        api.setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.error || 'Error al registrar');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      api.setToken(null);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;
