import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@/auth";

export async function GET(_) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const databaseId = session.user.databaseId;
    const client = await pool.connect();

    const query = `
        SELECT
            c.name AS card_name,
            c.id AS card_id,
            oc.quantity AS card_quantity,
            c.image_path AS card_image_path,
            col.name AS collection_name,
            col.id AS collection_id,
            cf.image_path AS frame_image_path,
            ci.image_path AS icon_image_path,
            cr.name AS rarity_name,
            cr.id AS rarity_id
        FROM
            owned_cards oc
        JOIN
            cards c ON oc.card_id = c.id
        JOIN
            collections col ON c.collection_id = col.id
        JOIN
            card_frames cf ON c.frame_id = cf.id
        JOIN
            card_icons ci ON c.icon_id = ci.id
        JOIN
            card_rarities cr ON c.rarity_id = cr.id
        WHERE
            oc.user_id = $1
        ORDER BY
            col.name;
    `;

    const result = await client.query(query, [databaseId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No cards found" }, { status: 404 });
    }

    const cards = result.rows.map((row) => ({
      card_name: row.card_name,
      card_image_path: row.card_image_path,
      collection_name: row.collection_name,
      collection_id: row.collection_id,
      frame_image_path: row.frame_image_path,
      icon_image_path: row.icon_image_path,
      rarity_name: row.rarity_name,
      rarity_id: row.rarity_id,
      card_quantity: row.card_quantity,
      card_id: row.card_id
    }));

    return NextResponse.json(cards, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
