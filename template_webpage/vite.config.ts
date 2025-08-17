import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.wgsl'],
  build: {
    rollupOptions: {
      input: 'src/app.ts',
    },
  },
  server: {
    port: 8000,
    open: true
  }
}); 