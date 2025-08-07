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
  const [profileImage, setProfileImage] = useState(user?.profilePicture || '')

  const handleSave = async () => {
    try {
      const body = new FormData()
      body.append('name', formData.name)
      body.append('age', formData.age.toString())
      body.append('bio', formData.bio)
      body.append('telegramId', user?.telegramId || '')
      if (profileImage instanceof File) {
        body.append('profilePicture', profileImage)
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        body
      })

      if (response.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleImageUpdate = (image: string | File) => {
    setProfileImage(image)
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
          {/* Show Profile Image */}
          {!isEditing && profileImage && (
            <div className="flex justify-center">
              <img
                src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
            </div>
          )}

          {/* Image Upload in edit mode */}
          {isEditing && (
            <ImageUpload
              currentImage={typeof profileImage === 'string' ? profileImage : ''}
              userId={user?.id?.toString() || '1'}
              onImageUpdate={handleImageUpdate}
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
