import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users including your test ID
  const users = await Promise.all([
    prisma.user.upsert({
      where: { telegramId: '257779219536125' },
      update: {},
      create: {
        telegramId: '257779219536125',
        name: 'Test User',
        age: 25,
        gender: 'male',
        bio: 'Test user for development and debugging.',
        profilePicture: 'https://res.cloudinary.com/dljoxzmu7/image/upload/v1/dating-app/profiles/test-user.jpg',
        latitude: 40.7128,
        longitude: -74.0060
      }
    }),
    prisma.user.upsert({
      where: { telegramId: '123456789' },
      update: {},
      create: {
        telegramId: '123456789',
        name: 'Alice Johnson',
        age: 25,
        gender: 'female',
        bio: 'Love hiking and photography! Looking for someone to explore the world with.',
        profilePicture: 'https://res.cloudinary.com/dljoxzmu7/image/upload/v1/dating-app/profiles/alice.jpg',
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
        profilePicture: 'https://res.cloudinary.com/dljoxzmu7/image/upload/v1/dating-app/profiles/bob.jpg',
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
        profilePicture: 'https://res.cloudinary.com/dljoxzmu7/image/upload/v1/dating-app/profiles/emma.jpg',
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
