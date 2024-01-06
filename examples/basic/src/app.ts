import fastify from 'fastify';

import router from '~/plugins/router';
import i18n from '~/plugins/i18n';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  app.register(router);
  app.register(i18n);

  return app;
};
