import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

type PrismaWithAccelerate = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaWithAccelerate
}

function createPrismaClient() {
  return new PrismaClient({
    accelerateUrl: process.env.ACCELERATE_URL,
  }).$extends(withAccelerate())
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
