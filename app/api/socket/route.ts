import { NextRequest, NextResponse } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

// Remove deprecated config export - use route segment config instead
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface NextApiResponseServerIO extends NextResponse {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

const SocketHandler = (req: NextRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      socket.on('join-room', (matchId) => {
        socket.join(`match-${matchId}`)
        console.log(`User ${socket.id} joined match-${matchId}`)
      })

      socket.on('leave-room', (matchId) => {
        socket.leave(`match-${matchId}`)
        console.log(`User ${socket.id} left match-${matchId}`)
      })

      socket.on('send-message', (data) => {
        socket.to(`match-${data.matchId}`).emit('new-message', data.message)
      })

      socket.on('typing', (data) => {
        socket.to(`match-${data.matchId}`).emit('user-typing', {
          userId: data.userId,
          isTyping: data.isTyping
        })
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })
  }

  res.end()
}

export default SocketHandler

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Socket.IO endpoint',
    status: 'available',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Socket.IO endpoint',
    status: 'available',
    timestamp: new Date().toISOString()
  })
}
