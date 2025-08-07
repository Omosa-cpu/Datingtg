import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id)
    const currentUserId = 1 // Replace with actual user ID from auth

    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId }
        ]
      },
      include: {
        user1: true,
        user2: true
      }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Return the other user
    const otherUser = match.user1Id === currentUserId ? match.user2 : match.user1

    return NextResponse.json({ 
      match: {
        id: match.id,
        user: otherUser
      }
    })

  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 })
  }
}
