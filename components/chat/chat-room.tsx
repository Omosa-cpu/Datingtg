'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send } from 'lucide-react'
import { useSocket } from '@/components/providers/socket-provider'

interface ChatRoomProps {
  matchId: string
  user: any
  onBack: () => void
}

export function ChatRoom({ matchId, user, onBack }: ChatRoomProps) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket()

  useEffect(() => {
    fetchMessages()
    fetchMatchDetails()
  }, [matchId])

  useEffect(() => {
    if (socket) {
      socket.emit('join-room', matchId)

      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message])
      })

      socket.on('user-typing', ({ userId, isTyping }) => {
        if (userId !== user.id) {
          setIsTyping(isTyping)
        }
      })

      return () => {
        socket.off('new-message')
        socket.off('user-typing')
        socket.emit('leave-room', matchId)
      }
    }
  }, [socket, matchId, user.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${matchId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`)
      const data = await response.json()
      setOtherUser(data.match.user)
    } catch (error) {
      console.error('Error fetching match details:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          content: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)
    
    if (socket) {
      socket.emit('typing', {
        matchId,
        userId: user.id,
        isTyping: value.length > 0
      })
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-3 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {otherUser?.profilePicture ? (
              <img
                src={otherUser.profilePicture || "/placeholder.svg"}
                alt={otherUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{otherUser?.name}</h2>
            {isTyping && (
              <p className="text-sm text-gray-500">typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === user.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === user.id ? 'text-pink-100' : 'text-gray-500'
              }`}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
