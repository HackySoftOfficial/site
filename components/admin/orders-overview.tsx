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

// Add type for the API response
interface OrdersResponse {
  orders: Array<{
    createdAt: string;
    // Add other order properties as needed
  }>;
}

export function OrdersOverview() {
  const [data, setData] = useState<Array<{ name: string; total: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const response = await fetch('/api/admin/orders/overview');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json() as OrdersResponse;
        const orders = data.orders;

        // Group orders by month
        const monthlyData = orders.reduce((acc: Record<string, number>, order: any) => {
          const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month] += order.amount;
          return acc;
        }, {});

        // Convert to array format for chart
        const chartData = Object.entries(monthlyData).map(([name, total]) => ({
          name,
          total: Math.round(total as number)
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