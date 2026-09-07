import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM customer_reviews ORDER BY id DESC').all() as any[];

    const reviews = rows.map((r) => ({
      ...r,
      friction_keywords: typeof r.friction_keywords === 'string'
        ? JSON.parse(r.friction_keywords)
        : r.friction_keywords,
    }));

    return NextResponse.json({ reviews, total: reviews.length });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
