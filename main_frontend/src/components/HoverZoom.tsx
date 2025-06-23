"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ZoomIn } from "lucide-react"

interface HoverZoomProps {
  src: string
  alt: string
  className?: string
  onZoomClick?: () => void
}

export default function HoverZoom({ src, alt, className = "", onZoomClick }: HoverZoomProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-crosshair group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onZoomClick}
    >
      {/* Main Image */}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 ease-out"
        style={{
          transform: isHovering ? "scale(1.1)" : "scale(1)",
        }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Zoom Overlay */}
      {isHovering && (
        <div
          className="absolute inset-0 bg-black/10 pointer-events-none"
          style={{
            background: `radial-gradient(circle 100px at ${mousePosition.x}% ${mousePosition.y}%, transparent 0%, rgba(0,0,0,0.3) 100%)`,
          }}
        />
      )}

      {/* Zoom Icon */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
          <ZoomIn className="h-4 w-4 text-gray-700" />
        </div>
      </div>

      {/* Zoom Hint */}
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">Click to zoom</div>
      </div>
    </div>
  )
}
