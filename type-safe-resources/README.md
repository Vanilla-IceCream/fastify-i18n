# Type-safe Resources

> [!CAUTION]
> Designing the API...

Migration of the legacy `node-polyglot` import method:

```ts
import i18n from 'fastify-i18n';
// to
import { polyglot } from 'fastify-i18n';

// No changes
import { defineI18n, useI18n } from 'fastify-i18n';
```

The default exported module will be used for the new API.

```ts
import i18n, { defineLocale, useLocale } from 'fastify-i18n';
```

Global Scope:

```ts
// ~/plugins/i18n.ts
import i18n from 'fastify-i18n';

fastify.register(i18n, {
  fallbackLocale: 'en-US',
  messages: import.meta.glob(['~/locales/*.ts', '!~/locales/index.ts'], { eager: true }),
});

// ~/locales/index.ts
import { useLocale } from 'fastify-i18n';

import type enUS from './en-US'; // This uses the same value as `fallbackLocale` for type reference

export default () => useLocale<typeof enUS>();

/* ---------- or ---------- */

import i18n from 'fastify-i18n';

import type enUS from './en-US'; // This uses the same value as `fallbackLocale` for type reference

fastify.register<typeof enUS>(i18n, {
  fallbackLocale: 'en-US',
  messages: import.meta.glob(['~/locales/*.ts', '!~/locales/index.ts'], { eager: true }),
});
```

```ts
// ~/locales/en-US.ts
export default {
  WELCOME: 'Welcome!',
};
```

```ts
// ~/locales/zh-TW.ts
export default {
  WELCOME: '歡迎！',
};
```

```ts
import useGlobalLocale from '~/locales';

export default async (app: FastifyInstance) => {
  const globalLocale = useGlobalLocale();

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world \
    --header 'accept-language: zh-TW'
  */
  app.get('/hello-world', async (request, reply) => {
    return reply.send({
      welcome: globalLocale.WELCOME,
    });
  });
};

/* ---------- or ---------- */

export default async (app: FastifyInstance) => {
  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world \
    --header 'accept-language: zh-TW'
  */
  app.get('/hello-world', async (request, reply) => {
    return reply.send({
      welcome: request.i18n.WELCOME,
    });
  });
};
```

Local Scope:
