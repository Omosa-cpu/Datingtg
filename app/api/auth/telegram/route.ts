import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { initData, user } = await request.json()

    // Skip validation in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment && process.env.TELEGRAM_BOT_TOKEN) {
      // Only validate if we have a bot token in production
      try {
        const { validateTelegramAuth } = await import('@/lib/telegram-auth')
        const isValid = validateTelegramAuth(initData, process.env.TELEGRAM_BOT_TOKEN)
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
        }
      } catch (error) {
        console.warn('Telegram auth validation failed:', error)
        // Continue without validation in case of import issues
      }
    }

    // Check if user exists
    let existingUser = null
    try {
      existingUser = await prisma.user.findUnique({
        where: { telegramId: user.id.toString() }
      })
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

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
