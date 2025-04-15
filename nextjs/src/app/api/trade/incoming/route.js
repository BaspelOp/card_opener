import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const databaseId = session.user.databaseId;
    const client = await pool.connect();

    const query = `
            SELECT
                t.id,
                t.uuid,
                u_from.username AS from_username,
            
                c_offered.id AS offered_card_id,
                c_offered.name AS offered_card_name,
                c_offered.image_path AS offered_card_image_path,
                cf_offered.image_path AS offered_frame_image_path,
                ci_offered.image_path AS offered_icon_image_path,
                cr_offered.name AS offered_rarity_name,
                cr_offered.id AS offered_rarity_id,
            
                c_wanted.id AS wanted_card_id,
                c_wanted.name AS wanted_card_name,
                c_wanted.image_path AS wanted_card_image_path,
                cf_wanted.image_path AS wanted_frame_image_path,
                ci_wanted.image_path AS wanted_icon_image_path,
                cr_wanted.name AS wanted_rarity_name,
                cr_wanted.id AS wanted_rarity_id
            
            FROM
                trades t
            JOIN users u_from ON t.from_user_id = u_from.id
            
            JOIN cards c_offered ON t.offered_card_id = c_offered.id
            JOIN card_frames cf_offered ON c_offered.frame_id = cf_offered.id
            JOIN card_icons ci_offered ON c_offered.icon_id = ci_offered.id
            JOIN card_rarities cr_offered ON c_offered.rarity_id = cr_offered.id
            
            JOIN cards c_wanted ON t.wanted_card_id = c_wanted.id
            JOIN card_frames cf_wanted ON c_wanted.frame_id = cf_wanted.id
            JOIN card_icons ci_wanted ON c_wanted.icon_id = ci_wanted.id
            JOIN card_rarities cr_wanted ON c_wanted.rarity_id = cr_wanted.id
            
            WHERE t.to_user_id = $1;
        `;

    const result = await client.query(query, [databaseId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "No trades found" }, { status: 404 });
    }

    const trades = result.rows.map((row) => ({
      id: row.id,
      uuid: row.uuid,
      from_username: row.from_username,
      offered_card: {
        id: row.offered_card_id,
        name: row.offered_card_name,
        image_path: row.offered_card_image_path,
        frame_image_path: row.offered_frame_image_path,
        icon_image_path: row.offered_icon_image_path,
        rarity_name: row.offered_rarity_name,
        rarity_id: row.offered_rarity_id
      },
      wanted_card: {
        id: row.wanted_card_id,
        name: row.wanted_card_name,
        image_path: row.wanted_card_image_path,
        frame_image_path: row.wanted_frame_image_path,
        icon_image_path: row.wanted_icon_image_path,
        rarity_name: row.wanted_rarity_name,
        rarity_id: row.wanted_rarity_id
      }
    }));

    return NextResponse.json(trades, { status: 200 });
  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}
