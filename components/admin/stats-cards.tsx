"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface Stats {
  revenue: number;
  clients: number;
  projects: number;
  revenueChange: number;
  clientsChange: number;
  projectsChange: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    revenue: 0,
    clients: 0,
    projects: 0,
    revenueChange: 0,
    clientsChange: 0,
    projectsChange: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Current period orders
        const currentOrdersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo))
        );
        const currentOrdersSnap = await getDocs(currentOrdersQuery);
        
        // Previous period orders
        const previousOrdersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", Timestamp.fromDate(sixtyDaysAgo)),
          where("createdAt", "<", Timestamp.fromDate(thirtyDaysAgo))
        );
        const previousOrdersSnap = await getDocs(previousOrdersQuery);

        // Calculate current period stats
        const currentRevenue = currentOrdersSnap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
        const currentClients = new Set(currentOrdersSnap.docs.map(doc => doc.data().customer.email)).size;
        const currentProjects = currentOrdersSnap.docs.length;

        // Calculate previous period stats
        const previousRevenue = previousOrdersSnap.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
        const previousClients = new Set(previousOrdersSnap.docs.map(doc => doc.data().customer.email)).size;
        const previousProjects = previousOrdersSnap.docs.length;

        // Calculate percentage changes
        const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
        const clientsChange = previousClients ? ((currentClients - previousClients) / previousClients) * 100 : 0;
        const projectsChange = previousProjects ? ((currentProjects - previousProjects) / previousProjects) * 100 : 0;

        setStats({
          revenue: currentRevenue,
          clients: currentClients,
          projects: currentProjects,
          revenueChange,
          clientsChange,
          projectsChange
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: stats.revenueChange.toFixed(1) + "%",
      trend: stats.revenueChange >= 0 ? "up" : "down",
    },
    {
      title: "Active Clients",
      value: stats.clients.toString(),
      icon: Users,
      change: stats.clientsChange.toFixed(1) + "%",
      trend: stats.clientsChange >= 0 ? "up" : "down",
    },
    {
      title: "Total Projects",
      value: stats.projects.toString(),
      icon: Package,
      change: stats.projectsChange.toFixed(1) + "%",
      trend: stats.projectsChange >= 0 ? "up" : "down",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-7 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsConfig.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className={`flex items-center text-sm ${
              stat.trend === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}