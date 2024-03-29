import { resolve } from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';
import fastifyRoutes from 'vite-plugin-fastify-routes';
import envify from 'process-envify';

export default defineConfig({
  define: envify({
    HOST: '127.0.0.1',
    PORT: 3000,
  }),
  plugins: [
    fastify({
      serverPath: './src/main.ts',
    }),
    fastifyRoutes(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
