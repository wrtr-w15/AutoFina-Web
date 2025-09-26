"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="min-h-dvh flex items-center justify-center px-6" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 
            className="text-9xl sm:text-[12rem] font-black"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.foreground} 0%, ${theme.colors.mutedForeground} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: theme.colors.foreground }}>
            {t("404.title")}
          </h2>
          <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
            {t("404.message")}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accent}CC 100%)`,
              color: "white",
              boxShadow: `0 8px 32px -8px ${theme.colors.accent}40, 0 0 0 1px ${theme.colors.accent}20`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 40px -8px ${theme.colors.accent}60, 0 0 0 1px ${theme.colors.accent}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 32px -8px ${theme.colors.accent}40, 0 0 0 1px ${theme.colors.accent}20`;
            }}
          >
            {t("404.backHome")}
          </Link>
          
          <Link
            href="/order"
            className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              border: `1px solid ${theme.colors.mutedForeground}`,
              color: theme.colors.mutedForeground,
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.muted;
              e.currentTarget.style.color = theme.colors.foreground;
              e.currentTarget.style.boxShadow = theme.shadow?.soft || "0 6px 20px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = theme.colors.mutedForeground;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {t("404.orderNow")}
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16"
        >
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1 + i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
                className="w-2 h-2 rounded-full"
                style={{ background: theme.colors.accent }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
