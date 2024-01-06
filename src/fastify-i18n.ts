import type { FastifyInstance, FastifyRequest } from 'fastify';
import plugin from 'fastify-plugin';
import Polyglot from 'node-polyglot';

type FastifyI18nOptions = {
  fallbackLocale: string;
  messages: Record<string, unknown>;
};

declare module 'fastify' {
  interface FastifyInstance {
    fallbackLocale: FastifyI18nOptions['fallbackLocale'];
  }

  interface FastifyRequest {
    i18n: Polyglot;
  }
}

export default plugin<FastifyI18nOptions>(
  async (instance, options) => {
    instance.decorate('fallbackLocale', options.fallbackLocale);

    instance.addHook('preParsing', async (req, reply) => {
      const i18n = new Polyglot();

      const acceptLanguage = req.headers['accept-language']?.split(',')[0];
      const lang = acceptLanguage || options.fallbackLocale;
      const messages = normalize(options.messages);
      const langs = Object.keys(messages);
      const curLang = langs.find((item) => item.startsWith(lang) || lang.startsWith(item));

      i18n.locale(curLang);
      i18n.extend(messages[curLang || options.fallbackLocale]);

      req.i18n = i18n;
    });
  },
  {
    fastify: '4.x',
    name: 'fastify-i18n',
  },
);

export const defineI18n = (fastify: FastifyInstance, locales: { [locale: string]: object }) => {
  fastify.addHook('preParsing', async (req, reply) => {
    const i18n = new Polyglot();

    const acceptLanguage = req.headers['accept-language']?.split(',')[0];
    const lang = acceptLanguage || fastify.fallbackLocale;
    const messages = normalize(locales);
    const langs = Object.keys(messages);
    const curLang = langs.find((item) => item.startsWith(lang) || lang.startsWith(item));

    i18n.locale(curLang);
    i18n.extend(messages[curLang || fastify.fallbackLocale]);

    // @ts-expect-error
    if (req._i18n_local) i18n.extend(req._i18n_local.phrases);
    // @ts-expect-error
    req._i18n_local = i18n;
  });
};

interface UseI18nOptions {
  useScope?: 'global' | 'local';
}

export const useI18n = (
  request: FastifyRequest,
  options: UseI18nOptions = { useScope: 'local' },
): Polyglot => {
  if (options.useScope === 'global') return request.i18n;
  // @ts-expect-error
  return request._i18n_local;
};

function normalize(locales: Record<string, any>) {
  const normalized = Object.entries(locales).map(([key, val]) => [
    // @ts-ignore
    key.split('/').pop().split('.').slice(0, -1).join('.') || key,

    // import.meta.glob('LOCALE_FILES', { eager: true })
    val.default ? val.default : val,
  ]);

  return Object.fromEntries(normalized);
}
