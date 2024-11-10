/// <reference types="@cloudflare/workers-types" />

import type { Order } from './db/types';

export type { Order };

export const db = {
  orders: {
    async findFirst(id: string): Promise<Order | null> {
      const data = await ORDERS_KV.get(`order_${id}`);
      if (!data) return null;
      try {
        return JSON.parse(data) as Order;
      } catch {
        return null;
      }
    },

    async create(data: Order): Promise<Order> {
      const order = {
        ...data,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now()
      };
      
      await ORDERS_KV.put(`order_${order.id}`, JSON.stringify(order));
      
      // Store an index of pending orders if status is pending
      if (order.status === 'pending') {
        await ORDERS_KV.put(`pending:${order.id}`, '1');
      }
      
      return order;
    },

    async update(id: string, data: Partial<Order>): Promise<Order> {
      const existing = await this.findFirst(id);
      if (!existing) {
        throw new Error('Order not found');
      }

      const updated: Order = {
        ...existing,
        ...data,
        updatedAt: Date.now()
      };

      await ORDERS_KV.put(`order_${id}`, JSON.stringify(updated));

      // Update pending index if status changed from pending
      if (data.status && data.status !== 'pending' && existing.status === 'pending') {
        await ORDERS_KV.delete(`pending:${id}`);
      }

      return updated;
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
    },

    async list(): Promise<Order[]> {
      const { keys } = await ORDERS_KV.list({ prefix: 'order_' });
      const orders: Order[] = [];
      
      for (const key of keys) {
        const data = await ORDERS_KV.get(key.name);
        if (data) {
          try {
            orders.push(JSON.parse(data) as Order);
          } catch {
            console.error(`Failed to parse order data for key: ${key.name}`);
          }
        }
      }

      return orders;
    }
  }
}; 