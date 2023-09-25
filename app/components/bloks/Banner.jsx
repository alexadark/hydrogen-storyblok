import {Link} from '@remix-run/react';
import {storyblokEditable} from '@storyblok/react';

const Banner = ({blok}) => {
  const {user_type, _uid, title, text, image} = blok;
  return (
    <section
      key={_uid}
      {...storyblokEditable(blok)}
      className="items-center grid-cols-2 gap-10 mt-16 md:grid"
    >
      <div className="mb-10">
        <h2 className="mb-5 text-4xl md:text-6xl">{title}</h2>
        <p className="mb-8">{text}</p>
        <Link className="inline-block btn" to={`/collections/${user_type}`}>
          Find your board
        </Link>
      </div>
      <div>
        <img src={`${image.filename}/m/670x840`} alt={image.altText} />
      </div>
    </section>
  );
};

export default Banner;
