import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  phone: string;
  name: string;
  role: string;
}

const initialState: { user: User | null } = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user =  action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
