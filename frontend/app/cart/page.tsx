"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import theme from "@/themes/theme";

export default function CartPage() {
  return (
    <div className="min-h-screen" style={{ background: theme.colors.background }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: theme.colors.foreground }}>
            Shopping Cart
          </h1>
          <p className="text-lg mb-8" style={{ color: theme.colors.mutedForeground }}>
            Your cart is empty
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg text-white font-medium transition-colors"
            style={{ background: theme.colors.accent }}
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
