import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('user_id');
    const scope = searchParams.get('scope');

    const db = getDb();
    let rows: any[] = [];

    if (userIdParam) {
      const userId = parseInt(userIdParam, 10);
      rows = db.prepare('SELECT * FROM customer_reviews WHERE user_id = ? ORDER BY id DESC').all(userId) as any[];
    } else if (scope === 'all') {
      rows = db.prepare('SELECT * FROM customer_reviews ORDER BY id DESC').all() as any[];
    } else {
      // Default to user 1 if not specified for backward compatibility
      rows = db.prepare('SELECT * FROM customer_reviews WHERE user_id = 1 ORDER BY id DESC').all() as any[];
    }

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
