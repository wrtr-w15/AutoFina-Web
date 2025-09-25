// frontend/app/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import theme from "../themes/theme"
import { getDictionary } from "../i18n"
import LanguagePopover from "../components/LanguagePopover"

export default function Home() {
  const [locale, setLocale] = useState<'ru' | 'en' | 'uk'>('ru')
  const [dict, setDict] = useState(getDictionary('ru'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get locale from localStorage or default to 'ru'
    const savedLocale = localStorage.getItem('locale') as 'ru' | 'en' | 'uk' || 'ru'
    setLocale(savedLocale)
    setDict(getDictionary(savedLocale))
    setMounted(true)
  }, [])

  const handleLocaleChange = (newLocale: 'ru' | 'en' | 'uk') => {
    setLocale(newLocale)
    setDict(getDictionary(newLocale))
    localStorage.setItem('locale', newLocale)
  }
  // very smooth scroll + reveal-on-scroll + background blur on scroll
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

    // Background blur on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight
      const blurElement = document.getElementById('background-blur')
      
      if (blurElement) {
        // Calculate blur intensity based on scroll position
        const blurIntensity = Math.min(scrollY / (heroHeight * 0.5), 8) // Max blur of 8px
        blurElement.style.filter = `blur(${blurIntensity}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
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

      {/* Language selector in top-right corner */}
      {mounted && (
        <div className="fixed top-6 right-6 z-50">
          <LanguagePopover currentLocale={locale} onLocaleChange={handleLocaleChange} />
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative flex min-h-dvh items-center justify-center px-6">
        {/* Background image with scroll-based blur */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/images/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(0px)",
            transition: "filter 0.3s ease-out",
          }}
          id="background-blur"
        />
        
        {/* Overlay for better text readability */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "rgba(10,10,11,0.3)",
          }}
        />
        
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
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl sm:text-8xl font-black tracking-tight text-center"
            style={{
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: theme.colors.mutedForeground, // одинаковый цвет с кнопкой
            }}
          >
            {dict.app.brand}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-6 text-center text-lg sm:text-xl"
            style={{ color: theme.colors.mutedForeground }}
          >
            {dict.app.tagline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-10 flex items-center justify-center"
          >
            <Link
              href="/order"
              className="inline-flex items-center rounded-full px-6 py-3 font-semibold transition"
              style={{
                border: `1px solid ${theme.colors.mutedForeground}`,
                color: theme.colors.mutedForeground, // совпадает с h1
                background: "transparent",
              }}
            >
              {dict.app.cta_services}
            </Link>
          </motion.div>

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