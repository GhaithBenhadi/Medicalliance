import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: ['chrome87', 'firefox78', 'safari14', 'edge88'],
  },
})
