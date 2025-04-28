"use client"

import type React from "react"

import { forwardRef, useState, useRef, useEffect } from "react"
import { Phone, Music, HeartPulse, BatteryCharging, Wifi, Check } from "lucide-react"
import type { CardData, CardElement } from "@/types"

interface CardEditorProps {
  cardData: CardData
  selectedElementId?: string
  onElementMove: (elementId: string, x: number, y: number) => void
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
  ({ cardData, selectedElementId, onElementMove, onElementSelect }, ref) => {
    const [dragging, setDragging] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
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

    // Handle container click to deselect
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onElementSelect(null)
      }
    }

    // Handle mouse move
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragging || !containerRef.current) return

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

      const handleMouseUp = () => {
        setDragging(null)
      }

      if (dragging) {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }, [dragging, dragOffset, onElementMove, scale, cardData.template.width, cardData.template.height])

    const renderElement = (element: CardElement) => {
      const isSelected = element.id === selectedElementId
      const baseStyle = {
        position: "absolute" as const,
        left: element.x * scale,
        top: element.y * scale,
        cursor: "move",
        touchAction: "none" as const,
        border: isSelected ? "2px dashed #3b82f6" : "none",
      }

      switch (element.type) {
        case "text":
          return (
            <div
              key={element.id}
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
              style={{
                ...baseStyle,
                width: (element.width || 300) * scale,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {element.items.map((item, index) => {
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
              style={{
                ...baseStyle,
                width: element.width * scale,
                height: element.height * scale,
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
            </div>
          )
        case "icon":
          const IconComponent = ICONS[element.icon] || Check
          return (
            <div
              key={element.id}
              style={{
                ...baseStyle,
                color: element.color,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              <IconComponent size={element.size * scale} />
            </div>
          )
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
