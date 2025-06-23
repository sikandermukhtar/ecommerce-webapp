import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getApiUrl } from "@/config/api"
import type { Product } from "@/types/product"

interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  currentCategory: string | null
  currentSubcategory: string | null
  currentSubgroup: string | null
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  currentCategory: null,
  currentSubcategory: null,
  currentSubgroup: null,
}

// Async thunks for fetching products
export const fetchProductsByMain = createAsyncThunk(
  "products/fetchByMain",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(getApiUrl("PRODUCTS_BY_MAIN", categoryId), {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { products: data as Product[], categoryId }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch products")
    }
  },
)

export const fetchProductsBySub = createAsyncThunk(
  "products/fetchBySub",
  async (subcategoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(getApiUrl("PRODUCTS_BY_SUB", subcategoryId), {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { products: data as Product[], subcategoryId }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch products")
    }
  },
)

export const fetchProductsByGroup = createAsyncThunk(
  "products/fetchByGroup",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(getApiUrl("PRODUCTS_BY_GROUP", groupId), {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { products: data as Product[], groupId }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch products")
    }
  },
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = []
      state.error = null
      state.currentCategory = null
      state.currentSubcategory = null
      state.currentSubgroup = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by main category
      .addCase(fetchProductsByMain.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByMain.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.currentCategory = action.payload.categoryId
        state.currentSubcategory = null
        state.currentSubgroup = null
        state.error = null
      })
      .addCase(fetchProductsByMain.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch by subcategory
      .addCase(fetchProductsBySub.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsBySub.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.currentSubcategory = action.payload.subcategoryId
        state.currentCategory = null
        state.currentSubgroup = null
        state.error = null
      })
      .addCase(fetchProductsBySub.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch by subgroup
      .addCase(fetchProductsByGroup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByGroup.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.currentSubgroup = action.payload.groupId
        state.currentCategory = null
        state.currentSubcategory = null
        state.error = null
      })
      .addCase(fetchProductsByGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearProducts, clearError } = productsSlice.actions
export default productsSlice.reducer
