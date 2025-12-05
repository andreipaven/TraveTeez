import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bottomSheetsOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setBottomSheetsOpen: (state, action) => {
      state.bottomSheetsOpen = action.payload;
    },
  },
});

export const { setBottomSheetsOpen } = uiSlice.actions;
export default uiSlice.reducer;
