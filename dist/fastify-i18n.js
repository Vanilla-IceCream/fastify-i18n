import p from "fastify-plugin";
import g from "node-polyglot";
const y = p(
  async (n, a) => {
    n.decorate("fallbackLocale", a.fallbackLocale), n.addHook("preParsing", async (e, i) => {
      var t;
      const c = new g(), s = ((t = e.headers["accept-language"]) == null ? void 0 : t.split(",")[0]) || a.fallbackLocale, l = Object.keys(a.messages).find((o) => o.startsWith(s) || s.startsWith(o));
      c.locale(l), c.extend(a.messages[l]), e.i18n = c;
    });
  },
  {
    fastify: "4.x",
    name: "fastify-i18n"
  }
), L = (n, a) => {
  n.addHook("preParsing", async (e, i) => {
    var t;
    const c = new g(), s = ((t = e.headers["accept-language"]) == null ? void 0 : t.split(",")[0]) || n.fallbackLocale, l = Object.keys(a).find((o) => o.startsWith(s) || s.startsWith(o));
    c.locale(l), c.extend(a[l]), e._i18n_local && c.extend(e._i18n_local.phrases), e._i18n_local = c;
  });
}, k = (n, a = { useScope: "local" }) => a.useScope === "global" ? n.i18n : n._i18n_local;
export {
  y as default,
  L as defineI18n,
  k as useI18n
};
