"use client"

import type { Template } from "@/types"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplateId: string
  onTemplateChange: (templateId: string) => void
}

export default function TemplateSelector({ templates, selectedTemplateId, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Выбор шаблона</h3>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedTemplateId === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div
              className={`${template.height > template.width ? "aspect-[3/4]" : "aspect-square"} bg-gray-200 mb-2`}
              style={{
                backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: template.backgroundColor,
              }}
            ></div>
            <p className="text-sm text-center">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
