# fastify-i18n

Internationalization plugin for Fastify. Built upon [`node-polyglot`](https://github.com/airbnb/polyglot.js).

## Install

```bash
$ npm i fastify-i18n
# or
$ pnpm i fastify-i18n
# or
$ yarn add fastify-i18n
```

## Usage

```js
// esm
import i18n, { defineI18n, useI18n } from 'fastify-i18n';

// cjs
const { default: i18n, defineI18n, useI18n } = require('fastify-i18n');
```

Global scope:

```ts
import i18n from 'fastify-i18n';

fastify.register(i18n, {
  fallbackLocale: 'en',
  messages: {
    en: { text: 'Text' },
    ja: { text: 'テキスト' },
    ko: { text: '텍스트' },
    zh: { text: '文字' },
  },
});

/*
  curl --request GET \
    --url http://127.0.0.1:3000/api/i18n \
    --header 'accept-language: ja'
  */
fastify.get('/api/i18n', async (req, reply) => {
  return { message: req.i18n.t('text') };
});
```

Local scope:

```ts
import type { FastifyInstance } from 'fastify';
import { defineI18n, useI18n } from 'fastify-i18n';

export default async (app: FastifyInstance) => {
  defineI18n(app, {
    en: { hello: 'Hello, World!' },
    ja: { hello: 'こんにちは世界！' },
    ko: { hello: '안녕하세요, 월드입니다!' },
    zh: { hello: '你好，世界！' },
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world \
    --header 'accept-language: ja'
  */
  app.get('/hello-world', async (req, reply) => {
    const i18n = useI18n(req);

    return {
      // local scope
      hello: i18n.t('hello'),

      // global scope
      text: req.i18n.t('text'),
    };
  });
};
```
