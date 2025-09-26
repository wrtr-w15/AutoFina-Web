'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";
import { useAuth } from "@/context/AuthContext";
import { ProductsIcon, AddIcon, EditIcon, DeleteIcon } from "@/components/Icons";
import { ProductForm } from "@/components/ProductForm";

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

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    if (!token) {
      setError('No authentication token available');
      return;
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Failed to create product');
      const data = await response.json();
      setProducts(prev => [...prev, data.data]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const updateProduct = async (productData: any) => {
    if (!token || !editingProduct) {
      setError('No authentication token available');
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.data : p));
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    if (!token) {
      setError('No authentication token available');
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.colors.accent }}></div>
          <p style={{ color: theme.colors.mutedForeground }}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
              <ProductsIcon className="inline mr-3" size={32} />
              Products Management
            </h1>
            <p style={{ color: theme.colors.mutedForeground }}>
              Manage your product catalog
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
                background: theme.colors.card
              }}
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              style={{ 
                background: theme.colors.accent,
                color: theme.colors.background
              }}
            >
              <AddIcon size={20} />
              Create Product
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              background: '#fef2f2',
              borderColor: '#fecaca',
              color: '#dc2626'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border p-6"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              {product.image_url && (
                <div className="mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>
                    {product.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: theme.colors.mutedForeground }}>
                  {product.short_description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold" style={{ color: theme.colors.accent }}>
                    ${product.price}
                  </span>
                  <span className="text-xs" style={{ color: theme.colors.mutedForeground }}>
                    {formatDate(product.created_at)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => editProduct(product)}
                  className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  style={{ color: '#3b82f6' }}
                  title="Edit product"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                  style={{ color: '#ef4444' }}
                  title="Delete product"
                >
                  <DeleteIcon size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ProductsIcon size={64} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
              No products yet
            </h3>
            <p style={{ color: theme.colors.mutedForeground }}>
              Create your first product to get started
            </p>
          </motion.div>
        )}

        {/* Product Form Modal */}
        <ProductForm
          isOpen={showCreateForm || !!editingProduct}
          onClose={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? updateProduct : createProduct}
          initialData={editingProduct ? {
            name: editingProduct.name,
            name_translations: editingProduct.name_translations,
            short_description: editingProduct.short_description,
            short_description_translations: editingProduct.short_description_translations,
            full_description: editingProduct.full_description,
            full_description_translations: editingProduct.full_description_translations,
            price: editingProduct.price,
            image_url: editingProduct.image_url || '',
            description_blocks: editingProduct.description_blocks,
            category_ids: editingProduct.category_ids,
            is_active: editingProduct.is_active
          } : undefined}
        />
      </div>
    </div>
  );
}