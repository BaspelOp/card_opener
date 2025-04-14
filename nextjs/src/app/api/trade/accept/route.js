import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

export async function POST(request) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { offerId } = await request.json();
        const client = await pool.connect();

        if (!offerId) {
            return NextResponse.json({ error: 'Trade ID is required' }, { status: 400 });
        }

        await client.query("CALL accept_trade($1)", [offerId]);
        client.release();

        return NextResponse.json({ message: 'Trade accepted successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error in API:', err);
        return NextResponse.json({ error: 'Failed to accept trade' }, { status: 500 });
    }
}