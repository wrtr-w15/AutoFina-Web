"use client";
import React, { useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <main className="min-h-dvh px-6" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <section className="relative flex items-start justify-center pt-8">

        <div className="relative w-full" style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight mb-8"
              style={{ 
                color: theme.colors.foreground, 
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                background: `linear-gradient(135deg, ${theme.colors.foreground} 0%, ${theme.colors.mutedForeground} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("faq.title")}
            </motion.h1>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ 
              hidden: {}, 
              show: { 
                transition: { 
                  staggerChildren: 0.2,
                  delayChildren: 0.6
                } 
              } 
            }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {t("faq.questions").map((item: any, i: number) => {
              const isOpen = openItems.includes(i);
              
              return (
                <motion.div
                  key={i}
                  variants={{ 
                    hidden: { opacity: 0, y: 40, scale: 0.9 }, 
                    show: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                        mass: 0.8
                      }
                    } 
                  }}
                  className="group"
                >
                  <motion.div
                    className="relative overflow-hidden rounded-2xl transition-all duration-300"
                    style={{
                      background: isOpen 
                        ? `linear-gradient(135deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`
                        : theme.colors.card,
                      border: `1px solid ${isOpen ? theme.colors.accent : theme.colors.border}`,
                      boxShadow: isOpen 
                        ? `0 20px 40px -12px ${theme.colors.accent}20, 0 0 0 1px ${theme.colors.accent}30`
                        : theme.shadow.soft,
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { 
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    }}
                    onClick={() => toggleItem(i)}
                  >
                    {/* Animated background glow */}
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      style={{
                        background: `radial-gradient(600px 200px at 50% 0%, ${theme.colors.accent}15, transparent 70%)`,
                      }}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative p-8">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ background: theme.colors.accent }}
                            animate={{
                              scale: isOpen ? 1.2 : 1,
                              rotate: isOpen ? 45 : 0,
                            }}
                            transition={{ 
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          />
                          <h3 
                            className="text-xl font-semibold"
                            style={{ color: theme.colors.foreground }}
                          >
                            {item.q}
                          </h3>
                        </div>
                        
                        <motion.div
                          animate={{
                            rotate: isOpen ? 45 : 0,
                          }}
                          transition={{ 
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          className="text-2xl"
                          style={{ color: theme.colors.accent }}
                        >
                          +
                        </motion.div>
                      </div>
                      
                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? "auto" : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="mt-6 pt-6"
                          style={{ 
                            borderTop: `1px solid ${theme.colors.border}`,
                            color: theme.colors.mutedForeground 
                          }}
                        >
                          <div className="prose prose-sm max-w-none">
                            <div 
                              className="leading-relaxed text-base whitespace-pre-line"
                              style={{ 
                                lineHeight: "1.7",
                                fontSize: "1.1rem"
                              }}
                            >
                              {item.a}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
