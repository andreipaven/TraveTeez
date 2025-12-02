import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: {},
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorite: (state, action) => {
      const { resortId, value } = action.payload;
      state.favorites[resortId] = value;
    },
    toggleFavorite: (state, action) => {
      const resortId = action.payload;
      state.favorites[resortId] = !state.favorites[resortId];
    },
  },
});

export const { setFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
