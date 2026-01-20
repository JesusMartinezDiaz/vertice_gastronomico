/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  test: {
    setupFiles: './src/tests/setup.ts',
    environment: 'happy-dom',
    globals: true,
    // Excluir archivos .jest.js (son para Jest, no Vitest)
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.jest.{js,jsx,ts,tsx}',
    ],
  },
});
