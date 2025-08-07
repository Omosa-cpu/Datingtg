'use client'

import { useState } from 'react'
import { BottomNavigation } from '@/components/navigation/bottom-navigation'
import { HomeTab } from '@/components/tabs/home-tab'
import { MatchesTab } from '@/components/tabs/matches-tab'
import { MessagesTab } from '@/components/tabs/messages-tab'
import { ProfileTab } from '@/components/tabs/profile-tab'

interface MainAppProps {
  user: any
}

export function MainApp({ user }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('home')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab user={user} />
      case 'matches':
        return <MatchesTab user={user} />
      case 'messages':
        return <MessagesTab user={user} />
      case 'profile':
        return <ProfileTab user={user} />
      default:
        return <HomeTab user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-16">
        {renderActiveTab()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
