import type { FastifyInstance, FastifyRequest } from 'fastify';
import Polyglot from 'node-polyglot';
declare type FastifyI18nOptions = {
    fallbackLocale: string;
    messages: {
        [locale: string]: object;
    };
};
declare module 'fastify' {
    interface FastifyInstance {
        fallbackLocale: FastifyI18nOptions['fallbackLocale'];
    }
    interface FastifyRequest {
        i18n: Polyglot;
    }
}
declare const _default: import("fastify").FastifyPluginAsync<FastifyI18nOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default _default;
export declare const defineI18n: (fastify: FastifyInstance, locales: {
    [locale: string]: object;
}) => void;
interface UseI18nOptions {
    useScope?: 'global' | 'local';
}
export declare const useI18n: (request: FastifyRequest, options?: UseI18nOptions) => Polyglot;
