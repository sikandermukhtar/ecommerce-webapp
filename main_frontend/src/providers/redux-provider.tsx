"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/redux/store"

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
}
