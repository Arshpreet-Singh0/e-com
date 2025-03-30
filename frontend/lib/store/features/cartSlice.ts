import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { handleAxiosError } from "@/utils/handleAxiosError";

// Define Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  discount : number;
}

export interface CartItem {
  id? : string;
  cartId? : string;
  quantity : number;
  size : string;
  product : Product
}
// Define CartState type
interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isSyncing: boolean;
}

// Initial state
const initialState: CartState = {
  items: [],
  isCartOpen: false,
  isSyncing: false, // ✅ New field to track sync state
};

// ✅ Thunk to add item to the cart and sync with the server
export const addToCartServer = createAsyncThunk(
  "cart/addToCartServer",
  async ({ id, quantity, size }: { id: string; quantity: number; size: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/cart`,
        { productId: id, quantity, size },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        return res.data?.cart?.items; // Return updated cart from server
      }
    } catch (error) {
      handleAxiosError(error)
      // @ts-expect-error: error.response may be undefined, and TypeScript doesn't recognize it
      
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);
export const deleteCartItemServer = createAsyncThunk(
  "cart/deleteCartItemServer",
  async (id : string , { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/v1/cart/${id}`,
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        return res.data?.cart?.items; // Return updated cart from server
      }
    } catch (error) {
      handleAxiosError(error)
       // @ts-expect-error: error.response may be undefined, and TypeScript doesn't recognize it
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);
export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (items : CartItem[] , { rejectWithValue }) => {
    console.log(items);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/cart/sync`, { items }, {
        withCredentials : true,
      });
      return response?.data.cart?.items;
      // if (res?.data?.success) {
      //   toast.success(res.data.message);
      //   return res.data?.cart?.items; // Return updated cart from server
      // }
    } catch (error) {
      handleAxiosError(error)
       // @ts-expect-error: error.response may be undefined, and TypeScript doesn't recognize it
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);



// ✅ Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ quantity: number; size: string; product: Product }>
    ) => {
      // Find existing product in cart
      const index = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id && item.size === action.payload.size
      );

      if (index !== -1) {
        // ✅ Correct way: update quantity immutably
        state.items[index] = {
          ...state.items[index],
          quantity: Math.min(state.items[index].quantity + action.payload.quantity, 10),
        };
      } else {
        // ✅ Add new product to cart
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
          size: action.payload.size,
        });
      }
    },
    increaseQuantity: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const productIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id && item.size === action.payload.size
      );
    
      if (productIndex !== -1 && state.items[productIndex].quantity < 10) {
        state.items[productIndex] = {
          ...state.items[productIndex],
          quantity: state.items[productIndex].quantity + 1,
        };
      }
    },
    
    decreaseQuantity: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const productIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id && item.size === action.payload.size
      );
    
      if (productIndex !== -1 && state.items[productIndex].quantity > 1) {
        state.items[productIndex] = {
          ...state.items[productIndex],
          quantity: state.items[productIndex].quantity - 1,
        };
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(
        (item) => !(item?.product?.id === action.payload.id && item.size === action.payload.size)
      );
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCartDrawer: (state) => {
      state.isCartOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCartServer.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload; // Update state with server response
      }
    })
    .addCase(deleteCartItemServer.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload; // Update state with server response
      }
    })
    .addCase(syncCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

// Export actions
export const { addToCart, removeFromCart, toggleCartDrawer, clearCart, increaseQuantity, decreaseQuantity, setCart , closeCartDrawer} =
  cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
