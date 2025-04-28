"use client"

import type { Template } from "@/types"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplateId: string
  onTemplateChange: (templateId: string) => void
}

export default function TemplateSelector({ templates, selectedTemplateId, onTemplateChange }: TemplateSelectorProps) {
  const [isOpen900x900, setIsOpen900x900] = useState(false)
  const [isOpen900x1200, setIsOpen900x1200] = useState(false)

  // Group templates by size
  const templates900x900 = templates.filter((template) => template.height === 900)
  const templates900x1200 = templates.filter((template) => template.height === 1200)

  // Get the currently selected template
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId)

  const getTemplatePreviewStyle = (template: Template) => {
    if (template.backgroundImage) {
      return {
        backgroundImage: `url(${template.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    return { backgroundColor: template.backgroundColor }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Выбор шаблона</h3>

      <div className="space-y-4">
        {/* 900x900 Templates Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen900x900(!isOpen900x900)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <span>900x900 {selectedTemplate?.height === 900 ? `- ${selectedTemplate.name}` : ""}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isOpen900x900 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {templates900x900.map((template) => (
                <div
                  key={template.id}
                  className={`p-2 cursor-pointer hover:bg-blue-50 ${
                    selectedTemplateId === template.id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    onTemplateChange(template.id)
                    setIsOpen900x900(false)
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-16 h-16 mr-3 border border-gray-200 rounded-md overflow-hidden"
                      style={getTemplatePreviewStyle(template)}
                    >
                      {/* Render a few sample elements to give an idea of the template */}
                      {template.elements.slice(0, 3).map((element, idx) => {
                        if (element.type === "image") {
                          return (
                            <div
                              key={idx}
                              className="absolute w-6 h-6 bg-gray-300 rounded-sm"
                              style={{
                                left: `${(element.x / template.width) * 100}%`,
                                top: `${(element.y / template.height) * 100}%`,
                                transform: "scale(0.2)",
                              }}
                            />
                          )
                        }
                        return null
                      })}
                    </div>
                    <div>{template.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 900x1200 Templates Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen900x1200(!isOpen900x1200)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <span>900x1200 {selectedTemplate?.height === 1200 ? `- ${selectedTemplate.name}` : ""}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isOpen900x1200 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {templates900x1200.map((template) => (
                <div
                  key={template.id}
                  className={`p-2 cursor-pointer hover:bg-blue-50 ${
                    selectedTemplateId === template.id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    onTemplateChange(template.id)
                    setIsOpen900x1200(false)
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-12 h-16 mr-3 border border-gray-200 rounded-md overflow-hidden"
                      style={getTemplatePreviewStyle(template)}
                    >
                      {/* Render a few sample elements to give an idea of the template */}
                      {template.elements.slice(0, 3).map((element, idx) => {
                        if (element.type === "image") {
                          return (
                            <div
                              key={idx}
                              className="absolute w-6 h-6 bg-gray-300 rounded-sm"
                              style={{
                                left: `${(element.x / template.width) * 100}%`,
                                top: `${(element.y / template.height) * 100}%`,
                                transform: "scale(0.2)",
                              }}
                            />
                          )
                        }
                        return null
                      })}
                    </div>
                    <div>{template.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
