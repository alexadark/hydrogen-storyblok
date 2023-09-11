// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  createStorefrontClient,
  storefrontRedirect,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  createCookieSessionStorage,
} from '@shopify/remix-oxygen';

function setContentSecurityPolicy(response, env) {
  const csp = `
    default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://shopify.com;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://shopify.com app.storyblok.com bridge.storyblok.com;
    style-src 'self' 'unsafe-inline' https://cdn.shopify.com https://fonts.googleapis.com app.storyblok.com bridge.storyblok.com;
    img-src *;
    font-src *;
    connect-src 'self' ${env.PUBLIC_STORE_DOMAIN} https://cdn.shopify.com https://shopify.com;
    frame-src 'self' app.storyblok.com bridge.storyblok.com
    frame-ancestors 'self' app.storyblok.com bridge.storyblok.com;

  `;
  response.headers.set(
    'Content-Security-Policy',
    csp.trim().replace(/\n/g, ' '),
  );
  return response;
}

export default {
  async fetch(request, env, executionContext) {
    try {
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = (p) => executionContext.waitUntil(p);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault({
          maxage: 60 * 60 * 24 * 365, // 1 year expiry
        }),
      });

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({session, storefront, env, cart}),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        return storefrontRedirect({request, response, storefront});
      }

      // Apply the Content Security Policy to the response
      setContentSecurityPolicy(response, env);

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

export class HydrogenSession {
  sessionStorage;
  session;
  constructor(sessionStorage, session) {
    this.sessionStorage = sessionStorage;
    this.session = session;
  }

  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));
    return new this(storage, session);
  }

  has(key) {
    return this.session.has(key);
  }

  get(key) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key, value) {
    this.session.flash(key, value);
  }

  unset(key) {
    this.session.unset(key);
  }

  set(key, value) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}
