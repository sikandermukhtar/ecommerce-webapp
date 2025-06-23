"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface SizeFilterProps {
  selectedSizes: number[]
  onSizeChange: (sizes: number[]) => void
}

const availableSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]

export default function SizeFilter({ selectedSizes, onSizeChange }: SizeFilterProps) {
  const handleSizeToggle = (size: number) => {
    const newSizes = selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size]
    onSizeChange(newSizes)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Sizes</h3>
      <div className="grid grid-cols-3 gap-2">
        {availableSizes.map((size) => (
          <div key={size} className="flex items-center space-x-2">
            <Checkbox
              id={`size-${size}`}
              checked={selectedSizes.includes(size)}
              onCheckedChange={() => handleSizeToggle(size)}
            />
            <label htmlFor={`size-${size}`} className="text-sm text-gray-700 cursor-pointer">
              {size}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
