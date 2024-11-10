import { NextResponse } from "next/server";
import { db, Order } from "@/lib/db";

interface UpdateStatusRequest {
  status: Order['status'];
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json() as UpdateStatusRequest;

    // Use db utility to update order
    const order = await db.orders.findFirst(params.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order
    const updatedOrder = await db.orders.update(params.id, {
      status,
      updatedAt: Date.now(),
      updatedBy: "admin", // In production, get this from the authenticated user
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}