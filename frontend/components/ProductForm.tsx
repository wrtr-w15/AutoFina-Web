'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, AddIcon, DeleteIcon } from '@/components/Icons';
import theme from '@/themes/theme';

interface DescriptionBlock {
  title: string;
  content: string;
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

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: {
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
    image_url: string;
    description_blocks: DescriptionBlock[];
    category_ids: number[];
    is_active: boolean;
  }) => void;
  initialData?: {
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
    image_url: string;
    description_blocks: DescriptionBlock[];
    category_ids: number[];
    is_active: boolean;
  };
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    name_translations: initialData?.name_translations || {
      en: '',
      ru: '',
      uk: ''
    },
    short_description: initialData?.short_description || '',
    short_description_translations: initialData?.short_description_translations || {
      en: '',
      ru: '',
      uk: ''
    },
    full_description: initialData?.full_description || '',
    full_description_translations: initialData?.full_description_translations || {
      en: '',
      ru: '',
      uk: ''
    },
    price: initialData?.price || 0,
    image_url: initialData?.image_url || '',
    description_blocks: initialData?.description_blocks || [{ title: '', content: '' }],
    category_ids: initialData?.category_ids || [],
    is_active: initialData?.is_active ?? true
  });

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ru' | 'uk'>('en');
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories when component mounts
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.short_description.trim()) {
      newErrors.short_description = 'Short description is required';
    }

    if (!formData.full_description.trim()) {
      newErrors.full_description = 'Full description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    // Validate description blocks
    formData.description_blocks.forEach((block, index) => {
      if (!block.title.trim()) {
        newErrors[`block_title_${index}`] = 'Block title is required';
      }
      if (!block.content.trim()) {
        newErrors[`block_content_${index}`] = 'Block content is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const addDescriptionBlock = () => {
    setFormData(prev => ({
      ...prev,
      description_blocks: [...prev.description_blocks, { title: '', content: '' }]
    }));
  };

  const removeDescriptionBlock = (index: number) => {
    if (formData.description_blocks.length > 1) {
      setFormData(prev => ({
        ...prev,
        description_blocks: prev.description_blocks.filter((_, i) => i !== index)
      }));
    }
  };

  const updateDescriptionBlock = (index: number, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      description_blocks: prev.description_blocks.map((block, i) => 
        i === index ? { ...block, [field]: value } : block
      )
    }));
  };

  const toggleCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border"
            style={{ 
              background: theme.colors.card,
              borderColor: theme.colors.border 
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.colors.border }}>
              <h2 className="text-2xl font-bold" style={{ color: theme.colors.foreground }}>
                {initialData ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: theme.colors.mutedForeground }}
              >
                <XIcon size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Product Name ({activeLanguage.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_translations[activeLanguage as keyof typeof formData.name_translations]}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        name_translations: {
                          ...prev.name_translations,
                          [activeLanguage]: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{ 
                      background: theme.colors.background,
                      borderColor: errors.name ? '#ef4444' : theme.colors.border,
                      color: theme.colors.foreground
                    }}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                    Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{ 
                      background: theme.colors.background,
                      borderColor: errors.price ? '#ef4444' : theme.colors.border,
                      color: theme.colors.foreground
                    }}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border transition-colors"
                  style={{ 
                    background: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.foreground
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                  Short Description ({activeLanguage.toUpperCase()}) *
                </label>
                <textarea
                  value={formData.short_description_translations[activeLanguage as keyof typeof formData.short_description_translations]}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      short_description_translations: {
                        ...prev.short_description_translations,
                        [activeLanguage]: e.target.value
                      }
                    }));
                  }}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                  style={{ 
                    background: theme.colors.background,
                    borderColor: errors.short_description ? '#ef4444' : theme.colors.border,
                    color: theme.colors.foreground
                  }}
                  placeholder="Brief description that will appear in the product card"
                />
                {errors.short_description && (
                  <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.short_description}</p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                  Full Description ({activeLanguage.toUpperCase()}) *
                </label>
                <textarea
                  value={formData.full_description_translations[activeLanguage as keyof typeof formData.full_description_translations]}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      full_description_translations: {
                        ...prev.full_description_translations,
                        [activeLanguage]: e.target.value
                      }
                    }));
                  }}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                  style={{ 
                    background: theme.colors.background,
                    borderColor: errors.full_description ? '#ef4444' : theme.colors.border,
                    color: theme.colors.foreground
                  }}
                  placeholder="Detailed description of the product"
                />
                {errors.full_description && (
                  <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.full_description}</p>
                )}
              </div>

              {/* Categories Selection */}
              <div>
                <label className="block text-sm font-medium mb-4" style={{ color: theme.colors.foreground }}>
                  Categories (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        formData.category_ids.includes(category.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        borderColor: formData.category_ids.includes(category.id) 
                          ? theme.colors.accent 
                          : theme.colors.border,
                        background: formData.category_ids.includes(category.id) 
                          ? theme.colors.accent + '20' 
                          : theme.colors.background
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
                          {category.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No categories available. Create categories first in the Categories section.
                  </p>
                )}
              </div>

              {/* Description Blocks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium" style={{ color: theme.colors.foreground }}>
                    Description Blocks
                  </label>
                  <button
                    type="button"
                    onClick={addDescriptionBlock}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      background: theme.colors.accent + '20',
                      color: theme.colors.accent,
                      border: `1px solid ${theme.colors.accent}40`
                    }}
                  >
                    <AddIcon size={16} />
                    Add Block
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.description_blocks.map((block, index) => (
                    <div key={index} className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border }}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium" style={{ color: theme.colors.foreground }}>
                          Block {index + 1}
                        </h4>
                        {formData.description_blocks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDescriptionBlock(index)}
                            className="p-1 rounded hover:bg-red-100 transition-colors"
                            style={{ color: '#ef4444' }}
                          >
                            <DeleteIcon size={16} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            value={block.title}
                            onChange={(e) => updateDescriptionBlock(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border text-sm"
                            style={{ 
                              background: theme.colors.background,
                              borderColor: errors[`block_title_${index}`] ? '#ef4444' : theme.colors.border,
                              color: theme.colors.foreground
                            }}
                            placeholder="Block title"
                          />
                          {errors[`block_title_${index}`] && (
                            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                              {errors[`block_title_${index}`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <textarea
                            value={block.content}
                            onChange={(e) => updateDescriptionBlock(index, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                            style={{ 
                              background: theme.colors.background,
                              borderColor: errors[`block_content_${index}`] ? '#ef4444' : theme.colors.border,
                              color: theme.colors.foreground
                            }}
                            placeholder="Block content"
                          />
                          {errors[`block_content_${index}`] && (
                            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                              {errors[`block_content_${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is_active" className="text-sm" style={{ color: theme.colors.foreground }}>
                  Active (visible to customers)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg border transition-colors"
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
                  className="px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ 
                    background: theme.colors.accent,
                    color: theme.colors.background
                  }}
                >
                  {initialData ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
