import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { offerId } = await request.json();

    if (!offerId) {
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 }
      );
    }

    await pool.query("CALL accept_trade($1);", [offerId]);

    return NextResponse.json({ message: "Trade accepted successfully" });
  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json(
      { error: "Failed to accept trade" },
      { status: 500 }
    );
  }
}
