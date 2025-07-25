import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: '/malla-reddy-university/',
  plugins: [react(),
    tailwindcss(),
  ],
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   base: '/malla-reddy-university/',
//   plugins: [react()],
// })
