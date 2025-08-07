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

  // Parse user object
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

    const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male'

    const likedUserIds = await prisma.like.findMany({
      where: { userId: currentUser.id },
      select: { likedUserId: true }
    }).then(likes => likes.map(like => like.likedUserId))

    const profiles = await prisma.user.findMany({
      where: {
        gender: oppositeGender,
        id: {
          not: currentUser.id,
          notIn: likedUserIds
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
