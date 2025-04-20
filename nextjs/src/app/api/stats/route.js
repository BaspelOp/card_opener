import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { statistic } = await request.json();

    let query = "";

    switch (statistic) {
      case "top-users":
        query = "SELECT * FROM top_10_users_with_most_cards;";
        break;
      case "most-owned":
        query = "SELECT * FROM top_10_most_owned_cards;";
        break;
      case "most-wanted":
        query = "SELECT * FROM top_10_most_wanted_cards;";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid statistic type" },
          { status: 400 }
        );
    }

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error getting stats:", err);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
