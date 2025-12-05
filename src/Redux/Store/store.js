import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "../Slices/favoriteSlice";
import uiReducer from "../Slices/bottomSheetsSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    ui: uiReducer,
  },
});
