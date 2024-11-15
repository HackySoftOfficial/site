/// <reference types="@cloudflare/workers-types" />

import type { Order } from './types';

export type { Order };

// In-memory storage
const ordersStore = new Map<string, Order>();
const pendingOrdersIndex = new Set<string>();

export const db = {
  orders: {
    async create(order: Order) {
      ordersStore.set(order.id, order);
      // Store an index of pending orders for efficient querying
      if (order.status === 'pending') {
        pendingOrdersIndex.add(order.id);
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

      ordersStore.set(id, updated);

      // Update pending index if status changed
      if (data.status && data.status !== 'pending' && existing.status === 'pending') {
        pendingOrdersIndex.delete(id);
      }

      return updated;
    },

    async findFirst(id: string): Promise<Order | null> {
      return ordersStore.get(id) || null;
    },

    async findPending(): Promise<Order[]> {
      return Array.from(pendingOrdersIndex)
        .map(id => ordersStore.get(id))
        .filter((order): order is Order => order !== undefined);
    }
  }
};