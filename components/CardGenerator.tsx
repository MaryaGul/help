"use client"

import { useState, useRef, useEffect } from "react"
import ImageUploader from "./ImageUploader"
import TemplateSelector from "./TemplateSelector"
import TextEditor from "./TextEditor"
import BackgroundSelector from "./BackgroundSelector"
import CardPreview from "./CardPreview"
import { toPng } from "html-to-image"

export type CardData = {
  productImage: string | null
  template: "900x900" | "900x1200"
  title: string
  description: string
  price: string
  backgroundColor: string
  backgroundImage: string | null
  textColor: string
  elements: {
    image: { x: number; y: number; width: number; height: number }
    title: { x: number; y: number; fontSize: number }
    description: { x: number; y: number; fontSize: number }
    price: { x: number; y: number; fontSize: number }
  }
}

export default function CardGenerator() {
  const [cardData, setCardData] = useState<CardData>({
    productImage: null,
    template: "900x900",
    title: "Название товара",
    description: "Описание товара",
    price: "1999 ₽",
    backgroundColor: "#ffffff",
    backgroundImage: null,
    textColor: "#000000",
    elements: {
      image: { x: 0, y: 0, width: 500, height: 500 },
      title: { x: 0, y: 520, fontSize: 24 },
      description: { x: 0, y: 560, fontSize: 16 },
      price: { x: 0, y: 600, fontSize: 20 },
    },
  })

  const [dominantColors, setDominantColors] = useState<string[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Update element positions based on template
  useEffect(() => {
    if (cardData.template === "900x900") {
      setCardData((prev) => ({
        ...prev,
        elements: {
          image: { x: 0, y: 0, width: 500, height: 500 },
          title: { x: 0, y: 520, fontSize: 24 },
          description: { x: 0, y: 560, fontSize: 16 },
          price: { x: 0, y: 600, fontSize: 20 },
        },
      }))
    } else {
      setCardData((prev) => ({
        ...prev,
        elements: {
          image: { x: 0, y: 0, width: 500, height: 700 },
          title: { x: 0, y: 720, fontSize: 24 },
          description: { x: 0, y: 760, fontSize: 16 },
          price: { x: 0, y: 800, fontSize: 20 },
        },
      }))
    }
  }, [cardData.template])

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

    setCardData((prev) => ({
      ...prev,
      productImage: processedImageUrl,
    }))

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

  const handleTemplateChange = (template: "900x900" | "900x1200") => {
    setCardData((prev) => ({ ...prev, template }))
  }

  const handleTextChange = (field: "title" | "description" | "price", value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
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

  const handleTextColorChange = (color: string) => {
    setCardData((prev) => ({ ...prev, textColor: color }))
  }

  const handleElementMove = (element: "image" | "title" | "description" | "price", x: number, y: number) => {
    setCardData((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [element]: {
          ...prev.elements[element],
          x,
          y,
        },
      },
    }))
  }

  const handleFontSizeChange = (element: "title" | "description" | "price", size: number) => {
    setCardData((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [element]: {
          ...prev.elements[element],
          fontSize: size,
        },
      },
    }))
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
        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />

        <div className="mt-6">
          <TemplateSelector selectedTemplate={cardData.template} onTemplateChange={handleTemplateChange} />
        </div>

        <div className="mt-6">
          <TextEditor
            title={cardData.title}
            description={cardData.description}
            price={cardData.price}
            onTextChange={handleTextChange}
            onFontSizeChange={handleFontSizeChange}
            titleFontSize={cardData.elements.title.fontSize}
            descriptionFontSize={cardData.elements.description.fontSize}
            priceFontSize={cardData.elements.price.fontSize}
          />
        </div>
      </div>

      {/* Center Panel - Preview */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <CardPreview cardData={cardData} onElementMove={handleElementMove} ref={cardRef} />

        <button
          onClick={handleExport}
          disabled={!cardData.productImage}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Скачать PNG
        </button>
      </div>

      {/* Right Panel - Background & Colors */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <BackgroundSelector
          backgroundColor={cardData.backgroundColor}
          backgroundImage={cardData.backgroundImage}
          textColor={cardData.textColor}
          dominantColors={dominantColors}
          onBackgroundChange={handleBackgroundChange}
          onTextColorChange={handleTextColorChange}
        />
      </div>
    </div>
  )
}
