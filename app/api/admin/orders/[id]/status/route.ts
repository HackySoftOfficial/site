import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { status } = await request.json();

    // Update order status in Firestore
    await adminDb.collection("orders").doc(params.id).update({
      status,
      updatedAt: new Date(),
      updatedBy: decodedToken.uid
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}