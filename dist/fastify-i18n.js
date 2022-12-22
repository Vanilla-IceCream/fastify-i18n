import d from "fastify-plugin";
import g from "node-polyglot";
const b = d(
  async (l, e) => {
    l.decorate("fallbackLocale", e.fallbackLocale), l.addHook("preParsing", async (c, r) => {
      var o;
      const a = new g(), s = (o = c.headers["accept-language"]) == null ? void 0 : o.split(",")[0], t = Object.entries(e.messages);
      for (let n = 0; n < t.length; n++) {
        const [i, f] = t[n];
        i === s && (a.locale(i), a.extend(f));
      }
      Object.keys(e.messages).includes(s) || (a.locale(e.fallbackLocale), a.extend(e.messages[e.fallbackLocale])), c.i18n = a;
    });
  },
  {
    fastify: "4.x",
    name: "fastify-i18n"
  }
), k = (l, e) => {
  l.addHook("preParsing", async (c, r) => {
    var o;
    const a = new g(), s = (o = c.headers["accept-language"]) == null ? void 0 : o.split(",")[0], t = Object.entries(e);
    for (let n = 0; n < t.length; n++) {
      const [i, f] = t[n];
      i === s && (a.locale(i), a.extend(f));
    }
    Object.keys(e).includes(s) || (a.locale(l.fallbackLocale), a.extend(e[l.fallbackLocale])), c._i18n_local && a.extend(c._i18n_local.phrases), c._i18n_local = a;
  });
}, m = (l, e = { useScope: "local" }) => e.useScope === "global" ? l.i18n : l._i18n_local;
export {
  b as default,
  k as defineI18n,
  m as useI18n
};
