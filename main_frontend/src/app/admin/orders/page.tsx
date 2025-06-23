"use client"

import { useEffect, useState } from "react"
import { Trash2, Eye, Calendar, DollarSign, Package, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppSelector } from "@/lib/redux/hooks"

interface OrderSummary {
  id: string
  order_date: string
  total: number
  status: string
}

interface OrderDetails {
  id: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    id: string
    product_id: string
    name: string
    price: number
    quantity: number
    color?: string
    size?: number
    image?: string
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  payment_method: string
  order_date: string
  status: string
}

export default function OrdersPage() {
  const { token } = useAppSelector((state) => state.admin)
  const [orderSummaries, setOrderSummaries] = useState<OrderSummary[]>([])
  const [orderDetails, setOrderDetails] = useState<{ [key: string]: OrderDetails }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchOrderSummaries()
  }, [token])

  const fetchOrderSummaries = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrderSummaries(data)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: string) => {
    if (orderDetails[orderId]) {
      setSelectedOrder(orderDetails[orderId])
      return
    }

    try {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: true }))
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        headers: {
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }

      const data = await response.json()
      setOrderDetails((prev) => ({ ...prev, [orderId]: data }))
      setSelectedOrder(data)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to fetch order details")
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      const response = await fetch(`http://localhost:8000/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete order")
      }

      setOrderSummaries(orderSummaries.filter((order) => order.id !== orderId))
      // Remove from details cache
      setOrderDetails((prev) => {
        const newDetails = { ...prev }
        delete newDetails[orderId]
        return newDetails
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete order")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>
        <Button onClick={fetchOrderSummaries} variant="outline">
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orderSummaries.length})</CardTitle>
          <CardDescription>View and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orderSummaries.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderSummaries.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchOrderDetails(order.id)}
                                disabled={loadingDetails[order.id]}
                              >
                                {loadingDetails[order.id] ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>Order #{selectedOrder?.id.slice(0, 8)}</DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      Customer Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                      <p>
                                        <strong>Name:</strong> {selectedOrder.customer.firstName}{" "}
                                        {selectedOrder.customer.lastName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedOrder.customer.email}
                                      </p>
                                      <p>
                                        <strong>Phone:</strong> {selectedOrder.customer.phone}
                                      </p>
                                      <p>
                                        <strong>Address:</strong> {selectedOrder.customer.address}
                                      </p>
                                      <p>
                                        <strong>City:</strong> {selectedOrder.customer.city},{" "}
                                        {selectedOrder.customer.state} {selectedOrder.customer.zipCode}
                                      </p>
                                      <p>
                                        <strong>Country:</strong> {selectedOrder.customer.country}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center">
                                      <Package className="h-4 w-4 mr-2" />
                                      Order Items ({selectedOrder.items.length})
                                    </h3>
                                    <div className="space-y-3">
                                      {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                          <div className="flex justify-between items-start">
                                            <div className="flex space-x-3">
                                              {item.image && (
                                                <img
                                                  src={item.image || "/placeholder.svg"}
                                                  alt={item.name}
                                                  className="w-16 h-16 object-cover rounded-md"
                                                />
                                              )}
                                              <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">
                                                  Product ID: {item.product_id.slice(0, 8)}...
                                                </p>
                                                <div className="text-sm text-gray-600 space-x-2">
                                                  <span>Qty: {item.quantity}</span>
                                                  {item.color && <span>• Color: {item.color}</span>}
                                                  {item.size && <span>• Size: {item.size}</span>}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                              </p>
                                              <p className="text-sm text-gray-500">${item.price} each</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Order Summary */}
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center">
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      Order Summary
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                      <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${selectedOrder.tax.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>${selectedOrder.shipping.toFixed(2)}</span>
                                      </div>
                                      <div className="border-t pt-2 flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm text-gray-600">
                                        <span>Payment Method:</span>
                                        <span className="capitalize">{selectedOrder.payment_method}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Order Date */}
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Order Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                      <div className="flex justify-between">
                                        <span>Order Date:</span>
                                        <span>{formatDate(selectedOrder.order_date)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Status:</span>
                                        <Badge variant="outline">{selectedOrder.status}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Order ID:</span>
                                        <span className="font-mono text-sm">{selectedOrder.id}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
