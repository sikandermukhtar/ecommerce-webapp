import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getApiUrl } from "@/config/api"
import type { Product } from "@/types/product"

export interface SearchFilters {
  query: string
  categories: string[]
  priceRange: [number, number]
  colors: string[]
  sizes: number[]
  sortBy: "relevance" | "price-low" | "price-high" | "newest"
}

interface SearchState {
  products: Product[]
  filteredProducts: Product[]
  loading: boolean
  error: string | null
  filters: SearchFilters
  totalResults: number
}

const initialState: SearchState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  filters: {
    query: "",
    categories: [],
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
    sortBy: "relevance",
  },
  totalResults: 0,
}

// Async thunk for searching products
export const searchProducts = createAsyncThunk("search/searchProducts", async (query: string, { rejectWithValue }) => {
  try {
    // Since there's no specific search endpoint, we'll fetch from all main categories
    const categoryIds = [
      "80e5a0ee-6fa7-429c-a299-019d38514e1d", // Men
      "e04a81b1-9653-47f1-93da-9e14340c564d", // Women
      "a454b1f9-b5b1-4e78-8d75-2ab7a7624873", // Kids
    ]

    const allProducts: Product[] = []

    // Fetch products from all categories
    for (const categoryId of categoryIds) {
      try {
        const response = await fetch(getApiUrl("PRODUCTS_BY_MAIN", categoryId), {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          allProducts.push(...data)
        }
      } catch (error) {
        console.error(`Failed to fetch products from category ${categoryId}:`, error)
      }
    }

    // Filter products based on search query
    const searchResults = allProducts.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))

    return { products: allProducts, searchResults, query }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to search products")
  }
})

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      // Apply filters to products
      state.filteredProducts = applyFilters(state.products, state.filters)
      state.totalResults = state.filteredProducts.length
    },
    clearSearch: (state) => {
      state.products = []
      state.filteredProducts = []
      state.filters = initialState.filters
      state.totalResults = 0
      state.error = null
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload
      state.filteredProducts = sortProducts(state.filteredProducts, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.searchResults
        state.filters.query = action.payload.query
        state.filteredProducts = applyFilters(action.payload.searchResults, state.filters)
        state.totalResults = state.filteredProducts.length
        state.error = null
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Helper function to apply filters
function applyFilters(products: Product[], filters: SearchFilters): Product[] {
  let filtered = [...products]

  // Apply price range filter
  filtered = filtered.filter(
    (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
  )

  // Apply color filter
  if (filters.colors.length > 0) {
    filtered = filtered.filter((product) =>
      product.colors.some((color) => filters.colors.includes(color.toLowerCase())),
    )
  }

  // Apply size filter
  if (filters.sizes.length > 0) {
    filtered = filtered.filter((product) => product.sizes.some((size) => filters.sizes.includes(size)))
  }

  return sortProducts(filtered, filters.sortBy)
}

// Helper function to sort products
function sortProducts(products: Product[], sortBy: SearchFilters["sortBy"]): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price)
    case "newest":
      return sorted.reverse() // Assuming newer products are at the end
    case "relevance":
    default:
      return sorted
  }
}

export const { updateFilters, clearSearch, setSortBy } = searchSlice.actions
export default searchSlice.reducer
