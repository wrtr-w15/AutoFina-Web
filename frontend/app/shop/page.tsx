"use client";
import React from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";

export default function ShopPage() {
  const { t } = useTranslation();

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

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {t("shop.cards").map((card: any, i: number) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1"
                style={{
                  background: `linear-gradient(180deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`,
                  boxShadow: theme.shadow.soft,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 opacity-40 blur-2xl"
                  style={{
                    background: `radial-gradient(600px 200px at 20% 0%, ${theme.colors.glowFrom}, transparent 70%)`,
                  }}
                />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold" style={{ color: theme.colors.foreground }}>
                      {card.title}
                    </h3>
                    <span className="text-lg font-bold" style={{ color: theme.colors.accent }}>
                      {card.price}
                    </span>
                  </div>
                  
                  <p
                    className="mb-4 leading-relaxed"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    {card.description}
                  </p>
                  
                  <div className="space-y-2">
                    {card.features.map((feature: string, j: number) => (
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
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className="w-full mt-6 px-4 py-2 rounded-xl font-semibold transition"
                    style={{
                      border: `1px solid ${theme.colors.mutedForeground}`,
                      color: theme.colors.mutedForeground,
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = theme.colors.muted;
                      el.style.color = theme.colors.foreground;
                      el.style.boxShadow = theme.shadow.soft;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "transparent";
                      el.style.color = theme.colors.mutedForeground;
                      el.style.boxShadow = "none";
                    }}
                  >
                    Order Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
