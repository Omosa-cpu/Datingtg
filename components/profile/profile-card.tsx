'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, X, MapPin } from 'lucide-react'

interface ProfileCardProps {
  profile: any
  onLike: () => void
  onPass: () => void
}

export function ProfileCard({ profile, onLike, onPass }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative">
        <div className="h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture || "/placeholder.svg"}
              alt={profile.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <span className="text-6xl">👤</span>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-t-lg">
          <h2 className="text-white text-2xl font-bold">
            {profile.name}, {profile.age}
          </h2>
          {profile.location && (
            <div className="flex items-center text-white/80 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">Nearby</span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <p className="text-gray-600 mb-4">{profile.bio}</p>
        
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onPass}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            onClick={onLike}
            className="flex-1 bg-pink-500 hover:bg-pink-600"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
