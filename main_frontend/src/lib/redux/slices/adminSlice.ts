import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface AdminState {
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  error: string | null
  adminInfo: {
    email: string
  } | null
}

const initialState: AdminState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  adminInfo: null,
}

// Admin login thunk
export const adminLogin = createAsyncThunk(
  "admin/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("grant_type", "password")
      formData.append("username", credentials.username)
      formData.append("password", credentials.password)
      formData.append("scope", "")
      formData.append("client_id", "string")
      formData.append("client_secret", "string")

      const response = await fetch("http://localhost:8000/admin/login", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      return {
        access_token: data.access_token,
        token_type: data.token_type,
        email: credentials.username,
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Login failed")
    }
  },
)

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.adminInfo = null
      state.error = null
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminInfo")
    },
    clearError: (state) => {
      state.error = null
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem("adminToken")
      const adminInfo = localStorage.getItem("adminInfo")
      if (token && adminInfo) {
        state.token = token
        state.adminInfo = JSON.parse(adminInfo)
        state.isAuthenticated = true
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.access_token
        state.adminInfo = { email: action.payload.email }
        state.error = null

        // Store in localStorage
        localStorage.setItem("adminToken", action.payload.access_token)
        localStorage.setItem("adminInfo", JSON.stringify({ email: action.payload.email }))
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, loadFromStorage } = adminSlice.actions
export default adminSlice.reducer
