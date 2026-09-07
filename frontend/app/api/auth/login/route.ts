import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const db = getDb();
    const normalizedEmail = email.toLowerCase().trim();

    // Look up user in SQLite
    let user = db.prepare('SELECT id, name, email, password_hash, organization, role, created_at FROM users WHERE email = ?').get(normalizedEmail) as any;

    if (!user) {
      // Auto-provision for demo convenience if user doesn't exist
      const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      const hashedPw = await bcrypt.hash(password || 'Password123!', 10);
      const insert = db.prepare(`
        INSERT INTO users (name, email, password_hash, organization, role)
        VALUES (?, ?, ?, ?, ?)
      `);
      const res = insert.run(name, normalizedEmail, hashedPw, 'Enterprise Org', role || 'VP of Customer Success');
      user = {
        id: Number(res.lastInsertRowid),
        name,
        email: normalizedEmail,
        organization: 'Enterprise Org',
        role: role || 'VP of Customer Success',
        created_at: new Date().toISOString(),
      };
    } else if (password && user.password_hash) {
      // Verify password if provided and user has a bcrypt hash
      if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
        }
      }
    }

    const { password_hash, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
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
