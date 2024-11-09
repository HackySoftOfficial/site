import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const headersList = headers();
    const authToken = headersList.get("authorization")?.split("Bearer ")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(authToken);
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    if (!userRecord.customClaims?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");
    const search = searchParams.get("search");

    // Build Firestore query
    let query = adminDb.collection("orders");

    if (status && status !== "all") {
      query = query.where("status", "==", status);
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

      query = query.where("createdAt", ">=", startDate);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    
    let orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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