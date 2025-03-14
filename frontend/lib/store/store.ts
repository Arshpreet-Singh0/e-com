import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import authReducer from "./features/authSlice";
import modalReducer from "./features/loginModalSlice";
import cartReducer from "./features/cartSlice";

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // Persist only auth & cart states
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer, // Not persisting modal state
  cart: cartReducer,
});

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ** Create a SINGLE store instance **
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

// ** Create Persistor for Redux Persist **
export const persistor = persistStore(store);

// Infer types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
