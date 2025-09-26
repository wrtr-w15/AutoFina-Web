// frontend/app/order/page.tsx
"use client";
import React from "react";
import theme from "@/themes/theme";
import OrderForm from "../../components/OrderForm";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";

export default function OrderPage() {
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
            {t("order.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
            style={{ color: theme.colors.mutedForeground }}
          >
            {t("order.subtitle")}
          </motion.p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <OrderForm />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}


