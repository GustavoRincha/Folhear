/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base backgrounds & surfaces
        "background": "#F7F7F8",
        "on-background": "#0F172A",
        "surface": "#F7F7F8",
        "surface-bright": "#FFFFFF",
        "surface-dim": "#E2E8F0",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F1F5F9",
        "surface-container": "#E2E8F0",
        "surface-container-high": "#CBD5E1",
        "surface-container-highest": "#94A3B8",
        "surface-variant": "#E2E8F0",
        
        // Text colors
        "on-surface": "#0F172A",
        "on-surface-variant": "#64748B",
        "outline": "#94A3B8",
        "outline-variant": "#E2E8F0",

        // Primária: Header / Botão + (#1E293B)
        "primary": "#1E293B",
        "on-primary": "#FFFFFF",
        "primary-container": "#E2E8F0",
        "on-primary-container": "#1E293B",
        "primary-fixed": "#E2E8F0",
        "primary-fixed-dim": "#CBD5E1",
        "on-primary-fixed": "#1E293B",
        "on-primary-fixed-variant": "#334155",
        "surface-tint": "#334155",

        // Destaques / Acentos (#3B82F6)
        "accent": "#3B82F6",
        "accent-hover": "#2563EB",
        "on-accent": "#FFFFFF",
        "accent-container": "#DBEAFE",
        "on-accent-container": "#1D4ED8",

        // Secondary (Destaques)
        "secondary": "#3B82F6",
        "secondary-container": "#DBEAFE",
        "on-secondary-container": "#1E40AF",
        "on-secondary": "#FFFFFF",
        "secondary-fixed": "#DBEAFE",
        "secondary-fixed-dim": "#BFDBFE",
        "on-secondary-fixed": "#1E3A8A",
        "on-secondary-fixed-variant": "#1D4ED8",

        // Tertiary / Status
        "tertiary": "#059669",
        "tertiary-container": "#D1FAE5",
        "on-tertiary-container": "#065F46",
        "on-tertiary": "#FFFFFF",
        "tertiary-fixed": "#A7F3D0",
        "tertiary-fixed-dim": "#6EE7B7",
        "on-tertiary-fixed": "#064E3B",
        "on-tertiary-fixed-variant": "#047857",

        // Error
        "error": "#EF4444",
        "error-container": "#FEE2E2",
        "on-error-container": "#991B1B",
        "on-error": "#FFFFFF",

        // Inverse
        "inverse-surface": "#1E293B",
        "inverse-on-surface": "#F7F7F8",
        "inverse-primary": "#93C5FD"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "0.25rem",
        "md": "0.75rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "base": "4px",
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "32px",
        "xl": "48px",
        "container-margin": "24px",
        "gutter": "20px"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-xl": ["Manrope", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-xl-mobile": ["Manrope", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Manrope", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"]
      },
      fontSize: {
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-xl": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "800" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-xl-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "800" }],
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-md": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "headline-lg": ["24px", { "lineHeight": "32px", "fontWeight": "700" }]
      }
    }
  },
  plugins: []
}
