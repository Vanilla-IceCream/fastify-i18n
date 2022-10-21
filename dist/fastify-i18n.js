import r from "fastify-plugin";
import f from "node-polyglot";
const b = r(
  async (l, e) => {
    l.decorate("fallbackLocale", e.fallbackLocale), l.addHook("preParsing", async (c, g) => {
      const a = new f(), s = c.headers["accept-language"], o = Object.entries(e.messages);
      for (let n = 0; n < o.length; n++) {
        const [t, i] = o[n];
        t === s && (a.locale(t), a.extend(i));
      }
      Object.keys(e.messages).includes(s) || (a.locale(e.fallbackLocale), a.extend(e.messages[e.fallbackLocale])), c.i18n = a;
    });
  },
  {
    fastify: "4.x",
    name: "fastify-i18n"
  }
), k = (l, e) => {
  l.addHook("preParsing", async (c, g) => {
    const a = new f(), s = c.headers["accept-language"], o = Object.entries(e);
    for (let n = 0; n < o.length; n++) {
      const [t, i] = o[n];
      t === s && (a.locale(t), a.extend(i));
    }
    Object.keys(e).includes(s) || (a.locale(l.fallbackLocale), a.extend(e[l.fallbackLocale])), c.i18n_local && a.extend(c.i18n_local.phrases), c.i18n_local = a;
  });
}, m = (l, e = { useScope: "local" }) => e.useScope === "global" ? l.i18n : l.i18n_local;
export {
  b as default,
  k as defineI18n,
  m as useI18n
};
