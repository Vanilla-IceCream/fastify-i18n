import type { FastifyInstance } from 'fastify';
import { beforeEach, afterEach, test, expect } from 'vitest';
import fastify from 'fastify';

import i18n, { defineI18n, useI18n } from '../fastify-i18n';

declare module 'vitest' {
  export interface TestContext {
    app: FastifyInstance;
  }
}

beforeEach(async (ctx) => {
  ctx.app = fastify();
});

test.concurrent('fastify-i18n', async ({ app }) => {
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

  const res4 = await app.inject({
    method: 'GET',
    url: '/api/hello-world',
    headers: { 'accept-language': 'ja,ko;q=0.9,zh-TW;q=0.8,zh;q=0.7,en-US;q=0.6,en;q=0.5' },
  });

  expect(res4.json()).toEqual({ hello: 'こんにちは世界！' });
});

test.concurrent('fastify-i18n - autoTransform: true - xx-XX', async ({ app }) => {
  app.register(i18n, {
    fallbackLocale: 'en',
    messages: {
      'en-US': { text: 'Text' },
      'ja-JP': { text: 'テキスト' },
    },
  });

  app.get('/api/i18n', async (req, reply) => {
    return reply.send({ text: req.i18n.t('text') });
  });

  app.register(async (router) => {
    defineI18n(app, {
      'en-US': { hello: 'Hello, World!' },
      'ja-JP': { hello: 'こんにちは世界！' },
    });

    router.get('/api/hello-world', async (req, reply) => {
      const i18n = useI18n(req);
      return reply.send({ hello: i18n.t('hello') });
    });
  });

  await app.ready();

  const res11 = await app.inject({
    method: 'GET',
    url: '/api/i18n',
    headers: { 'Accept-Language': 'ja' },
  });

  expect(res11.json()).toEqual({ text: 'テキスト' });

  const res12 = await app.inject({
    method: 'GET',
    url: '/api/hello-world',
    headers: { 'Accept-Language': 'ja' },
  });

  expect(res12.json()).toEqual({ hello: 'こんにちは世界！' });
});

test.concurrent('fastify-i18n - autoTransform: true - xx', async ({ app }) => {
  app.register(i18n, {
    fallbackLocale: 'en',
    messages: {
      en: { text: 'Text' },
      ja: { text: 'テキスト' },
    },
  });

  app.get('/api/i18n', async (req, reply) => {
    return reply.send({ text: req.i18n.t('text') });
  });

  app.register(async (router) => {
    defineI18n(app, {
      en: { hello: 'Hello, World!' },
      ja: { hello: 'こんにちは世界！' },
    });

    router.get('/api/hello-world', async (req, reply) => {
      const i18n = useI18n(req);
      return reply.send({ hello: i18n.t('hello') });
    });
  });

  await app.ready();

  const res11 = await app.inject({
    method: 'GET',
    url: '/api/i18n',
    headers: { 'Accept-Language': 'ja-JP' },
  });

  expect(res11.json()).toEqual({ text: 'テキスト' });

  const res12 = await app.inject({
    method: 'GET',
    url: '/api/hello-world',
    headers: { 'Accept-Language': 'ja-JP' },
  });

  expect(res12.json()).toEqual({ hello: 'こんにちは世界！' });
});

afterEach(async (ctx) => {
  ctx.app.close();
});
