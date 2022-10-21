import { beforeEach, afterEach, test, expect } from 'vitest';
import fastify from 'fastify';

import i18n, { defineI18n, useI18n } from './fastify-i18n';

beforeEach(async (ctx) => {
  ctx.app = fastify();
});

test('fastify-i18n', async ({ app }) => {
  app.register(i18n, {
    fallbackLocale: 'en',
    messages: {
      en: { text: 'Text' },
      ja: { text: 'テキスト' },
      ko: { text: '텍스트' },
      zh: { text: '文字' },
    },
  });

  app.get('/api/i18n', async (req, reply) => {
    return reply.send({ text: req.i18n.t('text') });
  });

  app.register(async (router) => {
    defineI18n(app, {
      en: { hello: 'Hello, World!' },
      ja: { hello: 'こんにちは世界！' },
      ko: { hello: '안녕하세요, 월드입니다!' },
      zh: { hello: '你好，世界！' },
    });

    router.get('/api/hello-world', async (req, reply) => {
      const i18n = useI18n(req);
      return reply.send({ hello: i18n.t('hello') });
    });
  });

  await app.ready();

  expect(app.fallbackLocale).toBe('en');

  const res1 = await app.inject({
    method: 'GET',
    url: '/api/i18n',
  });

  expect(res1.json()).toEqual({ text: 'Text' });

  const res2 = await app.inject({
    method: 'GET',
    url: '/api/i18n',
    headers: { 'accept-language': 'ja' },
  });

  expect(res2.json()).toEqual({ text: 'テキスト' });

  const res3 = await app.inject({
    method: 'GET',
    url: '/api/hello-world',
    headers: { 'accept-language': 'ja' },
  });

  expect(res3.json()).toEqual({ hello: 'こんにちは世界！' });
});

afterEach(async (ctx) => {
  ctx.app.close();
});
