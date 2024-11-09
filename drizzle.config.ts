import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    dbName: 'orders-db',
  },
} satisfies Config;