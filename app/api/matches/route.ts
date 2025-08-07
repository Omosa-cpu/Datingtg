import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const currentUserId = 1 // Replace with actual user ID from auth

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId }
        ]
      },
      include: {
        user1: true,
        user2: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format matches to include the other user
    const formattedMatches = matches.map(match => ({
      id: match.id,
      createdAt: match.createdAt,
      user: match.user1Id === currentUserId ? match.user2 : match.user1
    }))

    return NextResponse.json({ matches: formattedMatches })

  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}
