"use client";
import React from "react";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";

export default function FAQPage() {
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
            {t("faq.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
            style={{ color: theme.colors.mutedForeground }}
          >
            {t("faq.subtitle")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {t("faq.questions").map((item: any, i: number) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="group"
              >
                <details
                  className="rounded-xl p-6 transition-all duration-200"
                  style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <summary className="cursor-pointer select-none list-none text-lg font-medium">
                    <span className="inline-flex items-center gap-3" style={{ color: theme.colors.foreground }}>
                      <span
                        className="inline-block h-2 w-2 rounded-full transition-transform group-open:rotate-45"
                        style={{ background: theme.colors.accent }}
                      />
                      {item.q}
                    </span>
                  </summary>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pl-5"
                    style={{ color: theme.colors.mutedForeground }}
                  >
                    <p className="leading-relaxed">{item.a}</p>
                  </motion.div>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
