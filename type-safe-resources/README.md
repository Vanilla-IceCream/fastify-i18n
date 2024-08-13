# Type-safe Resources

```ts
import i18n from 'fastify-i18n';

fastify.register(i18n, {
  fallbackLocale: 'en-US',
  messages: import.meta.glob(['~/locales/*.ts', '!~/locales/index.ts'], { eager: true }),
});
```

```ts
// ~/locales/index.ts
import { useLocale } from 'fastify-i18n';

import type enUS from './en-US';

export default () => useLocale<typeof enUS>();
```
