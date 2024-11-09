"use client";

import { useState } from "react";
import { OrderList } from "@/components/admin/order-list";
import { OrderFilters } from "@/components/admin/order-filters";
import { useOrders } from "@/hooks/use-orders";

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });

  const { orders, isLoading } = useOrders(filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>
      <OrderFilters filters={filters} onFilterChange={setFilters} />
      <OrderList orders={orders} isLoading={isLoading} />
    </div>
  );
}