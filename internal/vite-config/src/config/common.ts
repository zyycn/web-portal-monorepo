import type { UserConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'
import checker_ from 'vite-plugin-checker'
import compression from 'vite-plugin-compression'
import devTools from 'vite-plugin-vue-devtools'

const root = process.cwd()

const commonConfig = (): UserConfig => {
  return {
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          assetFileNames: 'static/[ext]/asset-[name]-[hash].[ext]',
          chunkFileNames: 'static/js/chunk-[name]-[hash].js',
          entryFileNames: 'static/jse/entry-[name]-[hash].js'
        }
      }
    },
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.warn', 'console.error']
    },
    plugins: [
      vue(),
      jsx(),
      devTools(),
      tailwindcss(),
      checker_({
        eslint: {
          lintCommand: 'eslint src',
          useFlatConfig: true
        },
        root,
        stylelint: {
          lintCommand: 'stylelint src/**/*.{css,scss,vue}'
        },
        terminal: false,
        vueTsc: {
          tsconfigPath: 'tsconfig.app.json'
        }
      }),
      compression({
        algorithm: 'gzip',
        deleteOriginFile: false,
        ext: '.gz',
        threshold: 10240,
        verbose: false
      })
    ],
    resolve: {
      alias: {
        '@': resolve(root, 'src')
      }
    }
  }
}

export { commonConfig }
