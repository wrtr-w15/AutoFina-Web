'use client';

import React, { useEffect, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCartIcon, CheckIcon } from "@/components/Icons";
import Notification from "@/components/Notification";
import Checkbox from "@/components/Checkbox";

interface Product {
  id: number;
  name: string;
  name_translations: { en: string; ru: string; uk: string };
  short_description: string;
  short_description_translations: { en: string; ru: string; uk: string };
  full_description: string;
  full_description_translations: { en: string; ru: string; uk: string };
  price: number;
  image_url?: string;
  description_blocks: Array<{ title: string; content: string }>;
  category_ids: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  name_translations: { en: string; ru: string; uk: string };
  color: string;
  is_active: boolean;
}

interface Filters {
  search: string;
  categories: number[];
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

export default function ShopPage() {
  const { t, locale } = useTranslation();
  const { addToCart, isInCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortPopover, setShowSortPopover] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    categories: [],
    minPrice: null,
    maxPrice: null,
    sortBy: 'newest'
  });

  const getLocalizedContent = (product: Product) => {
    const currentLocale = locale as 'en' | 'ru' | 'uk';
    return {
      name: product.name_translations?.[currentLocale] || product.name,
      short_description: product.short_description_translations?.[currentLocale] || product.short_description,
      full_description: product.full_description_translations?.[currentLocale] || product.full_description,
    };
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSortPopover) {
        const target = event.target as Element;
        if (!target.closest('[data-sort-popover]')) setShowSortPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortPopover]);

  useEffect(() => { if (products.length > 0) applyFilters(); }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/public');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const productsData = Array.isArray(data.data) ? data.data : [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) { console.error('Failed to fetch categories:', err); }
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => {
        const c = getLocalizedContent(p);
        return c.name.toLowerCase().includes(s) || c.short_description.toLowerCase().includes(s);
      });
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => p.category_ids?.some(id => filters.categories.includes(id)));
    }
    if (filters.minPrice !== null) filtered = filtered.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice !== null) filtered = filtered.filter(p => p.price <= filters.maxPrice!);

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'name_asc': return getLocalizedContent(a).name.localeCompare(getLocalizedContent(b).name);
        case 'name_desc': return getLocalizedContent(b).name.localeCompare(getLocalizedContent(a).name);
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
    setFilteredProducts(filtered);
  };

  const updateFilters = (f: Partial<Filters>) => setFilters(prev => ({ ...prev, ...f }));
  const clearFilters = () => setFilters({ search: '', categories: [], minPrice: null, maxPrice: null, sortBy: 'newest' });
  const formatPrice = (p: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(p);

  const handleAddToCart = (product: Product) => {
    if (!isInCart(product.id)) {
      const c = getLocalizedContent(product);
      addToCart({ id: product.id, name: c.name, short_description: c.short_description, price: product.price, image_url: product.image_url });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  if (loading)
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.colors.accent }} />
          <p style={{ color: theme.colors.mutedForeground }}>Loading products...</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <p style={{ color: '#ef4444' }}>Error loading products: {error}</p>
          <button onClick={fetchProducts} className="mt-4 px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: theme.colors.border, color: theme.colors.foreground, background: theme.colors.card }}>
            Try Again
          </button>
        </div>
      </main>
    );

  return (
    <main className="min-h-dvh px-6" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <section className="relative flex items-center justify-center py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(800px 400px at 50% 20%, rgba(156,163,175,0.18), transparent 70%), radial-gradient(600px 300px at 80% 80%, rgba(156,163,175,0.10), transparent 70%)", filter: "blur(2px)" }} />
        <div className="relative w-full" style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-2"
            style={{ color: theme.colors.mutedForeground, letterSpacing: "-0.02em" }}>{t("shop.title")}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12" style={{ color: theme.colors.mutedForeground }}>{t("shop.subtitle")}</motion.p>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <input type="text" placeholder="Search products..." value={filters.search} onChange={e => updateFilters({ search: e.target.value })}
                    className="w-full px-4 py-3 pl-10 rounded-lg border transition-colors"
                    style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }} />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.mutedForeground }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 relative hover:bg-opacity-10"
                    style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Filters
                    {(() => {
                      const count = (filters.categories.length > 0 ? 1 : 0) + (filters.minPrice !== null ? 1 : 0) + (filters.maxPrice !== null ? 1 : 0);
                      return count > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                          style={{ background: theme.colors.mutedForeground, color: theme.colors.background }}>{count}</span>);
                    })()}
                  </button>

                  <div className="relative" data-sort-popover>
                    <button onClick={() => setShowSortPopover(!showSortPopover)}
                      className="px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 relative hover:bg-opacity-10"
                      style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      Sort
                      {filters.sortBy !== 'newest' && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                          style={{ background: theme.colors.mutedForeground, color: theme.colors.background }}>1</span>)}
                    </button>

                    <AnimatePresence>
                      {showSortPopover && (
                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 p-2 rounded-lg border shadow-lg z-10 min-w-48"
                          style={{ background: theme.colors.card, borderColor: theme.colors.border }}>
                          {[
                            { value: 'newest', label: 'Newest First' },
                            { value: 'price_asc', label: 'Price: Low to High' },
                            { value: 'price_desc', label: 'Price: High to Low' },
                            { value: 'name_asc', label: 'Name: A to Z' },
                            { value: 'name_desc', label: 'Name: Z to A' }
                          ].map(o => (
                            <button key={o.value} onClick={() => { updateFilters({ sortBy: o.value as Filters['sortBy'] }); setShowSortPopover(false); }}
                              className={`w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${filters.sortBy === o.value ? 'font-medium' : ''}`}
                              style={{
                                background: filters.sortBy === o.value ? theme.colors.accent + '20' : 'transparent',
                                color: filters.sortBy === o.value ? theme.colors.accent : theme.colors.foreground
                              }}>{o.label}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -20 }} 
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    height: { 
                      duration: 0.6, 
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }
                  }}
                  className="mt-6 p-6 rounded-lg border overflow-hidden"
                  style={{ background: theme.colors.card, borderColor: theme.colors.border }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Categories */}
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                        mass: 0.8
                      }}
                    >
                      <label className="block text-sm font-medium mb-3" style={{ color: theme.colors.foreground }}>Categories</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {categories.map((c, index) => (
                          <Checkbox
                            key={c.id}
                            id={`category-${c.id}`}
                            checked={filters.categories.includes(c.id)}
                            onChange={(checked) => updateFilters({
                              categories: checked
                                ? [...filters.categories, c.id]
                                : filters.categories.filter(id => id !== c.id)
                            })}
                            label={c.name_translations?.[locale as keyof typeof c.name_translations] || c.name}
                            color={c.color}
                            index={index}
                            delay={0.6}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Price */}
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                        mass: 0.8
                      }}
                    >
                      <label className="block text-sm font-medium mb-3" style={{ color: theme.colors.foreground }}>Price Range</label>
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            type: "spring",
                            stiffness: 80,
                            damping: 15
                          }}
                        >
                          <label className="block text-xs mb-1" style={{ color: theme.colors.mutedForeground }}>Min Price ($)</label>
                          <input type="number" placeholder="0" value={filters.minPrice || ''}
                            onChange={e => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
                            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }} />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            type: "spring",
                            stiffness: 80,
                            damping: 15
                          }}
                        >
                          <label className="block text-xs mb-1" style={{ color: theme.colors.mutedForeground }}>Max Price ($)</label>
                          <input type="number" placeholder="No limit" value={filters.maxPrice || ''}
                            onChange={e => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }} />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Clear */}
                    <motion.div 
                      className="flex items-end"
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                        mass: 0.8
                      }}
                    >
                      <motion.button 
                        onClick={clearFilters} 
                        whileHover={{ 
                          scale: 1.02,
                          transition: { 
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          transition: { 
                            duration: 0.2,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border transition-all duration-300 hover:shadow-md"
                        style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }}>
                        Clear All Filters
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>No products available</h3>
              <p style={{ color: theme.colors.mutedForeground }}>Check back later for new products</p>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const c = getLocalizedContent(product);
                return (
                  <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    className="relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1 cursor-pointer"
                    style={{ background: `linear-gradient(180deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`,
                      boxShadow: theme.shadow.soft, border: `1px solid ${theme.colors.border}` }}
                    onClick={() => window.location.href = `/product/${product.id}`}>
                    {product.image_url && (
                      <div className="mb-4">
                        <img src={product.image_url} alt={c.name} className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>{c.name}</h3>
                      <span className="text-lg font-bold" style={{ color: theme.colors.accent }}>{formatPrice(product.price)}</span>
                    </div>
                    <p className="mb-4 leading-relaxed" style={{ color: theme.colors.mutedForeground }}>{c.short_description}</p>

                    {product.description_blocks?.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {product.description_blocks.slice(0, 3).map((b, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              style={{ color: theme.colors.accent }}>
                              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm" style={{ color: theme.colors.mutedForeground }}>{b.title}</span>
                          </div>
                        ))}
                        {product.description_blocks.length > 3 && (
                          <div className="text-xs" style={{ color: theme.colors.mutedForeground }}>
                            +{product.description_blocks.length - 3} more features
                          </div>
                        )}
                      </div>
                    )}

                    <button onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                      disabled={isInCart(product.id)}
                      className="w-full mt-6 px-4 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                      style={{
                        border: `1px solid ${isInCart(product.id) ? theme.colors.accent : theme.colors.mutedForeground}`,
                        color: isInCart(product.id) ? theme.colors.background : theme.colors.mutedForeground,
                        background: isInCart(product.id) ? theme.colors.accent : "transparent"
                      }}>
                      {isInCart(product.id) ? (<><CheckIcon size={16} />In Cart</>) : (<><ShoppingCartIcon size={16} />Add to Cart</>)}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
      <Notification show={showNotification} type="success" title="Success" message="Product added to cart!"
        onClose={() => setShowNotification(false)} autoHide duration={5000} />
    </main>
  );
}