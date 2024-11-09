"use client";

import { useState, useEffect } from "react";
import { auth } from '@/lib/firebase/client';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    price: number;
  };
  status: "pending" | "completed" | "failed";
  createdAt: any;
}

interface Filters {
  status: string;
  dateRange: string;
  search: string;
}

export function useOrders(filters: Filters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) throw new Error('No auth token');

        const queryParams = new URLSearchParams({
          status: filters.status,
          dateRange: filters.dateRange,
          search: filters.search
        });

        const response = await fetch(`/api/orders?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  return { orders, isLoading };
}