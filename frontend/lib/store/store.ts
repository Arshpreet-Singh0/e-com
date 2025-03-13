import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./features/authSlice";
import modalReducer from "./features/loginModalSlice";
import cartReducer from "./features/cartSlice";

// Create the Redux store
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      modal : modalReducer,
      cart : cartReducer
    },
  });

// Infer the `RootState` and `AppDispatch` types
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Create a Next.js Redux wrapper
export const wrapper = createWrapper<AppStore>(makeStore);
