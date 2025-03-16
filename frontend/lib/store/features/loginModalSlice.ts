import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isLoginModalOpen: boolean;
  isSizeChartOpen : boolean;
}

const initialState: ModalState = {
  isLoginModalOpen: false,
  isSizeChartOpen : false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    toggleLoginModal: (state) => {
      state.isLoginModalOpen = !state.isLoginModalOpen;
    },
    openSizeChart: (state) => {
      state.isSizeChartOpen = true;
    },
    closeSizeChart: (state) => {
      state.isSizeChartOpen = false;
    },
    toggleSizeChart: (state) => {
      state.isSizeChartOpen = !state.isLoginModalOpen;
    },
  },
});

export const { openLoginModal, closeLoginModal, toggleLoginModal, openSizeChart, closeSizeChart, toggleSizeChart} = modalSlice.actions;
export default modalSlice.reducer;
