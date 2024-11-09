declare global {
  const ORDERS_KV: KVNamespace;
}

export interface Order {
  id: string;
  productId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  coinbaseChargeId?: string;
  contactMethod?: string;
  contactValue?: string;
  transactionHash?: string;
  createdAt: number;
  updatedAt: number;
}

export const db = {
  orders: {
    async create(order: Order) {
      await ORDERS_KV.put(order.id, JSON.stringify(order));
      // Store an index of pending orders for efficient querying
      if (order.status === 'pending') {
        const pendingKey = `pending:${order.id}`;
        await ORDERS_KV.put(pendingKey, '1');
      }
      return order;
    },

    async update(id: string, data: Partial<Order>) {
      const existing = await this.findFirst(id);
      if (!existing) throw new Error('Order not found');

      const updated: Order = {
        ...existing,
        ...data,
        updatedAt: Date.now()
      };

      await ORDERS_KV.put(id, JSON.stringify(updated));

      // Update pending index if status changed
      if (data.status && data.status !== 'pending' && existing.status === 'pending') {
        await ORDERS_KV.delete(`pending:${id}`);
      }

      return updated;
    },

    async findFirst(id: string): Promise<Order | null> {
      const data = await ORDERS_KV.get(id);
      return data ? JSON.parse(data) : null;
    },

    async findPending(): Promise<Order[]> {
      const { keys } = await ORDERS_KV.list({ prefix: 'pending:' });
      const orders: Order[] = [];
      
      for (const key of keys) {
        const orderId = key.name.replace('pending:', '');
        const order = await this.findFirst(orderId);
        if (order) orders.push(order);
      }

      return orders;
    }
  }
};