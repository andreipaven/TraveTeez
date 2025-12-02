import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../Slices/favoriteSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});
