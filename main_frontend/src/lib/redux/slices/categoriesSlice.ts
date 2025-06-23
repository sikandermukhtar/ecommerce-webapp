import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getApiUrl } from "@/config/api"

export interface SubGroup {
  id: string
  name: string
}

export interface SubCategory {
  id: string
  name: string
  sub_group: SubGroup[]
}

export interface Category {
  id: string
  name: string
  sub_categories: SubCategory[]
}

interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
}

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(getApiUrl("CATEGORIES_TREE"), {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as Category[]
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch categories")
  }
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false
        state.categories = action.payload
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = categoriesSlice.actions
export default categoriesSlice.reducer
