import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { telegramId: '123456789' },
      update: {},
      create: {
        telegramId: '123456789',
        name: 'Alice Johnson',
        age: 25,
        gender: 'female',
        bio: 'Love hiking and photography! Looking for someone to explore the world with.',
        profilePicture: '/placeholder.svg?height=400&width=400',
        latitude: 40.7128,
        longitude: -74.0060
      }
    }),
    prisma.user.upsert({
      where: { telegramId: '987654321' },
      update: {},
      create: {
        telegramId: '987654321',
        name: 'Bob Smith',
        age: 28,
        gender: 'male',
        bio: 'Software developer by day, chef by night. Let\'s cook something amazing together!',
        profilePicture: '/placeholder.svg?height=400&width=400',
        latitude: 40.7589,
        longitude: -73.9851
      }
    }),
    prisma.user.upsert({
      where: { telegramId: '456789123' },
      update: {},
      create: {
        telegramId: '456789123',
        name: 'Emma Wilson',
        age: 23,
        gender: 'female',
        bio: 'Yoga instructor and dog lover. Seeking genuine connections and good vibes.',
        profilePicture: '/placeholder.svg?height=400&width=400',
        latitude: 40.7505,
        longitude: -73.9934
      }
    })
  ])

  console.log('Seeded users:', users.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
