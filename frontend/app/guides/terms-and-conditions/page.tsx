"use client";
import React from "react";
import { motion } from "framer-motion";
import theme from "@/themes/theme";
import { useTranslation } from "@/i18n";
import Link from "next/link";

export default function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <main className="min-h-dvh px-6" style={{ background: theme.colors.background, color: theme.colors.foreground }}>
      <section className="relative flex items-center justify-center py-20">
        <div className="relative w-full" style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <Link 
                  href="/order"
                  className="inline-flex items-center gap-2 text-sm transition"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("guides.backToOrder")}
                </Link>
                <div 
                  className="flex items-center gap-2 text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    color: "#22c55e"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {t("guides.formSaved")}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4" style={{ color: theme.colors.foreground }}>
                {t("guides.terms.title")}
              </h1>
              <p className="text-lg" style={{ color: theme.colors.mutedForeground }}>
                {t("guides.terms.subtitle")}
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                  {t("guides.terms.section1.title")}
                </h2>
                <div className="space-y-4" style={{ color: theme.colors.mutedForeground }}>
                  <p>{t("guides.terms.section1.content1")}</p>
                  <p>{t("guides.terms.section1.content2")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 rounded-2xl"
                style={{
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                  {t("guides.terms.section2.title")}
                </h2>
                <div className="space-y-4" style={{ color: theme.colors.mutedForeground }}>
                  <div>
                    <h3 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      {t("guides.terms.section2.item1.title")}
                    </h3>
                    <p>{t("guides.terms.section2.item1.content")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      {t("guides.terms.section2.item2.title")}
                    </h3>
                    <p>{t("guides.terms.section2.item2.content")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      {t("guides.terms.section2.item3.title")}
                    </h3>
                    <p>{t("guides.terms.section2.item3.content")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 rounded-2xl"
                style={{
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                  {t("guides.terms.section3.title")}
                </h2>
                <div className="space-y-4" style={{ color: theme.colors.mutedForeground }}>
                  <div>
                    <h3 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      {t("guides.terms.section3.item1.title")}
                    </h3>
                    <p>{t("guides.terms.section3.item1.content")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
                      {t("guides.terms.section3.item2.title")}
                    </h3>
                    <p>{t("guides.terms.section3.item2.content")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 rounded-2xl"
                style={{
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                  {t("guides.terms.section4.title")}
                </h2>
                <div className="space-y-4" style={{ color: theme.colors.mutedForeground }}>
                  <p>{t("guides.terms.section4.content")}</p>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                    <p className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
                      📞 {t("guides.terms.section4.contact")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
