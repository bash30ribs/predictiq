import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'predictiq.db');

// Singleton database connection
let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initTables(db);
  }
  return db;
}

function initTables(database: Database.Database) {
  // 1. Users Table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      organization TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Customer Reviews & Sentiment Analysis Table
  database.exec(`
    CREATE TABLE IF NOT EXISTS customer_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT,
      customer_name TEXT,
      review_text TEXT NOT NULL,
      sentiment TEXT NOT NULL,
      sentiment_score REAL NOT NULL,
      churn_risk_delta REAL NOT NULL,
      adjusted_probability REAL NOT NULL,
      friction_keywords TEXT,
      recommended_playbook TEXT,
      source TEXT DEFAULT 'NPS Survey',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Pre-seed default executive user if not exists
  const existingUser = database.prepare('SELECT id FROM users WHERE email = ?').get('elena.rostova@predictiq.io');
  if (!existingUser) {
    const insertUser = database.prepare(`
      INSERT INTO users (name, email, password_hash, organization, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'Elena Rostova',
      'elena.rostova@predictiq.io',
      'mock-hashed-pw-secret-9843',
      'Apex Enterprise Telecom',
      'VP of Customer Success'
    );
  }

  // Pre-seed sample customer reviews if table is empty
  const reviewCount = database.prepare('SELECT COUNT(*) as count FROM customer_reviews').get() as { count: number };
  if (reviewCount.count === 0) {
    const insertReview = database.prepare(`
      INSERT INTO customer_reviews (customer_id, customer_name, review_text, sentiment, sentiment_score, churn_risk_delta, adjusted_probability, friction_keywords, recommended_playbook, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertReview.run(
      'C1024',
      'Apex Digital Labs',
      'We had 6 unresolved tickets this month regarding slow API response times. If this continues into our renewal next month, we are forced to migrate to an alternative provider.',
      'CRITICAL_FRICTION',
      -0.78,
      0.32,
      0.87,
      JSON.stringify(['unresolved tickets', 'slow API response', 'renewal', 'migrate to alternative']),
      'Initiate emergency Solutions Architect audit and offer 1-year contract lock with 15% SLA billing credit.',
      'Support Ticket'
    );

    insertReview.run(
      'C1002',
      'Starlight Media Group',
      'The software features are great, but the monthly price tier without annual discount feels unsustainable for our current budget.',
      'NEGATIVE',
      -0.45,
      0.18,
      0.72,
      JSON.stringify(['monthly price tier', 'unsustainable budget', 'annual discount']),
      'Propose 1-year commitment migrating account off month-to-month terms.',
      'Executive QBR'
    );

    insertReview.run(
      'C3005',
      'Meridian Global Advisors',
      'Our team is very satisfied with the platform stability and responsive support. We plan to double our seat count at annual renewal.',
      'POSITIVE',
      0.85,
      -0.22,
      0.14,
      JSON.stringify(['platform stability', 'responsive support', 'double seat count']),
      'Trigger Expansion Playbook for enterprise tier upsell.',
      'NPS Survey'
    );
  }
}
