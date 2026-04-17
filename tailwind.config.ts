import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        tl: {
          gold: 'var(--tl-gold)',
          gold600: 'var(--tl-gold-600)',
          gold200: 'var(--tl-gold-200)',
          blue: 'var(--tl-blue)',
          blue700: 'var(--tl-blue-700)',
          red: 'var(--tl-red)',
          red700: 'var(--tl-red-700)',
          ink: 'var(--tl-ink)',
          ink2: 'var(--tl-ink-2)',
          card: 'var(--tl-card)',
          line: 'var(--tl-line)'
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
        },
        tech: {
          red: "hsl(var(--tech-red))",
          blue: "hsl(var(--tech-blue))",
          cyan: "hsl(var(--tech-cyan))",
          purple: "hsl(var(--tech-purple))",
          white: "hsl(var(--tech-white))",
        },
      },
      backgroundImage: {
        'gradient-quantum': 'radial-gradient(1200px 600px at 20% -10%, rgba(212,175,55,.18) 0%, transparent 60%), radial-gradient(800px 400px at 90% 10%, rgba(16,84,255,.18) 0%, transparent 60%), radial-gradient(900px 500px at 60% 120%, rgba(225,29,46,.14) 0%, transparent 70%)',
        'gradient-gold': 'linear-gradient(90deg, var(--tl-gold-600), var(--tl-gold))',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-tech': 'var(--gradient-tech)',
        'gradient-hologram': 'var(--gradient-hologram)',
        'gradient-radial': 'var(--gradient-radial)',
        'gradient-blue': 'var(--gradient-blue)',
        'gradient-red': 'var(--gradient-red)',
      },
      boxShadow: {
        'ring-quantum': '0 0 0 6px var(--tl-glow)',
        'gold': 'var(--shadow-gold)',
        'card': 'var(--shadow-card)',
        'float': 'var(--shadow-float)',
        'neon': 'var(--shadow-neon)',
        'hologram': 'var(--shadow-hologram)',
        'tech-blue': 'var(--shadow-tech-blue)',
        'tech-red': 'var(--shadow-tech-red)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-rotate": "float-rotate 8s linear infinite",
        "pulse-gold": "pulse-gold 2s infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "data-flow": "data-flow 2s linear infinite",
        "pulse-circuit": "pulse-circuit 3s ease-in-out infinite",
        "neural-pulse": "neural-pulse 4s ease-in-out infinite",
        "matrix-rain": "matrix-rain 4s linear infinite",
        "hologram-flicker": "hologram-flicker 5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
