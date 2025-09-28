'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import theme from '@/themes/theme';
import { useTranslation } from '@/i18n';
import { CheckIcon, ArrowLeftIcon } from '@/components/Icons';

interface OrderDetails {
  id: number;
  name: string;
  telegram: string;
  email?: string;
  promo?: string;
  total_price: number;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: string;
  }>;
  order_type: string;
  status: string;
  created_at: string;
}

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [progress, setProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    // Симуляция получения данных заказа
    // В реальном приложении здесь был бы API запрос
    const mockOrderDetails: OrderDetails = {
      id: parseInt(searchParams.get('orderId') || '0'),
      name: searchParams.get('name') || 'Customer',
      telegram: searchParams.get('telegram') || '@username',
      email: searchParams.get('email') || '',
      promo: searchParams.get('promo') || '',
      total_price: parseFloat(searchParams.get('total') || '0'),
      products: JSON.parse(searchParams.get('products') || '[]'),
      order_type: 'available',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    setOrderDetails(mockOrderDetails);

    // Анимация прогресс-бара
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setShowCheckmark(true);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.colors.accent }}></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: theme.colors.foreground }}>
            Order Confirmed! 🎉
          </h1>
          <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
            Your order has been successfully placed
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
                Processing Order
              </span>
              <span className="text-sm font-medium" style={{ color: theme.colors.mutedForeground }}>
                {progress}%
              </span>
            </div>
            
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: theme.colors.muted }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: theme.colors.accent }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              
              {/* Checkmark */}
              <AnimatePresence>
                {showCheckmark && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
                      <CheckIcon size={16} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-center mt-4 text-sm"
              style={{ color: theme.colors.mutedForeground }}
            >
              {showCheckmark ? 'Order processed successfully!' : 'Processing your order...'}
            </motion.p>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Customer Information */}
          <div className="p-6 rounded-2xl border" style={{ 
            background: theme.colors.card,
            borderColor: theme.colors.border 
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium" style={{ color: theme.colors.foreground }}>Name:</span>
                <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{orderDetails.name}</span>
              </div>
              <div>
                <span className="font-medium" style={{ color: theme.colors.foreground }}>Telegram:</span>
                <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{orderDetails.telegram}</span>
              </div>
              {orderDetails.email && (
                <div>
                  <span className="font-medium" style={{ color: theme.colors.foreground }}>Email:</span>
                  <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{orderDetails.email}</span>
                </div>
              )}
              {orderDetails.promo && (
                <div>
                  <span className="font-medium" style={{ color: theme.colors.foreground }}>Promo Code:</span>
                  <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{orderDetails.promo}</span>
                </div>
              )}
              <div>
                <span className="font-medium" style={{ color: theme.colors.foreground }}>Order Date:</span>
                <span className="ml-2" style={{ color: theme.colors.mutedForeground }}>{formatDate(orderDetails.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 rounded-2xl border" style={{ 
            background: theme.colors.card,
            borderColor: theme.colors.border 
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-4">
              {orderDetails.products.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium" style={{ color: theme.colors.foreground }}>
                      {product.name}
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                      Qty: {product.quantity}
                    </div>
                  </div>
                  <div className="font-semibold" style={{ color: theme.colors.accent }}>
                    {formatPrice(parseFloat(product.price) * product.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4" style={{ borderColor: theme.colors.border }}>
              <div className="flex justify-between text-lg font-bold">
                <span style={{ color: theme.colors.foreground }}>Total:</span>
                <span style={{ color: theme.colors.accent }}>
                  {formatPrice(orderDetails.total_price)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8"
        >
          <div className="p-6 rounded-2xl border" style={{ 
            background: 'linear-gradient(135deg, #10b98120, #05966920)',
            borderColor: '#10b98140'
          }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
                <CheckIcon size={32} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
              Thank you for your order!
            </h3>
            <p className="text-lg mb-4" style={{ color: theme.colors.mutedForeground }}>
              We have received your order and will contact you shortly to confirm the details.
            </p>
            <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
              Order ID: #{orderDetails.id}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/shop"
            className="px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            style={{ 
              background: theme.colors.accent,
              color: theme.colors.background
            }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border"
            style={{ 
              borderColor: theme.colors.border,
              color: theme.colors.foreground,
              background: theme.colors.card
            }}
          >
            <ArrowLeftIcon size={20} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
