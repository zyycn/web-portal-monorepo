import type { UserConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
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
          lintCommand: 'eslint .',
          useFlatConfig: true
        },
        root,
        stylelint: {
          lintCommand: 'stylelint src/**/*.{css,scss,vue}'
        },
        terminal: false,
        vueTsc: true
      }),
      compression({
        algorithm: 'gzip',
        deleteOriginFile: false,
        ext: '.gz',
        threshold: 10240,
        verbose: false
      }),
      AutoImport({
        dts: 'types/auto-imports.d.ts',
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: 'types/components.d.ts',
        globs: [],
        resolvers: [ElementPlusResolver()]
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
