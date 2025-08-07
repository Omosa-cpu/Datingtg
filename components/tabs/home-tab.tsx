'use client'

import { useState, useEffect } from 'react'
import { ProfileCard } from '@/components/profile/profile-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface HomeTabProps {
  user: any
}

export function HomeTab({ user }: HomeTabProps) {
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles/discover')
      const data = await response.json()
      setProfiles(data.profiles || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (profileId: string) => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likedUserId: profileId }),
      })

      const data = await response.json()
      
      if (data.match) {
        // Show match notification
        alert('It\'s a match! 🎉')
      }

      setCurrentIndex(prev => prev + 1)
    } catch (error) {
      console.error('Error liking profile:', error)
    }
  }

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
          <p className="text-gray-600">Check back later for new people!</p>
        </div>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <ProfileCard
        profile={currentProfile}
        onLike={() => handleLike(currentProfile.id)}
        onPass={handlePass}
      />
    </div>
  )
}
