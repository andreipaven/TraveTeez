import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bottomSheetsOpen: {
    facilities: false,
    description: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setBottomSheetOpen: (state, action) => {
      const { sheet, isOpen } = action.payload;
      state.bottomSheetsOpen[sheet] = isOpen;
    },
  },
});

export const { setBottomSheetOpen } = uiSlice.actions;
export default uiSlice.reducer;
