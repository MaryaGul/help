"use client"

import type React from "react"

import { forwardRef, useState, useRef, useEffect } from "react"
import { Phone, Music, HeartPulse, BatteryCharging, Wifi, Check, RotateCw } from "lucide-react"
import type { CardData, CardElement } from "@/types"

interface CardEditorProps {
  cardData: CardData
  selectedElementId?: string
  onElementMove: (elementId: string, x: number, y: number) => void
  onElementResize?: (elementId: string, width: number, height: number) => void
  onElementRotate?: (elementId: string, rotation: number) => void
  onElementSelect: (element: CardElement | null) => void
}

const ICONS: Record<string, React.ElementType> = {
  phone: Phone,
  music: Music,
  "heart-pulse": HeartPulse,
  "battery-charging": BatteryCharging,
  wifi: Wifi,
  check: Check,
}

const CardEditor = forwardRef<HTMLDivElement, CardEditorProps>(
  ({ cardData, selectedElementId, onElementMove, onElementResize, onElementRotate, onElementSelect }, ref) => {
    const [dragging, setDragging] = useState<string | null>(null)
    const [resizing, setResizing] = useState<string | null>(null)
    const [rotating, setRotating] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })
    const [rotateStart, setRotateStart] = useState({ angle: 0, startAngle: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    // Scale factor for preview
    const scale = 1 / 2

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
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, elementId: string) => {
      e.stopPropagation()
      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setDragging(elementId)

      // Find and select the element
      const element = cardData.elements.find((el) => el.id === elementId) || null
      onElementSelect(element)
    }

    // Start resizing
    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, elementId: string) => {
      e.stopPropagation()
      e.preventDefault()

      const element = cardData.elements.find((el) => el.id === elementId)
      if (!element || (element.type !== "image" && element.type !== "shape")) return

      setResizing(elementId)
      setResizeStart({
        width: element.width,
        height: element.height,
        x: e.clientX,
        y: e.clientY,
      })
    }

    // Start rotating
    const handleRotateStart = (e: React.MouseEvent<HTMLDivElement>, elementId: string) => {
      e.stopPropagation()
      e.preventDefault()

      const element = cardData.elements.find((el) => el.id === elementId)
      if (!element) return

      const rotation = element.rotation || 0

      // Calculate center of the element
      const rect = e.currentTarget.parentElement?.getBoundingClientRect()
      if (!rect) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate starting angle
      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX)

      setRotating(elementId)
      setRotateStart({
        angle: rotation,
        startAngle: startAngle,
      })
    }

    // Handle container click to deselect
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onElementSelect(null)
      }
    }

    // Handle mouse move
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return

        // Handle dragging
        if (dragging) {
          const containerRect = containerRef.current.getBoundingClientRect()
          const newX = (e.clientX - containerRect.left - dragOffset.x) / scale
          const newY = (e.clientY - containerRect.top - dragOffset.y) / scale

          // Constrain to container bounds
          const maxX = cardData.template.width
          const maxY = cardData.template.height

          const boundedX = Math.max(0, Math.min(newX, maxX))
          const boundedY = Math.max(0, Math.min(newY, maxY))

          onElementMove(dragging, boundedX, boundedY)
        }

        // Handle resizing
        else if (resizing && onElementResize) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          // Maintain aspect ratio for images and circles
          const element = cardData.elements.find((el) => el.id === resizing)
          if (element && (element.type === "image" || (element.type === "shape" && element.shapeType === "circle"))) {
            const aspectRatio = resizeStart.width / resizeStart.height
            const newWidth = Math.max(20, resizeStart.width + deltaX)
            const newHeight = Math.max(20, newWidth / aspectRatio)
            onElementResize(resizing, newWidth, newHeight)
          } else {
            // Free resizing for other shapes
            const newWidth = Math.max(20, resizeStart.width + deltaX)
            const newHeight = Math.max(20, resizeStart.height + deltaY)
            onElementResize(resizing, newWidth, newHeight)
          }
        }

        // Handle rotating
        else if (rotating && onElementRotate) {
          const element = cardData.elements.find((el) => el.id === rotating)
          if (!element) return

          // Find the center of the element
          const elementRect = document.querySelector(`[data-element-id="${rotating}"]`)?.getBoundingClientRect()
          if (!elementRect) return

          const centerX = elementRect.left + elementRect.width / 2
          const centerY = elementRect.top + elementRect.height / 2

          // Calculate current angle
          const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX)

          // Calculate rotation
          let rotation = rotateStart.angle + (currentAngle - rotateStart.startAngle) * (180 / Math.PI)

          // Snap to 15 degree increments when holding shift
          if (e.shiftKey) {
            rotation = Math.round(rotation / 15) * 15
          }

          onElementRotate(rotating, rotation)
        }
      }

      const handleMouseUp = () => {
        setDragging(null)
        setResizing(null)
        setRotating(null)
      }

      if (dragging || resizing || rotating) {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }, [
      dragging,
      resizing,
      rotating,
      dragOffset,
      resizeStart,
      rotateStart,
      onElementMove,
      onElementResize,
      onElementRotate,
      scale,
      cardData.elements,
      cardData.template.width,
      cardData.template.height,
    ])

    // Render a shape element
    const renderShape = (element: CardElement) => {
      if (element.type !== "shape") return null

      const isSelected = element.id === selectedElementId
      const rotation = element.rotation || 0

      // Common style for all shapes
      const baseStyle = {
        position: "absolute" as const,
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        backgroundColor: element.color,
        border: element.borderWidth > 0 ? `${element.borderWidth * scale}px solid ${element.borderColor}` : "none",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center center",
        cursor: "move",
        touchAction: "none" as const,
        outline: isSelected ? "2px dashed #3b82f6" : "none",
      }

      // Shape-specific styles and rendering
      switch (element.shapeType) {
        case "rectangle":
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                borderRadius: `${element.borderRadius * scale}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {isSelected && renderResizeRotateHandles(element.id)}
            </div>
          )

        case "circle":
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                borderRadius: "50%",
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {isSelected && renderResizeRotateHandles(element.id)}
            </div>
          )

        case "triangle":
          // For triangle, we use a div with a border trick
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                backgroundColor: "transparent",
                width: 0,
                height: 0,
                borderLeft: `${(element.width / 2) * scale}px solid transparent`,
                borderRight: `${(element.width / 2) * scale}px solid transparent`,
                borderBottom: `${element.height * scale}px solid ${element.color}`,
                border: element.borderWidth > 0 ? undefined : "none", // Override base border
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {isSelected && renderResizeRotateHandles(element.id)}
            </div>
          )

        case "line":
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                height: element.height * scale,
                backgroundColor: element.color,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {isSelected && renderResizeRotateHandles(element.id)}
            </div>
          )

        default:
          return null
      }
    }

    // Render resize and rotate handles for selected elements
    const renderResizeRotateHandles = (elementId: string) => {
      return (
        <>
          {/* Resize handle */}
          <div
            style={{
              position: "absolute",
              right: -8,
              bottom: -8,
              width: 16,
              height: 16,
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              cursor: "nwse-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleResizeStart(e, elementId)}
          />

          {/* Rotate handle */}
          <div
            style={{
              position: "absolute",
              top: -24,
              left: "50%",
              transform: "translateX(-50%)",
              width: 24,
              height: 24,
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              cursor: "grab",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => handleRotateStart(e, elementId)}
          >
            <RotateCw size={16} color="white" />
          </div>
        </>
      )
    }

    const renderElement = (element: CardElement) => {
      const isSelected = element.id === selectedElementId
      const rotation = element.rotation || 0

      const baseStyle = {
        position: "absolute" as const,
        left: element.x * scale,
        top: element.y * scale,
        cursor: "move",
        touchAction: "none" as const,
        border: isSelected ? "2px dashed #3b82f6" : "none",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center center",
      }

      switch (element.type) {
        case "text":
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                color: element.color,
                fontSize: element.fontSize * scale,
                fontFamily: element.fontFamily,
                fontWeight: element.fontWeight,
                fontStyle: element.fontStyle,
                textAlign: element.textAlign,
                width: (element.width || 300) * scale,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {element.content}
            </div>
          )
        case "list":
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                width: (element.width || 300) * scale,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {element.items.map((item) => {
                const Icon = item.icon ? ICONS[item.icon] || Check : null

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: element.spacing * scale,
                      color: element.color,
                      fontSize: element.fontSize * scale,
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      fontStyle: element.fontStyle,
                    }}
                  >
                    {Icon && (
                      <div
                        style={{
                          marginRight: 10 * scale,
                          color: element.iconColor,
                          backgroundColor: `${element.iconColor}20`,
                          borderRadius: "50%",
                          padding: 8 * scale,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={24 * scale} />
                      </div>
                    )}
                    <div>{item.content}</div>
                  </div>
                )
              })}
            </div>
          )
        case "image":
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                width: element.width * scale,
                height: element.height * scale,
                position: "absolute",
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              <img
                src={element.src || "/placeholder.svg"}
                alt="Element"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                draggable="false"
              />

              {isSelected && renderResizeRotateHandles(element.id)}
            </div>
          )
        case "icon":
          const IconComponent = ICONS[element.icon] || Check
          return (
            <div
              key={element.id}
              data-element-id={element.id}
              style={{
                ...baseStyle,
                color: element.color,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              <IconComponent size={element.size * scale} />
            </div>
          )
        case "shape":
          return renderShape(element)
        default:
          return null
      }
    }

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
          width: cardData.template.width * scale,
          height: cardData.template.height * scale,
          ...getBackgroundStyle(),
        }}
        onClick={handleContainerClick}
      >
        {cardData.elements.map(renderElement)}
      </div>
    )
  },
)

CardEditor.displayName = "CardEditor"

export default CardEditor
