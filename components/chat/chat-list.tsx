'use client'

interface ChatListProps {
  conversations: any[]
  onSelectChat: (chatId: string) => void
}

export function ChatList({ conversations, onSelectChat }: ChatListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectChat(conversation.id)}
          className="p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {conversation.user.profilePicture ? (
              <img
                src={conversation.user.profilePicture || "/placeholder.svg"}
                alt={conversation.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold">{conversation.user.name}</h3>
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage?.content || 'Say hello!'}
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            {conversation.lastMessage && 
              new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          </div>
        </div>
      ))}
    </div>
  )
}
