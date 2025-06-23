"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/redux/hooks"
import type { AdminProduct } from "@/types/admin-product"
import type { Category, SubCategory, SubGroup } from "@/lib/redux/slices/categoriesSlice"

interface ProductFormProps {
  categories: Category[]
  product?: AdminProduct
  onSuccess: () => void
  onCancel: () => void
}

const availableColors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Gray",
  "Brown",
  "Orange",
  "Navy",
  "Beige",
  "Maroon",
  "Teal",
  "Olive",
  "Silver",
  "Gold",
]

const availableSizes = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14]

export default function ProductForm({ categories, product, onSuccess, onCancel }: ProductFormProps) {
  const { token } = useAppSelector((state) => state.admin)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    main_category_id: "",
    sub_category_id: "",
    sub_group_id: "",
    colors: [] as string[],
    sizes: [] as number[],
    assets: [] as string[],
  })
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [subgroups, setSubgroups] = useState<SubGroup[]>([])
  const [newColor, setNewColor] = useState("")
  const [newAsset, setNewAsset] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Initialize form data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || "",
        price: product.price.toString(),
        main_category_id: product.main_category_id,
        sub_category_id: product.sub_category_id,
        sub_group_id: product.sub_group_id,
        colors: [...product.colors],
        sizes: [...product.sizes],
        assets: [...product.assets],
      })
    }
  }, [product])

  // Update subcategories when main category changes
  useEffect(() => {
    if (formData.main_category_id) {
      const category = categories.find((cat) => cat.id === formData.main_category_id)
      setSubcategories(category?.sub_categories || [])
      setFormData((prev) => ({ ...prev, sub_category_id: "", sub_group_id: "" }))
      setSubgroups([])
    }
  }, [formData.main_category_id, categories])

  // Update subgroups when subcategory changes
  useEffect(() => {
    if (formData.sub_category_id) {
      const subcategory = subcategories.find((sub) => sub.id === formData.sub_category_id)
      setSubgroups(subcategory?.sub_group || [])
      setFormData((prev) => ({ ...prev, sub_group_id: "" }))
    }
  }, [formData.sub_category_id, subcategories])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleColorAdd = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }))
    }
    setNewColor("")
  }

  const handleColorRemove = (colorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }))
  }

  const handleSizeToggle = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b),
    }))
  }

  const handleAssetAdd = () => {
    if (newAsset && !formData.assets.includes(newAsset)) {
      setFormData((prev) => ({ ...prev, assets: [...prev.assets, newAsset] }))
      setNewAsset("")
    }
  }

  const handleAssetRemove = (assetToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      assets: prev.assets.filter((asset) => asset !== assetToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.title ||
      !formData.price ||
      !formData.main_category_id ||
      !formData.sub_category_id ||
      !formData.sub_group_id
    ) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const productData = {
        title: formData.title,
        description: formData.description || undefined,
        price: Number.parseFloat(formData.price),
        main_category_id: formData.main_category_id,
        sub_category_id: formData.sub_category_id,
        sub_group_id: formData.sub_group_id,
        colors: formData.colors,
        sizes: formData.sizes,
        assets: formData.assets,
      }

      const url = product
        ? `http://localhost:8000/admin/products/${product.id}`
        : "http://localhost:8000/admin/products"

      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Failed to ${product ? "update" : "create"} product`)
      }

      onSuccess()
    } catch (error) {
      alert(error instanceof Error ? error.message : `Failed to ${product ? "update" : "create"} product`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter product title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="main_category">Main Category *</Label>
          <Select
            value={formData.main_category_id}
            onValueChange={(value) => handleInputChange("main_category_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select main category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sub_category">Subcategory *</Label>
          <Select
            value={formData.sub_category_id}
            onValueChange={(value) => handleInputChange("sub_category_id", value)}
            disabled={!formData.main_category_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sub_group">Subgroup *</Label>
          <Select
            value={formData.sub_group_id}
            onValueChange={(value) => handleInputChange("sub_group_id", value)}
            disabled={!formData.sub_category_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subgroup" />
            </SelectTrigger>
            <SelectContent>
              {subgroups.map((subgroup) => (
                <SelectItem key={subgroup.id} value={subgroup.id}>
                  {subgroup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Colors */}
      <div>
        <Label>Colors</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={newColor} onValueChange={setNewColor}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {availableColors
                  .filter((color) => !formData.colors.includes(color))
                  .map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={() => handleColorAdd(newColor)} disabled={!newColor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color) => (
              <Badge key={color} variant="secondary" className="flex items-center gap-1">
                {color}
                <button type="button" onClick={() => handleColorRemove(color)} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <Label>Sizes</Label>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`p-2 text-sm border rounded-md transition-colors ${
                formData.sizes.includes(size)
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Assets */}
      <div>
        <Label>Product Images</Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newAsset}
              onChange={(e) => setNewAsset(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <Button type="button" onClick={handleAssetAdd} disabled={!newAsset}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {formData.assets.map((asset, index) => (
              <div key={index} className="relative group">
                <img
                  src={asset || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleAssetRemove(asset)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (product ? "Updating..." : "Creating...") : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
