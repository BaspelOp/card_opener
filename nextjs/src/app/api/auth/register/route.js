import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    await client.query("CALL register($1, $2, $3)", [
      username,
      JSON.stringify(email),
      password
    ]);
    client.release();

    return NextResponse.json(
      { message: "Registrace proběhla úspěšně!" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
