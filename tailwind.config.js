/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#5887FF',
          secondary: '#d1d5db',
          accent: '#f5f5f4',
          neutral: '#ffffff',
          'base-100': '#ffffff',
          info: '#6b7280',
          success: '#a7f3d0',
          warning: '#fcd34d',
          error: '#fda4af',
          '--rounded-btn': '0.5rem'
        }
      }
    ]
  }
}
