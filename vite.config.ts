/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: { testTimeout: 30000, environment: 'jsdom', globals: true, setupFiles: ['./src/test-setup.ts'], css: false, include: ['src/**/*.test.tsx'] },
});
