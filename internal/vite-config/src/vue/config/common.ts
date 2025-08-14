import type { UserConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'

const commonConfig = (): UserConfig => {
  return {
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          assetFileNames: 'static/[ext]/asset-[name]-[hash].[ext]',
          chunkFileNames: 'static/js/chunk-[name]-[hash].js',
          entryFileNames: 'static/js/entry-[name]-[hash].js'
        }
      }
    },
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.warn', 'console.error']
    },
    plugins: [
      vue(),
      tailwindcss(),
      compression({
        algorithm: 'gzip',
        deleteOriginFile: false,
        ext: '.gz',
        threshold: 10240,
        verbose: false
      })
    ]
  }
}

export { commonConfig }
