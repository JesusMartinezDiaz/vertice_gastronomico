/**
 * Context de Restaurante - Vértice Gastronómico
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { restaurantsApi } from '../services/api';
import { useAuth } from './AuthContext';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar restaurantes del usuario
  useEffect(() => {
    if (isAuthenticated) {
      loadRestaurants();
    } else {
      setRestaurants([]);
      setCurrentRestaurant(null);
    }
  }, [isAuthenticated]);

  const loadRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await restaurantsApi.list();
      if (response.success) {
        setRestaurants(response.data);
        // Seleccionar el primero si no hay ninguno seleccionado
        if (response.data.length > 0 && !currentRestaurant) {
          const savedId = localStorage.getItem('currentRestaurantId');
          const restaurant = savedId
            ? response.data.find(r => r.id === savedId) || response.data[0]
            : response.data[0];
          setCurrentRestaurant(restaurant);
          localStorage.setItem('currentRestaurantId', restaurant.id);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectRestaurant = useCallback((restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      setCurrentRestaurant(restaurant);
      localStorage.setItem('currentRestaurantId', restaurantId);
    }
  }, [restaurants]);

  const createRestaurant = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await restaurantsApi.create(data);
      if (response.success) {
        const newRestaurant = response.data;
        setRestaurants(prev => [...prev, newRestaurant]);
        setCurrentRestaurant(newRestaurant);
        localStorage.setItem('currentRestaurantId', newRestaurant.id);
        return { success: true, data: newRestaurant };
      }
      throw new Error(response.error);
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRestaurant = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const response = await restaurantsApi.update(id, data);
      if (response.success) {
        setRestaurants(prev =>
          prev.map(r => r.id === id ? response.data : r)
        );
        if (currentRestaurant?.id === id) {
          setCurrentRestaurant(response.data);
        }
        return { success: true, data: response.data };
      }
      throw new Error(response.error);
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentRestaurant]);

  const deleteRestaurant = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await restaurantsApi.delete(id);
      if (response.success) {
        setRestaurants(prev => prev.filter(r => r.id !== id));
        if (currentRestaurant?.id === id) {
          const remaining = restaurants.filter(r => r.id !== id);
          setCurrentRestaurant(remaining[0] || null);
        }
        return { success: true };
      }
      throw new Error(response.error);
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentRestaurant, restaurants]);

  const value = {
    restaurants,
    currentRestaurant,
    loading,
    error,
    loadRestaurants,
    selectRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant debe usarse dentro de RestaurantProvider');
  }
  return context;
}

export default RestaurantContext;
