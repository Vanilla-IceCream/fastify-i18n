import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import fastify from 'fastify';

import i18n from './';

describe('fastify-i18n', () => {
  beforeEach(async (ctx) => {
    ctx.app = fastify();
  });

  it('register', async (ctx) => {
    ctx.app.register(i18n, {
      // ...
    });

    await ctx.app.ready();

    expect();
  });

  afterEach(async (ctx) => {
    ctx.app.close();
  });
});
