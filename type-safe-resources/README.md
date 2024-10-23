# Type-safe Resources

```ts
// ~/plugins/i18n.ts
import i18n from 'fastify-i18n';

fastify.register(i18n, {
  fallbackLocale: 'en-US',
  messages: import.meta.glob(['~/locales/*.ts', '!~/locales/index.ts'], { eager: true }),
});
```

```ts
// ~/locales/index.ts
import { useLocale } from 'fastify-i18n';

import type enUS from './en-US'; // This uses the same value as `fallbackLocale` for type reference

export default () => useLocale<typeof enUS>();
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

Since type references use `fallbackLocale`, you can use the Vite plugin of `fastify-i18n` to check the consistency of the keys in the locale files under the `locales` folder.

```ts
// vite.config.ts
export default defineConfig({
  // ...
  plugins: [
    fastify({
      serverPath: './src/main.ts',
    }),
    fastifyRoutes(),
    fastifyI18n({
      baseLocale: 'en-US',
      folderName: 'locales',
    }),
  ],
  // ...
});
```
