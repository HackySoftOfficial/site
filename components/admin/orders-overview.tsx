"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const CustomXAxis = ({ stroke = "#888888", fontSize = 12, ...props }) => (
  <XAxis
    stroke={stroke}
    fontSize={fontSize}
    tickLine={false}
    axisLine={false}
    {...props}
  />
);

const CustomYAxis = ({ stroke = "#888888", fontSize = 12, ...props }) => (
  <YAxis
    stroke={stroke}
    fontSize={fontSize}
    tickLine={false}
    axisLine={false}
    tickFormatter={(value) => `$${value}`}
    {...props}
  />
);

export function OrdersOverview() {
  const [data, setData] = useState<Array<{ name: string; total: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

        const ordersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", Timestamp.fromDate(sixMonthsAgo))
        );

        const snapshot = await getDocs(ordersQuery);
        const orders = snapshot.docs.map(doc => ({
          amount: doc.data().amount,
          createdAt: doc.data().createdAt.toDate()
        }));

        // Group orders by month
        const monthlyData = orders.reduce((acc, order) => {
          const month = order.createdAt.toLocaleString('default', { month: 'short' });
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month] += order.amount;
          return acc;
        }, {} as Record<string, number>);

        // Convert to array format for chart
        const chartData = Object.entries(monthlyData).map(([name, total]) => ({
          name,
          total: Math.round(total)
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders Overview</CardTitle>
          <CardDescription>Monthly order statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] animate-pulse bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Overview</CardTitle>
        <CardDescription>Monthly order statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CustomXAxis dataKey="name" />
              <CustomYAxis />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}