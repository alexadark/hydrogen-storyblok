import {Link} from '@remix-run/react';
import Menu from './Menu';
import CartIcon from './cart/CartIcon';
import Headroom from 'react-headroom';
import logo from '~/assets/ride_logo.avif';

const Header = () => {
  return (
    <Headroom>
      <header className="border-t-[20px] border-primary bg-dark">
        <div className="flex items-center justify-between py-5 center-container">
          <div className="flex items-center space-x-20">
            <h1>
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </h1>
            <Menu />
          </div>
          <CartIcon />
        </div>
      </header>
    </Headroom>
  );
};

export default Header;
