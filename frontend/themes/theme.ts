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