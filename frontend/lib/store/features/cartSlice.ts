import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Product type
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

// Define CartState type
interface CartState {
  items: Product[];
  isCartOpen: boolean;
}

// Initial state
const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add product to cart
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.items.find((item) => item.id === action.payload.id);
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    // Remove product from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Toggle cart drawer
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, toggleCartDrawer, clearCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
