'use client'

import { useEffect, useState } from 'react'
import { useTelegram } from '@/components/providers/telegram-provider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { RegistrationForm } from '@/components/auth/registration-form'
import { MainApp } from '@/components/main-app'

export default function Home() {
  const { webApp, user, isLoading } = useTelegram()
  const [authUser, setAuthUser] = useState<any>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && user) {
      authenticateUser()
    } else if (!isLoading && !user) {
      // No user found, stop loading
      setAuthLoading(false)
    }
  }, [isLoading, user])

  const authenticateUser = async () => {
    try {
      console.log('Authenticating user:', user)
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: webApp?.initData || 'mock_data',
          user: user
        }),
      })

      const data = await response.json()
      console.log('Auth response:', data)
      
      if (data.success) {
        setAuthUser(data.user)
        setIsNewUser(data.isNewUser)
      } else {
        console.error('Authentication failed:', data.error)
      }
    } catch (error) {
      console.error('Authentication failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  // Show loading while initializing
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Initializing app...' : 'Authenticating...'}
          </p>
        </div>
      </div>
    )
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">💕 Dating App</h1>
          <p className="text-gray-600 mb-6">
            Unable to initialize user data. Please refresh the page or try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Show registration form for new users
  if (isNewUser) {
    return <RegistrationForm user={user} onComplete={() => setIsNewUser(false)} />
  }

  // Show main app for existing users
  return <MainApp user={authUser} />
}
