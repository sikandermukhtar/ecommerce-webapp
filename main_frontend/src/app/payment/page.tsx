"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { clearCart } from "@/lib/redux/slices/cartSlice"
import Link from "next/link"

interface CustomerInfo {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function PaymentPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items, totalAmount } = useAppSelector((state) => state.cart)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    // Get customer info from localStorage
    const storedCustomerInfo = localStorage.getItem("customerInfo")
    if (storedCustomerInfo) {
      setCustomerInfo(JSON.parse(storedCustomerInfo))
    } else {
      router.push("/checkout")
    }

    if (items.length === 0) {
      router.push("/")
    }
  }, [items.length, router])

  const shippingCost = 0
  const tax = totalAmount * 0.08
  const finalTotal = totalAmount + shippingCost + tax

  const handlePayment = async () => {
    if (!customerInfo || !customerInfo.email) return;

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing (replace with real Stripe logic in production)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Prepare order data with validation
      const orderData = {
        customer: customerInfo,
        items: items.map((item) => ({
          productId: item.id || "",
          name: item.name || "",
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          color: item.color || null,
          size: item.size || null,
          image: item.image || (Array.isArray(item.assets) && item.assets.length > 0 ? item.assets[0] : null),
        })),
        totals: {
          subtotal: Number(totalAmount) || 0,
          tax: Number(tax) || 0,
          shipping: Number(shippingCost) || 0,
          total: Number(finalTotal) || 0,
        },
        paymentMethod: "stripe",
        orderDate: new Date().toISOString(),
      };

      // Send order to backend
      const response = await fetch("http://localhost:8000/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order created successfully:", result);
        dispatch(clearCart());
        localStorage.removeItem("customerInfo");
        setPaymentSuccess(true);
        setTimeout(() => { router.push("/order-success"); }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create order (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!customerInfo || items.length === 0) {
    return null
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="text-gray-600">Your order has been placed successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/checkout" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>Your payment is secured with 256-bit SSL encryption</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Simulated Stripe Elements */}
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Card Number</p>
                    <p className="text-gray-400">•••• •••• •••• 4242</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">Expiry</p>
                      <p className="text-gray-400">12/25</p>
                    </div>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">CVC</p>
                      <p className="text-gray-400">•••</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    <Lock className="h-4 w-4 inline mr-1" />
                    This is a demo. In production, this would be replaced with actual Stripe Elements.
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {isProcessing ? "Processing Payment..." : `Pay $${finalTotal.toFixed(2)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Shipping to:</h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      {customerInfo.firstName} {customerInfo.lastName}
                    </p>
                    <p>{customerInfo.address}</p>
                    <p>
                      {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}
                    </p>
                    <p>{customerInfo.email}</p>
                    <p>{customerInfo.phone}</p>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">
                          Qty: {item.quantity}
                          {item.color && ` • ${item.color}`}
                          {item.size && ` • Size ${item.size}`}
                        </p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
