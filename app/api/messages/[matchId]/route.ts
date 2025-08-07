import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = parseInt(params.matchId)
    const currentUserId = 1 // Replace with actual user ID from auth

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId }
        ]
      }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      include: {
        sender: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
