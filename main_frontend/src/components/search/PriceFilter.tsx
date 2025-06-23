"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PriceFilterProps {
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

export default function PriceFilter({ priceRange, onPriceChange }: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState(priceRange[0].toString())
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString())

  const handleApply = () => {
    const min = Math.max(0, Number.parseInt(minPrice) || 0)
    const max = Math.max(min, Number.parseInt(maxPrice) || 1000)
    onPriceChange([min, max])
  }

  const presetRanges = [
    { label: "Under $25", range: [0, 25] as [number, number] },
    { label: "$25 - $50", range: [25, 50] as [number, number] },
    { label: "$50 - $100", range: [50, 100] as [number, number] },
    { label: "$100 - $200", range: [100, 200] as [number, number] },
    { label: "Over $200", range: [200, 1000] as [number, number] },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Price Range</h3>

      {/* Preset Ranges */}
      <div className="space-y-2">
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onPriceChange(preset.range)}
            className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-100"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Range */}
      <div className="pt-4 border-t">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Custom Range</Label>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-sm"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
        <Button onClick={handleApply} size="sm" className="w-full mt-2">
          Apply
        </Button>
      </div>
    </div>
  )
}
