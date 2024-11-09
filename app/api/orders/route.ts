export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/cloudflare/auth";

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
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const token = headersList.get("cf-access-jwt-assertion");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getAuthUser(token);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");
    const search = searchParams.get("search");

    const ordersList = await ORDERS_KV.list({ prefix: "order_" });
    const orderPromises = ordersList.keys.map(key => 
      ORDERS_KV.get(key.name, { type: 'json' })
    );
    let orders = (await Promise.all(orderPromises)) as Order[];

    // Apply filters
    if (status && status !== "all") {
      orders = orders.filter(order => order.status === status);
    }

    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
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

      orders = orders.filter(order => 
        new Date(order.createdAt) >= startDate
      );
    }

    // Sort by createdAt desc
    orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(order => 
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 