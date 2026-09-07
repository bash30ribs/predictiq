import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, organization, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 400 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash('DefaultPassword123!', 10);

    // Insert new user record
    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, organization, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      name.trim(),
      normalizedEmail,
      passwordHash,
      organization?.trim() || 'Enterprise Org',
      role || 'VP of Customer Success'
    );

    const newUser = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: normalizedEmail,
      organization: organization?.trim() || 'Enterprise Org',
      role: role || 'VP of Customer Success',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      user: newUser,
      token: `jwt_sqlite_session_${Date.now()}`,
      message: 'Account successfully created and stored in database.',
    });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error during account creation.' },
      { status: 500 }
    );
  }
}
