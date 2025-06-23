"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Grid3X3 } from "lucide-react"
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
import type { Category, SubCategory, SubGroup } from "@/lib/redux/slices/categoriesSlice"

interface FlatSubCategory extends SubCategory {
  categoryName: string
  main_category_id: string
}

interface FlatSubGroup extends SubGroup {
  categoryName: string
  subcategoryName: string
  subcategory_id: string
}

export default function SubgroupsPage() {
  const { token } = useAppSelector((state) => state.admin)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<FlatSubCategory[]>([])
  const [subgroups, setSubgroups] = useState<FlatSubGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubgroup, setEditingSubgroup] = useState<FlatSubGroup | null>(null)
  const [formData, setFormData] = useState({ name: "", subcategory_id: "" })
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

      // Flatten subgroups with category and subcategory names
      const flatSubgroups: FlatSubGroup[] = data.flatMap((category: Category) =>
        category.sub_categories.flatMap((subcategory: SubCategory) =>
          subcategory.sub_group.map((subgroup) => ({
            ...subgroup,
            categoryName: category.name,
            subcategoryName: subcategory.name,
            subcategory_id: subcategory.id,
          })),
        ),
      )
      setSubgroups(flatSubgroups)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubgroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.subcategory_id) return

    try {
      setSubmitting(true)
      const response = await fetch("http://localhost:8000/admin/subgroups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          sub_category_id: formData.subcategory_id,
        }),
      })

      if (!response.ok) throw new Error("Failed to create subgroup")

      await fetchData()
      setFormData({ name: "", subcategory_id: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create subgroup")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateSubgroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubgroup || !formData.name.trim() || !formData.subcategory_id) return

    try {
      setSubmitting(true)
      const response = await fetch(`http://localhost:8000/admin/subgroups/${editingSubgroup.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          sub_category_id: formData.subcategory_id,
        }),
      })

      if (!response.ok) throw new Error("Failed to update subgroup")

      await fetchData()
      setFormData({ name: "", subcategory_id: "" })
      setEditingSubgroup(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update subgroup")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubgroup = async (subgroupId: string) => {
    if (!confirm("Are you sure you want to delete this subgroup?")) return

    try {
      const response = await fetch(`http://localhost:8000/admin/subgroups/${subgroupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete subgroup")

      await fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete subgroup")
    }
  }

  const openEditDialog = (subgroup: FlatSubGroup) => {
    setEditingSubgroup(subgroup)
    setFormData({
      name: subgroup.name,
      subcategory_id: subgroup.subcategory_id,
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Subgroups</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Subgroups</h1>
          <p className="text-gray-600 mt-2">Manage product subgroups</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subgroup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subgroup</DialogTitle>
              <DialogDescription>Add a new subgroup to an existing subcategory</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubgroup} className="space-y-4">
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory_id}
                  onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.categoryName} → {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Subgroup Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter subgroup name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Subgroup"}
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
          <CardTitle>All Subgroups ({subgroups.length})</CardTitle>
          <CardDescription>Manage your product subgroups</CardDescription>
        </CardHeader>
        <CardContent>
          {subgroups.length === 0 ? (
            <div className="text-center py-8">
              <Grid3X3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No subgroups found</p>
              <p className="text-gray-400">Create your first subgroup to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subgroups.map((subgroup) => (
                  <TableRow key={subgroup.id}>
                    <TableCell className="font-medium">{subgroup.name}</TableCell>
                    <TableCell>{subgroup.categoryName}</TableCell>
                    <TableCell>{subgroup.subcategoryName}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-500">{subgroup.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(subgroup)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSubgroup(subgroup.id)}
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
            <DialogTitle>Edit Subgroup</DialogTitle>
            <DialogDescription>Update the subgroup information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubgroup} className="space-y-4">
            <div>
              <Label htmlFor="edit-subcategory">Subcategory</Label>
              <Select
                value={formData.subcategory_id}
                onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.categoryName} → {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-name">Subgroup Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter subgroup name"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update Subgroup"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
