CREATE TABLE `orders` (
  `id` text PRIMARY KEY NOT NULL,
  `product_id` text NOT NULL,
  `amount` real NOT NULL,
  `crypto_type` text NOT NULL,
  `crypto_address` text NOT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `email` text,
  `transaction_hash` text,
  `created_at` integer DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `idx_orders_status` ON `orders` (`status`);
CREATE INDEX `idx_orders_crypto_address` ON `orders` (`crypto_address`); 