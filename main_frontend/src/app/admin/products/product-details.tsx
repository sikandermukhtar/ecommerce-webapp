"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AdminProduct } from "@/types/admin-product"
import type { Category } from "@/lib/redux/slices/categoriesSlice"

interface ProductDetailsDialogProps {
  product: AdminProduct | null
  categories: Category[]
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailsDialog({ product, categories, isOpen, onClose }: ProductDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const getCategoryHierarchy = () => {
    const category = categories.find((cat) => cat.id === product.main_category_id)
    if (!category) return "Unknown Category"

    const subcategory = category.sub_categories.find((sub) => sub.id === product.sub_category_id)
    const subgroup = subcategory?.sub_group.find((group) => group.id === product.sub_group_id)

    return `${category.name} → ${subcategory?.name || "Unknown"} → ${subgroup?.name || "Unknown"}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.assets.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.assets.length) % product.assets.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>Product Details</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            {product.assets.length > 0 ? (
              <div className="relative">
                <img
                  src={product.assets[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {product.assets.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {product.assets.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {product.assets.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}

            {/* Thumbnail Grid */}
            {product.assets.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.assets.map((asset, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-md overflow-hidden ${
                      index === currentImageIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={asset || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Product ID:</span>{" "}
                  <span className="font-mono text-sm">{product.id}</span>
                </p>
                {product.description && (
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-gray-600">{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Category</h3>
              <p className="text-sm text-gray-600">{getCategoryHierarchy()}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Available Colors</h3>
              {product.colors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="secondary">
                      {color}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No colors specified</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Available Sizes</h3>
              {product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline">
                      {size}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No sizes specified</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Images ({product.assets.length})</h3>
              <p className="text-sm text-gray-600">
                {product.assets.length > 0
                  ? `${product.assets.length} image${product.assets.length > 1 ? "s" : ""} uploaded`
                  : "No images uploaded"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
