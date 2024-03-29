import type { FastifyInstance } from 'fastify';
import { defineI18n, useI18n } from 'fastify-i18n';

export default async (app: FastifyInstance) => {
  defineI18n(app, import.meta.glob(['./locales/*.ts'], { eager: true }));

  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/hello-i18n \
         --header 'Accept-Language: ja-JP'
  */
  app.get('', async (request, reply) => {
    const i18n = useI18n(request);

    return reply.send({
      // global scope
      text: request.i18n.t('text'),

      // local scope (will overwrite the upper level)
      hello: i18n.t('hello', { name: 'Fastify' }),
    });
  });
};
