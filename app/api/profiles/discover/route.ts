import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const BOT_TOKEN = process.env.BOT_TOKEN!

function validateTelegramInitData(initData: string) {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  if (computedHash !== hash) return null

  const userParam = params.get('user')
  return userParam ? JSON.parse(userParam) : null
}

export async function GET(request: NextRequest) {
  try {
    const initData = request.headers.get('x-telegram-init-data') || ''
    const tgUser = validateTelegramInitData(initData)

    if (!tgUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the logged-in user in DB using Telegram ID
    const currentUser = await prisma.user.findUnique({
      where: { telegramId: tgUser.id.toString() }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get list of already liked user IDs
    const likedUserIds = await prisma.like.findMany({
      where: { userId: currentUser.id },
      select: { likedUserId: true }
    }).then(likes => likes.map(like => like.likedUserId))

    // Fetch ALL other users except the current one & liked ones
    const allOtherUsers = await prisma.user.findMany({
      where: {
        id: {
          not: currentUser.id,
          notIn: likedUserIds
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter in JS — men see women, women see men
    const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male'
    const profiles = allOtherUsers.filter(u => u.gender === oppositeGender)

    // Return only 10 for now
    return NextResponse.json({ profiles: profiles.slice(0, 10) })

  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}
