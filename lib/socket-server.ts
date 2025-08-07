// Separate Socket.IO server logic for better organization
import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'

export function initializeSocketServer(server: NetServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-app.vercel.app'] 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  })

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

  return io
}
