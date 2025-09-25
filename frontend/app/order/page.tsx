// frontend/app/order/page.tsx
import React from "react";
import theme from "@/themes/theme";
import OrderForm from "../../components/OrderForm";

export default function OrderPage() {
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
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-4"
            style={{ color: theme.colors.mutedForeground, letterSpacing: "-0.02em" }}
          >
            Оформление заявки
          </h1>
          <p className="text-center mb-10" style={{ color: theme.colors.mutedForeground }}>
            Заполните форму и мы свяжемся с вами.
          </p>
          <div className="mx-auto" style={{ maxWidth: "720px" }}>
            <OrderForm />
          </div>
        </div>
      </section>
    </main>
  );
}


