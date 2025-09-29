"use client";
import React, { useState } from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";
import ShimmerGradient from "@/components/ShimmerGradient";

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

  const getSectionIcon = (sectionTitle: string, isOpen: boolean) => {
    const iconProps = {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      style: { color: theme.colors.accent }
    };

    switch (sectionTitle) {
      case "General Terms":
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "Payment and Transfer":
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v8m0 0v4m0-4h8m-8 0H4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case "Support":
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
          </svg>
        );
      case "Changes and Rights":
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 010-3.586l.696-.696a2.548 2.548 0 013.586 0L9.6 8.4" />
          </svg>
        );
      case "Other":
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  return (
    <main className="min-h-dvh px-6 relative" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <ShimmerGradient />
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
              className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8"
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
                        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)`
                        : "rgba(255, 255, 255, 0.1)",
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
                            className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                            animate={{
                              scale: isOpen ? 1.1 : 1,
                              rotate: isOpen ? 45 : 0,
                            }}
                            transition={{ 
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            {getSectionIcon(item.q, isOpen)}
                          </motion.div>
                          <h3 
                            className="text-lg font-semibold"
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
                              className="leading-relaxed text-sm whitespace-pre-line"
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
