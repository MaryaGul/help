"use client"

import { useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { toPng } from "html-to-image"
import ImageUploader from "./ImageUploader"
import TemplateSelector from "./TemplateSelector"
import CardEditor from "./CardEditor"
import ElementEditor from "./ElementEditor"
import BackgroundSelector from "./BackgroundSelector"
import { TEMPLATES, EMPTY_TEMPLATE_900x900 } from "@/data/templates"
import type { CardData, CardElement } from "@/types"

export default function CardGenerator() {
  const [cardData, setCardData] = useState<CardData>({
    template: TEMPLATES[0],
    backgroundColor: TEMPLATES[0].backgroundColor,
    backgroundImage: TEMPLATES[0].backgroundImage || null,
    elements: [...TEMPLATES[0].elements],
  })

  const [selectedElement, setSelectedElement] = useState<CardElement | null>(null)
  const [dominantColors, setDominantColors] = useState<string[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTemplateChange = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId) || EMPTY_TEMPLATE_900x900

    setCardData({
      template,
      backgroundColor: template.backgroundColor,
      backgroundImage: template.backgroundImage || null,
      elements: [...template.elements],
    })

    setSelectedElement(null)
  }

  const handleImageUpload = async (imageUrl: string, removeBackground: boolean) => {
    setIsLoading(true)
    let processedImageUrl = imageUrl

    if (removeBackground) {
      try {
        const response = await fetch("/api/remove-background", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        })

        if (!response.ok) throw new Error("Failed to remove background")

        const data = await response.json()
        processedImageUrl = data.url
      } catch (error) {
        console.error("Error removing background:", error)
        // Continue with original image if background removal fails
      }
    }

    // Add the image as a new element
    const newImageElement: CardElement = {
      id: uuidv4(),
      type: "image",
      src: processedImageUrl,
      x: 50,
      y: 50,
      width: 300,
      height: 300,
    }

    setCardData((prev) => ({
      ...prev,
      elements: [...prev.elements, newImageElement],
    }))

    // Select the new element
    setSelectedElement(newImageElement)

    // Extract dominant colors
    try {
      const response = await fetch("/api/extract-colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: processedImageUrl }),
      })

      if (response.ok) {
        const { colors } = await response.json()
        setDominantColors(colors)
      }
    } catch (error) {
      console.error("Error extracting colors:", error)
    }

    setIsLoading(false)
  }

  const handleBackgroundChange = (type: "color" | "image", value: string) => {
    if (type === "color") {
      setCardData((prev) => ({
        ...prev,
        backgroundColor: value,
        backgroundImage: null,
      }))
    } else {
      setCardData((prev) => ({
        ...prev,
        backgroundImage: value,
        backgroundColor: "#ffffff",
      }))
    }
  }

  const handleElementUpdate = (updatedElement: CardElement) => {
    setCardData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
    }))
    setSelectedElement(updatedElement)
  }

  const handleElementMove = (elementId: string, x: number, y: number) => {
    setCardData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === elementId ? { ...el, x, y } : el)),
    }))
  }

  const handleElementSelect = (element: CardElement | null) => {
    setSelectedElement(element)
  }

  const handleAddTextElement = () => {
    const newTextElement: CardElement = {
      id: uuidv4(),
      type: "text",
      content: "Новый текст",
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: "Inter",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#000000",
      textAlign: "left",
      width: 300,
    }

    setCardData((prev) => ({
      ...prev,
      elements: [...prev.elements, newTextElement],
    }))

    setSelectedElement(newTextElement)
  }

  const handleAddListElement = () => {
    const newListElement: CardElement = {
      id: uuidv4(),
      type: "list",
      items: [
        {
          id: uuidv4(),
          content: "Пункт списка 1",
          icon: "check",
        },
      ],
      x: 50,
      y: 50,
      fontSize: 18,
      fontFamily: "Inter",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#000000",
      iconColor: "#000000",
      spacing: 40,
      width: 300,
    }

    setCardData((prev) => ({
      ...prev,
      elements: [...prev.elements, newListElement],
    }))

    setSelectedElement(newListElement)
  }

  const handleDeleteElement = (elementId: string) => {
    setCardData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== elementId),
    }))

    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null)
    }
  }

  const handleExport = async () => {
    if (!cardRef.current) return

    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 })

      // Create download link
      const link = document.createElement("a")
      link.download = `product-card-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error exporting image:", error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <TemplateSelector
          templates={TEMPLATES}
          selectedTemplateId={cardData.template.id}
          onTemplateChange={handleTemplateChange}
        />

        <div className="mt-6">
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-medium">Добавить элементы</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleAddTextElement}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Добавить текст
            </button>
            <button
              onClick={handleAddListElement}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Добавить список
            </button>
          </div>
        </div>

        {selectedElement && (
          <div className="mt-6">
            <ElementEditor element={selectedElement} onUpdate={handleElementUpdate} onDelete={handleDeleteElement} />
          </div>
        )}
      </div>

      {/* Center Panel - Preview */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <CardEditor
          cardData={cardData}
          onElementMove={handleElementMove}
          onElementSelect={handleElementSelect}
          selectedElementId={selectedElement?.id}
          ref={cardRef}
        />

        <button onClick={handleExport} className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Скачать PNG
        </button>
      </div>

      {/* Right Panel - Background & Colors */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <BackgroundSelector
          backgroundColor={cardData.backgroundColor}
          backgroundImage={cardData.backgroundImage}
          dominantColors={dominantColors}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>
    </div>
  )
}
