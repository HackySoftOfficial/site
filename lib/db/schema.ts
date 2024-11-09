import { sql } from "drizzle-orm";
import { 
  sqliteTable, 
  text, 
  real, 
  integer 
} from "drizzle-orm/sqlite-core";

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  amount: real('amount').notNull(),
  cryptoType: text('crypto_type').notNull(),
  cryptoAddress: text('crypto_address').notNull(),
  status: text('status').notNull().default('pending'),
  email: text('email'),
  transactionHash: text('transaction_hash'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: integer('created_at').notNull(),
});