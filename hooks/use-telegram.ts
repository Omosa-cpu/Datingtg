'use client'

import { useTelegram as useTelegramFromProvider } from '@/components/providers/telegram-provider'

// Re-export the hook from the provider
export const useTelegram = useTelegramFromProvider
