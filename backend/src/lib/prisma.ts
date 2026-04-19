import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Instantiates a single instance of PrismaClient and save it on the globalThis object.
 * Prevents multiple instances of PrismaClient in development (when hot reloading).
 * In production, a single instance is used throughout the app's lifecycle.
 * 
 * Usage:
 * import { prisma } from './lib/prisma';
 * 
 * await prisma.user.findUnique({ where: { id: 1 } });
 */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle disconnection on application exit
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
