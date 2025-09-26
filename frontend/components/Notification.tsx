"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import theme from "../themes/theme";

interface NotificationProps {
  show: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function Notification({
  show,
  type,
  title,
  message,
  onClose,
  autoHide = true,
  duration = 10000
}: NotificationProps) {
  React.useEffect(() => {
    if (show && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onClose]);

  const isError = type === "error";
  const iconColor = isError ? "#ef4444" : theme.colors.accent;
  const bgGradient = isError 
    ? `linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)`
    : `linear-gradient(135deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`;
  const borderColor = isError ? "#ef4444" : theme.colors.accent;
  const shadowColor = isError ? "#ef444430" : `${theme.colors.accent}30`;
  const textColor = isError ? "#dc2626" : theme.colors.foreground;
  const subtitleColor = isError ? "#dc2626" : theme.colors.mutedForeground;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="fixed bottom-6 right-6 z-50 max-w-xs rounded-3xl"
          style={{
            background: bgGradient,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 20px 40px -12px ${shadowColor}, 0 0 0 1px ${borderColor}20`,
          }}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: iconColor }}
              >
                {isError ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </motion.div>
              
              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-semibold mb-1"
                  style={{ color: textColor }}
                >
                  {title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm"
                  style={{ color: subtitleColor }}
                >
                  {message}
                </motion.p>
              </div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                style={{ color: theme.colors.mutedForeground }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
