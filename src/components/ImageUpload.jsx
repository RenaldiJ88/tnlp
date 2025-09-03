"use client"

import { useState } from 'react'

const ImageUpload = ({ onImageUpload, currentImage, uploading }) => {
  const [dragActive, setDragActive] = useState(false)
  
  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      onImageUpload(files[0])
    }
  }
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImageUpload(file)
    }
  }
  
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
    >
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 mt-2">Subiendo imagen...</p>
        </div>
      ) : currentImage ? (
        <div>
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-32 h-32 object-cover mx-auto rounded shadow-md" 
          />
          <p className="text-sm text-gray-600 mt-2">Imagen seleccionada</p>
          <button
            onClick={() => onImageUpload(null)}
            className="text-red-600 text-sm hover:text-red-800 mt-1"
          >
            Cambiar imagen
          </button>
        </div>
      ) : (
        <div>
          <div className="text-4xl text-gray-400 mb-2">📷</div>
          <p className="text-gray-600 mb-2">Arrastra una imagen aquí o</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
          >
            selecciona un archivo
          </label>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, WebP (máx. 10MB)
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
