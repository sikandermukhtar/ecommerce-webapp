"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Menu, X, ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cart from "./Cart"
import Search from "./Search"
import { useInitializeCategories } from "@/hooks/useInitializeCategories"
import type { Category } from "@/lib/redux/slices/categoriesSlice"

interface MobileMenuItemProps {
  category: Category
  onClose: () => void
}

function MobileMenuItem({ category, onClose }: MobileMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null)

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex items-center justify-between w-full px-3 py-3 text-left text-base font-medium text-gray-900 hover:text-blue-600"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {category.name}
        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="pl-4 pb-2">
          {category.sub_categories.map((subcategory) => (
            <div key={subcategory.id} className="border-l-2 border-gray-100 ml-2">
              <button
                className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setExpandedSubcategory(expandedSubcategory === subcategory.id ? null : subcategory.id)}
              >
                <Link href={`/subcategory/${subcategory.id}`} onClick={onClose} className="flex-1">
                  {subcategory.name}
                </Link>
                {subcategory.sub_group.length > 0 && (
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${expandedSubcategory === subcategory.id ? "rotate-90" : ""}`}
                  />
                )}
              </button>

              {expandedSubcategory === subcategory.id && subcategory.sub_group.length > 0 && (
                <div className="pl-4">
                  {subcategory.sub_group.map((subgroup) => (
                    <Link
                      key={subgroup.id}
                      href={`/subgroup/${subgroup.id}`}
                      className="block px-6 py-2 text-xs text-gray-500 hover:text-blue-600"
                      onClick={onClose}
                    >
                      {subgroup.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { categories, loading, error } = useInitializeCategories()

  // Show error state
  if (error) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                StyleStore
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Search />
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
              <Cart />
            </div>
          </div>
        </div>
        <Alert className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load categories: {error}. Please check if the API server is running.
          </AlertDescription>
        </Alert>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              StyleStore
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {loading ? (
                <div className="flex space-x-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link
                      href={`/category/${category.id}`}
                      className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {category.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {hoveredCategory === category.id && category.sub_categories.length > 0 && (
                      <div className="absolute left-0 top-full mt-1 w-screen max-w-4xl bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                        <div className="p-6">
                          <div
                            className={`grid gap-8 ${category.sub_categories.length === 1 ? "grid-cols-1" : category.sub_categories.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
                          >
                            {category.sub_categories.map((subcategory) => (
                              <div key={subcategory.id}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  <Link href={`/subcategory/${subcategory.id}`} className="hover:text-blue-600">
                                    {subcategory.name}
                                  </Link>
                                </h3>
                                {subcategory.sub_group.length > 0 && (
                                  <ul className="space-y-2">
                                    {subcategory.sub_group.map((subgroup) => (
                                      <li key={subgroup.id}>
                                        <Link
                                          href={`/subgroup/${subgroup.id}`}
                                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                        >
                                          {subgroup.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Search Component */}
          <Search />

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart Component */}
            <Cart />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 max-h-96 overflow-y-auto">
            <div className="py-2">
              {loading ? (
                <div className="px-3 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                categories.map((category) => (
                  <MobileMenuItem key={category.id} category={category} onClose={() => setIsMobileMenuOpen(false)} />
                ))
              )}

              {/* Mobile Account Link */}
              <Link
                href="/account"
                className="block px-3 py-3 text-base font-medium text-gray-900 hover:text-blue-600 border-b border-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
