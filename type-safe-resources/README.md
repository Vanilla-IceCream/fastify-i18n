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

The Local Scope is optional and the nested structure can be used directly in the Global Scope.

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
      welcome: request.i18n.myFeature.myFeatureChildren.WELCOME,
    });
  });
};
```

## Message Interpolation

```ts
// src/locales/en-US.ts
export default {
  HELLO: `Hello, {msg}!`,
};

// src/locales/ja-JP.ts
export default {
  HELLO: `こんにちは、{msg}!`,
};
```

```ts
import mi from 'message-interpolation';

export default async (app: FastifyInstance) => {
  app.get('/hello-world', async (request, reply) => {
    return reply.send({
      hello: mi(request.i18n.HELLO, { msg: 'Fastify' }),
    });
  });
};
```

## Type Definition

```ts
import 'fastify';
import type { I18n } from './i18n';

declare module 'fastify' {
  interface FastifyRequest {
    i18n: I18n | null;
  }
}
```

```ts
import type { I18nBase } from './base';
import type { I18nMyFeature } from './extra';

export interface I18n extends I18nBase, I18nMyFeature {}

// ---

export interface I18nBase {
  WELCOME: string;
}

// ---

export interface I18nMyFeature {
  myFeature: {
    WELCOME: string;
  };
}
```

### Automatic type definition

Scan the main locales folder and all locales folders under the routes, and automatically create type files.

```ts
// vite.config.ts
```

It covers checking whether the key of each language file is consistent.

### Automatic type annotation

Type annotations are automatically generated based on `fallbackLocale`. The annotation content is the value of the key, which is used for primitive value hints for language variables in the editor.

This will generally result in the following:

```ts
export interface I18nBase {
  /** Welcome! */
  WELCOME: string;

  /** Hello, {msg}! */
  HELLO: string;
}
```

Then hover your mouse cursor over `WELCOME` in the editor to view the primitive value.

```ts
export default async (app: FastifyInstance) => {
  app.get('/hello-world', async (request, reply) => {
    return reply.send({
      welcome: request.i18n.WELCOME,
    });
  });
};
```
