import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM packages');
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'No packs found' }, { status: 404 });
        }

        return NextResponse.json(result.rows, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}