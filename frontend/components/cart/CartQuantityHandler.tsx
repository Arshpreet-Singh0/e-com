import {
  CartItem,
  decreaseQuantity,
  increaseQuantity,
} from "@/lib/store/features/cartSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { Minus, Plus } from "lucide-react";

const CartQuantityHandler = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();

  const handleIncreaseQuantity = (id: string, size: string) => {
    dispatch(increaseQuantity({ id, size }));
  };
  const handleDecreaseQuantity = (id: string, size: string) => {
    dispatch(decreaseQuantity({ id, size }));
  };
  return (
    <div className="flex items-center border rounded-lg">
      <button
        onClick={() => handleDecreaseQuantity(item?.product?.id, item.size)}
        className="px-2 py-1 cursor-pointer"
      >
        <Minus size={16} />
      </button>
      <span className="px-4 py-1">{item.quantity}</span>
      <button
        onClick={() => handleIncreaseQuantity(item?.product?.id, item.size)}
        className="px-2 py-1 cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default CartQuantityHandler;
