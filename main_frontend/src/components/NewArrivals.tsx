"use client"

import { useEffect, useState } from "react"
import ProductCarousel from "./ProductCarousel"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import type { Product } from "../types/product"

export default function NewArrivals() {
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.categories)
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNewArrivals = async () => {
      if (categories.length === 0) return

      setLoading(true)
      try {
        // Fetch products from Women's category for new arrivals
        const womenCategoryId = "80e5a0ee-6fa7-429c-a299-019d38514e1d"
        const response = await fetch(`http://localhost:8000/products/main/${womenCategoryId}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Simulate new arrivals by taking last 8 products
          const arrivals = data.slice(-8).reverse()
          setNewArrivals(arrivals)
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [categories])

  return <ProductCarousel title="New Arrivals" products={newArrivals} loading={loading} />
}
