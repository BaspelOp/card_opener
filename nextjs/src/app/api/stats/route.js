import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { statistic } = await request.json();

    const client = await pool.connect();
    let query = "";

    switch (statistic) {
      case "top-users":
        query = "SELECT * FROM top_10_users_with_most_cards";
        break;
      case "most-owned":
        query = "SELECT * FROM top_10_most_owned_cards";
        break;
      case "most-wanted":
        query = "SELECT * FROM top_10_most_wanted_cards";
        break;
      default:
        client.release();
        return NextResponse.json(
          { error: "Invalid statistic type" },
          { status: 400 }
        );
    }

    const result = await client.query(query);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error("Error getting stats:", err);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
