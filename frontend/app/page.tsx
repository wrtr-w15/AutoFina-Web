// frontend/app/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import theme from "../themes/theme"
import { getDictionary } from "../i18n"
import LanguagePopover from "../components/LanguagePopover"
import ProjectsCarousel from "../components/ProjectsCarousel"

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
        // Calculate blur intensity based on scroll position - increased blur
        const blurIntensity = Math.min(scrollY / (heroHeight * 0.3), 15) // Max blur of 15px
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
          <h2 data-reveal className="text-3xl sm:text-4xl font-bold mb-10 text-center">
            {dict.sections.services}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dict.home.services.cards.map((card, i) => (
              <article
                key={i}
                data-reveal
                className="relative overflow-hidden rounded-2xl p-8 min-h-[320px] flex flex-col"
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
                <div className="relative flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: theme.colors.mutedForeground }}
                    >
                      {card.desc}
                    </p>
                  </div>
                  <div className="space-y-3 mt-auto">
                    <h4 className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
                      Преимущества:
                    </h4>
                    <ul className="space-y-2">
                      {card.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-2">
                          <div className="mt-1 flex-shrink-0">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ color: theme.colors.accent }}
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                          <span className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS CAROUSEL */}
      <section id="projects" className="px-6 pb-28">
        <div style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <h2 data-reveal className="text-3xl sm:text-4xl font-bold mb-10 text-center">
            {dict.sections.projects}
          </h2>

          <ProjectsCarousel projects={dict.home.projects} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: theme.colors.border }}>
        <div style={{ maxWidth: theme.layout.maxWidth, marginInline: "auto" }}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm" style={{ color: theme.colors.mutedForeground }}>
              © 2024 AutoFina. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/autofina"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition hover:scale-110"
                style={{
                  color: theme.colors.mutedForeground,
                }}
                aria-label="Telegram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.57-4.13c.2-.18-.04-.28-.31-.1l-5.64 3.55-2.43-.76c-.53-.16-.54-.53.11-.79l9.57-3.69c.44-.16.83.1.68.79z"/>
                </svg>
              </a>
              <a
                href="https://discord.gg/autofina"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition hover:scale-110"
                style={{
                  color: theme.colors.mutedForeground,
                }}
                aria-label="Discord"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}