"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

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
  createdAt: Timestamp;
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
        let q = collection(db, "orders");

        // Build query based on filters
        if (filters.status && filters.status !== "all") {
          q = query(q, where("status", "==", filters.status));
        }

        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date();
          let startDate = new Date();

          switch (filters.dateRange) {
            case "today":
              startDate.setHours(0, 0, 0, 0);
              break;
            case "week":
              startDate.setDate(now.getDate() - 7);
              break;
            case "month":
              startDate.setMonth(now.getMonth() - 1);
              break;
          }

          q = query(q, where("createdAt", ">=", Timestamp.fromDate(startDate)));
        }

        q = query(q, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);
        let fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));

        // Apply search filter if provided
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          fetchedOrders = fetchedOrders.filter(order => 
            order.customer.name.toLowerCase().includes(searchLower) ||
            order.customer.email.toLowerCase().includes(searchLower) ||
            order.id.toLowerCase().includes(searchLower)
          );
        }

        setOrders(fetchedOrders);
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