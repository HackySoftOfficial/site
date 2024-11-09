"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
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
  createdAt: Date;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const snapshot = await getDocs(ordersQuery);
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        })) as Order[];

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.product.name}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {order.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {order.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}