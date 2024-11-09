import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    // Update order status in KV
    const order = await ORDERS_KV.get(params.id, { type: 'json' });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await ORDERS_KV.put(params.id, JSON.stringify({
      ...order,
      status,
      updatedAt: Date.now(),
      updatedBy: "admin", // In production, get this from the authenticated user
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}