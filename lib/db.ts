/// <reference types="@cloudflare/workers-types" />

import type { Order } from './db/types';

export type { Order };

// In-memory storage for development
const orders = new Map<string, Order>();

export const db = {
  orders: {
    async findFirst(id: string): Promise<Order | null> {
      return orders.get(id) || null;
    },

    async create(data: Order): Promise<Order> {
      const order = {
        ...data,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now()
      };
      
      orders.set(order.id, order);
      return order;
    },

    async update(id: string, data: Partial<Order>): Promise<Order> {
      const existing = orders.get(id);
      if (!existing) {
        throw new Error('Order not found');
      }

      const updated: Order = {
        ...existing,
        ...data,
        updatedAt: Date.now()
      };

      orders.set(id, updated);
      return updated;
    },

    async findPending(): Promise<Order[]> {
      return Array.from(orders.values()).filter(order => order.status === 'pending');
    },

    async list(): Promise<Order[]> {
      return Array.from(orders.values());
    }
  }
}; 