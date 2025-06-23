"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductCard from "@/components/ProductCard"
import LoadingSpinner from "@/components/LoadingSpinner"
import PriceFilter from "@/components/search/PriceFilter"
import ColorFilter from "@/components/search/ColorFilter"
import SizeFilter from "@/components/search/SizeFilter"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { searchProducts, updateFilters, setSortBy, clearSearch } from "@/lib/redux/slices/searchSlice"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { filteredProducts, loading, error, filters, totalResults } = useAppSelector((state) => state.search)

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const query = searchParams.get("q") || ""

  useEffect(() => {
    if (query) {
      dispatch(searchProducts(query))
    }

    return () => {
      dispatch(clearSearch())
    }
  }, [dispatch, query])

  const handlePriceChange = (priceRange: [number, number]) => {
    dispatch(updateFilters({ priceRange }))
  }

  const handleColorChange = (colors: string[]) => {
    dispatch(updateFilters({ colors }))
  }

  const handleSizeChange = (sizes: number[]) => {
    dispatch(updateFilters({ sizes }))
  }

  const handleSortChange = (sortBy: string) => {
    dispatch(setSortBy(sortBy))
  }

  const clearAllFilters = () => {
    dispatch(
      updateFilters({
        priceRange: [0, 1000],
        colors: [],
        sizes: [],
      }),
    )
  }

  const hasActiveFilters =
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 || filters.colors.length > 0 || filters.sizes.length > 0

  // Desktop Filters Component
  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-blue-600 hover:text-blue-800">
            Clear All
          </Button>
        )}
      </div>

      <PriceFilter priceRange={filters.priceRange} onPriceChange={handlePriceChange} />

      <div className="border-t pt-6">
        <ColorFilter selectedColors={filters.colors} onColorChange={handleColorChange} />
      </div>

      <div className="border-t pt-6">
        <SizeFilter selectedSizes={filters.sizes} onSizeChange={handleSizeChange} />
      </div>
    </div>
  )

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search results for "${query}"` : "Search Products"}
          </h1>
          <p className="text-gray-600">
            {totalResults} {totalResults === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <FiltersContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters and Sort */}
            <div className="flex items-center justify-between mb-6 lg:justify-end">
              {/* Mobile Filter Button */}
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-1 text-blue-600">
                        ({filters.colors.length + filters.sizes.length + (hasActiveFilters ? 1 : 0)})
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    <button onClick={() => handlePriceChange([0, 1000])} className="ml-2 hover:text-blue-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null}
                {filters.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {color}
                    <button
                      onClick={() => handleColorChange(filters.colors.filter((c) => c !== color))}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    Size {size}
                    <button
                      onClick={() => handleSizeChange(filters.sizes.filter((s) => s !== size))}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">Error: {error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400">Try adjusting your search or filters</p>
                {hasActiveFilters && (
                  <Button onClick={clearAllFilters} variant="outline" className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
