import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_) {
    try {
        const client = await pool.connect();

        const query = `
            SELECT
                collections.id AS collection_id,
                collections.uuid AS collection_uuid,
                collections.name AS collection_name,
            
                cards.id AS card_id,
                cards.uuid AS card_uuid,
                cards.name AS card_name,
                cards.image_path AS card_image_path,
            
                card_rarities.id AS rarity_id,
                card_rarities.name AS rarity_name,
                card_rarities.chance AS rarity_chance,
                card_rarities.image_path AS rarity_image_path,
            
                card_frames.id AS frame_id,
                card_frames.name AS frame_name,
                card_frames.image_path AS frame_image_path,
            
                card_icons.id AS icon_id,
                card_icons.name AS icon_name,
                card_icons.image_path AS icon_image_path
            
            FROM collections
            LEFT JOIN cards ON cards.collection_id = collections.id
            LEFT JOIN card_rarities ON cards.rarity_id = card_rarities.id
            LEFT JOIN card_frames ON cards.frame_id = card_frames.id
            LEFT JOIN card_icons ON cards.icon_id = card_icons.id
            
            ORDER BY collections.id, cards.id;
        `
        const result = await client.query(query);
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'No collections found' }, { status: 404 });
        }

        const collections = {};

        result.rows.forEach(row => {
            const { collection_id, collection_name, card_id, card_name, card_image_path, rarity_id, rarity_name, rarity_chance, rarity_image_path, frame_id, frame_name, frame_image_path, icon_id, icon_name, icon_image_path } = row;

            if (!collections[collection_id]) {
                collections[collection_id] = {
                    id: collection_id,
                    uuid: row.collection_uuid,
                    name: collection_name,
                    cards: []
                };
            }

            if (card_id) {
                collections[collection_id].cards.push({
                    id: card_id,
                    uuid: row.card_uuid,
                    name: card_name,
                    image_path: card_image_path,
                    rarity: {
                        id: rarity_id,
                        name: rarity_name,
                        chance: rarity_chance,
                        image_path: rarity_image_path
                    },
                    frame: {
                        id: frame_id,
                        name: frame_name,
                        image_path: frame_image_path
                    },
                    icon: {
                        id: icon_id,
                        name: icon_name,
                        image_path: icon_image_path
                    }
                });
            }
        });

        return NextResponse.json({collections: Object.values(collections), message: 'Kolekce úspěšně načteny!'}, { status: 200 });
    } catch (err) {
        console.error('Error in API:', err);
        return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }
}