// frontend/app/page.tsx
"use client"

import React, { useEffect } from "react"
import theme from "../themes/theme"
import { getDictionary } from "../i18n"

export default function Home() {
  const dict = getDictionary(typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) : 'ru')
  // very smooth scroll + reveal-on-scroll
  useEffect(() => {
    // force smooth for all anchors
    document.documentElement.style.scrollBehavior = "smooth"

    const els = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main
      style={{ background: theme.colors.background, color: theme.colors.foreground }}
      className="min-h-dvh"
    >
      {/* Global tiny CSS for scrollbar + reveal */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        /* nice, minimal scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${theme.colors.background}; }
        ::-webkit-scrollbar-thumb { background: ${theme.colors.muted}; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.colors.border}; }
        [data-reveal] {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 700ms ease-out, transform 700ms ease-out;
          will-change: opacity, transform;
        }
        .reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      {/* HERO */}
      <section id="hero" className="relative flex min-h-dvh items-center justify-center px-6">
        {/* soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 20%, rgba(156,163,175,0.18), transparent 70%), radial-gradient(600px 300px at 80% 80%, rgba(156,163,175,0.10), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        <div
          className="relative w-full"
          style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}
        >
          <h1
            data-reveal
            className="text-5xl sm:text-7xl font-black tracking-tight text-center"
            style={{
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: theme.colors.mutedForeground, // одинаковый цвет с кнопкой
            }}
          >
            {dict.app.brand}
          </h1>

          {/* описание под названием — удалено */}

          <div className="mt-10 flex items-center justify-center">
            <a
              data-reveal
              onClick={scrollTo("services")}
              href="#services"
              className="inline-flex items-center rounded-full px-6 py-3 font-semibold transition"
              style={{
                border: `1px solid ${theme.colors.mutedForeground}`,
                color: theme.colors.mutedForeground, // совпадает с h1
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
              {dict.app.cta_services}
            </a>
          </div>

          {/* прыгающая стрелка — удалена */}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative px-6 py-24">
        <div style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <h2 data-reveal className="text-3xl sm:text-4xl font-bold mb-10">
            {dict.sections.services}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dict.home.services.cards.map((card, i) => (
              <article
                key={i}
                data-reveal
                className="relative overflow-hidden rounded-2xl p-6"
                style={{
                  background: `linear-gradient(180deg, ${theme.colors.card} 0%, ${theme.colors.muted} 100%)`,
                  boxShadow: theme.shadow.soft,
                  border: `1px solid ${theme.colors.border}`,
                  transitionDelay: `${i * 90}ms`,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 opacity-40 blur-2xl"
                  style={{
                    background: `radial-gradient(600px 200px at 20% 0%, ${theme.colors.glowFrom}, transparent 70%)`,
                  }}
                />
                <h3 className="relative text-xl font-semibold">{card.title}</h3>
                <p
                  className="relative mt-3 leading-relaxed"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  {card.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 pb-28">
        <div style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <h2 data-reveal className="text-3xl sm:text-4xl font-bold mb-10">
            {dict.sections.faq}
          </h2>

          <div className="space-y-4">
            {dict.home.faq.items.map((item, i) => (
              <details
                key={i}
                data-reveal
                className="group rounded-xl p-5"
                style={{
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                  transitionDelay: `${i * 90}ms`,
                }}
              >
                <summary className="cursor-pointer select-none list-none text-lg font-medium">
                  <span className="inline-flex items-center gap-2" style={{ color: theme.colors.foreground }}>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: theme.colors.accent }} />
                    {item.q}
                  </span>
                </summary>
                <p className="mt-3 pl-4" style={{ color: theme.colors.mutedForeground }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}