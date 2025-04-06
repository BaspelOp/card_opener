import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  const { userId, packId } = await request.json();

  console.log("User ID:", userId, "Pack ID:", packId);

  try {
    if (!userId || !packId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      'SELECT get_random_cards_from_package($1) AS result',
      [packId]
    );

    const cardIds = result.rows[0]?.result;

    console.log("Random card IDs:", cardIds);

    if (!cardIds || cardIds.length === 0) {
      return NextResponse.json({ error: "No cards found" }, { status: 404 });
    }

    const cardDetailsQuery = `
      SELECT 
        cards.id AS card_id,
        cards.name AS card_name,
        cards.image_path AS card_image,
        collections.name AS collection_name,
        card_rarities.name AS rarity_name,
        card_rarities.chance AS rarity_chance,
        card_frames.name AS frame_name,
        card_frames.image_path AS frame_image,
        card_icons.name AS icon_name,
        card_icons.image_path AS icon_image
      FROM cards
      JOIN collections ON cards.collection_id = collections.id
      JOIN card_rarities ON cards.rarity_id = card_rarities.id
      JOIN card_frames ON cards.frame_id = card_frames.id
      JOIN card_icons ON cards.icon_id = card_icons.id
      WHERE cards.id = ANY ($1);
    `;
    const cardDetailsResult = await client.query(cardDetailsQuery, [cardIds]);

    const detailedCardsMap = new Map();
    for (const row of cardDetailsResult.rows) {
      detailedCardsMap.set(row.card_id, row);
    }

    const detailedCards = cardIds.map((id) => detailedCardsMap.get(id));

    client.release();

    console.log("Detailed Cards:", detailedCards);

    return NextResponse.json({ cards: detailedCards }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
