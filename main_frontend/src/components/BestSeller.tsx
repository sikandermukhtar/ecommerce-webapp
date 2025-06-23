"use client"

import { useEffect, useState } from "react"
import ProductCarousel from "./ProductCarousel"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProductsByMain } from "@/lib/redux/slices/productsSlice"
import type { Product } from "../types/product"

export default function BestSellers() {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((state) => state.products)
  const [bestSellers, setBestSellers] = useState<Product[]>([])

  useEffect(() => {
    // Fetch products from Men's category for best sellers (you can change this logic)
    const menCategoryId = "80e5a0ee-6fa7-429c-a299-019d38514e1d"
    dispatch(fetchProductsByMain(menCategoryId))
  }, [dispatch])

  useEffect(() => {
    // Simulate best sellers by taking first 8 products and shuffling
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random())
      setBestSellers(shuffled.slice(0, 8))
    }
  }, [products])

  return <ProductCarousel title="Best Sellers" products={bestSellers} loading={loading} />
}
