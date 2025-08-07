'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, MapPin, X, Check } from 'lucide-react'

interface RegistrationFormProps {
  user: any
  onComplete: () => void
}

export function RegistrationForm({ user, onComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: user?.first_name || '',
    age: '',
    gender: '',
    bio: '',
    profilePicture: null as File | null,
    location: null as { lat: number; lng: number } | null
  })
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const getLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }))
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationLoading(false)
        }
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }))
    setPreviewUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('age', formData.age)
      formDataToSend.append('gender', formData.gender)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('telegramId', user.id.toString())
      
      if (formData.location) {
        formDataToSend.append('latitude', formData.location.lat.toString())
        formDataToSend.append('longitude', formData.location.lng.toString())
      }
      
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture)
        setUploadProgress(50) // Simulate progress
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formDataToSend,
      })

      setUploadProgress(100)

      if (response.ok) {
        setTimeout(() => {
          onComplete()
        }, 500)
      } else {
        const error = await response.json()
        alert(error.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full p-2 border rounded-md"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <Label>Profile Picture</Label>
              <div className="mt-2">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-picture"
                    />
                    <label
                      htmlFor="profile-picture"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 mr-2" />
                      Upload Photo
                    </label>
                  </>
                )}
              </div>
              
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                disabled={locationLoading}
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {locationLoading ? 'Getting Location...' : 
                 formData.location ? (
                   <>
                     <Check className="w-4 h-4 mr-2" />
                     Location Added
                   </>
                 ) : 'Add Location'}
              </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
