"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { fetchProductsByMain } from "@/lib/redux/slices/productsSlice"
import LoadingSpinner from "@/components/LoadingSpinner"
import ProductCard from "@/components/ProductCard"
import HoverZoom from "@/components/HoverZoom"
import ImageZoom from "@/components/ImageZoom"
import type { Product } from "../../../types/product"

interface ProductDetail extends Product {
  description?: string
  main_category_id?: string
  sub_category_id?: string
  sub_group_id?: string
  main_category?: {
    id: string
    name: string
  }
  sub_category?: {
    id: string
    name: string
  }
  sub_group?: {
    id: string
    name: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.categories)
  const { products: relatedProducts } = useAppSelector((state) => state.products)

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<number | undefined>(undefined)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomImageIndex, setZoomImageIndex] = useState(0)

  const productId = params.id as string

  useEffect(() => {
    if (productId) {
      fetchProductDetail()
    }
  }, [productId])

  useEffect(() => {
    // Fetch related products when we have the product's category
    if (product?.main_category_id || product?.main_category?.id) {
      const categoryId = product.main_category_id || product.main_category?.id
      if (categoryId) {
        dispatch(fetchProductsByMain(categoryId))
      }
    }
  }, [product?.main_category_id, product?.main_category?.id, dispatch])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/products/${productId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Product not found")
      }

      const data = await response.json()
      setProduct(data)

      // Set default selections
      if (data.colors.length > 0) {
        setSelectedColor(data.colors[0])
      }
      if (data.sizes.length > 0) {
        setSelectedSize(data.sizes[0])
      }

      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Validate selections
    if (product.colors.length > 0 && !selectedColor) {
      alert("Please select a color")
      return
    }
    if (product.sizes.length > 0 && selectedSize === undefined) {
      alert("Please select a size")
      return
    }

    setAddingToCart(true)

    try {
      // Add to cart with selected options
      for (let i = 0; i < quantity; i++) {
        dispatch(
          addToCart({
            id: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}-${i}`,
            name: product.title,
            price: product.price,
            image: product.assets[0],
            assets: product.assets,
            color: selectedColor,
            size: selectedSize,
          }),
        )
      }

      // Show success feedback
      alert(`Added ${quantity} item(s) to cart!`)
    } catch (error) {
      alert("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // In a real app, you'd save this to a wishlist API
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Check out this product: ${product?.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        alert("Product URL copied to clipboard!")
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Product URL copied to clipboard!")
    }
  }

  const nextImage = () => {
    if (product?.assets) {
      setCurrentImageIndex((prev) => (prev + 1) % product.assets.length)
    }
  }

  const prevImage = () => {
    if (product?.assets) {
      setCurrentImageIndex((prev) => (prev - 1 + product.assets.length) % product.assets.length)
    }
  }

  const handleZoomOpen = (index?: number) => {
    setZoomImageIndex(index ?? currentImageIndex)
    setIsZoomOpen(true)
  }

  const handleZoomClose = () => {
    setIsZoomOpen(false)
  }

  const handleZoomImageChange = (index: number) => {
    setZoomImageIndex(index)
  }

  const getCategoryHierarchy = () => {
    if (!product || !categories.length) return null

    // Handle both main_category_id and main_category object
    const categoryId = product.main_category_id || product.main_category?.id
    if (!categoryId) return null

    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return null

    const subcategoryId = product.sub_category_id || product.sub_category?.id
    const subgroupId = product.sub_group_id || product.sub_group?.id

    const subcategory = subcategoryId ? category.sub_categories.find((sub) => sub.id === subcategoryId) : undefined
    const subgroup =
      subgroupId && subcategory ? subcategory.sub_group.find((group) => group.id === subgroupId) : undefined

    return { category, subcategory, subgroup }
  }

  const hierarchy = getCategoryHierarchy()

  // Filter related products (exclude current product)
  const filteredRelatedProducts = relatedProducts.filter((p) => p.id !== productId).slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Product not found"}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          {hierarchy?.category && (
            <>
              <span>/</span>
              <Link href={`/category/${hierarchy.category.id}`} className="hover:text-blue-600">
                {hierarchy.category.name}
              </Link>
            </>
          )}
          {hierarchy?.subcategory && (
            <>
              <span>/</span>
              <Link href={`/subcategory/${hierarchy.subcategory.id}`} className="hover:text-blue-600">
                {hierarchy.subcategory.name}
              </Link>
            </>
          )}
          {hierarchy?.subgroup && (
            <>
              <span>/</span>
              <Link href={`/subgroup/${hierarchy.subgroup.id}`} className="hover:text-blue-600">
                {hierarchy.subgroup.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with Hover Zoom */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              {product.assets.length > 0 ? (
                <>
                  <HoverZoom
                    src={product.assets[currentImageIndex] || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full"
                    onZoomClick={() => handleZoomOpen()}
                  />
                  {product.assets.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.assets.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.assets.map((asset, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    onDoubleClick={() => handleZoomOpen(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      index === currentImageIndex ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                    title="Double-click to zoom"
                  >
                    <Image
                      src={asset || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8) 124 reviews</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg border-2 transition-colors ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? "Adding to Cart..." : "Add to Cart"}
              </Button>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={`flex-1 ${isWishlisted ? "text-red-600 border-red-600" : ""}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-600" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="h-5 w-5" />
                <span>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
        {product && (
          <ImageZoom
            src={product.assets[zoomImageIndex] || "/placeholder.svg"}
            alt={`${product.title} - Image ${zoomImageIndex + 1}`}
            isOpen={isZoomOpen}
            onClose={handleZoomClose}
            images={product.assets}
            currentIndex={zoomImageIndex}
            onImageChange={handleZoomImageChange}
          />
        )}
      </div>
    </div>
  )
}
