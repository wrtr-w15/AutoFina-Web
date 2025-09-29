'use client';

import React, { useEffect, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";
import Link from "next/link";
import { DeleteIcon, PlusIcon, MinusIcon } from "@/components/Icons";
import ShimmerGradient from "@/components/ShimmerGradient";

interface CartItem {
  id: number;
  name: string;
  short_description: string;
  price: number;
  image_url?: string;
  quantity: number;
}

export default function CartPage() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        setCartItems(JSON.parse(cart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.colors.accent }}></div>
          <p style={{ color: theme.colors.mutedForeground }}>Loading cart...</p>
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
            Shopping Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
            style={{ color: theme.colors.mutedForeground }}
          >
            Review your selected products
          </motion.p>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
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
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-8"
              >
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl border"
                    style={{ 
                      background: theme.colors.card,
                      borderColor: theme.colors.border 
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
                          {item.name}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: theme.colors.mutedForeground }}>
                          {item.short_description}
                        </p>
                        <div className="text-lg font-bold" style={{ color: theme.colors.accent }}>
                          {formatPrice(item.price)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                          style={{ color: '#ef4444' }}
                          title="Remove item"
                        >
                          <DeleteIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl border"
                style={{ 
                  background: theme.colors.card,
                  borderColor: theme.colors.border 
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>
                    Order Summary
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.mutedForeground }}>
                      Items ({getTotalItems()})
                    </span>
                    <span style={{ color: theme.colors.foreground }}>
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ color: theme.colors.foreground }}>
                      Total
                    </span>
                    <span style={{ color: theme.colors.accent }}>
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Link
                    href="/shop"
                    className="flex-1 px-6 py-3 rounded-lg border text-center font-semibold transition-colors"
                    style={{ 
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                      background: theme.colors.background
                    }}
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                    style={{ 
                      background: theme.colors.accent,
                      color: theme.colors.background
                    }}
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}