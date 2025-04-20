import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = `
            SELECT
                u.id AS user_id,
                u.username AS user_name,
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
                users u
            JOIN
                owned_cards oc ON u.id = oc.user_id
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
            ORDER BY
                u.username, col.name;
        `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    const users = result.rows.map((row) => ({
      user_id: row.user_id,
      user_name: row.user_name,
      card_name: row.card_name,
      card_quantity: row.card_quantity,
      card_image_path: row.card_image_path,
      collection_name: row.collection_name,
      collection_id: row.collection_id,
      frame_image_path: row.frame_image_path,
      icon_image_path: row.icon_image_path,
      rarity_name: row.rarity_name,
      rarity_id: row.rarity_id,
      card_id: row.card_id
    }));

    const usersMap = new Map();
    users.forEach((user) => {
      if (!usersMap.has(user.user_id)) {
        usersMap.set(user.user_id, {
          user_name: user.user_name,
          cards: []
        });
      }
      usersMap.get(user.user_id).cards.push({
        card_id: user.card_id,
        card_name: user.card_name,
        card_quantity: user.card_quantity,
        card_image_path: user.card_image_path,
        collection_name: user.collection_name,
        collection_id: user.collection_id,
        frame_image_path: user.frame_image_path,
        icon_image_path: user.icon_image_path,
        rarity_name: user.rarity_name,
        rarity_id: user.rarity_id
      });
    });

    const formattedUsers = Array.from(usersMap.entries()).map(
      ([user_id, user]) => ({
        user_id,
        user_name: user.user_name,
        cards: user.cards
      })
    );
    return NextResponse.json({ users: formattedUsers });
  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
