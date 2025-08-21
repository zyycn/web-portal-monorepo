import { defineConfig } from '@internal/vite-config'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { VITE_APP_PORT, VITE_APP_PREFIX } = loadEnv(mode, process.cwd())

  return {
    base: `/${VITE_APP_PREFIX}`,
    server: {
      port: Number(VITE_APP_PORT)
    }
  }
})
