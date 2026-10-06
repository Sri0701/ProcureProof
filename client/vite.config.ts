import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      shared: path.resolve(root, '../shared/src/index.ts'),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:4010',
    },
  },
});
