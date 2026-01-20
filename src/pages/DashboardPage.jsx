/**
 * Dashboard Page - Vértice Gastronómico
 */

import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatMXN, formatMXNShort, formatPercentage } from '../utils/formatters';
import { restaurantsApi, ordersApi } from '../services/api';

export function DashboardPage() {
  const { currentRestaurant } = useRestaurant();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    if (currentRestaurant?.id) {
      loadStats();
    }
  }, [currentRestaurant?.id]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [restaurantStats, orderData] = await Promise.all([
        restaurantsApi.getStats(currentRestaurant.id).catch(() => null),
        ordersApi.getStats(currentRestaurant.id).catch(() => null)
      ]);

      setStats(restaurantStats?.data || generateMockStats());
      setOrderStats(orderData?.data || generateMockOrderStats());
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(generateMockStats());
      setOrderStats(generateMockOrderStats());
    } finally {
      setLoading(false);
    }
  };

  const generateMockStats = () => ({
    totalOrders: 156,
    todayOrders: 23,
    totalRevenue: 45780.50,
    todayRevenue: 8234.00,
    averageTicket: 293.46,
    menuItems: 48,
    activeOrders: 5,
    completionRate: 94.5
  });

  const generateMockOrderStats = () => ({
    pending: 3,
    preparing: 2,
    ready: 1,
    delivered: 17,
    cancelled: 0
  });

  if (!currentRestaurant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Sin restaurante seleccionado</h2>
          <p className="text-gray-400">Crea o selecciona un restaurante para ver el dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Bienvenido a {currentRestaurant.name}
          </h2>
          <p className="text-gray-400 mt-1">
            Aquí tienes un resumen de tu negocio
          </p>
        </div>
        <Badge variant="success" dot>En línea</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas de Hoy"
          value={formatMXN(stats.todayRevenue)}
          icon={<DollarIcon />}
          trend="+12%"
          positive
        />
        <StatCard
          title="Órdenes Hoy"
          value={stats.todayOrders}
          icon={<OrderIcon />}
          trend="+8%"
          positive
        />
        <StatCard
          title="Ticket Promedio"
          value={formatMXN(stats.averageTicket)}
          icon={<TicketIcon />}
          trend="+5%"
          positive
        />
        <StatCard
          title="Tasa de Completado"
          value={formatPercentage(stats.completionRate)}
          icon={<CheckIcon />}
          trend="+2%"
          positive
        />
      </div>

      {/* Orders Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <OrderStatusRow label="Pendientes" count={orderStats.pending} color="yellow" />
              <OrderStatusRow label="En Preparación" count={orderStats.preparing} color="orange" />
              <OrderStatusRow label="Listas" count={orderStats.ready} color="green" />
              <OrderStatusRow label="Entregadas" count={orderStats.delivered} color="blue" />
              <OrderStatusRow label="Canceladas" count={orderStats.cancelled} color="red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatMXNShort(stats.totalRevenue)}
                </p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Total Órdenes</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Items en Menú</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.menuItems}
                </p>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Órdenes Activas</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {stats.activeOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon={<PlusIcon />} label="Nueva Orden" />
            <QuickAction icon={<MenuIcon />} label="Editar Menú" />
            <QuickAction icon={<BoxIcon />} label="Inventario" />
            <QuickAction icon={<ChartIcon />} label="Ver Reportes" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, trend, positive }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <span className={`text-sm ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend} vs ayer
            </span>
          )}
        </div>
        <div className="p-3 bg-emerald-600/20 rounded-lg text-emerald-400">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function OrderStatusRow({ label, count, color }) {
  const colors = {
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colors[color]}`} />
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="font-semibold text-white">{count}</span>
    </div>
  );
}

function QuickAction({ icon, label }) {
  return (
    <button className="flex flex-col items-center gap-2 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="p-3 bg-emerald-600/20 rounded-lg text-emerald-400">
        {icon}
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </button>
  );
}

// Icons
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const OrderIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const BoxIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default DashboardPage;
