import React from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  color?: string;
  index?: number;
  delay?: number;
  className?: string;
}

export default function Checkbox({ 
  id, 
  checked, 
  onChange, 
  label, 
  color = '#3b82f6',
  index = 0,
  delay = 0,
  className = ""
}: CheckboxProps) {
  return (
    <motion.label 
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: delay + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 80,
        damping: 15
      }}
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      <div className="relative">
        <input 
          type="checkbox" 
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded-lg border-2 transition-all duration-200 opacity-0 absolute" 
          style={{ borderColor: color }} 
        />
        <div 
          className={`w-4 h-4 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
            checked ? 'border-opacity-100' : 'border-opacity-50'
          }`}
          style={{ 
            borderColor: checked ? color : '#9ca3af',
            backgroundColor: checked ? color : 'transparent'
          }}
        >
          {checked && (
            <svg 
              className="w-2.5 h-2.5 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: color }} 
        />
        <span 
          className="text-sm" 
          style={{ color: 'var(--foreground)' }}
        >
          {label}
        </span>
      </div>
    </motion.label>
  );
}
