import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '@/themes/theme';
import Checkbox from './Checkbox';

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

interface FilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  updateFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  categories: Category[];
  locale: string;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function FilterPopover({
  isOpen,
  onClose,
  filters,
  updateFilters,
  clearFilters,
  categories,
  locale,
  triggerRef
}: FilterPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="absolute top-full right-0 mt-2 p-2 rounded-lg border shadow-lg z-30 min-w-80"
          style={{
            background: theme.colors.card,
            borderColor: theme.colors.border
          }}
        >
          {/* Content */}
          <div className="space-y-3">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                Categories
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
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
                    delay={0.1}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                Price Range
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Min $" 
                  value={filters.minPrice || ''}
                  onChange={e => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-2 py-1.5 rounded-md border text-xs transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                  style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }} 
                />
                <input 
                  type="number" 
                  placeholder="Max $" 
                  value={filters.maxPrice || ''}
                  onChange={e => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-2 py-1.5 rounded-md border text-xs transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                  style={{ background: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.foreground }} 
                />
              </div>
            </div>

            {/* Clear Button */}
            <div className="flex justify-center pt-1">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs rounded-md border transition-all duration-200 hover:shadow-md"
                style={{ 
                  background: theme.colors.background, 
                  borderColor: theme.colors.border, 
                  color: theme.colors.mutedForeground 
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
