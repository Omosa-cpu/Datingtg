import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TelegramProvider } from '@/components/providers/telegram-provider'
import { SocketProvider } from '@/components/providers/socket-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dating App - Telegram',
  description: 'Real-time dating app for Telegram Web Apps',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TelegramProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </TelegramProvider>
      </body>
    </html>
  )
}
