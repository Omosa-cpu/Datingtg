import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session/auth (simplified)
    const currentUserId = 1 // Replace with actual user ID from auth

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get users of opposite gender that haven't been liked/passed
    const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male'
    
    const profiles = await prisma.user.findMany({
      where: {
        gender: oppositeGender,
        id: {
          not: currentUserId,
          notIn: await prisma.like.findMany({
            where: { userId: currentUserId },
            select: { likedUserId: true }
          }).then(likes => likes.map(like => like.likedUserId))
        }
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ profiles })

  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}
