import type { FastifyInstance, FastifyRequest } from 'fastify';
import plugin from 'fastify-plugin';
import Polyglot from 'node-polyglot';

type FastifyI18nOptions = {
  fallbackLocale: string;
  messages: {
    [locale: string]: object;
  };
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
      const localesEntries = Object.entries(options.messages);

      for (let i = 0; i < localesEntries.length; i++) {
        const [locale, message] = localesEntries[i];

        if (locale === acceptLanguage) {
          i18n.locale(locale);
          i18n.extend(message);
        }
      }

      if (!Object.keys(options.messages).includes(acceptLanguage as string)) {
        i18n.locale(options.fallbackLocale);
        i18n.extend(options.messages[options.fallbackLocale]);
      }

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
    const localesEntries = Object.entries(locales);

    for (let i = 0; i < localesEntries.length; i++) {
      const [locale, message] = localesEntries[i];

      if (locale === acceptLanguage) {
        i18n.locale(locale);
        i18n.extend(message);
      }
    }

    if (!Object.keys(locales).includes(acceptLanguage as string)) {
      i18n.locale(fastify.fallbackLocale);
      i18n.extend(locales[fastify.fallbackLocale]);
    }

    // @ts-ignore
    if (req._i18n_local) i18n.extend(req._i18n_local.phrases);
    // @ts-ignore
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
  // @ts-ignore
  return request._i18n_local;
};
