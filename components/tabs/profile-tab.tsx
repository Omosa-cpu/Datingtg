'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/profile/image-upload'
import { Edit, Save, X } from 'lucide-react'

interface ProfileTabProps {
  user: any
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    bio: user?.bio || '',
  })
  // profileImage now always stores the URL
  const [profileImage, setProfileImage] = useState(user?.profilePicture || '')

  const handleSave = async () => {
    try {
      // Only send text data to the update API
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsEditing(false)
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save profile changes.');
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error saving profile changes. Please try again.');
    }
  }

  // This callback receives the new image URL from ImageUpload
  const handleImageUpdate = (imageUrl: string) => {
    setProfileImage(imageUrl)
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Profile</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show Profile Image when not editing */}
          {!isEditing && profileImage && (
            <div className="flex justify-center">
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
          {!isEditing && !profileImage && (
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-4xl">👤</span>
              </div>
            </div>
          )}

          {/* Image Upload component when editing */}
          {isEditing && (
            <ImageUpload
              currentImage={profileImage} // Pass the current URL
              userId={user?.id?.toString() || '1'} // Ensure userId is passed
              onImageUpdate={handleImageUpdate} // Callback for new URL
            />
          )}

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="w-full p-2 border rounded-md disabled:bg-gray-50"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
