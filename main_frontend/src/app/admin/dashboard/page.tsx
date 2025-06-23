"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, FolderTree, Layers, Grid3X3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/redux/hooks"

interface DashboardStats {
  totalOrders: number
  totalCategories: number
  totalSubcategories: number
  totalSubgroups: number
  recentOrders: number
  revenue: number
}

export default function AdminDashboard() {
  const { token } = useAppSelector((state) => state.admin)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalSubgroups: 0,
    recentOrders: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await fetch("http://localhost:8000/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        })

        // Fetch categories tree
        const categoriesResponse = await fetch("http://localhost:8000/categories/tree")

        let totalOrders = 0
        let revenue = 0
        let recentOrders = 0

        if (ordersResponse.ok) {
          const orders = await ordersResponse.json()
          totalOrders = orders.length
          revenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)

          // Count recent orders (last 7 days)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          recentOrders = orders.filter((order: any) => new Date(order.orderDate || order.created_at) > weekAgo).length
        }

        let totalCategories = 0
        let totalSubcategories = 0
        let totalSubgroups = 0

        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json()
          totalCategories = categories.length
          totalSubcategories = categories.reduce((sum: number, cat: any) => sum + (cat.sub_categories?.length || 0), 0)
          totalSubgroups = categories.reduce(
            (sum: number, cat: any) =>
              sum +
              (cat.sub_categories?.reduce((subSum: number, sub: any) => subSum + (sub.sub_group?.length || 0), 0) || 0),
            0,
          )
        }

        setStats({
          totalOrders,
          totalCategories,
          totalSubcategories,
          totalSubgroups,
          recentOrders,
          revenue,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: `${stats.recentOrders} new this week`,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      description: "Total revenue",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      description: "Main categories",
      icon: FolderTree,
      color: "text-purple-600",
    },
    {
      title: "Subcategories",
      value: stats.totalSubcategories,
      description: "Total subcategories",
      icon: Layers,
      color: "text-orange-600",
    },
    {
      title: "Subgroups",
      value: stats.totalSubgroups,
      description: "Total subgroups",
      icon: Grid3X3,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Manage Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Manage product categories</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Subcategories</CardTitle>
            <CardDescription>Organize subcategories</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Subgroups</CardTitle>
            <CardDescription>Manage product subgroups</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
