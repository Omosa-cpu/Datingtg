'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/hooks/use-telegram'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { RegistrationForm } from '@/components/auth/registration-form'
import { MainApp } from '@/components/main-app'

export default function Home() {
  const { webApp, user, isLoading } = useTelegram()
  const [authUser, setAuthUser] = useState<any>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && webApp && user) {
      authenticateUser()
    }
  }, [isLoading, webApp, user])

  const authenticateUser = async () => {
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: webApp?.initData,
          user: user
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAuthUser(data.user)
        setIsNewUser(data.isNewUser)
      }
    } catch (error) {
      console.error('Authentication failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!webApp || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Dating App</h1>
          <p className="text-gray-600">Please open this app through Telegram</p>
        </div>
      </div>
    )
  }

  if (isNewUser) {
    return <RegistrationForm user={user} onComplete={() => setIsNewUser(false)} />
  }

  return <MainApp user={authUser} />
}
