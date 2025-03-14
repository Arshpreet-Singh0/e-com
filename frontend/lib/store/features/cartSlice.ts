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
      const existingProductIndex = state.items.findIndex((item) => item.id === action.payload.id);
    
      if (existingProductIndex !== -1) {
        // ✅ Creating a new object instead of modifying the existing one
        state.items[existingProductIndex] = {
          ...state.items[existingProductIndex],
          quantity: state.items[existingProductIndex].quantity + action.payload.quantity,
        };
      } else {
        state.items.push({ ...action.payload }); // ✅ Ensure a new object is pushed
      }
    },
    

    // Remove product from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = [...state.items.filter((item) => item.id !== action.payload)];
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
