"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppSelector } from "@/lib/redux/hooks"
import type { Category, SubCategory } from "@/lib/redux/slices/categoriesSlice"

interface FlatSubCategory extends SubCategory {
  categoryName: string
  main_category_id: string
}

export default function SubcategoriesPage() {
  const { token } = useAppSelector((state) => state.admin)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<FlatSubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<FlatSubCategory | null>(null)
  const [formData, setFormData] = useState({ name: "", main_category_id: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/categories/tree")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)

      // Flatten subcategories with category names and main_category_id
      const flatSubcategories: FlatSubCategory[] = data.flatMap((category: Category) =>
        category.sub_categories.map((sub) => ({
          ...sub,
          categoryName: category.name,
          main_category_id: category.id,
        })),
      )
      setSubcategories(flatSubcategories)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.main_category_id) return

    try {
      setSubmitting(true)
      const response = await fetch("http://localhost:8000/admin/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          main_category_id: formData.main_category_id,
        }),
      })

      if (!response.ok) throw new Error("Failed to create subcategory")

      await fetchData()
      setFormData({ name: "", main_category_id: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create subcategory")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubcategory || !formData.name.trim() || !formData.main_category_id) return

    try {
      setSubmitting(true)
      const response = await fetch(`http://localhost:8000/admin/subcategories/${editingSubcategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          main_category_id: formData.main_category_id,
        }),
      })

      if (!response.ok) throw new Error("Failed to update subcategory")

      await fetchData()
      setFormData({ name: "", main_category_id: "" })
      setEditingSubcategory(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update subcategory")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm("Are you sure you want to delete this subcategory? This will also delete all subgroups.")) return

    try {
      const response = await fetch(`http://localhost:8000/admin/subcategories/${subcategoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete subcategory")

      await fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete subcategory")
    }
  }

  const openEditDialog = (subcategory: FlatSubCategory) => {
    setEditingSubcategory(subcategory)
    setFormData({
      name: subcategory.name,
      main_category_id: subcategory.main_category_id,
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
          <p className="text-gray-600 mt-2">Manage product subcategories</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subcategory</DialogTitle>
              <DialogDescription>Add a new subcategory to an existing category</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubcategory} className="space-y-4">
              <div>
                <Label htmlFor="category">Main Category</Label>
                <Select
                  value={formData.main_category_id}
                  onValueChange={(value) => setFormData({ ...formData, main_category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
                <Label htmlFor="name">Subcategory Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter subcategory name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Subcategory"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Subcategories ({subcategories.length})</CardTitle>
          <CardDescription>Manage your product subcategories</CardDescription>
        </CardHeader>
        <CardContent>
          {subcategories.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No subcategories found</p>
              <p className="text-gray-400">Create your first subcategory to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Subgroups</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell className="font-medium">{subcategory.name}</TableCell>
                    <TableCell>{subcategory.categoryName}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-500">{subcategory.id.slice(0, 8)}...</TableCell>
                    <TableCell>{subcategory.sub_group.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(subcategory)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>Update the subcategory information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubcategory} className="space-y-4">
            <div>
              <Label htmlFor="edit-category">Main Category</Label>
              <Select
                value={formData.main_category_id}
                onValueChange={(value) => setFormData({ ...formData, main_category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
              <Label htmlFor="edit-name">Subcategory Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter subcategory name"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update Subcategory"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
