import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const userData = {
      telegramId: formData.get('telegramId') as string,
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      bio: formData.get('bio') as string,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
    }

    // Handle profile picture upload (mock implementation)
    const profilePicture = formData.get('profilePicture') as File
    let profilePictureUrl = null
    
    if (profilePicture) {
      // In production, upload to Supabase Storage or Cloudinary
      profilePictureUrl = '/placeholder.svg?height=400&width=400'
    }

    const user = await prisma.user.create({
      data: {
        ...userData,
        profilePicture: profilePictureUrl,
      }
    })

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
