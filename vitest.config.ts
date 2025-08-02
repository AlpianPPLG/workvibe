/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/types/**',
        '**/app/api/**',
        '**/middleware.ts',
        '**/next.config.js',
        '**/next.config.mjs',
        '**/postcss.config.js',
        '**/tailwind.config.js',
        '**/eslint.config.js',
      ],
    },
  },
});
