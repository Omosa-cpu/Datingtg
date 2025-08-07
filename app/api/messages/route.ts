import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { matchId, content } = await request.json()
    const currentUserId = 1 // Replace with actual user ID from auth

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: parseInt(matchId),
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId }
        ]
      }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        matchId: parseInt(matchId),
        senderId: currentUserId,
        content
      },
      include: {
        sender: true
      }
    })

    // Emit to Socket.IO (handled in socket server)
    // This would be handled by the Socket.IO server

    return NextResponse.json({ success: true, message })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
