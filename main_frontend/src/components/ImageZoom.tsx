"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ZoomIn, ZoomOut, RotateCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImageZoomProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
  images?: string[]
  currentIndex?: number
  onImageChange?: (index: number) => void
}

export default function ImageZoom({
  src,
  alt,
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onImageChange,
}: ImageZoomProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.5, 5))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.5, 0.5))
  }, [])

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360)
  }, [])

  const handleReset = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 1) {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [scale, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, scale, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) {
        handleZoomIn()
      } else {
        handleZoomOut()
      }
    },
    [handleZoomIn, handleZoomOut],
  )

  const handlePrevImage = useCallback(() => {
    if (images.length > 1 && onImageChange) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
      onImageChange(newIndex)
      handleReset()
    }
  }, [images.length, currentIndex, onImageChange, handleReset])

  const handleNextImage = useCallback(() => {
    if (images.length > 1 && onImageChange) {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
      onImageChange(newIndex)
      handleReset()
    }
  }, [images.length, currentIndex, onImageChange, handleReset])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          handlePrevImage()
          break
        case "ArrowRight":
          handleNextImage()
          break
        case "+":
        case "=":
          handleZoomIn()
          break
        case "-":
          handleZoomOut()
          break
        case "r":
        case "R":
          handleRotate()
          break
        case "0":
          handleReset()
          break
      }
    },
    [isOpen, onClose, handlePrevImage, handleNextImage, handleZoomIn, handleZoomOut, handleRotate, handleReset],
  )

  // Add keyboard event listeners
  useState(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black border-none overflow-hidden">
        <div className="relative w-full h-full flex flex-col bg-black">
          {/* Header with controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 5}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRotate}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {images.length > 1 && (
                <span className="text-white text-sm bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image container - Full background coverage */}
          <div
            ref={imageRef}
            className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
          >
            <div
              className="relative transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={alt}
                  width={1200}
                  height={1200}
                  className="select-none object-contain"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                  priority
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded backdrop-blur-sm z-10">
            <div className="text-center space-y-1">
              <div>Scroll to zoom • Drag to pan • Arrow keys to navigate</div>
              <div className="text-xs opacity-75">+ / - to zoom • R to rotate • 0 to reset • ESC to close</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
