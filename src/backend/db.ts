import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL || 'mysql://root:mysql@localhost:3306/jana_interior_designer';

// Robust parsing of the DATABASE_URL connection string into a PoolConfig object for the mariadb driver
const url = new URL(connectionString);
const poolConfig = {
  host: url.hostname || '127.0.0.1',
  port: parseInt(url.port || '3306', 10),
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'jana_interior_designer'),
  allowPublicKeyRetrieval: true,
  connectionLimit: 10,
};

const adapter = new PrismaMariaDb(poolConfig);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;
