import {Link} from '@remix-run/react';

Link;
const Menu = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li>
          <Link
            className="uppercase transition duration-300 hover:text-primary hover:underline"
            to="/collections"
          >
            Boards
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
