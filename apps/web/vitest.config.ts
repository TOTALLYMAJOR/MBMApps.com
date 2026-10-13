import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname)
    }
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.{ts,tsx}', 'app/api/**/*.test.ts', 'middleware.test.ts']
  }
});
