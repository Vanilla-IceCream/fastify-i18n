import type { FastifyInstance, FastifyRequest } from 'fastify';
import plugin from 'fastify-plugin';

type FastifyI18nOptions = {
  fallbackLocale: string;
  messages: Record<string, unknown>;
};

export default plugin<FastifyI18nOptions>(
  async (instance, options) => {
    //
  },
  {
    fastify: '5.x',
    name: 'fastify-i18n',
  },
);
