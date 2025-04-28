"use client"

import type React from "react"
import { v4 as uuidv4 } from "uuid"
import { Trash2, Plus } from "lucide-react"
import type {
  CardElement,
  TextElement,
  ListElement,
  FontWeight,
  FontStyle,
  TextAlign,
  ShapeElement,
  ShapeType,
} from "@/types"

interface ElementEditorProps {
  element: CardElement
  onUpdate: (element: CardElement) => void
  onDelete: (elementId: string) => void
}

const FONT_FAMILIES = ["Inter", "Arial", "Roboto", "Times New Roman", "Courier New"]
const FONT_WEIGHTS: FontWeight[] = ["normal", "bold", "light", "medium", "semibold"]
const FONT_STYLES: FontStyle[] = ["normal", "italic"]
const TEXT_ALIGNS: TextAlign[] = ["left", "center", "right"]
const ICON_OPTIONS = [
  { value: "phone", label: "Телефон" },
  { value: "music", label: "Музыка" },
  { value: "heart-pulse", label: "Пульс" },
  { value: "battery-charging", label: "Батарея" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "check", label: "Галочка" },
]
const SHAPE_TYPES: { value: ShapeType; label: string }[] = [
  { value: "rectangle", label: "Прямоугольник" },
  { value: "circle", label: "Круг" },
  { value: "triangle", label: "Треугольник" },
  { value: "line", label: "Линия" },
]

export default function ElementEditor({ element, onUpdate, onDelete }: ElementEditorProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (element.type === "text") {
      onUpdate({
        ...element,
        content: e.target.value,
      })
    }
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "text" || element.type === "list") {
      onUpdate({
        ...element,
        fontSize: Number(e.target.value),
      })
    }
  }

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (element.type === "text" || element.type === "list") {
      onUpdate({
        ...element,
        fontFamily: e.target.value,
      })
    }
  }

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (element.type === "text" || element.type === "list") {
      onUpdate({
        ...element,
        fontWeight: e.target.value as FontWeight,
      })
    }
  }

  const handleFontStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (element.type === "text" || element.type === "list") {
      onUpdate({
        ...element,
        fontStyle: e.target.value as FontStyle,
      })
    }
  }

  const handleTextAlignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (element.type === "text") {
      onUpdate({
        ...element,
        textAlign: e.target.value as TextAlign,
      })
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "text" || element.type === "list" || element.type === "icon" || element.type === "shape") {
      onUpdate({
        ...element,
        color: e.target.value,
      })
    }
  }

  const handleIconColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "list") {
      onUpdate({
        ...element,
        iconColor: e.target.value,
      })
    }
  }

  const handleListItemChange = (itemId: string, content: string) => {
    if (element.type === "list") {
      onUpdate({
        ...element,
        items: element.items.map((item) => (item.id === itemId ? { ...item, content } : item)),
      })
    }
  }

  const handleListItemIconChange = (itemId: string, icon: string) => {
    if (element.type === "list") {
      onUpdate({
        ...element,
        items: element.items.map((item) => (item.id === itemId ? { ...item, icon } : item)),
      })
    }
  }

  const handleAddListItem = () => {
    if (element.type === "list") {
      onUpdate({
        ...element,
        items: [
          ...element.items,
          {
            id: uuidv4(),
            content: "Новый пункт",
            icon: element.items[0]?.icon || "check",
          },
        ],
      })
    }
  }

  const handleRemoveListItem = (itemId: string) => {
    if (element.type === "list") {
      if (element.items.length <= 1) return // Don't remove the last item

      onUpdate({
        ...element,
        items: element.items.filter((item) => item.id !== itemId),
      })
    }
  }

  const handleSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "list") {
      onUpdate({
        ...element,
        spacing: Number(e.target.value),
      })
    }
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "text" || element.type === "list" || element.type === "shape") {
      onUpdate({
        ...element,
        width: Number(e.target.value),
      })
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "shape") {
      onUpdate({
        ...element,
        height: Number(e.target.value),
      })
    }
  }

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "shape") {
      onUpdate({
        ...element,
        borderWidth: Number(e.target.value),
      })
    }
  }

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "shape") {
      onUpdate({
        ...element,
        borderColor: e.target.value,
      })
    }
  }

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (element.type === "shape" && element.shapeType === "rectangle") {
      onUpdate({
        ...element,
        borderRadius: Number(e.target.value),
      })
    }
  }

  const handleShapeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (element.type === "shape") {
      const newShapeType = e.target.value as ShapeType

      // Adjust properties based on new shape type
      const updatedElement: ShapeElement = {
        ...element,
        shapeType: newShapeType,
      }

      // Reset border radius for non-rectangle shapes
      if (newShapeType !== "rectangle") {
        updatedElement.borderRadius = 0
      }

      // Set circle to equal width/height
      if (newShapeType === "circle") {
        const size = Math.max(element.width, element.height)
        updatedElement.width = size
        updatedElement.height = size
      }

      // Set line to be thin
      if (newShapeType === "line") {
        updatedElement.height = 2
      }

      onUpdate(updatedElement)
    }
  }

  const renderTextEditor = (element: TextElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Текст</label>
        <textarea
          value={element.content}
          onChange={handleTextChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Размер шрифта</label>
          <input
            type="range"
            min="10"
            max="120"
            value={element.fontSize}
            onChange={handleFontSizeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-500 mt-1">{element.fontSize}px</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цвет текста</label>
          <input
            type="color"
            value={element.color}
            onChange={handleColorChange}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Шрифт</label>
          <select
            value={element.fontFamily}
            onChange={handleFontFamilyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Начертание</label>
          <select
            value={element.fontWeight}
            onChange={handleFontWeightChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight} value={weight}>
                {weight === "normal"
                  ? "Обычный"
                  : weight === "bold"
                    ? "Жирный"
                    : weight === "light"
                      ? "Тонкий"
                      : weight === "medium"
                        ? "Средний"
                        : "Полужирный"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Стиль</label>
          <select
            value={element.fontStyle}
            onChange={handleFontStyleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_STYLES.map((style) => (
              <option key={style} value={style}>
                {style === "normal" ? "Обычный" : "Курсив"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Выравнивание</label>
          <select
            value={element.textAlign}
            onChange={handleTextAlignChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {TEXT_ALIGNS.map((align) => (
              <option key={align} value={align}>
                {align === "left" ? "По левому краю" : align === "center" ? "По центру" : "По правому краю"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ширина (px)</label>
        <input
          type="range"
          min="100"
          max="800"
          value={element.width || 300}
          onChange={handleWidthChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-sm text-gray-500 mt-1">{element.width || 300}px</div>
      </div>
    </div>
  )

  const renderListEditor = (element: ListElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Пункты списка</label>
        {element.items.map((item, index) => (
          <div key={item.id} className="flex items-center mb-2">
            <select
              value={item.icon || "check"}
              onChange={(e) => handleListItemIconChange(item.id, e.target.value)}
              className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={item.content}
              onChange={(e) => handleListItemChange(item.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <button onClick={handleAddListItem} className="flex items-center text-blue-600 hover:text-blue-800 mt-2">
          <Plus size={16} className="mr-1" /> Добавить пункт
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Размер шрифта</label>
          <input
            type="range"
            min="10"
            max="48"
            value={element.fontSize}
            onChange={handleFontSizeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-500 mt-1">{element.fontSize}px</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Интервал</label>
          <input
            type="range"
            min="20"
            max="100"
            value={element.spacing}
            onChange={handleSpacingChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-500 mt-1">{element.spacing}px</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цвет текста</label>
          <input
            type="color"
            value={element.color}
            onChange={handleColorChange}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цвет иконок</label>
          <input
            type="color"
            value={element.iconColor}
            onChange={handleIconColorChange}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Шрифт</label>
          <select
            value={element.fontFamily}
            onChange={handleFontFamilyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Начертание</label>
          <select
            value={element.fontWeight}
            onChange={handleFontWeightChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight} value={weight}>
                {weight === "normal"
                  ? "Обычный"
                  : weight === "bold"
                    ? "Жирный"
                    : weight === "light"
                      ? "Тонкий"
                      : weight === "medium"
                        ? "Средний"
                        : "Полужирный"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ширина (px)</label>
        <input
          type="range"
          min="100"
          max="800"
          value={element.width || 300}
          onChange={handleWidthChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-sm text-gray-500 mt-1">{element.width || 300}px</div>
      </div>
    </div>
  )

  const renderShapeEditor = (element: ShapeElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Тип фигуры</label>
        <select
          value={element.shapeType}
          onChange={handleShapeTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {SHAPE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цвет заливки</label>
          <input
            type="color"
            value={element.color}
            onChange={handleColorChange}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цвет обводки</label>
          <input
            type="color"
            value={element.borderColor}
            onChange={handleBorderColorChange}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Толщина обводки (px)</label>
        <input
          type="range"
          min="0"
          max="20"
          value={element.borderWidth}
          onChange={handleBorderWidthChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-sm text-gray-500 mt-1">{element.borderWidth}px</div>
      </div>

      {element.shapeType === "rectangle" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Скругление углов (px)</label>
          <input
            type="range"
            min="0"
            max="50"
            value={element.borderRadius}
            onChange={handleBorderRadiusChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-500 mt-1">{element.borderRadius}px</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ширина (px)</label>
          <input
            type="number"
            min="10"
            max="800"
            value={element.width}
            onChange={handleWidthChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Высота (px)</label>
          <input
            type="number"
            min="10"
            max="800"
            value={element.height}
            onChange={handleHeightChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {element.type === "text"
            ? "Редактирование текста"
            : element.type === "list"
              ? "Редактирование списка"
              : element.type === "image"
                ? "Редактирование изображения"
                : element.type === "shape"
                  ? "Редактирование фигуры"
                  : "Редактирование иконки"}
        </h3>
        <button onClick={() => onDelete(element.id)} className="p-2 text-gray-500 hover:text-red-500">
          <Trash2 size={18} />
        </button>
      </div>

      {element.type === "text" && renderTextEditor(element)}
      {element.type === "list" && renderListEditor(element)}
      {element.type === "shape" && renderShapeEditor(element)}
    </div>
  )
}
