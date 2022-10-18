import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FastifyI18n',
      fileName: 'fastify-i18n',
    },
    rollupOptions: {
      external: ['fastify-plugin', 'node-polyglot'],
      output: {
        globals: {
          'fastify-plugin': 'FastifyPlugin',
          'node-polyglot': 'NodePolyglot',
        },
      },
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
});
