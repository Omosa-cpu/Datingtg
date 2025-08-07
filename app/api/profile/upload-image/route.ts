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
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user to check for existing image
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let imageUrl: string | null = null

    try {
      // Convert the File to Buffer
      const arrayBuffer = await profilePicture.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { v2: cloudinary } = await import('cloudinary')
      const { extractPublicId } = await import('@/lib/cloudinary-utils') // helper for extracting ID

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })

      // Delete old image if exists
      if (user.profilePicture) {
        try {
          const publicId = extractPublicId(user.profilePicture)
          await cloudinary.uploader.destroy(publicId)
        } catch (error) {
          console.error('Failed to delete old image:', error)
        }
      }

      // Upload the new image using stream
      imageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `dating-app/profiles/${user.telegramId}`,
              resource_type: 'image'
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result?.secure_url || null)
            }
          )
          .end(buffer)
      })
    } catch (error) {
      console.error('Cloudinary error:', error)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
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
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
