import {useLoaderData} from '@remix-run/react';

import CollectionCard from '~/components/CollectionCard';

const seo = () => ({
  title: 'Boards',
  description: 'Choose your favorite board',
});
export const handle = {
  seo,
};

export async function loader({context}) {
  return await context.storefront.query(COLLECTIONS_QUERY);
}

const Collections = () => {
  let {collections} = useLoaderData();

  return (
    <div className="mt-16 center-container">
      <div className="justify-around gap-10 md:flex">
        {collections?.nodes?.map((c) => (
          <CollectionCard collection={c} key={c.id} />
        ))}
      </div>
    </div>
  );
};

export default Collections;

const COLLECTIONS_QUERY = `#graphql
  query Collections {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
