'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProfileCard } from '@/components/profile/profile-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface HomeTabProps {
  user: any
}

export function HomeTab({ user }: HomeTabProps) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const updateScrollBtns = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }

    emblaApi.on('select', updateScrollBtns)
    emblaApi.on('reInit', updateScrollBtns)
    updateScrollBtns() // Initial check

    return () => {
      emblaApi.off('select', updateScrollBtns)
      emblaApi.off('reInit', updateScrollBtns)
    }
  }, [emblaApi])

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

  const handleSwipeAction = async (profileId: string, action: 'like' | 'pass') => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likedUserId: profileId, action }), // Pass action to API if needed
      })

      const data = await response.json()
      
      if (data.match) {
        alert('It\'s a match! 🎉')
      }

      // Move to the next slide after action
      if (emblaApi && emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        // If no more profiles, clear them or show end message
        setProfiles([]) // Or handle end of profiles differently
      }

    } catch (error) {
      console.error(`Error ${action}ing profile:`, error)
    }
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
          <p className="text-gray-600">Check back later for new people!</p>
          <Button onClick={fetchProfiles} className="mt-4">Refresh Profiles</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center p-4">
      <div className="embla w-full max-w-sm mx-auto h-full flex items-center justify-center">
        <div className="embla__viewport w-full h-full" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {profiles.map((profile: any) => (
              <div className="embla__slide flex-[0_0_100%] min-w-0 flex items-center justify-center p-2" key={profile.id}>
                <ProfileCard
                  profile={profile}
                  onLike={() => handleSwipeAction(profile.id, 'like')}
                  onPass={() => handleSwipeAction(profile.id, 'pass')}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons (Optional, for desktop or accessibility) */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-4 z-10">
        <Button onClick={scrollPrev} disabled={!canScrollPrev} variant="outline" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button onClick={scrollNext} disabled={!canScrollNext} variant="outline" size="icon">
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
