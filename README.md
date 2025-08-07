# Telegram Dating App

A real-time dating web app built for Telegram Web Apps using Next.js, Prisma, PostgreSQL, and Socket.IO.

## Features

- 🔐 Telegram WebApp authentication
- 👤 User registration with profile setup
- 📍 Location-based matching
- ❤️ Like/Pass system with mutual matching
- 💬 Real-time chat with Socket.IO
- 📱 Mobile-responsive design optimized for Telegram
- 🗂️ Bottom navigation (Discover, Matches, Messages, Profile)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: Telegram WebApp
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (NeonDB recommended)
- Telegram Bot Token (for production)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd telegram-dating-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your database URL and other configuration:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/dating_app"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token_here"
\`\`\`

4. Set up the database:
\`\`\`bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

## Database Schema

The app uses the following main models:

- **User**: Stores user profiles with Telegram authentication
- **Like**: Tracks user likes/passes
- **Match**: Created when two users like each other
- **Message**: Stores chat messages between matched users

## API Routes

- `POST /api/auth/telegram` - Authenticate with Telegram
- `POST /api/auth/register` - Complete user registration
- `GET /api/profiles/discover` - Get profiles to swipe
- `POST /api/likes` - Like a profile
- `GET /api/matches` - Get user's matches
- `GET /api/messages/[matchId]` - Get messages for a match
- `POST /api/messages` - Send a message

## Socket.IO Events

- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `new-message` - Receive a message
- `typing` - Send typing indicator
- `user-typing` - Receive typing indicator

## Local Testing

For local development without Telegram:

1. The app will show a fallback UI when not running in Telegram
2. Authentication validation is disabled in development
3. Sample users are created via the seed script

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `TELEGRAM_BOT_TOKEN`
   - `NEXTAUTH_SECRET`
4. Deploy!

### Post-deployment setup:

1. Run database migrations:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

2. Seed the database (optional):
\`\`\`bash
npx prisma db seed
\`\`\`

## Telegram Bot Setup

1. Create a bot with @BotFather
2. Set up a Web App with your Vercel URL
3. Add the bot token to your environment variables
4. Enable hash validation in production

## File Structure

\`\`\`
├── app/
│   ├── api/                 # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── auth/               # Authentication components
│   ├── chat/               # Chat components
│   ├── navigation/         # Navigation components
│   ├── profile/            # Profile components
│   ├── providers/          # Context providers
│   ├── tabs/               # Tab components
│   └── ui/                 # UI components
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── telegram-auth.ts    # Telegram auth utilities
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
└── scripts/
    └── *.sql               # SQL migration scripts
\`\`\`

## Common Issues

1. **Socket.IO not working**: Make sure your hosting platform supports WebSockets
2. **Database connection**: Verify your DATABASE_URL is correct
3. **Telegram auth**: Hash validation is disabled in development
4. **Image uploads**: Currently mocked - integrate with Supabase/Cloudinary for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
