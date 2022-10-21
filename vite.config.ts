import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/fastify-i18n.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['fastify-plugin', 'node-polyglot'],
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [dts()],
});
