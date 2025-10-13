import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 server: {
    host: '0.0.0.0',   // 👈 allows access from any IP (same Wi-Fi network)
    port: 5173,        // 👈 or your preferred port
  },
})
