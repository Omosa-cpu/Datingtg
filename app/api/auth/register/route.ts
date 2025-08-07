import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Add route segment config for better performance
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

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

    let profilePictureUrl: string | null = null

    // Handle profile picture upload
    const profilePicture = formData.get('profilePicture') as File
    if (profilePicture && profilePicture.size > 0) {
      try {
        // Convert File to Buffer
        const arrayBuffer = await profilePicture.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Cloudinary
        profilePictureUrl = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: `dating-app/profiles/${userData.telegramId}`,
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
        console.error('Image upload failed:', error)
      }
    }

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        ...userData,
        profilePicture: profilePictureUrl
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
