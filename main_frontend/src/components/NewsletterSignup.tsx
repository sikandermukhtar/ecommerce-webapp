"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Simulate subscription
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Mail className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Stay in Style</h2>
          <p className="text-gray-300 text-lg">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and fashion tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white"
              required
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8" disabled={isSubscribed}>
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </div>
        </form>

        {isSubscribed && (
          <p className="text-green-400 mt-4 animate-fade-in">
            Thank you for subscribing! Check your email for exclusive offers.
          </p>
        )}
      </div>
    </section>
  )
}
