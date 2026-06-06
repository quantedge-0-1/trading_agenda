/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#060a0f',
        surface:  '#111820',
        border:   '#1a2535',
        green:    '#00ff88',
        red:      '#ff3355',
        yellow:   '#ffcc00',
        blue:     '#0088ff',
        text:     '#e8edf2',
        muted:    '#3a4a5a',
        secondary:'#7a8a9a',
        'green-dim': '#00cc6a',
        'red-dim':   '#cc2244',
      },
      fontFamily: {
        mono:  ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
