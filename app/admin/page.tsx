import { OrdersOverview } from "@/components/admin/orders-overview";
import { StatsCards } from "@/components/admin/stats-cards";
import { RecentOrders } from "@/components/admin/recent-orders";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersOverview />
        <RecentOrders />
      </div>
    </div>
  );
}