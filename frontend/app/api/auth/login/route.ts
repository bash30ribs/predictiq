import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const db = getDb();
    const normalizedEmail = email.toLowerCase().trim();

    // Look up user in SQLite
    let user = db.prepare('SELECT id, name, email, organization, role, created_at FROM users WHERE email = ?').get(normalizedEmail) as any;

    if (!user) {
      // If user is logging in with a new email in demo mode, auto-provision
      const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      const insert = db.prepare(`
        INSERT INTO users (name, email, password_hash, organization, role)
        VALUES (?, ?, ?, ?, ?)
      `);
      const res = insert.run(name, normalizedEmail, 'mock_hash', 'Enterprise Org', role || 'VP of Customer Success');
      user = {
        id: Number(res.lastInsertRowid),
        name,
        email: normalizedEmail,
        organization: 'Enterprise Org',
        role: role || 'VP of Customer Success',
        created_at: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      user,
      token: `jwt_sqlite_session_${Date.now()}`,
      message: 'Successfully authenticated.',
    });
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error during sign in.' },
      { status: 500 }
    );
  }
}
