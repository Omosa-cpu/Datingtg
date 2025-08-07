import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const profilePicture = formData.get('profilePicture') as File
    const userId = formData.get('userId') as string

    if (!profilePicture || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Get current user to check for existing image
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete old image if exists
    if (user.profilePicture) {
      try {
        const publicId = extractPublicId(user.profilePicture)
        await deleteFromCloudinary(publicId)
      } catch (error) {
        console.error('Failed to delete old image:', error)
      }
    }

    // Upload new image
    const imageUrl = await uploadToCloudinary(
      profilePicture,
      `dating-app/profiles/${user.telegramId}`
    )

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { profilePicture: imageUrl }
    })

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      user: updatedUser 
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload image' 
    }, { status: 500 })
  }
}
