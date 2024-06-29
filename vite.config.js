import path from 'path'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      name: 'index',
      entry: path.resolve("src", "lib/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [
    react(),
    dts({
      include: path.resolve("src", "lib"),
      insertTypesEntry: true,
      tsconfigPath: path.resolve("./", "tsconfig.json"),
    }),
  ]
})