'use client'

import { useState, useEffect } from 'react'
import { MatchCard } from '@/components/matches/match-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface MatchesTabProps {
  user: any
}

export function MatchesTab({ user }: MatchesTabProps) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No matches yet. Keep swiping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {matches.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
