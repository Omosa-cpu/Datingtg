import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { likedUserId } = await request.json()
    const currentUserId = 1 // Replace with actual user ID from auth

    // Create like
    const like = await prisma.like.create({
      data: {
        userId: currentUserId,
        likedUserId: parseInt(likedUserId)
      }
    })

    // Check if it's a mutual like (match)
    const mutualLike = await prisma.like.findFirst({
      where: {
        userId: parseInt(likedUserId),
        likedUserId: currentUserId
      }
    })

    let match = null
    if (mutualLike) {
      // Create match
      match = await prisma.match.create({
        data: {
          user1Id: Math.min(currentUserId, parseInt(likedUserId)),
          user2Id: Math.max(currentUserId, parseInt(likedUserId))
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      like,
      match: !!match 
    })

  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
  }
}
