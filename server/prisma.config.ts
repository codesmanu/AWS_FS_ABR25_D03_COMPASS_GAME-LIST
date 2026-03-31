import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const getUrl = (): string => {
    const url = process.env.DATABASE_URL;
    if (!url) console.warn("DATABASE_URL is not set");
    return url || 'file:./dev.db';
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: getUrl(),
    },
})