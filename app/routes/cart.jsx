import {Await, useMatches} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {CartForm} from '@shopify/hydrogen';
import invariant from 'invariant';
import {CartContent, CartEmpty} from '~/components/cart';
import {Suspense} from 'react';

export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  // The Cart ID might change after each mutation, so update it each time.
  const headers = cart.setCartId(result.cart.id);

  return json(result, {status: 200, headers});
}

const Cart = () => {
  const [root] = useMatches();
  const cart = root.data?.cart;

  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <div>
            {data?.totalQuantity > 0 ? (
              <CartContent cart={data} />
            ) : (
              <CartEmpty />
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export default Cart;
