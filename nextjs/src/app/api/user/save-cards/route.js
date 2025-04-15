import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const databaseId = session.user.databaseId;
    const { cards } = await request.json();

    if (!cards.cards || cards.cards.length === 0) {
      return NextResponse.json({ error: "No cards provided" }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      for (const card of cards.cards) {
        await client.query("CALL add_owned_card($1, $2);", [
          databaseId,
          card.card_id
        ]);
      }
      return NextResponse.json(
        { message: "Cards saved successfully" },
        { status: 200 }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error saving cards:", err);
    return NextResponse.json(
      { error: "Failed to save cards" },
      { status: 500 }
    );
  }
}
