"use client";

import { useEffect, useRef, useState } from "react";
import theme from "@/themes/theme";
import type { Locale } from "@/i18n";

interface LanguagePopoverProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function LanguagePopover({ currentLocale, onLocaleChange }: LanguagePopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const label = currentLocale.toUpperCase();
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
              aria-selected={currentLocale === code}
              onClick={() => {
                onLocaleChange(code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs"
              style={{
                color: currentLocale === code ? theme.colors.foreground : theme.colors.mutedForeground,
                background: "transparent",
              }}
            >
              <span>{code.toUpperCase()}</span>
              {currentLocale === code && (
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
