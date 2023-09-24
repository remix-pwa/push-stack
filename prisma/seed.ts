import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

  await prisma.user.create({
    data: {
      email: 'aliceinwonderland@dreams.com',
      username: 'aliceinwonderland',
      password: '$2y$10$wSOqiJcpJi4WK7TUdAI0HeifTukbweOWSBpl29FNisUywhWp7l4Kq' // alice.123
    }
  })

  await prisma.user.create({
    data: {
      email: 'snoringtroll@gmail.com',
      username: 'rollerblades',
      password: '$2y$10$MCNVK0FU9bWS9E.WQ8UX8exPF/LM/y5piTxh5D/78rQly.nGXGU62' // skates09
    }
  })

  await prisma.user.create({
    data: {
      email: 'fasthare@test.com',
      username: 'fastesthare',
      password: '$2y$10$3dgpxxBNc01kDRK5BYJLTOMiiKzzLmS0l8WwibptIC6IaduuiY5z.' // lovespeed
    }
  })

  console.timeEnd(`🌱 Database has been seeded`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })