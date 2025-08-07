import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { name, age, bio } = await request.json()
    const currentUserId = 1 // Replace with actual user ID from auth

    const user = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        name,
        age: parseInt(age),
        bio
      }
    })

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
