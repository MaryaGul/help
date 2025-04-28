"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string, removeBackground: boolean) => void
  isLoading: boolean
}

export default function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const [removeBackground, setRemoveBackground] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          onImageUpload(e.target.result, removeBackground)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">Загрузка фото товара</h3>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Перетащите изображение сюда или кликните для выбора</p>
      </div>

      <div className="mt-3 flex items-center">
        <input
          type="checkbox"
          id="remove-background"
          checked={removeBackground}
          onChange={(e) => setRemoveBackground(e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="remove-background" className="ml-2 text-sm text-gray-700">
          Удалить фон (Cloudinary AI)
        </label>
      </div>

      {isLoading && (
        <div className="mt-3 flex items-center text-sm text-blue-600">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          Обработка изображения...
        </div>
      )}
    </div>
  )
}
