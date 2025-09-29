'use client';

import React, { useEffect, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCartIcon, CheckIcon, ArrowLeftIcon } from "@/components/Icons";
import Notification from "@/components/Notification";
import ShimmerGradient from "@/components/ShimmerGradient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/styles/markdown.css";

interface Product {
  id: number;
  name: string;
  name_translations: {
    en: string;
    ru: string;
    uk: string;
  };
  short_description: string;
  short_description_translations: {
    en: string;
    ru: string;
    uk: string;
  };
  full_description: string;
  full_description_translations: {
    en: string;
    ru: string;
    uk: string;
  };
  price: number;
  image_url?: string;
  description_blocks: Array<{
    title: string;
    content: string;
  }>;
  description_blocks_translations?: {
    en: Array<{
      title: string;
      content: string;
    }>;
    ru: Array<{
      title: string;
      content: string;
    }>;
    uk: Array<{
      title: string;
      content: string;
    }>;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, locale } = useTranslation();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Функция для получения переведенного контента
  const getLocalizedContent = (product: Product) => {
    const currentLocale = locale as 'en' | 'ru' | 'uk';
    
    return {
      name: product.name_translations?.[currentLocale] || product.name,
      short_description: product.short_description_translations?.[currentLocale] || product.short_description,
      full_description: product.full_description_translations?.[currentLocale] || product.full_description,
      description_blocks: product.description_blocks_translations?.[currentLocale] || product.description_blocks || [],
    };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        const response = await fetch(`/api/products/public/${id}`);
        
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    if (!isInCart(product.id)) {
      const localizedContent = getLocalizedContent(product);
      
      addToCart({
        id: product.id,
        name: localizedContent.name,
        short_description: localizedContent.short_description,
        price: product.price,
        image_url: product.image_url,
      });
      
      // Показываем уведомление на 5 секунд
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.colors.accent }}></div>
          <p style={{ color: theme.colors.mutedForeground }}>Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: theme.colors.foreground }}>
            Product not found
          </h1>
          <p style={{ color: theme.colors.mutedForeground }} className="mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ 
              background: theme.colors.accent,
              color: theme.colors.background
            }}
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Shop
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
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: theme.colors.border,
                color: theme.colors.mutedForeground,
                background: theme.colors.card
              }}
            >
              <ArrowLeftIcon size={16} />
              Back to Shop
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {product.image_url ? (
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={getLocalizedContent(product).name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="aspect-square rounded-2xl flex items-center justify-center"
                  style={{ background: theme.colors.muted }}
                >
                  <span style={{ color: theme.colors.mutedForeground }}>
                    No image available
                  </span>
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Product Header */}
              <div>
                <h1 className="text-4xl font-bold mb-4" style={{ color: theme.colors.foreground }}>
                  {getLocalizedContent(product).name}
                </h1>
                <div className="text-3xl font-bold mb-6" style={{ color: theme.colors.accent }}>
                  {formatPrice(product.price)}
                </div>
                <div className="text-lg leading-relaxed prose prose-lg max-w-none" style={{ color: theme.colors.mutedForeground }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getLocalizedContent(product).short_description}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                  Description
                </h2>
                <div className="text-lg leading-relaxed prose prose-lg max-w-none" style={{ color: theme.colors.mutedForeground }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {getLocalizedContent(product).full_description}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Description Blocks */}
              {(() => {
                const localizedContent = getLocalizedContent(product);
                const descriptionBlocks = localizedContent.description_blocks;
                
                if (descriptionBlocks && descriptionBlocks.length > 0) {
                  return (
                    <div>
                      <h2 className="text-2xl font-semibold mb-6" style={{ color: theme.colors.foreground }}>
                        Features
                      </h2>
                      <div className="space-y-4">
                        {descriptionBlocks.map((block, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="p-6 rounded-2xl border"
                            style={{ 
                              background: "rgba(255, 255, 255, 0.1)",
                              borderColor: theme.colors.border 
                            }}
                          >
                            <h3 className="text-xl font-semibold mb-3" style={{ color: theme.colors.foreground }}>
                              {block.title}
                            </h3>
                            <div className="leading-relaxed prose prose-sm max-w-none" style={{ color: theme.colors.mutedForeground }}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {block.content}
                              </ReactMarkdown>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Add to Cart Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6"
              >
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart(product.id)}
                  className="w-full px-8 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-3 text-lg"
                  style={{
                    border: `2px solid ${isInCart(product.id) ? theme.colors.accent : theme.colors.mutedForeground}`,
                    color: isInCart(product.id) ? theme.colors.background : theme.colors.mutedForeground,
                    background: isInCart(product.id) ? theme.colors.accent : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isInCart(product.id)) {
                      const el = e.currentTarget;
                      el.style.background = theme.colors.muted;
                      el.style.color = theme.colors.foreground;
                      el.style.boxShadow = theme.shadow.soft;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isInCart(product.id)) {
                      const el = e.currentTarget;
                      el.style.background = "transparent";
                      el.style.color = theme.colors.mutedForeground;
                      el.style.boxShadow = "none";
                    }
                  }}
                >
                  {isInCart(product.id) ? (
                    <>
                      <CheckIcon size={20} />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Notification
        show={showNotification}
        type="success"
        title="Success"
        message="Product added to cart!"
        onClose={() => setShowNotification(false)}
        autoHide={true}
        duration={5000}
      />
    </main>
  );
}
