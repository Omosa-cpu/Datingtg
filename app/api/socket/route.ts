import { NextRequest } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface NextApiResponseServerIO extends NextApiResponse {
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
