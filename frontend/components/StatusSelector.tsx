'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
];

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          transition-all duration-200 hover:scale-105
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          backgroundColor: currentStatusOption?.color + '20',
          color: currentStatusOption?.color,
          border: `1px solid ${currentStatusOption?.color}40`,
        }}
      >
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: currentStatusOption?.color }}
        />
        {currentStatusOption?.label}
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[200px]"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onStatusChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                    flex items-center
                    ${currentStatus === option.value ? 'bg-gray-50' : ''}
                  `}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm font-medium" style={{ color: option.color }}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
