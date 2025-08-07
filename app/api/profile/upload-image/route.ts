import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Add route segment config
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    let imageUrl = null

    try {
      // Dynamic import to avoid build issues
      const { uploadToCloudinary, deleteFromCloudinary, extractPublicId } = await import('@/lib/cloudinary')

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
      imageUrl = await uploadToCloudinary(
        profilePicture,
        `dating-app/profiles/${user.telegramId}`
      )
    } catch (error) {
      console.error('Cloudinary error:', error)
      return NextResponse.json({ 
        error: 'Failed to upload image' 
      }, { status: 500 })
    }

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
