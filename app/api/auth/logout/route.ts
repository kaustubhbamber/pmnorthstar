import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearTokenCookie();
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}