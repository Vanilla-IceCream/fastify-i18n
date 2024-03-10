import type { FastifyInstance } from 'fastify';
import { defineI18n, useI18n } from 'fastify-i18n';

export default async (app: FastifyInstance) => {
  defineI18n(app, import.meta.glob(['./locales/*.ts'], { eager: true }));

  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/nested-override/child \
         --header 'Accept-Language: ja-JP'
  */
  app.get('', async (request, reply) => {
    const i18n = useI18n(request);

    return reply.send({
      text: request.i18n.t('text'),
      pineapple: i18n.t('PINEAPPLE'),
      apple: i18n.t('APPLE'),
      pen: i18n.t('PEN'),
    });
  });
};
