"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  project_name: string;
  short_description: string;
  telegram: string;
  email?: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete order');
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status } : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return theme.colors.mutedForeground;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.colors.background }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: theme.colors.mutedForeground }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
            Admin Dashboard
          </h1>
          <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
            Manage orders and products
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl border border-red-200"
            style={{ background: '#fef2f2', color: '#dc2626' }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="space-y-4">
              <Link href="/admin/orders">
                <div 
                  className="p-6 rounded-2xl border cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    background: theme.colors.card,
                    borderColor: theme.colors.border 
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
                    📋 Orders
                  </h3>
                  <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                    View and manage all orders
                  </p>
                  <div className="mt-2 text-2xl font-bold" style={{ color: theme.colors.accent }}>
                    {Array.isArray(orders) ? orders.length : 0}
                  </div>
                </div>
              </Link>

              <Link href="/admin/products">
                <div 
                  className="p-6 rounded-2xl border cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    background: theme.colors.card,
                    borderColor: theme.colors.border 
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
                    🛍️ Products
                  </h3>
                  <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                    Manage product catalog
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              <h2 className="text-2xl font-semibold mb-6" style={{ color: theme.colors.foreground }}>
                Recent Orders
              </h2>
              
              {!Array.isArray(orders) || orders.length === 0 ? (
                <div className="text-center py-8">
                  <p style={{ color: theme.colors.mutedForeground }}>No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 rounded-xl border"
                      style={{ 
                        background: theme.colors.muted,
                        borderColor: theme.colors.border 
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold" style={{ color: theme.colors.foreground }}>
                            {order.project_name}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: theme.colors.mutedForeground }}>
                            {order.short_description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span style={{ color: theme.colors.mutedForeground }}>
                              📱 {order.telegram}
                            </span>
                            <span style={{ color: theme.colors.mutedForeground }}>
                              📅 {formatDate(order.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 rounded-lg text-sm border"
                            style={{ 
                              background: theme.colors.background,
                              borderColor: theme.colors.border,
                              color: theme.colors.foreground 
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                            style={{ color: '#ef4444' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    );
}
