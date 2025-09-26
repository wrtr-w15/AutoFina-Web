"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import theme from "@/themes/theme";
import { useTranslation, type Locale } from "@/i18n";
import { useCart } from "@/context/CartContext";
import { ShoppingCartIcon } from "@/components/Icons";

export default function SiteHeader() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const { getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/order", label: t("nav.order") },
    { href: "/shop", label: t("nav.available") },
    { href: "/faq", label: t("nav.faq") },
    // { href: "/guides", label: t("nav.guides") },
  ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(10,10,11,0.6)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="mx-auto flex items-center justify-between px-8" style={{ maxWidth: "1200px" }}>
        <nav className="flex items-center gap-6 py-4">
          {mounted && navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-light"
                style={{ color: active ? theme.colors.foreground : theme.colors.mutedForeground }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {mounted && <LanguagePopover current={locale} onSelect={setLocale} />}
          {mounted && (
            <Link
              href="/cart"
              className="relative p-2 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: theme.colors.mutedForeground }}
            >
              <ShoppingCartIcon size={20} />
              {getTotalItems() > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: theme.colors.accent,
                    color: theme.colors.background
                  }}
                >
                  {getTotalItems()}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function LanguagePopover({ current, onSelect }: { current: Locale; onSelect: (l: Locale) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const label = current.toUpperCase();
  const options: Locale[] = ["ru", "en", "uk"];

  return (
    <div ref={ref} className="relative py-3">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition"
        style={{
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.mutedForeground,
          background: "transparent",
        }}
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-70">
          <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl shadow-lg"
          style={{ background: theme.colors.muted, border: `1px solid ${theme.colors.border}` }}
        >
          {options.map((code) => (
            <button
              key={code}
              role="option"
              aria-selected={current === code}
              onClick={() => {
                onSelect(code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs"
              style={{
                color: current === code ? theme.colors.foreground : theme.colors.mutedForeground,
                background: "transparent",
              }}
            >
              <span>{code.toUpperCase()}</span>
              {current === code && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


