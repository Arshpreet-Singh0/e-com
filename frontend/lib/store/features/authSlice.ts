import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  phone: string;
  name: string;
  role: string;
}

const user: User | null = null;

export const authSlice = createSlice({
  name: "auth",
  initialState : {
    user,
  },
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
