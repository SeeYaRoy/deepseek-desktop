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
      rollupOptions: {
        input: resolve('src/renderer/inject.ts'),
        output: {
          format: 'iife',
          inlineDynamicImports: true,
          entryFileNames: 'inject.js'
        }
      },
      outDir: 'build/renderer'
    }
  }
})
