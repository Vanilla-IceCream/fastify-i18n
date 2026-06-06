import type { FastifyInstance } from 'fastify';
import mi from 'message-interpolation';

export default async (app: FastifyInstance) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/hello-i18n \
         --header 'Accept-Language: ja-JP'
  */
  app.get('', async (request, reply) => {
    return reply.send({
      // text: request.i18n.text,
      // hello: mi(request.i18n.hello, { name: 'Fastify' }),
    });
  });
};
