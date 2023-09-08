import {CartForm} from '@shopify/hydrogen';

export const AddToCartButton = ({variantId, style}) => {
  const lines = [{merchandiseId: variantId, quantity: 1}];

  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines}}>
      <button className={` btn ${style}`}>Add to Cart</button>
    </CartForm>
  );
};
