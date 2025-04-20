import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM packages;");

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No packs found" }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
