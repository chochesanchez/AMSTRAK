/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Amstrak brand, sampled from the logo
        am: {
          navy: '#022C61',
          ink: '#0B1D3A',
          yellow: '#FBB505',
          yellowDark: '#E5A200',
          orange: '#F18606',
          paper: '#F6F5F2',
          line: '#E4E2DC',
          muted: '#56607A',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
