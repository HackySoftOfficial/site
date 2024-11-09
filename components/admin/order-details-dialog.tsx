"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail } from "lucide-react";
import { getFunctions, httpsCallable } from 'firebase/functions';

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
  createdAt: any; // This will be Timestamp from Firestore
}

interface OrderDetailsDialogProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsDialog({ order, onClose }: OrderDetailsDialogProps) {
  if (!order) return null;

  const functions = getFunctions();
  const updateOrderStatusFunction = httpsCallable(functions, 'updateOrderStatus');

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateOrderStatusFunction({
        orderId: order.id,
        status: newStatus
      });
      
      // Handle success (maybe refresh orders or show toast)
    } catch (error) {
      console.error("Error updating order status:", error);
      // Handle error
    }
  };

  const handleContactCustomer = async () => {
    // Implement customer contact functionality
    console.log("Contacting customer:", order.customer.email);
  };

  return (
    <Dialog open={!!order} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.email}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Status</h3>
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
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Product Details</h3>
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${order.product.price}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate("completed")}
                disabled={order.status === "completed"}
              >
                Mark as Completed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleContactCustomer}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Customer
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}