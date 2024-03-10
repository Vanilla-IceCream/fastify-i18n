import plugin from 'fastify-plugin';
import { defineI18n } from 'fastify-i18n';

export default plugin(async (app) => {
  defineI18n(app, import.meta.glob(['./locales/*.ts'], { eager: true }));
});
