'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface TelegramContextType {
  webApp: any
  user: any
  isLoading: boolean
}

const defaultContextValue: TelegramContextType = {
  webApp: null,
  user: null,
  isLoading: true
}

// Create and export the context
export const TelegramContext = createContext<TelegramContextType>(defaultContextValue)

interface TelegramProviderProps {
  children: ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [webApp, setWebApp] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initTelegram = () => {
      if (!mounted) return

      try {
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
          console.log('Telegram WebApp detected')
          const tg = (window as any).Telegram.WebApp
          tg.ready()
          tg.expand()
          
          setWebApp(tg)
          setUser(tg.initDataUnsafe?.user)
        } else {
          console.log('Running in development mode - using mock user')
          // Create mock user for development
          const mockUser = {
            id: 257779219536125,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          }
          const mockWebApp = {
            initData: 'mock_init_data',
            ready: () => console.log('Mock WebApp ready'),
            expand: () => console.log('Mock WebApp expand')
          }
          
          setWebApp(mockWebApp)
          setUser(mockUser)
        }
      } catch (error) {
        console.error('Error initializing Telegram:', error)
        // Fallback to mock data on error
        const mockUser = {
          id: 257779219536125,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser'
        }
        setUser(mockUser)
        setWebApp({ initData: 'mock_init_data' })
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Try to load Telegram script
    if (typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]')
      
      if (existingScript) {
        // Script already exists, just initialize
        setTimeout(initTelegram, 100)
      } else {
        // Load the script
        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-web-app.js'
        script.async = true
        
        script.onload = () => {
          setTimeout(initTelegram, 100)
        }
        
        script.onerror = () => {
          console.log('Telegram script failed to load, using mock data')
          initTelegram()
        }
        
        document.head.appendChild(script)
      }

      // Fallback timeout
      const fallbackTimeout = setTimeout(() => {
        if (mounted && isLoading) {
          console.log('Fallback timeout triggered')
          initTelegram()
        }
      }, 3000)

      return () => {
        mounted = false
        clearTimeout(fallbackTimeout)
      }
    } else {
      // Server-side, just set loading to false
      setIsLoading(false)
    }
  }, [])

  const contextValue: TelegramContextType = {
    webApp,
    user,
    isLoading
  }

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  )
}

// Custom hook with better error handling
export function useTelegram(): TelegramContextType {
  const context = useContext(TelegramContext)
  
  if (context === undefined) {
    console.error('useTelegram must be used within a TelegramProvider')
    // Return default values instead of throwing
    return defaultContextValue
  }
  
  return context
}
