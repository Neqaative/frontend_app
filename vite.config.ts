import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // load env from ../ because envDir is parent folder
  const env = loadEnv(mode, '../', '')

  return {
    plugins: [react()],
    envDir: '../',

    server: {
      port: 5173,

      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})