"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";
import { useAuth } from "@/context/AuthContext";
import { ProductsIcon, AddIcon, EditIcon, DeleteIcon, PackageIcon } from "@/components/Icons";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
  is_active: boolean;
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
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
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      const response = editingProduct 
        ? await fetch(`/api/products/${editingProduct.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          })
        : await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          });

      if (!response.ok) throw new Error('Failed to save product');
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', image_url: '', is_active: true });
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url || '',
      is_active: product.is_active
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', image_url: '', is_active: true });
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
          <p style={{ color: theme.colors.mutedForeground }}>Loading products...</p>
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
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/admin"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: theme.colors.mutedForeground }}
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: theme.colors.accent }}
            >
              + Add Product
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
            Products Management
          </h1>
          <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
            Manage your product catalog
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

        {/* Product Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl p-6 rounded-2xl border"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: theme.colors.foreground }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ 
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground 
                    }}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border resize-none"
                    style={{ 
                      background: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground 
                    }}
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border"
                      style={{ 
                        background: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground 
                      }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border"
                      style={{ 
                        background: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground 
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm" style={{ color: theme.colors.foreground }}>
                    Active (visible to customers)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors"
                    style={{ background: theme.colors.accent }}
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 rounded-lg border transition-colors"
                    style={{ 
                      borderColor: theme.colors.border,
                      color: theme.colors.mutedForeground 
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Products List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {!Array.isArray(products) || products.length === 0 ? (
            <div 
              className="text-center py-12 rounded-2xl border"
              style={{ 
                background: theme.colors.card,
                borderColor: theme.colors.border 
              }}
            >
              <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
                No products found. Add your first product!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 rounded-2xl border"
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
                      {product.description}
                    </p>
                    <div className="text-2xl font-bold mb-2" style={{ color: theme.colors.accent }}>
                      ${product.price}
                    </div>
                    <div className="text-xs" style={{ color: theme.colors.mutedForeground }}>
                      Created: {formatDate(product.created_at)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editProduct(product)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ 
                        background: theme.colors.accent,
                        color: 'white'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ 
                        background: '#ef4444',
                        color: 'white'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </div>
    );
}
