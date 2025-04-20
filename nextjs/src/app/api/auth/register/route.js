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

    const emailJson = JSON.stringify({
      local: email.split("@")[0],
      domain: email.split("@")[1]
    })

    await pool.query("CALL register($1, $2, $3);", [
      username,
      emailJson,
      password
    ]);

    return NextResponse.json(
      { message: "Registrace proběhla úspěšně!" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
