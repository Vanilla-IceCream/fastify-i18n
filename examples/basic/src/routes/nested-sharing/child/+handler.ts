import type { FastifyInstance } from 'fastify';
import { useI18n } from 'fastify-i18n';

export default async (app: FastifyInstance) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/nested-sharing/child \
         --header 'Accept-Language: ja-JP'
  */
  app.get('', async (request, reply) => {
    const i18n = useI18n(request);

    return reply.send({
      text: request.i18n.t('text'),
      pineapple: i18n.t('PINEAPPLE'),
    });
  });
};
