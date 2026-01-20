/**
 * Componente Header - Vértice Gastronómico
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

export function Header({ title, onMenuToggle, onCommandPaletteOpen }) {
  const { user, logout } = useAuth();
  const { restaurants, currentRestaurant, selectRestaurant } = useRestaurant();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 sticky top-0 z-40 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search button - visible on md+ */}
        {onCommandPaletteOpen && (
          <button
            onClick={onCommandPaletteOpen}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm">Buscar...</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-600 rounded">⌘K</kbd>
          </button>
        )}

        {/* Restaurant selector */}
        {restaurants.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowRestaurantMenu(!showRestaurantMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="max-w-[150px] truncate">
                {currentRestaurant?.name || 'Seleccionar'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showRestaurantMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => {
                      selectRestaurant(restaurant.id);
                      setShowRestaurantMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      currentRestaurant?.id === restaurant.id ? 'text-emerald-400' : 'text-gray-300'
                    }`}
                  >
                    {restaurant.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-t-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi perfil
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configuración
              </button>
              <hr className="border-gray-700" />
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
