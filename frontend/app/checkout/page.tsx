'use client';

import React, { useEffect, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { DeleteIcon, PlusIcon, MinusIcon } from "@/components/Icons";
import Notification from "@/components/Notification";
import ShimmerGradient from "@/components/ShimmerGradient";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    telegram: '',
    phone: '',
    promo_code: '',
    message: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [lastOrderTime, setLastOrderTime] = useState<number | null>(null);
  const [showRateLimitError, setShowRateLimitError] = useState(false);

  // Check for rate limiting on component mount
  useEffect(() => {
    const storedTime = localStorage.getItem('lastOrderTime');
    if (storedTime) {
      setLastOrderTime(parseInt(storedTime));
    }
  }, []);

  // Update timer every minute
  useEffect(() => {
    if (!lastOrderTime) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - lastOrderTime;
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (timeDiff >= thirtyMinutes) {
        setLastOrderTime(null);
        localStorage.removeItem('lastOrderTime');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastOrderTime]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const canPlaceOrder = () => {
    if (!lastOrderTime) return true;
    const now = Date.now();
    const timeDiff = now - lastOrderTime;
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    return timeDiff >= thirtyMinutes;
  };

  const getTimeUntilNextOrder = () => {
    if (!lastOrderTime) return 0;
    const now = Date.now();
    const timeDiff = now - lastOrderTime;
    const thirtyMinutes = 30 * 60 * 1000;
    const remaining = thirtyMinutes - timeDiff;
    return Math.max(0, remaining);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.ceil(milliseconds / (60 * 1000));
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
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
    
    if (!orderData.name.trim() || !orderData.telegram.trim()) {
      alert('Name and Telegram are required fields');
      return;
    }

    // Check rate limiting
    if (!canPlaceOrder()) {
      setShowRateLimitError(true);
      setTimeout(() => setShowRateLimitError(false), 5000);
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Checkout: orderData:', orderData);
      console.log('Checkout: cartItems:', cartItems);
      console.log('Checkout: getTotalPrice():', getTotalPrice());
      
      const orderPayload = {
        // Основные поля для checkout
        name: orderData.name,
        telegram: orderData.telegram,
        email: orderData.email || '',
        promo_code: orderData.promo_code || '',
        message: orderData.message || '',
        total_price: getTotalPrice(),
        products: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('Checkout: orderPayload:', orderPayload);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Save order time for rate limiting
        const currentTime = Date.now();
        localStorage.setItem('lastOrderTime', currentTime.toString());
        setLastOrderTime(currentTime);
        
        clearCart();
        
        // Redirect to success page with order details
        const orderParams = new URLSearchParams({
          orderId: responseData.data.id.toString(),
          name: orderData.name,
          telegram: orderData.telegram,
          email: orderData.email || '',
          promo: orderData.promo_code || '',
          total: getTotalPrice().toString(),
          products: JSON.stringify(cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price.toString()
          })))
        });
        
        window.location.href = `/order-success?${orderParams.toString()}`;
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to submit order'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirmation(false);
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
    <main className="min-h-dvh px-6 relative" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <ShimmerGradient />
      <section className="relative flex items-center justify-center py-20 z-10">
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
                    Promo Code
                  </label>
                  <input
                    type="text"
                    name="promo_code"
                    value={orderData.promo_code}
                    onChange={handleInputChange}
                    placeholder="Enter promo code"
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
                  disabled={loading || !canPlaceOrder()}
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ 
                    background: loading || !canPlaceOrder() ? theme.colors.muted : theme.colors.accent,
                    color: theme.colors.background
                  }}
                >
                  {loading ? 'Processing...' : 
                   !canPlaceOrder() ? `Wait ${formatTimeRemaining(getTimeUntilNextOrder())}` : 
                   'Place Order'}
                </button>
              </form>
            </motion.div>

            {/* Rate Limit Error Notification */}
            <AnimatePresence>
              {showRateLimitError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 rounded-lg border"
                  style={{ 
                    background: '#fef2f2',
                    borderColor: '#fecaca',
                    color: '#dc2626'
                  }}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">
                        Too many orders
                      </h3>
                      <div className="mt-1 text-sm">
                        You can place an order only once every 30 minutes. 
                        Please wait {formatTimeRemaining(getTimeUntilNextOrder())} before placing another order.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="rounded-2xl p-8 max-w-4xl mx-4 relative"
              style={{ 
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                color: theme.colors.foreground,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowConfirmation(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                style={{ color: theme.colors.mutedForeground }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.foreground }}>
                Confirm Your Order
              </h2>

              {/* Order Details */}
              <div className="mb-6 p-4 rounded-lg border" style={{ 
                background: theme.colors.muted,
                borderColor: theme.colors.border 
              }}>
                <h3 className="font-semibold mb-3" style={{ color: theme.colors.foreground }}>
                  Contact Information:
                </h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {orderData.name}</div>
                  <div><strong>Telegram:</strong> {orderData.telegram}</div>
                  {orderData.email && <div><strong>Email:</strong> {orderData.email}</div>}
                  {orderData.promo_code && <div><strong>Promo Code:</strong> {orderData.promo_code}</div>}
                  {orderData.message && <div><strong>Message:</strong> {orderData.message}</div>}
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg border" style={{ 
                background: theme.colors.muted,
                borderColor: theme.colors.border 
              }}>
                <h3 className="font-semibold mb-3" style={{ color: theme.colors.foreground }}>
                  Order Summary:
                </h3>
                <div className="space-y-2 text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total ({getTotalItems()} items):</span>
                    <span style={{ color: theme.colors.accent }}>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-2"
                    style={{ 
                      accentColor: theme.colors.accent,
                      borderColor: theme.colors.border 
                    }}
                  />
                  <label htmlFor="agreement" className="text-sm cursor-pointer" style={{ color: theme.colors.mutedForeground }}>
                    <span>I agree to the </span>
                    <Link
                      href="/guides/terms-and-conditions"
                      className="underline hover:no-underline transition"
                      style={{ color: theme.colors.accent }}
                      target="_blank"
                    >
                      terms and conditions
                    </Link>
                    <span> of purchase/sale</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={confirmSubmit}
                  disabled={!agreed || loading}
                  className="px-12 py-4 rounded-xl font-semibold transition disabled:opacity-50"
                  style={{ 
                    background: agreed && !loading ? theme.colors.accent : theme.colors.muted,
                    color: theme.colors.background
                  }}
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
