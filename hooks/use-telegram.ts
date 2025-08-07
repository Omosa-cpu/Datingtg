'use client'

import { useContext } from 'react'
import { TelegramContext } from '@/components/providers/telegram-provider'

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
