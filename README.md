# Hydrogen template: Hello World

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher

- Rename the .env.example file to .env
  and add your Shopify store URL and API key.
  You can the one from the demo project also

```
SESSION_SECRET="foobar"
PUBLIC_STOREFRONT_API_VERSION="2023-07"
PUBLIC_STOREFRONT_API_TOKEN="78a9c49d5b74cd74fdbe35bbd3bd65c5"
PUBLIC_STORE_DOMAIN="https://hydrobloks.myshopify.com"
```

- Open a storyblok account if you don't already have one: https://www.storyblok.com/

- Clone the Storyblok space I made for this project by clicking on this link:
  https://app.storyblok.com/#!/build/217362

- Once you duplicated the space, go to "Settings" menu of Storyblok and "Visual Editor", then change the URL in Location (default environment) to https://localhost:3010/. Keep in mind that you need to start the "https" server in your localhost, and it should listen to the "3010" port.
  You can follow this guide for setting up a dev server with HTTPS Proxy for Mac: https://www.storyblok.com/faq/setup-dev-server-https-proxy and for Windows:https://www.storyblok.com/faq/setup-dev-server-https-windows

- Go to settings/access tokens and graben the access token

- In `app/root.jsx` replace the actual token by yours in

```storyblokInit({
  accessToken: 'aVPSgag6Rrp47qg0HOHIbgtt',
  use: [apiPlugin],
  components,
});
```

- You can keep the actual token if you don't want to create your own storyblok space.

- Add your shopify endpoint and tokens in the plugins fields from the components single-product and products-grid

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```
