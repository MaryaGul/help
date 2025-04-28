"use client"

interface TextEditorProps {
  title: string
  description: string
  price: string
  titleFontSize: number
  descriptionFontSize: number
  priceFontSize: number
  onTextChange: (field: "title" | "description" | "price", value: string) => void
  onFontSizeChange: (field: "title" | "description" | "price", size: number) => void
}

export default function TextEditor({
  title,
  description,
  price,
  titleFontSize,
  descriptionFontSize,
  priceFontSize,
  onTextChange,
  onFontSizeChange,
}: TextEditorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Текст</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Название
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => onTextChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center mt-1">
            <label htmlFor="title-size" className="block text-xs text-gray-500 mr-2">
              Размер:
            </label>
            <input
              type="range"
              id="title-size"
              min="12"
              max="48"
              value={titleFontSize}
              onChange={(e) => onFontSizeChange("title", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 ml-2 w-6">{titleFontSize}</span>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => onTextChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center mt-1">
            <label htmlFor="description-size" className="block text-xs text-gray-500 mr-2">
              Размер:
            </label>
            <input
              type="range"
              id="description-size"
              min="10"
              max="32"
              value={descriptionFontSize}
              onChange={(e) => onFontSizeChange("description", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 ml-2 w-6">{descriptionFontSize}</span>
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Цена
          </label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => onTextChange("price", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center mt-1">
            <label htmlFor="price-size" className="block text-xs text-gray-500 mr-2">
              Размер:
            </label>
            <input
              type="range"
              id="price-size"
              min="12"
              max="48"
              value={priceFontSize}
              onChange={(e) => onFontSizeChange("price", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 ml-2 w-6">{priceFontSize}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
