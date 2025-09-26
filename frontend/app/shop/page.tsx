'use client';

import React, { useEffect, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCartIcon, CheckIcon } from "@/components/Icons";
import Notification from "@/components/Notification";

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
  category_ids: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  name_translations: {
    en: string;
    ru: string;
    uk: string;
  };
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

  // Функция для получения переведенного контента
  const getLocalizedContent = (product: Product) => {
    const currentLocale = locale as 'en' | 'ru' | 'uk';
    
    return {
      name: product.name_translations?.[currentLocale] || product.name,
      short_description: product.short_description_translations?.[currentLocale] || product.short_description,
      full_description: product.full_description_translations?.[currentLocale] || product.full_description,
    };
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Закрытие popover при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSortPopover) {
        const target = event.target as Element;
        if (!target.closest('[data-sort-popover]')) {
          setShowSortPopover(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortPopover]);

  // Применяем фильтры при изменении products или filters
  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/public');
      
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const productsData = Array.isArray(data.data) ? data.data : [];
      console.log('Fetched products:', productsData);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Поиск по названию
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product => {
        const localizedContent = getLocalizedContent(product);
        return localizedContent.name.toLowerCase().includes(searchLower) ||
               localizedContent.short_description.toLowerCase().includes(searchLower);
      });
    }

    // Фильтр по категориям
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        product.category_ids && product.category_ids.some(id => filters.categories.includes(id))
      );
    }

    // Фильтр по цене
    if (filters.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return getLocalizedContent(a).name.localeCompare(getLocalizedContent(b).name);
        case 'name_desc':
          return getLocalizedContent(b).name.localeCompare(getLocalizedContent(a).name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    console.log('Filtered products:', filtered);
    setFilteredProducts(filtered);
  };

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      minPrice: null,
      maxPrice: null,
      sortBy: 'newest'
    });
  };

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
          <p style={{ color: theme.colors.mutedForeground }}>Loading products...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-dvh px-6 flex items-center justify-center" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
        <div className="text-center">
          <p style={{ color: '#ef4444' }}>Error loading products: {error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 rounded-lg border transition-colors"
            style={{ 
              borderColor: theme.colors.border,
              color: theme.colors.foreground,
              background: theme.colors.card
            }}
          >
            Try Again
          </button>
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
            {t("shop.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
            style={{ color: theme.colors.mutedForeground }}
          >
            {t("shop.subtitle")}
          </motion.p>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full px-4 py-3 pl-10 rounded-lg border transition-colors"
                    style={{
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground
                    }}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: theme.colors.mutedForeground }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 rounded-lg border transition-colors flex items-center gap-2"
                    style={{
                      background: showFilters ? theme.colors.accent : theme.colors.background,
                      borderColor: theme.colors.border,
                      color: showFilters ? theme.colors.background : theme.colors.foreground
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Filters
                  </button>

                  {/* Sort Icon */}
                  <div className="relative" data-sort-popover>
                    <button
                      onClick={() => setShowSortPopover(!showSortPopover)}
                      className="p-3 rounded-lg border transition-colors hover:bg-opacity-10"
                      style={{
                        background: showSortPopover ? theme.colors.accent + '20' : 'transparent',
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground
                      }}
                      title="Sort products"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {showSortPopover && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 p-2 rounded-lg border shadow-lg z-10 min-w-48"
                          style={{
                            background: theme.colors.card,
                            borderColor: theme.colors.border
                          }}
                        >
                          {[
                            { 
                              value: 'newest', 
                              label: 'Newest First', 
                              icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )
                            },
                            { 
                              value: 'price_asc', 
                              label: 'Price: Low to High', 
                              icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              )
                            },
                            { 
                              value: 'price_desc', 
                              label: 'Price: High to Low', 
                              icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              )
                            },
                            { 
                              value: 'name_asc', 
                              label: 'Name: A to Z', 
                              icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              )
                            },
                            { 
                              value: 'name_desc', 
                              label: 'Name: Z to A', 
                              icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              )
                            }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                updateFilters({ sortBy: option.value as any });
                                setShowSortPopover(false);
                              }}
                              className={`w-full px-3 py-2 rounded-md text-left text-sm transition-colors flex items-center gap-3 ${
                                filters.sortBy === option.value ? 'font-medium' : ''
                              }`}
                              style={{
                                background: filters.sortBy === option.value ? theme.colors.accent + '20' : 'transparent',
                                color: filters.sortBy === option.value ? theme.colors.accent : theme.colors.foreground
                              }}
                            >
                              {option.icon}
                              {option.label}
                            </button>
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-6 rounded-lg border"
                  style={{
                    background: theme.colors.card,
                    borderColor: theme.colors.border
                  }}
                >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: theme.colors.foreground }}>
                      Categories
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFilters({ categories: [...filters.categories, category.id] });
                              } else {
                                updateFilters({ categories: filters.categories.filter(id => id !== category.id) });
                              }
                            }}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: category.color }}
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm" style={{ color: theme.colors.foreground }}>
                              {category.name_translations?.[locale as keyof typeof category.name_translations] || category.name}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: theme.colors.foreground }}>
                      Price Range
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: theme.colors.mutedForeground }}>
                          Min Price ($)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.minPrice || ''}
                          onChange={(e) => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
                          className="w-full px-3 py-2 rounded-lg border text-sm"
                          style={{
                            background: theme.colors.background,
                            borderColor: theme.colors.border,
                            color: theme.colors.foreground
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ color: theme.colors.mutedForeground }}>
                          Max Price ($)
                        </label>
                        <input
                          type="number"
                          placeholder="No limit"
                          value={filters.maxPrice || ''}
                          onChange={(e) => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                          className="w-full px-3 py-2 rounded-lg border text-sm"
                          style={{
                            background: theme.colors.background,
                            borderColor: theme.colors.border,
                            color: theme.colors.foreground
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 rounded-lg border transition-colors"
                      style={{
                        background: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
                No products available
              </h3>
              <p style={{ color: theme.colors.mutedForeground }}>
                Check back later for new products
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product, i) => {
                const localizedContent = getLocalizedContent(product);
                
                return (
                  <motion.div
                    key={product.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    className="relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1 cursor-pointer"
                    style={{
                      background: `linear-gradient(180deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`,
                      boxShadow: theme.shadow.soft,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                    onClick={() => window.location.href = `/product/${product.id}`}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-1 opacity-40 blur-2xl"
                      style={{
                        background: `radial-gradient(600px 200px at 20% 0%, ${theme.colors.glowFrom}, transparent 70%)`,
                      }}
                    />
                    
                    <div className="relative">
                      {product.image_url && (
                        <div className="mb-4">
                          <img
                            src={product.image_url}
                            alt={localizedContent.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>
                          {localizedContent.name}
                        </h3>
                        <span className="text-lg font-bold" style={{ color: theme.colors.accent }}>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      
                      <p
                        className="mb-4 leading-relaxed"
                        style={{ color: theme.colors.mutedForeground }}
                      >
                        {localizedContent.short_description}
                      </p>
                    
                    {product.description_blocks && product.description_blocks.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {product.description_blocks.slice(0, 3).map((block, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              style={{ color: theme.colors.accent }}
                            >
                              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                              {block.title}
                            </span>
                          </div>
                        ))}
                        {product.description_blocks.length > 3 && (
                          <div className="text-xs" style={{ color: theme.colors.mutedForeground }}>
                            +{product.description_blocks.length - 3} more features
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={isInCart(product.id)}
                      className="w-full mt-6 px-4 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                      style={{
                        border: `1px solid ${isInCart(product.id) ? theme.colors.accent : theme.colors.mutedForeground}`,
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
                          <CheckIcon size={16} />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon size={16} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          )}
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