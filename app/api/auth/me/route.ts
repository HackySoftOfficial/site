export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuthUser } from "@/lib/cloudflare/auth";

export async function GET() {
  try {
    const headersList = headers();
    const token = headersList.get("cf-access-jwt-assertion");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = getAuthUser(token);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 