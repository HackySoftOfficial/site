interface KVNamespace {
  get(key: string, options?: { type: 'json' }): Promise<any>;
  put(key: string, value: string | ArrayBuffer): Promise<void>;
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
  delete(key: string): Promise<void>;
}

declare global {
  var ORDERS_KV: KVNamespace;
} 