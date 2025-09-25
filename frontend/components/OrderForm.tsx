"use client";

import { useState } from "react";
import theme from "../themes/theme";

type OrderPayload = {
  name: string;
  phone: string;
  comment?: string;
};

export default function OrderForm() {
  const [form, setForm] = useState<OrderPayload>({ name: "", phone: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Не удалось отправить заказ");
      setSuccess("Заявка отправлена! Мы свяжемся с вами.");
      setForm({ name: "", phone: "", comment: "" });
    } catch (err: any) {
      setError(err.message || "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitOrder} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm mb-1" style={{ color: theme.colors.mutedForeground }}>Имя</label>
        <input
          className="w-full px-3 py-2 rounded"
          style={{
            background: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.foreground,
          }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: theme.colors.mutedForeground }}>Телефон</label>
        <input
          className="w-full px-3 py-2 rounded"
          style={{
            background: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.foreground,
          }}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: theme.colors.mutedForeground }}>Комментарий</label>
        <textarea
          className="w-full px-3 py-2 rounded"
          style={{
            background: theme.colors.muted,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.foreground,
          }}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded font-semibold transition disabled:opacity-60"
        style={{
          border: `1px solid ${theme.colors.mutedForeground}`,
          color: theme.colors.mutedForeground,
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.background = theme.colors.muted
          el.style.color = theme.colors.foreground
          el.style.boxShadow = theme.shadow.soft
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.background = "transparent"
          el.style.color = theme.colors.mutedForeground
          el.style.boxShadow = "none"
        }}
      >
        {loading ? "Отправка..." : "Отправить заявку"}
      </button>
      {success && <p className="text-sm" style={{ color: "#22c55e" }}>{success}</p>}
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
    </form>
  );
}


