// frontend/themes/theme.ts
export type Theme = {
    colors: {
      background: string
      foreground: string
      muted: string
      mutedForeground: string
      primary: string
      primaryForeground: string
      accent: string
      accentForeground: string
      card: string
      cardForeground: string
      border: string
      ring: string
      glowFrom: string
      glowTo: string
    }
    gradients: {
      shimmer: {
        primary: string
        secondary: string
        tertiary: string
        radialBottom: string
        radialTop: string
      }
    }
    radius: {
      lg: string
      xl: string
      full: string
    }
    shadow: {
      soft: string
      hard: string
    }
    layout: {
      maxWidth: string
      gutter: string
    }
  }
  
  export const theme: Theme = {
    colors: {
      background: "#0a0a0b",
      foreground: "#f afafa",
      muted: "#1a1a1c",
      mutedForeground: "#9ca3af",
      primary: "#9ca3af",           // gray-400 (used subtly)
      primaryForeground: "#0b0b0f",
      accent: "#9ca3af",            // align accent to gray
      accentForeground: "#0b0b0f",
      card: "#0f0f12",
      cardForeground: "#e5e7eb",
      border: "#1f2937",
      ring: "#60a5fa",
      glowFrom: "rgba(156,163,175,0.18)",
      glowTo: "rgba(156,163,175,0.10)",
    },
    gradients: {
      shimmer: {
        primary: `
          linear-gradient(135deg, 
            rgba(0,0,0,0.98) 0%, 
            rgba(3,6,12,0.95) 15%, 
            rgba(8,12,22,0.9) 30%, 
            rgba(12,18,32,0.85) 45%, 
            rgba(16,24,42,0.8) 60%, 
            rgba(20,30,52,0.7) 75%, 
            rgba(24,36,62,0.5) 90%, 
            transparent 100%
          )
        `,
        secondary: `
          linear-gradient(135deg, 
            rgba(1,3,8,0.98) 0%, 
            rgba(4,8,18,0.95) 15%, 
            rgba(8,14,28,0.9) 30%, 
            rgba(12,20,38,0.85) 45%, 
            rgba(16,26,48,0.8) 60%, 
            rgba(20,32,58,0.7) 75%, 
            rgba(24,38,68,0.5) 90%, 
            transparent 100%
          )
        `,
        tertiary: `
          linear-gradient(135deg, 
            rgba(0,2,8,0.98) 0%, 
            rgba(3,6,18,0.95) 15%, 
            rgba(6,12,28,0.9) 30%, 
            rgba(9,18,38,0.85) 45%, 
            rgba(12,24,48,0.8) 60%, 
            rgba(15,30,58,0.7) 75%, 
            rgba(18,36,68,0.5) 90%, 
            transparent 100%
          )
        `,
        radialBottom: `
          radial-gradient(ellipse at bottom, rgba(8,12,22,0.4) 0%, transparent 70%)
        `,
        radialTop: `
          radial-gradient(ellipse at top, rgba(4,6,15,0.3) 0%, transparent 50%)
        `
      }
    },
    radius: {
      lg: "16px",
      xl: "24px",
      full: "9999px",
    },
    shadow: {
      soft: "0 10px 30px rgba(0,0,0,0.35)",
      hard: "0 20px 60px rgba(0,0,0,0.5)",
    },
    layout: {
      maxWidth: "1100px",
      gutter: "1rem",
    },
  }
  
  export default theme