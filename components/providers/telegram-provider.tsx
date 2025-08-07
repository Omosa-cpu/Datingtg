'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface TelegramContextType {
  webApp: any
  user: any
  isLoading: boolean
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isLoading: true
})

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()
        
        setWebApp(tg)
        setUser(tg.initDataUnsafe?.user)
        setIsLoading(false)
      } else {
        // For development/testing
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    // Load Telegram Web App script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-web-app.js'
    script.onload = initTelegram
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <TelegramContext.Provider value={{ webApp, user, isLoading }}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => useContext(TelegramContext)
