import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const serverDir = fileURLToPath(new URL('../server/', import.meta.url))
  const env = loadEnv(mode, serverDir, 'API_')
  const port = process.env.API_PORT || env.API_PORT || '5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': `http://localhost:${port}`
      }
    }
  }
})
