import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { offeredCard, requestedCard, toUserId } = await request.json();

    if (!offeredCard || !requestedCard || !toUserId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const databaseId = session.user.databaseId;

    const query = `
            INSERT INTO trades (
                from_user_id,
                to_user_id,
                offered_card_id,
                wanted_card_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;

    const result = await pool.query(query, [
      databaseId,
      toUserId,
      offeredCard,
      requestedCard
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Failed to create trade" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Trade created successfully",
      tradeId: result.rows[0].id
    });
  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 }
    );
  }
}
