import fastify from 'fastify';

// import i18n from '~/plugins/i18n.ts';
import router from '~/plugins/router.ts';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  // app.register(i18n);
  app.register(router);

  return app;
};
