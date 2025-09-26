"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";
import { useAuth } from "@/context/AuthContext";
import { OrdersIcon, PhoneIcon, CalendarIcon, DeleteIcon, EditIcon, RefreshIcon, UserIcon, MailIcon, MessageIcon, ClockIcon } from "@/components/Icons";
import { StatusSelector } from "@/components/StatusSelector";

interface Order {
  id: number;
  project_name: string;
  short_description: string;
  technical_spec: string;
  timeline: string;
  telegram: string;
  promo?: string;
  email?: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = async () => {
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
    
    if (!token) {
      setError('No authentication token available');
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete order');
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    if (!token) {
      setError('No authentication token available');
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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

  const filteredOrders = filter === "all" 
    ? (Array.isArray(orders) ? orders : [])
    : (Array.isArray(orders) ? orders.filter(order => order.status === filter) : []);

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
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: theme.colors.mutedForeground }}
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
            Orders Management
          </h1>
          <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
            View and manage all customer orders
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "All Orders", count: Array.isArray(orders) ? orders.length : 0 },
              { value: "pending", label: "Pending", count: Array.isArray(orders) ? orders.filter(o => o.status === 'pending').length : 0 },
              { value: "in_progress", label: "In Progress", count: Array.isArray(orders) ? orders.filter(o => o.status === 'in_progress').length : 0 },
              { value: "completed", label: "Completed", count: Array.isArray(orders) ? orders.filter(o => o.status === 'completed').length : 0 },
              { value: "cancelled", label: "Cancelled", count: Array.isArray(orders) ? orders.filter(o => o.status === 'cancelled').length : 0 },
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === value 
                    ? 'text-white' 
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  background: filter === value ? theme.colors.accent : 'transparent',
                  color: filter === value ? 'white' : theme.colors.mutedForeground,
                }}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredOrders.length === 0 ? (
            <div 
              className="text-center py-12 rounded-2xl border"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
                No orders found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 rounded-2xl border"
                  style={{ 
                    background: theme.colors.card,
                    borderColor: theme.colors.border 
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>
                          {order.project_name}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            background: `${getStatusColor(order.status)}20`,
                            color: getStatusColor(order.status)
                          }}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: theme.colors.mutedForeground }}>
                        {order.short_description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <PhoneIcon className="mr-2" size={16} />
                          <span className="font-medium" style={{ color: theme.colors.foreground }}>Telegram:</span>
                          <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{order.telegram}</span>
                        </div>
                        {order.email && (
                          <div className="flex items-center">
                            <MailIcon className="mr-2" size={16} />
                            <span className="font-medium" style={{ color: theme.colors.foreground }}>Email:</span>
                            <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{order.email}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <ClockIcon className="mr-2" size={16} />
                          <span className="font-medium" style={{ color: theme.colors.foreground }}>Timeline:</span>
                          <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{order.timeline}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2" size={16} />
                          <span className="font-medium" style={{ color: theme.colors.foreground }}>Created:</span>
                          <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <StatusSelector
                        currentStatus={order.status}
                        onStatusChange={(status) => updateOrderStatus(order.id, status)}
                      />
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        style={{ color: '#ef4444' }}
                        title="Delete order"
                      >
                        <DeleteIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Technical Specification */}
                  {order.technical_spec && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                        Technical Specification:
                      </h4>
                      <div 
                        className="p-3 rounded-lg text-sm"
                        style={{ 
                          background: theme.colors.muted,
                          color: theme.colors.mutedForeground 
                        }}
                      >
                        {order.technical_spec}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {order.message && (
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                        Additional Message:
                      </h4>
                      <div 
                        className="p-3 rounded-lg text-sm"
                        style={{ 
                          background: theme.colors.muted,
                          color: theme.colors.mutedForeground 
                        }}
                      >
                        {order.message}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </div>
    );
}
