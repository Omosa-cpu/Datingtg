import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session/auth (simplified for now)
    const currentUserId = 1 // Replace with actual user ID from auth

    let currentUser = null
    try {
      currentUser = await prisma.user.findUnique({
        where: { id: currentUserId }
      })
    } catch (error) {
      console.error('Database error finding user:', error)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get users of opposite gender that haven't been liked/passed
    const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male'
    
    let profiles = []
    try {
      // Get liked user IDs
      const likedUsers = await prisma.like.findMany({
        where: { userId: currentUserId },
        select: { likedUserId: true }
      })
      
      const likedUserIds = likedUsers.map(like => like.likedUserId)

      profiles = await prisma.user.findMany({
        where: {
          gender: oppositeGender,
          id: {
            not: currentUserId,
            notIn: likedUserIds
          }
        },
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Database error fetching profiles:', error)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    return NextResponse.json({ profiles })

  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}
