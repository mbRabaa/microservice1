import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.{ts,tsx}'],
    setupFiles: './tests/setup.ts',
    coverage: {
      enabled: true,
      include: ['src/**'],
      exclude: ['**/__mocks__/**']
    }
  }
})
