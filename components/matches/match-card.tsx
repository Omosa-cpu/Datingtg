'use client'

import { Card, CardContent } from '@/components/ui/card'

interface MatchCardProps {
  match: any
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          {match.user.profilePicture ? (
            <img
              src={match.user.profilePicture || "/placeholder.svg"}
              alt={match.user.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>
        <h3 className="font-semibold text-center">{match.user.name}</h3>
        <p className="text-sm text-gray-600 text-center">
          Matched {new Date(match.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
