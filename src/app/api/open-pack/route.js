import { NextResponse } from "next/server";

const cards = [
    { id: 1, name: "Fire Dragon", rarity: "common", chance: 0.5, holo: true },
    { id: 2, name: "Ice Phoenix", rarity: "rare", chance: 0.3, holo: false },
    { id: 3, name: "Thunder Wolf", rarity: "common", chance: 0.5, holo: false },
    { id: 4, name: "Golden Griffin", rarity: "legendary", chance: 0.1, holo: true },
    { id: 5, name: "Shadow Serpent", rarity: "rare", chance: 0.3, holo: false },
];

function getRandomCard(count) {
    return Array.from({length: count}, () => {
        let random = Math.random();
        let cumulative = 0;
        return cards.find(card => (cumulative += card.chance) > random);
    })
}

export async function POST(request) {
    const { userId, packId } = await request.json();

    if (!userId || !packId) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const openedCards = getRandomCard(3);

    // Save openedCards to the user database

    return NextResponse.json({
        cards: openedCards
    });
}