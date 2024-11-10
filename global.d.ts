interface KVNamespace {
  get(key: string, options?: { type: string }): Promise<any>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}

declare global {
  const ORDERS_KV: KVNamespace;
} 