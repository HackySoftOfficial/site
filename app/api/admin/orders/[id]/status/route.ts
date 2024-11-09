import { NextResponse } from "next/server";
import { createDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const db = createDb(process.env.DB as unknown as D1Database);

    await db
      .update(orders)
      .set({
        status,
        updatedAt: Date.now(),
        updatedBy: "admin", // In production, get this from the authenticated user
      })
      .where(eq(orders.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}