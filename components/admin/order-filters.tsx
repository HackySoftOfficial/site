"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Filters {
  status: string;
  dateRange: string;
  search: string;
}

interface OrderFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search orders..."
        value={filters.search}
        onChange={(e) =>
          onFilterChange({ ...filters, search: e.target.value })
        }
        className="max-w-xs"
      />
      <Select
        value={filters.status}
        onValueChange={(value) =>
          onFilterChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.dateRange}
        onValueChange={(value) =>
          onFilterChange({ ...filters, dateRange: value })
        }
      >
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}