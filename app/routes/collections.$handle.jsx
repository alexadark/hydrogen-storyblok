import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '~/components/ProductGrid';
import {getCookie, setCookie} from 'react-use-cookie';

const seo = ({data}) => ({
  title: data?.collection?.title,
  description: data?.collection?.description,
});

export const handle = {
  seo,
};

export async function loader({params, context, request}) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      cursor,
    },
  });

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }
  return json({
    collection,
  });
}

export default function Collection() {
  const {collection} = useLoaderData();
  // personalization: we set the user type to the collection title that the user is currently viewing
  if (!getCookie('user_type)') && collection) {
    setCookie('user_type', collection.handle);
  }
  return (
    <>
      <div>
        <Image
          data={collection.image}
          className="h-[500px] w-full object-cover object-center"
          alt={collection.title}
        />
      </div>
      <div className="center-container">
        <header className="grid w-full gap-8 py-8 justify-items-start ">
          <h1 className="mt-10 text-6xl">{collection.title}</h1>
        </header>
        <ProductGrid
          collection={collection}
          url={`/collections/${collection.handle}`}
        />
      </div>
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String) {
    collection(handle: $handle) {
      id
      title
      description
      image {
          altText
          width
          height
          url
        }
      handle
      products(first: 4, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
