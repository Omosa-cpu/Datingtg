'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string // This will be the URL
  userId: string
  onImageUpdate: (imageUrl: string) => void // Callback to update parent with new URL
}

export function ImageUpload({ currentImage, userId, onImageUpdate }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // For immediate local preview

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create local preview URL immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('profilePicture', file)
      formData.append('userId', userId)

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        onImageUpdate(data.imageUrl) // Pass the new URL back to the parent
        setPreviewUrl(null) // Clear local preview as actual image is now set
      } else {
        alert(data.error || 'Upload failed')
        setPreviewUrl(null) // Clear preview on failure
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
      setPreviewUrl(null) // Clear preview on failure
    } finally {
      setUploading(false)
    }
  }

  // Display logic: local preview takes precedence, then currentImage from props
  const displayImage = previewUrl || currentImage

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          {displayImage ? (
            <img
              src={displayImage || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Change Photo'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
}
