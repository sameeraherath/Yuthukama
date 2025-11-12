import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Simulates browser environment
    globals: true, // Allows using describe, it, expect without imports
    setupFiles: './src/test/setup.js', // Setup file for test configuration
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

