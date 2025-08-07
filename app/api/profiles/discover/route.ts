import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN! // Your Telegram bot token

function validateTelegramInitData(initData: string) {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null

  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest()

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (computedHash !== hash) return null

  try {
    const userParam = params.get('user')
    return userParam ? JSON.parse(userParam) : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const initData = request.headers.get('x-telegram-init-data') || ''
    
    // In development, use a test user ID if initData is not available or invalid
    const isDevelopment = process.env.NODE_ENV === 'development';
    let tgUser = null;

    if (isDevelopment) {
      // Use a hardcoded test user ID for development
      tgUser = { id: process.env.TEST_TELEGRAM_ID || '257779219536125' }; 
    } else {
      // In production, validate initData
      tgUser = validateTelegramInitData(initData);
    }

    if (!tgUser || !tgUser.id) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Telegram user data' }, { status: 401 });
    }

    // Ensure Telegram ID is a string
    const currentUser = await prisma.user.findUnique({
      where: { telegramId: String(tgUser.id) }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found or profile not completed' }, { status: 404 })
    }

    const oppositeGender =
      currentUser.gender === 'male' ? 'female' : 'male'

    const likedUserIds = (
      await prisma.like.findMany({
        where: { userId: currentUser.id },
        select: { likedUserId: true }
      })
    ).map(like => like.likedUserId)

    const profiles = await prisma.user.findMany({
      where: {
        gender: oppositeGender,
        id: {
          not: currentUser.id,
          notIn: likedUserIds
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}
