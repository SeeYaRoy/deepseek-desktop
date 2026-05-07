import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve('src/main/index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.js'
      },
      outDir: 'build/main',
      rollupOptions: {
        external: ['electron', 'better-sqlite3', 'electron-store', 'electron-updater']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve('src/preload/index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.js'
      },
      outDir: 'build/preload'
    }
  },
  renderer: {
    build: {
      lib: {
        entry: resolve('src/renderer/inject.ts'),
        formats: ['iife'],
        name: 'DeepSeekInject',
        fileName: () => 'inject.js'
      },
      outDir: 'build/renderer',
      rollupOptions: {
        output: {
          inlineDynamicImports: true
        }
      }
    }
  }
})
