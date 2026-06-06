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
import i18n from 'fastify-i18n';

import i18n, { defineLocale, useLocale } from 'fastify-i18n';
```

## Global Scope

```ts
// ~/plugins/i18n.ts
import i18n from 'fastify-i18n';

fastify.register(i18n, {
  fallbackLocale: 'en-US',
  messages: import.meta.glob(['~/locales/*.ts'], { eager: true }),
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

## Local Scope

```ts
// ~/routes/<FEATURE_NAME>/+hook.ts
import plugin from 'fastify-plugin';
import i18n from 'fastify-i18n';

export default plugin(async (app) => {
  app.register(i18n, {
    name: 'myFeature',
    messages: import.meta.glob(['./locales/*.ts'], { eager: true }),
  });
});
```

```ts
// ~/routes/<FEATURE_NAME>/+handler.ts
export default async (app: FastifyInstance) => {
  app.get('', async (request, reply) => {
    return reply.send({
      welcome: request.i18n.myFeature.WELCOME,
    });
  });
};
```

```ts
// ~/routes/<FEATURE_NAME>/children/+hook.ts
import plugin from 'fastify-plugin';
import i18n from 'fastify-i18n';

export default plugin(async (app) => {
  app.register(i18n, {
    name: 'myFeatureChildren',
    messages: import.meta.glob(['./locales/*.ts'], { eager: true }),
  });
});
```

```ts
// ~/routes/<FEATURE_NAME>/children/+handler.ts
export default async (app: FastifyInstance) => {
  app.get('', async (request, reply) => {
    return reply.send({
      welcome: request.i18n.myFeatureChildren.WELCOME,
    });
  });
};
```
