"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import type { Product } from "../types/product"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 0)
  const dispatch = useAppDispatch()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.assets[0],
        assets: product.assets,
        color: selectedColor,
        size: selectedSize,
      }),
    )
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % product.assets.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + product.assets.length) % product.assets.length)
  }

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.assets.length > 0 ? (
            <>
              <Image
                src={product.assets[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Image Navigation */}
              {product.assets.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {product.assets.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {product.assets.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-nowrap text-ellipsis whitespace-nowrap overflow-hidden">{product.title}</h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <Badge
                    key={index}
                    variant={selectedColor === color ? "default" : "secondary"}
                    className="text-xs cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedColor(color)
                    }}
                  >
                    {color}
                  </Badge>
                ))}
                {product.colors.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{product.colors.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Available sizes:</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 6).map((size, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded cursor-pointer ${
                      selectedSize === size ? "bg-blue-100 text-blue-800" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedSize(size)
                    }}
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 6 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">+{product.sizes.length - 6}</span>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button onClick={handleAddToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}
