import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateTelegramAuth } from '@/lib/telegram-auth'

export async function POST(request: NextRequest) {
  try {
    const { initData, user } = await request.json()

    // Validate Telegram auth (uncomment for production)
    // const isValid = validateTelegramAuth(initData, process.env.TELEGRAM_BOT_TOKEN!)
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    // }

    // Check if user exists
    let existingUser = await prisma.user.findUnique({
      where: { telegramId: user.id.toString() }
    })

    if (existingUser) {
      return NextResponse.json({
        success: true,
        user: existingUser,
        isNewUser: false
      })
    }

    return NextResponse.json({
      success: true,
      user: null,
      isNewUser: true
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
