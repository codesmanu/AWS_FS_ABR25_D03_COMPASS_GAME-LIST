import app from './app.js';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT || 3001;

export const prisma = new PrismaClient();

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Connected to SQLite database via Prisma');
  });
}

main().catch(async (e) => {
  console.error('Failed to start server:', e);
  await prisma.$disconnect();
  process.exit(1);
});
