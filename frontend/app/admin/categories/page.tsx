'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";
import { useAuth } from "@/context/AuthContext";
import { TagIcon, AddIcon, EditIcon, DeleteIcon } from "@/components/Icons";

interface Category {
  id: number;
  name: string;
  name_translations: {
    en: string;
    ru: string;
    uk: string;
  };
  description: string;
  description_translations: {
    en: string;
    ru: string;
    uk: string;
  };
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
    window.scrollTo(0, 0);
  }, [token]);

  const fetchCategories = async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: any) => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error('Failed to create category');
      const data = await response.json();
      setCategories(prev => [...prev, data.data]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  };

  const updateCategory = async (id: number, categoryData: any) => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error('Failed to update category');
      const data = await response.json();
      setCategories(prev => prev.map(c => c.id === id ? data.data : c));
      setEditingCategory(null);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete category');
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowCreateForm(true);
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
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: theme.colors.mutedForeground }}>Loading categories...</p>
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
              onClick={() => {
                setEditingCategory(null);
                setShowCreateForm(true);
              }}
              className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: theme.colors.accent }}
            >
              <AddIcon size={16} className="inline mr-2" />
              Add Category
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
            Categories Management
          </h1>
          <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
            Manage product categories and tags
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

        {!Array.isArray(categories) || categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TagIcon size={64} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.foreground }}>
              No categories yet
            </h3>
            <p style={{ color: theme.colors.mutedForeground }}>
              Create your first category to get started
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 rounded-2xl border"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.border
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {category.color && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>
                      {category.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.is_active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {category.description && category.description.trim() && (
                  <p className="text-sm mb-4" style={{ color: theme.colors.mutedForeground }}>
                    {category.description}
                  </p>
                )}

                <div className="text-xs mb-4" style={{ color: theme.colors.mutedForeground }}>
                  Created: {formatDate(category.created_at)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: theme.colors.accent,
                      color: 'white'
                    }}
                  >
                    <EditIcon size={16} className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: '#ef4444',
                      color: 'white'
                    }}
                  >
                    <DeleteIcon size={16} className="inline mr-2" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showCreateForm && (
          <CategoryForm
            isOpen={showCreateForm}
            onClose={() => {
              setShowCreateForm(false);
              setEditingCategory(null);
            }}
            onSubmit={editingCategory ? (data) => updateCategory(editingCategory.id, data) : createCategory}
            initialData={editingCategory}
          />
        )}
      </div>
    </div>
  );
}

// Category Form Component
function CategoryForm({ isOpen, onClose, onSubmit, initialData }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Category | null;
}) {
  const [formData, setFormData] = useState({
    name: '',
    name_translations: {
      en: '',
      ru: '',
      uk: ''
    },
    description: '',
    description_translations: {
      en: '',
      ru: '',
      uk: ''
    },
    color: '#3b82f6',
    is_active: true
  });

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ru' | 'uk'>('en');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        name_translations: initialData.name_translations || { en: '', ru: '', uk: '' },
        description: initialData.description || '',
        description_translations: initialData.description_translations || { en: '', ru: '', uk: '' },
        color: initialData.color || '#3b82f6',
        is_active: initialData.is_active
      });
    } else {
      setFormData({
        name: '',
        name_translations: { en: '', ru: '', uk: '' },
        description: '',
        description_translations: { en: '', ru: '', uk: '' },
        color: '#3b82f6',
        is_active: true
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-6 rounded-2xl border"
        style={{
          background: theme.colors.card,
          borderColor: theme.colors.border
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.foreground }}>
          {initialData ? 'Edit Category' : 'Create Category'}
        </h2>

        {/* Language Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 p-1 rounded-lg border" style={{ borderColor: theme.colors.border, background: theme.colors.muted }}>
            {[
              { key: 'en', label: 'English', flag: '🇺🇸' },
              { key: 'ru', label: 'Русский', flag: '🇷🇺' },
              { key: 'uk', label: 'Українська', flag: '🇺🇦' }
            ].map((lang) => (
              <button
                key={lang.key}
                type="button"
                onClick={() => setActiveLanguage(lang.key as any)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeLanguage === lang.key
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{
                  background: activeLanguage === lang.key ? theme.colors.accent : 'transparent',
                  color: activeLanguage === lang.key ? theme.colors.background : theme.colors.mutedForeground
                }}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
              Name ({activeLanguage.toUpperCase()}) *
            </label>
            <input
              type="text"
              value={formData.name_translations[activeLanguage as keyof typeof formData.name_translations]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name_translations: {
                    ...formData.name_translations,
                    [activeLanguage]: e.target.value
                  }
                });
              }}
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
              Description ({activeLanguage.toUpperCase()})
            </label>
            <textarea
              value={formData.description_translations[activeLanguage as keyof typeof formData.description_translations]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description_translations: {
                    ...formData.description_translations,
                    [activeLanguage]: e.target.value
                  }
                });
              }}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
              style={{
                background: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.foreground
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-12 rounded-lg border cursor-pointer"
                style={{ borderColor: theme.colors.border }}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 px-4 py-3 rounded-lg border transition-colors"
                style={{
                  background: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground
                }}
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
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border transition-colors"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
                background: theme.colors.background
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg font-semibold transition-colors"
              style={{
                background: theme.colors.accent,
                color: theme.colors.background
              }}
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
