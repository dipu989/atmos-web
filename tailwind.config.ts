import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'horizon-blue': '#4A90C4',
        'sage': '#3DAB82',
        'peach': '#F0956A',
        'alert-red': '#E05252',

        // Semantic colors
        'bg-page': '#F5F7FA',
        'bg-card': '#FFFFFF',
        'text-primary': '#1A2332',
        'text-secondary': '#6B7A8D',
        'divider': '#F0F2F5',

        // UI colors for shadcn/ui
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'card': 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        'popover': 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        'muted': 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'accent': 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        'destructive': 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': ['15px', { lineHeight: '1.5' }],
        'label': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'subheading': ['17px', { lineHeight: '1.5', fontWeight: '600' }],
        'heading': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
