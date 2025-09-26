'use client';

import React, { useEffect, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { DeleteIcon, PlusIcon, MinusIcon } from "@/components/Icons";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    telegram: '',
    phone: '',
    message: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        ...orderData,
        products: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total_price: getTotalPrice(),
        order_type: 'cart'
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        clearCart();
        window.location.href = '/order?success=true';
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to submit order'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
            Your cart is empty
          </h3>
          <p style={{ color: theme.colors.mutedForeground }} className="mb-6">
            Add some products to get started
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ 
              background: theme.colors.accent,
              color: theme.colors.background
            }}
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-6" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <section className="relative flex items-center justify-center py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 20%, rgba(156,163,175,0.18), transparent 70%), radial-gradient(600px 300px at 80% 80%, rgba(156,163,175,0.10), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        <div className="relative w-full" style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-2"
            style={{ color: theme.colors.mutedForeground, letterSpacing: "-0.02em" }}
          >
            Checkout
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
            style={{ color: theme.colors.mutedForeground }}
          >
            Complete your order
          </motion.p>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.foreground }}>
                Contact Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Telegram *
                  </label>
                  <input
                    type="text"
                    name="telegram"
                    value={orderData.telegram}
                    onChange={handleInputChange}
                    required
                    placeholder="@username"
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={orderData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                    style={{
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ 
                    background: loading ? theme.colors.muted : theme.colors.accent,
                    color: theme.colors.background
                  }}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl border"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.foreground }}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: theme.colors.foreground }}>
                        {item.name}
                      </h3>
                      <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                        {item.short_description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded hover:bg-red-100 transition-colors"
                          style={{ color: '#ef4444' }}
                        >
                          <DeleteIcon size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: theme.colors.foreground }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <div className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                        {formatPrice(item.price)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4" style={{ borderColor: theme.colors.border }}>
                <div className="flex justify-between text-lg font-bold">
                  <span style={{ color: theme.colors.foreground }}>
                    Total ({getTotalItems()} items)
                  </span>
                  <span style={{ color: theme.colors.accent }}>
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
