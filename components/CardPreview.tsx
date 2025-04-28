"use client"

import type React from "react"

import { forwardRef, useState, useRef, useEffect } from "react"
import type { CardData } from "./CardGenerator"

interface CardPreviewProps {
  cardData: CardData
  onElementMove: (element: "image" | "title" | "description" | "price", x: number, y: number) => void
}

type ElementType = "image" | "title" | "description" | "price"

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ cardData, onElementMove }, ref) => {
  const width = 900
  const height = cardData.template === "900x900" ? 900 : 1200

  // Scale factor for preview
  const scale = 1 / 3

  // State to track positions
  const [positions, setPositions] = useState({
    image: { x: cardData.elements.image.x * scale, y: cardData.elements.image.y * scale },
    title: { x: cardData.elements.title.x * scale, y: cardData.elements.title.y * scale },
    description: { x: cardData.elements.description.x * scale, y: cardData.elements.description.y * scale },
    price: { x: cardData.elements.price.x * scale, y: cardData.elements.price.y * scale },
  })

  // Update positions when cardData changes
  useEffect(() => {
    setPositions({
      image: { x: cardData.elements.image.x * scale, y: cardData.elements.image.y * scale },
      title: { x: cardData.elements.title.x * scale, y: cardData.elements.title.y * scale },
      description: { x: cardData.elements.description.x * scale, y: cardData.elements.description.y * scale },
      price: { x: cardData.elements.price.x * scale, y: cardData.elements.price.y * scale },
    })
  }, [
    cardData.elements.image.x,
    cardData.elements.image.y,
    cardData.elements.title.x,
    cardData.elements.title.y,
    cardData.elements.description.x,
    cardData.elements.description.y,
    cardData.elements.price.x,
    cardData.elements.price.y,
    scale,
  ])

  // Dragging state
  const [dragging, setDragging] = useState<ElementType | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const getBackgroundStyle = () => {
    if (cardData.backgroundImage) {
      return {
        backgroundImage: `url(${cardData.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    return { backgroundColor: cardData.backgroundColor }
  }

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, element: ElementType) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setDragging(element)
  }

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newX = e.clientX - containerRect.left - dragOffset.x
      const newY = e.clientY - containerRect.top - dragOffset.y

      // Constrain to container bounds
      const maxX = containerRect.width - (dragging === "image" ? cardData.elements.image.width * scale : 0)
      const maxY = containerRect.height - (dragging === "image" ? cardData.elements.image.height * scale : 0)

      const boundedX = Math.max(0, Math.min(newX, maxX))
      const boundedY = Math.max(0, Math.min(newY, maxY))

      setPositions((prev) => ({
        ...prev,
        [dragging]: { x: boundedX, y: boundedY },
      }))
    }

    const handleMouseUp = () => {
      if (dragging) {
        // Notify parent with scaled values
        onElementMove(dragging, positions[dragging].x / scale, positions[dragging].y / scale)
        setDragging(null)
      }
    }

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [
    dragging,
    dragOffset,
    positions,
    onElementMove,
    scale,
    cardData.elements.image.width,
    cardData.elements.image.height,
  ])

  return (
    <div
      ref={(node) => {
        // Handle both refs
        if (ref) {
          if (typeof ref === "function") {
            ref(node)
          } else {
            ref.current = node
          }
        }
        containerRef.current = node
      }}
      className="relative overflow-hidden"
      style={{
        width: width * scale,
        height: height * scale,
        ...getBackgroundStyle(),
      }}
    >
      {cardData.productImage && (
        <div
          className="absolute cursor-move"
          style={{
            left: positions.image.x,
            top: positions.image.y,
            width: cardData.elements.image.width * scale,
            height: cardData.elements.image.height * scale,
            touchAction: "none",
          }}
          onMouseDown={(e) => handleMouseDown(e, "image")}
        >
          <img
            src={cardData.productImage || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>
      )}

      <div
        className="absolute cursor-move"
        style={{
          left: positions.title.x,
          top: positions.title.y,
          color: cardData.textColor,
          fontSize: cardData.elements.title.fontSize * scale,
          fontWeight: "bold",
          maxWidth: "90%",
          touchAction: "none",
        }}
        onMouseDown={(e) => handleMouseDown(e, "title")}
      >
        {cardData.title}
      </div>

      <div
        className="absolute cursor-move"
        style={{
          left: positions.description.x,
          top: positions.description.y,
          color: cardData.textColor,
          fontSize: cardData.elements.description.fontSize * scale,
          maxWidth: "90%",
          touchAction: "none",
        }}
        onMouseDown={(e) => handleMouseDown(e, "description")}
      >
        {cardData.description}
      </div>

      <div
        className="absolute cursor-move"
        style={{
          left: positions.price.x,
          top: positions.price.y,
          color: cardData.textColor,
          fontSize: cardData.elements.price.fontSize * scale,
          fontWeight: "bold",
          touchAction: "none",
        }}
        onMouseDown={(e) => handleMouseDown(e, "price")}
      >
        {cardData.price}
      </div>
    </div>
  )
})

CardPreview.displayName = "CardPreview"

export default CardPreview
