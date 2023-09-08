import {CartForm} from '@shopify/hydrogen';
import {BsTrash3 as IconRemove} from 'react-icons/bs';

const RemoveFromCartButton = ({lineIds}) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="mt-3 text-xl transition duration-300 hover:-translate-y-1"
        type="submit"
      >
        <IconRemove />
      </button>
    </CartForm>
  );
};

export default RemoveFromCartButton;
