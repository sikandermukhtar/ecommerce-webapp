import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import categoriesReducer from "./slices/categoriesSlice"
import productsReducer from "./slices/productsSlice"
import searchReducer from "./slices/searchSlice"
import adminReducer from "./slices/adminSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    categories: categoriesReducer,
    products: productsReducer,
    search: searchReducer,
    admin: adminReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
