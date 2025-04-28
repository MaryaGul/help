"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paintbrush, ImageIcon, Sparkles } from "lucide-react"

interface BackgroundSelectorProps {
  backgroundColor: string
  backgroundImage: string | null
  dominantColors: string[]
  onBackgroundChange: (type: "color" | "image", value: string) => void
}

// Predefined backgrounds
const PREDEFINED_BACKGROUNDS = [
  "/backgrounds/gradient-purple.jpg",
  "/backgrounds/gradient-blue.jpg",
  "/backgrounds/gradient-green.jpg",
  "/backgrounds/gradient-orange.jpg",
  "/backgrounds/pattern-1.jpg",
  "/backgrounds/pattern-2.jpg",
  "/backgrounds/texture-1.jpg",
  "/backgrounds/texture-2.jpg",
  "/backgrounds/minimal-1.jpg",
  "/backgrounds/minimal-2.jpg",
]

export default function BackgroundSelector({
  backgroundColor,
  backgroundImage,
  dominantColors,
  onBackgroundChange,
}: BackgroundSelectorProps) {
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<string[]>([])

  const handleGenerateBackground = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) throw new Error("Failed to generate background")

      const data = await response.json()

      if (data.url) {
        setGeneratedBackgrounds((prev) => [data.url, ...prev].slice(0, 5))
        onBackgroundChange("image", data.url)
      }
    } catch (error) {
      console.error("Error generating background:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Фон</h3>

      <Tabs defaultValue="color">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="color" className="flex items-center">
            <Paintbrush className="h-4 w-4 mr-1" />
            <span>Цвет</span>
          </TabsTrigger>
          <TabsTrigger value="backgrounds" className="flex items-center">
            <ImageIcon className="h-4 w-4 mr-1" />
            <span>Фоны</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            <span>ИИ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="color">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цвет фона</label>
              <HexColorPicker
                color={backgroundColor}
                onChange={(color) => onBackgroundChange("color", color)}
                className="w-full"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundChange("color", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {dominantColors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Доминантные цвета из изображения</label>
                <div className="flex flex-wrap gap-2">
                  {dominantColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-md cursor-pointer border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => onBackgroundChange("color", color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="backgrounds">
          <div className="grid grid-cols-2 gap-2">
            {PREDEFINED_BACKGROUNDS.map((bg, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer ${
                  backgroundImage === bg ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => onBackgroundChange("image", bg)}
              >
                <img
                  src={bg || "/placeholder.svg"}
                  alt={`Background ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Опишите желаемый фон</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Например: градиент от розового к фиолетовому"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleGenerateBackground}
                disabled={isGenerating || !aiPrompt.trim()}
                className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Генерация...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Сгенерировать фон
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-1">Лимит: 5 генераций в день (Replicate API)</p>
            </div>

            {generatedBackgrounds.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сгенерированные фоны</label>
                <div className="grid grid-cols-2 gap-2">
                  {generatedBackgrounds.map((bg, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-md overflow-hidden cursor-pointer ${
                        backgroundImage === bg ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => onBackgroundChange("image", bg)}
                    >
                      <img
                        src={bg || "/placeholder.svg"}
                        alt={`Generated background ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
