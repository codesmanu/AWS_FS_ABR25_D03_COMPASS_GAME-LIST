import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const url = process.env.DATABASE_URL || 'file:./dev.db';
const adapter: PrismaBetterSqlite3 = new PrismaBetterSqlite3({ url });
const instance: PrismaClient = new PrismaClient({ adapter });

export default instance;