'use client'

import { useState, useEffect } from 'react'
import { ChatList } from '@/components/chat/chat-list'
import { ChatRoom } from '@/components/chat/chat-room'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface MessagesTabProps {
  user: any
}

export function MessagesTab({ user }: MessagesTabProps) {
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (selectedChat) {
    return (
      <ChatRoom
        matchId={selectedChat}
        user={user}
        onBack={() => setSelectedChat(null)}
      />
    )
  }

  return (
    <div className="h-screen">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      
      <ChatList
        conversations={conversations}
        onSelectChat={setSelectedChat}
      />
    </div>
  )
}
