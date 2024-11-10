"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import type { Order } from "@/lib/db";

interface Filters {
  status: string;
  dateRange: string;
  search: string;
}

export function useOrders(filters: Filters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          status: filters.status,
          dateRange: filters.dateRange,
          search: filters.search,
        });

        const response = await fetch(`/api/admin/orders?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        const data: { orders: any[] } = await response.json();
        const transformedOrders = data.orders.map((order: any): Order => ({
          id: order.id,
          productId: order.productId,
          amount: order.amount,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          customer: {
            name: order.customerName || order.contactValue || 'Unknown',
            email: order.customerEmail || order.contactValue || 'Unknown',
          },
          product: {
            name: order.productId,
            price: order.amount,
          },
          coinbaseChargeId: order.coinbaseChargeId,
          contactMethod: order.contactMethod,
          contactValue: order.contactValue,
          transactionHash: order.transactionHash,
          metadata: order.metadata,
        }));
        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [filters, user]);

  return { orders, isLoading };
}