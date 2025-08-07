'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SocketContextType {
  socket: any | null
  isConnected: boolean
}

const defaultContextValue: SocketContextType = {
  socket: null,
  isConnected: false
}

const SocketContext = createContext<SocketContextType>(defaultContextValue)

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Only initialize socket.io on client side and in browser environment
    if (typeof window === 'undefined') return

    let socketInstance: any = null

    const initSocket = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { io } = await import('socket.io-client')
        
        const serverUrl = process.env.NODE_ENV === 'production' 
          ? window.location.origin
          : 'http://localhost:3000'
        
        socketInstance = io(serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 20000,
        })

        socketInstance.on('connect', () => {
          console.log('Socket connected')
          setIsConnected(true)
        })

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected')
          setIsConnected(false)
        })

        socketInstance.on('connect_error', (error: any) => {
          console.log('Socket connection error:', error)
          setIsConnected(false)
        })

        setSocket(socketInstance)
      } catch (error) {
        console.error('Failed to initialize socket:', error)
        setIsConnected(false)
      }
    }

    // Delay initialization to avoid hydration issues
    const timer = setTimeout(initSocket, 1000)

    return () => {
      clearTimeout(timer)
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [])

  const contextValue: SocketContextType = {
    socket,
    isConnected
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    console.warn('useSocket must be used within a SocketProvider')
    return defaultContextValue
  }
  return context
}
