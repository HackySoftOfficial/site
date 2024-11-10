"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import type { Order as DbOrder } from "@/lib/db";
import type { Order as UIOrder } from "@/components/admin/order-list";

interface Filters {
  status: string;
  dateRange: string;
  search: string;
}

export function useOrders(filters: Filters) {
  const [orders, setOrders] = useState<UIOrder[]>([]);
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
        const data: { orders: DbOrder[] } = await response.json();
        
        // Transform DB orders to UI orders
        const transformedOrders = data.orders.map((order): UIOrder => ({
          id: order.id,
          customer: {
            name: order.customer.name,
            email: order.customer.email,
          },
          product: {
            name: order.product.name,
            price: order.product.price,
          },
          status: order.status,
          createdAt: new Date(order.createdAt).toISOString(),
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