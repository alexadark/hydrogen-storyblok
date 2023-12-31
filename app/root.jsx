import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import {storyblokInit, apiPlugin} from '@storyblok/react';
import styles from './styles/app.css';
import favicon from '../public/favicon.svg';
import {Layout} from './components/Layout';
import {defer} from '@shopify/remix-oxygen';
import {Seo} from '@shopify/hydrogen';
import Page from './components/bloks/Page';
import Banner from './components/bloks/Banner';
import PersonalizedBanners from './components/bloks/PersonalizedBanners';
import PersonalizedGrid from './components/bloks/PersonalizedGrid';
import ProductsGrid from './components/bloks/shopify/ProductsGrid';
import SingleProduct from './components/bloks/shopify/SingleProduct';

export const links = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

const seo = ({data}) => ({
  title: data?.shop?.name,
  description: data?.shop?.description,
});
export const handle = {
  seo,
};

export async function loader({context}) {
  const {cart} = context;
  const {shop} = await context.storefront.query(SHOP_QUERY);
  return defer({
    shop,
    cart: cart.get(),
  });
}

const components = {
  page: Page,
  banner: Banner,
  'personalized-banners': PersonalizedBanners,
  'personalized-grid': PersonalizedGrid,
  'products-grid': ProductsGrid,
  'single-product': SingleProduct,
};
storyblokInit({
  accessToken: 'aVPSgag6Rrp47qg0HOHIbgtt',
  use: [apiPlugin],
  components,
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Seo />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const SHOP_QUERY = `#graphql
  query  {
    shop {
      name
      description
    }
  }
`;
