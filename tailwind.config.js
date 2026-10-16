/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './features/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Panama', 'serif'],
      },
      // Map existing chat utility classes to loaded brand faces.
      fontWeight: {
        thin: '300', extralight: '300', light: '300', normal: '400',
        medium: '600', semibold: '600', bold: '600', extrabold: '600', black: '600',
      },
    },
  },
  plugins: [],
}
