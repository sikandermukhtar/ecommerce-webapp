import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  color?: string
  size?: number
  assets?: string[]
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.color === action.payload.color && item.size === action.payload.size,
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }

      state.totalItems += 1
      state.totalAmount += action.payload.price
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex((item) => item.id === action.payload)

      if (itemIndex !== -1) {
        const item = state.items[itemIndex]
        state.totalItems -= item.quantity
        state.totalAmount -= item.price * item.quantity
        state.items.splice(itemIndex, 1)
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)

      if (item) {
        const quantityDiff = action.payload.quantity - item.quantity
        item.quantity = action.payload.quantity
        state.totalItems += quantityDiff
        state.totalAmount += item.price * quantityDiff

        if (item.quantity <= 0) {
          const itemIndex = state.items.findIndex((i) => i.id === action.payload.id)
          state.items.splice(itemIndex, 1)
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
