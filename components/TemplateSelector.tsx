"use client"

interface TemplateSelectorProps {
  selectedTemplate: "900x900" | "900x1200"
  onTemplateChange: (template: "900x900" | "900x1200") => void
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Выбор шаблона</h3>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
            selectedTemplate === "900x900" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => onTemplateChange("900x900")}
        >
          <div className="aspect-square bg-gray-200 mb-2"></div>
          <p className="text-sm text-center">Квадрат (900x900)</p>
        </div>

        <div
          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
            selectedTemplate === "900x1200" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => onTemplateChange("900x1200")}
        >
          <div className="aspect-[3/4] bg-gray-200 mb-2"></div>
          <p className="text-sm text-center">Вертикальный (900x1200)</p>
        </div>
      </div>
    </div>
  )
}
