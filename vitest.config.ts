import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: '.env' });

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'tests/unit/**/*.{test,spec}.{ts,tsx}',    // Tests unitaires
      'tests/integration/**/*.{test,spec}.{ts,tsx}' // Tests d'intégration
    ],
    setupFiles: ['./tests/setup.ts'], // Assurez-vous que ce fichier existe
    exclude: [
      '**/actions-runner/**',
      'node_modules/**',
    ],
  },
});