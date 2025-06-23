"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"

export function useInitializeCategories() {
  const dispatch = useAppDispatch()
  const { categories, loading, error } = useAppSelector((state) => state.categories)

  useEffect(() => {
    // Only fetch if we don't have categories yet
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length, loading])

  return { categories, loading, error }
}
