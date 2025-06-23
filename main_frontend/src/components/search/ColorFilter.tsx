"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface ColorFilterProps {
  selectedColors: string[]
  onColorChange: (colors: string[]) => void
}

const availableColors = [
  { name: "Black", value: "black", color: "#000000" },
  { name: "White", value: "white", color: "#FFFFFF" },
  { name: "Red", value: "red", color: "#EF4444" },
  { name: "Blue", value: "blue", color: "#3B82F6" },
  { name: "Green", value: "green", color: "#10B981" },
  { name: "Yellow", value: "yellow", color: "#F59E0B" },
  { name: "Pink", value: "pink", color: "#EC4899" },
  { name: "Purple", value: "purple", color: "#8B5CF6" },
  { name: "Gray", value: "gray", color: "#6B7280" },
  { name: "Brown", value: "brown", color: "#92400E" },
]

export default function ColorFilter({ selectedColors, onColorChange }: ColorFilterProps) {
  const handleColorToggle = (colorValue: string) => {
    const newColors = selectedColors.includes(colorValue)
      ? selectedColors.filter((c) => c !== colorValue)
      : [...selectedColors, colorValue]
    onColorChange(newColors)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Colors</h3>
      <div className="space-y-3">
        {availableColors.map((color) => (
          <div key={color.value} className="flex items-center space-x-3">
            <Checkbox
              id={color.value}
              checked={selectedColors.includes(color.value)}
              onCheckedChange={() => handleColorToggle(color.value)}
            />
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.color }} />
              <label htmlFor={color.value} className="text-sm text-gray-700 cursor-pointer">
                {color.name}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
